{{meta {docid: arcs_pie_charts}}}

<script src="https://d3js.org/d3.v4.min.js"></script>

<style>
    svg { background-color: lightblue; }
</style>

# Areas and Area Radials
In this tutorial we will discuss how to draw areas and area radials.

## Areas
D3 provides [d3.area()](https://github.com/d3/d3-shape#area), a method that returns an area generator that is used to create areas.

An area is an enclosure area of a graph using an x value and minimum and maximum y values. The area generator will shade everything between the minimum and maximum y points, provided you assign the `fill` attribute with a color.

Like lines, areas use points to make their graphs and we pass in an array of data for the area generator to compute points. 
+ [area(data)](https://github.com/d3/d3-shape#_area) - invoke the area generator using the array of data passed into it

However unlike lines, areas make <b>two</b> points for every set of data passed into it. The first point we will be using the lower bounds of the graph and the second point we will use as the upper bounds.
+ [area.x([x])](https://github.com/d3/d3-shape#area_x) - sets the `x` accessor to the argument passed to it which may be either a number or a function that returns a number
+ [area.y0([y])](https://github.com/d3/d3-shape#area_y0) - sets the `y0` accessor to the argument passed to it which may be either a number or a function that returns a number, this is the first point or our lower bounds
+ [area.y1([y])](https://github.com/d3/d3-shape#area_y1) - sets the `y1` accessor to the argument passed to it which may be either a number or a function that returns a number, this is the second point or our upper bounds

We will use these methods to create the following area:

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

For this we will be using the same array of data and scales that we used with lines:
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

Next, we will create an area generator and set the `x`, `y0` (first point), and `y1` (second point) accessors.

We will make `y0` (the lower bound or first point) at the graphs bottom, and `y1` (the upper bounds or second point) to be from the data we pass in:
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

### Setting `y0`
Instead of having the lower bounds be at the bottom throughout, we can change the `y0` accessor to be a value relating to our data:
<pre>
var area = d3.area()
      .x(d => xScale(d.x))
      .y0(d => yScale(d.y / 3))
      .y1(d => yScale(d.y));
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
      .y1(d => yScale(d.y));

   d3.select("#demo2")
    .append("path")
    .attr("d", area(data))
    .attr("fill", "red")
    .attr("stroke", "black");
</script>

<svg id="demo2" width="200" height="200"></svg>
```

### Setting `x0` and `x1`
As we have used `x`, `y0`, and `y1` to make points in a left-to-right manner, we can use `y`, `x0`, and `x1` to make points in an bottom-to-top manner.
+ [area.y([y])](https://github.com/d3/d3-shape#area_y) - sets the `y` accessor to the argument passed to it which may be either a number or a function that returns a number
+ [area.x0([x])](https://github.com/d3/d3-shape#area_x0) - sets the `x0` accessor to the argument passed to it which may be either a number or a function that returns a number, this is the second point or our right-most bounds
+ [area.x1([x])](https://github.com/d3/d3-shape#area_x1) - sets the `x1` accessor to the argument passed to it which may be either a number or a function that returns a number, this is the second point or our left-most bounds

We can treat using `y`, `x0`, and `x1` as rotating the area 90 degrees clockwise so that our `y0` (lower bounds) turns into our `x0' (right-most bounds).

All we need to change is the accessors in our area generator and the xScale: 
<pre>
var xScale = d3.scale.Linear().domain([0,6]).range([<b>175, 25</b>]);

var area = d3.area()
      .y(d => xScale(d.x))
      .x0(d => yScale(d.y / 3))
      .x1(d => yScale(d.y));
</pre>
<b>Note:</b> It may seem weird to use the `xScale` and `d.x` in our `y` accessor, we are doing this so it acts like a rotation of our original data without renaming everything.

Also, because of where the origin point is for the area, we have to flip the ranges of the xScale to get this to work as a 90 degree rotation.
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

### Curve and Defined
Just like with lines we have areas have `curve` and `defined` accessors:
+ [area.defined([defined])](https://github.com/d3/d3-shape#area_defined)  - takes as an argument a boolean or a function that returns a boolean.  For each point, if the value returned is true, the point is kept, otherwise it is removed.
+ [area.curve([curve])](https://github.com/d3/d3-shape#area_curve) - takes a curve

This is a previous area we made with a `defined` and `curve` definition that we have used in lines:
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

   d3.select("#demo5")
    .append("path")
    .attr("d", area(data))
    .attr("fill", "red")
    .attr("stroke", "black");
</script>

<svg id="demo5" width="200" height="200"></svg>
```
+ [area.context([context])](https://github.com/d3/d3-shape#area_context)
+ [area.lineX0()](https://github.com/d3/d3-shape#area_lineX0)
+ [area.lineY0()](https://github.com/d3/d3-shape#area_lineY0)
+ [area.lineX1()](https://github.com/d3/d3-shape#area_lineX1)
+ [area.lineY1()](https://github.com/d3/d3-shape#area_lineY1)



## Area Radials

+ [d3.areaRadial()](https://github.com/d3/d3-shape#areaRadial)
+ [areaRadial(data)](https://github.com/d3/d3-shape#_areaRadial)
+ [areaRadial.angle([angle])](https://github.com/d3/d3-shape#areaRadial_angle)
+ [areaRadial.startAngle([angle])](https://github.com/d3/d3-shape#areaRadial_startAngle)
+ [areaRadial.endAngle([angle])](https://github.com/d3/d3-shape#areaRadial_endAngle)
+ [areaRadial.radius([radius])](https://github.com/d3/d3-shape#areaRadial_radius)
+ [areaRadial.innerRadius([radius])](https://github.com/d3/d3-shape#areaRadial_innerRadius)
+ [areaRadial.outerRadius([radius])](https://github.com/d3/d3-shape#areaRadial_outerRadius)
+ [areaRadial.defined([defined])](https://github.com/d3/d3-shape#areaRadial_defined)
+ [areaRadial.curve([curve])](https://github.com/d3/d3-shape#areaRadial_curve)
+ [areaRadial.context([context])](https://github.com/d3/d3-shape#areaRadial_context)