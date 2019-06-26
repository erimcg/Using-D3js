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

Used in: [d3.curves]() and [d3.links]()

### Arcs
+ [path.arcTo(x1, y1, x2, y2, radius)]() - Given the current point is {x0, y0}, draws an arc from the point tangent to the line {x0, y0} => {x1, y1}, to the point tangent to {x1, y1} => {x2, y2} on a circle with a given raduis
+ [path.arc(x, y, radius, startAngle, endAngle[, anticlockwise])]() - Draws a line to {x,y} and draws circular arc with the given radius. The arc starts at `startAngle` and ends at `endAngle`. By default the angles go *clockwise*, to change this pass `true` into the final argument.
```
<script>
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
    
    //The angle C, or at p2
    var theta = Math.acos((a*a + b*b - c*c) / (2*a*b));
    
    //distance from p2 where center of circle lies
    var disC = radius / Math.sin(theta/2);
    
	//distance from p2 to midpoint
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
}
</script>
This contains the addCircle method found below. The additional outline circle <br>and lines have been added to help illustrate how/where arcTo arcs.
```

```
<script>
var points = [[250,250],[100,150],[275,75]];
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
    
d3.select("#demoArcTo")
	.selectAll("circle")
    .data(points)
    .join("circle")
    .attr("cx", d => d[0])
    .attr("cy", d => d[1])
    .attr("r", 5);

addCircle(points[0], points[1], points[2], radius, d3.select("#demoArcTo"));

var pathArc = d3.path();
	pathArc.moveTo(150, 150);
    pathArc.arc(150, 150, 75, 0, 3.14/2)
    pathArc.closePath();
    
d3.select("#demoArc")
	.append("path")
    .attr("d", pathArc)
    .attr("stroke", "black")
    .attr("fill", "red");
    
</script>
<svg id="demoArcTo" width="300" height="300"></svg>
<svg id="demoArc" width="300" height="300"></svg>
```

Used in: [d3.arcs()](./05_02_arcs_pie_charts.html) and [d3.pie()](./05_02_arcs_pie_charts.html)


+ [path.rect(x, y, w, h)]() - Creates a subpath of a rectangle, with width `w`, height `h`, and its bottom left point at {x,y}. Connects the four points with `path.lineTo()` and marks the subpath as closed. Equivalent to [context.rect](http://www.w3.org/TR/2dcontext/#dom-context-2d-rect)
+ [path.toString()]() - Returns the path generators string representation, used when setting the `d` attribute in a SVG path.
