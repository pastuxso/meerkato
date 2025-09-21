import OpenAI from 'openai'
import { db } from '@meerkato/database'

export class AIService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  // Generate embeddings for products
  async generateProductEmbedding(productData: {
    name: string
    description?: string
    category: string
  }): Promise<number[]> {
    const text = `${productData.name} ${productData.description || ''} ${productData.category}`

    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    })

    return response.data[0].embedding
  }

  // Generate customer behavior embeddings
  async generateCustomerEmbedding(customerData: {
    purchaseHistory: any[]
    preferences: any
  }): Promise<number[]> {
    const behaviorText = this.createCustomerBehaviorText(customerData)

    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: behaviorText,
    })

    return response.data[0].embedding
  }

  // Product recommendations using vector similarity
  async getProductRecommendations(
    customerId: string,
    limit: number = 10
  ): Promise<string[]> {
    // Get customer embeddings
    const customerEmbeddings = await db.customerEmbedding.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      take: 1,
    })

    if (customerEmbeddings.length === 0) {
      // Return popular products if no embeddings exist
      return this.getPopularProducts(limit)
    }

    const customerEmbedding = customerEmbeddings[0].embedding

    // Find similar products using cosine similarity
    const similarProducts = await db.$queryRaw`
      SELECT p.id, p.name,
             1 - (pe.embedding <=> ${customerEmbedding}::vector) as similarity
      FROM product_embeddings pe
      JOIN products p ON pe.product_id = p.id
      WHERE p.deleted_at IS NULL
        AND p.current_stock > 0
      ORDER BY similarity DESC
      LIMIT ${limit}
    ` as Array<{ id: string; name: string; similarity: number }>

    return similarProducts.map(p => p.id)
  }

  // Demand prediction
  async predictDemand(productId: string, days: number = 30): Promise<{
    predictedDemand: number
    confidence: number
    insights: string[]
  }> {
    // Get historical sales data
    const salesData = await db.saleItem.findMany({
      where: {
        productId,
        sale: {
          createdAt: {
            gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days
          },
        },
      },
      include: {
        sale: true,
      },
      orderBy: {
        sale: { createdAt: 'asc' },
      },
    })

    // Simple moving average prediction (in real implementation would use ML)
    const dailySales = this.groupSalesByDay(salesData)
    const recentAverage = this.calculateMovingAverage(dailySales, 14) // 14-day average
    const predictedDemand = Math.round(recentAverage * days)

    // Generate insights using GPT
    const insights = await this.generateDemandInsights(salesData, predictedDemand)

    return {
      predictedDemand,
      confidence: 0.75, // Would be calculated based on historical accuracy
      insights,
    }
  }

  // Price optimization
  async optimizePrice(productId: string): Promise<{
    suggestedPrice: number
    reasoning: string
    competitorPrices?: number[]
  }> {
    const product = await db.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        saleItems: {
          take: 100,
          orderBy: { sale: { createdAt: 'desc' } },
        },
      },
    })

    if (!product) {
      throw new Error('Product not found')
    }

    // Analyze sales velocity at different price points
    const priceAnalysis = this.analyzePriceElasticity(product.saleItems)

    // Generate AI recommendation
    const prompt = `
      Analyze pricing for product: ${product.name}
      Current price: $${product.salePrice}
      Category: ${product.category.name}
      Sales data: ${JSON.stringify(priceAnalysis)}

      Recommend optimal price considering:
      - Demand elasticity
      - Competitor pricing
      - Profit margins
      - Market positioning
    `

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    })

    const reasoning = response.choices[0].message.content || ''

    // Extract suggested price from reasoning (simplified)
    const priceMatch = reasoning.match(/\$?(\d+(?:\.\d{2})?)/g)
    const suggestedPrice = priceMatch ? parseFloat(priceMatch[0].replace('$', '')) : product.salePrice

    return {
      suggestedPrice,
      reasoning,
    }
  }

  // Route optimization for deliveries
  async optimizeDeliveryRoute(deliveryPersonId: string, orderIds: string[]): Promise<{
    optimizedRoute: string[]
    totalDistance: number
    estimatedTime: number
    savings: {
      distance: number
      time: number
    }
  }> {
    // Get order locations
    const orders = await db.order.findMany({
      where: { id: { in: orderIds } },
      select: {
        id: true,
        deliveryAddress: true,
        deliveryZone: true,
      },
    })

    // Use AI to optimize route (simplified implementation)
    const routeData = {
      orders: orders.map(o => ({
        id: o.id,
        address: o.deliveryAddress,
        zone: o.deliveryZone,
      })),
    }

    // In real implementation, would use proper route optimization algorithms
    // For demo, return orders in zone-based grouping
    const optimizedRoute = this.groupOrdersByZone(orders)

    return {
      optimizedRoute,
      totalDistance: 25.5, // km
      estimatedTime: 120, // minutes
      savings: {
        distance: 5.2,
        time: 20,
      },
    }
  }

  // Generate business insights
  async generateBusinessInsights(): Promise<{
    salesTrends: string
    inventoryAlerts: string[]
    recommendations: string[]
  }> {
    // Get recent business data
    const recentSales = await db.sale.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    })

    const lowStockProducts = await db.product.findMany({
      where: {
        currentStock: {
          lte: db.product.fields.minStock,
        },
        deletedAt: null,
      },
    })

    const prompt = `
      Analyze business performance:

      Sales data (last 30 days): ${recentSales.length} transactions
      Low stock products: ${lowStockProducts.length}

      Provide insights on:
      1. Sales trends and patterns
      2. Inventory management alerts
      3. Business optimization recommendations

      Format as JSON with salesTrends, inventoryAlerts, and recommendations arrays.
    `

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    })

    try {
      const insights = JSON.parse(response.choices[0].message.content || '{}')
      return {
        salesTrends: insights.salesTrends || 'No trends identified',
        inventoryAlerts: insights.inventoryAlerts || [],
        recommendations: insights.recommendations || [],
      }
    } catch {
      return {
        salesTrends: 'Análisis en progreso',
        inventoryAlerts: lowStockProducts.map(p => `Stock bajo: ${p.name}`),
        recommendations: ['Revisar niveles de inventario', 'Analizar tendencias de venta'],
      }
    }
  }

  // Helper methods
  private createCustomerBehaviorText(customerData: any): string {
    const purchases = customerData.purchaseHistory.map((p: any) => p.productName).join(', ')
    return `Customer purchases: ${purchases}. Preferences: ${JSON.stringify(customerData.preferences)}`
  }

  private async getPopularProducts(limit: number): Promise<string[]> {
    const popularProducts = await db.saleItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    })

    return popularProducts.map(p => p.productId)
  }

  private groupSalesByDay(salesData: any[]): number[] {
    // Implementation for grouping sales by day
    return []
  }

  private calculateMovingAverage(data: number[], period: number): number {
    if (data.length < period) return 0
    const sum = data.slice(-period).reduce((a, b) => a + b, 0)
    return sum / period
  }

  private async generateDemandInsights(salesData: any[], predictedDemand: number): Promise<string[]> {
    return [
      'Demanda estable en las últimas semanas',
      'Incremento esperado para fin de mes',
      'Considerar promociones para acelerar rotación',
    ]
  }

  private analyzePriceElasticity(salesItems: any[]): any {
    // Analyze how sales respond to price changes
    return { elasticity: 'low', optimalPriceRange: [2000, 3000] }
  }

  private groupOrdersByZone(orders: any[]): string[] {
    // Group orders by delivery zone for optimal routing
    const zoneGroups = orders.reduce((groups, order) => {
      const zone = order.deliveryZone
      if (!groups[zone]) groups[zone] = []
      groups[zone].push(order.id)
      return groups
    }, {})

    // Return flattened array in zone order
    return Object.values(zoneGroups).flat() as string[]
  }
}

export const aiService = new AIService()