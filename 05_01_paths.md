{{meta {docid: shapes}}}

<script src="https://d3js.org/d3.v5.min.js"></script>

# Paths

+ [d3.path()](https://github.com/d3/d3-path#d3-path) - Creates a new path generator that implements [CavansPathMethods](http://www.w3.org/TR/2dcontext/#canvaspathmethods).
+ [path.moveTo(x,y)]() - Moves to the given point {x,y} without drawing a line. Equivalent to [context.moveTo](http://www.w3.org/TR/2dcontext/#dom-context-2d-moveto) and SVG's ["moveto" command](http://www.w3.org/TR/SVG/paths.html#PathDataMovetoCommands).
+ [path.closePath()]() - Ends the current subpath and draws a line to the starting point of that subpath. Equivalent to [context.closePath](http://www.w3.org/TR/2dcontext/#dom-context-2d-closepath) and SVG's ["closepath" command](http://www.w3.org/TR/SVG/paths.html#PathDataClosePathCommand).
+ [path.lineTo(x,y)]() - Draws a straight line to the given point {x,y}. Equivalent to [context.lineTo](http://www.w3.org/TR/2dcontext/#dom-context-2d-lineto) and SVG’s [“lineto” command](http://www.w3.org/TR/SVG/paths.html#PathDataLinetoCommands).

### Curves
+ [path.quadraticCurveTo(cpx, cpy, x ,y)]() - Draws a quadratic Bézier segment to the given point {x,y} with the control point (cpx, cpy). Equivalent to [context.quadraticCurveTo](http://www.w3.org/TR/2dcontext/#dom-context-2d-quadraticcurveto) and SVG’s [quadratic Bézier curve commands](http://www.w3.org/TR/SVG/paths.html#PathDataQuadraticBezierCommands).
+ [path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y)]() - Draws a quadratic Bézier segment to the given point {x,y} with the specified control points {cpx1,cpx2} and {cpx2,cpy2}. Equivalent to [context.quadraticCurveTo](http://www.w3.org/TR/2dcontext/#dom-context-2d-quadraticcurveto) and SVG’s [quadratic Bézier curve commands](http://www.w3.org/TR/SVG/paths.html#PathDataQuadraticBezierCommands).

### Arcs
+ [path.arcTo(x1, y1, x2, y2, radius)]() - Given the current point is {x0, y0}, draws an arc from the point tangent to the line {x0, y0} => {x1, y1}, to the point tangent to {x1, y1} => {x2, y2} on a circle with a given raduis
+ [path.arc(x, y, radius, startAngle, endAngle[, anticlockwise])]() - Draws a line to {x,y} and draws circular arc with the given radius. The arc starts at `startAngle` and ends at `endAngle`. By default the angles go *clockwise*, to change this pass `true` into the final argument.

```
<script>
var points = [[250,250],[100,150],[275,75]];
var radius = 50;

var pathArcTo = d3.path();
    pathArcTo.moveTo(250, 250);
    pathArcTo.arcTo(100, 150, 275, 75, radius)
    pathArcTo.lineTo(275,75)
    pathArcTo.closePath();

d3.select("#demoArcTo")
    .append("path")
    .attr("d", pathArcTo)
    .attr("stroke", "black")
    .attr("fill", "purple");
    
d3.select("#demoArcTo")
	.selectAll("circle")
    .data(points)
    .join("circle")
    .attr("cx", d => d[0])
    .attr("cy", d => d[1])
    .attr("r", 5);

addCircle(points[0], points[1], points[2], radius, d3.select("#demoArcTo"));

function addCircle(point1, point2, point3, radius, selection){
	//p3 => p2 = a
	//p2 => p1 = b
	//p1 => p3 = c
	
	//Midpoint between p1 and p3
	var m = [(point1[0] + point3[0])/2, (point1[1] + point3[1])/2];
    
    //Finding lengths of sides
    var a = Math.sqrt(Math.pow(point3[0] - point2[0],2) + Math.pow(point3[1] - point2[1],2) );
    var b = Math.sqrt(Math.pow(point2[0] - point1[0],2) + Math.pow(point2[1] - point1[1],2) );
    var c = Math.sqrt(Math.pow(point3[0] - point1[0],2) + Math.pow(point3[1] - point1[1],2) );
    console.log(a);
    console.log(b);
    console.log(c);
    console.log
    
    //distance from p2 where center of circle lies
    //var dis = 
}
    
    
var pathArc = d3.path();
	pathArc.moveTo(150, 150);
    pathArc.arc(150, 150, 75, 0, 3.14/2)
    pathArc.closePath();
    
d3.select("#demoArc")
	.append("path")
    .attr("d", pathArc)
    .attr("stroke", "black")
    .attr("fill", "purple");
    
</script>
<svg id="demoArcTo" width="300" height="300"></svg>
<svg id="demoArc" width="300" height="300"></svg>
```

+ [path.rect(x, y, w, h)]() - Creates a subpath of a rectangle, with width `w`, height `h`, and its bottom left point at {x,y}. Connects the four points with `path.lineTo()` and marks the subpath as closed. Equivalent to [context.rect](http://www.w3.org/TR/2dcontext/#dom-context-2d-rect)
+ [path.toString()]() - Returns the path generators string representation, used when setting the `d` attribute in a SVG path.
