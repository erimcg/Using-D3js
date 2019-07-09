{{meta {docid: polygons}}}

<script src="https://d3js.org/d3.v5.min.js"></script>

<style>
    svg { background-color: white; display: inline-block;}
    .sandbox-output { text-align: center;}
</style>

# Polygons

In this section we will be discussing D3.js polygons.

A "polygon" is an array of points containing `x` and `y` positions in the form: `[[x0, y0], [x1, y1], [x2, y2], ..., [xn, yn]]` that are ordered counter-clockwise around the centroid. 
These positions represent the *perimeter* of the shape (also known as the *hull* or *outline*), and we will draw lines in the order of the positions (0 => 1 => 2 => ... => n).

Let's use the following data set:
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

This data contains six points and when we graph them, we will notice they contain more points than the outline of the whole shape (a square). In cases like this where we do not have the outline, we can use the function `d3.polygonHull(points)` to get a new [convex hull](https://en.wikipedia.org/wiki/Convex_hull) array of the points provided. This hull array is our outline and in this situation will only contain the corner points.
  
<pre>
var hull = d3.polygonHull(points);
</pre>

+ [d3.polygonHull(points)](https://github.com/d3/d3-polygon#polygonHull) - Takes an array of points and returns the perimeter, outline, or "hull" ordered counterclockwise around the origin of the shape.

Now that we have the hull we can use a `line` generator to draw our polygon. The curve will be set to `d3.curveLinearClosed` so that the ending point comes back to the starting point, closing the polygon.
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
    
    d3.select("#demoExamples")
        .select("#gPoints")
        .selectAll()
        .data(points)
        .join("circle")
        .attr("r", 5)
        .attr("cx", (d) => d[0])
        .attr("cy", (d) => d[1]);
        
    var line = d3.line()
        .curve(d3.curveLinearClosed);
        
    d3.select("#demoExamples")
        .select("#gNotPoly")
        .append("path")
        .attr("d", line(points))
        .attr("fill", "red")
        .attr("stroke", "black");
        
    d3.select("#demoExamples")
       .select("#gNotPoly")
       .selectAll()
       .data(points)
       .join("circle")
       .attr("r", 5)
       .attr("cx", (d) => d[0])
       .attr("cy", (d) => d[1]);
       
    var hull = d3.polygonHull(points);   
    
    d3.select("#demoExamples")
        .select("#gPoly")
        .append("path")
        .attr("d", line(hull))
        .attr("fill", "red")
        .attr("stroke", "black");
        
    d3.select("#demoExamples")
       .select("#gPoly")
       .selectAll()
       .data(points)
       .join("circle")
       .attr("r", 5)
       .attr("cx", (d) => d[0])
       .attr("cy", (d) => d[1]);
</script>
<svg id="demoExamples" width=600px height=200px>
    <g id="gPoints"></g>
    <g id="gNotPoly" transform="translate(200,0)"></g>
   	<g id="gPoly" transform="translate(400,0)"></g>
</svg>
```
<figure class="sandbox"><figcaption>Figure 1. Points plotted (left), with lines in order of the data (center), and with polygon hull lines (right). </figcaption></figure>

## Mapping an array from an object

Polygons have no generator function and in turn no accessor functions to set `x` and `y`. Because of this, when we use `d3.polygonHull` to make a new polygon we must pass in an array in the form `[[x0, y0], [x1, y1], [x2, y2], ..., [xn, yn]]`. However, many times we will instead have an array of objects, which are not compatiable with `d3.polygonHull` as they are.

Figure 2 will use the following array of objects:
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

To adapt to this restriction on `d3.polygonHull`, we can use a map function on our array of objects to generate a compatible array of points. We can also use a scale inside of this map function if we need one. 

In Figure 2 we convert `data` into an array of points that `d3.polygonHull` can use. In this conversion we also pass the `x` and `y` values into their respective scales to get their SVG values.

<pre>
var xScale = d3.scaleLinear().domain([0,5]).range([25,175]);
var yScale = d3.scaleLinear().domain([0,5]).range([175,25]);

var points = data.map((d) => [xScale(d.x), yScale(d.y)] );

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
        
    var selection = d3.select("#demoMap");
    
    selection
        .append("path")
        .attr("d", line(hull))
        .attr("fill", "red")
        .attr("stroke", "black");
        
    selection
        .selectAll()
        .data(points)
        .join("circle")
        .attr("cx", (d) => d[0])
        .attr("cy", (d) => d[1])
        .attr("r", 5)
        .attr("fill", "black");
</script>
<svg id="demoMap" width=200 height=200></svg>
```
<figure class="sandbox"><figcaption>Figure 2. A polygon where the hull was generated from an array of objects using Array.map.</figcaption></figure>

## Additional Methods

It may be useful to know if a specific point is within a polygon, for this case D3 supplies us with the `d3.polygonContains` method.

+ [d3.polygonContains(polygon, point)](https://github.com/d3/d3-polygon#polygonContains) - Takes a polygon hull array and a point and returns true or false in the point is inside the polygon. 

In Figure 3, we draw two circles and use `de.polygonContains` to check to see if the circles are inside of the polygon.

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
var selection = d3.select("#demoContains");

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

<svg id="demoContains" width=400 height=200></svg> 
```
<figure class="sandbox"><figcaption>Figure 3. A polygon with two circles where d3.polygonContains is called (left), and d3.polygonContains results shown (right). </figcaption></figure>

D3 also supplies us with additional statistic methods

+ [d3.polygonArea(polygon)](https://github.com/d3/d3-polygon#polygonArea) - Takes a polygon hull array and returns back the array of the polygon.
+ [d3.polygonLength(polygon)](https://github.com/d3/d3-polygon#polygonLength) - Takes a polygon hull array and returns the perimeter of the polygon.
+ [d3.polygonCentroid(polygon) ](https://github.com/d3/d3-polygon#polygonCentroid) - Takes a polygon hull array and returns back the coordinates of the polygons centroid as an array. The centroid is an ideal spot for a label.

In Figure 4, we display the area and length of our polygon. We also draw the centroid onto the polygon as a blue circle and display its positions.

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
    .attr("r", 7.5)
    .attr("fill", "blue");
selection.append("text")
    .attr("x", 210)
    .attr("y", 75)
    .text("Centroid: [" + Math.round(centroid[0]) + " , " + Math.round(centroid[1]) + "]");

</script>

<svg id="demoMethods" width = 400 height=200></svg>
```
<figure class="sandbox"><figcaption>Figure 4. A polygon with a circle at the centroid (left) and statistics on the polygon shown (right).</figcaption></figure>

