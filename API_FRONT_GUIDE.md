# PreventiGen Backend - Guia de endpoints para Front

Fecha de relevamiento: 2026-03-14

## 1. Base de integracion

- Base URL local actual: `http://localhost:3000`
- Swagger UI: `GET /api/docs`
- No hay prefijo global `/api` para las APIs de negocio. Las rutas reales son `/auth`, `/pacientes`, `/consultas`, etc.
- CORS habilitado solo para `http://localhost:3001` y `http://localhost:5173`
- Todos los endpoints usan `application/json`
- Todas las rutas, salvo `POST /auth/register` y `POST /auth/login`, requieren `Authorization: Bearer <access_token>`
- La validacion global usa `whitelist: true` y `forbidNonWhitelisted: true`
- Si el body trae campos extra, el backend responde `400`
- Las fechas en body se esperan como string ISO compatible. En este proyecto se usan sobre todo fechas tipo `YYYY-MM-DD`
- Los `UUID` del body si se validan. Los `:id` de path no usan `ParseUUIDPipe`, asi que un id invalido suele terminar en `404` y no en `400`

## 2. Envelope de errores

Nest devuelve errores con formato similar a este:

```json
{
  "statusCode": 400,
  "message": "Detalle del error",
  "error": "Bad Request"
}
```

Casos comunes:

- `400`: validacion, body invalido, consulta cerrada, API key faltante, error de Gemini
- `401`: token invalido, ausente, credenciales invalidas, usuario inactivo
- `404`: recurso no encontrado o no pertenece al medico logueado
- `409`: conflicto de registro duplicado

## 3. Endpoints no expuestos aunque existen en codigo

El archivo [src/app.controller.ts](/c:/Lautaro/Henry/PreventiGen/preventiGen/back/preventigen-back/src/app.controller.ts) define:

- `GET /`
- `GET /health`

Pero [src/app.module.ts](/c:/Lautaro/Henry/PreventiGen/preventiGen/back/preventigen-back/src/app.module.ts) no registra `AppController`, asi que esas rutas no forman parte de la API real actual.

## 4. Auth

### `POST /auth/register`

- Auth: no
- Body:
- `email`: `string` email valido
- `password`: `string`, minimo 6 caracteres
- `nombre`: `string`
- `especialidad`: `string` opcional
- Respuesta `201`:
- `id`: `string`
- `email`: `string`
- `nombre`: `string`
- `especialidad`: `string | null`
- `activo`: `boolean`
- `createdAt`: `string` ISO datetime
- No devuelve `passwordHash`
- Errores:
- `400` validacion
- `409` si el email ya existe

### `POST /auth/login`

- Auth: no
- Body:
- `email`: `string` email valido
- `password`: `string`, minimo 6 caracteres
- Respuesta `201`:

```json
{
  "access_token": "jwt",
  "medico": {
    "id": "uuid",
    "email": "medico@preventigen.com",
    "nombre": "Dr. Juan Perez",
    "especialidad": "Medicina General"
  }
}
```

- Errores:
- `400` validacion
- `401` credenciales invalidas
- `401` usuario inactivo

### `GET /auth/me`

- Auth: si
- Body: no
- Respuesta `200`:
- `id`: `string`
- `email`: `string`
- `nombre`: `string`
- `especialidad`: `string | null`
- `activo`: `boolean`
- `createdAt`: `string` ISO datetime
- Errores:
- `401` token ausente o invalido
- `404` medico no encontrado

## 5. Medicos

Observacion importante: hoy cualquier medico autenticado puede consumir estas rutas; no hay guard de admin ni restriccion por propietario.

### `GET /medicos`

- Auth: si
- Body: no
- Respuesta `200`: array de medicos
- Campos por item:
- `id`
- `email`
- `nombre`
- `especialidad`
- `activo`
- `createdAt`

### `GET /medicos/:id`

- Auth: si
- Params:
- `id`: `string` idealmente UUID
- Respuesta `200`: mismo shape que `GET /medicos`
- Errores:
- `404` medico no encontrado

### `GET /medicos/:id/stats`

- Auth: si
- Params:
- `id`: `string`
- Respuesta `200`:

```json
{
  "medico": {
    "id": "uuid",
    "nombre": "Dr. ...",
    "especialidad": "..."
  },
  "estadisticas": {
    "totalConsultas": 12,
    "consultasPorEstado": {
      "borrador": 10,
      "cerrada": 2
    }
  }
}
```

- Nota: el enum tambien soporta `confirmada`, aunque no hay endpoint que la asigne
- Errores:
- `404` medico no encontrado

### `PATCH /medicos/:id`

- Auth: si
- Params:
- `id`: `string`
- Body opcional, cualquier combinacion de:
- `nombre`: `string`
- `especialidad`: `string`
- `activo`: `boolean`
- Respuesta `200`: medico actualizado con shape:
- `id`
- `email`
- `nombre`
- `especialidad`
- `activo`
- `createdAt`
- Errores:
- `400` validacion
- `404` medico no encontrado

### `POST /medicos/:id/toggle-active`

- Auth: si
- Params:
- `id`: `string`
- Body: no
- Respuesta `201`: medico actualizado con mismos campos que `GET /medicos/:id`
- Errores:
- `404` medico no encontrado

### `DELETE /medicos/:id`

- Auth: si
- Params:
- `id`: `string`
- Respuesta `200`:

```json
{
  "message": "Medico eliminado correctamente"
}
```

- Errores:
- `404` medico no encontrado

## 6. Pacientes

Enums utiles:

- `genero`: `"M"` o `"F"`

### `POST /pacientes`

- Auth: si
- Body:
- `nombre`: `string` requerido
- `apellido`: `string` requerido
- `fechaNacimiento`: `string` fecha, recomendado `YYYY-MM-DD`
- `genero`: `"M" | "F"`
- `diagnosticoPrincipal`: `string` opcional
- `antecedentesMedicos`: `string` opcional
- `medicacionActual`: `string` opcional
- `presionArterial`: `string` opcional
- `comentarios`: `string` opcional
- El `medicoId` no se envia; lo toma del JWT
- Respuesta `201`:
- `id`
- `medicoId`
- `nombre`
- `apellido`
- `fechaNacimiento`
- `genero`
- `diagnosticoPrincipal`
- `antecedentesMedicos`
- `medicacionActual`
- `presionArterial`
- `comentarios`
- `createdAt`
- `updatedAt`
- Errores:
- `400` validacion
- `401` token invalido

### `GET /pacientes`

- Auth: si
- Body: no
- Respuesta `200`: array de pacientes del medico logueado
- Campos por item:
- `id`
- `nombre`
- `apellido`
- `fechaNacimiento`
- `genero`

### `GET /pacientes/:id`

- Auth: si
- Params:
- `id`: `string`
- Respuesta `200`:
- datos escalares del paciente:
- `id`
- `medicoId`
- `nombre`
- `apellido`
- `fechaNacimiento`
- `genero`
- `diagnosticoPrincipal`
- `antecedentesMedicos`
- `medicacionActual`
- `presionArterial`
- `comentarios`
- `createdAt`
- `updatedAt`
- relaciones incluidas:
- `consultas`: `Consulta[]`
- `estudios`: `EstudioMedico[]`
- `novedades`: `NovedadClinica[]`
- Importante: no incluye `datosMedicos`, `analisis` ni `gemeloDigital`
- Errores:
- `404` paciente no encontrado o ajeno

### `PATCH /pacientes/:id/datos-personales`

- Auth: si
- Params:
- `id`: `string`
- Body opcional, cualquier combinacion de:
- `nombre`: `string`
- `apellido`: `string`
- `fechaNacimiento`: `string` fecha
- `genero`: `"M" | "F"`
- Respuesta `200`: mismo shape que `GET /pacientes/:id`
- Errores:
- `400` validacion
- `404` paciente no encontrado o ajeno

### `PATCH /pacientes/:id/datos-medicos`

- Auth: si
- Params:
- `id`: `string`
- Body opcional, cualquier combinacion de:
- `diagnosticoPrincipal`: `string`
- `antecedentesMedicos`: `string`
- `medicacionActual`: `string`
- `presionArterial`: `string`
- `comentarios`: `string`
- Respuesta `200`: mismo shape que `GET /pacientes/:id`
- Errores:
- `400` validacion
- `404` paciente no encontrado o ajeno

### `DELETE /pacientes/:id`

- Auth: si
- Params:
- `id`: `string`
- Respuesta `200`:

```json
{
  "message": "Paciente eliminado correctamente"
}
```

- Errores:
- `404` paciente no encontrado o ajeno

## 7. Consultas

Enum relevante:

- `estado`: `"borrador" | "confirmada" | "cerrada"`

### `POST /consultas`

- Auth: si
- Body:
- `pacienteId`: `string` UUID requerido
- `detalles`: `string` opcional
- `tratamientoIndicado`: `string` opcional
- Respuesta `201`:
- `id`
- `pacienteId`
- `medicoId`
- `detalles`
- `tratamientoIndicado`
- `estado`: por defecto `"borrador"`
- `createdAt`
- `updatedAt`
- Errores:
- `400` validacion
- `404` paciente no encontrado o ajeno

### `GET /consultas`

- Auth: si
- Body: no
- Respuesta `200`: array de consultas del medico
- Campos por item:
- `id`
- `pacienteId`
- `medicoId`
- `detalles`
- `tratamientoIndicado`
- `estado`
- `createdAt`
- `updatedAt`
- `paciente`: objeto paciente relacionado

### `GET /consultas/paciente/:pacienteId`

- Auth: si
- Params:
- `pacienteId`: `string`
- Respuesta `200`: array de consultas del paciente
- Campos por item:
- `id`
- `pacienteId`
- `medicoId`
- `detalles`
- `tratamientoIndicado`
- `estado`
- `createdAt`
- `updatedAt`
- Nota: esta variante no carga la relacion `paciente`
- Errores:
- `404` paciente no encontrado o ajeno

### `GET /consultas/:id`

- Auth: si
- Params:
- `id`: `string`
- Respuesta `200`:
- `id`
- `pacienteId`
- `medicoId`
- `detalles`
- `tratamientoIndicado`
- `estado`
- `createdAt`
- `updatedAt`
- `paciente`: objeto paciente relacionado
- Errores:
- `404` consulta no encontrada o ajena

### `PATCH /consultas/:id`

- Auth: si
- Params:
- `id`: `string`
- Body opcional:
- `detalles`: `string`
- `tratamientoIndicado`: `string`
- Respuesta `200`: mismo shape que `GET /consultas/:id`
- Errores:
- `400` validacion
- `400` si la consulta ya esta cerrada
- `404` consulta no encontrada o ajena

### `POST /consultas/:id/cerrar`

- Auth: si
- Params:
- `id`: `string`
- Body: no
- Respuesta `201`: consulta actualizada con `estado: "cerrada"`
- Errores:
- `400` si ya estaba cerrada
- `404` consulta no encontrada o ajena

## 8. Datos medicos

Enum relevante:

- `tipo`: `"antecedente" | "diagnostico" | "medicacion" | "estudio" | "evolucion" | "otro"`

### `POST /datos-medicos`

- Auth: si
- Body:
- `pacienteId`: `string` UUID requerido
- `contenido`: `string` requerido
- `tipo`: enum opcional, default `"otro"`
- Respuesta `201`:
- `id`
- `pacienteId`
- `medicoId`
- `contenido`
- `tipo`
- `fechaCarga`
- Errores:
- `400` validacion
- `404` paciente no encontrado o ajeno

### `GET /datos-medicos`

- Auth: si
- Body: no
- Respuesta `200`: array de datos medicos del medico
- Campos por item:
- `id`
- `pacienteId`
- `medicoId`
- `contenido`
- `tipo`
- `fechaCarga`
- `paciente`: objeto paciente relacionado

### `GET /datos-medicos/paciente/:pacienteId`

- Auth: si
- Params:
- `pacienteId`: `string`
- Respuesta `200`: array de datos medicos del paciente
- Campos por item:
- `id`
- `pacienteId`
- `medicoId`
- `contenido`
- `tipo`
- `fechaCarga`
- Nota: no incluye relacion `paciente`
- Errores:
- `404` paciente no encontrado o ajeno

### `GET /datos-medicos/:id`

- Auth: si
- Params:
- `id`: `string`
- Respuesta `200`:
- `id`
- `pacienteId`
- `medicoId`
- `contenido`
- `tipo`
- `fechaCarga`
- `paciente`: objeto paciente relacionado
- `analisis`: array de analisis IA vinculados a ese dato medico
- Errores:
- `404` dato medico no encontrado o ajeno

### `PATCH /datos-medicos/:id`

- Auth: si
- Params:
- `id`: `string`
- Body opcional. El DTO real acepta:
- `pacienteId`: `string` UUID
- `contenido`: `string`
- `tipo`: enum
- Respuesta `200`: mismo shape que `GET /datos-medicos/:id`
- Nota importante para front: aunque el endpoint acepta `pacienteId`, el servicio no vuelve a validar pertenencia del nuevo paciente. Conviene no usar este campo para mover registros entre pacientes
- Errores:
- `400` validacion
- `404` dato medico no encontrado o ajeno

### `DELETE /datos-medicos/:id`

- Auth: si
- Params:
- `id`: `string`
- Respuesta `200`:

```json
{
  "message": "Dato medico eliminado correctamente"
}
```

- Errores:
- `404` dato medico no encontrado o ajeno

## 9. Estudios medicos

### `POST /estudios-medicos`

- Auth: si
- Body:
- `pacienteId`: `string` UUID requerido
- `nombreEstudio`: `string` requerido
- `fecha`: `string` fecha opcional
- `observaciones`: `string` opcional
- Respuesta `201`:
- `id`
- `pacienteId`
- `nombreEstudio`
- `fecha`
- `observaciones`
- `createdAt`
- Errores:
- `400` validacion
- `404` paciente no encontrado o ajeno

### `GET /estudios-medicos/paciente/:pacienteId`

- Auth: si
- Params:
- `pacienteId`: `string`
- Respuesta `200`: array de estudios
- Campos por item:
- `id`
- `pacienteId`
- `nombreEstudio`
- `fecha`
- `observaciones`
- `createdAt`
- Errores:
- `404` paciente no encontrado o ajeno

### `DELETE /estudios-medicos/:id`

- Auth: si
- Params:
- `id`: `string`
- Respuesta `200`:

```json
{
  "message": "Estudio eliminado correctamente"
}
```

- Errores:
- `404` estudio no encontrado o ajeno

## 10. Novedades clinicas

Enum relevante:

- `gravedad`: `"leve" | "moderada" | "grave"`

### `POST /novedades-clinicas`

- Auth: si
- Body:
- `pacienteId`: `string` UUID requerido
- `tipoEvento`: `string` opcional
- `descripcion`: `string` opcional
- `zonaAfectada`: `string` opcional
- `gravedad`: enum opcional
- `observaciones`: `string` opcional
- Respuesta `201`:
- `id`
- `pacienteId`
- `tipoEvento`
- `descripcion`
- `zonaAfectada`
- `gravedad`
- `observaciones`
- `createdAt`
- Nota: salvo `pacienteId`, todo el resto es opcional
- Errores:
- `400` validacion
- `404` paciente no encontrado o ajeno

### `GET /novedades-clinicas/paciente/:pacienteId`

- Auth: si
- Params:
- `pacienteId`: `string`
- Respuesta `200`: array de novedades
- Campos por item:
- `id`
- `pacienteId`
- `tipoEvento`
- `descripcion`
- `zonaAfectada`
- `gravedad`
- `observaciones`
- `createdAt`
- Errores:
- `404` paciente no encontrado o ajeno

### `DELETE /novedades-clinicas/:id`

- Auth: si
- Params:
- `id`: `string`
- Respuesta `200`:

```json
{
  "message": "Novedad eliminada correctamente"
}
```

- Errores:
- `404` novedad no encontrada o ajena

## 11. Analisis IA

Enum relevante:

- `tipoPrompt`: `"usuario" | "sistema"`

Requiere `GOOGLE_GEMINI_API_KEY` configurada para crear analisis.

### `POST /analisis-ia`

- Auth: si
- Body:
- `pacienteId`: `string` UUID requerido
- `datoMedicoId`: `string` UUID opcional
- `tipoPrompt`: `"usuario" | "sistema"` opcional, default `"usuario"`
- `promptUsuario`: `string` opcional
- Comportamiento:
- si `datoMedicoId` viene, analiza solo ese dato medico
- si no viene, usa todos los datos medicos del paciente
- si existe gemelo digital del paciente, lo asocia automaticamente
- Respuesta `201`:
- `id`
- `pacienteId`
- `datoMedicoId`
- `gemeloDigitalId`
- `tipoPrompt`
- `prompt`
- `respuestaIA`
- `resumenContexto`
- `fechaGeneracion`
- Errores:
- `400` validacion
- `400` si falta `GOOGLE_GEMINI_API_KEY`
- `400` si Gemini falla
- `404` paciente no encontrado o ajeno
- `404` dato medico no encontrado o no pertenece al paciente

### `GET /analisis-ia/paciente/:pacienteId`

- Auth: si
- Params:
- `pacienteId`: `string`
- Respuesta `200`: array de analisis
- Campos por item:
- `id`
- `pacienteId`
- `datoMedicoId`
- `gemeloDigitalId`
- `tipoPrompt`
- `prompt`
- `respuestaIA`
- `resumenContexto`
- `fechaGeneracion`
- `datoMedico`: objeto relacionado si existe
- `gemeloDigital`: objeto relacionado si existe
- Errores:
- `404` paciente no encontrado o ajeno

### `GET /analisis-ia/paciente/:pacienteId/ultimo`

- Auth: si
- Params:
- `pacienteId`: `string`
- Respuesta `200`: mismo shape que un item de `GET /analisis-ia/paciente/:pacienteId`
- Errores:
- `404` paciente no encontrado o ajeno
- `404` si el paciente no tiene analisis previos

### `GET /analisis-ia/paciente/:pacienteId/contexto`

- Auth: si
- Params:
- `pacienteId`: `string`
- Respuesta `200`:
- `null` si el paciente existe pero aun no tiene contexto acumulado
- o bien un objeto:

```json
{
  "id": "uuid",
  "pacienteId": "uuid",
  "registroIA": "resumen acumulado",
  "fechaRegistro": "2026-03-14T12:00:00.000Z"
}
```

- Errores:
- `404` paciente no encontrado o ajeno

### `GET /analisis-ia/:id`

- Auth: si
- Params:
- `id`: `string`
- Respuesta `200`:
- `id`
- `pacienteId`
- `datoMedicoId`
- `gemeloDigitalId`
- `tipoPrompt`
- `prompt`
- `respuestaIA`
- `resumenContexto`
- `fechaGeneracion`
- `paciente`: objeto paciente relacionado
- `datoMedico`: objeto relacionado si existe
- `gemeloDigital`: objeto relacionado si existe
- Errores:
- `404` analisis no encontrado o ajeno

## 12. Gemelos digitales

Enum relevante:

- `estado`: `"activo" | "desactualizado" | "actualizado"`

Requiere `GOOGLE_GEMINI_API_KEY` para listar modelos y simular tratamientos.

### `GET /gemelos-digitales/modelos-disponibles`

- Auth: si
- Body: no
- Respuesta `200`: devuelve el JSON crudo de Google Generative Language API
- En la practica suele ser un objeto tipo:

```json
{
  "models": [
    {
      "name": "models/gemini-2.5-flash",
      "displayName": "Gemini 2.5 Flash"
    }
  ]
}
```

- Importante: el backend no normaliza esta respuesta; el contrato depende del proveedor externo
- Errores:
- `400` si falta `GOOGLE_GEMINI_API_KEY`
- `400` si falla la llamada externa

### `POST /gemelos-digitales`

- Auth: si
- Body:
- `pacienteId`: `string` UUID requerido
- Respuesta `201`:
- `id`
- `pacienteId`
- `medicoId`
- `historialActualizaciones`: array, inicialmente `[]`
- `estado`: inicialmente `"actualizado"`
- `createdAt`
- `updatedAt`
- Errores:
- `400` validacion
- `400` si ya existe un gemelo para ese paciente
- `404` paciente no encontrado o ajeno

### `GET /gemelos-digitales`

- Auth: si
- Body: no
- Respuesta `200`: array de gemelos del medico
- Campos por item:
- `id`
- `pacienteId`
- `medicoId`
- `historialActualizaciones`
- `estado`
- `createdAt`
- `updatedAt`
- `paciente`: objeto paciente relacionado
- `simulaciones`: array de simulaciones relacionadas

### `GET /gemelos-digitales/:id`

- Auth: si
- Params:
- `id`: `string`
- Respuesta `200`: mismo shape que un item de `GET /gemelos-digitales`
- Errores:
- `404` gemelo digital no encontrado o ajeno

### `GET /gemelos-digitales/paciente/:pacienteId`

- Auth: si
- Params:
- `pacienteId`: `string`
- Respuesta `200`: mismo shape que `GET /gemelos-digitales/:id`
- Errores:
- `404` no existe gemelo para ese paciente o es ajeno

### `GET /gemelos-digitales/:id/simulaciones`

- Auth: si
- Params:
- `id`: `string`
- Respuesta `200`: array de simulaciones
- Campos por item:
- `id`
- `gemeloDigitalId`
- `tratamientoPropuesto`
- `dosisYDuracion`
- `analisisIA`: objeto JSON
- `prediccionRespuesta`: objeto JSON
- `promptEnviado`
- `respuestaCompletaIA`
- `modeloIAUtilizado`
- `createdAt`
- Errores:
- `404` gemelo digital no encontrado o ajeno

### `POST /gemelos-digitales/simular`

- Auth: si
- Body:
- `gemeloDigitalId`: `string` UUID requerido
- `tratamientoPropuesto`: `string` requerido
- `dosisYDuracion`: `string` opcional
- Respuesta `201`:
- `id`
- `gemeloDigitalId`
- `tratamientoPropuesto`
- `dosisYDuracion`
- `analisisIA`:
- `efectividadEstimada`: `number`
- `riesgos`: `string[]`
- `beneficios`: `string[]`
- `contraindicaciones`: `string[]`
- `interaccionesMedicamentosas`: `string[]`
- `efectosSecundariosProbables`: `string[]`
- `recomendaciones`: `string[]`
- `ajustesDosis`: `string | undefined`
- `monitoreoCritico`: `string[] | undefined`
- `alternativasSugeridas`: array opcional de `{ medicamento, razon }`
- `prediccionRespuesta`:
- `tiempoMejoriaEstimado`: `string | undefined`
- `probabilidadExito`: `number`
- `factoresRiesgo`: `string[]`
- `parametrosMonitoreo`: `string[]`
- `promptEnviado`: `string`
- `respuestaCompletaIA`: `string`
- `modeloIAUtilizado`: `string`, hoy se guarda `"gemini-2.5-flash"`
- `createdAt`
- Errores:
- `400` validacion
- `400` si falta `GOOGLE_GEMINI_API_KEY`
- `400` si la IA no devuelve JSON parseable
- `404` gemelo digital no encontrado o ajeno

### `PATCH /gemelos-digitales/:id/actualizar`

- Auth: si
- Params:
- `id`: `string`
- Body:
- `consultaId`: `string` UUID requerido
- `cambiosRealizados`: `string` requerido
- `datosActualizados`: `object` requerido
- Ejemplo de `datosActualizados`:

```json
{
  "enfermedadesCronicas": ["Migrana cronica", "Hipertension"],
  "medicacionActual": ["Propranolol 40mg c/12hs"],
  "signosVitales": {
    "presionArterial": "128/82"
  }
}
```

- Respuesta `200`:
- mismo shape que `GET /gemelos-digitales/:id`
- `historialActualizaciones` suma un item con:
- `fecha`
- `consultaId`
- `cambios`
- `datosMedicos`
- `estado` queda en `"actualizado"`
- Errores:
- `400` validacion
- `404` gemelo digital no encontrado o ajeno

## 13. Resumen rapido por entidad para front

- Paciente:
- alta y edicion separadas entre datos personales y datos medicos generales
- `GET /pacientes/:id` no trae `datosMedicos`; esos salen por `/datos-medicos/paciente/:pacienteId`

- Consulta:
- nace en `borrador`
- se edita por `PATCH /consultas/:id`
- se cierra por `POST /consultas/:id/cerrar`

- Dato medico:
- es texto libre mas un `tipo`
- puede disparar analisis IA especifico o global

- Estudio medico:
- simple, sin upload de archivos

- Novedad clinica:
- texto estructurado liviano, sin campos obligatorios salvo `pacienteId`

- Analisis IA:
- devuelve texto largo (`prompt`, `respuestaIA`) mas resumen corto (`resumenContexto`)

- Gemelo digital:
- uno por paciente
- acumula `historialActualizaciones`
- las simulaciones guardan tanto JSON parseado como la respuesta completa del modelo

## 14. Observaciones tecnicas que impactan al front

- `POST /auth/login` y todos los `POST` devuelven `201`, no `200`
- No hay paginacion, filtros ni query params en ningun listado
- No hay endpoints multipart ni subida de archivos
- Las respuestas no estan normalizadas con DTOs de salida; muchas devuelven entidades TypeORM con relaciones segun el caso
- Varias respuestas incluyen texto potencialmente largo: `prompt`, `respuestaIA`, `respuestaCompletaIA`, `analisisIA`
- `GET /gemelos-digitales/modelos-disponibles` depende de un proveedor externo y no tiene contrato estable
- Las rutas de medico parecen pensadas para administracion, pero hoy estan abiertas a cualquier medico autenticado
