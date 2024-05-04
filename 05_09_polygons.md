{{meta {docid: polygons}}}
{{meta {description: ""}}}

<script src="https://d3js.org/d3.v5.min.js"></script>

<style>
    svg { background-color: white; display: inline-block;}
    .sandbox-output { text-align: center;}
</style>

# Polygon

In this section we will be discussing how to, given an array of points, compute the subset of points that form a [convex hull](https://en.wikipedia.org/wiki/Convex_hull#Convex_hull_of_a_finite_point_set).  For those unfamiliar with convex hulls, a convex hull can be visualized as the shape enclosed by an elastic band stretched around a set of points.

Consider the following data set:

<pre>
var points = [
    [50, 50],
    [50, 150],
    [150, 150],
    [150, 50],
    [100, 100],
    [125, 125]
];
</pre>

When we graph the six points (Figure 1), we notice that four points, creating a square, form the convex hull, and 2 points reside in the interior of the convex hull.   
  
```
<script>
var points = [
  [50, 50],
  [50, 150],
  [150, 150],
  [150, 50],
  [100, 100],
  [125, 125]
];

d3.select("#demo1")
  .select("#points")
  .selectAll()
  .data(points)
  .join("circle")
  .attr("r", 5)
  .attr("cx", (d) => d[0])
  .attr("cy", (d) => d[1]);
  
d3.select("#demo1")
  .select("#hull")
  .selectAll("circle")
  .data(points)
  .join("circle")
  .attr("r", 5)
  .attr("cx", (d) => d[0])
  .attr("cy", (d) => d[1]);
  
var hull = d3.polygonHull(points);
  
var line = d3.line()
  .curve(d3.curveLinearClosed);
    
d3.select("#demo1")
  .select("#hull")
  .append("path")
  .attr("d", line(hull))
  .attr("stroke-dasharray", "4")
  .attr("fill", "none")
  .attr("stroke", "black");
</script>

<svg id="demo1" width=400px height=200px>
  <g id="points"></g>
  <g id="hull" transform="translate(200,0)"></g>
</svg>
```
<figure class="sandbox"><figcaption>Figure 1. 6 points (left), outline of convex hull (right). </figcaption></figure>
  
D3.js provides a function named `d3.polygonHull` which computes the minimal set of points that produce a convex hull.

+ [d3.polygonHull(points)](https://github.com/d3/d3-polygon#polygonHull) - Takes an array of `points` and returns a subset of `points` that form the perimeter or "hull".  

When we create a hull and print its value to the console we see that the points returned are ordered counterclockwise around the perimeter of the hull.
  
<pre>
var hull = d3.polygonHull(points);
console.log(hull);
</pre>

```
<script>
var points = [
  [50, 50],
  [50, 150],
  [150, 150],
  [150, 50],
  [100, 100],
  [125, 125]
];
  
var hull = d3.polygonHull(points);
console.log(hull);
</script>
```
<figure class="sandbox"><figcaption>Figure 2. The hull returned by d3.polygonHull. </figcaption></figure>

Now that we have the hull we can use a `line` generator to draw a polygon around the hull. The curve will be set to `d3.curveLinearClosed` so that a line is drawn from the ending point to the starting point, closing the polygon.

<pre>
var line = d3.line()
    .curve(d3.curveLinearClosed);
    
d3.select("#svg")
    .append("path")
    .attr("d", line(hull));
</pre>

```
<script>
var points = [
  [50, 50],
  [50, 150],
  [150, 150],
  [150, 50],
  [100, 100],
  [125, 125]
];

var hull = d3.polygonHull(points);
  
var line = d3.line()
  .curve(d3.curveLinearClosed);
    
d3.select("#demo2")
  .select("g")
  .append("path")
  .attr("d", line(hull))
  .attr("fill", "red")
  .attr("stroke", "black");
  
d3.select("#demo2")
  .select("g")
  .selectAll("circle")
  .data(points)
  .join("circle")
  .attr("r", 5)
  .attr("cx", (d) => d[0])
  .attr("cy", (d) => d[1]);
</script>

<svg id="demo2" width=400px height=200px>
  <g></g>
</svg>
```
<figure class="sandbox"><figcaption>Figure 3. A hull shaded red. </figcaption></figure>

## Mapping an array from an object

Unlike other generators, `d3.polygonHull` does not have accessor functions. As such, in order to make a new polygon we must pass in an array in the form of `[[x0, y0], [x1, y1], [x2, y2], ..., [xn, yn]]`.  Many times, however, the coordinates of the points will be contained within an array of objects.

Consider the following array of objects:

<pre>
var data = [
    {name: "alpha", x: 0, y: 0},
    {name: "beta",  x: 5, y: 0},
    {name: "gamma", x: 0, y: 5},
    {name: "delta", x: 2.5, y: 2.5},
    {name: "epsilon",  x: 5, y: 5},
    {name: "zeta", x: 4, y: 1}
];
</pre>

To get the data needed by `d3.polygonHull`, we can use a map function on our array of objects to generate a compatible array of points.  We can also use a scale inside of this map function if we need to. 

In Figure 4 we convert `data` into an array of points that `d3.polygonHull` can use. In this conversion we also pass the `x` and `y` values into their respective scale functions to get proper SVG coordinates.

<pre>
var xScale = d3.scaleLinear().domain([0,5]).range([25,175]);
var yScale = d3.scaleLinear().domain([0,5]).range([175,25]);

var points = data.map((d) => [xScale(d.x), yScale(d.y)]);

var hull = d3.polygonHull(points);
</pre>

```
<script>
var data = [
  {name: "alpha", x: 0, y: 0},
  {name: "beta",  x: 5, y: 0},
  {name: "gamma", x: 0, y: 5},
  {name: "delta", x: 2.5, y: 2.5},
  {name: "epsilon",  x: 5, y: 5},
  {name: "zeta", x: 4, y: 1}
];
var xScale = d3.scaleLinear().domain([0,5]).range([25,175]);
var yScale = d3.scaleLinear().domain([0,5]).range([175,25]);

var points = data.map((d) => [xScale(d.x), yScale(d.y)] );

var hull = d3.polygonHull(points);
var line = d3.line()
  .curve(d3.curveLinearClosed);

var selection = d3.select("#demo3");

selection.append("path")
  .attr("d", line(hull))
  .attr("fill", "red")
  .attr("stroke", "black");

selection.selectAll()
  .data(points)
  .join("circle")
  .attr("cx", (d) => d[0])
  .attr("cy", (d) => d[1])
  .attr("r", 5)
  .attr("fill", "black");
</script>

<svg id="demo3" width=200 height=200></svg>
```
<figure class="sandbox"><figcaption>Figure 4. A polygon where the hull was generated from an array of objects using Array.map.</figcaption></figure>

## Additional Methods

It may be useful to know if a specific point is within a polygon.  For this case, D3.js supplies us with the `d3.polygonContains` method.

+ [d3.polygonContains(polygon, point)](https://github.com/d3/d3-polygon#polygonContains) - Takes a polygon hull array and a point and returns true if the point is inside the polygon, false otherwise. 

In Figure 5, we draw two circles and use `d3.polygonContains` to determine if the circles are inside of the polygon.

```
<script>
var points = [
  [50, 50],
  [50, 150],
  [150, 150],
  [150, 50],
  [100, 100],
  [125, 125]
];
var hull = d3.polygonHull(points);
var selection = d3.select("#demo4");

var line = d3.line()
  .x(d => d[0])
  .y(d => d[1])
  .curve(d3.curveLinearClosed);

selection.append("path")
  .attr("d", line(hull))
  .attr("stroke", "black")
  .attr("fill", "red");
    
selection.selectAll()
  .data(points)
  .join("circle")
  .attr("cx", (d) => d[0])
  .attr("cy", (d) => d[1])
  .attr("r", 5);
    
var point1 = [80,70];
var point2 = [30, 120];
containPoints = [point1, point2];

selection.selectAll()
  .data(containPoints)
  .join("circle")
  .attr("fill", "lightgreen")
  .attr("r", 5)
  .attr("cx", (d) => d[0])
  .attr("cy", (d) => d[1]);
    
selection.selectAll()
  .data(containPoints)
  .join("text")
  .attr("x", 210)
  .attr("y", (d, i) => 25 + 25*i)
  .text((d) => "Contains [" + d[0] + " , " + d[1] + "]: " + d3.polygonContains(hull,d));
</script>

<svg id="demo4" width=400 height=200></svg> 
```
<figure class="sandbox"><figcaption>Figure 5. On point contained within the polygon and one point outside of the polygon. </figcaption></figure>

D3.js also methods to obtain statistics on polygons.

+ [d3.polygonArea(polygon)](https://github.com/d3/d3-polygon#polygonArea) - Takes an array of points forming a polygon and returns back the array of the polygon.
+ [d3.polygonLength(polygon)](https://github.com/d3/d3-polygon#polygonLength) - Takes an array of points forming a polygon and returns the perimeter of the polygon.
+ [d3.polygonCentroid(polygon) ](https://github.com/d3/d3-polygon#polygonCentroid) - Takes an array of points forming a polygon and returns back the coordinates of the polygon's centroid in an array.  The centroid is an ideal spot for a label.

In Figure 6, we display the area and length of the polygon. We also draw a blue circle at the centroid of the polygon and display its coordinates.

```
<script>
var points = [
    [50, 50],
    [50, 150],
    [150, 150],
    [150, 50],
    [100, 100],
    [125, 125]
];
var hull = d3.polygonHull(points);
var selection = d3.select("#demo5");

var line = d3.line()
    .x(d => d[0])
    .y(d => d[1])
    .curve(d3.curveLinearClosed);

selection.append("path")
    .attr("d", line(hull))
    .attr("stroke", "black")
    .attr("fill", "red");
    
selection.selectAll()
    .data(points)
    .join("circle")
    .attr("cx", (d) => d[0])
    .attr("cy", (d) => d[1])
    .attr("r", 5);

selection.append("text")
    .attr("x", 210)
    .attr("y", 25)
    .text("Area: " + d3.polygonArea(hull) + " sq pixels");
    
selection.append("text")
    .attr("x", 210)
    .attr("y", 50)
    .text("Length: " + Math.round(d3.polygonLength(hull)));
    
var centroid = d3.polygonCentroid(hull);

selection.append("circle")
    .attr("cx", centroid[0])
    .attr("cy", centroid[1])
    .attr("r", 5)
    .attr("fill", "blue");
    
selection.append("text")
    .attr("x", 210)
    .attr("y", 75)
    .text("Centroid: [" + Math.round(centroid[0]) + " , " + Math.round(centroid[1]) + "]");

</script>

<svg id="demo5" width = 400 height=200></svg>
```
<figure class="sandbox"><figcaption>Figure 6. A polygon with a blue circle at the centroid and statistics about the polygon.</figcaption></figure>

