# Despliegue de FCT Manager API en Render

## 1. Base de datos

La API sigue usando MySQL. Render ofrece Postgres gestionado, no MySQL gestionado, asi que necesitas una base de datos MySQL online en un proveedor externo.

Opciones validas:

- Aiven MySQL
- Railway MySQL
- Azure Database for MySQL
- Google Cloud SQL MySQL
- Clever Cloud MySQL

Crea una base de datos MySQL y copia su cadena de conexion.

Formato recomendado:

```text
server=HOST;port=3306;database=ProyectoFCT;user=USUARIO;password=PASSWORD;SslMode=Required;
```

Tambien sirve una URL tipo:

```text
mysql://USUARIO:PASSWORD@HOST:3306/ProyectoFCT
```

## 2. Subir el repositorio a GitHub

Render desplegara la API desde GitHub. Sube todo el proyecto con estos archivos incluidos:

- `FctApi/`
- `Dockerfile`
- `render.yaml`
- `proyecto/Models/`
- `proyecto/Services/DatabaseService.cs`
- `proyecto/Services/IFctDataService.cs`

## 3. Crear el servicio en Render

1. Entra en Render.
2. Crea un nuevo `Web Service`.
3. Conecta este repositorio.
4. Render detectara `render.yaml`.
5. Configura la variable secreta:

```text
ConnectionStrings__DefaultConnection=server=HOST;port=3306;database=ProyectoFCT;user=USUARIO;password=PASSWORD;SslMode=Required;
```

6. Despliega.

Cuando termine, Render te dara una URL parecida a:

```text
https://fct-manager-api.onrender.com
```

Puedes comprobar que funciona entrando a:

```text
https://fct-manager-api.onrender.com/api/health
```

Debe devolver:

```json
{"status":"ok"}
```

## 4. Conectar la app MAUI con Render

Abre:

```text
proyecto/Configuration/ApiConfiguration.cs
```

Y cambia la URL de Release si Render te da otra distinta:

```csharp
public const string BaseUrl = "https://TU-SERVICIO.onrender.com/";
```

Despues publica la app Windows en modo Release.
