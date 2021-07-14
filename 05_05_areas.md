{{meta {docid: areas}}}

<script src="https://unpkg.com/d3-area-label@1.5.0/build/d3-area-label.js"></script>
<script src="https://d3js.org/d3.v5.min.js"></script>

<style>
    svg { background-color: white; display: inline-block;}
    .sandbox-output { text-align: center;}
</style>

# Areas and Area Radials
In this tutorial we will discuss how to draw areas and area radials. Areas can be used on their own or with [stacks](./05_08_stacks.html).

## Areas
D3 provides [d3.area()](https://github.com/d3/d3-shape#area), a method that returns an area generator that is used to create areas.

An area is a path that can be thought of as the enclosure between two lines. 
These two "lines" are created by setting an `x` value, which is the same for each point on the lines, and two `y` values, `y0` and `y1`, which are the bottom lines `y` position and the top lines `y` position respectively. 

Like [lines](./05_02_lines.html), we have an area generator, [d3.area()](https://github.com/d3/d3-shape#area) which has accessors we can call to set how the area is generated.
We pass data into an area generator and it returns back a `string` that can be used inside a `path` `d` attribute. 
+ [area(data)](https://github.com/d3/d3-shape#_area) - Invokes the area generator using the array of data passed into it, returns back a `string` that can be used by the `d` attribute of a `path`.

However unlike lines, areas make <b>two</b> points for every set of data passed into it. These points create the upper and lower "lines" or bounds that our area encloses. The first point uses `y0` and is used as the lower bounds of the graph. The second point uses `y1` and is used as the upper bounds. Both points use the same `x` position.
+ [area.x([x])](https://github.com/d3/d3-shape#area_x) - Sets the `x` accessor to the argument passed to it which may be either a number or a function that returns a number
+ [area.y0([y])](https://github.com/d3/d3-shape#area_y0) - Sets the `y0` accessor to the argument passed to it which may be either a number or a function that returns a number, this is the first point or our lower bounds
+ [area.y1([y])](https://github.com/d3/d3-shape#area_y1) - Sets the `y1` accessor to the argument passed to it which may be either a number or a function that returns a number, this is the second point or our upper bounds

For our examples we will be using the same array of data and scales that we used with lines:
<pre>
var data = [
    {x: 0, y: 0},
    {x: 1, y: 3},
    {x: 2, y: 12},
    {x: 3, y: 8},
    {x: 4, y: 17},
    {x: 5, y: 15},
    {x: 6, y: 20}];

var xScale = d3.scaleLinear().domain([0, 6]).range([25, 175]);
var yScale = d3.scaleLinear().domain([0,20]).range([175, 25]);
</pre>

Next, we will create an area generator and set the `x`, `y0` (lower bounds), and `y1` (upper bounds) accessors:
<pre>
var area = d3.area()
      .x(d => xScale(d.x))
      .y0(yScale(0))
      .y1(d => yScale(d.y));
</pre>

And finally, just like we did with lines, we will append a `path` element and call `area(data)` in our `d` attribute. However this time we need to make sure to set a color in our `fill` attribute to show the area filled in.
<pre>
d3.select("#demo")
    .append("path")
    .attr("d", area(data))
    .attr("fill", "red")
    .attr("stroke", "black");
</pre>

In Figure 1 we use these code snippets to create an area. We also set the fill of the area to red.

```
<script>
 var data = [
    {x: 0, y: 0},
    {x: 1, y: 3},
    {x: 2, y: 12},
    {x: 3, y: 8},
    {x: 4, y: 17},
    {x: 5, y: 15},
    {x: 6, y: 20}];

   var xScale = d3.scaleLinear().domain([0, 6]).range([25, 175]);
   var yScale = d3.scaleLinear().domain([0,20]).range([175, 25]);

   var area = d3.area()
      .x(d => xScale(d.x))
      .y0(yScale(0))
      .y1(d => yScale(d.y));

   d3.select("#demo1")
    .append("path")
    .attr("d", area(data))
    .attr("fill", "red")
    .attr("stroke", "black");
</script>

<svg id="demo1" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 1 - An area created by setting the x, y0, and y1 accessors of d3.area.  </figcaption></figure>

### Setting the lower bounds

Many times we will not want our lower bounds to be 0. Instead of setting `y0` to `0` we can instead set it to whatever custom value, property, or method we choose.

In Figure 2 we set `y0` to be one-third of `y1`.

```
<script>
 var data = [
    {x: 0, y: 0},
    {x: 1, y: 3},
    {x: 2, y: 12},
    {x: 3, y: 8},
    {x: 4, y: 17},
    {x: 5, y: 15},
    {x: 6, y: 20}];

   var xScale = d3.scaleLinear().domain([0, 6]).range([25, 175]);
   var yScale = d3.scaleLinear().domain([0,20]).range([175, 25]);

   var area = d3.area()
      .x(d => xScale(d.x))
      .y0(d => yScale(d.y / 3))
      .y1(d => yScale(d.y));

   d3.select("#demo2")
    .append("path")
    .attr("d", area(data))
    .attr("fill", "red")
    .attr("stroke", "black");
</script>

<svg id="demo2" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 2 - An area with y0 set to be one-third of y1.  </figcaption></figure>

### Setting `x0` and `x1`


Setting `x`, `y0`, and `y1` is useful for creating left-to-right oriented areas, but to create a bottom-to-top oriented area we use different accessors.

The new accessors `y`, `x0`, and `x1` work very similarly to the previous accessors. 
Instead of `y0` and `y1` being the lower/upper bounds, we now have `x0` and `x1` to be our right/left bounds.
When using the new accessors (along with an updated scale) we are effectively rotating our area 90 degrees from the original area.

+ [area.y([y])](https://github.com/d3/d3-shape#area_y) - Sets the `y` accessor to the argument passed to it which may be either a number or a function that returns a number
+ [area.x0([x])](https://github.com/d3/d3-shape#area_x0) - Sets the `x0` accessor to the argument passed to it which may be either a number or a function that returns a number, this is our right-most bounds
+ [area.x1([x])](https://github.com/d3/d3-shape#area_x1) - Sets the `x1` accessor to the argument passed to it which may be either a number or a function that returns a number, this is our left-most bounds

All we need to change is the accessors in our area generator and the xScale: 
<pre>
var xScale = d3.scale.Linear().domain([0,6]).range([<b>175, 25</b>]);

var area = d3.area()
      .y(d => xScale(d.x))
      .x0(d => yScale(d.y / 3))
      .x1(d => yScale(d.y));
</pre>
<b>Note:</b> It may seem weird to use the `xScale` and `d.x` in our `y` accessor, we are doing this so it acts like a rotation of our original data without renaming our data.

In Figure 3 we use `y`, `x0`, and `x1` to make a new area where it is orientated bottom-to-top with the baseline on the right side.

```
<script>
 var data = [
    {x: 0, y: 0},
    {x: 1, y: 3},
    {x: 2, y: 12},
    {x: 3, y: 8},
    {x: 4, y: 17},
    {x: 5, y: 15},
    {x: 6, y: 20}];

   var xScale = d3.scaleLinear().domain([0, 6]).range([175, 25]);
   var yScale = d3.scaleLinear().domain([0,20]).range([175, 25]);

   var area = d3.area()
      .y(d => xScale(d.x))
      .x0(d => yScale(d.y / 3))
      .x1(d => yScale(d.y));

   d3.select("#demo3")
    .append("path")
    .attr("d", area(data))
    .attr("fill", "red")
    .attr("stroke", "black");
</script>

<svg id="demo3" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 3 - An area created by setting the y, x0, and x1 accessors of d3.area.  </figcaption></figure>

### Curve and Defined
Just like with lines we have areas have `curve` and `defined` accessors:
+ [area.defined([defined])](https://github.com/d3/d3-shape#area_defined)  - Takes as an argument a boolean or a function that returns a boolean.  For each point, if the value returned is true, the point is kept, otherwise it is removed or omitted.
+ [area.curve([curve])](https://github.com/d3/d3-shape#area_curve) - Sets the curve the area uses.

In Figure 4 we use the following code to omit the fifth point and apply a curve to the area.
<pre>
var area = d3.area()
      .x(d => xScale(d.x))
      .y0(yScale(0))
      .y1(d => yScale(d.y))
      .curve(d3.curveBasis)
      .defined((d,i) => (i != 4);
</pre>
```
<script>
 var data = [
    {x: 0, y: 0},
    {x: 1, y: 3},
    {x: 2, y: 12},
    {x: 3, y: 8},
    {x: 4, y: 17},
    {x: 5, y: 15},
    {x: 6, y: 20}];

   var xScale = d3.scaleLinear().domain([0, 6]).range([25, 175]);
   var yScale = d3.scaleLinear().domain([0,20]).range([175, 25]);

   var area = d3.area()
     .x(d => xScale(d.x))
     .y0(d => yScale(d.y / 3))
     .y1(d => yScale(d.y))
     .curve(d3.curveBasis)
     .defined((d,i) => (i != 4));

   d3.select("#demo4")
    .append("path")
    .attr("d", area(data))
    .attr("fill", "red")
    .attr("stroke", "black");
</script>

<svg id="demo4" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 4 - An area with the fifth element removed and a curve applied.  </figcaption></figure>

## Area Radials

D3.js also has an area radial generator that works like line radial. 

+ [d3.areaRadial()](https://github.com/d3/d3-shape#areaRadial) - returns an area radial generator for creating radial lines.

Since `d3.areaRadial` is an area, it can still be thought of as being the enclosure between two line radials. These line radials will have identical angles (formerly `x`) for each of their respective points, and now instead of `y0` and `y1` separating our lines, `innerRadius` and `outerRadius` will.

+ [areaRadial.angle([angle])](https://github.com/d3/d3-shape#areaRadial_angle) - Considered to be a radian (0 to 2π). Equivalent to the x() accessor from d3.area().
<!--
+ [areaRadial.startAngle([angle])](https://github.com/d3/d3-shape#areaRadial_startAngle) - Considered to be a radian (0 to 2π). Equivalent to the x0() accessor from d3.area().
+ [areaRadial.endAngle([angle])](https://github.com/d3/d3-shape#areaRadial_endAngle) - Considered to be a radian (0 to 2π). Equivalent to the x1() accessor from d3.area().
+ [areaRadial.radius([radius])](https://github.com/d3/d3-shape#areaRadial_radius) - Equivalent to the y() accessor from d3.area().
-->
+ [areaRadial.innerRadius([radius])](https://github.com/d3/d3-shape#areaRadial_innerRadius) - Equivalent to the y0() accessor from d3.area().
+ [areaRadial.outerRadius([radius])](https://github.com/d3/d3-shape#areaRadial_outerRadius) - Equivalent to the y1() accessor from d3.area().

In Figure 5 we create an area radial by converting the scales and `d3.area` accessors into `d3.areaRadial` compatible ones.

To start we will change our ranges to work with the angles and radii:
<pre>
var angleScale = d3.scaleLinear().domain([0, 6]).range([0, 2 * Math.PI]);
var radiiScale = d3.scaleLinear().domain([0,20]).range([90,30]);
</pre>

Next we will convert the area accessors into the new area radial accessors:
<pre>
.x()  => .angle()
.y0() => .innerRadius()
.y1() => .outerRadius()
</pre>

```
<script>
 var data = [
    {x: 0, y: 0},
    {x: 1, y: 3},
    {x: 2, y: 12},
    {x: 3, y: 8},
    {x: 4, y: 17},
    {x: 5, y: 15},
    {x: 6, y: 20}];

   var xScale = d3.scaleLinear().domain([0, 6]).range([0, 2 * Math.PI]);
   var yScale = d3.scaleLinear().domain([0,20]).range([90,30]);

   var areaRadial = d3.areaRadial()
     .angle(d => xScale(d.x))
     .innerRadius(d => yScale(d.y / 3))
     .outerRadius(d => yScale(d.y));

   d3.select("#demo5")
    .select("g")
    .append("path")
    .attr("d", areaRadial(data))
    .attr("fill", "red")
    .attr("stroke", "black");
</script>

<svg id="demo5" width="200" height="200">
<g transform="translate(100,100)"></g>
</svg>
```
<figure class="sandbox"><figcaption>Figure 5 - An area radial.  </figcaption></figure>

We can also use `.curve()` and `.defined()` with area radials exactly like we did for areas.
+ [areaRadial.defined([defined])](https://github.com/d3/d3-shape#areaRadial_defined) - Takes as an argument a boolean or a function that returns a boolean.  For each point, if the value returned is true, the point is kept, otherwise it is removed or omitted.
+ [areaRadial.curve([curve])](https://github.com/d3/d3-shape#areaRadial_curve) - Sets the curve the area radial uses.

Figure 6 is identical to Figure 5 except that a curve is applied and the fifth point is omitted.

```
<script>
 var data = [
    {x: 0, y: 0},
    {x: 1, y: 3},
    {x: 2, y: 12},
    {x: 3, y: 8},
    {x: 4, y: 17},
    {x: 5, y: 15},
    {x: 6, y: 20}];

   var xScale = d3.scaleLinear().domain([0, 6]).range([0, 2 * Math.PI]);
   var yScale = d3.scaleLinear().domain([0,20]).range([90,30]);

   var areaRadial = d3.areaRadial()
     .angle(d => xScale(d.x))
     .innerRadius(d => yScale(d.y / 3))
     .outerRadius(d => yScale(d.y))
     .curve(d3.curveBasis)
     .defined((d,i) => (i != 4));

   d3.select("#demo6")
    .select("g")
    .append("path")
    .attr("d", areaRadial(data))
    .attr("fill", "red")
    .attr("stroke", "black");
</script>

<svg id="demo6" width="200" height="200">
<g transform="translate(100,100)"></g>
</svg>
```
<figure class="sandbox"><figcaption>Figure 6 - An area radial with the fifth element removed and a curve applied.  </figcaption></figure>

## Canvasses

Our examples in the section all use an `SVG` as the graphic medium. If we want to work with a Canvas instead, we just pass in the `context` of a canvas into the `.context()` accessor of area or areaRadial.

+ [area.context([context])](https://github.com/d3/d3-shape#area_context) - Applies the area to the context.
+ [areaRadial.context([context])](https://github.com/d3/d3-shape#areaRadial_context) - Applies the area to the context.

In Figure 7 we use the same areas in Figure 2 and 5, but apply them to a canvas instead. Note that we have to use additional CanvasPathMethods for our graphics to display.

```
<script>
    var data = [
        {x: 0, y: 0},
        {x: 1, y: 3},
        {x: 2, y: 12},
        {x: 3, y: 8},
        {x: 4, y: 17},
        {x: 5, y: 15},
        {x: 6, y: 20}];
        
    var xScale = d3.scaleLinear().domain([0, 6]).range([25, 175]);
    var yScale = d3.scaleLinear().domain([0,20]).range([175, 25]);
    var angleScale = d3.scaleLinear().domain([0, 6]).range([0, 2 * Math.PI]);
    var radiiScale = d3.scaleLinear().domain([0,20]).range([90,30]);
    
    //Begin adding area
    var areaContext = d3.select("#demo7a").node().getContext("2d");
    
    var area = d3.area()
      .x(d => xScale(d.x))
      .y0(d => yScale(d.y / 3))
      .y1(d => yScale(d.y))
      .context(areaContext);
    
    areaContext.beginPath();
    areaContext.strokeStyle = "black";
    areaContext.fillStyle = "red";
    area(data);
    areaContext.fill();
    areaContext.stroke();
    
    //Begin adding area radial
    var radialContext = d3.select("#demo7b").node().getContext("2d");
    
    var areaRadial = d3.areaRadial()
         .angle(d => angleScale(d.x))
         .innerRadius(d => radiiScale(d.y / 3))
         .outerRadius(d => radiiScale(d.y))
         .context(radialContext);
         
    radialContext.translate(100,100);
    radialContext.beginPath();
    radialContext.strokeStyle = "black";
    radialContext.fillStyle = "red";
    areaRadial(data);
    radialContext.fill();
    radialContext.stroke();
</script>
<canvas id="demo7a" width=200 height=200></canvas>
<canvas id="demo7b" width=200 height=200></canvas>
``` 
<figure class="sandbox"><figcaption>Figure 7 - Canvas versions of Figure 2 (left) and Figure 5 (right).  </figcaption></figure>

## d3.arealabel

Many times it is useful to the viewers of our visualizations to have labels indicating what every line or area represents. Luckily, [Curran Kelleher](https://github.com/curran) created [d3-area-label](https://github.com/curran/d3-area-label) to dynamically add text labels inside of an area.

This module is not apart of the main D3.js files so we will have to separately add it to our page:
<pre>
&lt;script src="https://unpkg.com/d3-area-label@1.5.0/build/d3-area-label.js">&lt;/script>
</pre>

`d3.arealabel` is a generator with many accessors on it to determine size, conditions, and format of the labels to add. To create a label we need to either pass the generator an area, or redefine an area to use. Note that `d3.areaLabel` only works on left-to-right areas (areas that use `x`, `y0`, and `y1`).

<pre>
var areaLabel = d3.areaLabel().area(areaGen);
</pre>

+ [d3.areaLabel([area])](https://github.com/curran/d3-area-label#area-label) - Constructs an area label generator and calls `areaLabal.area(area)`.
+ [areaLabel.area(area)](https://github.com/curran/d3-area-label#area) - Sets the `x`, `y0`, and `y1` accessors of the areaLabel to be the same as an instance of `d3.area`.
+ [areaLabel(data)](https://github.com/curran/d3-area-label#_areaLabel) - Calls the area label generator with the passed in data. Note that this data should be in the form [`area1`, `area2`, ...] where each `area#` is all the data points for an area. For example when working with a single area: `areaLabel([areaData])`.

`d3.areaLabel` works by first finding the bounding box or aspect ratio around a particular `text` element. 
Next, `d3.areaLabel` will use a [bisection method](https://en.wikipedia.org/wiki/Bisection_method#Algorithm) to find the maximum size rectangle with the same aspect ratio as the text that fits within an area.
 Finally, `d3.areaLabel` modifies the `transform` attribute of a `text` element, so it returns a string that can be used when modifying the `transorm` that properly places the label where it should be.

<pre>
selection
    .append("text")
    .text("Area")
    .attr("transform", areaLabel([dataSet]);
</pre>

In Figure 8 we apply a label with the text "Area" to the same are awe have been using above. Try changing the text to see how `d3.areaLabel` dynamically changes the positioning and size.

```
<script>
    var data = [
        {x: 0, y: 0},
        {x: 1, y: 3},
        {x: 2, y: 12},
        {x: 3, y: 8},
        {x: 4, y: 17},
        {x: 5, y: 15},
        {x: 6, y: 20}];
    
    var xScale = d3.scaleLinear().domain([0, 6]).range([25, 175]);
    var yScale = d3.scaleLinear().domain([0,20]).range([175, 25]);
    
    var area = d3.area()
        .x(d => xScale(d.x))
        .y0(d => yScale(d.y / 3))
        .y1(d => yScale(d.y));
    
    d3.select("#demo8")
        .append("path")
        .attr("d", area(data))
        .attr("fill", "red")
        .attr("stroke", "black");
    
    var areaLabel = d3.areaLabel(area);
    
    d3.select("#demo8")
        .data([data])
        .append("text")
        .text("Area")
        .attr("transform", areaLabel);
</script>
<svg id="demo8" width=200 height=200></svg>
```
<figure class="sandbox"><figcaption>Figure 8 - An area with the label "Area" added with d3.areaLabel.  </figcaption></figure>

For most cases we will already have an instance of a `d3.area` generator so we can use `d3.areaLabal([area])`, however if for some reason we do not have an area generator, need to redefine an accessor, or get an accessor `d3.areaLabel` provides us with the following additional methods:

+ [areaLabel.x(x)](https://github.com/curran/d3-area-label#x) - If `x` is specified, sets the areaLabel's `x` accessor to the value/function of `x`. Otherwise returns the current `x` accessor.
+ [areaLabel.y0(y0)](https://github.com/curran/d3-area-label#y0) - If `y0` is specified, sets the areaLabel's `y0` accessor to the value/function of `y0`. Otherwise returns the current `y0` accessor.
+ [areaLabel.y1(y1)](https://github.com/curran/d3-area-label#y1) - If `y1` is specified, sets the areaLabel's `y1` accessor to the value/function of `y1`. Otherwise returns the current `y1` accessor.

### Format
When working with many areas (such as in the next section [stacks](./05_06_stacks.html)) we may have areas that are very thin. Applying a label to these thin areas is not always the best idea since we will not be able to actually read them. We can use `areaLabel.minHeight` to exclude labels that are smaller than a specified height.

+ [areaLabel.minHeight(minHeight)](https://github.com/curran/d3-area-label#minHeight) - Excludes labels that are smaller than `minHeight`. Defaults at 2.

An example `areaLabel.minHeight` can be seen in the next section, [stacks](./05_06_stacks.html).

### Accuracy

Sometimes `d3.areaLabel` may output unoptimized or inaccurate positions/scales. In these cases `d3.areaLabel` provides us with additional accessors to adjust how the placement and positioning is found.

When finding the maximum size rectangle, `d3.areaLabel` looks at a set amount of `x` values as leftmost side for the rectangle and goes right from this `x` position to find the largest rectangle. We can set what `x` values `d3.areaLabel` looks at if the default values produce innaccurate positions or if our visualizations take too long to load.

[areaLabel.interpolate(interpolate)](https://github.com/curran/d3-area-label#interpolate) takes a boolean value and determines whether or not the area label generator will use linear interpolation to compute label positions.

If set to `false`, the only `x` positions that will be used as a left-most side of a rectangle will be the `x` values in the data set. If we have a large amount of evenly spaced `x` values in our data set, setting this to `false` works well.

If set to `true`, the area label generator will use a linear interpolation over the data sets `x` positions to find a set amount (`interpolateResolution`) of coordinates. 

For instance if we have the `x` values `[1, 2, 3, 4, 5]` in our data set and we set `interpolateResolution` to `10` then our area generator will try to find the maximum size rectangle with the left side of the rectangle at positions: `[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5]`

For large evenly spaced data, setting `areaLabel.interpolate` to `false` will work well. However, setting this to `false` for smaller sets of data will not produce the best positioned labels.

Setting `areaLabel.interpolate` to `true` helps smaller data sets have better positioned labels. However when used on larger data sets it can be taxing on our computers, so if our visualizations are taking some time to load, setting to `false` may be a better option. 
 
`areaLabel.interpolate` is `true` by default.

[areaLabel.interpolateResolution(interpolateResolution)](https://github.com/curran/d3-area-label#interpolateResolution) sets how many positions will be used as the left-most side of any rectangles checked for maximum size. It only works when `areaLabel.interpolate` is set to `true`.

`areaLabel.interpolateResolution` is `200` by default.

`areaLabel.interpolate` and `areaLabel.interpolateResolution` should really only be changed if we notice any oddities in the placements of our labels.

### Padding

We can apply a padding to each of the sides of the text within its' bounding box. When applying a padding, we should make sure to not use large paddings that make the label hard to read. It is also important to remember that each padding should be set to a value from 0 to 1; larger values will technically work still, but will result in text labels usually too small to read. The default value for each padding is 0.

<pre>
var areaLabel = d3.areaLabel([area1]).paddingLeft(5);
</pre>

+ [areaLabel.paddingLeft(paddingLeft)](https://github.com/curran/d3-area-label#paddingLeft) - The padding on the left side of the text.
+ [areaLabel.paddingRight(paddingRight)](https://github.com/curran/d3-area-label#paddingRight) - The padding on the right side of the text.
+ [areaLabel.paddingTop(paddingTop)](https://github.com/curran/d3-area-label#paddingTop) - The padding on the top side of the text.
+ [areaLabel.paddingBottom(paddingBottom)](https://github.com/curran/d3-area-label#paddingBottom) - The padding on the bottom side of the text.


`d3.areaLabel` also provides us with the following shortcut accessors:
+ [areaLabel.paddingX(paddingX)](https://github.com/curran/d3-area-label#paddingX) - Sets `paddingRight` and `paddingLeft` simultaneously.
+ [areaLabel.paddingY(paddingY)](https://github.com/curran/d3-area-label#paddingY) - Sets `paddingTop` and `paddingBottom` simultaneously.
+ [areaLabel.padding(padding)](https://github.com/curran/d3-area-label#padding) - Sets `paddingX` and `paddingY` simultaneously (i.e. *All* of the paddings at once). 

In Figure 9 we apply a padding to every side by using `areaLabel.padding`.

```
<script>
    var data = [
        {x: 0, y: 0},
        {x: 1, y: 3},
        {x: 2, y: 12},
        {x: 3, y: 8},
        {x: 4, y: 17},
        {x: 5, y: 15},
        {x: 6, y: 20}];
    
    var xScale = d3.scaleLinear().domain([0, 6]).range([25, 175]);
    var yScale = d3.scaleLinear().domain([0,20]).range([175, 25]);
    
    var area = d3.area()
        .x(d => xScale(d.x))
        .y0(d => yScale(d.y / 3))
        .y1(d => yScale(d.y));
    
    d3.select("#demo9")
        .append("path")
        .attr("d", area(data))
        .attr("fill", "red")
        .attr("stroke", "black");
    
    var areaLabel = d3.areaLabel().area(area).padding(.5);
    
    d3.select("#demo9")
        .data([data])
        .append("text")
        .text("Area")
        .attr("transform", areaLabel);
</script>
<svg id="demo9" width=200 height=200></svg>
```
<figure class="sandbox"><figcaption>Figure 9 - An area with the label "Area" and a padding of 15px on every side.  </figcaption></figure>