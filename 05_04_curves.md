
{{meta {docid: curves}}}

<script src="https://d3js.org/d3.v5.min.js"></script>

<script>
function renderLine(id, line, color) {
  color = (color === undefined) ? "black" : color;
  
  d3.select("#" + id)
    .append("path")
    .attr("d", line(data))
    .attr("fill", "none")
    .attr("stroke", color);
        
  d3.select("#" + id)
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (d) => xScale(d.x))
    .attr("cy", (d) => yScale(d.y))
    .attr("r", 1.5);
}
</script>

<style>
table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  text-align: left;
  padding: 8px;
}

tr:nth-child(1) {background-color: #f2f2f2;}

tr:nth-child(3) {background-color: #f2f2f2;}


tr:nth-child(4) {background-color: #f2f2f2;}
tr:nth-child(8) {background-color: #f2f2f2;}
tr:nth-child(9) {background-color: #f2f2f2;}
</style>

# Curves

In this section we discuss the point interpolators provided by D3.js.  These are used with various generators ([lines](./05_03_lines.md) and [areas](./05_04_areas.html)) to determine the points of the lines.  Depending on the type of curve, the points specified in the dataset passed to the generator will be used as either end points or control points.

In the table below we group the interpolators by type using rows and colors.  For each row, the interpolators in the second and third columns are variants of the interpolator in the first column.  The fourth column identifies methods that can be called on the interpolators in the first three columns.

<table style="font-size: small;">
<tr>

<td><a href="https://github.com/d3/d3-shape#curveLinear">curveLinear</a></td>
<td><a href="https://github.com/d3/d3-shape#curveLinearClosed">curveLinearClosed</a></td>
<td></td>
<td></td>
</tr>

<tr>
<td><a href="https://github.com/d3/d3-shape#curveStep">curveStep</a></td>
<td><a href="https://github.com/d3/d3-shape#curveStepBefore">curveStepBefore</a></td>
<td><a href="https://github.com/d3/d3-shape#curveStepAfter">curveStepAfter</a></td>
<td></td>
</tr>

<tr>
<td><a href="https://github.com/d3/d3-shape#curveBasis">curveBasis</a></td>
<td><a href="https://github.com/d3/d3-shape#curveBasisClosed">curveBasisClosed</a></td>
<td><a href="https://github.com/d3/d3-shape#curveBasisOpen">curveBasisOpen</a></td>
<td></td>

</tr>

<tr>
<td><a href="https://github.com/d3/d3-shape#curveBundle">curveBundle</a></td>
<td></td>
<td></td>
<td><a href="https://github.com/d3/d3-shape#curveBundle_beta">curveBundle.beta</a></td>
</tr>

<tr>
<td><a href="https://github.com/d3/d3-shape#curveNatural">curveNatural</a></td>
<td></td>
<td></td>
<td></td>
</tr>

<tr>
<td><a href="https://github.com/d3/d3-shape#curveCardinal">curveCardinal</a></td>
<td><a href="https://github.com/d3/d3-shape#curveCardinalClosed">curveCardinalClosed</a></td>
<td><a href="https://github.com/d3/d3-shape#curveCardinalOpen">curveCardinalOpen</a></td>
<td><a href="https://github.com/d3/d3-shape#curveCardinal_tension">cardinal.tension</a></td>
</tr>

<tr>
<td><a href="https://github.com/d3/d3-shape#curveCatmullRom">curveCatmullRom</a></td>
<td><a href="https://github.com/d3/d3-shape#curveCatmullRomClosed">curveCatmullRomClosed</a></td>
<td><a href="https://github.com/d3/d3-shape#curveCatmullRomOpen">curveCatmullRomOpen</a></td>
<td><a href="https://github.com/d3/d3-shape#curveCatmullRom_alpha">catmullRom.alpha</a></td>
</tr>

<tr>
<td><a href="https://github.com/d3/d3-shape#curveMonotoneX">curveMonotoneX</a></td>
<td></td>
<td></td>
<td></td>
</tr>

<tr>
<td><a href="https://github.com/d3/d3-shape#curveMonotoneY">curveMonotoneY</a></td>
<td></td>
<td></td>
<td></td>
</tr>

</table>

Below we describe each of the interpolators and provide examples.  Each of the curves shown below are rendered as a `path` element in an `svg`.  The path description string (`d`) is computed using the line generator, `d3.line` and the interpolator is set using the line generator's `line.curve` method.

## Linear Curves

The linear curve interpolators create polylines by choosing points that create straight lines between each pair of adjacent points in the dataset. There is no open variant of the linear curve, but there is a closed variant which adds a straight line between the first and last point in the dataset.  The `d3.curveLinear` interpolator is the default interpolator used when `line.curve` is not called.

+ [d3.curveLinear(context)](https://github.com/d3/d3-shape#curveLinear)
+ [d3.curveLinearClosed(context)](https://github.com/d3/d3-shape#curveLinearClosed)

```
<script>
var data = [
  {x: 0, y: 0},
  {x: 1, y: 3},
  {x: 2, y: 12},
  {x: 3, y: 8},
  {x: 4, y: 17},
  {x: 5, y: 15},
  {x: 6, y: 10},
  {x: 7, y: 5}];

var xScale = d3.scaleLinear().domain([0, 7]).range([25, 175]);
var yScale = d3.scaleLinear().domain([0,20]).range([175, 25]);

var line = d3.line()
  .x((d) => xScale(d.x))
  .y((d) => yScale(d.y));

renderLine("demo1a", line);
renderLine("demo1b", line.curve(d3.curveLinearClosed));
</script>

<svg id="demo1a" width="200" height="200"></svg>
<svg id="demo1b" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 1. Linear curve (left) and closed linear curve (right).</figcaption></figure>

## Step Curves 

The step curve interpolators create vertical and horizontal lines representing a [step function](https://en.wikipedia.org/wiki/Step_function).  A vertical line is created for each pair of points in the dataset.  Each of the three step curve interpolators position the vertical lines along the x-axis differently.  Horizontal lines are created from the points in the dataset to the vertical lines.

+ [d3.curveStep(context)](https://github.com/d3/d3-shape#curveStep) - for each pair of points, the vertical line is positioned at the midpoint between the `x` coordinates
+ [d3.curveStepBefore(context)](https://github.com/d3/d3-shape#curveStepBefore) - for each pair of points, the vertical line is positioned at the `x` coordinate of the first point
+ [d3.curveStepAfter(context)](https://github.com/d3/d3-shape#curveStepAfter) - for each pair of points, the vertical line is positioned at the `x` coordinate of the second point

```
<script>
var data = [
  {x: 0, y: 0},
  {x: 1, y: 3},
  {x: 2, y: 12},
  {x: 3, y: 8},
  {x: 4, y: 17},
  {x: 5, y: 15},
  {x: 6, y: 10},
  {x: 7, y: 5}];

var xScale = d3.scaleLinear().domain([0, 7]).range([25, 175]);
var yScale = d3.scaleLinear().domain([0,20]).range([175, 25]);
  
var line = d3.line()
  .x((d) => xScale(d.x))
  .y((d) => yScale(d.y));
            
renderLine("demo2a", line.curve(d3.curveStep));
renderLine("demo2b", line.curve(d3.curveStepBefore)); 
renderLine("demo2c", line.curve(d3.curveStepAfter)); 
</script>

<svg id="demo2a" width="200" height="200"></svg>
<svg id="demo2b" width="200" height="200"></svg>
<svg id="demo2c" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 2. Step (left), step before (center), step after (right).</figcaption></figure>

## Basis Curves

The basis curve interpolators produce [cubic basis splines](https://en.wikipedia.org/wiki/B-spline) where the points provided to the generators are used as control points.

+ [d3.curveBasis(context)](https://github.com/d3/d3-shape#curveBasis)
+ [d3.curveBasisClosed(context)](https://github.com/d3/d3-shape#curveBasisClosed)
+ [d3.curveBasisOpen(context)](https://github.com/d3/d3-shape#curveBasisOpen)

```
<script>
var data = [
  {x: 0, y: 0},
  {x: 1, y: 3},
  {x: 2, y: 12},
  {x: 3, y: 8},
  {x: 4, y: 17},
  {x: 5, y: 15},
  {x: 6, y: 10},
  {x: 7, y: 5}];

var xScale = d3.scaleLinear().domain([0, 7]).range([25, 175]);
var yScale = d3.scaleLinear().domain([0,20]).range([175, 25]);
  
var line = d3.line()
  .x((d) => xScale(d.x))
  .y((d) => yScale(d.y));
            
renderLine("demo3a", line.curve(d3.curveBasis));
renderLine("demo3b", line.curve(d3.curveBasisClosed)); 
renderLine("demo3c", line.curve(d3.curveBasisOpen)); 
</script>

<svg id="demo3a" width="200" height="200"></svg>
<svg id="demo3b" width="200" height="200"></svg>
<svg id="demo3c" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 3. Basis (left), basis closed (center), basis open (right).</figcaption></figure>

## Bundle Curve

The bundle curve interpolators create straightened [cubic basis splines](https://en.wikipedia.org/wiki/B-spline).  The degree to which the spline is straightened is determined by the interpolator's `beta` value.  Valid `beta` values range between 0 and 1. At the extremes, when `beta` is `1` the curve resembles the curve produced by `d3.curveBasis` and when `beta` is `0` the curve is a straight line between the first and last control points.  By default, the `beta` value is `0.85`.  This curve is not intended for use with `d3.area`, only `d3.line`.

+ [d3.curveBundle(context)](https://github.com/d3/d3-shape#curveBundle)
+ [d3.curveBundle.beta(beta)](https://github.com/d3/d3-shape#curveBundle_beta) - returns a bundle curve interpolator with the specified `beta`.

```
<script>
var data = [
  {x: 0, y: 0},
  {x: 1, y: 3},
  {x: 2, y: 12},
  {x: 3, y: 8},
  {x: 4, y: 17},
  {x: 5, y: 15},
  {x: 6, y: 10},
  {x: 7, y: 5}];

var xScale = d3.scaleLinear().domain([0, 7]).range([25, 175]);
var yScale = d3.scaleLinear().domain([0,20]).range([175, 25]);
  
var line = d3.line()
  .x((d) => xScale(d.x))
  .y((d) => yScale(d.y));
           
renderLine("demo4", line.curve(d3.curveBundle), "black");

renderLine("demo4", line.curve(d3.curveBundle.beta(0)), "darkslategray");
renderLine("demo4", line.curve(d3.curveBundle.beta(0.25)), "dimgray");
renderLine("demo4", line.curve(d3.curveBundle.beta(0.5)), "gray");
renderLine("demo4", line.curve(d3.curveBundle.beta(0.75)), "darkgray");
renderLine("demo4", line.curve(d3.curveBundle.beta(1)), "lightgray");
</script>

<svg id="demo4" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 4. Bundle curve with beta values (from top to bottom): 1, 0.85, 0.75, 0.5, 0.25, 0. </figcaption></figure>

## Natural

The `d3.curveNatural` interpolator produces a [natural cubic spline](https://en.wikipedia.org/wiki/Spline_interpolation).

+ [d3.curveNatural(context)](https://github.com/d3/d3-shape#curveNatural)

```
<script>
var data = [
  {x: 0, y: 0},
  {x: 1, y: 3},
  {x: 2, y: 12},
  {x: 3, y: 8},
  {x: 4, y: 17},
  {x: 5, y: 15},
  {x: 6, y: 10},
  {x: 7, y: 5}];

var xScale = d3.scaleLinear().domain([0, 7]).range([25, 175]);
var yScale = d3.scaleLinear().domain([0,20]).range([175, 25]);
  
var line = d3.line()
  .x((d) => xScale(d.x))
  .y((d) => yScale(d.y));
            
renderLine("demo5", line.curve(d3.curveNatural));
</script>

<svg id="demo5" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 5. Natural cublic spline. </figcaption></figure>

## Cardinal Curves

The cardinal curve interpolators produce [cubic cardinal splines](https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Cardinal_spline). The spline's tension can be altered using `cardinal.tension`.  Tension values range between 0 and 1 and by default, the tension is set to 0.  When the tension is set to 0, the curve resembles the natural curve and when the tension is set to 1, the curve resembles the linear curve.

+ [d3.curveCardinal(context)](https://github.com/d3/d3-shape#curveCardinal)
+ [d3.curveCardinalClosed(context)](https://github.com/d3/d3-shape#curveCardinalClosed)
+ [d3.curveCardinalOpen(context)](https://github.com/d3/d3-shape#curveCardinalOpen)
+ [cardinal.tension(tension)](https://github.com/d3/d3-shape#curveCardinal_tension) - returns a cardinal curve interpolator with the specified `tension`. 

```
<script>
var data = [
  {x: 0, y: 0},
  {x: 1, y: 3},
  {x: 2, y: 12},
  {x: 3, y: 8},
  {x: 4, y: 17},
  {x: 5, y: 15},
  {x: 6, y: 10},
  {x: 7, y: 5}];

var xScale = d3.scaleLinear().domain([0, 7]).range([25, 175]);
var yScale = d3.scaleLinear().domain([0,20]).range([175, 25]);
  
var line = d3.line()
  .x((d) => xScale(d.x))
  .y((d) => yScale(d.y));
  
var variations = [
  {t: 0,    c: "black"},
  {t: 0.5,  c: "darkgray"},
  {t: 1,    c: "gray"}
];

for(o of variations) {
  renderLine("demo6a", line.curve(d3.curveCardinal.tension(o.t)), o.c);
  renderLine("demo6b", line.curve(d3.curveCardinalClosed.tension(o.t)), o.c);
  renderLine("demo6c", line.curve(d3.curveCardinalOpen.tension(o.t)), o.c);
}            
</script>

<svg id="demo6a" width="200" height="200"></svg>
<svg id="demo6b" width="200" height="200"></svg>
<svg id="demo6c" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 6. Cardinal (left), closed cardinal (center), and open cardinal (right) curves. </figcaption></figure>

## Catmull-Rom Curves

The Catmull-Rom curve interpolators produce [cubic Catmull-Rom splines](https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Cardinal_spline). The spline's alpha parameter can be set using `catmullRom.alpha`.  Alpha values range between 0 and 1 and by default, the value is set to 0.5.

+ [d3.curveCatmullRom(context)](https://github.com/d3/d3-shape#curveCatmullRom)
+ [d3.curveCatmullRomClosed(context)](https://github.com/d3/d3-shape#curveCatmullRomClosed)
+ [d3.curveCatmullRomOpen(context)](https://github.com/d3/d3-shape#curveCatmullRomOpen)
+ [catmullRom.alpha(alpha)](https://github.com/d3/d3-shape#curveCatmullRom_alpha) - returns a Catmull-Rom curve interpolator with the specified `alpha`.

```
<script>
var data = [
  {x: 0, y: 0},
  {x: 1, y: 3},
  {x: 2, y: 12},
  {x: 3, y: 8},
  {x: 4, y: 17},
  {x: 5, y: 15},
  {x: 6, y: 10},
  {x: 7, y: 5}];

var xScale = d3.scaleLinear().domain([0, 7]).range([25, 175]);
var yScale = d3.scaleLinear().domain([0,20]).range([175, 25]);
  
var line = d3.line()
  .x((d) => xScale(d.x))
  .y((d) => yScale(d.y));
  
var variations = [
  {t: 0,    c: "black"},
  {t: 0.5,  c: "darkgray"},
  {t: 1,    c: "gray"}
];

for(o of variations) {
  renderLine("demo7a", line.curve(d3.curveCatmullRom.alpha(o.t)), o.c);
  renderLine("demo7b", line.curve(d3.curveCatmullRomClosed.alpha(o.t)), o.c);
  renderLine("demo7c", line.curve(d3.curveCatmullRomOpen.alpha(o.t)), o.c);
}            
</script>

<svg id="demo7a" width="200" height="200"></svg>
<svg id="demo7b" width="200" height="200"></svg>
<svg id="demo7c" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 7. Catmull-Rom (left), closed Catmull-Rom (center), and open Catmull-Rom (right) curves. </figcaption></figure>

## Monotone Curves

The monotone curves assume that the data is sorted according to either the x coordinates (`d3.curveMonotoneX`) or the y coordinates (`d3.curveMonotoneY`).  In the examples below we use the same data, but sort them differently.  In the first example, the data is sorted according to the x coordinates and in the second example, the data is sorted according to the y coordinates.

+ [d3.curveMonotoneX(context)](https://github.com/d3/d3-shape#curveMonotoneX) - produces a cubic spline that preserves monotonicity in y, assuming monotonicity in x.
+ [d3.curveMonotoneY(context)](https://github.com/d3/d3-shape#curveMonotoneY) - produces a cubic spline that preserves monotonicity in x, assuming monotonicity in y.

```
<script>
var data = [
  {x: 0, y: 0},
  {x: 1, y: 3},
  {x: 2, y: 12},
  {x: 3, y: 8},
  {x: 4, y: 17},
  {x: 5, y: 15},
  {x: 6, y: 10},
  {x: 7, y: 5}];

var xScale = d3.scaleLinear().domain([0, 7]).range([25, 175]);
var yScale = d3.scaleLinear().domain([0,20]).range([175, 25]);

var line = d3.line()
  .x(d => xScale(d.x))
  .y(d => yScale(d.y))
  .curve(d3.curveMonotoneX);
        
renderLine("demo8a", line);        

//Monotone Y
data.sort((a,b) => a.y - b.y);

var line = d3.line()
  .x(d => xScale(d.x))
  .y(d => yScale(d.y))
  .curve(d3.curveMonotoneY);

renderLine("demo8b", line);

</script>

<svg id="demo8a" width="200" height="200"></svg>
<svg id="demo8b" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 8. Monotone X curve (left), monotone Y curve (right). </figcaption></figure>

<aside>

## In Case You Were Wondering

In each of the examples shown above we rendered the lines and plot the points in the dataset using the following function.

```
<script>
function renderLine(id, line, color) {
  color = (color === undefined) ? "black" : color;
  
  d3.select("#" + id)
    .append("path")
    .attr("d", line(data))
    .attr("fill", "none")
    .attr("stroke", color);
        
  d3.select("#" + id)
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (d) => xScale(d.x))
    .attr("cy", (d) => yScale(d.y))
    .attr("r", 1.5);
}
</script>
<code>renderLines(id, line, color)</code>
```
</aside>