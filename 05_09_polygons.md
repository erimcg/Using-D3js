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

## Polygons

In all the other shape sections we have been using points to draw lines to represent our data. 
However, in polygons we do not draw lines between all of our points, instead we use polygons to draw a line *around the perimeter of all the points*.

In order to create our polygons we need to pass `d3.polygonHull` an array of points. Unlike most other shapes, we cannot define our `x` and `y` positions within a larger data set. 
This means that whatever array we pass in *must* be in a form of: `[[x1, y1], [x2, y2], [x3, y3]...]`

These are the points we will be using:
<pre>
var points = [
    [50,50],[50,40],[50,160],[160,50],[80,75],
    [60,30],[40,120],[120,120],[140,175],[85,90],
    [100,80],[85,110],[75,60],[150,150],[140,130]
];
</pre>

`d3.polygonHull` can take this array of points and it will return another array that contains the outline of the array passed in. 
The new outline array that `d3.polygonHull` returns has its points ordered counter-clockwise around the origin point {0,0}.

+ [d3.polygonHull(points)](https://github.com/d3/d3-polygon#polygonHull)

<pre>
var hull = d3.polygonHull(points);
</pre>

There is no `d3.polygon` generator function, this means that if we want to visually display our polygon we have to generate the `d` attribute of our path ourselves. 
Since we should be able to draw to canvasses or SVGs, we will be using this function to draw the hull:
``` {cm: visible}
<script>
function drawHull(context, hull){
    context.moveTo(hull[0][0], hull[0][1]);
    for(var i = 1; i < hull.length; ++i){
        context.lineTo(hull[i][0], hull[i][1]);
    }
    context.fillStyle = "red";
    context.strokeStyle = "black";
    context.closePath();
    return context;
}
</script>
```

Now we just append a path to our SVG and call `drawHull` on its `d` attribute.

<pre>
d3.select("#demoPolygon")
    .append("path")
    .attr("d", drawHull(d3.path(), hull))
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

context = d3.select("#demoPolygonC").node().getContext("2d");
drawHull(context, hull).fill(); // sets the context and fills it
context.stroke(); // adds the stroke outline to the canvas

d3.select("#demoPolygonSVG") //adds the hull to the SVG
    .append("path")
    .attr("d", drawHull(d3.path(), hull))
    .attr("stroke", "black")
    .attr("fill", "red");
    
d3.select("#demoPolygonSVG") // adds all the nodes to the SVG
	.selectAll()
    .data(points)
    .join("circle")
    .attr("cx", (d) => d[0])
    .attr("cy", (d) => d[1])
    .attr("r", 2);
</script>

<canvas id="demoPolygonC" width=200 height=200></canvas>
<svg id="demoPolygonSVG" width=200 height=200></svg>
```

## Additional Methods

Polygons have additional utility methods that other shapes do not.

+ [d3.polygonArea(polygon)](https://github.com/d3/d3-polygon#polygonArea) - Takes a polygon hull array and returns back the array of the polygon.
+ [d3.polygonCentroid(polygon) ](https://github.com/d3/d3-polygon#polygonCentroid) - Takes a polygon hull array and returns back the coordinates of the polygons centroid. 

+ [d3.polygonContains(polygon, point)](https://github.com/d3/d3-polygon#polygonContains) - Takes a polygon hull array and a point and returns true or false in the point is inside the polygon.
+ [d3.polygonLength(polygon)](https://github.com/d3/d3-polygon#polygonLength) - Takes a polygon hull array and returns the perimeter of the polygon.

```
<script>
var points = [
    [20,50],[100,37.9],[50,160],[160,50],[100,175],
    [60,30],[40,120],[120,120],[140,175],[80,150],
    [120,80],[85,100],[75,60],[150,150],[140,130]
];
var hull = d3.polygonHull(points);
var selection = d3.select("#demoMethods");

selection //adds the hull to the SVG
    .append("path")
    .attr("d", drawHull(d3.path(), hull))
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