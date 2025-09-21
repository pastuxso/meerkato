import { db } from '@meerkato/database'
import { Card, CardContent, CardHeader, CardTitle, formatCurrency } from '@meerkato/ui'
import {
  ShoppingCart,
  TrendingUp,
  Package,
  Users,
  Truck,
  AlertTriangle,
  DollarSign,
  BarChart3
} from 'lucide-react'

async function getDashboardData() {
  const [
    todaySales,
    totalProducts,
    lowStockProducts,
    activeOrders,
    recentSales,
    topProducts
  ] = await Promise.all([
    // Today's sales
    db.sale.aggregate({
      _sum: { total: true },
      _count: true,
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    // Total products
    db.product.count({
      where: { deletedAt: null },
    }),
    // Low stock products
    db.product.count({
      where: {
        deletedAt: null,
        currentStock: { lte: 5 },
      },
    }),
    // Active orders
    db.order.count({
      where: {
        status: { in: ['RECEIVED', 'PREPARING', 'ON_WAY'] },
      },
    }),
    // Recent sales
    db.sale.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        items: {
          include: {
            product: { select: { name: true } },
          },
        },
      },
    }),
    // Top selling products
    db.saleItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, total: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }).then(async (items) => {
      const productIds = items.map(item => item.productId)
      const products = await db.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true },
      })
      return items.map(item => ({
        ...item,
        product: products.find(p => p.id === item.productId),
      }))
    }),
  ])

  return {
    todaySales,
    totalProducts,
    lowStockProducts,
    activeOrders,
    recentSales,
    topProducts,
  }
}

export default async function POSDashboard() {
  const {
    todaySales,
    totalProducts,
    lowStockProducts,
    activeOrders,
    recentSales,
    topProducts,
  } = await getDashboardData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">🏪 Meerkato POS</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/ventas" className="text-gray-900 hover:text-primary">Ventas</a>
              <a href="/productos" className="text-gray-900 hover:text-primary">Productos</a>
              <a href="/inventario" className="text-gray-900 hover:text-primary">Inventario</a>
              <a href="/pedidos" className="text-gray-900 hover:text-primary">Pedidos</a>
              <a href="/domicilios" className="text-gray-900 hover:text-primary">Domicilios</a>
              <a href="/reportes" className="text-gray-900 hover:text-primary">Reportes</a>
            </nav>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin User</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Resumen general de las operaciones del minimarket
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(Number(todaySales._sum.total || 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                {todaySales._count} transacciones
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Total en catálogo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{lowStockProducts}</div>
              <p className="text-xs text-muted-foreground">
                Requieren reposición
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Activos</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOrders}</div>
              <p className="text-xs text-muted-foreground">
                En proceso
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Sales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Ventas Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">Ticket {sale.ticketNumber}</p>
                      <p className="text-sm text-gray-600">
                        {sale.user.name} • {sale.items.length} productos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(Number(sale.total))}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(sale.createdAt).toLocaleTimeString('es-CO', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Productos Más Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((item, index) => (
                  <div key={item.productId} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 w-6">
                        #{index + 1}
                      </span>
                      <div className="ml-3">
                        <p className="font-medium">{item.product?.name}</p>
                        <p className="text-sm text-gray-600">
                          {item._sum.quantity} unidades
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {formatCurrency(Number(item._sum.total || 0))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              🤖 Insights Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">📈 Tendencia de Ventas</h4>
                <p className="text-sm text-blue-700">
                  Las ventas han aumentado 15% esta semana. Los productos de mayor demanda son bebidas y snacks.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">💡 Recomendación</h4>
                <p className="text-sm text-green-700">
                  Considera aumentar el stock de Coca-Cola 350ml. Predicción de alta demanda para mañana.
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Alerta</h4>
                <p className="text-sm text-yellow-700">
                  5 productos requieren reposición urgente. Revisa el inventario de panadería.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}