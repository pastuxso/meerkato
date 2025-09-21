import { db } from '@meerkato/database'
import { Button, Card, CardContent, CardHeader, CardTitle, formatCurrency } from '@meerkato/ui'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

export const metadata = {
  title: 'Productos',
  description: 'Encuentra todos nuestros productos frescos y de calidad.',
}

async function getProducts() {
  return await db.product.findMany({
    where: {
      deletedAt: null,
      currentStock: { gt: 0 },
    },
    include: {
      category: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Todos los productos</h1>
          <p className="text-gray-600 mt-2">
            Descubre nuestra amplia selección de productos frescos y de calidad.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center">
                <span className="text-6xl">📦</span>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{product.category.name}</p>
                {product.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(Number(product.salePrice))}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/productos/${product.slug}`}>Ver</Link>
                    </Button>
                    <Button size="sm">
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-gray-500">
                    Stock: {product.currentStock} {product.unitOfMeasure}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay productos disponibles en este momento.</p>
            <Button className="mt-4" asChild>
              <Link href="/">Volver al inicio</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}