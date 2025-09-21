Quiero que crees una moderna y profesional aplicación de Punto de Venta (POS) en NextJS para mi minimarket usando **arquitectura de monorepo**. Aquí está mi visión:

**VISIÓN GENERAL DE LA APLICACIÓN:**

Crea una aplicación web completa para la gestión integral de minimarkets usando **arquitectura de monorepo** con **cuatro portales separados por subdominios**. La aplicación debe ser **white label físico** (una instalación separada por comercio, sin multi-tenancy), sentirse moderna, intuitiva y profesional, optimizada para el uso diario por múltiples cajeros, supervisores, domiciliarios y proveedores, **con tienda en línea integrada**, **potenciada por AI/LLM para optimización inteligente de procesos**, **con sistema completo de productos en consignación/comisión** y **portal de autoservicio para proveedores**.

**ARQUITECTURA DE MONOREPO Y SUBDOMINIOS:**

- **Estructura de Monorepo:**
  - **packages/shared** - Componentes, tipos, utilidades y lógica compartida
  - **packages/database** - Esquemas, migraciones y utilidades de base de datos
  - **packages/ui** - Componentes UI compartidos (shadcn/ui extendidos)
  - **packages/auth** - Configuración y utilidades de AuthJS compartidas
  - **packages/ai** - Funcionalidades AI/LLM compartidas
  - **apps/storefront** - Tienda en línea pública (meerkato.co)
  - **apps/pos** - Panel administrativo POS (pos.meerkato.co)
  - **apps/suppliers** - Portal de proveedores (proveedores.meerkato.co)
  - **apps/delivery** - App móvil para domiciliarios (entrega.meerkato.co)
  - **apps/device-agent** - Agente de seguridad en Go

- **Subdominios y Funcionalidades:**

  **meerkato.co (Storefront - Tienda en Línea Pública):**
  - Tienda en línea para clientes finales
  - Catálogo de productos con SEO optimizado
  - Sistema de pedidos para domicilio
  - Registro e inicio de sesión de clientes
  - Carrito de compras y checkout
  - Seguimiento de pedidos
  - Sistema de fidelización para clientes
  - Páginas institucionales (nosotros, contacto)

  **pos.meerkato.co (Panel Administrativo POS):**
  - Dashboard principal del negocio
  - Módulo de ventas presenciales
  - Gestión de inventario y productos
  - Control de turnos y cajeros
  - Gestión de domicilios y entregas
  - Reportes y analytics con AI
  - Gestión de productos en consignación
  - Panel de liquidaciones
  - Administración de usuarios
  - Configuración del sistema
  - Gestión del portal de proveedores

  **proveedores.meerkato.co (Portal de Proveedores):**
  - Dashboard para proveedores
  - Gestión autónoma de catálogos
  - Actualización de precios y promociones
  - Recepción y gestión de órdenes de compra
  - Programación de entregas
  - Comunicación con el minimarket
  - Reportes de ventas y performance
  - Gestión de perfil y contactos

  **entrega.meerkato.co (App Móvil para Domiciliarios):**
  - PWA optimizada para dispositivos móviles
  - Dashboard de pedidos asignados
  - Mapa con rutas optimizadas por AI
  - Procesamiento de pagos contra-entrega
  - Tracking GPS en tiempo real
  - Gestión de entregas e incidencias
  - Liquidación de efectivo y comisiones
  - Comunicación con el centro de operaciones

**DEVICE AGENT DE SEGURIDAD (Go):**

### **Propósito: Validación de Dispositivos Autorizados**

- **Agente mínimo en Go** que corre como servicio en terminales POS autorizadas
- **API REST simple** en puerto local (localhost:8181)
- **Validación de dispositivo** solo para roles que requieren terminal física

### **Funcionalidades del Agente:**

1. **Identificación de Dispositivo:**
   - **Fingerprint único** basado en hardware (MAC, CPU ID, motherboard serial)
   - **Token de instalación** generado durante setup inicial
   - **Certificado de dispositivo** firmado por el servidor central

2. **API de Validación:**
   ```go
   GET /health - Confirma que el agente está activo
   GET /device-token - Retorna token de dispositivo válido
   POST /validate - Valida sesión específica
   ```

3. **Seguridad:**
   - **Solo responde a localhost** (127.0.0.1)
   - **Token temporal** que rota cada X minutos
   - **Heartbeat** con servidor central

### **Sistema de Autenticación por Roles:**

**REQUIEREN AGENTE DE DISPOSITIVO (Solo terminales POS autorizadas):**
- **Cajeros** - pos.meerkato.co solo desde terminales con agente
- **Supervisores** - pos.meerkato.co solo desde terminales con agente

**ACCESO WEB MÓVIL (Sin agente, con geolocalización):**
- **Domiciliarios** - entrega.meerkato.co desde cualquier móvil
- **Autenticación móvil:** Usuario + PIN + Geolocalización + Turno activo

**ACCESO REMOTO COMPLETO (Sin restricciones de dispositivo):**
- **Administradores** - pos.meerkato.co desde cualquier lugar/dispositivo
- **Gerentes** - pos.meerkato.co con permisos específicos

**PORTAL DE AUTOSERVICIO PARA PROVEEDORES (proveedores.meerkato.co):**

- **Sistema de Registro y Acceso de Proveedores:**
  - **Portal independiente** para proveedores con autenticación separada
  - **Registro de proveedores** con aprobación del administrador del minimarket
  - **Perfiles de proveedor** con información de empresa, contactos múltiples
  - **Datos de contacto completos:** vendedor principal, supervisor, gerente, datos de emergencia
  - **Información operativa:** horarios de atención, zonas de cobertura, métodos de pago aceptados

- **Gestión Autónoma de Catálogos:**
  - **Carga de productos individual** con formulario detallado
  - **Carga masiva de catálogos** mediante Excel/CSV con plantillas predefinidas
  - **Subida de imágenes** de productos con redimensionamiento automático
  - **Información detallada por producto:**
    - Código interno del proveedor
    - Descripción completa
    - Categoría/subcategoría
    - Precio unitario con descuentos por volumen
    - Unidad de medida (unidad, kg, litro, etc.)
    - Stock disponible
    - Fecha de vencimiento (productos perecederos)
    - **Tiempos de entrega** específicos por producto
    - Mínimo de compra
    - Condiciones especiales

- **Gestión de Precios y Promociones:**
  - **Actualización de precios** en tiempo real por el proveedor
  - **Descuentos escalonados** por volumen de compra
  - **Promociones temporales** con fechas de inicio y fin
  - **Precios especiales** para clientes frecuentes
  - **Historial de cambios** de precios para auditoría
  - **Notificaciones automáticas** al minimarket sobre cambios importantes

- **Sistema de Órdenes de Compra Digital:**
  - **Generación de órdenes** por parte del minimarket desde el catálogo del proveedor
  - **Notificaciones inmediatas** al proveedor sobre nuevas órdenes
  - **Confirmación de órdenes** por parte del proveedor con tiempo estimado de entrega
  - **Estados de orden:** Enviada → Recibida → Confirmada → En preparación → Despachada → Entregada
  - **Tracking de órdenes** en tiempo real
  - **Comunicación integrada** entre minimarket y proveedor sobre la orden

- **Dashboard para Proveedores:**
  - **Resumen de órdenes** pendientes y completadas
  - **Estadísticas de ventas** a través del minimarket
  - **Productos más solicitados** y análisis de demanda
  - **Estado de pagos** y facturas pendientes
  - **Calendario de entregas** programadas
  - **Alertas y notificaciones** importantes

- **Comunicación y Coordinación:**
  - **Chat integrado** entre proveedor y minimarket
  - **Sistema de notas** en órdenes específicas
  - **Calendario compartido** para programar entregas
  - **Notificaciones push/email** para eventos importantes
  - **Centro de mensajes** para comunicación general

- **Gestión de Entregas:**
  - **Programación de entregas** por parte del proveedor
  - **Confirmación de recepción** por parte del minimarket
  - **Registro de incidencias** en entregas
  - **Documentación digital** de entregas (fotos, firmas digitales)
  - **Evaluación de entregas** por parte del minimarket

**APP MÓVIL PARA DOMICILIARIOS (entrega.meerkato.co):**

- **PWA Ultra-Optimizada para Móvil:**
  - **Instalación nativa** como app móvil
  - **Carga ultrarrápida** - solo componentes esenciales para entrega
  - **Touch-optimized** - botones grandes para uso en movimiento
  - **Battery-friendly** - consume mínima batería
  - **Offline-capable** - funciona con conexión intermitente

- **Dashboard de Entregas:**
  - **Vista diaria de pedidos** asignados al domiciliario
  - **Estado de cada entrega:** Pendiente → En camino → Entregada → Incidencia
  - **Información del cliente:** nombre, teléfono, dirección, notas especiales
  - **Detalles del pedido:** productos, cantidad, total, método de pago
  - **Tiempo estimado** y distancia a cada dirección

- **Navegación y Rutas Inteligentes:**
  - **Mapa integrado** con todas las entregas del día
  - **Rutas optimizadas** por AI considerando tráfico y distancias
  - **GPS tracking** en tiempo real visible para el minimarket
  - **Navegación paso a paso** hacia la siguiente entrega
  - **Reordenamiento dinámico** de rutas por prioridad o urgencia

- **Procesamiento de Pagos Contra-Entrega:**
  - **Calculadora integrada** para vueltos
  - **Confirmación de pago** en efectivo con monto exacto
  - **Registro de transferencias** (Nequi, Daviplata, Bancolombia)
  - **Procesamiento con tarjeta** (interfaz para datafono móvil)
  - **Control de efectivo** acumulado durante el turno

- **Gestión de Entregas e Incidencias:**
  - **Confirmación de entrega** con foto opcional
  - **Firma digital** del cliente en pantalla
  - **Registro de incidencias:** cliente ausente, dirección incorrecta, rechazo
  - **Reprogramación** de entregas fallidas
  - **Comunicación directa** con el cliente vía WhatsApp/llamada

- **Liquidación y Control:**
  - **Resumen del turno:** entregas completadas, efectivo recaudado, comisiones
  - **Liquidación de efectivo** al final del turno
  - **Cálculo automático** de comisiones por entrega
  - **Reportes de desempeño:** tiempo promedio, entregas exitosas, calificaciones

- **Comunicación y Soporte:**
  - **Chat directo** con supervisores del minimarket
  - **Alertas de emergencia** con ubicación GPS
  - **Notificaciones push** para nuevos pedidos o cambios de ruta
  - **Centro de ayuda** con procedimientos y contactos

**SISTEMA DE PRODUCTOS EN CONSIGNACIÓN/COMISIÓN:**

- **Gestión de Proveedores Terceros:**
  - **Registro de proveedores** con datos de contacto, método de pago preferido, condiciones comerciales
  - **Configuración de comisiones** por proveedor (porcentaje o valor fijo, **puede ser 0%**)
  - **Condiciones específicas** por proveedor (días de consignación, política de devoluciones)
  - **Historial de liquidaciones** y pagos realizados

- **Productos en Consignación:**
  - **Clasificación de productos:** Propios vs Consignación
  - **Ingreso de productos** con fecha de recepción, cantidad, precio de venta establecido por el proveedor
  - **Estados de productos:** Recibido → En venta → Vendido → Liquidado / Devuelto
  - **Control de fechas** límite para devolución automática
  - **Trazabilidad completa** del ciclo de vida del producto
  - **Códigos de barras** específicos para productos en consignación

- **Control de Comisiones:**
  - **Comisión configurable** por proveedor/producto/categoría (0% a 100%)
  - **Cálculo automático** de comisión del minimarket vs valor para el proveedor
  - **Diferentes tipos de comisión:** Porcentaje fijo, valor fijo por unidad, escalonado por volumen
  - **Comisión cero** para casos donde solo se presta el servicio de venta sin cobro
  - **Reportes de comisiones** ganadas por período

- **Liquidaciones y Pagos:**
  - **Liquidaciones automáticas** por proveedor con detalle de productos vendidos
  - **Control de productos** vendidos vs devueltos
  - **Cálculo automático** de valor a pagar al proveedor (precio venta - comisión)
  - **Estados de liquidación:** Pendiente → Revisada → Pagada
  - **Generación de comprobantes** de liquidación
  - **Programación de pagos** con recordatorios automáticos

- **Inventario de Consignación:**
  - **Separación clara** entre inventario propio e inventario en consignación
  - **Control de stock** independiente por tipo de producto
  - **Alertas de vencimiento** de períodos de consignación
  - **Proceso de devolución** automática de productos no vendidos
  - **Valorización separada** del inventario

**INTEGRACIÓN DE AI/LLM Y VECTORES:**

- **Análisis Inteligente de Ventas y Demanda:**
  - **Predicción de demanda** usando embeddings de patrones históricos de venta
  - **Detección de tendencias** en productos mediante análisis vectorial de comportamiento de compra
  - **Sugerencias de reabastecimiento** inteligentes basadas en estacionalidad, eventos locales y patrones históricos
  - **Optimización de inventario** con predicciones de stock óptimo por producto
  - **Análisis específico** para productos en consignación vs productos propios
  - **Recomendaciones de proveedores** basadas en performance histórico

- **Sistema de Recomendaciones Inteligente:**
  - **Recomendaciones personalizadas** para clientes en tienda en línea usando embeddings de historial de compras
  - **Cross-selling y up-selling** automático en el POS basado en patrones de compra
  - **Productos complementarios** sugeridos durante la venta usando similitud vectorial
  - **Promociones personalizadas** generadas por AI según perfil del cliente
  - **Sugerencias de productos** a solicitar a proveedores basadas en demanda

- **Optimización de Rutas de Domicilio:**
  - **Clustering inteligente** de entregas usando embeddings geográficos
  - **Predicción de tiempos** de entrega considerando tráfico y patrones históricos
  - **Optimización de asignación** de domiciliarios basada en eficiencia histórica
  - **Rutas dinámicas** que se adaptan en tiempo real a nuevos pedidos
  - **Sugerencias de zonas** de entrega más rentables

- **Optimización de Precios Dinámicos:**
  - **Análisis de competencia** usando LLM para procesar precios de mercado (web scraping + análisis)
  - **Sugerencias de precios óptimos** basadas en demanda, competencia y márgenes
  - **Detección de oportunidades** de ajuste de precios en tiempo real
  - **Alertas inteligentes** cuando los precios están fuera de rango competitivo
  - **Análisis de rentabilidad** de productos en consignación vs productos propios
  - **Comparación automática** de precios entre proveedores

- **Asistente Virtual para Operaciones:**
  - **Chatbot administrativo** para consultas sobre inventario, ventas, liquidaciones y reportes usando RAG
  - **Análisis de reportes en lenguaje natural** ("¿cuáles fueron mis 10 productos en consignación más vendidos este mes?")
  - **Generación automática de insights** de negocio en español
  - **Alertas inteligentes** con explicaciones contextuales sobre liquidaciones pendientes
  - **Asistente para proveedores** en el portal de autoservicio
  - **Asistente para domiciliarios** con navegación y soporte

- **Análisis de Texto y Sentimientos:**
  - **Análisis de reseñas** de productos con sentiment analysis
  - **Categorización automática** de productos usando descripciones
  - **Generación de descripciones** SEO-optimizadas para productos
  - **Análisis de feedback** de clientes para mejoras del servicio
  - **Análisis de performance** de proveedores basado en comentarios
  - **Evaluación de domiciliarios** basada en feedback de clientes

- **Detección de Patrones y Anomalías:**
  - **Detección de fraude** en transacciones usando embeddings de comportamiento
  - **Alertas de stock** inteligentes considerando patrones estacionales
  - **Identificación de productos** con bajo rendimiento usando análisis vectorial
  - **Detección de errores** en entrada de datos del inventario
  - **Análisis de productos** en consignación con mejor/peor rendimiento
  - **Detección de precios anómalos** en catálogos de proveedores
  - **Anomalías en rutas** de domiciliarios para optimización

**FUNCIONALIDADES ESENCIALES:**

- **Gestión de productos e Inventarios (Compartida entre apps):**
  - Catálogo de productos con **múltiples códigos de barras por producto** (particularidad colombiana donde el mismo producto puede tener diferentes códigos según el proveedor)
  - **Clasificación de productos:** Propios, Consignación, Ambos
  - **Integración con catálogos de proveedores** del portal de autoservicio
  - Control automático de existencias, **alertas inteligentes de stock** potenciadas por AI
  - **Control separado** de inventario propio vs consignación
  - Gestión de proveedores y códigos alternativos
  - **Sistema de recosteo automático de precios de venta** con **sugerencias AI de precios óptimos**
  - **Sincronización automática** entre todas las aplicaciones del monorepo

- **Tienda en Línea (meerkato.co):**
  - **Páginas públicas SEO-optimizadas:** Home, Catálogo, Categorías, Productos individuales, Sobre nosotros, Contacto
  - **Sistema de pedidos** con carrito de compras y **recomendaciones AI**
  - **Búsqueda inteligente** con procesamiento de lenguaje natural
  - **Páginas dinámicas de productos** con URLs amigables (/productos/[slug])
  - **Páginas de categorías** optimizadas (/categoria/[slug])
  - **Búsqueda de productos** con resultados SEO-friendly y **sugerencias inteligentes**
  - **Sitemap automático** y meta tags optimizados
  - **Structured data** para productos (Schema.org)
  - **Registro e inicio de sesión de clientes** integrado
  - **Responsive design** optimizado para móviles

- **Pedidos en Línea y Domicilios:**
  - **Gestión de zonas de entrega** con tarifas diferenciadas y **optimización AI de rutas**
  - **Cálculo automático de costos de domicilio** por zona/distancia
  - **Estados de pedido:** Recibido → En preparación → En camino → Entregado → Cancelado
  - **Asignación inteligente de domiciliarios** usando AI para optimización
  - **Predicción de tiempos** de entrega con machine learning
  - **Notificaciones automáticas** al cliente (SMS/WhatsApp/Email)
  - **Integración entre storefront, POS y app de domiciliarios** para procesamiento unificado
  - **Tiempo estimado de entrega** configurable por zona
  - **Pedidos programados** para entrega en horario específico
  - **Mínimo de compra** configurable por zona de entrega

- **Gestión de compras e ingresos con recálculo automático de precios:**
  - **Registro de compras** para productos propios con actualización automática de inventario
  - **Integración con órdenes de compra** del portal de proveedores
  - **Registro de productos en consignación** con datos del proveedor tercero
  - **Sugerencias AI de reabastecimiento** basadas en predicción de demanda y catálogos de proveedores
  - **Métodos de recosteo configurables** (solo para productos propios):
    - **FIFO (First In, First Out)** - Primero en entrar, primero en salir
    - **LIFO (Last In, First Out)** - Último en entrar, primero en salir
    - **Promedio Ponderado** - Costo promedio basado en cantidades
    - **Costo Específico** - Por lote o identificación específica
    - **Costo Estándar** - Precio fijo predefinido
  - **Recálculo automático de precios de venta** basado en:
    - Nuevo costo promedio/FIFO/LIFO según método elegido (productos propios)
    - Margen de ganancia configurado por producto/categoría
    - **Análisis AI de precios competitivos** y **comparación entre proveedores**
    - Reglas de redondeo (ej: terminados en 0, 5, 9)
    - Precios mínimos y máximos por producto
  - **Configuración flexible de márgenes:**
    - Por categoría de producto
    - Por proveedor
    - Por producto individual
    - Márgenes escalonados por volumen
  - Órdenes de compra, recepción de mercancía

- **Procesamiento de Ventas (POS):**
  - Registro rápido de ventas presenciales y **gestión de pedidos en línea**
  - **Identificación automática** del tipo de producto (propio vs consignación)
  - **Cálculo automático** de comisiones en tiempo real durante la venta
  - **Sugerencias inteligentes** de productos complementarios durante la venta
  - Múltiples formas de pago para ventas presenciales (efectivo, tarjetas débito/crédito, Nequi, Daviplata, Bancolombia a la Mano, PSE, QR códigos)
  - **Pagos contra-entrega para pedidos en línea:**
    - **Efectivo** al momento de la entrega
    - **Tarjeta débito/crédito** al momento de la entrega (datafonos móviles)
    - **Transferencias bancarias** al momento de la entrega (Nequi, Daviplata, Bancolombia a la Mano)
  - Emisión de tickets/facturas para ventas presenciales y domicilios
  - **Separación contable** automática entre ingresos propios y por consignación

- **Gestión de Domicilios (Integrada entre POS y App de Entregas):**
  - **Dashboard de pedidos** con estados en tiempo real (visible en pos.meerkato.co)
  - **Asignación automática/manual** de domiciliarios con **optimización AI**
  - **Rutas optimizadas** para entregas múltiples usando algoritmos inteligentes
  - **Tracking GPS** de domiciliarios en tiempo real (visible en ambas apps)
  - **Control de tiempos** de preparación y entrega con **predicciones AI**
  - **Gestión de devoluciones** y productos no entregados
  - **Liquidación de domiciliarios** con comisiones por entrega
  - **Manejo de pagos contra-entrega:** efectivo, tarjetas y transferencias
  - **Comunicación bidireccional** entre centro de operaciones y domiciliarios

- **Sistemas de Fidelización:**
  - **Puntos por compra** (configurable: X puntos por cada $1000 COP) - aplicable a pedidos en línea
  - **Descuentos por volumen** (compra X cantidad, obtén descuento)
  - **Promociones por categoría** (2x1, 3x2, descuento porcentual)
  - **Clientes VIP** con descuentos especiales y **envío gratis**
  - **Cupones y códigos promocionales** - aplicables en línea
  - **Descuentos por primera compra online**
  - **Promociones personalizadas** generadas por AI según perfil del cliente
  - **Arquitectura extensible** para agregar nuevos sistemas de fidelización

- **Reportes y Control:**
  - **Reportes separados** de ventas propias vs consignación
  - **Reportes de liquidaciones** por proveedor y período
  - **Análisis de comisiones** ganadas vs pagadas
  - **Reportes de productos** devueltos por vencimiento de consignación
  - **Análisis de performance** de proveedores del portal de autoservicio
  - **Reportes de órdenes** generadas vs completadas por proveedor
  - **Métricas de domiciliarios:** entregas completadas, tiempo promedio, efectividad de rutas
  - Reportes de ventas presenciales y domicilios por período/producto/cajero/domiciliario
  - **Insights inteligentes** generados por AI sobre patrones de venta
  - **Predicciones de demanda** y sugerencias de inventario
  - Reportes de inventario, análisis de márgenes y rentabilidad
  - **Métricas de domicilios:** tiempos de entrega, zonas más activas, domiciliarios más eficientes
  - **Analytics de tienda en línea:** páginas más visitadas, productos más buscados, conversión
  - **Control de pagos contra-entrega:** efectivo recaudado, transferencias confirmadas
  - **Análisis de competencia** automático con precios de mercado
  - Cuadre de caja diario, reportes de fidelización

- **Control de turnos y Cajeros:** Apertura/cierre de turno con arqueo, múltiples cajas activas simultáneas, traspaso seguro entre turnos

- **Supervisión y control:**
  - Dashboard de monitoreo en tiempo real con **pedidos en línea activos** y **domiciliarios en ruta**
  - **Asistente AI** para consultas administrativas en lenguaje natural
  - **Panel de liquidaciones** pendientes y alertas de pagos
  - **Dashboard de órdenes** de proveedores pendientes
  - **Monitoreo de domiciliarios** con GPS en tiempo real
  - Autorización de descuentos/devoluciones, acceso de emergencia
  - **Visualización de usuarios en línea** y domiciliarios activos
  - **Alertas inteligentes** con contexto y sugerencias de acción

- **Seguridad y auditoría:** Trazabilidad completa de transacciones presenciales y domicilios, control de retiros de efectivo, bitácora detallada de eventos, **historial de cambios de precios automáticos**, **detección AI de patrones anómalos**, **auditoría de liquidaciones**, **auditoría de interacciones con proveedores**, **logs de entregas y GPS**

- **Funcionalidades administrativas:**
  - Gestión de usuarios con roles (incluye **rol de domiciliario**)
  - **Gestión de proveedores terceros** con configuración de comisiones
  - **Administración del portal de proveedores** con aprobación de registros
  - **Gestión de domiciliarios** con asignación de zonas y horarios
  - Registro de clientes con programa de fidelización
  - Configuración de IVA colombiano, **configuración de métodos de costeo y márgenes**
  - **Configuración de zonas de entrega** y tarifas
  - **Gestión de contenido SEO** (meta descriptions, títulos, etc.)
  - **Configuración de modelos AI** y parámetros de optimización

- **Gestión de personal:**
  - Control de horarios y asistencia (cajeros, supervisores y domiciliarios)
  - Cálculo de comisiones por ventas y entregas
  - **Métricas de desempeño** con análisis AI de eficiencia
  - **Evaluación de domiciliarios** con métricas de puntualidad y satisfacción

- **Reportes específicos multi-turno:** Consolidado diario, análisis por franjas horarias, control de faltantes y sobrantes

- **Funcionalidades operativas adicionales:** Actualización de precios en tiempo real, sistema de comunicación interna, respaldo automático

**REQUISITOS TÉCNICOS:**

- **Monorepo:** pnpm workspaces para gestión del monorepo
- **Gestor de paquetes:** pnpm para gestión de dependencias
- **Framework:** NextJS 15.5 con App Router para todas las aplicaciones web
- **Agente:** Go para el device-agent de seguridad
- **TypeScript** para seguridad de tipos en todo el monorepo
- **Base de datos:** PostgreSQL nativo del sistema operativo (sin Docker)
- **Vector Database:** pgvector extension para embeddings y búsquedas semánticas
- **AI/LLM:** OpenAI API o Anthropic Claude API para funcionalidades LLM
- **UI:** shadcn/ui compartido en packages/ui
- **Storage:** Vercel Blob Storage para manejo de archivos
- **Autenticación:** AuthJS 5 (beta) compartido en packages/auth
- **Estilos:** Tailwind CSS con configuración compartida
- **Validación:** Zod para validación de formularios compartida
- **API:** tRPC para comunicación entre aplicaciones
- **WebSockets:** Para actualizaciones en tiempo real de pedidos, órdenes y tracking
- **PWA:** Service Workers para entrega.meerkato.co (funcionalidad offline)
- **SEO:** Optimizado con Next.js (meta tags, sitemap, structured data) para storefront
- **Deploy:** Vercel con configuración multi-app

**POLÍTICAS DE ELIMINACIÓN DE DATOS (SOFT DELETE):**
- **NUNCA se hace DELETE físico de registros** en la base de datos
- **Implementación obligatoria de soft delete** en todas las tablas principales:
  - Campo `deleted_at` (timestamp nullable) en todas las tablas
  - Campo `deleted_by` (referencia al usuario que realizó la eliminación)
  - Campo `deletion_reason` (texto opcional para documentar motivo)
- **Comportamiento de soft delete:**
  - Productos "eliminados" no aparecen en catálogo ni tienda en línea pero se conservan para reportes históricos **y análisis AI**
  - **Productos en consignación** eliminados mantienen historial para liquidaciones
  - **Proveedores "eliminados"** no pueden acceder al portal pero su historial se mantiene
  - **Domiciliarios "eliminados"** no pueden acceder a la app pero su historial de entregas se conserva
  - Usuarios "eliminados" no pueden iniciar sesión pero su historial de transacciones se mantiene para **entrenamiento de modelos**
  - Ventas y transacciones NUNCA se eliminan, solo se pueden marcar como anuladas
  - **Liquidaciones** no se eliminan físicamente para mantener trazabilidad contable
  - **Órdenes de compra** no se eliminan físicamente para auditoría
  - **Entregas** no se eliminan físicamente para métricas históricas
  - Clientes "eliminados" no pueden hacer pedidos pero su historial se preserva para **análisis de patrones**
- **Filtros automáticos** en todas las consultas para excluir registros con `deleted_at NOT NULL`
- **Funciones de restauración** para reactivar registros eliminados por error
- **Reportes de auditoría** que incluyan registros eliminados cuando sea necesario
- **Purga automática** opcional (configurable) de registros muy antiguos (ej: después de 7 años según normativas contables)

**ESTRUCTURA DE SUBDOMINIOS Y RUTAS:**

- **meerkato.co (Storefront - Tienda en Línea):**
  - `/` - Homepage de la tienda con **recomendaciones AI**
  - `/productos` - Catálogo completo con **búsqueda inteligente**
  - `/productos/[slug]` - Página individual de producto con **productos relacionados AI**
  - `/categoria/[slug]` - Página de categoría
  - `/carrito` - Carrito de compras con **sugerencias de productos complementarios**
  - `/checkout` - Proceso de compra (solo selección de método de pago contra-entrega)
  - `/login` - Inicio de sesión de clientes
  - `/registro` - Registro de nuevos clientes
  - `/mi-cuenta` - Cuenta del cliente con **recomendaciones personalizadas**
  - `/pedidos` - Historial de pedidos del cliente
  - `/seguimiento/[id]` - Seguimiento de pedido específico con tracking GPS
  - `/nosotros` - Sobre el negocio
  - `/contacto` - Información de contacto

- **pos.meerkato.co (Panel Administrativo POS):**
  - `/` - Dashboard principal del POS con **insights AI**
  - `/login` - Login del personal del minimarket (requiere agente para cajeros/supervisores)
  - `/ventas` - Módulo de ventas con **sugerencias inteligentes**
  - `/productos` - Gestión de productos con **análisis de rendimiento AI**
  - `/inventario` - Control de inventario con **predicciones de demanda**
  - `/pedidos` - Gestión de pedidos online
  - `/domicilios` - Dashboard de entregas con **optimización de rutas** y **tracking GPS**
  - `/reportes` - Reportes y analytics con **insights generados por AI**
  - `/consignacion` - **Gestión de productos en consignación y proveedores terceros**
  - `/liquidaciones` - **Panel de liquidaciones y pagos a proveedores**
  - `/proveedores` - **Gestión del portal de proveedores y aprobaciones**
  - `/ordenes-compra` - **Gestión de órdenes de compra a proveedores**
  - `/domiciliarios` - **Gestión de domiciliarios, zonas y horarios**
  - `/usuarios` - Gestión de usuarios y roles
  - `/configuracion` - Configuración del sistema
  - `/papelera` - **Vista de registros eliminados (soft deleted)**
  - `/ai-insights` - **Panel de análisis AI y configuración de modelos**

- **proveedores.meerkato.co (Portal de Proveedores):**
  - `/` - Homepage del portal de proveedores
  - `/login` - Login específico para proveedores
  - `/registro` - Registro de nuevos proveedores
  - `/dashboard` - Dashboard principal del proveedor
  - `/catalogo` - Gestión de catálogo de productos
  - `/catalogo/nuevo` - Agregar nuevo producto
  - `/catalogo/masivo` - Carga masiva de productos
  - `/ordenes` - Órdenes recibidas y estados
  - `/ordenes/[id]` - Detalle de orden específica
  - `/precios` - Gestión de precios y promociones
  - `/entregas` - Programación y tracking de entregas
  - `/reportes` - Reportes de ventas y performance
  - `/comunicacion` - Chat y mensajes con el minimarket
  - `/perfil` - Configuración de perfil y contactos
  - `/ayuda` - Centro de ayuda y documentación

- **entrega.meerkato.co (App Móvil para Domiciliarios):**
  - `/` - Dashboard de entregas del día
  - `/login` - Login específico para domiciliarios (sin agente, con geolocalización)
  - `/pedidos` - Lista de pedidos asignados
  - `/pedido/[id]` - Detalle del pedido específico con navegación
  - `/mapa` - Mapa con todas las entregas y rutas optimizadas
  - `/ruta` - Ruta optimizada paso a paso
  - `/entrega/[id]` - Pantalla de confirmación de entrega
  - `/liquidacion` - Liquidación de efectivo y comisiones del turno
  - `/perfil` - Configuración personal y datos de contacto
  - `/ayuda` - Centro de ayuda y contactos de emergencia
  - `/soporte` - Chat directo con supervisores

**REQUISITOS DE AUTENTICACIÓN Y SEGURIDAD:**

- **Autenticación por aplicación:**
  - **Clientes (meerkato.co):** Registro público con email/teléfono + contraseña
  - **Personal (pos.meerkato.co):** Login con validación de agente para cajeros/supervisores
  - **Proveedores (proveedores.meerkato.co):** Login independiente con aprobación previa
  - **Domiciliarios (entrega.meerkato.co):** Login móvil con geolocalización y turno activo

- **Sistema de roles unificado:**
  - **Administradores:** Acceso completo a pos.meerkato.co desde cualquier dispositivo
  - **Gerentes:** Acceso limitado a pos.meerkato.co desde cualquier dispositivo
  - **Supervisores:** Acceso a pos.meerkato.co solo desde terminales con agente
  - **Cajeros:** Acceso restringido a pos.meerkato.co solo desde terminales con agente
  - **Domiciliarios:** Acceso a entrega.meerkato.co desde dispositivos móviles
  - **Proveedores:** Acceso completo a proveedores.meerkato.co
  - **Clientes:** Acceso a meerkato.co y área personal

- **Control de sesiones y seguridad:**
  - **Cajeros/Supervisores:** Device agent + IP autorizada + sesión única
  - **Domiciliarios:** Geolocalización + turno activo + timeout automático
  - **Proveedores:** Sesiones independientes con tiempo de expiración
  - **Administradores/Gerentes:** Sesiones flexibles con 2FA opcional
  - **Clientes:** Sesiones estándar web

- **Comunicación segura** entre aplicaciones del monorepo via tRPC
- **Dashboard de usuarios en línea** para supervisores y administradores
- **Logs de auditoría** por aplicación y rol

**MÉTODOS DE PAGO ESPECÍFICOS:**

- **Ventas Presenciales (pos.meerkato.co):**
  - Efectivo
  - Tarjetas de débito y crédito
  - Billeteras digitales (Nequi, Daviplata, Bancolombia a la Mano, Movii)
  - PSE (Pagos Seguros en Línea)
  - Códigos QR para pagos digitales
  - Pagos mixtos (combinación de métodos)

- **Pedidos en Línea (meerkato.co + entrega.meerkato.co - Contra-entrega únicamente):**
  - **Efectivo:** Procesado por domiciliario en entrega.meerkato.co
  - **Tarjeta débito/crédito:** Domiciliario procesa con datafono móvil
  - **Transferencias bancarias:** Cliente transfiere al momento de entrega con confirmación del domiciliario

**ARQUITECTURA WHITE LABEL FÍSICO:**
- **Una aplicación independiente por comercio** (sin multi-tenancy)
- **Configuración personalizable** compartida entre las cuatro aplicaciones:
  - Logos, colores, nombre del establecimiento
  - Subdominios personalizables (ej: tienda.comercio.com, pos.comercio.com, proveedores.comercio.com, entrega.comercio.com)
- **SEO personalizado** por comercio para el storefront
- **Modelos AI personalizados** por tipo de negocio y patrones locales
- **Sistema de configuración inicial** para setup del comercio
- **Plantillas de configuración** para diferentes tipos de negocio

**GESTIÓN DE CÓDIGOS DE BARRAS MÚLTIPLES:**
- **Tabla de códigos alternativos** vinculados al mismo producto
- **Búsqueda por cualquier código** asociado al producto
- **Gestión de proveedores** y sus códigos específicos
- **Historial de códigos** para auditoría
- **Importación masiva** de códigos desde Excel/CSV
- **Integración con catálogos** de proveedores del portal
- **AI para detección automática** de códigos duplicados o problemáticos
- **Escaneo móvil** de códigos desde entrega.meerkato.co para verificación

**SISTEMA DE RECOSTEO Y PRECIOS AUTOMÁTICO:**
- **Motor de cálculo de costos** con múltiples métodos (solo productos propios)
- **Configuración por producto:**
  - Tipo de producto (Propio vs Consignación)
  - Método de costeo (FIFO, LIFO, Promedio, Específico, Estándar) - solo productos propios
  - Margen de ganancia (porcentaje o valor fijo) - solo productos propios
  - **Comisión por consignación** (0% a 100%) - solo productos en consignación
  - Reglas de redondeo personalizables
  - Precios mínimos y máximos
- **Recálculo automático** al recibir mercancía nueva (productos propios)
- **Integración con precios** de catálogos de proveedores
- **Sugerencias AI de precios** basadas en análisis de competencia
- **Historial de costos** y cambios de precios
- **Alertas de márgenes bajos** o negativos con **recomendaciones AI**
- **Simulación de precios** antes de confirmar compras
- **Excepciones manuales** para casos especiales

**SISTEMA DE FIDELIZACIÓN EXTENSIBLE:**
- **Arquitectura modular** basada en plugins/estrategias
- **Configuración flexible** de reglas de fidelización
- **Motor de promociones** configurable con **AI para personalización**
- **API para extensiones** futuras
- **Integración entre storefront, POS y delivery**
- **Tipos de fidelización predefinidos:**
  - Acumulación de puntos
  - Descuentos escalonados
  - Promociones temporales
  - Membresías VIP
  - Cupones personalizados
  - Envío gratis por fidelidad

**IMPLEMENTACIÓN DE AI/VECTORES:**
- **Base de datos vectorial** con pgvector para embeddings
- **Modelos de embeddings** para productos, usuarios y transacciones
- **Pipeline de procesamiento** para generar insights automáticos
- **Sistema de recomendaciones** basado en similitud coseno
- **Análisis de sentimientos** para reseñas y feedback
- **Predicción de demanda** usando series temporales y ML
- **Optimización de rutas** con algoritmos genéticos y clustering
- **Detección de anomalías** en patrones de venta
- **Generación de contenido** SEO con LLM
- **Chatbot administrativo** con RAG sobre documentación del sistema
- **Asistente para proveedores** en el portal de autoservicio
- **Asistente para domiciliarios** con navegación y soporte

**REQUISITOS SEO Y DISEÑO:**
- **SEO completo para storefront (meerkato.co):**
  - Meta titles y descriptions dinámicos **generados por AI**
  - URLs amigables y slugs optimizados
  - Sitemap.xml automático
  - Robots.txt configurado
  - Structured data (JSON-LD) para productos
  - Open Graph y Twitter Cards
  - Breadcrumbs navegacionales
  - Optimización de imágenes con alt tags **generados por AI**
- **Interfaz limpia y moderna** con paleta de colores **configurable** compartida
- **Storefront atractivo** y fácil de usar en móviles
- **Portal de proveedores intuitivo** y fácil de navegar
- **App de domiciliarios ultra-optimizada** para uso móvil en movimiento
- **Panel administrativo POS** optimizado para uso rápido en caja
- Retroalimentación visual clara para todas las acciones
- Estados de carga y manejo robusto de errores
- Diseño touch-friendly para tablets y dispositivos móviles
- Accesibilidad y contraste adecuado para uso prolongado

**ESTRUCTURA DE BASE DE DATOS:**
- Esquema único por instalación con PostgreSQL **compartida entre las cuatro aplicaciones**
- **Extensión pgvector** para manejo de embeddings
- **Todas las tablas principales incluyen campos de soft delete:**
  - `deleted_at TIMESTAMP NULL`
  - `deleted_by INTEGER REFERENCES users(id)`
  - `deletion_reason TEXT NULL`
- **Tablas específicas para portal de proveedores:**
  - `suppliers` - Proveedores con acceso al portal
  - `supplier_contacts` - Múltiples contactos por proveedor (vendedor, supervisor, etc.)
  - `supplier_catalogs` - Catálogos de productos por proveedor
  - `supplier_prices` - Precios y promociones de proveedores
  - `purchase_orders` - Órdenes de compra generadas
  - `order_communications` - Mensajes entre minimarket y proveedor
  - `delivery_schedules` - Programación de entregas
  - `supplier_evaluations` - Evaluaciones de performance
- **Tablas específicas para domiciliarios:**
  - `delivery_personnel` - Domiciliarios con datos de contacto y zonas
  - `delivery_routes` - Rutas optimizadas por AI
  - `delivery_tracking` - GPS tracking en tiempo real
  - `delivery_payments` - Pagos contra-entrega procesados
  - `delivery_incidents` - Incidencias durante entregas
  - `delivery_evaluations` - Evaluaciones de clientes sobre entregas
- **Tablas específicas para consignación:**
  - `third_party_suppliers` - Proveedores terceros
  - `consignment_products` - Productos en consignación
  - `commission_settings` - Configuración de comisiones (0% a 100%)
  - `liquidations` - Liquidaciones por proveedor
  - `supplier_payments` - Pagos realizados a proveedores
  - `consignment_returns` - Devoluciones de productos no vendidos
- **Tablas específicas para AI:**
  - `product_embeddings` - Vectores de productos para recomendaciones
  - `customer_embeddings` - Vectores de comportamiento de clientes
  - `ai_insights` - Insights generados automáticamente
  - `prediction_models` - Configuración y métricas de modelos
  - `recommendation_logs` - Historial de recomendaciones y efectividad
  - `route_optimizations` - Optimizaciones de rutas por AI
- **Tablas principales:**
  - productos, códigos_alternativos, costos_historicos, precios_historicos
  - usuarios (con roles para diferentes aplicaciones)
  - clientes (específicos para storefront)
  - ventas, pedidos_online, domicilios, zonas_entrega, pagos_contra_entrega
  - inventario, turnos, fidelización, auditoría, configuraciones, márgenes_configuracion
  - seo_config, categorias
- **Índices específicos para soft delete:** `CREATE INDEX idx_[tabla]_not_deleted ON [tabla] (id) WHERE deleted_at IS NULL`
- **Índices vectoriales** para búsquedas de similitud eficientes
- **Índices geoespaciales** para optimización de rutas
- **Índices optimizados** para consultas frecuentes de cada aplicación
- **Triggers** para sincronización automática entre aplicaciones
- **Views o funciones** para consultas que automáticamente excluyan registros eliminados

Por favor, crea esto como un **monorepo completo** y listo para producción. Configura la estructura del monorepo con **Turborepo**, implementa las **cuatro aplicaciones separadas** (storefront, pos, suppliers, delivery) más el **device-agent en Go** con autenticación segura diferenciada por roles, **sistema completo de soft delete**, **portal completo de autoservicio para proveedores**, **app móvil ultra-optimizada para domiciliarios**, **sistema completo de consignación con comisiones (incluyendo 0%)**, **integración completa de AI/LLM y vectores**, sistema de códigos múltiples, recosteo automático, fidelización extensible y **tienda en línea completamente integrada con pagos contra-entrega**. Enfócate en crear algo que luzca profesional y que realmente se pueda instalar para diferentes minimarkets con **capacidades AI avanzadas**, **gestión completa de productos en consignación**, **portal autónomo para proveedores** y **sistema completo de domicilios con app móvil dedicada**.

El monorepo debe incluir datos de demostración realistas para poder probar todas las funcionalidades inmediatamente, incluyendo productos con múltiples códigos de barras, **productos propios y en consignación**, **proveedores con catálogos activos**, **domiciliarios con rutas asignadas**, diferentes métodos de costeo configurados, sistemas de fidelización, **embeddings precalculados**, **proveedores terceros con diferentes comisiones (incluyendo 0%)** y **las cuatro aplicaciones funcionando de manera integrada**.

Cuando termines, proporciona instrucciones detalladas sobre cómo:
1. **Configurar el monorepo** con pnpm workspaces y estructura de carpetas
2. Configurar la base de datos PostgreSQL nativa con pgvector **compartida**
3. Configurar las variables de entorno para personalización **y APIs de AI**
4. **Configurar los subdominios** localmente para desarrollo
5. **Compilar y ejecutar el device-agent** en Go
6. Ejecutar las cuatro aplicaciones simultáneamente
7. Probar cada aplicación y rol de usuario
8. Configurar un nuevo comercio (personalización white label)
9. Gestionar productos con múltiples códigos de barras
10. Configurar métodos de recosteo y márgenes automáticos
11. Configurar y extender sistemas de fidelización
12. **Configurar zonas de entrega y gestionar domicilios**
13. **Probar el flujo completo de tienda en línea y pedidos contra-entrega**
14. **Probar la app móvil de domiciliarios con GPS y pagos**
15. **Optimizar SEO y configurar meta tags personalizados**
16. **Gestionar el sistema de soft delete y recuperación de registros**
17. **Configurar y entrenar modelos AI, embeddings y sistema de recomendaciones**
18. **Probar funcionalidades AI: predicciones, recomendaciones, análisis y optimizaciones**
19. **Gestionar productos en consignación: registro, comisiones, liquidaciones y pagos**
20. **Configurar proveedores terceros y probar el flujo completo de consignación**
21. **Configurar el portal de proveedores y probar el flujo completo de autoservicio**
22. **Probar generación de órdenes de compra desde catálogos de proveedores**
23. **Probar el sistema completo de domicilios con seguimiento GPS**
24. **Deploy en Vercel** con configuración multi-app y subdominios
