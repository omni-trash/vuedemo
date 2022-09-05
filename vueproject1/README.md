# vueproject

## Project setup
```
npm install
```

## Compiles and hot-reloads for development
```
npm run serve
```

## Compiles and minifies for production
```
npm run build
```

## Lints and fixes files
```
npm run lint
```

## Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Windows Terminal
Use the Windows Terminal or Powershell to run the commands below.

The integrated PM Console and Powershell Console seems to be buggy
in Visual Studio 2022 (v17.3.0).

Ensure you run the Terminal in the project folder with the 
``package.json`` (needed for the commands).

## Environment Files
Create ``.env`` and ``.env.production`` to set up some Variables to use
in your code or ``vue.config.js`` when build the app.

See [Environment Variables](https://cli.vuejs.org/guide/mode-and-env.html#using-env-variables-in-client-side-code).

## vue.config.js
Change ``devServer`` to use ``server``, ``type`` and ``options`` in
``module.exports`` section instead of ``http`` keyword.

```javascript
module.exports = {
    publicPath: process.env.VUE_APP_PUBLIC_PATH,
    productionSourceMap: false,
    devServer: {
        server: {
            type: 'https',
            options: {
                key: fs.readFileSync(keyFilePath),
                cert: fs.readFileSync(certFilePath),
            }
        },
        port: 5002
    }
}
```

## preview locally
After build u can test the dist files locally.

```
npm install -g serve
serve -s dist
```

## ESLint Multi Word Component Names Error
U can add a rule for eslint in ``package.json`` 
to disable the "multi word component names" errors globally.

```json
"eslintConfig": {
    "rules": {
        "vue/multi-word-component-names": 0
    }
}
```

Or u rename the .vue-Files from Home to HomeView
and from About to AboutView ... and so on.

Or u disable eslint on save in the ``vue.config.js``

```javascript
module.exports = {
    lintOnSave: false,
    ...
}
```

see: https://cli.vuejs.org/config/

## Json Server

- for development
- api backend
- put the mock data in the ``data/db.json``
- change ```.env VUE_APP_ROOT_API=http://localhost:3000/```

The json server starts a complete api service and he writes to the ``db.json``, when post data!

```
npm i -g json-server
json-server --watch data/db.json
npm run serve
```

## Test dist

- run the json server or the webapi project, depends on Url in ``.env.production VUE_APP_ROOT_API``
- launch the build

```
npm run build
json-server --watch data/db.json
serve -s dist
```
## $route

- dont fetch data when route changed
- when navigate to other view, it can be that the previous view will fetch the data again (but it makes sense, we didn't say "fetch data first time only")

```typescript
// bad
watch: {
    "$route": "fetchData"
}
```

- fetch data when parameter changed (thats ok)

```typescript
// routers
{
    path: '/Contract/:id',
    props: true,
    component: Contract,
},
```

```typescript
// Contract
// ok
props: ['id'],
watch: {
    'id': 'fetchData'
},
```

## Global Custom Properties

- we have to tell typescript, that there are global custom properties (if not, we have errors in code editor)

```typescript
// typings.d.ts
import utils from './utils';

declare module 'vue' {
  interface ComponentCustomProperties {
    $utils: typeof utils
  }
}

```

```typescript
// main.ts
app.config.globalProperties.$utils = utils;
```

```html
<!-- ContractItem.vue -->
<div>{{ $utils.formatDate(forecast.date) }}</div>
```

- rewrite utils as plugin

```typescript
// utils.ts
function install(app: any, options: any) {
    app.config.globalProperties.$utils = utils;
}

const utils = {
    install,
    ...
}

export default utils;
```

```typescript
// main.ts

//app.config.globalProperties.$utils = utils
app.use(utils);
```


## Refresh Page

- on refresh page with browser, and we are routed (``/Kontrakt/5``), then the server returns 404 (Not Found)
- all the routing stuff is made with the browser history API (client side)
- configure the server to return ``/index.html`` instead of ``/404.html``

```typescript
// vue.config.js
module.exports = {
    ...
    devServer: {
        historyApiFallback: true,
        ...
    }
}
```

- ensure u have set a base url in the index.html

```html
<!DOCTYPE html>
<html lang="">

  <head>
    <base href="/<%= BASE_URL %>">
    ...
```

## Vue Store

- use Vuex for Vue 2 projects
- use Pinia for new Vue 3 projects

### State Managenemnt

- each component has a local state, vue store means global state.
- with local state u have to trigger changes from component to component to component.
- with global state they are centralized and available in all components.

