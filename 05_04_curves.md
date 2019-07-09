

{{meta {docid: curves}}}

<script src="https://d3js.org/d3.v5.min.js"></script>

<style>
    svg { background-color: white; display: inline-block;}
    .sandbox-output { text-align: center;}
</style>

# Curves

In this section we discuss the point interpolators provided by D3.js.  These are used with various generators ([lines](./05_03_lines.md) and [areas](./05_04_areas.html)) to determine the points between the points given in a dataset.

Below are the interpolators arranged according to type.


<table style="font-size: small">
<tr>

<td><a href="">curveLinear</a></td>
<td><a href="">curveLinearClosed</a></td>
<td><a href=""></a></td>
<td><a href=""></a></td>
</tr>

<tr>
<td><a href="">curveStep</a></td>
<td><a href="">curveStepAfter</a></td>
<td><a href="">curveStepBefore</a></td>
<td><a href=""></a></td>
</tr>

<tr>
<td><a href="">curveBasis</a></td>
<td><a href="">curveBasisClosed</a></td>
<td><a href="">curveBasisOpen</a></td>
<td><a href=""></a></td>
</tr>

<tr>
<td><a href="">curveBundle</a></td>
<td><a href="">bundle.data</a></td>
<td><a href=""></a></td>
<td><a href=""></a></td>
</tr>

<tr>
<td><a href="">curveNatural</a></td>
<td><a href=""></a></td>
<td><a href=""></a></td>
<td><a href=""></a></td>
</tr>
<tr>
<td><a href="">curveCardinal</a></td>
<td><a href="">curveCardinalClosed</a></td>
<td><a href="">curveCardinalOpen</a></td>
<td><a href="">cardinal.tension</a></td>
</tr>

<tr>
<td><a href="">curveCatmullRom</a></td>
<td><a href="">curveCatmullRomClosed</a></td>
<td><a href="">curveCatmullRomOpen</a></td>
<td><a href="">catmullRom.alpha</a></td>
</tr>

<tr>
<td><a href="">curveMonotoneX</a></td>
<td><a href="">curveMonotoneY</a></td>
<td><a href=""></a></td>
<td><a href=""></a></td>
</tr>

</table>

Each of the curves shown below are rendered as a `path` element in an `svg`.  The path description string (`d`) is computed using the line generator, `d3.line`.


## Linear Curves

A Linear Curve is the default curve applied if no other are set. They do not have an apparent curve in any way, instead they just make straight edges between each set of points. There is no open varient for Linear Curves.

Linear
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
  .y((d) => yScale(d.y))
  .curve();

d3.select("#demo1a")
  .append("path")
  .attr("d", line(data))
  .attr("fill", "none")
  .attr("stroke", "black");

d3.select("#demo1a")
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", (d) => xScale(d.x))
  .attr("cy", (d) => yScale(d.y))
  .attr("r", 1.5)
  .attr("stroke", "black")
  .attr("fill", "black");  

// Closed Linear
var line = d3.line()
  .x(d => xScale(d.x))
  .y(d => yScale(d.y))
  .curve(d3.curveLinearClosed);

d3.select("#demo1b")
  .append("path")
  .attr("d", line(data))
  .attr("fill", "none")
  .attr("stroke", "black");

d3.select("#demo1b")
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", (d) => xScale(d.x))
  .attr("cy", (d) => yScale(d.y))
  .attr("r", 1.5)
  .attr("stroke", "black")
  .attr("fill", "black");
</script>

<svg id="demo1a" width="200" height="200"></svg>
<svg id="demo1b" width="200" height="200"></svg>
```

## Step Curves 

Step Curves produce a [step function](https://en.wikipedia.org/wiki/Step_function) consisting of horizontal and vertical lines.

Step
+ [d3.curveStep(context)](https://github.com/d3/d3-shape#curveStep) - the `y` value changes at the midpoint between each pair of `x` values
+ [d3.curveStepAfter(context)](https://github.com/d3/d3-shape#curveStepAfter) - the `y` value changes at the second `x` value of each pair of `x` values
+ [d3.curveStepBefore(context)](https://github.com/d3/d3-shape#curveStepBefore) - the `y` value changes at the first `x` value of each pair of `x` values
```
<script>
    //Curve Step
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
   
    for (obj of data){
        d3.select("#demo7")
            .append("circle")
            .attr("cx", xScale(obj.x))
            .attr("cy", yScale(obj.y))
            .attr("r", 1.5)
            .attr("stroke", "black")
            .attr("fill", "black");
    }

    var line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveStep);
            
    d3.select("#demo7")
        .append("path")
        .attr("d", line(data))
        .attr("fill", "none")
        .attr("stroke", "black");

    // Curve Step Before
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

    for (obj of data){
        d3.select("#demo7b")
            .append("circle")
            .attr("cx", xScale(obj.x))
            .attr("cy", yScale(obj.y))
            .attr("r", 1.5)
            .attr("stroke", "black")
            .attr("fill", "black");
    }

    var line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveStepBefore);

    d3.select("#demo7b")
        .append("path")
        .attr("d", line(data))
        .attr("fill", "none")
        .attr("stroke", "black");

    // Curve Step After
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

    for (obj of data){
        d3.select("#demo7a")
            .append("circle")
            .attr("cx", xScale(obj.x))
            .attr("cy", yScale(obj.y))
            .attr("r", 1.5)
            .attr("stroke", "black")
            .attr("fill", "black");
    }

    var line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveStepAfter);

    d3.select("#demo7a")
        .append("path")
        .attr("d", line(data))
        .attr("fill", "none")
        .attr("stroke", "black");</script>

<svg id="demo7" width="200" height="200"></svg>
<svg id="demo7b" width="200" height="200"></svg>
<svg id="demo7a" width="200" height="200"></svg>
```

## Basis Curves

The Basis Curves produce variants of a [cubic basis spline](https://en.wikipedia.org/wiki/B-spline).

+ [d3.curveBasis(context)](https://github.com/d3/d3-shape#curveBasis)
+ [d3.curveBasisClosed(context)](https://github.com/d3/d3-shape#curveBasisClosed)
+ [d3.curveBasisOpen(context)](https://github.com/d3/d3-shape#curveBasisOpen)
```
<script>
    // Normal Version
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

    for (obj of data){
        d3.select("#demo1")
            .append("circle")
            .attr("cx", xScale(obj.x))
            .attr("cy", yScale(obj.y))
            .attr("r", 1.5)
            .attr("stroke", "black")
            .attr("fill", "black");
    }

   var line = d3.line()
     .x(d => xScale(d.x))
     .y(d => yScale(d.y))
     .curve(d3.curveBasis);

   d3.select("#demo1")
    .append("path")
    .attr("d", line(data))
    .attr("fill", "none")
    .attr("stroke", "black");

    // Closed Version
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

    for (obj of data){
           d3.select("#demo1c")
               .append("circle")
               .attr("cx", xScale(obj.x))
               .attr("cy", yScale(obj.y))
               .attr("r", 1.5)
               .attr("stroke", "black")
               .attr("fill", "black");
       }

    var line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveBasisClosed);

    d3.select("#demo1c")
        .append("path")
        .attr("d", line(data))
        .attr("fill", "none")
        .attr("stroke", "black");

    // Open version
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

    for (obj of data){
        d3.select("#demo1o")
            .append("circle")
            .attr("cx", xScale(obj.x))
            .attr("cy", yScale(obj.y))
            .attr("r", 1.5)
            .attr("stroke", "black")
            .attr("fill", "black");
    }

    var line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveBasisOpen);

    d3.select("#demo1o")
        .append("path")
        .attr("d", line(data))
        .attr("fill", "none")
        .attr("stroke", "black");
</script>

<svg id="demo1" width="200" height="200"></svg>
<svg id="demo1c" width="200" height="200"></svg>
<svg id="demo1o" width="200" height="200"></svg>
```

## Bundle Curve

The Bundle Curve produce variants of a [cubic basis spline](https://en.wikipedia.org/wiki/B-spline), however the strength of the spline can be altered by changing the beta, which defaults to 0.85.

Note: Not for use in d3.area, only d3.line.

+ [d3.curveBundle(context)](https://github.com/d3/d3-shape#curveBundle)
+ [bundle.beta(beta)](https://github.com/d3/d3-shape#curveBundle_beta) - accessor on d3.curveBundle(), takes a number 0 to 1, affects the strength of the spline

    + Example: ... .curve(d3.curveBundle().beta(0.5))
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
   
    for (obj of data){
        d3.select("#demo2")
            .append("circle")
            .attr("cx", xScale(obj.x))
            .attr("cy", yScale(obj.y))
            .attr("r", 1.5)
            .attr("stroke", "black")
            .attr("fill", "black");
    }

    var bundleArray = [
        {beta: 0, color: "black"},
        {beta: 0.25, color: "dimgray"},
        {beta: 0.5, color: "gray"},
        {beta: 0.75, color: "darkgray"},
        {beta: 1, color: "white"}
    ];
    
    for(obj of bundleArray){
        var line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(d3.curveBundle.beta(obj.beta));
            
        d3.select("#demo2")
            .append("path")
            .attr("d", line(data))
            .attr("fill", "none")
            .attr("stroke", obj.color);
    }

</script>

<svg id="demo2" width="200" height="200"></svg>
```

## Natural

+ [d3.curveNatural(context)](https://github.com/d3/d3-shape#curveNatural) produces a natural cubic spline with the second derivative of the spline set to zero at the endpoints
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
   
    for (obj of data){
        d3.select("#demo6n")
            .append("circle")
            .attr("cx", xScale(obj.x))
            .attr("cy", yScale(obj.y))
            .attr("r", 1.5)
            .attr("stroke", "black")
            .attr("fill", "black");
    }

    var line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveNatural);
            
    d3.select("#demo6n")
        .append("path")
        .attr("d", line(data))
        .attr("fill", "none")
        .attr("stroke", "black");
</script>

<svg id="demo6n" width="200" height="200"></svg>
```


## Cardinal Curves

The Cardinal Curves produce varients of a [cubic cardinal spline](https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Cardinal_spline). The spline's tension can be altered to affect the spline, which defaults to 0.

Cardinal
+ [d3.curveCardinal(context)](https://github.com/d3/d3-shape#curveCardinal)
+ [cardinal.tension(tension)](https://github.com/d3/d3-shape#curveCardinal) - accesseor on d3.curveCardinal(), takes a number 0 to 1, affects the tension of the spline
    + Example: ... .curve(d3.curveCardinal().tension(0.5))
+ [d3.curveCardinalClosed(context)](https://github.com/d3/d3-shape#curveCardinalClosed)
+ [d3.curveCardinalOpen(context)](https://github.com/d3/d3-shape#curveCardinalOpen)
```
<script>
    //Normal Cardinal
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
   
    for (obj of data){
        d3.select("#demo3")
            .append("circle")
            .attr("cx", xScale(obj.x))
            .attr("cy", yScale(obj.y))
            .attr("r", 1.5)
            .attr("stroke", "black")
            .attr("fill", "black");
    }

    var cardinalArray = [
        {tension: 0, color: "black"},
        {tension: 0.5, color: "gray"},
        {tension: 1, color: "white"}
    ];
    
    for(obj of cardinalArray){
        var line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(d3.curveCardinal.tension(obj.tension));
            
        d3.select("#demo3")
            .append("path")
            .attr("d", line(data))
            .attr("fill", "none")
            .attr("stroke", obj.color);
    }

    // Closed Cardinal
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

    for (obj of data){
        d3.select("#demo3c")
            .append("circle")
            .attr("cx", xScale(obj.x))
            .attr("cy", yScale(obj.y))
            .attr("r", 1.5)
            .attr("stroke", "black")
            .attr("fill", "black");
    }

    var cardinalArray = [
        {tension: 0, color: "black"},
        {tension: 0.5, color: "gray"},
        {tension: 1, color: "white"}
    ];

    for(obj of cardinalArray){
        var line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(d3.curveCardinalClosed.tension(obj.tension));

        d3.select("#demo3c")
            .append("path")
            .attr("d", line(data))
            .attr("fill", "none")
            .attr("stroke", obj.color);
    }
    // Open Cardinal
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

    for (obj of data){
        d3.select("#demo3o")
            .append("circle")
            .attr("cx", xScale(obj.x))
            .attr("cy", yScale(obj.y))
            .attr("r", 1.5)
            .attr("stroke", "black")
            .attr("fill", "black");
    }

    var cardinalArray = [
        {tension: 0, color: "black"},
        {tension: 0.5, color: "gray"},
        {tension: 1, color: "white"}
    ];

    for(obj of cardinalArray){
        var line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(d3.curveCardinalOpen.tension(obj.tension));

        d3.select("#demo3o")
            .append("path")
            .attr("d", line(data))
            .attr("fill", "none")
            .attr("stroke", obj.color);
    }
</script>

<svg id="demo3" width="200" height="200"></svg>
<svg id="demo3c" width="200" height="200"></svg>
<svg id="demo3o" width="200" height="200"></svg>
```

## Catmull-Rom Curves

The CatmullRom Curves produce varients of a [cubic Catmull-Rom spline, as proposed by Yuksel et al](https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Cardinal_spline). The spline's alpha can be altered to affect the spline, which defaults to 0.5.

Catmull Rom
+ [d3.curveCatmullRom(context)](https://github.com/d3/d3-shape#curveCatmullRom)
+ [catmullRom.alpha(alpha)](https://github.com/d3/d3-shape#curveCatmullRom_alpha)  - accesseor on d3.curveCatmullRom(), takes a number 0 to 1, affects the alpha of the spline
    + Example: ... .curve(d3.curveCatmullRom().alpha(0.5))
+ [d3.curveCatmullRomClosed(context)](https://github.com/d3/d3-shape#curveCatmullRomClosed)
+ [d3.curveCatmullRomOpen(context)](https://github.com/d3/d3-shape#curveCatmullRomOpen)

```
<script>
    // Normal Catmull Rom
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
   
    for (obj of data){
        d3.select("#demo4")
            .append("circle")
            .attr("cx", xScale(obj.x))
            .attr("cy", yScale(obj.y))
            .attr("r", 1.5)
            .attr("stroke", "black")
            .attr("fill", "black");
    }

    var catmullRomArray = [
        {alpha: 0, color: "black"},
        {alpha: 0.5, color: "gray"},
        {alpha: 1, color: "white"}
    ];
    
    for(obj of catmullRomArray){
        var line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(d3.curveCatmullRom.alpha(obj.alpha));
            
        d3.select("#demo4")
            .append("path")
            .attr("d", line(data))
            .attr("fill", "none")
            .attr("stroke", obj.color);
    }
    //Closed Catmull Rom
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

    for (obj of data){
        d3.select("#demo4c")
            .append("circle")
            .attr("cx", xScale(obj.x))
            .attr("cy", yScale(obj.y))
            .attr("r", 1.5)
            .attr("stroke", "black")
            .attr("fill", "black");
    }

    var catmullRomArray = [
        {alpha: 0, color: "black"},
        {alpha: 0.5, color: "gray"},
        {alpha: 1, color: "white"}
    ];

    for(obj of catmullRomArray){
        var line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(d3.curveCatmullRomClosed.alpha(obj.alpha));

        d3.select("#demo4c")
            .append("path")
            .attr("d", line(data))
            .attr("fill", "none")
            .attr("stroke", obj.color);
    }
    //Open Catmull Rom
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

    for (obj of data){
        d3.select("#demo4o")
            .append("circle")
            .attr("cx", xScale(obj.x))
            .attr("cy", yScale(obj.y))
            .attr("r", 1.5)
            .attr("stroke", "black")
            .attr("fill", "black");
    }

    var catmullRomArray = [
        {alpha: 0, color: "black"},
        {alpha: 0.5, color: "gray"},
        {alpha: 1, color: "white"}
    ];

    for(obj of catmullRomArray){
        var line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(d3.curveCatmullRomOpen.alpha(obj.alpha));

        d3.select("#demo4o")
            .append("path")
            .attr("d", line(data))
            .attr("fill", "none")
            .attr("stroke", obj.color);
    }
</script>

<svg id="demo4" width="200" height="200"></svg>
<svg id="demo4c" width="200" height="200"></svg>
<svg id="demo4o" width="200" height="200"></svg>
```


## Monotone and Natural Curves

Monotone X
+ [d3.curveMonotoneX(context)](https://github.com/d3/d3-shape#curveMonotoneX) produces a cubic spline that preserves monotonicity in x, assuming monotonicity in y

Monotone Y
+ [d3.curveMonotoneY(context)](https://github.com/d3/d3-shape#curveMonotoneY) produces a cubic spline that preserves monotonicity in y, assuming monotonicity in x.
```
<script>
    //Monotone X
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
   
    for (obj of data){
        d3.select("#demo6x")
            .append("circle")
            .attr("cx", xScale(obj.x))
            .attr("cy", yScale(obj.y))
            .attr("r", 1.5)
            .attr("stroke", "black")
            .attr("fill", "black");
    }

    var line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveMonotoneX);
            
    d3.select("#demo6x")
        .append("path")
        .attr("d", line(data))
        .attr("fill", "none")
        .attr("stroke", "black");

        //Monotone Y
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

    for (obj of data){
        d3.select("#demo6y")
            .append("circle")
            .attr("cx", xScale(obj.x))
            .attr("cy", yScale(obj.y))
            .attr("r", 1.5)
            .attr("stroke", "black")
            .attr("fill", "black");
    }

    var line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveMonotoneY);

    d3.select("#demo6y")
        .append("path")
        .attr("d", line(data))
        .attr("fill", "none")
        .attr("stroke", "black");
</script>

<svg id="demo6x" width="200" height="200"></svg>
<svg id="demo6y" width="200" height="200"></svg>
```


## Custom Curves