import { db } from '@meerkato/database'
import { Card, CardContent, CardHeader, CardTitle, formatCurrency } from '@meerkato/ui'
import {
  MapPin,
  Clock,
  DollarSign,
  Package,
  Navigation,
  Phone,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react'

async function getDeliveryDashboardData() {
  // In a real app, this would be filtered by the logged-in delivery person
  const deliveryPersonId = '1' // Mock delivery person ID

  const [
    assignedDeliveries,
    completedToday,
    earnedToday,
    activeRoute
  ] = await Promise.all([
    // Assigned deliveries
    db.delivery.findMany({
      where: {
        deliveryPersonId,
        status: { in: ['ASSIGNED', 'PICKED_UP', 'ON_WAY'] },
      },
      include: {
        order: {
          include: {
            customer: {
              include: { user: true },
            },
            items: {
              include: { product: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    }),
    // Completed deliveries today
    db.delivery.count({
      where: {
        deliveryPersonId,
        status: 'DELIVERED',
        deliveredAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    // Earnings today (estimated)
    db.delivery.aggregate({
      where: {
        deliveryPersonId,
        status: 'DELIVERED',
        deliveredAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
      _sum: { amountCollected: true },
    }),
    // Active route
    db.deliveryRoute.findFirst({
      where: {
        deliveryPersonId,
        status: { in: ['PLANNED', 'IN_PROGRESS'] },
        date: new Date().toISOString().split('T')[0],
      },
    }),
  ])

  return {
    assignedDeliveries,
    completedToday,
    earnedToday: earnedToday._sum.amountCollected || 0,
    activeRoute,
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ASSIGNED':
      return 'bg-blue-100 text-blue-800'
    case 'PICKED_UP':
      return 'bg-yellow-100 text-yellow-800'
    case 'ON_WAY':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'ASSIGNED':
      return 'Asignado'
    case 'PICKED_UP':
      return 'Recogido'
    case 'ON_WAY':
      return 'En camino'
    case 'DELIVERED':
      return 'Entregado'
    default:
      return status
  }
}

export default async function DeliveryDashboard() {
  const {
    assignedDeliveries,
    completedToday,
    earnedToday,
    activeRoute,
  } = await getDeliveryDashboardData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-primary text-white p-4 safe-area-top">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">🏍️ Meerkato Delivery</h1>
            <p className="text-primary-foreground/80 text-sm">Juan Domiciliario</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2">
              <Navigation className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="p-4">
        {/* Daily Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="text-center">
            <CardContent className="p-3">
              <Package className="w-6 h-6 mx-auto mb-1 text-primary" />
              <div className="text-lg font-bold">{assignedDeliveries.length}</div>
              <div className="text-xs text-gray-600">Pendientes</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-3">
              <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-600" />
              <div className="text-lg font-bold">{completedToday}</div>
              <div className="text-xs text-gray-600">Completadas</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-3">
              <DollarSign className="w-6 h-6 mx-auto mb-1 text-green-600" />
              <div className="text-lg font-bold">
                {formatCurrency(Number(earnedToday))}
              </div>
              <div className="text-xs text-gray-600">Recaudado</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Route Card */}
        {activeRoute && (
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-blue-900">
                <Navigation className="w-5 h-5 mr-2" />
                Ruta Activa
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-blue-700 mb-1">
                    {assignedDeliveries.length} entregas programadas
                  </p>
                  <p className="text-xs text-blue-600">
                    Distancia estimada: {activeRoute.totalDistance} km
                  </p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium touch-button">
                  Ver Mapa
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Deliveries List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Entregas del Día
          </h2>

          {assignedDeliveries.map((delivery) => (
            <Card key={delivery.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                        {getStatusText(delivery.status)}
                      </span>
                      <span className="text-sm text-gray-600">
                        #{delivery.order.orderNumber}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {delivery.order.customer.user.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      📍 {delivery.order.deliveryAddress}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {formatCurrency(Number(delivery.order.total))}
                    </div>
                    <div className="text-xs text-gray-500">
                      {delivery.order.paymentMethod === 'CASH' ? 'Contra entrega' : 'Pagado'}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {delivery.order.items.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="text-gray-900">
                        {formatCurrency(Number(item.total))}
                      </span>
                    </div>
                  ))}
                  {delivery.order.items.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{delivery.order.items.length - 2} productos más
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium touch-button">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Llamar
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium touch-button">
                    <Navigation className="w-4 h-4 inline mr-1" />
                    Navegar
                  </button>
                  {delivery.status === 'ASSIGNED' && (
                    <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium touch-button">
                      Recoger
                    </button>
                  )}
                  {delivery.status === 'ON_WAY' && (
                    <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium touch-button">
                      Entregar
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {assignedDeliveries.length === 0 && (
            <Card className="text-center py-8">
              <CardContent>
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay entregas asignadas
                </h3>
                <p className="text-gray-600 mb-4">
                  Cuando tengas nuevas entregas aparecerán aquí
                </p>
                <button className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium touch-button">
                  Actualizar
                </button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <Card className="mt-6 mb-20">
          <CardHeader>
            <CardTitle className="text-center text-gray-900">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-green-50 border border-green-200 p-4 rounded-lg text-center touch-button">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="text-sm font-medium text-green-900">Ver Liquidación</div>
              </button>
              <button className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center touch-button">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-sm font-medium text-blue-900">Reportar Incidencia</div>
              </button>
              <button className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-center touch-button">
                <Clock className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="text-sm font-medium text-purple-900">Historial</div>
              </button>
              <button className="bg-orange-50 border border-orange-200 p-4 rounded-lg text-center touch-button">
                <Phone className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                <div className="text-sm font-medium text-orange-900">Soporte</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-bottom">
        <div className="flex justify-around">
          <button className="flex flex-col items-center text-primary">
            <MapPin className="w-6 h-6" />
            <span className="text-xs mt-1">Entregas</span>
          </button>
          <button className="flex flex-col items-center text-gray-400">
            <Navigation className="w-6 h-6" />
            <span className="text-xs mt-1">Mapa</span>
          </button>
          <button className="flex flex-col items-center text-gray-400">
            <DollarSign className="w-6 h-6" />
            <span className="text-xs mt-1">Liquidación</span>
          </button>
          <button className="flex flex-col items-center text-gray-400">
            <Clock className="w-6 h-6" />
            <span className="text-xs mt-1">Historial</span>
          </button>
        </div>
      </nav>
    </div>
  )
}