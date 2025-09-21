import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clean database
  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.recommendationLog.deleteMany(),
    prisma.aIInsight.deleteMany(),
    prisma.customerEmbedding.deleteMany(),
    prisma.productEmbedding.deleteMany(),
    prisma.promotion.deleteMany(),
    prisma.loyaltyTransaction.deleteMany(),
    prisma.cashMovement.deleteMany(),
    prisma.shift.deleteMany(),
    prisma.cashRegister.deleteMany(),
    prisma.costHistory.deleteMany(),
    prisma.priceHistory.deleteMany(),
    prisma.inventoryMovement.deleteMany(),
    prisma.supplierEvaluation.deleteMany(),
    prisma.orderCommunication.deleteMany(),
    prisma.purchaseOrderItem.deleteMany(),
    prisma.purchaseOrder.deleteMany(),
    prisma.deliveryEvaluation.deleteMany(),
    prisma.deliveryTracking.deleteMany(),
    prisma.deliveryRoute.deleteMany(),
    prisma.delivery.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.saleItem.deleteMany(),
    prisma.sale.deleteMany(),
    prisma.liquidationItem.deleteMany(),
    prisma.liquidation.deleteMany(),
    prisma.consignmentProduct.deleteMany(),
    prisma.thirdPartySupplier.deleteMany(),
    prisma.barcode.deleteMany(),
    prisma.supplierCatalog.deleteMany(),
    prisma.supplierContact.deleteMany(),
    prisma.supplier.deleteMany(),
    prisma.deliveryPerson.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.deviceToken.deleteMany(),
    prisma.session.deleteMany(),
    prisma.user.deleteMany(),
    prisma.configuration.deleteMany(),
  ])

  // Create configurations
  await prisma.configuration.createMany({
    data: [
      {
        key: 'store_name',
        value: { name: 'Minimarket Meerkato' },
        description: 'Store name',
      },
      {
        key: 'store_address',
        value: {
          street: 'Calle 123 #45-67',
          city: 'Bogotá',
          country: 'Colombia',
        },
        description: 'Store physical address',
      },
      {
        key: 'tax_rate',
        value: { rate: 19 },
        description: 'IVA tax rate percentage',
      },
      {
        key: 'loyalty_points_rate',
        value: { rate: 1, per: 1000 },
        description: 'Points earned per currency amount',
      },
      {
        key: 'delivery_zones',
        value: {
          zones: [
            { id: 'zone1', name: 'Zona Norte', fee: 5000, minOrder: 20000 },
            { id: 'zone2', name: 'Zona Sur', fee: 6000, minOrder: 25000 },
            { id: 'zone3', name: 'Zona Centro', fee: 4000, minOrder: 15000 },
          ],
        },
        description: 'Delivery zones configuration',
      },
    ],
  })

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10)

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@meerkato.co',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '3001234567',
    },
  })

  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@meerkato.co',
      name: 'Manager User',
      password: hashedPassword,
      role: 'MANAGER',
      phone: '3002345678',
    },
  })

  const supervisorUser = await prisma.user.create({
    data: {
      email: 'supervisor@meerkato.co',
      name: 'Supervisor User',
      password: hashedPassword,
      role: 'SUPERVISOR',
      phone: '3003456789',
      requiresDevice: true,
    },
  })

  const cashierUser = await prisma.user.create({
    data: {
      email: 'cashier@meerkato.co',
      name: 'Cashier User',
      password: hashedPassword,
      role: 'CASHIER',
      phone: '3004567890',
      requiresDevice: true,
    },
  })

  const deliveryUser = await prisma.user.create({
    data: {
      email: 'delivery@meerkato.co',
      name: 'Juan Domiciliario',
      password: hashedPassword,
      role: 'DELIVERY',
      phone: '3005678901',
    },
  })

  const supplierUser = await prisma.user.create({
    data: {
      email: 'supplier@distribuidora.co',
      name: 'Distribuidora ABC',
      password: hashedPassword,
      role: 'SUPPLIER',
      phone: '3006789012',
    },
  })

  const customerUser = await prisma.user.create({
    data: {
      email: 'customer@gmail.com',
      name: 'María García',
      password: hashedPassword,
      role: 'CUSTOMER',
      phone: '3007890123',
    },
  })

  // Create delivery person profile
  await prisma.deliveryPerson.create({
    data: {
      userId: deliveryUser.id,
      vehicleType: 'Moto',
      vehiclePlate: 'ABC123',
      zones: ['zone1', 'zone2', 'zone3'],
      maxOrders: 15,
    },
  })

  // Create supplier profile
  const supplier = await prisma.supplier.create({
    data: {
      userId: supplierUser.id,
      companyName: 'Distribuidora ABC S.A.S',
      taxId: '900123456-7',
      address: 'Carrera 10 #20-30',
      city: 'Bogotá',
      phone: '3006789012',
      email: 'contacto@distribuidora.co',
      website: 'https://distribuidora.co',
      businessHours: {
        monday: { open: '08:00', close: '18:00' },
        tuesday: { open: '08:00', close: '18:00' },
        wednesday: { open: '08:00', close: '18:00' },
        thursday: { open: '08:00', close: '18:00' },
        friday: { open: '08:00', close: '18:00' },
        saturday: { open: '08:00', close: '14:00' },
        sunday: { closed: true },
      },
      deliveryZones: ['zone1', 'zone2', 'zone3'],
      paymentMethods: ['transfer', 'cash', '30days'],
      approved: true,
      approvedAt: new Date(),
      approvedBy: adminUser.id,
    },
  })

  // Create supplier contacts
  await prisma.supplierContact.createMany({
    data: [
      {
        supplierId: supplier.id,
        name: 'Carlos Vendedor',
        position: 'Vendedor',
        phone: '3101234567',
        email: 'carlos@distribuidora.co',
        isPrimary: true,
      },
      {
        supplierId: supplier.id,
        name: 'Ana Supervisor',
        position: 'Supervisor',
        phone: '3112345678',
        email: 'ana@distribuidora.co',
        isPrimary: false,
      },
    ],
  })

  // Create customer profile
  const customer = await prisma.customer.create({
    data: {
      userId: customerUser.id,
      documentType: 'CC',
      documentNumber: '1234567890',
      address: 'Calle 45 #12-34 Apto 201',
      city: 'Bogotá',
      points: 150,
      vipStatus: false,
    },
  })

  // Create third party supplier (consignment)
  const thirdPartySupplier = await prisma.thirdPartySupplier.create({
    data: {
      name: 'Panadería Doña Rosa',
      contactName: 'Rosa Martínez',
      phone: '3201234567',
      email: 'panaderiarosa@gmail.com',
      paymentMethod: 'Efectivo semanal',
      commissionPercentage: 15.0,
      consignmentDays: 7,
      returnPolicy: 'Devolución de productos no vendidos cada 7 días',
    },
  })

  // Create zero commission supplier
  const zeroCommissionSupplier = await prisma.thirdPartySupplier.create({
    data: {
      name: 'Lácteos El Campo',
      contactName: 'Pedro Gómez',
      phone: '3212345678',
      email: 'lacteoslelcampo@gmail.com',
      paymentMethod: 'Transferencia quincenal',
      commissionPercentage: 0.0, // Zero commission
      consignmentDays: 15,
      returnPolicy: 'Sin devoluciones, pago total quincenal',
    },
  })

  // Create categories
  const beveragesCategory = await prisma.category.create({
    data: {
      name: 'Bebidas',
      slug: 'bebidas',
      description: 'Bebidas refrescantes y energizantes',
      displayOrder: 1,
    },
  })

  const snacksCategory = await prisma.category.create({
    data: {
      name: 'Snacks',
      slug: 'snacks',
      description: 'Mecato y pasabocas',
      displayOrder: 2,
    },
  })

  const bakeryCategory = await prisma.category.create({
    data: {
      name: 'Panadería',
      slug: 'panaderia',
      description: 'Productos de panadería frescos',
      displayOrder: 3,
    },
  })

  const dairyCategory = await prisma.category.create({
    data: {
      name: 'Lácteos',
      slug: 'lacteos',
      description: 'Productos lácteos frescos',
      displayOrder: 4,
    },
  })

  // Create cash register
  const cashRegister = await prisma.cashRegister.create({
    data: {
      name: 'Caja Principal',
      location: 'Entrada principal',
      active: true,
    },
  })

  // Create products
  const products = await Promise.all([
    // Own products
    prisma.product.create({
      data: {
        sku: 'BEB001',
        name: 'Coca-Cola 350ml',
        description: 'Bebida gaseosa Coca-Cola presentación 350ml',
        categoryId: beveragesCategory.id,
        unitOfMeasure: 'Unidad',
        productType: 'OWN',
        costPrice: 2000,
        salePrice: 3500,
        minPrice: 3000,
        maxPrice: 4000,
        costingMethod: 'AVERAGE',
        profitMargin: 75,
        currentStock: 50,
        minStock: 10,
        maxStock: 100,
        slug: 'coca-cola-350ml',
        metaTitle: 'Coca-Cola 350ml | Meerkato',
        metaDescription: 'Compra Coca-Cola 350ml al mejor precio',
        barcodes: {
          create: [
            { code: '7702004000001', isMain: true },
            { code: '7702004000002', isMain: false },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        sku: 'SNK001',
        name: 'Doritos Nacho 40g',
        description: 'Pasabocas Doritos sabor Nacho Cheese 40g',
        categoryId: snacksCategory.id,
        unitOfMeasure: 'Unidad',
        productType: 'OWN',
        costPrice: 1500,
        salePrice: 2500,
        minPrice: 2200,
        maxPrice: 3000,
        costingMethod: 'FIFO',
        profitMargin: 66,
        currentStock: 30,
        minStock: 5,
        maxStock: 50,
        slug: 'doritos-nacho-40g',
        metaTitle: 'Doritos Nacho 40g | Meerkato',
        metaDescription: 'Compra Doritos Nacho al mejor precio',
        barcodes: {
          create: [{ code: '7501000000001', isMain: true }],
        },
      },
    }),
    // Consignment products
    prisma.product.create({
      data: {
        sku: 'PAN001',
        name: 'Pan Francés',
        description: 'Pan francés fresco del día',
        categoryId: bakeryCategory.id,
        unitOfMeasure: 'Unidad',
        productType: 'CONSIGNMENT',
        costPrice: 800,
        salePrice: 1500,
        currentStock: 20,
        minStock: 5,
        maxStock: 30,
        slug: 'pan-frances',
        metaTitle: 'Pan Francés Fresco | Meerkato',
        metaDescription: 'Pan francés recién horneado todos los días',
        barcodes: {
          create: [{ code: '2000000000001', isMain: true }],
        },
      },
    }),
    // Zero commission product
    prisma.product.create({
      data: {
        sku: 'LAC001',
        name: 'Leche Entera 1L',
        description: 'Leche entera pasteurizada 1 litro',
        categoryId: dairyCategory.id,
        unitOfMeasure: 'Litro',
        productType: 'CONSIGNMENT',
        costPrice: 3500,
        salePrice: 4500,
        currentStock: 15,
        minStock: 5,
        maxStock: 25,
        slug: 'leche-entera-1l',
        metaTitle: 'Leche Entera 1L | Meerkato',
        metaDescription: 'Leche fresca entera de la mejor calidad',
        barcodes: {
          create: [{ code: '7701234567890', isMain: true }],
        },
      },
    }),
    // Mixed product (both own and consignment)
    prisma.product.create({
      data: {
        sku: 'BEB002',
        name: 'Agua Cristal 600ml',
        description: 'Agua embotellada Cristal 600ml',
        categoryId: beveragesCategory.id,
        unitOfMeasure: 'Unidad',
        productType: 'BOTH',
        costPrice: 1000,
        salePrice: 2000,
        costingMethod: 'AVERAGE',
        profitMargin: 100,
        currentStock: 60,
        minStock: 15,
        maxStock: 120,
        slug: 'agua-cristal-600ml',
        metaTitle: 'Agua Cristal 600ml | Meerkato',
        metaDescription: 'Agua pura embotellada Cristal',
        barcodes: {
          create: [
            { code: '7702090000001', isMain: true },
            { code: '7702090000002', isMain: false },
          ],
        },
      },
    }),
  ])

  // Create supplier catalogs
  await prisma.supplierCatalog.createMany({
    data: [
      {
        supplierId: supplier.id,
        productId: products[0].id, // Coca-Cola
        supplierCode: 'CC350',
        price: 1800,
        minOrder: 12,
        deliveryTime: 24,
        stockAvailable: 500,
      },
      {
        supplierId: supplier.id,
        productId: products[1].id, // Doritos
        supplierCode: 'DOR40',
        price: 1300,
        minOrder: 24,
        deliveryTime: 24,
        stockAvailable: 300,
      },
      {
        supplierId: supplier.id,
        productId: products[4].id, // Agua
        supplierCode: 'AGU600',
        price: 900,
        minOrder: 24,
        deliveryTime: 48,
        stockAvailable: 1000,
      },
    ],
  })

  // Create consignment products
  await prisma.consignmentProduct.createMany({
    data: [
      {
        productId: products[2].id, // Pan
        thirdPartySupplierId: thirdPartySupplier.id,
        receivedDate: new Date(),
        returnByDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        quantity: 20,
        quantitySold: 5,
        salePrice: 1500,
        commissionPercent: 15.0,
        status: 'ON_SALE',
      },
      {
        productId: products[3].id, // Leche
        thirdPartySupplierId: zeroCommissionSupplier.id,
        receivedDate: new Date(),
        returnByDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        quantity: 15,
        quantitySold: 3,
        salePrice: 4500,
        commissionPercent: 0.0, // Zero commission
        status: 'ON_SALE',
      },
    ],
  })

  // Create an active shift
  const shift = await prisma.shift.create({
    data: {
      userId: cashierUser.id,
      cashRegisterId: cashRegister.id,
      openingCash: 100000,
      status: 'OPEN',
    },
  })

  // Create some sales
  const sale = await prisma.sale.create({
    data: {
      ticketNumber: 'T000001',
      userId: cashierUser.id,
      shiftId: shift.id,
      subtotal: 10000,
      tax: 1900,
      discount: 0,
      total: 11900,
      paymentMethod: 'CASH',
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 2,
            unitPrice: 3500,
            total: 7000,
          },
          {
            productId: products[2].id,
            quantity: 2,
            unitPrice: 1500,
            total: 3000,
            isConsignment: true,
            commission: 450, // 15% of 3000
          },
        ],
      },
    },
  })

  // Create an order for delivery
  const order = await prisma.order.create({
    data: {
      orderNumber: 'ORD000001',
      customerId: customer.id,
      deliveryAddress: customer.address!,
      deliveryZone: 'zone1',
      deliveryFee: 5000,
      subtotal: 8000,
      tax: 1520,
      discount: 0,
      total: 14520,
      paymentMethod: 'CASH',
      status: 'PREPARING',
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            unitPrice: 3500,
            total: 3500,
          },
          {
            productId: products[3].id,
            quantity: 1,
            unitPrice: 4500,
            total: 4500,
          },
        ],
      },
    },
  })

  // Create a promotion
  await prisma.promotion.create({
    data: {
      name: '2x1 en Snacks',
      type: 'BUY_X_GET_Y',
      config: {
        categoryId: snacksCategory.id,
        buyQuantity: 2,
        getQuantity: 1,
      },
      validFrom: new Date(),
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      active: true,
    },
  })

  // Create device token for testing
  await prisma.deviceToken.create({
    data: {
      token: 'test-device-token-123',
      deviceId: 'device-001',
      fingerprint: 'fingerprint-hash-123',
      macAddress: '00:11:22:33:44:55',
      hostname: 'POS-Terminal-01',
    },
  })

  console.log('✅ Seed completed successfully')
  console.log('\n📧 Test accounts created:')
  console.log('Admin: admin@meerkato.co / password123')
  console.log('Manager: manager@meerkato.co / password123')
  console.log('Supervisor: supervisor@meerkato.co / password123 (requires device)')
  console.log('Cashier: cashier@meerkato.co / password123 (requires device)')
  console.log('Delivery: delivery@meerkato.co / password123')
  console.log('Supplier: supplier@distribuidora.co / password123')
  console.log('Customer: customer@gmail.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })