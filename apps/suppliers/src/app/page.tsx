import { db } from '@meerkato/database'
import { Card, CardContent, CardHeader, CardTitle, formatCurrency } from '@meerkato/ui'
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  DollarSign
} from 'lucide-react'

async function getSupplierDashboardData() {
  // In a real app, this would be filtered by the logged-in supplier
  const supplierId = '1' // Mock supplier ID

  const [
    catalogProducts,
    pendingOrders,
    completedOrders,
    recentOrders,
    salesStats
  ] = await Promise.all([
    // Catalog products count
    db.supplierCatalog.count({
      where: {
        supplierId,
        deletedAt: null,
        active: true,
      },
    }),
    // Pending orders
    db.purchaseOrder.count({
      where: {
        supplierId,
        status: { in: ['SENT', 'RECEIVED', 'CONFIRMED'] },
      },
    }),
    // Completed orders this month
    db.purchaseOrder.count({
      where: {
        supplierId,
        status: 'DELIVERED',
        deliveredAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    // Recent orders
    db.purchaseOrder.findMany({
      where: { supplierId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        items: {
          select: { quantity: true, total: true },
        },
      },
    }),
    // Sales statistics
    db.purchaseOrder.aggregate({
      where: {
        supplierId,
        status: 'DELIVERED',
        deliveredAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      _sum: { total: true },
    }),
  ])

  return {
    catalogProducts,
    pendingOrders,
    completedOrders,
    recentOrders,
    salesStats,
  }
}

export default async function SupplierDashboard() {
  const {
    catalogProducts,
    pendingOrders,
    completedOrders,
    recentOrders,
    salesStats,
  } = await getSupplierDashboardData()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SENT':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SENT':
        return 'Enviada'
      case 'RECEIVED':
        return 'Recibida'
      case 'CONFIRMED':
        return 'Confirmada'
      case 'PREPARING':
        return 'En preparación'
      case 'DISPATCHED':
        return 'Despachada'
      case 'DELIVERED':
        return 'Entregada'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">🤝 Portal Proveedores</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/catalogo" className="text-gray-900 hover:text-primary">Catálogo</a>
              <a href="/ordenes" className="text-gray-900 hover:text-primary">Órdenes</a>
              <a href="/precios" className="text-gray-900 hover:text-primary">Precios</a>
              <a href="/entregas" className="text-gray-900 hover:text-primary">Entregas</a>
              <a href="/reportes" className="text-gray-900 hover:text-primary">Reportes</a>
            </nav>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Distribuidora ABC</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard del Proveedor</h1>
          <p className="text-gray-600 mt-2">
            Gestiona tu catálogo, órdenes y entregas de manera eficiente
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos en Catálogo</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{catalogProducts}</div>
              <p className="text-xs text-muted-foreground">
                Productos activos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Órdenes Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">
                Requieren atención
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entregas Este Mes</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedOrders}</div>
              <p className="text-xs text-muted-foreground">
                Órdenes completadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(Number(salesStats._sum.total || 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                Ingresos mensuales
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Órdenes Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="font-medium">Orden #{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">
                          {order.items.length} productos • {getStatusText(order.status)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(Number(order.total))}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {recentOrders.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No hay órdenes recientes
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">📦 Actualizar Catálogo</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Agrega nuevos productos o actualiza precios existentes
                  </p>
                  <button className="text-blue-900 font-medium hover:underline">
                    Ir al catálogo →
                  </button>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">💰 Actualizar Precios</h4>
                  <p className="text-sm text-green-700 mb-3">
                    Modifica precios y promociones de tus productos
                  </p>
                  <button className="text-green-900 font-medium hover:underline">
                    Gestionar precios →
                  </button>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">🚚 Programar Entregas</h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    Coordina las entregas de órdenes confirmadas
                  </p>
                  <button className="text-yellow-900 font-medium hover:underline">
                    Ver entregas →
                  </button>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">📊 Ver Reportes</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    Analiza tu performance y ventas
                  </p>
                  <button className="text-purple-900 font-medium hover:underline">
                    Ver reportes →
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              🤖 Asistente Inteligente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">📈 Análisis de Demanda</h4>
                <p className="text-sm text-blue-700">
                  Tus productos de bebidas han tenido un aumento del 20% en demanda esta semana.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">💡 Recomendación</h4>
                <p className="text-sm text-green-700">
                  Considera aumentar el stock de Coca-Cola 350ml para la próxima entrega.
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">⏰ Recordatorio</h4>
                <p className="text-sm text-orange-700">
                  Tienes 2 órdenes confirmadas pendientes de programar entrega.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}