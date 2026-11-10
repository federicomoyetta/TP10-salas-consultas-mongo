# TP-10 — Sistema de Reservas de Salas: consultas con MongoDB

## Descripción

Aplicación web desarrollada con Node.js, Express, EJS, MongoDB Atlas y Mongoose para gestionar reservas de salas. Conserva el CRUD del TP09 y agrega al listado de la API REST **filtro por sala, ordenamiento limitado, paginación y selección fija de campos**. La interfaz web, la consulta individual y `/estado` mantienen su funcionamiento anterior.

## Tecnologías utilizadas

- Node.js (CommonJS)
- Express.js
- MongoDB Atlas y Mongoose
- EJS y express-ejs-layouts
- Morgan
- Postman
- ESLint y Prettier

## Estructura del proyecto

```text
tp-10-salas-consultas-mongodb/
├── public/
├── scripts/
├── src/
│   ├── config/
│   │   ├── entorno.js
│   │   └── base-datos.js
│   ├── controladores/
│   │   └── reservas.js
│   ├── middleware/
│   │   ├── cambios-reservas.js
│   │   ├── errores.js
│   │   ├── reservas.js
│   │   └── solicitudes.js
│   ├── modelos/
│   │   └── reserva.js
│   ├── rutas/
│   │   ├── reservas.js
│   │   └── reservas-api.js
│   ├── servicios/
│   │   └── reservas-mongo.js
│   ├── app.js
│   └── index.js
├── views/
├── .env.example
├── .gitignore
├── package.json
└── package-lock.json
```

El archivo privado `.env` se crea localmente y **no se publica**.

## Requisitos e instalación

Se requiere Node.js compatible con `--env-file` (20.6 o superior), npm y acceso a MongoDB Atlas.

1. Abrir la carpeta `tp-10-salas-consultas-mongodb`.
2. Instalar las dependencias:

   ```bash
   npm ci
   ```

3. Crear `.env` tomando `.env.example` como referencia, con valores propios:

   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://USUARIO:CONTRASENA@CLUSTER.mongodb.net/reservas_salas_u10?retryWrites=true&w=majority
   ```

4. Verificar el código y la conexión:

   ```bash
   npm run check
   node --env-file=.env scripts/comprobar-conexion.js
   ```

5. Iniciar la aplicación:

   ```bash
   node --env-file=.env src/index.js
   ```

   También puede utilizarse `npm start` si el script de inicio del proyecto ejecuta ese comando.

La base es `reservas_salas_u10` y la colección es `reservas`. No publicar la URI privada ni las credenciales.

## Interfaz web

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Inicio |
| GET | `/reservas` | Listado HTML completo, sin paginación API |
| GET | `/reservas/nueva` | Formulario de creación |
| POST | `/reservas` | Crear reserva; redirige con 302 si es válida |
| GET | `/reservas/:id` | Detalle de reserva |
| GET | `/estado` | Estado de la aplicación y conteo global de reservas |

El formulario conserva los valores ingresados y devuelve 400 con mensajes de error cuando la validación del servidor falla.

## API REST

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/reservas` | Listado consultable, ordenado y paginado |
| GET | `/api/reservas/:id` | Obtener una reserva por ID |
| POST | `/api/reservas` | Crear una reserva |
| PUT | `/api/reservas/:id` | Reemplazar todos los campos editables |
| PATCH | `/api/reservas/:id` | Modificar `personas` y/o `estado` |
| DELETE | `/api/reservas/:id` | Eliminar una reserva |

### GET `/api/reservas`: parámetros de consulta

| Parámetro | Valores admitidos | Valor predeterminado |
|---|---|---|
| `sala` | Texto no vacío; filtro exacto por sala | Sin filtro |
| `orden` | `estudiante`, `personas-asc`, `personas-desc` | Orden predeterminado del servicio |
| `pagina` | Entero de 1 a 1000 | 1 |
| `limite` | Entero de 1 a 20 | 2 |

El ordenamiento por personas utiliza un criterio de desempate estable implementado en el servicio. No se admiten parámetros desconocidos, repetidos o vacíos cuando corresponda. Por ejemplo, `select=email` y `orden=otro` se rechazan con 400. La selección de campos es fija y no la decide el cliente.

Ejemplo reproducible en Postman (GET, **Body: none**):

```http
GET http://localhost:3000/api/reservas?sala=Sala%20Norte&orden=personas-asc&pagina=1&limite=2
```

Con los seis datos de referencia del ejercicio, devuelve 200, dos reservas, `total: 4` y `paginas: 2`. Cambiar únicamente `pagina=2` devuelve las otras dos reservas.

La respuesta del listado es un objeto con **exactamente cinco propiedades**:

```json
{
  "datos": [
    {
      "id": "ID_DE_EJEMPLO",
      "estudiante": "Ana Ejemplo",
      "email": "ana@example.com",
      "sala": "Sala Norte",
      "fecha": "2026-10-28",
      "turno": "Mañana",
      "personas": 2,
      "estado": "pendiente"
    }
  ],
  "pagina": 1,
  "limite": 2,
  "total": 4,
  "paginas": 2
}
```

Este JSON es **ilustrativo**: `datos` muestra una sola reserva para explicar la estructura, no una respuesta literal de la prueba con límite 2. Los valores reales dependen de los documentos guardados.

`total` cuenta todas las coincidencias del filtro, no solo las de la página; `paginas` se calcula como `Math.ceil(total / limite)`. Una página fuera del rango responde 200 con `datos: []` y no se ajusta a la última página. Si no hay coincidencias, `total` y `paginas` son 0.

Cada reserva expone `id`, `estudiante`, `email`, `sala`, `fecha`, `turno`, `personas` y `estado`. La consulta en MongoDB selecciona esos siete campos de datos y conserva internamente `_id` para construir `id`; no expone `_id` ni `__v`. El endpoint individual GET `/api/reservas/:id` mantiene su contrato anterior y no devuelve metadatos de paginación.

### POST — Crear

```http
POST http://localhost:3000/api/reservas
```

Body → raw → JSON:

```json
{
  "estudiante": "Prueba Postman",
  "email": "postman@example.com",
  "sala": "Sala Sur",
  "fecha": "2026-11-06",
  "turno": "Tarde",
  "personas": 3
}
```

Respuesta válida: **201 Created**, reserva con `id`, cabecera `Location` y estado inicial `pendiente`.

### PUT — Reemplazar

```http
PUT http://localhost:3000/api/reservas/:id
```

Body → raw → JSON:

```json
{
  "estudiante": "Prueba Postman Modificada",
  "email": "postman@example.com",
  "sala": "Sala Norte",
  "fecha": "2026-11-06",
  "turno": "Mañana",
  "personas": 4,
  "estado": "confirmada"
}
```

PUT exige **los siete campos editables** y conserva el identificador. Respuesta válida: **200 OK**.

### PATCH — Actualizar parcialmente

```http
PATCH http://localhost:3000/api/reservas/:id
```

Body → raw → JSON:

```json
{
  "personas": 5
}
```

PATCH permite exclusivamente `personas` y/o `estado`, con al menos uno de ellos. Respuesta válida: **200 OK**.

### DELETE — Eliminar

```http
DELETE http://localhost:3000/api/reservas/:id
```

Elimina la reserva indicada. Respuesta válida: **204 No Content**, sin cuerpo.

## Validaciones y códigos HTTP

| Código | Uso |
|---|---|
| 200 OK | Consulta o actualización exitosa, incluso listado sin coincidencias |
| 201 Created | Reserva creada |
| 204 No Content | Reserva eliminada |
| 400 Bad Request | Parámetros, identificador o datos inválidos |
| 404 Not Found | Reserva inexistente |
| 500 Internal Server Error | Error inesperado |

Para las reservas: estudiante obligatorio, email con `@`, sala entre Norte/Sur/Multimedia, fecha obligatoria, turno entre Mañana/Tarde/Noche, personas enteras entre 1 y 6; estado `pendiente` o `confirmada` cuando se edita. PUT exige todos los campos; PATCH solo permite `personas` y `estado`. Se rechazan campos desconocidos y operadores MongoDB en cuerpos de actualización.

## Pruebas en Postman

Crear una colección **TP 10 - Reservas**. En GET usar Body → none y activar solo los Params requeridos. Guardar las solicitudes y sus respuestas como evidencia (capturas o exportación de colección).

| Caso | Resultado esperado / comprobado durante el TP10 |
|---|---|
| Sala Norte, `orden=personas-asc`, `pagina=1`, `limite=2` | 200; 2 datos, total 4, páginas 2 |
| Misma consulta, `pagina=2` | 200; otras 2 reservas |
| Sin parámetros | 200; 2 datos, página 1, límite 2, total 6, páginas 3 |
| Sala Norte, página 3, límite 2 | 200; datos vacíos, total 4, páginas 2 |
| Sala inexistente | 200; datos vacíos, total 0, páginas 0 |
| `pagina=0` | 400 |
| `pagina=1.5` | 400 |
| `limite=21` | 400 |
| `pagina=1&pagina=2` | 400 |
| `sala=` | 400 |
| `sala` repetida | 400 |
| `orden=otro` | 400 |
| `select=email` | 400 |
| GET individual | 200; una reserva sin metadatos de páginas |
| POST válido | 201 |
| PUT completo | 200 |
| PATCH de `personas` | 200 |
| DELETE de reserva de prueba | 204 |
| `/estado` | 200; conteo global |
| Listado y detalle HTML | Funcionan sin paginación API |
| Formulario inválido enviado al servidor | 400; mensajes y valores conservados |
| Formulario válido | Redirección al listado; nueva reserva guardada |

Las pruebas de escritura se realizaron sobre reservas temporales y luego se eliminaron para conservar las seis reservas originales. No se cargan datos automáticamente al iniciar el servidor. Los resultados deben contrastarse con los datos que efectivamente estén almacenados al ejecutar las pruebas.

## Persistencia y diseño de datos

Las reservas se almacenan en MongoDB Atlas, base `reservas_salas_u10`, colección `reservas`. MongoDB genera `_id`; las operaciones PUT y PATCH preservan ese identificador y DELETE elimina el documento. Los datos permanecen después de reiniciar la aplicación.

**¿Qué datos corresponden a una sala y cuáles a una reserva?** Una sala podría tener nombre, ubicación, capacidad y equipamiento. Una reserva describe al estudiante, su email, la sala elegida, la fecha, el turno, la cantidad de personas y su estado.

Si el sistema creciera, tendría sentido considerar una colección de salas y relacionar cada reserva con su sala mediante una referencia: permitiría actualizar capacidad o equipamiento una sola vez y evitar duplicaciones. Los datos embebidos podrían ser útiles si se necesitara guardar una instantánea de características de la sala al momento de reservar. **En este TP10 no se implementa otro modelo, referencias ni `populate`**; es únicamente una justificación conceptual.

## Comprobación y entrega

Antes de entregar:

```bash
npm run check
```

Verificar también la conexión a Atlas, el funcionamiento de la interfaz web, el CRUD y `/estado`; adjuntar capturas o exportación de Postman y publicar una URL accesible del repositorio GitHub.

No incluir `.env`, contraseñas, URI privada, `node_modules`, datos personales reales ni archivos innecesarios. Sí incluir `.env.example`, `.gitignore`, `package.json`, `package-lock.json`, fuentes y este README.

## Conclusión

El TP10 amplía el CRUD del TP09 con consultas de MongoDB controladas desde el servicio: filtro, ordenamiento, paginación y proyección de campos. La API devuelve metadatos coherentes sin alterar los documentos ni el comportamiento de las vistas HTML y los endpoints heredados.
