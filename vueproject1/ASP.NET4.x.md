# How to migrate an older ASP.NET 4.x MVC + Web API Project

There are two Steps
1. Replace the MVC stuff with Vue (SPA)
2. Keep the Web API and put the SPA into the ``wwwroot`` folder, make the project ready to serve these files


> The other option is to create a new ASP.NET Core project and migrate, but that is not the intention of this Guide.


# UI
- create a Vue Project and migrate all the UI stuff from the old project

|Old Project|Vue Project|
|-|-|
|Content (css, img))|assets (css, img)|
|Views (*.cshtml)|views (*.vue)|
|Content (*.js)|views (*.vue)|


- split the views into components, if required
- change ``VUE_APP_ROOT_API`` in ``.env`` to the existing Web ApI Project during development
- run the old project during development to access the api endpoints

U have to setup CORS in the old project to access the api endpoints from your vue project.
```xml
<customHeaders>
    <add name="Access-Control-Allow-Origin" value="https://localhost:5002" />
    <add name="Access-Control-Allow-Credentials" value="true" />
    </customHeaders>
</httpProtocol>
```

> Remove custom headers when deploy the app to production

# Web API when done

- remove all unnecessary folders and classes
    - View
    - Content
    - MVC Controllers
    - lib (libman.json)
- create a ``wwwroot`` folder and copy all data from vue ``dist`` folder (or change ``outputDirectory`` in ``vue.config.js``)

U need to install two packages to serve the files from the ``wwwroot`` folder.
- Microsoft.Owin.FileSystem
- Microsoft.Owin.StaticFiles

> Add a handler to the ``web.config``

```xml
<handlers>
    <add name="Owin" verb="GET" path="*" type="Microsoft.Owin.Host.SystemWeb.OwinHttpHandler, Microsoft.Owin.Host.SystemWeb"/>
</handlers>
```

> Create a ``Startup.cs`` in ``App_Start``

```csharp
using Microsoft.Owin;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.StaticFiles;
using Owin;

// Note YourAppName is a placeholder, dont copy
[assembly: OwinStartup(typeof(YourAppName.App_Start.Startup))]
namespace YourAppName.App_Start
{
    public class Startup
    {
        // ASP NET MVC Using wwwroot static files
        // https://gist.github.com/vadimberkut/1f052679cd8786993e7f31b7eed76741
        // https://stackoverflow.com/questions/33470123/map-to-wwwroot-in-asp-net-4
        public void Configuration(IAppBuilder app)
        {
            var physicalFileSystem = new PhysicalFileSystem(@".\wwwroot");

            var options = new FileServerOptions
            {
                RequestPath = PathString.Empty,
                EnableDefaultFiles = true,
                EnableDirectoryBrowsing = false,
                FileSystem = physicalFileSystem,                
            };

            options.StaticFileOptions.FileSystem = physicalFileSystem;
            options.StaticFileOptions.ServeUnknownFileTypes = false;
            options.DefaultFilesOptions.DefaultFileNames = new[] { "index.html" };

            app.UseFileServer(options);
        }
    }
}
```

> Handle Browser Refresh Page in ``Global.asax.cs`` to serve the content of ``index.html`` instead of ``404``

```csharp
public class WebApiApplication : System.Web.HttpApplication
{
    protected void Application_EndRequest()
    {
        // = Handle SPA Refresh Page through Browser =
        // - check the virtual path of current request
        // - if 404 and GET and user is authenticated and not "/file.xyz" and not "/api/values"
        if (Context.Response.StatusCode == (int)System.Net.HttpStatusCode.NotFound &&
            Context.Request.HttpMethod == "GET" &&
            Context.User.Identity.IsAuthenticated &&
            !Path.HasExtension(Context.Request.Path) && 
            !Context.Request.Path.StartsWith("/api/", StringComparison.OrdinalIgnoreCase))
        {
            Response.Clear();
            Response.WriteFile("~/wwwroot/index.html");
            Response.StatusCode = (int)System.Net.HttpStatusCode.OK;
        }
    }
}
```

## Finally

At this point we are done. We put the MVC stuff into the vue project, build that project and put the ``dist`` folder back to the ``wwwroot`` folder. All MVC parts are removed from the old project. Now we have the Web API stuff and the SPA (all the static files in the ``wwwroot``). Run the old project locally it should work.

> When deploy to production, it can be possible to change the base href in the ``wwwroot/index.html``

```html
<!-- did not work anymore, static file -->
<base href="~/">

<!-- change to your app path -->
<base href="/YourAppName/">
```
