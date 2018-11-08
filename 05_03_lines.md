{{meta {docid: arcs_pie_charts}}}

<script src="https://d3js.org/d3.v4.min.js"></script>

<style>
    svg { background-color: lightblue; }
</style>

# Lines
In this tutorial we'll discuss how to draw lines. Lines can be used on their own, but they are also used in many other areas of this chapter such as [areas](05_04_areas.html), [curves](05_05_curves.html), and [links](05_06_links.html).

To make our lines, D3 needs an x value and a y value to make points. D3 then takes all these points, connects each with a line, and returns all the lines together in a form we can use with `path`.

`d3.line()` returns our line generator that we will need and we will use the following functions to set our x and y values:
+ [line.x([x])](https://github.com/d3/d3-shape#line_x) - takes either a number or a function that returns a number
+ [line.y([y])](https://github.com/d3/d3-shape#line_y) - takes either a number or a function that returns a number

We will use the following data and linear scales for our example: 
<pre>
var data = [
    {xValue: 0, yValue: 0},
    {xValue: 1, yValue: 3},
    {xValue: 2, yValue: 12},
    {xValue: 3, yValue: 8},
    {xValue: 4, yValue: 17},
    {xValue: 5, yValue: 15},
    {xValue: 6, yValue: 20}];
var xScale = d3.scaleLinear().domain([0, 6]).range([25, 175]);
var yScale = d3.scaleLinear().domain([0,20]).range([175, 25]);
</pre>

Next we need to create our line generator and set how the x and y values are determined
<pre>
var line = d3.line()
    .x(function(d) { return xScale(d.xValue); })
    .y(function(d) { return yScale(d.yValue); });
</pre>

Finally we append a `path` to our svg, pass in our data, and set `d` to be our line generator:
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
    {xValue: 0, yValue: 0},
    {xValue: 1, yValue: 3},
    {xValue: 2, yValue: 12},
    {xValue: 3, yValue: 8},
    {xValue: 4, yValue: 17},
    {xValue: 5, yValue: 15},
    {xValue: 6, yValue: 20}];
   
   var xScale = d3.scaleLinear().domain([0, 6]).range([25, 175]);
   var yScale = d3.scaleLinear().domain([0,20]).range([175, 25]);
  
   var line = d3.line()
      .x(function(d) { return xScale(d.xValue); })
      .y(function(d) { return yScale(d.yValue); });
      
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
Sometimes we may want to exclude certain points on the line, in D3 we can call [line.defined([defined])](https://github.com/d3/d3-shape#line_defined) on our line generator to decide when to exclude points.
+ [line.defined([defined])](https://github.com/d3/d3-shape#line_defined) - takes a boolean or a function that returns a boolean, if the value is true, it will show that point, if false the point will be skipped. By default is true.

For example to exclude the 4th index in the series:

<pre>
var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); })
    .defined(function(d,i) { return (i != 4) });
</pre> 

When we remove a point no lines will start or end at where the point would have been.

```
<script>
 var data = [
    {xValue: 0, yValue: 0},
    {xValue: 1, yValue: 3},
    {xValue: 2, yValue: 12},
    {xValue: 3, yValue: 8},
    {xValue: 4, yValue: 17},
    {xValue: 5, yValue: 15},
    {xValue: 6, yValue: 20}];
   
 var xScale = d3.scaleLinear().domain([0, 6]).range([25, 175]);
 var yScale = d3.scaleLinear().domain([0,20]).range([175, 25]);
  
 var line = d3.line()
      .x(function(d) { return xScale(d.xValue); })
      .y(function(d) { return yScale(d.yValue); })
      .defined(function(d,i) { return (i != 4) });
      
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
There are many applications to taking the data and having it curve instead of being straight lines. For this we would use [line.curve([curve])](https://github.com/d3/d3-shape#line_curve) and pass in a curve. 

<pre>
var line = d3.line()
    .x(function(d) { return xScale(d.xValue); })
    .y(function(d) { return yScale(d.yValue); })
    .curve(d3.curveBasis);
</pre>

[Curves](05_05_curves.html) are covered more in-depth in the next section.
```
<script>
 var data = [
    {xValue: 0, yValue: 0},
    {xValue: 1, yValue: 3},
    {xValue: 2, yValue: 12},
    {xValue: 3, yValue: 8},
    {xValue: 4, yValue: 17},
    {xValue: 5, yValue: 15},
    {xValue: 6, yValue: 20}];
   
 var xScale = d3.scaleLinear().domain([0, 6]).range([25, 175]);
 var yScale = d3.scaleLinear().domain([0,20]).range([175, 25]);
  
 var line = d3.line()
      .x(function(d) { return xScale(d.xValue); })
      .y(function(d) { return yScale(d.yValue); })
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

## Line Radials
A line radial is a line that is wrapped around a circle.
Similarly to lines, D3 takes x and y values to make points, but the points are determined a bit differently than lines. 
For a line radial, D3 needs an angle and a radius from the center of the circle to determine where each "point" is:

For the angle we will use the x values, but change their `scaleLinear.range` to be 0 to 2*Math.PI (the circumference of a circle).
+ [lineRadial.angle([angle])](https://github.com/d3/d3-shape#lineRadial_angle) - takes either a number or function that returns a number (Should be 0 to 2 * Math.PI)

For the radius we will use the y values, but change their `scaleLinear.range` to be a distance away from the center of the circle, we will be using 40 to 80 in this example.
+ [lineRadial.radius([radius])](https://github.com/d3/d3-shape#lineRadial_radius) - takes either a number or function that returns a number
  
<b>Note:</b> It is also important to remember that center of the circle is positioned at (0,0) of whatever they are added into. 
To accommodate this, we will append into a new `g` element in our svg that is translated into the middle. 

We will change up the ranges of the scales, and add the `g` element to the svg and make sure we select it. 
<br>Setting up the lineRadial generator is almost identical to setting up the line generator except we replace the `x` with `angle` and `y` with `radius`:
<pre>
var xScale = d3.scaleLinear().domain([0, 6]).range([0, 2* Math.PI]);
var yScale = d3.scaleLinear().domain([0,20]).range([40, 80]);

var lineRadial = d3.lineRadial()
     .angle(function(d) { return xScale(d.xValue); })
     .radius(function(d) { return yScale(d.yValue); });
     
d3.select("#demo4")
    .select("g") //making sure to select the g
    .append("path")
    .data([data])
    .attr("d", lineRadial)
    .attr("fill", "none")
    .attr("stroke", "black");
    
//outside script
&lt;svg id="demo4" width="200" height="200"&gt;
    &lt;g transform="translate(100,100)"&gt;&lt;/g&gt; 
    //new g element that positions the circle in the middle
&lt;/svg&gt;
</pre>

```
<script>
 var data = [
    {xValue: 0, yValue: 0},
    {xValue: 1, yValue: 3},
    {xValue: 2, yValue: 12},
    {xValue: 3, yValue: 8},
    {xValue: 4, yValue: 17},
    {xValue: 5, yValue: 15},
    {xValue: 6, yValue: 20}];
   
 var xScale = d3.scaleLinear().domain([0, 6]).range([0, 2* Math.PI]);
 var yScale = d3.scaleLinear().domain([0,20]).range([40, 80]);
  
 var lineRadial = d3.lineRadial()
      .angle(function(d) { return xScale(d.xValue); })
      .radius(function(d) { return yScale(d.yValue); });
      
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

Just like with lines, line radials have the following functions to use:

+ [lineRadial.defined([defined])](https://github.com/d3/d3-shape#lineRadial_defined)
+ [lineRadial.curve([curve])](https://github.com/d3/d3-shape#lineRadial_curve)

In this example we set both a curve and a defined similar to the examples we did in lines. (Point 4 is exempt, and a basic curve is applied on the remaining segments)
```
<script>
 var data = [
    {xValue: 0, yValue: 0},
    {xValue: 1, yValue: 3},
    {xValue: 2, yValue: 12},
    {xValue: 3, yValue: 8},
    {xValue: 4, yValue: 17},
    {xValue: 5, yValue: 15},
    {xValue: 6, yValue: 20}];
   
 var xScale = d3.scaleLinear().domain([0, 6]).range([0, 2* Math.PI]);
 var yScale = d3.scaleLinear().domain([0,20]).range([40, 80]);
  
 var lineRadial = d3.lineRadial()
      .angle(function(d) { return xScale(d.xValue); })
      .radius(function(d) { return yScale(d.yValue); })
      .defined(function(d,i) {return (i != 4);})
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