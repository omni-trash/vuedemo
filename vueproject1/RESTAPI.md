# Note on REST API

When consume REST API the response is formatted as ``JSON`` and can be deserialized to an object with ``JSON.parse()``. 

In JavaScript names are case sensitive, so the next example contains two properties ``name`` and ``Name``.

```javascript
var data = {
	name: "Bob",
	Name: "Gina",
};

console.log(data.name); // Bob
console.log(data.Name); // Gina
```

The API endpoint and data are like a contract
- data and types
- names to use

U know there are different styles to write names
- camelCase
- PascalCase
- snake_case
- kebab-case

The next example contains four properties:

```javascript
var data = {
	firstName: "Bob",
	FirstName: "Gina",
	first_name: "Frodo",
	"first-name": "Jennifer",
}

console.log(data.firstName);     // Bob
console.log(data.FirstName);     // Gina
console.log(data.first_name);    // Frodo
console.log(data["first-name"]); // Jennifer
```

There is no naming rule for REST API, but most services use the camel case style.

When the service changed names whe have to deploy a new client (SPA) to reflect these changes.

If not then we use invalid properties.

To fix that problem we can remap properties, for example as upper case names, and use them in the client project.

```javascript
function castUpperNames(payload) {
	return Object.keys(payload).reduce((result, key) => {
		const upperKey   = key.toUpperCase().replace(/[-_]/g, "");
		result[upperKey] = payload[key];
		return result;
	}, {});
}

var payload = {
	firstName: "Bob",
	FirstName: "Gina",
	first_name: "Frodo",
	"first-name": "Jennifer",
};

var data = castUpperNames(payload);

// {"FIRSTNAME":"Jennifer"}
console.log(JSON.stringify(data));

// Jennifer
console.log(data.FIRSTNAME);
```

Ok so far, we can see that all names except the last are gone, but ok.

If we use TypeScript, we can write an interface to use in the project.

```typescript
interface User {
	FIRSTNAME: string,
}
```

Make no sense, but the point is that we have an object where the properties are same even the service changes his naming style.

But why should the services change the names?

Well, for example we serialize a DataTable, all the names are from the column naming style in the SQL Statement.

If we post data to the server, then we have to use the server naming contract, so be careful.

> When the server use ``Newtonsoft.Json``, then he will deserialize case insensitive per default.

> When the server use ``Json.NET``, then he will deserialize case sensitive per default.

Ok back to the client project, we have another solution to avoid these conflicts, we can use a ``Proxy``.

A ``Proxy`` class is a wrapper for an object, where we can write a handler to access the underlying object for reading and writing.

> The Proxy class is a part of the ECMAScript Language Specification

```javascript
// Basic Syntax
var proxy = new Proxy(wrappedObject, {
	get(target, prop) {
		return target[prop];
	},
	set(target, prop, value) {
		target[prop] = value;
		return true;
	}
});
```

Let us write a function for all that stuff.

```typescript
// returns a proxy to access data case insensitive
function proxy<T>(data: any) {

	// finds a key case insensitive
	function keyToUse(key: string): string {
		const keyUpper: string = key.toUpperCase();
		return Object.keys(data).filter(key => key.toUpperCase() == keyUpper)[0] ?? key;
	}

	// Note target is data, same object
	return new Proxy(data, {
		get(target, prop: string) {
			return target[keyToUse(prop)];
		},
		set(target, prop: string, value) {
			target[keyToUse(prop)] = value;
			return true;
		}
	}
}

interface User {
	Name: string,
}

const payload = {
	name: "Susan",
};

const user: User = proxy<User>(payload);

// Susan
console.log(user.Name);

// {"name":"Susan"}
console.log(JSON.stringify(user));
```
Note that the property ``name`` of payload is not changed to ``Name``, even we serialize the proxy.

That is we have only defined getter and setter to access the values.

```javascript
// ["name"]
Object.keys(user);

console.log(user.name) 			// Error: name not defined (see interface User)
console.log(user.Name) 			// Susan
console.log((user as any).NAME) // Susan
console.log((user as any).NaMe) // Susan
```

The error comes throught the type check from TypeScript.

Great, but wait.

When we copy the "Proxy" he will gone.

```javascript
const person: User = {...user};

console.log(person.Name)          // undefined
console.log((person as any).name) // Susan
```

Make sense, to avoid nested proxy calls.

> Proxy is a virtual object in JS Engine.

```typescript
// create proxy when copying
const person: User = proxy<User>({...user});

console.log(person.Name) // Susan
```

Ok, yes it can be useful.
