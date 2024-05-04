{{meta {docid: lines}}}
{{meta {description: ""}}}

<script src="https://d3js.org/d3.v5.min.js"></script>

# Lines

We learned in the previous section that we can draw lines in an SVG by creating a `path` element and setting its `d` attribute to a string that describes the path.  We also learned that we can create a string that describes a path using `d3.path` rather than manually writing the path description string.  When we use `d3.path`, however, we have to know the actual *x* and *y* coordinates of the starting, ending, and control points for the lines.  In this section we'll discuss how to use [d3.line()](https://github.com/d3/d3-shape#lines), a line generator, which generates path description strings by interpolating the coordinates from an array of data.

To begin, we create an instance of the line generator on which we can call various line methods, which themselves return a reference to `this` line generator, allowing us to chain multiple line method calls.

<pre>
var line = d3.line();
</pre>

By default, the line generator assumes the data set is an array of coordinates, where each coordinate is specified by an array of two elements, *[x,y]*.  

The line shown in Figure 2 is generated using the following array of coordinates.

<pre>
var data = [
  [25,  175],
  [50,  152.5],
  [75,  85],
  [100, 115],
  [125, 47.5],
  [150, 62.5],
  [175, 25]];
</pre>

We can now compute the SVG `path` description string by invoking [line(data)](https://github.com/d3/d3-shape#_line).

<pre>
var desc = line(data);
</pre>

```
<script>
var data = [
  [25,  175],
  [50,  152.5],
  [75,  85],
  [100, 115],
  [125, 47.5],
  [150, 62.5],
  [175, 25]];

var line = d3.line();
var desc = line(data);

console.log(desc);
</script>
```
<figure class="sandbox"><figcaption>Figure 1. Path element description string.</figcaption></figure>

We then render the line in an `svg` element by setting a `path` element's `d` attribute equal to `line(data)`.

```
<script>
var data = [
  [25,  175],
  [50,  152.5],
  [75,  85],
  [100, 115],
  [125, 47.5],
  [150, 62.5],
  [175, 25]];

var line = d3.line();

d3.select("#demo1")
  .append("path")
  .attr("d", line(data))
  .attr("fill", "none")
  .attr("stroke", "red");
</script>

<svg id="demo1" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 2. Line created using an array of coordinates.</figcaption></figure>

## Accessor Methods

The line generator has two methods that can be called to assign the line generator custom *x* and *y* coordinate accessors.

+ [line.x([x])](https://github.com/d3/d3-shape#line_x) - sets or gets the x accessor.  If `x` is provided, it must be a number or a function that returns a number.  If `x` is not provide, returns the *x* coordinate accessor function. 
+ [line.y([y])](https://github.com/d3/d3-shape#line_y) - sets or gets the y accessor.  If `y` is provided, it must be a number or a function that returns a number.  If `y` is not provide, returns the *y* coordinate accessor function. 

When `line.x` and `line.y` are passed functions (or lambda expressions), the functions are called for each element in the dataset and when called, are passed the current data element `d`, the index of the current element `i`, and the array of data on which the generator is invoked, `data`.

When `line.x` and `line.y` are called without an argument, the methods return the line generator's current accessor.

In Figure 3, the data source is an array of objects, where each object contains two properties: `day` and `rank`.  In order to use the values in the `day` and `rank` properties as *x* and *y* coordinates, respectfully, we set *x* and *y* accessor functions.

<pre>
var data = [
  {day: 25,  rank: 175},
  {day: 50,  rank: 152.5},
  {day: 75,  rank: 85},
  {day: 100, rank: 115},
  {day: 125, rank: 47.5},
  {day: 150, rank: 62.5},
  {day: 175, rank: 25}];

var line = d3.line()
  .x((d) => d.day)
  .y((d) => d.rank);
</pre>

```
<script>
var data = [
  {day: 25,  rank: 175},
  {day: 50,  rank: 152.5},
  {day: 75,  rank: 85},
  {day: 100, rank: 115},
  {day: 125, rank: 47.5},
  {day: 150, rank: 62.5},
  {day: 175, rank: 25}];

var line = d3.line()
  .x((d) => d.day)
  .y((d) => d.rank);

d3.select("#demo2")
  .append("path")
  .attr("d", line(data))
  .attr("fill", "none")
  .attr("stroke", "red");
    
</script>

<svg id="demo2" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 3. Line created using array of objects and accessor functions.</figcaption></figure>

In Figure 4, we use `d3.scaleLinear` to scale the data in the dataset.  To begin, we create an array of data and create scales that will be used to scale the data to fit the svg.

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

Next, we create a line generator and use the scales in the *x* and *y* accessor methods.

<pre>
var line = d3.line()
  .x(d => xScale(d.x))
  .y(d => yScale(d.y));
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

d3.select("#demo3")
  .append("path")
  .attr("d", line(data))
  .attr("fill", "none")
  .attr("stroke", "red");
</script>

<svg id="demo3" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 4. Line created using accessor functions and scales.</figcaption></figure>

## Using Bound Data

We can also compute the `d` attribute of a `path` element, not by invoking the line generator directly, but rather, by joining the data to the `path` element and then passing the line generator as the second argument of `selection.attr` when setting the `d` attribute.

<pre>
d3.select("#demo1")
  .append("path")
  .data([data])          // bind the dataset to the path element
  .attr("d", line)       // pass the line generator
  .attr("fill", "none")
  .attr("stroke", "red");
</pre>

Note how we bind the dataset to the `path` element by passing to `selection.data` an *array* containing the dataset (`[data]`), not the dataset itself.  Also note that we pass the line generator itself to `selection.attr` not the string created by the line generator.

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

d3.select("#demo4")
  .append("path")
  .data([data])
  .attr("d", line)
  .attr("fill", "none")
  .attr("stroke", "red");
</script>

<svg id="demo4" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 5. Line created from data bound to a path element.</figcaption></figure>

Note that the dataset is passed to `selection.data` inside an array.

## Excluding Points
Sometimes we may want to exclude certain points on the line. To do this we can set the *defined* accessor function by calling [line.defined([defined])](https://github.com/d3/d3-shape#line_defined) on our line generator.

+ [line.defined([defined])](https://github.com/d3/d3-shape#line_defined) - takes as an argument a boolean or a function that returns a boolean.  

When the line generator computes points, it invokes the *defined* accessor for each element in the dataset, passing it the current data element `d`, the index of the current element `i`, and the array of data on which the generator is invoked, `data`.  If the *defined* accessor evaluates to true, a point is generated for the data element, otherwise the element is ignored.  By default, the *defined* accessor returns true for all elements in the dataset.

In Figure 6 we exclude the point that was generated from the data element at index 4 by passing a lambda expression to `line.defined` which returns true unless `i` is `4`.

<pre>
var line = d3.line()
  .x(d => xScale(d.x))
  .y(d => yScale(d.y));
  .defined((d,i) => i != 4);
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
  .defined((d,i) => i != 4);

d3.select("#demo5")
  .append("path")
  .data([data])
  .attr("d", line)
  .attr("fill", "none")
  .attr("stroke", "red");
</script>

<svg id="demo5" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 6. Line with a missing point.</figcaption></figure>

## Curving the Line

To create a curve we need to change the way that the points are interpolated.  For this we can call [line.curve([curve])](https://github.com/d3/d3-shape#line_curve) passing it a predefined curve factory.  D3.js provides several curve factories which we discuss in the section on [curves](05_04_curves.html).

If `line.curve` is called without an argument, the current curve factory is returned, which by default is the [d3.curveLinear](https://github.com/d3/d3-shape/blob/v1.3.4/README.md#curveLinear) curve factory.

Figure 7 sets the line generator's curve factory to `d3.curveBasis` producing a cubic basis spline.

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
  
d3.select("#demo6")
  .append("path")
  .data([data])
  .attr("d", line)
  .attr("fill", "none")
  .attr("stroke", "red");
</script>

<svg id="demo6" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 7. Line contructed using data bound to a path element.</figcaption></figure>

## Rendering Lines to a Context

We can render the line in a `canvas` element's `context` by using [line.context([context])](https://github.com/d3/d3-shape#line_context).  

If no argument is passed to `line.context`, the method returns the current context, which by default is null.  If, however, a context is passed to `line.context`, the line will be rendered in the context when the line generator is invoke.

In Figure 8, we use the same data and scales as in the previous example.  After defining the data and the scales, we get the 2d `context` from the `canvas` element.

<pre>
var context = d3.select("#demo7").node().getContext("2d");
</pre>

We then create the line generator and call `line.context` to set the context.

<pre>
var line = d3.line()
  .x(d => xScale(d.x))
  .y(d => yScale(d.y))
  .context(context);
</pre>

We then render the line by invoking the line generator, setting the stroke color, and calling  `context.stroke`.

<pre>
line(data);
context.strokeStyle = "red";
context.stroke();
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

var context = d3.select("#demo7").node().getContext("2d");

  
var line = d3.line()
  .x(d => xScale(d.x))
  .y(d => yScale(d.y))
  .context(context);
  
line(data);
context.strokeStyle = "red";
context.stroke();
</script> 

<canvas id="demo7" width="200" height="200"></canvas>
```
<figure class="sandbox"><figcaption>Figure 8. Rendering a line in a canvas element.</figcaption></figure>
