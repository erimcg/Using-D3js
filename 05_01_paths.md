{{meta {docid: paths}}}

<script src="https://d3js.org/d3.v5.min.js"></script>

<script>
function addArcToOutline(point1, point2, point3, radius, selection){
	//p3 => p2 = a
	//p2 => p1 = b
	//p1 => p3 = c
    
    //Finding lengths of sides
    var a = Math.sqrt(Math.pow(point3[0] - point2[0],2) + Math.pow(point3[1] - point2[1],2) );
    var b = Math.sqrt(Math.pow(point2[0] - point1[0],2) + Math.pow(point2[1] - point1[1],2) );
    var c = Math.sqrt(Math.pow(point3[0] - point1[0],2) + Math.pow(point3[1] - point1[1],2) );
    
    //The angle C, or at p2
    var theta = Math.acos((a*a + b*b - c*c) / (2*a*b));
    
    //Finding point for intercect line from C
    var thetaB = Math.acos((a*a + c*c - b*b) / (2*a*c));
    var theta2 = 3.14 - (theta/2) - thetaB;
    var theta3 = 3.14 - theta2;
    var yM = (Math.sin(theta/2) * a);
    var xM = (Math.tan(theta3)* (1/yM));
    var m = [point3[0] + xM, point3[1] + yM];
    
    //distance from p2 where center of circle lies
    var disC = radius / Math.sin(theta/2);
    
	//distance from p2 to m
    var disA = Math.sqrt(Math.pow(m[0] - point2[0],2) + Math.pow(m[1] - point2[1],2) );
    
	//Position of circle
    var pos = [(point2[0] - (disC*(point2[0]-m[0]))/disA),(point2[1] - (disC*(point2[1]-m[1]))/disA)];
    selection.append("circle")
    	.attr("cx", pos[0])
        .attr("cy", pos[1])
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", "2px")
        .attr("r", radius);
     
    //Adds in reference lines
    selection.append("line")
        .attr("x1", point2[0])
        .attr("x2", point3[0])
        .attr("y1", point2[1])
        .attr("y2", point3[1])
        .attr("stroke", "black")
        .attr("stroke-width", "2px");
    selection.append("line")
        .attr("x1", point2[0])
        .attr("x2", point1[0])
        .attr("y1", point2[1])
        .attr("y2", point1[1])
        .attr("stroke", "black")
        .attr("stroke-width", "2px");
        
    let points = [point1, point2, point3];
    //Adds in reference points
    selection.selectAll()
        .data(points)
        .join("circle")
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r", 5);
}

function addArcOutline(center, radius, selection){
    //Adds in the main circle
    selection.append("circle")
        .attr("cx", center[0])
        .attr("cy", center[1])
        .attr("r", radius)
        .attr("stroke", "black")
        .attr("stroke-width", "2px")
        .attr("fill", "none");  
    
    var pointLabels = ["3π/2", "0", "π/2", "π"];
    selection.selectAll()
        .data(pointLabels)
        .join("text")
        .attr("text-anchor", "middle")
        .attr("font-size", "15px")
        .attr("x", (d, i) => d3.pointRadial( i * Math.PI / 2, radius + 15)[0])
        .attr("y", (d, i) => d3.pointRadial( i * Math.PI / 2, radius + 15)[1])
        .text( (d) => d)
        .attr("transform", "translate(" + center[0] + "," + center[1] + ")" );
}
function addPathOutline(points, selection){
	selection.selectAll()
    	.data(points)
        .join("circle")
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r", (d,i) => i == 0 || i == 3 ? 6 : 4)
        .attr("fill", (d,i) => i == 0 || i == 3 ? "blue" : "black");
        
    
    selection.selectAll()
    	.data(points.slice(0,points.length-1))
        .join("line")
        .attr("x1", (d) => d[0])
        .attr("x2", (d, i) => i < points.length-1 ? points[i+1][0] : null)
        .attr("y1", (d) => d[1])
        .attr("y2", (d, i) => i < points.length-1 ? points[i+1][1] : null)
    	.attr("stroke", (d,i) => i === 2 ? "blue" :"black")
        .attr("stroke-width", "3px")
        .attr("stroke-dasharray", (d,i) => i === 2 ? [3] : [])
        .attr("marker-end", (d,i) => i === 2 ? "url(#markerArrowBlue)": "url(#markerArrow)");
        
	selection.append("line")
    	.attr("x1", points[5][0])
        .attr("x2", points[3][0])
        .attr("y1", points[5][1])
        .attr("y2", points[3][1])
        .attr("stroke", "green")
        .attr("stroke-width", "3px")
        .attr("marker-end", "url(#markerArrowGreen)");
    
    selection.selectAll()
    	.data(["moveTo","lineTo","closePath"])
    	.join("text")
    	.text((d) => d)
        .attr("x", 20)
        .attr("y", (d,i) => 150 + i*20);
    selection.selectAll()
    	.data(["blue","black","green"])
       	.join("circle")
        .attr("cx", 10)
        .attr("cy", (d,i) => 145 + i*20)
        .attr("r", 7.5)
        .attr("fill", (d) => d);
}

function addCurveOutline(qControl, bControl1, bControl2, selection){
    var qData = [[10,10], qControl, [190,10]];
    var bData = [[10,190], bControl1, bControl2, [190,120]];
    
    var data = [ [qData[0],qData[1]], [qData[1],qData[2]], [bData[0],bData[1]], [bData[2],bData[3]] ];
    
    selection.selectAll()
        .data(data)
        .join("line")
        .attr("x1", (d) => d[0][0])
        .attr("x2", (d) => d[1][0])
        .attr("y1", (d) => d[0][1])
        .attr("y2", (d) => d[1][1])
        .attr("stroke-dasharray", 4)
        .attr("stroke", "red");
        
    selection.selectAll()
        .data(qData.concat(bData))
        .join("circle")
        .attr("cx", (d) => d[0])
        .attr("cy", (d) => d[1])
        .attr("r", 5)
        .attr("fill", "red");
}
function addRectOutline(origin, width, height, selection){
	selection.append("circle")
    	.attr("cx", origin[0])
        .attr("cy", origin[1])
        .attr("r", 5)
        .attr("fill", "black");
    selection.append("text")
    	.attr("x", origin[0])
        .attr("y", origin[1]-10)
        .attr("text-anchor", "middle")
        .text("Origin");
    selection.append("line")
    	.attr("x1", origin[0] + width*3/4)
        .attr("x2", origin[0] + width*3/4)
        .attr("y1", origin[1])
        .attr("y2", origin[1] + height)
        .attr("stroke", "black")
        .attr("stroke-width", "3px")
        .attr("marker-start", "url(#markerArrowStart)")
        .attr("marker-end", "url(#markerArrowEnd)");
    selection.append("line")
    	.attr("x1", origin[0])
        .attr("x2", origin[0] + width)
        .attr("y1", origin[1] + height*3/4)
        .attr("y2", origin[1] + height*3/4)
        .attr("stroke", "black")
        .attr("stroke-width", "3px")
        .attr("marker-start", "url(#markerArrowStart)")
        .attr("marker-end", "url(#markerArrowEnd)");
    selection.append("text")
    	.attr("x", origin[0] + width*3/4 - 10)
        .attr("y", origin[1] + 25)
        .text("h")
        .attr("text-anchor", "middle");
    selection.append("text")
    	.attr("x", origin[0] + 25)
        .attr("y", origin[1] + height*3/4 - 5)
        .text("w")
        .attr("text-anchor", "middle");
}
</script>

# Paths

In this section we discuss [`d3.path()`](https://github.com/d3/d3-path), a utility for creating strings that can be used to define `paths` in `svgs`.

`D3.path` can be used by itself to define the value of the `d` (path definition) attribute for a `path` element in an `svg`, as we show in this section, but is also used by all of the other shapes in this chapter to transform various input into path defininitions.

## SVG Paths

SVG's can contain [various elements](https://developer.mozilla.org/en-US/docs/Web/SVG/Element) to help create a visualization.  Of these elements, `lines` and `rects` are useful in creating some common data visualization patterns such as line graphs and bar graphs.  When requiring complex shapes we rely on the `path` element.

`Paths` can be appended to `svgs` like `lines` and `rects` and have similar attributes, such as `stroke` and `fill`.
`Paths`, however, have a `d` attribute that defines its shape and position. 

The `d` attribute contains a string that specifies *commands* and numbers which define command parameters. Multiple commands can be chained together in a single string and are read from left to right.

For example, to create a path that starts at the point *(25,25)*, draws a line to *(75,25)*, then draws a line to *(75,75)* and finally closes the path we can use the following path definition.

<pre>
"M 25 25 L 75 25 L 75 75 Z"
</pre>

```
<script>
d3.select("#demoSvgPath")
  .append("path")
  .attr("d", "M 25 25 L 75 25 L 75 75 Z")
  .attr("stroke", "black")
  .attr("fill", "red");
</script>
<svg id="demoSvgPath" width="100" height="100"></svg>
```
<figure class="sandbox"><figcaption>Figure 1. Triangle created by manually specifying the path description.</figcaption></figure>

The Mozilla documentation for all of the available SVG path commands can be found [here](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#Path_commands).

## D3.path

The [`d3.path()`](https://github.com/d3/d3-path#d3-path)  method is convenient for defining paths, allowing us to avoid manually writing strings for the `d` attribute of a `path`.  The `d3.path` method returns a path *serializer* that implements the methods in the [CanvasPathMethods](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D#Paths) interface.  Below we provide links to the D3.js documentation for each method along with links to their equivalent context method and their equivalent SVG command.  In the sections below we describe each method and provide examples of their usage.

<table style="font-size: small; border: 0; margin: 0; padding: 0;">
<tr>
<td>Path Method</td>  
<td>Canvas Method</td> 
<td>SVG Command</td> 
</tr>
<tr>
<td><a href="https://github.com/d3/d3-path#path_moveTo">moveTo(x, y)</a></td>
<td><a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/moveTo">moveTo(x, y)</a></td>
<td><a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#MoveTo_path_commands">M</a></td>
</tr>
<tr>
<td><a href="https://github.com/d3/d3-path/blob/v1.0.7/README.md#path_lineTo">lineTo(x, y)</a></td>
<td><a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineTo">lineTo(x, y)</a></td>
<td><a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#LineTo_path_commands">L</a></td>
</tr>
<tr>
<td><a href="https://github.com/d3/d3-path#path_closePath">closePath()</a></td>
<td><a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/closePath">closePath()</a></td>
<td><a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#ClosePath">Z, z</a></td>
</tr>
<tr>
<td><a href="https://github.com/d3/d3-path/blob/v1.0.7/README.md#path_quadraticCurveTo">quadraticCurveTo(cpx, cpy, x, y)</a></td>
<td><a href="https://www.w3.org/TR/2dcontext/#dom-context-2d-quadraticcurveto">quadraticCurveTo(cpx, cpy, x, y)</a></td>
<td><a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#Quadratic_Bézier_Curve">Q</a></td>
</tr>
<tr>
<td><a href="https://github.com/d3/d3-path/blob/v1.0.7/README.md#path_bezierCurveTo">bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y)</a></td>
<td><a href="https://www.w3.org/TR/2dcontext/#dom-context-2d-beziercurveto">bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y)</a></td>
<td><a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#Cubic_Bézier_Curve">C</a></td>
</tr>
<tr>
<td><a href="https://github.com/d3/d3-path/blob/v1.0.7/README.md#path_arcTo">arcTo(x1, y1, x2, y2, radius)</a></td>
<td><a href="https://www.w3.org/TR/2dcontext/#dom-context-2d-arcto">arcTo(x1, y1, x2, y2, radius)</a></td>
<td><a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#Elliptical_Arc_Curve">A</a></td>
</tr>
<tr>
<td><a href="https://github.com/d3/d3-path/blob/v1.0.7/README.md#path_arc">arc(x, y, radius, start, end[, anticlockwise])</a></td>
<td><a href="https://www.w3.org/TR/2dcontext/#dom-context-2d-arc">arc(x, y, radius, start, end, anticlockwise)</a></td>
<td><a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#Elliptical_Arc_Curve">A</a></td>
</tr>
<tr>
<td><a href="https://github.com/d3/d3-path/blob/v1.0.7/README.md#path_rect">rect(x, y, w, h)</a></td>
<td><a href="https://www.w3.org/TR/2dcontext/#dom-context-2d-rect">rect(x, y, w, h)</a></td>
<td><a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#LineTo_path_commands"></a></td>
</tr>
<tr>
<td><a href="https://github.com/d3/d3-path/blob/v1.0.7/README.md#path_toString">toString()</a></td>
<td><a href=""></a></td>
<td><a href=""></a></td>
</tr>
</table>

### Setting an SVG's Path

In order to create a triangle, similar to the one above, using the methods describe above, we first have to create a path serializer by calling `d3.path`: 

<pre>
var path = d3.path();
</pre>

We can then call the path methods on the seriarlizer object.

<pre>
path.moveTo(25,25);
path.lineTo(75,25);
path.lineTo(75,75);
path.closePath();
</pre>

We then retrive the SVG path definition string using `path.toString`.  This string is used as the value for an SVG `path's` `d` attribute.  As you can see from the console output in the example, the path is similar to the path used in the example above.  The only difference is the delimeter used between the command parameters.  When defining the path manually we used spaces, whereas `path.toString` uses commas.

```
<script>
var path = d3.path()
path.moveTo(25,25)
path.lineTo(75,25)
path.lineTo(75,75)
path.closePath();
  
console.log(path.toString());
    
d3.select("#demoPath0")
  .append("path")
  .attr("d", path.toString())
  .attr("stroke", "black")
  .attr("fill", "red");
</script>

<svg id="demoPath0" width="100" height="100"></svg>
```
<figure class="sandbox"><figcaption>Figure 2. Triangle created using d3.path.</figcaption></figure>

When setting the `d` attribute for a `path` element, we can also simply pass the path serializer as the second argument of `selection.attr` as shown in the example below.

<pre>
d3.select("#demoPath1")
  .append("path")
  .attr("d", path)
  .attr("stroke", "black")
  .attr("fill", "red");
</pre>


## Path.moveTo, Path.LineTo, and Path.close

In the example below, we use an array to define a set of six points and use a single `d3.path` serializer along with `path.moveTo`, `path.lineTo`, and `path.closePath` to create two separate triangles (left image).

+ [path.moveTo(x, y)](https://github.com/d3/d3-path#path_moveTo) - Ends the current subpath and moves to the given point (x,y) without drawing a line.
+ [path.lineTo(x, y)](https://github.com/d3/d3-path/blob/v1.0.7/README.md#path_lineTo) - Draws a straight line from the current point to the given point (x,y).
+ [path.closePath()](https://github.com/d3/d3-path#path_closePath) - Draws a line to the starting point of the current subpath, then ends the subpath.

We are able to create two separately filled shapes using a single path serializer due to the serializer's ability to maintain subpaths withing a path.  A subpath is a portion of a path that has a beginning and an end.  When we call `path.moveTo` or `path.closePath` we both end the current subpath and begin a new subpath.

As can be seen, the top triangle is not closed and the bottom triangle is closed.

```
<script>
points = [[50,50],[150,125],[200,25],[200,150],[100,250],[250,275]];

var path = d3.path();
	path.moveTo(points[0][0], points[0][1]); //(50,50)
    path.lineTo(points[1][0], points[1][1]); //(150,125)
    path.lineTo(points[2][0], points[2][1]); //(200,25)
    
    path.moveTo(points[3][0], points[3][1]); //(200,150)
    path.lineTo(points[4][0], points[4][1]); //(100,250)
    path.lineTo(points[5][0], points[5][1]); //(250,275)
    path.closePath();
    
d3.select("#demoPath2")
	.append("path")
    .attr("d", path)
    .attr("stroke", "black")
    .attr("fill", "red");
    
d3.select("#demoPath2Outline")
	.append("path")
    .attr("d", path)
    .attr("stroke", "black")
    .attr("fill", "red");
    
addPathOutline(points, d3.select("#demoPath2Outline"));
</script>

<svg id="demoPath2" width= "300" height="300"></svg>
<svg id="demoPath2Outline" width= "300" height="300">
</svg>
```
<figure class="sandbox"><figcaption>Figure 3. Pairs of triangles created using path.moveTo, path.lineTo, and path.closePath.</figcaption></figure>

## Curves

Below we draw Bézier curves using `path.quadraticCurveTo` (top) and `path.bezierCurveTo` (bottom).  

+ [path.quadraticCurveTo(cpx, cpy, x, y)](https://github.com/d3/d3-path/blob/v1.0.7/README.md#path_quadraticCurveTo) - Draws a quadratic Bézier curve to (x,y) using the specified control point.
+ [path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y)](https://github.com/d3/d3-path/blob/v1.0.7/README.md#path_bezierCurveTo) - Draws a cubic Bézier curve to the specified point (x,y) using the specified control points.

The control points for the methods are depicted by the red dots that are positioned off of the curves.

```
<script>

// path.quadraticCurveTo example

var qCP = [25, 80];

var qPath = d3.path();
qPath.moveTo(10,10);
qPath.quadraticCurveTo(qCP[0],qCP[1], 190, 10);

d3.select("#demoCurve")
  .append("path")
  .attr("d", qPath)
  .attr("stroke", "black")
  .attr("fill", "none");

// path.bezierCurveTo example

var bCP1 = [25, 120];
var bCP2 = [175, 190];

var bPath = d3.path();
bPath.moveTo(10,190);
bPath.bezierCurveTo(bCP1[0],bCP1[1], bCP2[0], bCP2[1], 190, 120);

d3.select("#demoCurveOutline")
  .append("path")
  .attr("d", qPath)
  .attr("stroke", "black")
  .attr("fill", "none");
    
// Draw control points and lines to control points

d3.select("#demoCurve")
  .append("path")
  .attr("d", bPath)
  .attr("stroke", "black")
  .attr("fill", "none");

d3.select("#demoCurveOutline")
  .append("path")
  .attr("d", bPath)
  .attr("stroke", "black")
  .attr("fill", "none");
    
addCurveOutline(qCP, bCP1, bCP2, d3.select("#demoCurveOutline"));

</script>

<svg id="demoCurve" width="200" height="200"></svg>
<svg id="demoCurveOutline" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 4. Curves created using path.quadraticCurveTo (top) and path.bezierCurveTo (bottom).</figcaption></figure>

## Arcs

The example below uses `path.arc` to draw the lower right quadrant of a circle.  

+ [path.arc(x, y, radius, startAngle, endAngle[, anticlockwise])](https://github.com/d3/d3-path/blob/v1.0.7/README.md#path_arc) - Draws a line from the current point to the start of an arc that is drawn about a circle centered at (x,y) whose radius is specified by `radius`.  The arc wraps around the circle from the angle specified in `startAngle` to the angle specified in `endAngle`. By default the arc is drawn *clockwise*. To draw the arc counterclockwise, we pass `true` as the final argument.

```
<script>
var center = [100, 100];
var radius = 75;
var startAngle = 0;
var endAngle = Math.PI / 2;

var arcPath = d3.path();
	arcPath.moveTo(center[0], center[1]);
    arcPath.arc(center[0], center[1], radius, startAngle, endAngle)
    arcPath.closePath();
    
d3.select("#demoArc")
	.append("path")
    .attr("d", arcPath)
    .attr("stroke", "black")
    .attr("fill", "red");
    
d3.select("#demoArcOutline")
    .append("path")
    .attr("d", arcPath)
    .attr("stroke", "black")
    .attr("fill", "red");

addArcOutline(center, radius, d3.select("#demoArcOutline"));

</script>
<svg id="demoArc" width="200" height="200"></svg>
<svg id="demoArcOutline" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 5. Quadrant shape created using path.arc.</figcaption></figure>

Below we draw a shape using `path.arcTo`.

+ [path.arcTo(x1, y1, x2, y2, radius)](https://github.com/d3/d3-path/blob/v1.0.7/README.md#path_arcTo) - Draws a line from the current point, (x0,y0), to the start of an arc that is drawn about a circle.  The circle about which the arc is drawn is defined as the circle whose radius is specified by `radius` and has a point that is tangent to the line between (x0,y0) and (x1,y1) and has a point that is that is tangent to the line between (x1,y1) and (x2,y2).  The start and end of the arc are defined by the tangent points.

In our example, the point at the bottom right corner of the shape (160,190) is the current point from which the initial line and arc are drawn.  We then draw a line from the end of the arc to the point at (185,25), and close the path which renders a line from (185,25) to our starting point (160,190).

```
<script>
var points = [[160,190],[10,100],[185,25]];
var radius = 30;

var arcToPath = d3.path();
arcToPath.moveTo(points[0][0], points[0][1]);
arcToPath.arcTo(points[1][0], points[1][1], points[2][0], points[2][1], radius)
arcToPath.lineTo(points[2][0], points[2][1])
arcToPath.closePath();

d3.select("#demoArcTo")
  .append("path")
  .attr("d", arcToPath)
  .attr("stroke", "black")
  .attr("fill", "red");
    
d3.select("#demoArcToOutline")
  .append("path")
  .attr("d", arcToPath)
  .attr("stroke", "black")
  .attr("fill", "red");
    
addArcToOutline(points[0], points[1], points[2], radius, d3.select("#demoArcToOutline"));

</script>
<svg id="demoArcTo" width="200" height="200"></svg>
<svg id="demoArcToOutline" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 6. Demonstration of path.arcTo.</figcaption></figure>

## Rectangles

Below are examples of rectangles drawn using `path.rect`.

+ [path.rect(x, y, w, h)](https://github.com/d3/d3-path/blob/v1.0.7/README.md#path_rect) - Creates a closed subpath, with width `w`, height `h`, and its bottom left point at (x,y).

```
<script>
var origin = [25,25];
var width = 150;
var height = 150;

var path = d3.path();
    path.rect(origin[0], origin[1], width, height);

d3.select("#demoRect")
    .append("path")
    .attr("d", path)
    .attr("fill", "red")
    .attr("stroke", "black");

d3.select("#demoRectOutline")
    .append("path")
    .attr("d", path)
    .attr("fill", "red")
    .attr("stroke", "black");
    
addRectOutline(origin, width, height, d3.select("#demoRectOutline"));
</script>
<svg id="demoRect" width="200" height="200"></svg>
<svg id="demoRectOutline" width="200" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 7. Rectangles created using path.rect.</figcaption></figure>

## Canvases

Since the `d3.path` serializer has the same methods as in the CanvasPathMethods interface, then any function that only uses the methods in the CanvasPathMethods interface and that takes a canvas object as an argument, can be passed a path serializer.  

Below we render a triangle twice, using the method named `draw`.  We first pass `d3.path` to the `draw` method to draw a triangle in an SVG `path` element and then draw a triangle in a `canvas` element by passing the `canvas'` 2D context to the `draw` method.

``` {cm: visible}
<script>
function draw(context){
  context.fillStyle = "red";
  context.moveTo(25,25);
  context.lineTo(75,25);
  context.lineTo(75,75);
  context.closePath();
  return context;
}

d3.select("#demoFunctionSVG")
  .append("path")
  .attr("d", draw(d3.path()))
  .attr("stroke", "black")
  .attr("fill", "red");
    
var context = d3.select("#demoFunctionCanvas").node().getContext("2d");
draw(context).fill();
context.stroke();
</script>

<svg id="demoFunctionSVG" width=100 height=100></svg>
<canvas id="demoFunctionCanvas" width=100 height=100></canvas>
```
<figure class="sandbox" class="sandbox"><figcaption>Figure 8. Two triangles.  One drawn on an SVG and the other drawn on a canvas.</figcaption></figure>

<aside>
  
  ## In case you were wondering ...
  
  In Figure 3 we used the following `addPathOutline` function to add in an illustration showing the how the path was rendered.
  
  ```
  <script>
  function addPathOutline(points, selection){
    selection.selectAll()
      .data(points)
      .join("circle")
      .attr("cx", d => d[0])
      .attr("cy", d => d[1])
      .attr("r", (d,i) => i == 0 || i == 3 ? 6 : 4)
      .attr("fill", (d,i) => i == 0 || i == 3 ? "blue" : "black");
      
    selection.selectAll()
      .data(points.slice(0,points.length-1))
      .join("line")
      .attr("x1", (d) => d[0])
      .attr("x2", (d, i) => i < points.length-1 ? points[i+1][0] : null)
      .attr("y1", (d) => d[1])
      .attr("y2", (d, i) => i < points.length-1 ? points[i+1][1] : null)
      .attr("stroke", (d,i) => i === 2 ? "blue" :"black")
      .attr("stroke-width", "3px")
      .attr("stroke-dasharray", (d,i) => i === 2 ? [3] : [])
      .attr("marker-end", (d,i) => i === 2 ? "url(#markerArrowBlue)": "url(#markerArrow)");
      
    selection.append("line")
      .attr("x1", points[5][0])
      .attr("x2", points[3][0])
      .attr("y1", points[5][1])
      .attr("y2", points[3][1])
      .attr("stroke", "green")
      .attr("stroke-width", "3px")
      .attr("marker-end", "url(#markerArrowGreen)");
  
    selection.selectAll()
      .data(["moveTo","lineTo","closePath"])
      .join("text")
      .text((d) => d)
      .attr("x", 20)
      .attr("y", (d,i) => 150 + i*20);
    selection.selectAll()
      .data(["blue","black","green"])
      .join("circle")
      .attr("cx", 10)
      .attr("cy", (d,i) => 145 + i*20)
      .attr("r", 7.5)
      .attr("fill", (d) => d);
  }
  </script>
  <code>addPathOutline(points, selection)</code>
  <!--<svg width="0" height="0">
      <defs>
          <marker id="markerArrow" markerWidth="13" markerHeight="13" refX="6" refY="3"
              orient="auto">
              <path d="M1,1 L1,5.5 L5,3 L1,1" style="fill: #000000;" />
          </marker>
          <marker id="markerArrowGreen" markerWidth="13" markerHeight="13" refX="6" refY="3"
              orient="auto">
              <path d="M1,1 L1,5.5 L5,3 L1,1" style="fill: green;" />
          </marker>
          <marker id="markerArrowBlue" markerWidth="13" markerHeight="13" refX="6" refY="3"
              orient="auto">
              <path d="M1,1 L1,5.5 L5,3 L1,1" style="fill: blue;" />
          </marker>
      </defs>
  </svg>-->
  ```
  
  In Figure 4 we used the function `addCurveOutline()` to add guidelines for the control points.
  
  ```
  <script>
  function addCurveOutline(qControl, bControl1, bControl2, selection){
    var qData = [[10,10], qControl, [190,10]];
    var bData = [[10,190], bControl1, bControl2, [190,120]];
  
    var data = [ [qData[0],qData[1]], [qData[1],qData[2]], [bData[0],bData[1]], [bData[2],bData[3]] ];
  
    selection.selectAll()
      .data(data)
      .join("line")
      .attr("x1", (d) => d[0][0])
      .attr("x2", (d) => d[1][0])
      .attr("y1", (d) => d[0][1])
      .attr("y2", (d) => d[1][1])
      .attr("stroke-dasharray", 4)
      .attr("stroke", "red");
      
    selection.selectAll()
      .data(qData.concat(bData))
      .join("circle")
      .attr("cx", (d) => d[0])
      .attr("cy", (d) => d[1])
      .attr("r", 5)
      .attr("fill", "red");
  }
  </script>
  <code>addCurveOutline(qControl, bControl1, bControl2, selection)</code>
  ```
  
  In Figure 5 we used the function `addArcOutline()` to add a circle outline and angle text elements to show the angles.
  
  ```
  <script>
  function addArcOutline(center, radius, selection){
    //Adds in the main circle
    selection.append("circle")
      .attr("cx", center[0])
      .attr("cy", center[1])
      .attr("r", radius)
      .attr("stroke", "black")
      .attr("stroke-width", "2px")
      .attr("fill", "none");  
  
    var pointLabels = ["3π/2", "0", "π/2", "π"];
    selection.selectAll()
      .data(pointLabels)
      .join("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "15px")
      .attr("x", (d, i) => d3.pointRadial( i * Math.PI / 2, radius + 15)[0])
      .attr("y", (d, i) => d3.pointRadial( i * Math.PI / 2, radius + 15)[1])
      .text( (d) => d)
      .attr("transform", "translate(" + center[0] + "," + center[1] + ")" );
  }
  </script>
  <code>addArcOutline(center, radius, selection)</code>
  ```
  
  In Figure 6 we used the function `addArcToOutline()` to add in the circle and lines to help illustrate where and how arcTo behaves. 
  
  ```
  <script>
  function addArcToOutline(point1, point2, point3, radius, selection){
    //p3 => p2 = a
    //p2 => p1 = b
    //p1 => p3 = c
    
    //Finding lengths of sides
    var a = Math.sqrt(Math.pow(point3[0] - point2[0],2) + Math.pow(point3[1] - point2[1],2) );
    var b = Math.sqrt(Math.pow(point2[0] - point1[0],2) + Math.pow(point2[1] - point1[1],2) );
    var c = Math.sqrt(Math.pow(point3[0] - point1[0],2) + Math.pow(point3[1] - point1[1],2) );
    
    //The angle C, or at p2
    var theta = Math.acos((a*a + b*b - c*c) / (2*a*b));
    
    //Finding point for intercect line from C
    var thetaB = Math.acos((a*a + c*c - b*b) / (2*a*c));
    var theta2 = 3.14 - (theta/2) - thetaB;
    var theta3 = 3.14 - theta2;
    var yM = (Math.sin(theta/2) * a);
    var xM = (Math.tan(theta3)* (1/yM));
    var m = [point3[0] + xM, point3[1] + yM];
    
    //distance from p2 where center of circle lies
    var disC = radius / Math.sin(theta/2);
    
    //distance from p2 to m
    var disA = Math.sqrt(Math.pow(m[0] - point2[0],2) + Math.pow(m[1] - point2[1],2) );
    
    //Position of circle
    var pos = [(point2[0] - (disC*(point2[0]-m[0]))/disA),(point2[1] - (disC*(point2[1]-m[1]))/disA)];
    selection.append("circle")
      .attr("cx", pos[0])
      .attr("cy", pos[1])
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", "2px")
      .attr("r", radius);
   
    //Adds in reference lines
    selection.append("line")
      .attr("x1", point2[0])
      .attr("x2", point3[0])
      .attr("y1", point2[1])
      .attr("y2", point3[1])
      .attr("stroke", "black")
      .attr("stroke-width", "2px");
    selection.append("line")
      .attr("x1", point2[0])
      .attr("x2", point1[0])
      .attr("y1", point2[1])
      .attr("y2", point1[1])
      .attr("stroke", "black")
      .attr("stroke-width", "2px");
   
    let points = [point1, point2, point3];
    //Adds in reference points
    selection.selectAll()
      .data(points)
      .join("circle")
      .attr("cx", d => d[0])
      .attr("cy", d => d[1])
      .attr("r", 5);
  }
  </script>
  <code>addCircle(point1, point2, point3, radius, selection)</code>
  ```
  
  In Figure 7 we used the function `addRectOutline` to add the origin and width/height guides to help illustrate how the `rect` element is drawn.
  
  ```
  <script>
  function addRectOutline(origin, width, height, selection){
    selection.append("circle")
      .attr("cx", origin[0])
      .attr("cy", origin[1])
      .attr("r", 5)
      .attr("fill", "black");
    selection.append("text")
      .attr("x", origin[0])
      .attr("y", origin[1]-10)
      .attr("text-anchor", "middle")
      .text("Origin");
    selection.append("line")
      .attr("x1", origin[0] + width*3/4)
      .attr("x2", origin[0] + width*3/4)
      .attr("y1", origin[1])
      .attr("y2", origin[1] + height)
      .attr("stroke", "black")
      .attr("stroke-width", "3px")
      .attr("marker-start", "url(#markerArrowStart)")
      .attr("marker-end", "url(#markerArrowEnd)");
    selection.append("line")
      .attr("x1", origin[0])
      .attr("x2", origin[0] + width)
      .attr("y1", origin[1] + height*3/4)
      .attr("y2", origin[1] + height*3/4)
      .attr("stroke", "black")
      .attr("stroke-width", "3px")
      .attr("marker-start", "url(#markerArrowStart)")
      .attr("marker-end", "url(#markerArrowEnd)");
    selection.append("text")
      .attr("x", origin[0] + width*3/4 - 10)
      .attr("y", origin[1] + 25)
      .text("h")
      .attr("text-anchor", "middle");
    selection.append("text")
      .attr("x", origin[0] + 25)
      .attr("y", origin[1] + height*3/4 - 5)
      .text("w")
      .attr("text-anchor", "middle");
  }
  </script>
  <code>addRectOutline(origin, width, height, selection)</code>
  <!--<svg width=0 height=0>
      <defs>
          <marker id="markerArrowStart" markerWidth="13" markerHeight="13" refX="5" refY="3"
              orient="auto-start-reverse">
              <path d="M1,1 L1,5.5 L5,3 L1,1" style="fill: #000000;" />
          </marker>
          <marker id="markerArrowEnd" markerWidth="13" markerHeight="13" refX="5" refY="3"
              orient="auto">
              <path d="M1,1 L1,5.5 L5,3 L1,1" style="fill: #000000;" />
          </marker>
      </defs>
  </svg>-->
  ```
</aside>

<svg width="0" height="0">
  <defs>
    <marker id="markerArrow" markerWidth="13" markerHeight="13" refX="6" refY="3" orient="auto">
        <path d="M1,1 L1,5.5 L5,3 L1,1" style="fill: #000000;" />
    </marker>
    <marker id="markerArrowGreen" markerWidth="13" markerHeight="13" refX="6" refY="3" orient="auto">
        <path d="M1,1 L1,5.5 L5,3 L1,1" style="fill: green;" />
    </marker>
    <marker id="markerArrowBlue" markerWidth="13" markerHeight="13" refX="6" refY="3" orient="auto">
        <path d="M1,1 L1,5.5 L5,3 L1,1" style="fill: blue;" />
    </marker>
    <marker id="markerArrowStart" markerWidth="13" markerHeight="13" refX="5" refY="3" orient="auto-start-reverse">
        <path d="M1,1 L1,5.5 L5,3 L1,1" style="fill: #000000;" />
    </marker>
    <marker id="markerArrowEnd" markerWidth="13" markerHeight="13" refX="5" refY="3" orient="auto">
        <path d="M1,1 L1,5.5 L5,3 L1,1" style="fill: #000000;" />
    </marker>
  </defs>
</svg>
