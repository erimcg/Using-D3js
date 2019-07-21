{{meta {docid: require}}}

<style>

</style>

<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/d3-require@1"></script>

# Require
In this section we discuss using `d3.require`.

`d3.require` is a promise-based implementation to require [asynchronous module definitions](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) (AMD). 

`d3.require` has to be loaded separately to work on our pages: 
<pre>
&lt;script src="https://cdn.jsdelivr.net/npm/d3-require@1">&lt;/script>
</pre>


+ [d3.require(names…)](https://github.com/d3/d3-require#require)

``` {cm: visible}
<script>
    d3.require("d3-queue").then(D3 => {
        D3.queue()
            .defer( () => d3.select("#demo1").text("d3.queue loaded"));
    });
</script>
<div id="demo1"></div>
```
<figure class="sandbox"><figcaption>Figure 1  - d3.require loading d3-queue and then displaying when it is looaded.  </figcaption></figure>

+ [d3.requireFrom(resolver)](https://github.com/d3/d3-require#requireFrom)

``` {cm: visible}
<script>
    var require = d3.requireFrom(async name => {
        return `https://unpkg.com/${name}`;
    });
    
    require("d3-queue").then(D3 => {
        D3.queue()
            .defer( () => d3.select("#demo2").text("d3.queue loaded"));
    });
</script>
<div id="demo2"></div>
```
<figure class="sandbox"><figcaption>Figure 2  - d3.require loading d3-queue from unpkg instead of jsdelivr.  </figcaption></figure>

## Errors

If any errors are thrown from d3.require, the class of the error will be [d3.RequireError](https://github.com/d3/d3-require#RequireError).