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
    <style>
        :root, button {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 16pt;
        }
    </style>
</head>
<body>
    <h1>Simple Rick</h1>

    <div id="app">
        <h2 :style="{color}">{{ greetings }}</h2>

        <div>current color is {{ color }}</div>

        <button type="button" @click="click">click me to change color</button>
    </div>

    <script>
        const app = Vue.createApp({
            data() {
                return {
                    greetings: "Hello from Vue",
                    color: "black",
                };
            },
            methods: {
                click() {
                    const r = Math.random() * 256 >> 0;
                    const g = Math.random() * 256 >> 0;
                    const b = Math.random() * 256 >> 0;

                    this.color = `rgb(${r}, ${g}, ${b})`;
                }
            }
        });

        app.mount("#app");
    </script>    
</body>
</html>
```
