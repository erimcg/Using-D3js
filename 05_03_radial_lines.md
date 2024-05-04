{{meta {docid: radial_lines}}}
{{meta {description: ""}}}

<script src="https://d3js.org/d3.v5.min.js"></script>

# Radial Lines

D3.js defines a radial line as a line about an origin where each point *p* on the line is characterized by the distance from *p* to the origin (a radius) and the angle at the origin subtended by the arc between the positive y-axis and *p*.

D3.js provides [d3.lineRadial()](https://github.com/d3/d3-shape#lineRadial), a radial line generator, much like `d3.line`, that can be used to produce a path descriptor for SVG `path` element and for rendering a path in a `canvas` element.

By default, the line generator expects a dataset consisting of an array of arrays, where each inner array is an angle and radius pair.  For each angle/radius pair, t, in the dataset, a point is generated such that the angle at the origin subtended by the arc between the positive y-axis and the point is given by *t[0]* and the distance from the origin to the point is given by *t[1]*.

In Figure 1 we render a radial line using the following dataset.

<pre>
var data = [
  [0, 10],
  [Math.PI * .25, 20],
  [Math.PI * .5, 35],
  [Math.PI * .75, 55],
  [Math.PI, 60],
  [Math.PI * 1.25, 65],
  [Math.PI * 1.5, 70],
  [Math.PI * 1.75, 75],
  [Math.PI * 2, 80]];
</pre>

After creating a radial line generator we append a `path` element to the `g` element in the `svg` and set its `d` attribute to the path description created by the radial line generator.

<pre>
 var lineRadial = d3.lineRadial();
      
 d3.select("#demo1")
    .select("g")
    .append("path")
    .attr("d", lineRadial(data))
    .attr("fill", "none")
    .attr("stroke", "black");
</pre>

```
<script>
 var data = [
    [0, 10],
    [Math.PI * .25, 20],
    [Math.PI * .5, 35],
    [Math.PI * .75, 55],
    [Math.PI, 60],
    [Math.PI * 1.25, 65],
    [Math.PI * 1.5, 70],
    [Math.PI * 1.75, 75],
    [Math.PI * 2, 80]];
  
 var lineRadial = d3.lineRadial();
      
 d3.select("#demo1")
    .select("g")
    .append("path")
    .attr("d", lineRadial(data))
    .attr("fill", "none")
    .attr("stroke", "black");

</script>

<svg id="demo1" width="200" height="200">
    <g transform="translate(100,100)"></g>
</svg>
```
 <figure class="sandbox"><figcaption>Figure 1. Radial line created using the default angle and radius functions.</figcaption></figure>
 
Note that the origin is at *(0,0)* in the element in which the line is drawn.  In order to position the radial line in the middle of the screen, we add a `g` element to our `svg`, translate it into the middle, then draw the line inside the `g` element.
 
## Accessor Methods

The radial line generator has two methods that can be called to assign custom angle and radius accessor methods to the radial line generator.

+ [lineRadial.angle([angle])](https://github.com/d3/d3-shape#lineRadial_angle) - sets or gets the angle accessor. If angle is provided, it must be a number or a function that returns a number representing an angle in radians. If angle is not provide, returns the current angle accessor function.

+ [lineRadial.radius([radius])](https://github.com/d3/d3-shape#lineRadial_radius) - sets or gets the radius accessor. If radius is provided, it must be a number or a function that returns a number. If radius is not provide, returns the current radius accessor function.

When `lineRadial.angle` and `lineRadial.radius` are passed functions (or lambda expressions), the functions are called for each element in the dataset and when called, are passed the current data element d, the index of the current element i, and the array of data on which the generator is invoked, data.

When `lineRadial.angle` and `lineRadial.radius` are called without an argument, the methods return the radial line generator’s current accessor.

In Figure 2 the dataset consists of an array of objects, each having an `angle` and `radius` property.  To use these properties when computing the *x* and *y* positions for the points, we provide the radial line generator with custom angle and radius accessor methods.

<pre>
var data = [
  {angle: 0, radius: 10},
  {angle: Math.PI * .25, radius: 20},
  {angle: Math.PI * .5, radius: 35},
  {angle: Math.PI * .75, radius: 55},
  {angle: Math.PI, radius: 60},
  {angle: Math.PI * 1.25, radius: 65},
  {angle: Math.PI * 1.5, radius: 70},
  {angle: Math.PI * 1.75, radius: 75},
  {angle: Math.PI * 2, radius: 80}];
  
var lineRadial = d3.lineRadial()
  .angle((d) => d.angle)
  .radius((d) => d.radius);
</pre>

```
<script>
var data = [
  {angle: 0, radius: 10},
  {angle: Math.PI * .25, radius: 20},
  {angle: Math.PI * .5, radius: 35},
  {angle: Math.PI * .75, radius: 55},
  {angle: Math.PI, radius: 60},
  {angle: Math.PI * 1.25, radius: 65},
  {angle: Math.PI * 1.5, radius: 70},
  {angle: Math.PI * 1.75, radius: 75},
  {angle: Math.PI * 2, radius: 80}];
  
var lineRadial = d3.lineRadial()
  .angle((d) => d.angle)
  .radius((d) => d.radius);
            
d3.select("#demo2")
  .select("g")
  .append("path")
  .attr("d", lineRadial(data))
  .attr("fill", "none")
  .attr("stroke", "black");
</script>

<svg id="demo2" width="200" height="200">
    <g transform="translate(100,100)"></g>
</svg>
```
 <figure class="sandbox"><figcaption>Figure 2. Radial line created using custom accessor functions.</figcaption></figure>

## Using Bound Data

We can also compute the `d` attribute of a `path` element, not by invoking the radial line generator directly, but rather, by joining the data to the `path` element and then passing the radial line generator as the second argument of `selection.attr` when setting the `d` attribute.

<pre>
d3.select("#demo3")
  .select("g")
  .append("path")
  .data([data])
  .attr("d", lineRadial)
  .attr("fill", "none")
  .attr("stroke", "black");
</pre>

Note that the dataset is passed to `selection.data` inside an array and the `lineRadial` function, not the string returned by `lineRadial`, is passed to `selection.attr`.

```
<script>
var data = [
  {angle: 0, radius: 10},
  {angle: Math.PI * .25, radius: 20},
  {angle: Math.PI * .5, radius: 35},
  {angle: Math.PI * .75, radius: 55},
  {angle: Math.PI, radius: 60},
  {angle: Math.PI * 1.25, radius: 65},
  {angle: Math.PI * 1.5, radius: 70},
  {angle: Math.PI * 1.75, radius: 75},
  {angle: Math.PI * 2, radius: 80}];
  
var lineRadial = d3.lineRadial()
  .angle((d) => d.angle)
  .radius((d) => d.radius);
            
d3.select("#demo3")
  .select("g")
  .append("path")
  .data([data])
  .attr("d", lineRadial)
  .attr("fill", "none")
  .attr("stroke", "black");
</script>

<svg id="demo3" width="200" height="200">
    <g transform="translate(100,100)"></g>
</svg>
```
 <figure class="sandbox"><figcaption>Figure 3. Radial line created using bound data.</figcaption></figure>

## Excluding Points

Sometimes we may want to exclude certain points on the line. To do this we can set the *defined* accessor function by calling [lineRadial.defined([defined])](https://github.com/d3/d3-shape#lineRadial_defined) on our line generator.

+ [lineRadial.defined([defined])](https://github.com/d3/d3-shape#lineRadial_defined) - takes as an argument a boolean or a function that returns a boolean.  

When the radial line generator computes points, it invokes the *defined* accessor for each element in the dataset, passing it the current data element `d`, the index of the current element `i`, and the array of data on which the generator is invoked, `data`.  If the *defined* accessor evaluates to true, a point is generated for the data element, otherwise the element is ignored.  By default, the *defined* accessor returns true for all elements in the dataset.

In Figure 4 we exclude the points that have angles between 0 and PI by passing a lambda expression to `line.defined`.

```
<script>
var data = [
  {angle: 0, radius: 10},
  {angle: Math.PI * .25, radius: 20},
  {angle: Math.PI * .5, radius: 35},
  {angle: Math.PI * .75, radius: 55},
  {angle: Math.PI, radius: 60},
  {angle: Math.PI * 1.25, radius: 65},
  {angle: Math.PI * 1.5, radius: 70},
  {angle: Math.PI * 1.75, radius: 75},
  {angle: Math.PI * 2, radius: 80}];
  
var lineRadial = d3.lineRadial()
  .angle((d) => d.angle)
  .radius((d) => d.radius)
  .defined((d) => d.angle >= Math.PI);
            
d3.select("#demo4")
  .select("g")
  .append("path")
  .attr("d", lineRadial(data))
  .attr("fill", "none")
  .attr("stroke", "black");
</script>

<svg id="demo4" width="200" height="200">
    <g transform="translate(100,100)"></g>
</svg>
```
 <figure class="sandbox"><figcaption>Figure 4. Radial line with points omitted.</figcaption></figure>

## Curving the Line

To create a curve we need to change the way that the points are interpolated.  For this we can call [lineRadial.curve([curve])](https://github.com/d3/d3-shape#lineRadial_curve) passing it a predefined curve factory.  D3.js provides several curve factories which we discuss in the section on [curves](05_04_curves.html).

If `lineRadial.curve` is called without an argument, the current curve factory is returned, which by default is the [d3.curveLinear](https://github.com/d3/d3-shape/blob/v1.3.4/README.md#curveLinear) curve factory.

Figure 5 sets the line generator's curve factory to `d3.curveBasis` producing a cubic basis spline.


<pre>
var lineRadial = d3.lineRadial()
  .angle((d) => d.angle)
  .radius((d) => d.radius)
  .curve(d3.curveBasis);
</pre>

```
<script>
var data = [
  {angle: 0, radius: 10},
  {angle: Math.PI * .25, radius: 20},
  {angle: Math.PI * .5, radius: 35},
  {angle: Math.PI * .75, radius: 55},
  {angle: Math.PI, radius: 60},
  {angle: Math.PI * 1.25, radius: 65},
  {angle: Math.PI * 1.5, radius: 70},
  {angle: Math.PI * 1.75, radius: 75},
  {angle: Math.PI * 2, radius: 80}];
  
var lineRadial = d3.lineRadial()
  .angle((d) => d.angle)
  .radius((d) => d.radius)
  .curve(d3.curveBasis);
            
d3.select("#demo5")
  .select("g")
  .append("path")
  .attr("d", lineRadial(data))
  .attr("fill", "none")
  .attr("stroke", "black");
</script>

<svg id="demo5" width="200" height="200">
    <g transform="translate(100,100)"></g>
</svg>
```
 <figure class="sandbox"><figcaption>Figure 5. Curved radial line.</figcaption></figure>

## Rendering Lines to a Context

We can render the line in a `canvas` element's `context` by using [lineRadial.context([context])](https://github.com/d3/d3-shape/blob/v1.3.4/README.md#lineRadial_context).

If no argument is passed to `lineRadial.context`, the method returns the current context, which by default is null.  If, however, a context is passed to `lineRadial.context`, the line will be rendered in the context when the line generator is invoked.

In Figure 6, we retrieve the context of the canvas element, then create the line generator and call `line.context` to set the context.

<pre>
var context = d3.select("#demo6").node().getContext("2d");

var lineRadial = d3.lineRadial()
  .angle((d) => d.angle)
  .radius((d) => d.radius)
  .context(context);
</pre>

We then render the line by invoking the line generator, setting the stroke color, and calling  `context.stroke`.

<pre>
context.translate(100,100);              
lineRadial(data);
context.stroke();
</pre>

```
<script>
var data = [
  {angle: 0, radius: 10},
  {angle: Math.PI * .25, radius: 20},
  {angle: Math.PI * .5, radius: 35},
  {angle: Math.PI * .75, radius: 55},
  {angle: Math.PI, radius: 60},
  {angle: Math.PI * 1.25, radius: 65},
  {angle: Math.PI * 1.5, radius: 70},
  {angle: Math.PI * 1.75, radius: 75},
  {angle: Math.PI * 2, radius: 80}];
  
var context = d3.select("#demo6").node().getContext("2d");

var lineRadial = d3.lineRadial()
  .angle((d) => d.angle)
  .radius((d) => d.radius)
  .context(context);
         
context.translate(100,100);              
lineRadial(data);
context.stroke();
</script>

<canvas id="demo6" width="200" height="200"></canvas>
```
 <figure class="sandbox"><figcaption>Figure 6. Radial line rendered to a context.</figcaption></figure>