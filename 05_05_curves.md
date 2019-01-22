{{meta {docid: arcs_pie_charts}}}

<script src="https://d3js.org/d3.v4.min.js"></script>

<style>
    svg { background-color: lightblue; }
</style>

# Curves

As you may have seen in lines(link) and area(link) applying a curve will curve the line. 
For most, if not all, examples we have gone through, we have used d3.curveBasis as the curve, but there are many more types provided by d3.

Curves are not used on their own, but rather used with an accessor on lines and areas. 

Many curves have 3 forms: Normal, Closed, and Open.

While each type of curve has different ways of dictating how it's different forms are computed, they follow a similar pattern: 
+ The Normal version touches the first and last point, and starts and ends on the first and last points
+ The Closed version "connects" the first and last points underneath of the rest of the curve, but typically does not touch the first and last points.
+ The Open version seems to not include the first and last points on it's curve
+ Note: These are very simplified ways of explaining the forms based purely on appearances.

## Basis Curves
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
</script>

<svg id="demo1" width="200" height="200"></svg>
```
Basis Closed
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
</script>

<svg id="demo1c" width="200" height="200"></svg>
```
Basis Open
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

<svg id="demo1o" width="200" height="200"></svg>
```


## Bundle Curves
Not for use in d3.area, only d3.line.
+ [d3.curveBundle(context)](https://github.com/d3/d3-shape#curveBundle)
+ [bundle.beta(beta)](https://github.com/d3/d3-shape#curveBundle_beta)
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

## Cardinal Curves
+ [d3.curveCardinal(context)](https://github.com/d3/d3-shape#curveCardinal)
+ [d3.curveCardinalClosed(context)](https://github.com/d3/d3-shape#curveCardinalClosed)
+ [d3.curveCardinalOpen(context)](https://github.com/d3/d3-shape#curveCardinalOpen)
+ [cardinal.tension(tension)](https://github.com/d3/d3-shape#curveCardinal)

Cardinal
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
</script>

<svg id="demo3" width="200" height="200"></svg>
```
Cardinal Closed
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
</script>

<svg id="demo3c" width="200" height="200"></svg>
```
Cardinal Open
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

<svg id="demo3o" width="200" height="200"></svg>
```

## Catmull-Rom Curves
+ [d3.curveCatmullRom(context)](https://github.com/d3/d3-shape#curveCatmullRom)
+ [d3.curveCatmullRomClosed(context)](https://github.com/d3/d3-shape#curveCatmullRomClosed)
+ [d3.curveCatmullRomOpen(context)](https://github.com/d3/d3-shape#curveCatmullRomOpen)
+ [catmullRom.alpha(alpha)](https://github.com/d3/d3-shape#curveCatmullRom_alpha)

Catmull Rom
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
</script>

<svg id="demo4" width="200" height="200"></svg>
```
Catmull Rom Closed
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
</script>

<svg id="demo4c" width="200" height="200"></svg>
```
Catmull Rom Open
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

<svg id="demo4o" width="200" height="200"></svg>
```

## Linear Curves
+ [d3.curveLinear(context)](https://github.com/d3/d3-shape#curveLinear)
+ [d3.curveLinearClosed(context)](https://github.com/d3/d3-shape#curveLinearClosed)
+ There is no open form for this curve.

Linear
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
        d3.select("#demo5")
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
        .curve(d3.curveLinear);
            
    d3.select("#demo5")
        .append("path")
        .attr("d", line(data))
        .attr("fill", "none")
        .attr("stroke", "black");
</script>

<svg id="demo5" width="200" height="200"></svg>
```
Linear Closed
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
        d3.select("#demo5c")
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
        .curve(d3.curveLinearClosed);
            
    d3.select("#demo5c")
        .append("path")
        .attr("d", line(data))
        .attr("fill", "none")
        .attr("stroke", "black");
</script>

<svg id="demo5c" width="200" height="200"></svg>
```

## Monotone and Natural Curves
+ [d3.curveMonotoneX(context)](https://github.com/d3/d3-shape#curveMonotoneX)
+ [d3.curveMonotoneY(context)](https://github.com/d3/d3-shape#curveMonotoneY)
+ [d3.curveNatural(context)](https://github.com/d3/d3-shape#curveNatural)

Monotone X
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
</script>

<svg id="demo6x" width="200" height="200"></svg>
```
Monotone Y
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

<svg id="demo6y" width="200" height="200"></svg>
```
Natural
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

## Step Curves 
### (The not so curvy curves)
+ [d3.curveStep(context)](https://github.com/d3/d3-shape#curveStep)
+ [d3.curveStepAfter(context)](https://github.com/d3/d3-shape#curveStepAfter)
+ [d3.curveStepBefore(context)](https://github.com/d3/d3-shape#curveStepBefore)

Step
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
</script>

<svg id="demo7" width="200" height="200"></svg>
```
Step Before
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
</script>

<svg id="demo7b" width="200" height="200"></svg>
```
Step After
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
        .attr("stroke", "black");
</script>

<svg id="demo7a" width="200" height="200"></svg>
```