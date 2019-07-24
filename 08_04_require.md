{{meta {docid: require}}}

<style>

</style>

<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/d3-require@1"></script>

# Require
In this section we discuss `d3.require`. 

`d3.require` is a promise-based implementation to require [asynchronous module definitions](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) (AMD). As per the [API of D3.js](https://github.com/d3/d3-require#d3-require), `d3.require` is designed to work with browser-targeting libraries that implement one of the [recommended UMD patterns](https://github.com/umdjs/umd). [D3.js's API](https://github.com/d3/d3-require#d3-require) lays out the following constraints of this implementation:

+ The `define` method must be called synchronously by the library on load.
+ Only the built-in `exports` and `module` dependencies are allowed; no `require` as in CommonJS. The `module` entry only contains an `exports` property.
+ Named module definitions (*e.g.*, jQuery) are treated as anonymous modules.

`d3.require` is not included in `https://d3js.org/d3.v5.min.js`, so it has to be loaded separately: 
<pre>
&lt;script src="https://cdn.jsdelivr.net/npm/d3-require@1">&lt;/script>
</pre>

To load a module we will use `d3.require(names...)` where `names` is a list of strings of the modules we wish to load. If we wish to load a particular version of a module we can add `@versionNumber` to the end of our module name. For instance to load the latest version of D3 we can call `d3.require("d3@5")`. 

We can load multiple modules at once by making a list of the names of the modules we wish to load. For example to load `d3.js` and `d3-queue` at the same time: `d3.require("d3@5", "d3-queue")`.

After `d3.require` loads the module(s), it will call the function inside of its' `then` property passing in an object of the module(s) it just finished loaded. If multiple objects are loaded, the object passed in will be all of the modules combined. 

+ [d3.require(names…)](https://github.com/d3/d3-require#require) - Loads a module and returns a `require` function that calls the function in the object's `then` property after the module is loaded, passing in an object containing the module(s) loaded.

In Figure 1 we use `d3.require` to load D3.js and d3-queue. We then use `d3.queue` to perform a task to add text to a `div` stating that the module is loaded. 

`https://d3js.org/d3.v5.min.js` is **not** loaded on this page, so if we want to use most of D3.js we will load it via `d3.require`.

``` {cm: visible}
<script>
    d3.require("d3@5", "d3-queue").then(d3 => {
        d3.queue()
            .defer( () => d3.select("#demo1").text("d3.queue loaded"));
    });
</script>
<div id="demo1"></div>
```
<figure class="sandbox"><figcaption>Figure 1  - d3.require loading d3-queue and then displaying when it is loaded.  </figcaption></figure>

## requireFrom

By default `d3.require` loads from [jsDelivr](https://www.jsdelivr.com/). To change this we can use `d3.requireFrom` to change where a require loads from. 

`d3.requireFrom` returns a *require* function that loads modules from the *resolver*, which is the function that we set in `d3.requireFrom`. The *resolver* should take a module name and return back a URL that contains the module.

For example, to set a *require* to load from [unpkg](https://unpkg.com) instead of [jsDelivr](https://www.jsdelivr.com/):
<pre>
var require = d3.requireFrom(async name => {
        return "https://unpkg.com/" + name;
    });
</pre>

+ [d3.requireFrom(resolver)](https://github.com/d3/d3-require#requireFrom) - Returns a *require* thats loads modules from the *resolver* function instead of [jsDelivr](https://www.jsdelivr.com/). 

In Figure 2 we set a *require* to load from unpkg. Then as we did in Figure 1, we use `d3.queue` to perform a task to add text to a `div` stating that the module is loaded. 

``` {cm: visible}
<script>
    var require = d3.requireFrom(async name => {
        return "https://unpkg.com/" + name;
    });
    
    require("d3@5", "d3-queue").then(d3 => {
        d3.queue()
            .defer( () => d3.select("#demo2").text("d3.queue loaded"));
    });
</script>
<div id="demo2"></div>
```
<figure class="sandbox"><figcaption>Figure 2  - d3.require loading d3 and d3-queue from unpkg instead of jsdelivr.  </figcaption></figure>

## Errors

If any errors are thrown from `d3.require`, the class of the error will be [d3.RequireError](https://github.com/d3/d3-require#RequireError).