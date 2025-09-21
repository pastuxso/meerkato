import { db } from '@meerkato/database'
import { Button, Card, CardContent, CardHeader, CardTitle, formatCurrency } from '@meerkato/ui'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Truck, Clock, Star } from 'lucide-react'

async function getHomePageData() {
  const [featuredProducts, categories] = await Promise.all([
    db.product.findMany({
      where: {
        deletedAt: null,
        currentStock: { gt: 0 },
      },
      include: {
        category: true,
        saleItems: {
          select: { quantity: true },
          where: {
            sale: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              },
            },
          },
        },
      },
      orderBy: {
        saleItems: {
          _count: 'desc',
        },
      },
      take: 8,
    }),
    db.category.findMany({
      where: { deletedAt: null },
      orderBy: { displayOrder: 'asc' },
      take: 6,
    }),
  ])

  return { featuredProducts, categories }
}

export default async function HomePage() {
  const { featuredProducts, categories } = await getHomePageData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">🏪 Meerkato</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/productos" className="text-gray-900 hover:text-primary">
                Productos
              </Link>
              <Link href="/categorias" className="text-gray-900 hover:text-primary">
                Categorías
              </Link>
              <Link href="/contacto" className="text-gray-900 hover:text-primary">
                Contacto
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild>
                <Link href="/carrito">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Carrito
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Tu minimarket de confianza
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Compra en línea y recibe en casa. Productos frescos, precios justos.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/productos">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Comprar ahora
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link href="/nosotros">
                Conoce más
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Entrega rápida</h3>
              <p className="text-gray-600">Domicilios en menos de 2 horas</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Abierto 24/7</h3>
              <p className="text-gray-600">Compra cuando quieras</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Calidad garantizada</h3>
              <p className="text-gray-600">Productos frescos y de calidad</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Categorías populares</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/categoria/${category.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">📦</div>
                    <h3 className="font-semibold">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Productos destacados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/productos/${product.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center">
                    <span className="text-6xl">📦</span>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{product.category.name}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(Number(product.salePrice))}
                      </span>
                      <Button size="sm">
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/productos">Ver todos los productos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">🏪 Meerkato</h3>
              <p className="text-gray-400">
                Tu minimarket de confianza en Bogotá. Productos frescos y entrega rápida.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Productos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/categoria/bebidas" className="hover:text-white">Bebidas</Link></li>
                <li><Link href="/categoria/snacks" className="hover:text-white">Snacks</Link></li>
                <li><Link href="/categoria/lacteos" className="hover:text-white">Lácteos</Link></li>
                <li><Link href="/categoria/panaderia" className="hover:text-white">Panadería</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/domicilios" className="hover:text-white">Domicilios</Link></li>
                <li><Link href="/fidelizacion" className="hover:text-white">Programa de fidelidad</Link></li>
                <li><Link href="/promociones" className="hover:text-white">Promociones</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📍 Calle 123 #45-67, Bogotá</li>
                <li>📞 (01) 234-5678</li>
                <li>📧 info@meerkato.co</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Minimarket Meerkato. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}