# 🏪 Meerkato POS - Sistema Integral de Minimarket

Una aplicación moderna y completa de Punto de Venta (POS) para minimarkets, desarrollada con **NextJS 15** y **arquitectura de monorepo**. Sistema **white label físico** con **cuatro portales separados por subdominios**, **integración de AI/LLM**, **sistema completo de consignación**, **portal de autoservicio para proveedores** y **app móvil para domiciliarios**.

## 🌟 Características Principales

### 🏗️ Arquitectura de Monorepo
- **4 aplicaciones NextJS independientes** con subdominios separados
- **Packages compartidos** para UI, base de datos, autenticación y AI
- **Turborepo** para desarrollo y deployment optimizado
- **TypeScript** para seguridad de tipos en todo el proyecto

### 🔐 Sistema de Autenticación Multi-Rol
- **AuthJS 5.0** con adaptador de Prisma
- **Device Agent en Go** para validación de terminales POS
- **Roles diferenciados:** Admin, Manager, Supervisor, Cashier, Delivery, Supplier, Customer
- **Restricciones por dispositivo** para cajeros y supervisores

### 🤖 Integración de AI/LLM
- **OpenAI API** para funcionalidades inteligentes
- **pgvector** para embeddings y búsquedas semánticas
- **Recomendaciones personalizadas** de productos
- **Predicción de demanda** y optimización de inventario
- **Optimización de rutas** de domicilio con AI
- **Análisis de precios** competitivos
- **Insights automáticos** de negocio

### 🤝 Sistema Completo de Consignación
- **Productos propios y en consignación** con gestión separada
- **Comisiones configurables** (0% a 100%) por proveedor/producto
- **Liquidaciones automáticas** con cálculo de comisiones
- **Proveedores terceros** con gestión independiente
- **Trazabilidad completa** del ciclo de vida del producto

### 🛒 Tienda en Línea Integrada
- **SEO optimizado** con meta tags dinámicos y sitemap
- **Páginas dinámicas** para productos y categorías
- **Carrito de compras** con recomendaciones AI
- **Sistema de pedidos** para domicilio
- **Pagos contra-entrega** únicamente

### 🚚 Sistema Completo de Domicilios
- **App móvil PWA** ultra-optimizada para domiciliarios
- **Tracking GPS** en tiempo real
- **Rutas optimizadas** por AI
- **Pagos contra-entrega** (efectivo, tarjeta, transferencias)
- **Gestión de zonas** de entrega
- **Liquidación automática** de domiciliarios

## 📱 Aplicaciones del Monorepo

### 🏪 [meerkato.co] - Storefront (Puerto 3000)
**Tienda en línea pública para clientes**
- Catálogo de productos con búsqueda inteligente
- Sistema de pedidos para domicilio
- Recomendaciones AI personalizadas
- SEO completo y structured data
- Programa de fidelización

### 💼 [pos.meerkato.co] - POS Admin (Puerto 3001)
**Panel administrativo para el minimarket**
- Dashboard con insights AI en tiempo real
- Módulo de ventas presenciales
- Gestión completa de inventario
- Control de turnos y cajeros
- Gestión de domicilios con tracking GPS
- Sistema de consignación y liquidaciones
- Administración del portal de proveedores
- Reportes avanzados con análisis AI

### 🤝 [proveedores.meerkato.co] - Portal Proveedores (Puerto 3002)
**Portal de autoservicio para proveedores**
- Dashboard personalizado del proveedor
- Gestión autónoma de catálogos
- Carga masiva de productos (Excel/CSV)
- Actualización de precios en tiempo real
- Gestión de órdenes de compra
- Programación de entregas
- Reportes de performance y ventas
- Comunicación directa con el minimarket

### 🚚 [entrega.meerkato.co] - Delivery PWA (Puerto 3003)
**App móvil para domiciliarios**
- PWA instalable como app nativa
- Dashboard de entregas del día
- Navegación con GPS y rutas optimizadas AI
- Procesamiento de pagos contra-entrega
- Tracking en tiempo real
- Liquidación de efectivo y comisiones
- Comunicación con el centro de operaciones

### 🔐 Device Agent (Puerto 8181)
**Agente de seguridad en Go**
- Validación de terminales POS autorizadas
- Fingerprinting de hardware
- Tokens rotativos de seguridad
- API REST localhost-only

## 🗄️ Base de Datos y Tecnologías

### **PostgreSQL con pgvector**
- **Prisma ORM** para gestión de datos
- **Extensión pgvector** para embeddings AI
- **Soft delete** implementado en todas las tablas
- **Esquema completo** con más de 30 tablas
- **Migraciones automáticas** y seed de datos demo

### **Stack Tecnológico**
- **Frontend:** NextJS 15.5, React 18, TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Base de Datos:** PostgreSQL + pgvector
- **ORM:** Prisma
- **Auth:** AuthJS 5.0 (beta)
- **AI:** OpenAI API + embeddings
- **Monorepo:** Turborepo
- **Deployment:** Vercel + Docker

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js 20+**
- **npm 10+**
- **Docker & Docker Compose** (para base de datos)
- **Go 1.21+** (para device agent)
- **PostgreSQL** con extensión pgvector

### 1. Configuración Inicial
```bash
# Clonar el repositorio
git clone <repository-url>
cd meerkato-pos

# Ejecutar script de configuración automática
./scripts/setup-dev.sh
```

### 2. Configuración Manual (Alternativa)

#### Instalar Dependencias
```bash
npm install
```

#### Configurar Base de Datos
```bash
# Iniciar PostgreSQL con Docker
docker-compose up -d postgres

# Crear schema y migrar
npm run db:push

# Poblar con datos demo
npm run db:seed
```

#### Configurar Subdominios Locales
Agregar a `/etc/hosts` (macOS/Linux) o `C:\Windows\System32\drivers\etc\hosts` (Windows):
```
127.0.0.1 meerkato.local
127.0.0.1 pos.meerkato.local
127.0.0.1 proveedores.meerkato.local
127.0.0.1 entrega.meerkato.local
```

#### Compilar Device Agent
```bash
cd device-agent
go mod tidy
go build -o device-agent main.go
```

#### Configurar Variables de Entorno
```bash
cp .env.example .env.local
# Editar .env.local con tus configuraciones
```

### 3. Ejecutar en Desarrollo

#### Opción 1: Script Automático
```bash
./scripts/start-dev.sh
```

#### Opción 2: Manual
```bash
# Terminal 1: Todas las apps NextJS
npm run dev

# Terminal 2: Device Agent
cd device-agent && ./device-agent

# Terminal 3: Base de datos (si no está corriendo)
docker-compose up postgres
```

## 📋 Cuentas de Prueba

| Rol | Email | Contraseña | Notas |
|-----|-------|------------|-------|
| **Admin** | admin@meerkato.co | password123 | Acceso completo |
| **Manager** | manager@meerkato.co | password123 | Gestión operativa |
| **Supervisor** | supervisor@meerkato.co | password123 | Requiere device agent |
| **Cashier** | cashier@meerkato.co | password123 | Requiere device agent |
| **Delivery** | delivery@meerkato.co | password123 | App móvil |
| **Supplier** | supplier@distribuidora.co | password123 | Portal proveedores |
| **Customer** | customer@gmail.com | password123 | Tienda en línea |

## 🌐 URLs de Desarrollo

| Aplicación | URL | Puerto |
|------------|-----|--------|
| **Storefront** | http://meerkato.local:3000 | 3000 |
| **POS Admin** | http://pos.meerkato.local:3001 | 3001 |
| **Suppliers Portal** | http://proveedores.meerkato.local:3002 | 3002 |
| **Delivery PWA** | http://entrega.meerkato.local:3003 | 3003 |
| **Device Agent** | http://localhost:8181 | 8181 |
| **Database Admin** | http://localhost:8080 | 8080 |

## 📊 Funcionalidades Implementadas

### ✅ Sistema Base
- [x] Arquitectura de monorepo con Turborepo
- [x] Autenticación multi-rol con AuthJS
- [x] Base de datos PostgreSQL + pgvector
- [x] Device Agent en Go para seguridad
- [x] UI compartida con shadcn/ui

### ✅ Gestión de Productos
- [x] Catálogo con múltiples códigos de barras
- [x] Clasificación: Propios, Consignación, Ambos
- [x] Métodos de costeo (FIFO, LIFO, Promedio)
- [x] Gestión de categorías y precios
- [x] Control de inventario y stock

### ✅ Sistema de Consignación
- [x] Proveedores terceros
- [x] Comisiones configurables (0% a 100%)
- [x] Liquidaciones automáticas
- [x] Trazabilidad completa
- [x] Reportes especializados

### ✅ Portal de Proveedores
- [x] Dashboard personalizado
- [x] Gestión de catálogos
- [x] Órdenes de compra digitales
- [x] Programación de entregas
- [x] Comunicación integrada

### ✅ Sistema de Domicilios
- [x] App móvil PWA
- [x] Tracking GPS simulado
- [x] Rutas optimizadas AI
- [x] Pagos contra-entrega
- [x] Liquidación de domiciliarios

### ✅ Tienda en Línea
- [x] Catálogo público SEO-optimizado
- [x] Sistema de pedidos
- [x] Carrito de compras
- [x] Páginas dinámicas de productos
- [x] Recomendaciones AI

### ✅ Integración AI/LLM
- [x] Servicio AI con OpenAI
- [x] Embeddings con pgvector
- [x] Recomendaciones de productos
- [x] Predicción de demanda
- [x] Optimización de precios
- [x] Insights de negocio

### ✅ Ventas y Reportes
- [x] Módulo de ventas POS
- [x] Control de turnos
- [x] Dashboard con métricas
- [x] Reportes básicos
- [x] Análisis por AI

## 🔧 Scripts Disponibles

### Desarrollo
```bash
npm run dev              # Ejecutar todas las apps en desarrollo
npm run build            # Compilar todas las apps
npm run lint             # Ejecutar linting
npm run format           # Formatear código con Prettier
```

### Base de Datos
```bash
npm run db:push          # Aplicar schema a la base de datos
npm run db:seed          # Poblar con datos demo
npm run db:migrate       # Ejecutar migraciones
npm run db:studio        # Abrir Prisma Studio
```

### Device Agent
```bash
cd device-agent
go run main.go           # Ejecutar en desarrollo
go build -o device-agent main.go  # Compilar
```

## 🌍 Despliegue en Producción

### Vercel (Recomendado)
1. **Configurar proyectos separados** en Vercel para cada app
2. **Configurar variables de entorno** en cada proyecto
3. **Configurar subdominios** en tu dominio
4. **Deploy automático** desde Git

### Docker
```bash
# Construir imágenes
docker build -t meerkato-storefront ./apps/storefront
docker build -t meerkato-pos ./apps/pos
docker build -t meerkato-suppliers ./apps/suppliers
docker build -t meerkato-delivery ./apps/delivery

# Ejecutar con docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

## 🔐 Seguridad

### Autenticación
- **AuthJS 5.0** con adaptador Prisma
- **Sesiones JWT** con tokens seguros
- **Device validation** para terminales POS
- **Role-based access control** (RBAC)

### Device Agent
- **Solo conexiones localhost**
- **Tokens rotativos** cada 15 minutos
- **Fingerprinting de hardware**
- **Validación de sessiones**

### Base de Datos
- **Soft delete** en todas las tablas
- **Auditoría completa** de transacciones
- **Encriptación de passwords** con bcrypt
- **Validación con Zod** en APIs

## 📈 Funcionalidades AI Implementadas

### Recomendaciones
- **Productos similares** usando similitud vectorial
- **Recomendaciones personalizadas** por comportamiento del cliente
- **Cross-selling y up-selling** automático

### Optimización
- **Predicción de demanda** usando datos históricos
- **Optimización de precios** con análisis de competencia
- **Rutas de entrega** optimizadas con algoritmos inteligentes
- **Gestión de inventario** predictiva

### Análisis
- **Insights de negocio** generados automáticamente
- **Análisis de tendencias** de venta
- **Detección de anomalías** en transacciones
- **Reportes inteligentes** con explicaciones contextuales

## 🔄 Soft Delete y Auditoría

### Política de Eliminación
- **NUNCA se hace DELETE físico** de registros
- **Soft delete obligatorio** con campos:
  - `deleted_at` (timestamp)
  - `deleted_by` (usuario)
  - `deletion_reason` (motivo)

### Auditoría Completa
- **Trazabilidad total** de transacciones
- **Logs de cambios** en precios y costos
- **Historial de liquidaciones**
- **Auditoría de interacciones** con proveedores

## 📱 Progressive Web App (PWA)

### App de Domiciliarios
- **Instalable** como app nativa
- **Offline capability** para funcionalidad básica
- **Push notifications** para nuevos pedidos
- **Optimizada para mobile** con touch targets grandes
- **Service Workers** para cache inteligente

## 🤝 Contribuir

### Estructura del Proyecto
```
meerkato-pos/
├── apps/
│   ├── storefront/      # Tienda en línea
│   ├── pos/             # Panel administrativo
│   ├── suppliers/       # Portal proveedores
│   └── delivery/        # App domiciliarios
├── packages/
│   ├── ui/              # Componentes compartidos
│   ├── database/        # Prisma + tipos
│   ├── auth/            # Autenticación
│   └── ai/              # Servicios AI
├── device-agent/        # Agente Go
├── scripts/             # Scripts de desarrollo
└── database/            # Configuración DB
```

### Flujo de Desarrollo
1. **Fork** el repositorio
2. **Crear branch** para feature
3. **Desarrollar** con TypeScript y tests
4. **Seguir convenciones** de código
5. **Submit PR** con descripción detallada

## 📞 Soporte

### Documentación
- **README completo** con instrucciones detalladas
- **Código comentado** en componentes complejos
- **Scripts automatizados** para setup
- **Ejemplos de uso** en cada funcionalidad

### Issues y Bugs
- **Reportar issues** en GitHub
- **Incluir logs** y pasos para reproducir
- **Especificar entorno** y versiones
- **Screenshots** si es pertinente

---

## 🏆 Tecnologías Utilizadas

| Categoría | Tecnología | Versión |
|-----------|------------|---------|
| **Frontend** | NextJS | 15.5 |
| **React** | React | 18.3 |
| **Language** | TypeScript | 5.6 |
| **Styling** | Tailwind CSS | 3.4 |
| **UI Library** | shadcn/ui | Latest |
| **Database** | PostgreSQL | 16+ |
| **Vector DB** | pgvector | Latest |
| **ORM** | Prisma | 5.22 |
| **Auth** | AuthJS | 5.0-beta |
| **AI** | OpenAI API | 4.69 |
| **Monorepo** | Turborepo | 2.3 |
| **Device Agent** | Go | 1.21+ |
| **Deployment** | Vercel | Latest |
| **Containers** | Docker | Latest |

---

**🏪 Meerkato POS** - Sistema integral de punto de venta para minimarkets del futuro.

*Desarrollado con ❤️ usando las mejores prácticas de desarrollo moderno.*