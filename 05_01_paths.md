{{meta {docid: shapes}}}

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

<style>
    svg { background-color: white; display: inline-block;}
    .sandbox-output { text-align: center;}
    .functionNameText {text-align: left; display: block}
</style>

# Paths

In this section we will discuss Canvas contexts, SVG paths, and `d3.path()`, 
a D3 utility for converting [CanvasPathMethods](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D#Paths) into a usable string that can be used by an SVG path.
This benefits us by letting us make shapes, lines, or any other graphic only once and be usable by both SVGs and Canvasses.
`d3.path()` can be used by itself, and it is utilized by every other shape in this chapter.

## SVG path
Thus far in this book we have been using SVG rects or lines to create our illustrations. Lines and rects can be very effective at illustrating many different data sets, however when needing complex shapes (anything other than a rectangle) they cannot be used effectively.

To help us fulfill the need for complex shapes, we can use an SVG path. Paths can be appended to SVGs like lines and rects and have some similar attributes such as `stroke` and `fill`.
However instead of setting any `x` or `y` positions, paths have a `d` attribute to determine its shape and position. 


The `d` attribute takes a string that contains commands and coordinates for the path to take. 
For instance to use the "moveto" command to position {25,25}: `M 25 25`


Multiple commands can be chained next to each other and the path will read them left to right.
For example to create a new path that starts at the position {25,25} and then draw a line to {75,25} and {75,75} and finally closing the path:
<pre>
selection
    .append("path")
    .attr("d", "M 25 25 L 75 25 L 75 75 Z")
    .attr("stroke", "black")
    .attr("fill", "red");
</pre>

[For a complete list of all available SVG commands and their syntax.](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#Path_commands)

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

## Canvas

Canvasses are an newer alternative to SVGs that offer [more advanced features with more applications](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API). 
However, for the purposes of this book, we will only be discussing what relates to D3 and we will continue to use SVGs for most of our examples.

Canvasses have a similar set-up in HTML compared to SVGs:
<pre>
&lt;canvas id="canvas1" width="200" height="100">&lt;/canvas>
</pre> 

Unlike SVGs, where we could place additional tags inside of our SVG tag, with canvasses we have to use javascript to add visual elements to a canvas. To add visual elements we call function on a canvas' `context`. 
We can get this context by first selecting the canvas, and then using `getContext('2d')` on the canvas node:
<pre>
var canvas = d3.select("#canvas1");
var context = canvas.node().getContext('2d');
</pre> 

Now that we have the context we can begin to call methods on it that tell how something should be drawn on the canvas. There are many similar commands compared to SVG command; however, now they are just functions we call instead of setting a string. 
For example to do the same shape as the SVG exampe:
<pre>
context.moveTo(25,25);
context.lineTo(75,25);
context.lineTo(75,75);
context.closePath();

context.fillStyle = "red";
context.fill(); //Adds the background color

context.stroke(); // Adds the lines
</pre>

[For a complete list of all available Canvas Rendering Context 2d commands and their syntax.](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)

```
<script>
var canvas = d3.select("#canvas1");
var context = canvas.node().getContext('2d');

context.moveTo(25,25); //Sets the line paths
context.lineTo(75,25);
context.lineTo(75,75);
context.closePath();

context.fillStyle = "red"; //Sets the background color
context.fill(); //Adds the background color

context.stroke(); // Adds the lines
</script>
<canvas id="canvas1" width="100" height="100"></canvas>
```

## d3.path

Canvasses have more features than SVGs do, but they have no elements in the DOM so *there is nothing to reselect for data updating*. This can make it hard to dynamically add and remove elements from the canvas. 
For this reason, we will stick with SVGs for the data visualizations in this book. Additionally some D3 modules do not support being added to canvasses such as [d3.axis](/04_03_axis.html).

While we cannot select or update the canvas elements, the [CanvasPathMethods](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D#Paths) are useful in drawing paths opposed to manually generating strings for the `d` attribute of a path.

Because of this D3 supplies us with `d3.path`. 
`d3.path` returns a path generator which can have methods called on it in a similar way as CanvasPathMethods. 
For usage with SVGs `d3.path` also has `path.toString()` which returns back a string that can be passed into the `d` attribute of an SVG path.

For example:
<pre>
var path = d3.path();
    path.moveTo(25,25);
    path.lineTo(75,25);
    path.lineTo(75,75);
    path.closePath();
console.log(path);
</pre>

Will print out: <code>"M 25 25 L 75 25 L 75 75 Z"</code>.

To make a new SVG path with this string in its `d` attribute, we just call `path` when we set `d`. We can also modify the `fill` , `stroke`, or any other attribute of our path.
<pre>
d3.select("#demoPath1")
	.append("path")
    .attr("d", path)
    .attr("stroke", "black")
    .attr("fill", "red");
</pre>

```
<script>
var path = d3.path();
    path.moveTo(25,25);
    path.lineTo(75,25);
    path.lineTo(75,75);
    path.closePath();
    
d3.select("#demoPath1")
	.append("path")
    .attr("d", path)
    .attr("stroke", "black")
    .attr("fill", "red");
</script>

<svg id="demoPath1" width="100" height="100"></svg>
```

+ [d3.path()](https://github.com/d3/d3-path#d3-path) - Creates a new path generator that implements [CavansPathMethods](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D#Paths).
+ [path.moveTo(x,y)]() - Moves to the given point {x,y} without drawing a line. Equivalent to [context.moveTo](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/moveTo) and SVG's ["moveto" command](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#MoveTo_path_commands).
+ [path.closePath()]() - Ends the current subpath and draws a line to the starting point of that subpath. Equivalent to [context.closePath](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/closePath) and SVG's ["closepath" command](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#ClosePath).
+ [path.lineTo(x,y)]() - Draws a straight line to the given point {x,y}. Equivalent to [context.lineTo](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineTo) and SVG’s [“lineto” command](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#LineTo_path_commands).
+ [path.toString()]() - Returns the path generators string representation, used when setting the `d` attribute in a SVG path.

Used implicitly in all the shapes in this chapter.

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

Additionally, if you already have a function that modifies a canvas context such as the following, you can pass in d3.path() instead of a context and your function will work for both SVG paths and Canvasses:
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

### Curves
[path.quadraticCurveTo(cpx, cpy, x ,y)]() - Draws a quadratic Bézier segment to the given point {x,y} with the control point (cpx, cpy). Equivalent to [context.quadraticCurveTo](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo) and SVG’s [quadratic Bézier curve commands](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#Quadratic_B%C3%A9zier_Curve).

[path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y)]() - Draws a quadratic Bézier segment to the given point {x,y} with the specified control points {cpx1,cpx2} and {cpx2,cpy2}. Equivalent to [context.quadraticCurveTo](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo) and SVG’s [quadratic Bézier curve commands](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#Quadratic_B%C3%A9zier_Curve).

Used in: [d3.curves]() and [d3.links]().

```
<script>

var qCP = [25, 80];

var bCP1 = [25, 120];
var bCP2 = [175, 190];

var qPath = d3.path();
    qPath.moveTo(10,10);
    qPath.quadraticCurveTo(qCP[0],qCP[1],190,10);

d3.select("#demoCurve")
    .append("path")
    .attr("d", qPath)
    .attr("stroke", "black")
    .attr("fill", "none");

d3.select("#demoCurveOutline")
    .append("path")
    .attr("d", qPath)
    .attr("stroke", "black")
    .attr("fill", "none");
    
    
var bPath = d3.path();
    bPath.moveTo(10,190);
    bPath.bezierCurveTo(bCP1[0],bCP1[1], bCP2[0], bCP2[1],190,120);

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

### Arcs
[path.arc(x, y, radius, startAngle, endAngle[, anticlockwise])]() - Draws a line to {x,y} and draws circular arc with the given radius. The arc starts at `startAngle` and ends at `endAngle`. By default the angles go *clockwise*, to change this pass `true` into the final argument.

Used in: [d3.arcs()](./05_02_arcs_pie_charts.html) and [d3.pie()](./05_02_arcs_pie_charts.html)

```
<script>
var center = [100, 100];
var radius = 75;
var startAngle = 0;
var endAngle = Math.PI / 2;

var pathArc = d3.path();
	pathArc.moveTo(center[0], center[1]);
    pathArc.arc(center[0], center[1], radius, startAngle, endAngle)
    pathArc.closePath();
    
d3.select("#demoArc")
	.append("path")
    .attr("d", pathArc)
    .attr("stroke", "black")
    .attr("fill", "red");
    
d3.select("#demoArcOutline")
    .append("path")
    .attr("d", pathArc)
    .attr("stroke", "black")
    .attr("fill", "red");

addArcOutline(center, radius, d3.select("#demoArcOutline"));

</script>
<svg id="demoArc" width="200" height="200"></svg>
<svg id="demoArcOutline" width="200" height="200"></svg>
```

[path.arcTo(x1, y1, x2, y2, radius)]() - Given the current point is {x0, y0}, draws an arc from the point tangent to the line {x0, y0} => {x1, y1}, to the point tangent to {x1, y1} => {x2, y2} on a circle with a given raduis

```
<script>
var points = [[160,190],[10,100],[185,25]];
var radius = 30;

var pathArcTo = d3.path();
    pathArcTo.moveTo(points[0][0], points[0][1]);
    pathArcTo.arcTo(points[1][0], points[1][1], points[2][0], points[2][1], radius)
    pathArcTo.lineTo(points[2][0], points[2][1])
    pathArcTo.closePath();

d3.select("#demoArcTo")
    .append("path")
    .attr("d", pathArcTo)
    .attr("stroke", "black")
    .attr("fill", "red");
    
d3.select("#demoArcToOutline")
    .append("path")
    .attr("d", pathArcTo)
    .attr("stroke", "black")
    .attr("fill", "red");
    
addArcToOutline(points[0], points[1], points[2], radius, d3.select("#demoArcToOutline"));

</script>
<svg id="demoArcTo" width="200" height="200"></svg>
<svg id="demoArcToOutline" width="200" height="200"></svg>
```


[path.rect(x, y, w, h)]() - Creates a subpath of a rectangle, with width `w`, height `h`, and its bottom left point at {x,y}. 
Connects the four points with `path.lineTo()` and marks the subpath as closed. 
Equivalent to [context.rect](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rect)

Used in: [The square symbol](/05_07_symbols.html)

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

## In case you were wondering

In the second `path` example, we used the function `addPathOutline()` to add in an illustration showing the how the path was rendered.
This function was separated from the path example because it was lengthy, contained many conditional statements, and was not needed to understand the graphic.
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
<code class="functionNameText">addPathOutline(points, selection)</code>
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

In the `path.curve` example, we used the function `addCurveOutline()` to add guidelines for the control points.
This function was seperated from the curve example because it is not needed to understand the graphic.
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
<code class="functionNameText">addCurveOutline(qControl, bControl1, bControl2, selection)</code>
```

In the `path.arc` example, we used the function `addArcOutline()` to add a circle outline and angle text elements to show the angles.
This function was separated from the arc example because it contains D3 methods that we have not discussed and is not needed to understand the graphic.
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
<code class="functionNameText">addArcOutline(center, radius, selection)</code>
```

In the `path.arcTo` example, we used the function `addArcToOutline()` to add in the circle and lines to help illustrate where and how arcTo behaves. 
This function was separated from the arcTo example because it contains lengthy math operations that are not needed to understand the graphic.
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
<code class="functionNameText">addCircle(point1, point2, point3, radius, selection)</code>
```

In the `path.rect` example, we used the function `addRectOutline()` to add the origin and width/height guides to help illustrate where the rect draws.
This function was seperated from the rect example because it was lengthy and was not needed to understand the graphic.
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
<code class="functionNameText">addRectOutline(origin, width, height, selection)</code>
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

<svg width="0" height="0">
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
        <marker id="markerArrowStart" markerWidth="13" markerHeight="13" refX="5" refY="3"
            orient="auto-start-reverse">
            <path d="M1,1 L1,5.5 L5,3 L1,1" style="fill: #000000;" />
        </marker>
        <marker id="markerArrowEnd" markerWidth="13" markerHeight="13" refX="5" refY="3"
            orient="auto">
            <path d="M1,1 L1,5.5 L5,3 L1,1" style="fill: #000000;" />
        </marker>
    </defs>
</svg>
