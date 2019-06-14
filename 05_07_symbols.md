{{meta {docid: arcs_pie_charts}}}

<script src="https://d3js.org/d3.v5.min.js"></script>

<style>
    svg { background-color: white; }
</style>
# Symbols
+ [d3.symbol](https://github.com/d3/d3-shape#symbol)
+ [symbol(arguments...)](https://github.com/d3/d3-shape#_symbol)
+ [symbol.type([type])](https://github.com/d3/d3-shape#symbol_type)
+ [symbol.size([size])](https://github.com/d3/d3-shape#symbol_size)
+ [symbol.context([context])](https://github.com/d3/d3-shape#symbol_context)

```
<script>
    var small = d3.symbol().type(d3.symbolCircle).size(100);
    d3.select("#demoSmall")
        .append("path")
        .attr("d", small)
        .attr("fill", "red")
        .attr("transform", "translate(50,50)");

    var medium = d3.symbol().type(d3.symbolCircle).size(750);
    d3.select("#demoMedium")
        .append("path")
        .attr("d", medium)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", "5px")
        .attr("transform", "translate(50,50)");

    var large = d3.symbol().type(d3.symbolCircle).size(1500);
    d3.select("#demoLarge")
        .append("path")
        .attr("d", large)
        .attr("fill", "green")
        .attr("fill-opacity", "0.5")
        .attr("transform", "translate(50,50)");

    var huge = d3.symbol().type(d3.symbolCircle).size(3000);
    d3.select("#demoHuge")
        .append("path")
        .attr("d", huge)
        .attr("transform", "translate(50,50)");
</script>

<svg id="demoSmall" width="100" height="100"></svg>
<svg id="demoMedium" width="100" height="100"></svg>
<svg id="demoLarge" width="100" height="100"></svg>
<svg id="demoHuge" width="100" height="100"></svg>
```

## Built-in Symbols

D3 comes with 7 symbols built-in. To use them, assign them in the `.type(symbol)` method on the symbol generator such as:
<pre>
var square = d3.symbol().type(d3.symbolSquare).size(x);
</pre>
Make sure to remember that the `.size()` is the <i>area</i> of the shape and the dimensions will change differently based on the shape.

+ [d3.symbols](https://github.com/d3/d3-shape#symbols)
+ [d3.symbolCircle](https://github.com/d3/d3-shape#symbolCircle)
+ [d3.symbolCross](https://github.com/d3/d3-shape#symbolCross)
+ [d3.symbolDiamond](https://github.com/d3/d3-shape#symbolDiamond)
+ [d3.symbolSquare](https://github.com/d3/d3-shape#symbolSquare)
+ [d3.symbolStar](https://github.com/d3/d3-shape#symbolStar)
+ [d3.symbolTriangle](https://github.com/d3/d3-shape#symbolTriangle)
+ [d3.symbolWye](https://github.com/d3/d3-shape#symbolWye)

```
<script>

    var circle = d3.symbol().type(d3.symbolCircle).size(1000);
    d3.select("#demoCircle")
        .append("path")
        .attr("d", circle)
        .attr("transform", "translate(42.5,42.5)");

    var cross = d3.symbol().type(d3.symbolCross).size(1000);
        d3.select("#demoCross")
            .append("path")
            .attr("d", cross)
            .attr("transform", "translate(42.5,42.5)");

    var diamond = d3.symbol().type(d3.symbolDiamond).size(1000);
    d3.select("#demoDiamond")
        .append("path")
        .attr("d", diamond)
        .attr("transform", "translate(42.5,42.5)");

    var square = d3.symbol().type(d3.symbolSquare).size(1000);
     d3.select("#demoSquare")
         .append("path")
         .attr("d", square)
         .attr("transform", "translate(42.5,42.5)");

    var star = d3.symbol().type(d3.symbolStar).size(1000);
    d3.select("#demoStar")
        .append("path")
        .attr("d", star)
        .attr("transform", "translate(42.5,42.5)");

    var triangle = d3.symbol().type(d3.symbolTriangle).size(1000);
    d3.select("#demoTriangle")
        .append("path")
        .attr("d", triangle)
        .attr("transform", "translate(42.5,42.5)");

    var wye = d3.symbol().type(d3.symbolWye).size(1000);
    d3.select("#demoWye")
        .append("path")
        .attr("d", wye)
        .attr("transform", "translate(42.5,42.5)");

</script>
<svg id="demoCircle" width="85" height="85"></svg>
<svg id="demoCross" width="85" height="85"></svg>
<svg id="demoDiamond" width="85" height="85"></svg>
<svg id="demoSquare" width="85" height="85"></svg>
<svg id="demoStar" width="85" height="85"></svg>
<svg id="demoTriangle" width="85" height="85"></svg>
<svg id="demoWye" width="85" height="85"></svg>
```

## Custom Symbols

D3 allows the creation of new symbols to use. To create a new symbol create a new object that has a function that implements the `draw(context, size)` interface.
Inside of the implementation use [CanvasPathMethods](https://www.w3.org/TR/2dcontext/#canvaspathmethods) on the context to devise a new shape.
For example a definition of a custom square symbol:
<pre>
    var customSymbolSquare = {
        draw: function(context, size){
            let s = Math.sqrt(size)/2;
            context.moveTo(s,s);
            context.lineTo(s,-s);
            context.lineTo(-s,-s);
            context.lineTo(-s,s);
            context.closePath();
        }
    }
</pre>
Keep in mind that new symbols are supposed to be centered at (0,0) and have an accurate and dynamic size.

After defining a custom symbol, it can be used any way a built-in symbol can be used:
<pre>
    var customSqr = d3.symbol().type(customSymbolSquare).size(500);
    d3.select("#svgID")
        .append("path")
        .attr("d", customSqr)
        .attr("transform", "translate(x,y)");

</pre>

Examples of custom symbols (square, right triangle, and semi circle):
```
<script>
    //Custom Square, Example only: use d3.symbolSquare instead
    var customSymbolSquare = {
        draw: function(context, size){
        let s = Math.sqrt(size)/2;
        context.moveTo(s,s);
        context.lineTo(s,-s);
        context.lineTo(-s,-s);
        context.lineTo(-s,s);
        context.closePath();
        }
    }
    var customSqr = d3.symbol().type(customSymbolSquare).size(500);
    d3.select("#demoCustomSquare")
        .append("path")
        .attr("d", customSqr)
        .attr("transform", "translate(50,50)");

    //Custom Right Triangle, may not be accurately centered at the centroid of the triangle
    var customShapeTri = {
        draw: function(context, size) {
          let s = Math.sqrt(size/4);
          context.moveTo(-s, s*2)
          context.lineTo(s*2, -s);
          context.lineTo(-s, -s);
          context.closePath();
        }
    }
    var customTri = d3.symbol().type(customShapeTri).size(500);
    d3.select("#demoCustomTri")
        .append("path")
        .attr("d", customTri)
        .attr("transform", "translate(50,50)");

    //Custom Semi Circle, accurate center and size
    var customShapeCircle = {
        draw: function(context, size) {
          let r = Math.sqrt(2 * size / Math.PI);
          let orgin = (4 * r) / (3 * Math.PI); //the orgin of the circle, not of the symbol
          context.arc(0, -orgin, r, Math.PI, 2 * Math.PI, true);
          context.closePath();
        }
    }
    var customCircle = d3.symbol().type(customShapeCircle).size(500);
    d3.select("#demoCustomCircle")
        .append("path")
        .attr("d", customCircle)
        .attr("transform", "translate(50,50)");

</script>

<svg id="demoCustomSquare" width="100" height="100"></svg>
<svg id="demoCustomTri" width="100" height="100"></svg>
<svg id="demoCustomCircle" width="100" height="100"></svg>
```





