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

You have to setup CORS in the old project to access the api endpoints from your vue project.
```xml
<customHeaders>
    <add name="Access-Control-Allow-Origin" value="https://localhost:5002" />
    <add name="Access-Control-Allow-Credentials" value="true" />
    </customHeaders>
</httpProtocol>
```

> Remove custom headers when deploy the app to production

You can also enable CORS in the ``Startup.cs``.

```csharp
public class Startup
{
    public void Configuration(IAppBuilder app)
    {
        // during development
        app.UseCors(CorsOptions.AllowAll);
        ...
    }
}
```
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

## How to resolve the Web Application Path at Runtime

We know that the ``wwwroot/index.html`` is a static file and that we have to set the base href to the current public path.

Ok let us change the ``index.html`` to a dynamic page ``index.aspx``. 

> The file extension for Web Forms is ``.aspx``.

> The file extension for Razor is ``.cshtml``.

Razor is more complicated to configure, let us use Web Forms instead.

```html
<!-- Resolve App Path in Web Forms -->
<base href='<%= ResolveUrl("~/") %>'>
```

Now add a route to that page.

```csharp
public class RouteConfig
{
    public static void RegisterRoutes(RouteCollection routes)
    {
        routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

        // Web Forms (!)
        routes.MapPageRoute("", "", "~/wwwroot/index.aspx");
    }
}
```

Ok that's all, but it will not work with the ``Application_EndRequest`` above, were we try to read the ``index.html``.

- [ ] Maybe we have to use ``Response.Redirect("~/")`` in ``Application_EndRequest`` (404).

> We have to change from ``index.html`` to ``index.aspx`` after each production build manually

## Create the index.aspx during production build

After some research i'm able to let u know how we can create the ``index.aspx`` on each production build.

At first we set the public path in the ``prod.environment`` to the statement we need.

```javascript
VUE_APP_PUBLIC_PATH=<%= Resolve.Url("~/") %>
```

The statement is not handled with webpack templating and can be injected as is.

No we have to prepare the ``public/index.html``.

Replace the base tag.

Before
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <base href="<%= process.env.VUE_APP_PUBLIC_PATH %>">
    ...
```

After
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <%= headHtmlBaseTag %>
    ...
```

Now we have to configure the html plugin in ``vue.config.js``.

```javascript
    // vue.config.js
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            const options = args[0];

            // on production build (!)
            if (process.env.NODE_ENV === 'production') {
                // note that public/index.html works as template during build
                // public/index.html -> webpack -> dist/index.aspx
                options.filename = 'index.aspx';
            }

            // adds a template parameter we can use in the public/index.html
            options.templateParameters = {
                headHtmlBaseTag: `<base href='${process.env.VUE_APP_PUBLIC_PATH}'>`
            };

            // let the html source code human readable
            // and keep the injected '<%= %>' as is (see env.production).
            options.minify = false;

            return args;
        });
    },
```
