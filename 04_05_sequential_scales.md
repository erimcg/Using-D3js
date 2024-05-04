{{meta {docid: sequential_scales}}}
{{meta {description: ""}}}

<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="//d3js.org/d3-scale-chromatic.v0.3.min.js"></script>

<script>
var colorA = "purple", colorB = "orange";

function drawScale(id, interpolator) {
    var data = Array.from(Array(100).keys());

    var cScale = d3.scaleSequential()
        .interpolator(interpolator)
        .domain([0,99]);

    var xScale = d3.scaleLinear()
        .domain([0,99])
        .range([0, 580]);

    var u = d3.select("#" + id)
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => Math.floor(xScale(d)))
        .attr("y", 0)
        .attr("height", 40)
        .attr("width", (d) => {
            if (d == 99) {
                return 6;
            }
            return Math.floor(xScale(d+1)) - Math.floor(xScale(d)) + 1;
         })
        .attr("fill", (d) => cScale(d));
  }
</script>

# Sequential Scales

The [scaleSequential(interpolator)](https://github.com/d3/d3-scale/blob/master/README.md#sequential-scales) method maps a continuous domain to a continuous range defined by an interpolator function.  You can define your own interpolator function or use a built-in d3 interpolator function. For information about defining your own interpolator function, see the D3 [interpolate documentation](https://github.com/d3/d3-interpolate).

A sequential scale is particularly useful for mapping a continuous interval of numeric values to a series of colors. Below, we describe how to use `scaleSequential` and provide an inventory of the various interpolator functions provided by D3.

## Defining a Sequential Scale

Recall that `scaleSequential` is a scaling function generator.  It generates a function that can be used to scale values from some domain to values in some range.

There are two ways to create a sequential scaling function.  The first way is to call the `scaleSequential` generator method without passing it an argument.  This creates a scaling function on which we call `domain` to set the domain and `interpolator` to set the interpolator function.  The domain by default is the interval [0,1].

In the example below, we create a sequential scaling function that maps the continuous domain of values between 0 and 99 to the continuous range of colors between *purple* and *orange*.

<pre>
colorScale = d3.scaleSequential()
    .domain([0,99])
    .interpolator(d3.interpolate("purple", "orange"));
</pre>

We can also pass an interpolator directly to `scaleSequential` as shown below.

<pre>
var colorScale = d3.scaleSequential(d3.interpolate("purple", "orange"))
    .domain([0,99]);
</pre>

In each of the examples below we'll use the function `drawScale` shown below.  The function fills an svg element with 100 rectangles that are positioned adjacent to one another.  Each rectangle is filled with a color that is determined by the sequential scaling function.

The function has 2 arguments.  The first is the id of an svg element and the second is an interpolator.  The function first creates an array of integers from 0 to 99, creates a scaling function that maps the domain [0,99] to the continuous range of colors between purple and orange, and creates a linear scale that maps the domain [0,99] to [0, 580].

Each of the 100 rectangles has a unique integer between 0 and 99 joined to it.  That data value is then used with the linear scale to find the position of the rectangle on the x-axis and used with the color scale to determine the color of the rectangle.

``` {cm: visible}
<script>
  var colorA = "purple", colorB = "orange";

  function drawScale(id, interpolator) {
    var data = Array.from(Array(100).keys());

    var cScale = d3.scaleSequential()
        .interpolator(interpolator)
        .domain([0,99]);

    var xScale = d3.scaleLinear()
        .domain([0,99])
        .range([0, 580]);

    var u = d3.select("#" + id)
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => Math.floor(xScale(d)))
        .attr("y", 0)
        .attr("height", 40)
        .attr("width", (d) => {
            if (d == 99) {
                return 6;
            }
            return Math.floor(xScale(d+1)) - Math.floor(xScale(d)) + 1;
         })
        .attr("fill", (d) => cScale(d));
  }

  drawScale("seq1", d3.interpolate(colorA, colorB));
</script>

<svg id="seq1" width="580" height="40" ></svg>
```

### Interpolator Generators

D3 provides a set of color space interpolator generators in the [interpolator](https://github.com/d3/d3-interpolate#color-spaces) library. These interpolator generators take as an argument either a pair of colors or an array of colors and return an interpolator.  For example, below we pass to the scale's `interpolator` method the RGB interpolator generator with the colors purple and orange.

<pre>
colorScale = d3.scaleSequential()
    .interpolator(d3.interpolateRgb("purple", "orange"))
    .domain([0,99]);
</pre>

d3.interpolateRgb(a,b)

```
<svg id="seq20" width="580" height="40" ></svg>
<script>
  drawScale("seq20", d3.interpolateRgb(colorA, colorB));
</script>
```

d3.interpolateRgbBasis(colors)

```
<svg id="seq21" width="580" height="40" ></svg>
<script>
  drawScale("seq21", d3.interpolateRgbBasis([colorA, colorB]));
</script>
```

d3.interpolateRgbBasisClosed(colors)
```
<svg id="seq22" width="580" height="40" ></svg>
<script>
  drawScale("seq22", d3.interpolateRgbBasisClosed([colorA, colorB]));
</script>
```

d3.interpolateHsl(a, b)
```
<svg id="seq23" width="580" height="40" ></svg>
<script>
  drawScale("seq23", d3.interpolateHsl(colorA, colorB));
</script>
```

d3.interpolateHslLong(a, b)
```
<svg id="seq24" width="580" height="40" ></svg>
<script>
  drawScale("seq24", d3.interpolateHslLong(colorA, colorB));
</script>
```

d3.interpolateLab(a, b)
```
<svg id="seq25" width="580" height="40" ></svg>
<script>
  drawScale("seq25", d3.interpolateLab(colorA, colorB));
</script>
```

d3.interpolateHcl(a, b)
```
<svg id="seq26" width="580" height="40" ></svg>
<script>
  drawScale("seq26", d3.interpolateHcl(colorA, colorB));
</script>
```

d3.interpolateHclLong(a, b)
```
<svg id="seq27" width="580" height="40" ></svg>
<script>
  drawScale("seq27", d3.interpolateHclLong(colorA, colorB));
</script>
```

d3.interpolateCubehelix(a, b)
```
<svg id="seq28" width="580" height="40" ></svg>
<script>
  drawScale("seq28", d3.interpolateCubehelix(colorA, colorB));
</script>
```

d3.interpolateCubehelixLong(a, b)
```
<svg id="seq29" width="580" height="40" ></svg>
<script>
  drawScale("seq29", d3.interpolateCubehelixLong(colorA, colorB));
</script>
```

## Chromatic Interpolators

D3's [chromatic library](https://github.com/d3/d3-scale-chromatic) contains a set of interpolators (not interpolator generators)  that are based on Cynthia A brewer's ColorBrewer color schemes.  In order to use these interpolators you must load the chromatic script separately.

<pre>&lt;script src="//d3js.org/d3-scale-chromatic.v0.3.min.js"&gt;&lt;/script&gt;</pre>

These interpolators don't have arguments and are used as shown below.

<pre>
colorScale = d3.scaleSequential()
    .interpolator(d3.interpolateBrBG)
    .domain([0,99]);
</pre>

### Diverging

d3.interpolateBrBG
```
<svg id="seq31" width="580" height="40" ></svg>
<script>
  drawScale("seq31", d3.interpolateBrBG);
</script>
```

d3.interpolatePRGn
```
<svg id="seq32" width="580" height="40" ></svg>
<script>
  drawScale("seq32", d3.interpolatePRGn);
</script>
```

d3.interpolatePiYG
```
<svg id="seq33" width="580" height="40" ></svg>
<script>
  drawScale("seq33", d3.interpolatePiYG);
</script>
```

d3.interpolatePuOr
```
<svg id="seq34" width="580" height="40" ></svg>
<script>
  drawScale("seq34", d3.interpolatePuOr);
</script>
```

d3.interpolateRdBu
```
<svg id="seq35" width="580" height="40" ></svg>
<script>
  drawScale("seq35", d3.interpolateRdBu);
</script>
```

d3.interpolateRdGy
```
<svg id="seq36" width="580" height="40" ></svg>
<script>
  drawScale("seq36", d3.interpolateRdGy);
</script>
```

d3.interpolateRdYlBu
```
<svg id="seq37" width="580" height="40" ></svg>
<script>
  drawScale("seq37", d3.interpolateRdYlBu);
</script>
```

d3.interpolateRdYlGn
```
<svg id="seq38" width="580" height="40" ></svg>
<script>
  drawScale("seq38", d3.interpolateRdYlGn);
</script>
```

d3.interpolateSpectral
```
<svg id="seq39" width="580" height="40" ></svg>
<script>
  drawScale("seq39", d3.interpolateSpectral);
</script>
```

### Single Hue

d3.interpolateBlues
```
<svg id="seq310" width="580" height="40" ></svg>
<script>
  drawScale("seq310", d3.interpolateBlues);
</script>
```

d3.interpolateGreens
```
<svg id="seq311" width="580" height="40" ></svg>
<script>
  drawScale("seq311", d3.interpolateGreens);
</script>
```

d3.interpolateGreys
```
<svg id="seq312" width="580" height="40" ></svg>
<script>
  drawScale("seq312", d3.interpolateGreys);
</script>
```

d3.interpolateOranges
```
<svg id="seq313" width="580" height="40" ></svg>
<script>
  drawScale("seq313", d3.interpolateOranges);
</script>
```

d3.interpolatePurples
```
<svg id="seq314" width="580" height="40" ></svg>
<script>
  drawScale("seq314", d3.interpolatePurples);
</script>
```

d3.interpolateReds
```
<svg id="seq315" width="580" height="40" ></svg>
<script>
  drawScale("seq315", d3.interpolateReds);
</script>
```

### Sequential

d3.interpolateViridis
```
<svg id="seq316" width="580" height="40" ></svg>
<script>
  drawScale("seq316", d3.interpolateViridis);
</script>
```

d3.interpolateInferno
```
<svg id="seq317" width="580" height="40" ></svg>
<script>
  drawScale("seq317", d3.interpolateInferno);
</script>
```

d3.interpolateMagma
```
<svg id="seq318" width="580" height="40" ></svg>
<script>
  drawScale("seq318", d3.interpolateMagma);
</script>
```

d3.interpolatePlasma
```
<svg id="seq319" width="580" height="40" ></svg>
<script>
  drawScale("seq319", d3.interpolatePlasma);
</script>
```

d3.interpolateWarm
```
<svg id="seq320" width="580" height="40" ></svg>
<script>
  drawScale("seq320", d3.interpolateWarm);
</script>
```

d3.interpolateCool
```
<svg id="seq321" width="580" height="40" ></svg>
<script>
  drawScale("seq321", d3.interpolateCool);
</script>
```

d3.interpolateCubehelixDefault
```
<svg id="seq322" width="580" height="40" ></svg>
<script>
  drawScale("seq322", d3.interpolateCubehelixDefault);
</script>
```

d3.interpolateBuGn
```
<svg id="seq323" width="580" height="40" ></svg>
<script>
  drawScale("seq323", d3.interpolateBuGn);
</script>
```

d3.interpolateBuPu
```
<svg id="seq324" width="580" height="40" ></svg>
<script>
  drawScale("seq324", d3.interpolateBuPu);
</script>
```

d3.interpolateGnBu
```
<svg id="seq325" width="580" height="40" ></svg>
<script>
  drawScale("seq325", d3.interpolateGnBu);
</script>
```

d3.interpolateOrRd
```
<svg id="seq326" width="580" height="40" ></svg>
<script>
  drawScale("seq326", d3.interpolateOrRd);
</script>
```

d3.interpolatePuBuGn
```
<svg id="seq327" width="580" height="40" ></svg>
<script>
  drawScale("seq327", d3.interpolatePuBuGn);
</script>
```

d3.interpolatePuBu
```
<svg id="seq328" width="580" height="40" ></svg>
<script>
  drawScale("seq328", d3.interpolatePuBu);
</script>
```

d3.interpolatePuRd
```
<svg id="seq329" width="580" height="40" ></svg>
<script>
  drawScale("seq329", d3.interpolatePuRd);
</script>
```

d3.interpolateRdPu
```
<svg id="seq330" width="580" height="40" ></svg>
<script>
  drawScale("seq330", d3.interpolateRdPu);
</script>
```

d3.interpolateYlGnBu
```
<svg id="seq331" width="580" height="40" ></svg>
<script>
  drawScale("seq331", d3.interpolateYlGnBu);
</script>
```

d3.interpolateYlGn
```
<svg id="seq332" width="580" height="40" ></svg>
<script>
  drawScale("seq332", d3.interpolateYlGn);
</script>
```

d3.interpolateYlOrBr
```
<svg id="seq333" width="580" height="40" ></svg>
<script>
  drawScale("seq333", d3.interpolateYlOrBr);
</script>
```

d3.interpolateYlOrRd
```
<svg id="seq334" width="580" height="40" ></svg>
<script>
  drawScale("seq334", d3.interpolateYlOrRd);
</script>
```

### Cyclical

d3.interpolateRainbow
```
<svg id="seq335" width="580" height="40" ></svg>
<script>
  drawScale("seq335", d3.interpolateRainbow);
</script>
```