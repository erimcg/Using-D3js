{{meta {docid: arcs_pie_charts}}}

<script src="https://d3js.org/d3.v4.min.js"></script>

<style>
    svg { background-color: white; }
</style>

# Lines and Radial Lines
In this tutorial we'll discuss how to draw lines. Lines can be used on their own, but they are also used in many other areas of this chapter such as [areas](05_04_areas.html), [curves](05_05_curves.html), and [links](05_06_links.html).

## Lines

D3 provides [d3.line()](https://github.com/d3/d3-shape#lines), a method that returns a line generator that can be used to create a polyline or a spline.

In order to render a line, the line generator computes the points for the line.  To compute the points it requires an array of data and functions for computing x and y values from that data.  The points generated from the data are used as endpoints or control points of line segments or curves, respectively.  The other points are interpolated and by default a linear interpolation is used.

+ [line(data)](https://github.com/d3/d3-shape#_line) - invoke the line generator using the array of data passed to it
+ [line.x([x])](https://github.com/d3/d3-shape#line_x) - sets the x accessor to the argument passed to it which may be either a number or a function that returns a number
+ [line.y([y])](https://github.com/d3/d3-shape#line_y) - sets the y accessor to the argument passed to it which may be either a number or a function that returns a number

We use these methods to generate the line shown below.

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

   var line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

   d3.select("#demo")
    .append("path")
    .attr("d", line(data))
    .attr("fill", "none")
    .attr("stroke", "black");
</script>

<svg id="demo" width="200" height="200"></svg>
```

To begin we create an array of data and scales that will be used to scale the data to fit the svg.

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

Next, we create a line generator and set the x and y accessor functions.

<pre>
var line = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));
</pre>

Finally, we append a `path` element to the svg element and explicitly call the line generator, passing the data array to it, to get a string that can be used for the `d` attribute.

<pre>
d3.select("#demo1")
    .append("path")
    .attr("d", line(data))
    .attr("fill", "none")
    .attr("stroke", "black");
</pre>

### Using Joined Data to Set the Path String

We can also compute the `d` attribute of a `path` element, not by calling the line generator directly, but rather, by joining the data to the `path` element and by passing the line generator as the second argument of `selection.attr` when setting the `d` attribute.

The line generator is automatically called for each element in the array that was joined to the `path` element.

<pre>
d3.select("#demo1")
  .append("path")
  .data([data])
  .attr("d", line)
  .attr("fill", "none")
  .attr("stroke", "black");
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
  
   var line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));
      
   d3.select("#demo1")
    .append("path")
    .data([data])
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "black");

</script>

<svg id="demo1" width="200" height="200"></svg>
```

### Excluding Points
Sometimes we may want to exclude certain points on the line. To do this we can call [line.defined([defined])](https://github.com/d3/d3-shape#line_defined) on our line generator.

+ [line.defined([defined])](https://github.com/d3/d3-shape#line_defined) - takes as an argument a boolean or a function that returns a boolean.  For each point, if the value returned is true, the point is kept, otherwise it is removed.

Using the same data as above, to exclude the 4th index in the series we include a call to `line.defined` when defining the line generator:

<pre>
var line = d3.line()
  .x(d => xScale(d.x))
  .y(d => yScale(d.y));
  .defined((d,i) => i != 4);
</pre> 

When we remove a point, the line segments that would have been created using that point are omitted.

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
  
   var line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .defined((d,i) => i != 4);
      
 d3.select("#demo2")
    .append("path")
    .data([data])
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "black");

</script>

<svg id="demo2" width="200" height="200"></svg>
```

### Curving the Line

To create a curve we need to change the way that the points are interpolated.  For this we can call [line.curve([curve])](https://github.com/d3/d3-shape#line_curve) passing in a predefined curve factory.

The example below demonstrates the use of the d3.curveBasis curve factory when creating a line generator.

<pre>
var line = d3.line()
  .x(d => xScale(d.x))
  .y(d => yScale(d.y))
  .curve(d3.curveBasis);
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

   var line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveBasis);
      
 d3.select("#demo3")
    .append("path")
    .data([data])
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "black");

</script>

<svg id="demo3" width="200" height="200"></svg>
```

We discuss curves in-depth in the section on [curves](05_05_curves.html).

## Radial Lines

A radial line is a line where each point on the line is determined by an origin, a radius, and an angle.

[d3.lineRadial()](https://github.com/d3/d3-shape#lineRadial) returns a line generator for creating radial lines.  Like line generators, a radial line generator needs to compute the x and y coordinates for the points on the line.  The radial line generator, however, computes them a bit differently.  Instead of using x and y accessor functions to compute the x and y coordinates, radial line generators have angle and radius accessor functions which compute the angle and radius from the data.

+ [lineRadial.angle([angle])](https://github.com/d3/d3-shape#lineRadial_angle) - takes either a number or a function that returns a number as an argument. The angle represented by the argument or the value returned by the function is considered in radians.

+ [lineRadial.radius([radius])](https://github.com/d3/d3-shape#lineRadial_radius) - takes either a number or function that returns a number as an argument.

### lineRadial Example

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
   
 var xScale = d3.scaleLinear().domain([0, 6]).range([0, 2* Math.PI]);
 var yScale = d3.scaleLinear().domain([0,20]).range([40, 80]);
  
 var lineRadial = d3.lineRadial()
      .angle(d => xScale(d.x))
      .radius(d => yScale(d.y));
      
 d3.select("#demo4")
    .select("g")
    .append("path")
    .data([data])
    .attr("d", lineRadial)
    .attr("fill", "none")
    .attr("stroke", "black");

</script>

<svg id="demo4" width="200" height="200">
    <g transform="translate(100,100)"></g>
</svg>
```

For the angle generator, we will use the same x values as before, but change the `scaleLinear.range` to be between 0 and 2*Math.PI (the number of radians around a circle) and for the radius generator we will use the y values, but change the `scaleLinear.range` to return a value between 40 and 80.

<pre>
var xScale = d3.scaleLinear().domain([0, 6]).range([0, 2* Math.PI]);
var yScale = d3.scaleLinear().domain([0,20]).range([40, 80]);
</pre>

*Note:* It is also important to know that the origin is at (0,0) of the element in which the line is drawn.  To accommodate for this, we add a new `g` element to our svg and translate it into the middle, then draw the line inside the g element.

### Other lineRadial Methods

Just like with lines, radial line generators have the following methods:

+ [lineRadial.defined([defined])](https://github.com/d3/d3-shape#lineRadial_defined)
+ [lineRadial.curve([curve])](https://github.com/d3/d3-shape#lineRadial_curve)

In this example when we create the radial line generator we change the curve factory using `curve` and exclude points with `defined` as we did in the earlier example.

<pre>
var lineRadial = d3.lineRadial()
  .angle(d => xScale(d.x))
  .radius(d => yScale(d.y))
  .defined((d,i) => i != 4)
  .curve(d3.curveBasis);
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
   
 var xScale = d3.scaleLinear().domain([0, 6]).range([0, 2* Math.PI]);
 var yScale = d3.scaleLinear().domain([0,20]).range([40, 80]);
  
 var lineRadial = d3.lineRadial()
      .angle(d => xScale(d.x))
      .radius(d => yScale(d.y))
      .defined((d,i) => i != 4)
      .curve(d3.curveBasis);
      
 d3.select("#demo5")
    .select("g")
    .append("path")
    .data([data])
    .attr("d", lineRadial)
    .attr("fill", "none")
    .attr("stroke", "black");

</script>

<svg id="demo5" width="200" height="200">
    <g transform="translate(100,100)"></g>
</svg>
```

+ [line.context([context])](https://github.com/d3/d3-shape#line_context) (Not Shown)
+ [lineRadial.context([context])](https://github.com/d3/d3-shape#lineRadial_context) (Not Shown)