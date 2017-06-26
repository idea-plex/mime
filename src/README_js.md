```javascript --hide
runmd.onRequire = path => path.replace(/^mime/, '..');
```
# Mime

A comprehensive, compact MIME type module.

## Install - NPM
```
npm install mime
```

## Quick Start

For the full version (800+ MIME types, 1,000+ extensions) ...

```javascript --context
const mime = require('mime');

mime.getType('txt');                    // RESULT
mime.getExtension('text/plain');        // RESULT
```

## Lite and Browser-Ready Versions

There is also a "lite" version of this module that omits the ~600
vendor-specific (`*/vnd.*`) and experimental (`*/x-*`) types, available as
follows:

```javascript
const mime = require('mime/lite');
```

To use this module in the browser, you would typlically use
[webpack](https://webpack.github.io/) or [browserify](http://browserify.org/) to
package your code.  However, browser-ready versions are available via wzrd.in.
E.g. For the full version:

    <script src="http://wzrd.in/standalone/mime@latest"></script>

Or, for the "lite" version:

    <script src="http://wzrd.in/standalone/mime%2flite@latest"></script>

Then:

```html
<script>
mime.getType(...); // etc.
</script>
```

## Mime .vs. mime-types .vs. mime-db modules

For those of you wondering about the difference between these NPM modules,
here's a brief rundown ...

The [`mime-db`](https://github.com/jshttp/mime-db) module is "the source of
truth" for MIME type information.  It is not an API, just a dataset that
incorporates MIME type definitions from IANA, Apache, NGINX, and custom mappings
submitted by the community.

The [`mime-types`](https://github.com/jshttp/mime-types) module is a thin
wrapper around mime-db that provides an API similar to the version 1 `mime` API.

This module, `mime`, as of version 2, is a self-contained module that provides
an optimized version of `mime-db` and a simplified API, with the following
characteristics:

* Internally consistent type &hArr; extension mapping. I.e.
`mime.getType(mime.getExtension(type)) == type` will always be true
* API method naming consistent with industry best-practices
* Compact footprint.  Minified + gzip sizes of the various modules are as
follows:

Module | Size
--- | ---
`mime-db`  | 18 KB
`mime-types` | same as mime-db
`mime` | 8 KB
`mime/lite` | 2 KB

## Mime API

Both `require('mime')` and `require('mime/lite')` return instances of the MIME
class, documented below.

### new Mime(typeMap, ... more maps)

Most users of this module will not need to create Mime instances directly.
However if you would like to create custom mappings, you may do so as follows
...

```javascript --context
// Require Mime class
const Mime = require('mime/Mime');

// Define mime type -> extensions map
const typeMap = {
  'text/abc': ['abc', 'alpha', 'bet'],
  'text/def': ['leppard']
};

// Create and use Mime instance
const myMime = new Mime(typeMap);
myMime.getType('abc');            // RESULT
myMime.getExtension('text/def');  // RESULT
```

If more than one map argument is provided, each map is `define()`ed (see below), in order.

### mime.getType(pathOrExtension)

Get mime type for the given path or extension.  E.g.

```javascript --context
mime.getType('js');             // RESULT
mime.getType('json');           // RESULT

mime.getType('txt');            // RESULT
mime.getType('dir/text.txt');   // RESULT
mime.getType('dir\\text.txt');  // RESULT
mime.getType('.text.txt');      // RESULT
mime.getType('.txt');           // RESULT
```

`null` is returned in cases where an extension is not detected or recognized

```javascript --context
mime.getType('foo/txt');        // RESULT
mime.getType('bogus_type');     // RESULT
```

### mime.getExtension(type)
Get extension for the given mime type.  Charset options (often included in
Content-Type headers) are ignored.

```javascript --context
mime.getExtension('text/plain');               // RESULT
mime.getExtension('application/json');         // RESULT
mime.getExtension('text/html; charset=utf8');  // RESULT
```

### mime.define(typeMap[, force = false])

Apply type mappings.

`typeMap` is a map of type -> extensions, as documented in `new Mime`, above.

By default this method will throw an error if you try to map a type to an
extension that is already assigned to another type.  Passing `true` for the
`force` argument will suppress this behavior and apply the new mapping.

```javascript --context
mime.define({'text/x-abc': ['abc', 'abcd']});

mime.getType('abcd');            // RESULT
mime.getExtension('text/x-abc')  // RESULT
```

## Command Line

    mime [path_or_extension]

E.g.

    > mime scripts/jquery.js
    application/javascript