Getting started (Hello World)
----------

### Creating the API

The first step is to create a standard Node.js package

```
<path-to-your-app>/
    package.json
    README.md
```

Your package.json should include ```datanode```

```node
{
    "name": "hello-world",
    "description": "Hello World API",
    "engines": { "node": "~0.8.6" },
    "dependencies": {
        "datanode" : "> 0.0.0"
    }
}
```

Next we define the API. This is where the magic is. Create a file called HelloService.js

```node
var o = require('maker').o(module)
var __ = require('maker').__(module, true)

module.exports = __(function() { return o({
  _type: 'datanode/ObjectServer',
  port: 8888,
  endpoints: {
    hello: o({
      _type: 'datanode/Endpoint',
      get: function(req) {
        return { msg: "Hello World!" }
      }
    })
  }
})})
```

### Running the API

```console
% node HelloService.js
[Mon Feb 09 2015 21:56:41 GMT-0800 (PST)] INFO: ObjectServer starting...
[Mon Feb 09 2015 21:56:41 GMT-0800 (PST)] INFO: ObjectServer listening on port 8888
[Mon Feb 09 2015 21:56:41 GMT-0800 (PST)] INFO: ObjectServer running
```

### Connecting to your API

You now have a RESTful web service running on port 8888. You can connect to it via HTTP in a variety of ways. 

**Simple curl test**

```console
% curl localhost:8888/hello
{ "msg": "Hello World!" }
%
```

**API Browser**

In your web browser navigate to [http://localhost:8888/apidoc](http://localhost:8888/apidoc)

_INSERT IMAGE_

### More examples

Studying examples is a great way to learn. We have tons of examples at LINK