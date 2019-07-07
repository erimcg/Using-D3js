{{meta {docid: lines}}}

<script src="https://d3js.org/d3.v5.min.js"></script>

# Radial Lines

A radial line is a line about an origin where each point on the line is characterized by the angle formed  and the radius from the origin to the point.

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
      
 d3.select("#demo7")
    .select("g")
    .append("path")
    .data([data])
    .attr("d", lineRadial)
    .attr("fill", "none")
    .attr("stroke", "black");

</script>

<svg id="demo7" width="200" height="200">
    <g transform="translate(100,100)"></g>
</svg>
```
<figure class="sandbox"><figcaption>Figure 8. .</figcaption></figure>

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
      
 d3.select("#demo8")
    .select("g")
    .append("path")
    .data([data])
    .attr("d", lineRadial)
    .attr("fill", "none")
    .attr("stroke", "black");

</script>

<svg id="demo8" width="200" height="200">
    <g transform="translate(100,100)"></g>
</svg>
```
<figure class="sandbox"><figcaption>Figure 9. .</figcaption></figure>

+ [lineRadial.context([context])](https://github.com/d3/d3-shape#lineRadial_context) (Not Shown)