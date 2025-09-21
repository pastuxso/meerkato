import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      requiresDevice: boolean
      profiles: {
        customer?: any
        supplier?: any
        delivery?: any
      }
    } & DefaultSession['user']
  }

  interface User {
    role: string
    requiresDevice: boolean
    customerProfile?: any
    supplierProfile?: any
    deliveryProfile?: any
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    requiresDevice: boolean
    profiles: {
      customer?: any
      supplier?: any
      delivery?: any
    }
  }
}