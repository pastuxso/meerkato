import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@meerkato/database'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        deviceToken: { label: 'Device Token', type: 'text', optional: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email as string,
            deletedAt: null,
            active: true,
          },
          include: {
            customerProfile: true,
            supplierProfile: true,
            deliveryProfile: true,
          },
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        // Check device token requirement for certain roles
        if (user.requiresDevice && (user.role === 'CASHIER' || user.role === 'SUPERVISOR')) {
          if (!credentials.deviceToken) {
            throw new Error('DEVICE_TOKEN_REQUIRED')
          }

          const deviceToken = await db.deviceToken.findFirst({
            where: {
              token: credentials.deviceToken as string,
              active: true,
            },
          })

          if (!deviceToken) {
            throw new Error('INVALID_DEVICE_TOKEN')
          }

          // Update last seen
          await db.deviceToken.update({
            where: { id: deviceToken.id },
            data: { lastSeen: new Date() },
          })
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          requiresDevice: user.requiresDevice,
          customerProfile: user.customerProfile,
          supplierProfile: user.supplierProfile,
          deliveryProfile: user.deliveryProfile,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.requiresDevice = user.requiresDevice
        token.profiles = {
          customer: user.customerProfile,
          supplier: user.supplierProfile,
          delivery: user.deliveryProfile,
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.requiresDevice = token.requiresDevice as boolean
        session.user.profiles = token.profiles as any
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
})

export { auth as middleware } from 'next-auth/middleware'

// Device token validation
export async function validateDeviceToken(token: string): Promise<boolean> {
  try {
    const deviceToken = await db.deviceToken.findFirst({
      where: {
        token,
        active: true,
      },
    })

    if (!deviceToken) {
      return false
    }

    // Update last seen
    await db.deviceToken.update({
      where: { id: deviceToken.id },
      data: { lastSeen: new Date() },
    })

    return true
  } catch (error) {
    console.error('Error validating device token:', error)
    return false
  }
}

// Helper to check user permissions
export function hasPermission(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole)
}

// Role hierarchy
export const ROLE_HIERARCHY = {
  ADMIN: 100,
  MANAGER: 80,
  SUPERVISOR: 60,
  CASHIER: 40,
  DELIVERY: 30,
  SUPPLIER: 20,
  CUSTOMER: 10,
} as const

export function hasRoleLevel(userRole: string, minLevel: number): boolean {
  const userLevel = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 0
  return userLevel >= minLevel
}