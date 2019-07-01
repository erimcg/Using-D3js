{{meta {docid: polygons}}}

<script src="https://d3js.org/d3.v5.min.js"></script>

<style>
    svg { background-color: white; display: inline-block;}
    .sandbox-output { text-align: center;}
</style>

<script>
//Put any global scripts here
</script>

# Polygons

In this section we will be discussing d3 polygons. 
Polygons are used on their own.
In this section we will utilize [d3.line()](./05_03_lines.html).

## Polygons

In all the other shape sections we have been using points to draw lines or paths to represent our data. 
However, in polygons we do not draw lines between all of our points, instead we use polygons to draw a line *around the perimeter of the points*.

Unlike many other shapes, there is no `d3.polygon` generator function. Instead a "polygon" is an array that contains the perimeter points organized counterclockwise around (0,0). 
To get a perimeter array we can pass `d3.polygonHull` an array of many points and it will return a perimeter array. 
This perimeter array can also be referred to being the polygon itself, the outline, or the hull.

As we discussed, in order to create our polygons we need to pass `d3.polygonHull` an array of points. Unlike most other shapes, we cannot define our `x` and `y` positions within a larger data set. 
This means that whatever array we pass in *must* be in a form of: <br> `[[x1, y1], [x2, y2], [x3, y3]...]`.

These are the points we will be using:
<pre>
var points = [
    [50,50],[50,40],[50,160],[160,50],[80,75],
    [60,30],[40,120],[120,120],[140,175],[85,90],
    [100,80],[85,110],[75,60],[150,150],[140,130]
];
</pre>

Now that we have all our points, we can pass this array into `d3.polygonHull()` to get our perimeter array or hull: 

+ [d3.polygonHull(points)](https://github.com/d3/d3-polygon#polygonHull) - Takes an array of points and returns the perimeter/outline or "hull" ordered counterclockwise around (0,0).

<pre>
var hull = d3.polygonHull(points);
</pre>

Since there is no `d3.polygon` generator function to pass into the `d` attribute of a `path`, if we want to visually display our polygon we have to use [`d3.line()`](./05_03_lines.html):
<pre>
var line = d3.line()
    .x(d => d[0])
    .y(d => d[1])
    .curve(d3.curveLinearClosed);
</pre>

Now we can append a `path` to our `svg` and call `line(hull)` on its `d` attribute.
<pre>
d3.select("#svg")
    .append("path")
    .attr("d", line(hull))
    .attr("stroke", "black")
    .attr("fill", "red");
</pre>

```
<script>
var points = [
    [30,50],[100,40],[50,160],[160,50],[100,175],
    [60,30],[40,120],[120,120],[140,175],[80,150],
    [120,80],[85,100],[75,60],[150,150],[140,130]
];
var hull = d3.polygonHull(points);

var line = d3.line()
    .x(d => d[0])
    .y(d => d[1])
    .curve(d3.curveLinearClosed);

d3.select("#demoPolygonLine") //adds the hull to the SVG
	.append("path")
    .attr("d", line(hull))
    .attr("stroke", "black")
    .attr("fill", "red");
    
d3.select("#demoPolygonLine") // adds all the nodes to the SVG
	.selectAll()
    .data(points)
    .join("circle")
    .attr("cx", (d) => d[0])
    .attr("cy", (d) => d[1])
    .attr("r", 2);
</script>

<svg id="demoPolygonLine" width=200 height=200></svg>
```

## Additional Methods

Polygons have additional utility methods that other shapes do not:

+ [d3.polygonArea(polygon)](https://github.com/d3/d3-polygon#polygonArea) - Takes a polygon hull array and returns back the array of the polygon.
+ [d3.polygonLength(polygon)](https://github.com/d3/d3-polygon#polygonLength) - Takes a polygon hull array and returns the perimeter of the polygon.

+ [d3.polygonCentroid(polygon) ](https://github.com/d3/d3-polygon#polygonCentroid) - Takes a polygon hull array and returns back the coordinates of the polygons centroid as an array. 
+ [d3.polygonContains(polygon, point)](https://github.com/d3/d3-polygon#polygonContains) - Takes a polygon hull array and a point and returns true or false in the point is inside the polygon.


```
<script>
var points = [
    [20,50],[100,37.9],[50,160],[160,50],[100,175],
    [60,30],[40,120],[120,120],[140,175],[80,150],
    [120,80],[85,100],[75,60],[150,150],[140,130]
];
var hull = d3.polygonHull(points);
var selection = d3.select("#demoMethods");

var line = d3.line()
    .x(d => d[0])
    .y(d => d[1])
    .curve(d3.curveLinearClosed);

selection //adds the hull to the SVG
	.append("path")
    .attr("d", line(hull))
    .attr("stroke", "black")
    .attr("fill", "red");
    
selection // adds all the nodes to the SVG
	.selectAll()
    .data(points)
    .join("circle")
    .attr("cx", (d) => d[0])
    .attr("cy", (d) => d[1])
    .attr("r", 2);

selection.append("text")
    .attr("x", 210)
    .attr("y", 25)
    .text("Area: " + d3.polygonArea(hull) + " sq pixels");

var centroid = d3.polygonCentroid(hull);
selection.append("circle")
    .attr("cx", centroid[0])
    .attr("cy", centroid[1])
    .attr("r", 7.5)
    .attr("fill", "blue");
selection.append("text")
    .attr("x", 210)
    .attr("y", 50)
    .text("Centroid: [" + Math.round(centroid[0]) + " , " + Math.round(centroid[1]) + "]");

var point1 = [120,150];
var point2 = [30, 150];
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
    .attr("y", (d, i) => 75 + 25*i)
    .text((d) => "Contains [" + d[0] + " , " + d[1] + "]: " + d3.polygonContains(hull,d));

selection.append("text")
    .attr("x", 210)
    .attr("y", 125)
    .text("Length: " + Math.round(d3.polygonLength(hull)));
</script>

<svg id="demoMethods" width = 400 height=200></svg>
```