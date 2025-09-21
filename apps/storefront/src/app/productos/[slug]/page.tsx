import { db } from '@meerkato/database'
import { Button, Card, CardContent, formatCurrency } from '@meerkato/ui'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface ProductPageProps {
  params: {
    slug: string
  }
}

async function getProduct(slug: string) {
  const product = await db.product.findUnique({
    where: {
      slug,
      deletedAt: null,
    },
    include: {
      category: true,
      barcodes: true,
    },
  })

  if (!product) {
    notFound()
  }

  return product
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  return await db.product.findMany({
    where: {
      categoryId,
      id: { not: currentProductId },
      deletedAt: null,
      currentStock: { gt: 0 },
    },
    include: {
      category: true,
    },
    take: 4,
  })
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'product',
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)
  const relatedProducts = await getRelatedProducts(product.categoryId, product.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/productos">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a productos
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-9xl">📦</span>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <Link
                href={`/categoria/${product.category.slug}`}
                className="text-primary hover:underline"
              >
                {product.category.name}
              </Link>
            </div>

            {product.description && (
              <p className="text-gray-600 text-lg">{product.description}</p>
            )}

            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">
                {formatCurrency(Number(product.salePrice))}
              </div>
              <div className="text-sm text-gray-500">
                Precio por {product.unitOfMeasure}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Stock disponible:</span> {product.currentStock} {product.unitOfMeasure}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">SKU:</span> {product.sku}
              </div>
              {product.productType === 'CONSIGNMENT' && (
                <div className="text-sm text-blue-600">
                  <span className="font-medium">🤝 Producto en consignación</span>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Agregar al carrito
              </Button>
              <Button size="lg" variant="outline">
                Comprar ahora
              </Button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">🚚 Información de entrega</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Entrega en menos de 2 horas</li>
                <li>• Domicilio gratis en compras mayores a $30.000</li>
                <li>• Pago contra entrega disponible</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center">
                    <span className="text-6xl">📦</span>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(Number(relatedProduct.salePrice))}
                      </span>
                      <Button size="sm" asChild>
                        <Link href={`/productos/${relatedProduct.slug}`}>Ver</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}