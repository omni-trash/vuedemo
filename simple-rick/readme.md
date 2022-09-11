# Did i need a huge project with node.js and all the stuff to create a static vue HTML?

The answer is NO.

For smaller smart projects it is possible to made it fast without a extra project.

- u need to load vue (as global) from a CDN or local file
- u lost all the bundle stuff and minimization

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="path to global vue from cdn or local file whatever u want"></script>
</head>
<body>
    <h1>Simple Rick</h1>
    <div id="app">
        {{ greetings }}
    </div>

    <script>
        const app = Vue.createApp({
            data() {
                return {
                    greetings: "Hello from Vue"
                };
            }
        });

        app.mount("#app");
    </script>    
</body>
</html>
```
