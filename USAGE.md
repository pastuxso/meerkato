# 📖 Guía de Uso - Meerkato POS

Esta guía detalla cómo configurar, ejecutar y utilizar el sistema completo de Meerkato POS, desde la instalación inicial hasta el uso diario de todas las funcionalidades.

## 🚀 Configuración Inicial

### 1. Prerrequisitos del Sistema

Antes de comenzar, asegúrate de tener instalado:

```bash
# Verificar versiones
node --version    # Debe ser 20.0.0 o superior
npm --version     # Debe ser 10.0.0 o superior
docker --version  # Para la base de datos
go version        # Para el device agent (1.21+)
```

### 2. Instalación Automática

**Opción Recomendada:** Usar el script de configuración automática

```bash
# Clonar el repositorio
git clone <repository-url>
cd meerkato-pos

# Ejecutar configuración automática
./scripts/setup-dev.sh
```

Este script:
- ✅ Instala todas las dependencias
- ✅ Configura la base de datos PostgreSQL
- ✅ Ejecuta migraciones y seed
- ✅ Compila el device agent
- ✅ Crea archivos de configuración

### 3. Instalación Manual

Si prefieres configurar paso a paso:

#### 3.1 Instalar Dependencias
```bash
npm install
```

#### 3.2 Configurar Base de Datos
```bash
# Iniciar PostgreSQL con Docker
docker-compose up -d postgres

# Esperar que la DB esté lista (30 segundos)
sleep 30

# Aplicar schema
npm run db:push

# Poblar con datos demo
npm run db:seed
```

#### 3.3 Configurar Subdominios Locales
Agregar estas líneas a tu archivo `/etc/hosts` (macOS/Linux) o `C:\Windows\System32\drivers\etc\hosts` (Windows):

```
127.0.0.1 meerkato.local
127.0.0.1 pos.meerkato.local
127.0.0.1 proveedores.meerkato.local
127.0.0.1 entrega.meerkato.local
```

#### 3.4 Compilar Device Agent
```bash
cd device-agent
go mod tidy
go build -o device-agent main.go
cd ..
```

#### 3.5 Configurar Variables de Entorno
```bash
cp .env.example .env.local
# Editar .env.local con tus configuraciones
```

## 🏃‍♂️ Ejecutar el Sistema

### Opción 1: Script Automático (Recomendado)
```bash
./scripts/start-dev.sh
```

### Opción 2: Manual en Terminales Separadas

#### Terminal 1: Aplicaciones NextJS
```bash
npm run dev
```

#### Terminal 2: Device Agent
```bash
cd device-agent
./device-agent
```

#### Terminal 3: Base de Datos (si no está corriendo)
```bash
docker-compose up postgres
```

### URLs de Desarrollo

Una vez iniciado, las aplicaciones estarán disponibles en:

| Aplicación | URL | Puerto |
|------------|-----|--------|
| **🏪 Storefront** | http://meerkato.local:3000 | 3000 |
| **💼 POS Admin** | http://pos.meerkato.local:3001 | 3001 |
| **🤝 Suppliers** | http://proveedores.meerkato.local:3002 | 3002 |
| **🚚 Delivery** | http://entrega.meerkato.local:3003 | 3003 |
| **🔐 Device Agent** | http://localhost:8181 | 8181 |
| **🗄️ DB Admin** | http://localhost:8080 | 8080 |

## 👥 Cuentas de Prueba

El sistema incluye cuentas pre-configuradas para probar todas las funcionalidades:

### Roles Administrativos
```
Email: admin@meerkato.co
Password: password123
Rol: Administrador
Acceso: Completo al POS sin restricciones de dispositivo
```

```
Email: manager@meerkato.co
Password: password123
Rol: Gerente
Acceso: Gestión operativa del POS sin restricciones de dispositivo
```

### Roles con Restricción de Dispositivo
```
Email: supervisor@meerkato.co
Password: password123
Rol: Supervisor
Acceso: POS solo desde terminales con device agent activo
```

```
Email: cashier@meerkato.co
Password: password123
Rol: Cajero
Acceso: Funciones de venta solo desde terminales autorizadas
```

### Roles Especializados
```
Email: delivery@meerkato.co
Password: password123
Rol: Domiciliario
Acceso: App móvil de entregas con validación de geolocalización
```

```
Email: supplier@distribuidora.co
Password: password123
Rol: Proveedor
Acceso: Portal de proveedores con gestión de catálogos
```

```
Email: customer@gmail.com
Password: password123
Rol: Cliente
Acceso: Tienda en línea y área personal
```

## 🏪 Guía de Uso por Aplicación

### 1. Storefront (Tienda en Línea)

#### Para Clientes
1. **Navegar Productos**
   - Visita http://meerkato.local:3000
   - Explora categorías y productos
   - Usa la búsqueda inteligente

2. **Crear Cuenta**
   - Clic en "Iniciar Sesión" → "Registrarse"
   - Completa el formulario
   - Confirma tu email

3. **Realizar Pedido**
   - Agrega productos al carrito
   - Selecciona zona de entrega
   - Confirma pedido (pago contra-entrega)
   - Recibe confirmación y tracking

4. **Seguimiento**
   - Accede a "Mi Cuenta" → "Mis Pedidos"
   - Visualiza estado en tiempo real
   - Recibe notificaciones de progreso

### 2. POS Admin (Panel Administrativo)

#### Dashboard Principal
1. **Acceder al Sistema**
   - Navega a http://pos.meerkato.local:3001
   - Login con cuenta admin/manager
   - Visualiza métricas en tiempo real

2. **Métricas Disponibles**
   - Ventas del día y acumuladas
   - Productos con stock bajo
   - Pedidos activos de domicilio
   - Top productos más vendidos
   - Insights AI automáticos

#### Gestión de Ventas
1. **Módulo de Ventas**
   - Acceder desde el menú "Ventas"
   - Escanear códigos de barras
   - Agregar productos manualmente
   - Aplicar descuentos y promociones
   - Procesar diferentes métodos de pago

2. **Control de Turno**
   - Abrir turno con arqueo inicial
   - Registrar ventas durante el día
   - Cerrar turno con arqueo final
   - Generar reporte de diferencias

#### Gestión de Inventario
1. **Catálogo de Productos**
   - Ver todos los productos
   - Crear/editar productos
   - Gestionar códigos de barras múltiples
   - Configurar precios y márgenes
   - Clasificar: Propio/Consignación/Ambos

2. **Control de Stock**
   - Monitorear niveles actuales
   - Recibir alertas de stock bajo
   - Registrar entradas de mercancía
   - Configurar métodos de costeo (FIFO, LIFO, Promedio)

#### Sistema de Consignación
1. **Gestión de Proveedores Terceros**
   - Registrar nuevos proveedores
   - Configurar comisiones (0% a 100%)
   - Establecer términos de consignación
   - Gestionar políticas de devolución

2. **Productos en Consignación**
   - Recibir productos con fechas límite
   - Monitorear ventas vs devoluciones
   - Generar liquidaciones automáticas
   - Procesar pagos a proveedores

#### Gestión de Domicilios
1. **Dashboard de Entregas**
   - Ver pedidos en tiempo real
   - Asignar domiciliarios
   - Optimizar rutas con AI
   - Monitorear tracking GPS

2. **Gestión de Domiciliarios**
   - Registrar nuevo personal
   - Asignar zonas de trabajo
   - Configurar horarios
   - Calcular comisiones

#### Reportes y Analytics
1. **Reportes Básicos**
   - Ventas por período
   - Productos más vendidos
   - Performance de domiciliarios
   - Análisis de consignación

2. **Insights AI**
   - Predicciones de demanda
   - Sugerencias de precios
   - Análisis de tendencias
   - Recomendaciones de reabastecimiento

### 3. Portal de Proveedores

#### Para Proveedores
1. **Registro y Acceso**
   - Visita http://proveedores.meerkato.local:3002
   - Solicitar acceso (requiere aprobación)
   - Login con credenciales asignadas

2. **Dashboard del Proveedor**
   - Ver métricas de performance
   - Órdenes pendientes y completadas
   - Productos en catálogo
   - Ventas del período

3. **Gestión de Catálogo**
   - **Agregar Productos Individuales:**
     - Completar formulario detallado
     - Subir imágenes del producto
     - Establecer precios y descuentos
     - Configurar stock y tiempos de entrega

   - **Carga Masiva:**
     - Descargar plantilla Excel/CSV
     - Completar con productos
     - Subir archivo para procesamiento
     - Revisar errores y confirmar

4. **Gestión de Precios**
   - Actualizar precios individuales
   - Configurar descuentos por volumen
   - Crear promociones temporales
   - Historial de cambios

5. **Órdenes de Compra**
   - Recibir notificaciones de nuevas órdenes
   - Confirmar disponibilidad y tiempos
   - Actualizar estado de preparación
   - Programar entregas

6. **Comunicación**
   - Chat directo con el minimarket
   - Notas en órdenes específicas
   - Reportar incidencias
   - Coordinación de entregas

### 4. App de Domiciliarios

#### Para Domiciliarios
1. **Acceso y Configuración**
   - Visita http://entrega.meerkato.local:3003
   - Login con credenciales de domiciliario
   - Permitir acceso a ubicación GPS
   - Instalar como PWA en móvil

2. **Dashboard Diario**
   - Ver entregas asignadas del día
   - Métricas: pendientes, completadas, recaudado
   - Ruta activa optimizada por AI
   - Acceso rápido a acciones

3. **Gestión de Entregas**
   - **Recibir Asignaciones:**
     - Notificaciones de nuevos pedidos
     - Detalles del cliente y productos
     - Direcciones y notas especiales

   - **Navegación:**
     - Rutas optimizadas automáticamente
     - GPS turn-by-turn
     - Reordenamiento dinámico
     - Estimaciones de tiempo

4. **Proceso de Entrega**
   - **Confirmar Recogida:**
     - Marcar pedido como recogido
     - Verificar productos contra orden
     - Iniciar tracking GPS

   - **En Ruta:**
     - Navegación paso a paso
     - Llamar al cliente si necesario
     - Reportar incidencias

   - **Entrega:**
     - Confirmar llegada
     - Procesar pago contra-entrega
     - Obtener firma digital
     - Tomar foto de confirmación

5. **Pagos Contra-Entrega**
   - **Efectivo:**
     - Calculadora de vueltos
     - Confirmar monto exacto
     - Registrar en liquidación

   - **Transferencias:**
     - Confirmar transferencia Nequi/Daviplata
     - Verificar comprobante
     - Registrar método de pago

   - **Tarjeta:**
     - Procesar con datafono móvil
     - Confirmar transacción
     - Entregar comprobante

6. **Liquidación de Turno**
   - Resumen de entregas completadas
   - Total de efectivo recaudado
   - Cálculo de comisiones
   - Reporte de incidencias

## 🔧 Funcionalidades Avanzadas

### Sistema de Fidelización

#### Configuración
1. **Tipos de Programas:**
   - Puntos por compra (configurable)
   - Descuentos escalonados
   - Membresías VIP
   - Cupones personalizados

2. **Gestión de Clientes:**
   - Historial de puntos
   - Transacciones de fidelización
   - Promociones aplicables
   - Análisis de comportamiento

### AI y Machine Learning

#### Recomendaciones Inteligentes
1. **Para Clientes:**
   - Productos relacionados
   - Basado en historial de compras
   - Similitud vectorial
   - Ofertas personalizadas

2. **Para el Negocio:**
   - Predicción de demanda
   - Optimización de precios
   - Análisis de competencia
   - Insights automáticos

#### Optimización de Rutas
1. **Algoritmos AI:**
   - Clustering de entregas por zona
   - Optimización de distancias
   - Consideración de tráfico
   - Adaptación en tiempo real

### Sistema de Códigos Múltiples

#### Gestión
1. **Códigos por Producto:**
   - Código principal del minimarket
   - Códigos alternativos de proveedores
   - Códigos de barras internacionales
   - Códigos internos personalizados

2. **Búsqueda y Validación:**
   - Búsqueda por cualquier código
   - Validación de duplicados
   - Historial de códigos
   - Importación masiva

### Métodos de Recosteo

#### Configuración por Producto
1. **FIFO (First In, First Out):**
   - Primeros productos en entrar se venden primero
   - Ideal para productos perecederos

2. **LIFO (Last In, First Out):**
   - Últimos productos en entrar se venden primero
   - Útil en mercados inflacionarios

3. **Promedio Ponderado:**
   - Costo promedio basado en cantidades
   - Más estable para reportes

4. **Costo Específico:**
   - Por lote o identificación específica
   - Para productos únicos o de alto valor

5. **Costo Estándar:**
   - Precio fijo predefinido
   - Para simplificar operaciones

## 📊 Reportes y Analytics

### Reportes Disponibles

#### Ventas
- Ventas por período (día, semana, mes)
- Ventas por producto y categoría
- Ventas por cajero y turno
- Comparativas período anterior
- Análisis de márgenes

#### Inventario
- Stock actual vs mínimo/máximo
- Movimientos de inventario
- Productos de lenta rotación
- Valorización de inventario
- Historial de costos

#### Domicilios
- Performance de domiciliarios
- Tiempos promedio de entrega
- Zonas más activas
- Satisfacción de clientes
- Análisis de rutas

#### Consignación
- Ventas por proveedor tercero
- Comisiones generadas vs pagadas
- Productos devueltos por vencimiento
- Liquidaciones pendientes
- Análisis de rentabilidad

#### Proveedores
- Performance de proveedores del portal
- Órdenes completadas vs fallidas
- Tiempos de entrega promedio
- Calidad de productos
- Comunicación efectiva

### AI Insights

#### Automáticos
- Tendencias de venta identificadas
- Productos con alta demanda predicha
- Recomendaciones de reabastecimiento
- Alertas de precios competitivos
- Optimizaciones sugeridas

#### Bajo Demanda
- Análisis personalizado de períodos
- Predicciones de demanda futura
- Optimización de precios por producto
- Análisis de competencia
- Recomendaciones estratégicas

## 🛠️ Mantenimiento y Administración

### Gestión de Usuarios

#### Crear Usuarios
1. Acceder a "Usuarios" en POS Admin
2. Completar información personal
3. Asignar rol apropiado
4. Configurar permisos específicos
5. Generar credenciales de acceso

#### Gestión de Roles
- **Admin:** Acceso completo sin restricciones
- **Manager:** Gestión operativa sin configuración crítica
- **Supervisor:** Operaciones con restricción de dispositivo
- **Cashier:** Solo funciones de venta autorizadas
- **Delivery:** App móvil con validación GPS
- **Supplier:** Portal independiente con datos propios
- **Customer:** Tienda en línea y área personal

### Configuración del Sistema

#### Datos Básicos
- Información del establecimiento
- Horarios de operación
- Métodos de pago aceptados
- Configuración de impuestos (IVA)

#### Zonas de Entrega
- Definir áreas de cobertura
- Establecer tarifas por zona
- Configurar mínimos de compra
- Tiempos estimados de entrega

#### Parámetros AI
- Configurar APIs de OpenAI
- Ajustar parámetros de recomendaciones
- Configurar umbrales de predicciones
- Personalizar insights automáticos

### Backup y Recuperación

#### Base de Datos
```bash
# Backup manual
docker exec meerkato_postgres pg_dump -U postgres meerkato_pos > backup.sql

# Restaurar backup
docker exec -i meerkato_postgres psql -U postgres meerkato_pos < backup.sql
```

#### Archivos de Configuración
- Respaldar archivos .env
- Exportar configuraciones del sistema
- Backup de imágenes de productos
- Respaldo de logs del device agent

## 🚨 Solución de Problemas

### Problemas Comunes

#### Device Agent No Funciona
1. **Verificar que esté corriendo:**
   ```bash
   curl http://localhost:8181/health
   ```

2. **Reiniciar el agente:**
   ```bash
   cd device-agent
   ./device-agent
   ```

3. **Verificar logs:**
   - Revisar mensajes de error en consola
   - Verificar que no haya conflictos de puerto

#### Aplicaciones No Cargan
1. **Verificar dominios en /etc/hosts:**
   ```bash
   cat /etc/hosts | grep meerkato
   ```

2. **Verificar puertos disponibles:**
   ```bash
   lsof -i :3000
   lsof -i :3001
   lsof -i :3002
   lsof -i :3003
   ```

3. **Reiniciar desarrollo:**
   ```bash
   npm run dev
   ```

#### Base de Datos No Conecta
1. **Verificar que PostgreSQL esté corriendo:**
   ```bash
   docker ps | grep postgres
   ```

2. **Reiniciar base de datos:**
   ```bash
   docker-compose restart postgres
   ```

3. **Verificar variables de entorno:**
   ```bash
   echo $DATABASE_URL
   ```

#### Problemas de Autenticación
1. **Limpiar cookies del navegador**
2. **Verificar NEXTAUTH_SECRET en .env.local**
3. **Reiniciar aplicaciones**
4. **Verificar que el usuario exista en la base de datos**

### Logs y Debugging

#### Device Agent
```bash
# Logs en consola al ejecutar
cd device-agent && ./device-agent
```

#### Aplicaciones NextJS
```bash
# Logs en terminal donde ejecutas npm run dev
npm run dev
```

#### Base de Datos
```bash
# Acceder a logs de PostgreSQL
docker logs meerkato_postgres
```

#### Prisma
```bash
# Debug de queries
# Establecer en .env.local:
# DATABASE_URL="postgresql://...?log=query"
```

## 📞 Soporte y Documentación

### Documentación Adicional
- [README.md](./README.md) - Visión general del proyecto
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Documentación técnica detallada
- [device-agent/README.md](./device-agent/README.md) - Documentación específica del agente

### Recursos de Desarrollo
- **Prisma Studio:** http://localhost:5555 (ejecutar `npm run db:studio`)
- **Database Admin:** http://localhost:8080 (Adminer)
- **API Documentation:** Generada automáticamente en cada app

### Comunidad y Contribuciones
- Reportar issues en GitHub
- Contribuir con mejoras via Pull Requests
- Seguir las convenciones de código establecidas
- Documentar nuevas funcionalidades

---

Esta guía proporciona toda la información necesaria para usar efectivamente el sistema Meerkato POS. Para casos específicos o funcionalidades avanzadas, consulta la documentación técnica en ARCHITECTURE.md o contacta al equipo de desarrollo.