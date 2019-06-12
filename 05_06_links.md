{{meta {docid: arcs_pie_charts}}}

<script src="https://d3js.org/d3.v4.min.js"></script>

<style>
    svg { background-color: white; }
</style>

# Links


### Using d3.linkHorizontal() and d3.linkVertical()
```
<script>
    //Begin making the horizontal link chart
 var nodeDataHorizontal = [
    {id: "D3",       x: 25, y: 100},
    {id: "Scales",   x: 175, y: 25},
    {id: "Shapes",   x: 175, y: 175}];

 var linkDataHorizontal = [
    {source: [25,100], target: [175,25]},   // D3 -> Shapes
    {source: [25,100], target: [175,175]}]; // D3 -> Scales

    d3.select("#demoH") //Adding the Circle nodes
        .selectAll("circle")
        .data(nodeDataHorizontal)
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 5)
        .attr("stroke", "black")
        .attr("fill", "black");

    var link = d3.linkHorizontal();

	d3.select("#demoH") //Adding the link paths
        .selectAll("path")
        .data(linkDataHorizontal)
        .enter()
        .append("path")
        .attr("d", link)
        .attr("fill", "none")
        .attr("stroke", "black");

    d3.select("#demoH") //Adding the text labels
          .selectAll("text")
          .data(nodeDataHorizontal)
          .enter()
          .append("text")
          .attr("font-size", "12px")
          .attr("text-anchor", "middle")
          .attr("x", d => d.x)
          .attr("y", d => d.y + 20)
          .text(d => d.id);

    //Begin making the vertical link chart
    var nodeDataVertical = [
        {id: "D3",       x: 100, y: 25 },
        {id: "Scales",   x: 25, y: 175},
        {id: "Shapes",   x: 175, y: 175}];

    var linkDataVertical = [
        {source: [100,25], target: [25,175]},   // D3 -> Shapes
        {source: [100,25], target: [175,175]}]; // D3 -> Scales

    d3.select("#demoV") //Adding the circle nodes
        .selectAll("circle")
        .data(nodeDataVertical)
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 5)
        .attr("stroke", "black")
        .attr("fill", "black");

    var link = d3.linkVertical();

    d3.select("#demoV") //Adding the link paths
        .selectAll("path")
        .data(linkDataVertical)
        .enter()
        .append("path")
        .attr("d", link)
        .attr("fill", "none")
        .attr("stroke", "black");

    d3.select("#demoV") //Adding the text label
        .selectAll("text")
        .data(nodeDataVertical)
        .enter()
        .append("text")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("x", d => d.id === "D3" ? d.x + 15 : d.x) //If the node is the D3 node, move it over some so it fits right, otherwise d.x
        .attr("y", d => d.y + 20)
        .text(n => n.id);
</script>
<svg id="demoH" width="200" height="200"></svg>
<svg id="demoV" width="200" height="200"></svg>
```

## Using .source() and .target()
```
<script>
 var nodeData = [
    {id: "D3",       x: 0, y: 2},
    {id: "Shapes",   x: 1, y: 1},
    {id: "Scales",   x: 1, y: 3},
    {id: "Links",    x: 2, y: 0},
    {id: "Areas",    x: 2, y: 1},
    {id: "Arcs",     x: 2, y: 2},
    {id: "Ordinal",  x: 2, y: 3},
    {id: "Quantize", x: 2, y: 4}];

 var linkData = [
    {source: "D3", target: "Shapes"},
    {source: "D3", target: "Scales"},
    {source: "Shapes", target: "Links"},
    {source: "Shapes", target: "Areas"},
    {source: "Shapes", target: "Arcs"},
    {source: "Scales", target: "Ordinal"},
    {source: "Scales", target: "Quantize"}];

   var xScale = d3.scaleLinear().domain([0, 2]).range([25, 175]);
   var yScale = d3.scaleLinear().domain([0,4]).range([175, 25]);

    for (obj of nodeData){ // Adds in the nodes
        d3.select("#demoE")
            .append("circle")
            .attr("cx", xScale(obj.x))
            .attr("cy", yScale(obj.y))
            .attr("r", 5)
            .attr("stroke", "black")
            .attr("fill", "black");
    }

    var link = d3.linkHorizontal()
        .source(d => [xScale(nodeData.find(x => x.id === d.source).x), yScale(nodeData.find(y => y.id === d.source).y)])
        .target(d => [xScale(nodeData.find(x => x.id === d.target).x), yScale(nodeData.find(y => y.id === d.target).y)]);

	for(l of linkData){
      d3.select("#demoE")
          .append("path")
          .attr("d", link(l))
          .attr("fill", "none")
          .attr("stroke", "black");
    }
    d3.select("#demoE")
          .selectAll("text")
          .data(nodeData)
          .enter()
          .append("text")
          .attr("font-size", "12px")
          .attr("text-anchor", "middle")
          .attr("x", n => xScale(n.x))
          .attr("y", n => yScale(n.y) + 20)
          .text(n => n.id);
</script>

<svg id="demoE" width="200" height="200"></svg>
```

## Using .x() and .y()
```
<script>
 var nodeData = [
    {id: "D3",       x: 0, y: 2},
    {id: "Shapes",   x: 1, y: 1},
    {id: "Scales",   x: 1, y: 3},
    {id: "Links",    x: 2, y: 0},
    {id: "Areas",    x: 2, y: 1},
    {id: "Arcs",     x: 2, y: 2},
    {id: "Ordinal",  x: 2, y: 3},
    {id: "Quantize", x: 2, y: 4}];

 var linkData = [
    {source: nodeData[0], target: nodeData[1]}, //D3 -> Shapes
    {source: nodeData[0], target: nodeData[2]}, //D3 -> Scales
    {source: nodeData[1], target: nodeData[3]}, //Shapes -> Links
    {source: nodeData[1], target: nodeData[4]}, //Shapes -> Areas
    {source: nodeData[1], target: nodeData[5]}, //Shapes -> Arcs
    {source: nodeData[2], target: nodeData[6]}, //Scales -> Ordinal
    {source: nodeData[2], target: nodeData[7]}]; //Scales -> Quantize

   var xScale = d3.scaleLinear().domain([0, 2]).range([25, 175]);
   var yScale = d3.scaleLinear().domain([0,4]).range([175, 25]);

    for (obj of nodeData){ // Adds in the nodes
        d3.select("#demoExy")
            .append("circle")
            .attr("cx", xScale(obj.x))
            .attr("cy", yScale(obj.y))
            .attr("r", 5)
            .attr("stroke", "black")
            .attr("fill", "black");
    }

    var link = d3.linkHorizontal()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));

	for(l of linkData){
      d3.select("#demoExy")
          .append("path")
          .attr("d", link(l))
          .attr("fill", "none")
          .attr("stroke", "black");
    }
    d3.select("#demoExy")
          .selectAll("text")
          .data(nodeData)
          .enter()
          .append("text")
          .attr("font-size", "12px")
          .attr("text-anchor", "middle")
          .attr("x", n => xScale(n.x))
          .attr("y", n => yScale(n.y) + 20)
          .text(n => n.id);
</script>

<svg id="demoExy" width="200" height="200"></svg>
```

## Using .source(), .target(), .x(), and y().
```
<script>
 var nodeData = [
    {id: "D3",       x: 0, y: 2, source: "D3"},     //D3 -> D3
    {id: "Shapes",   x: 1, y: 1, source: "D3"},     //D3 -> Shapes
    {id: "Scales",   x: 1, y: 3, source: "D3"},     //D3 -> Scales
    {id: "Links",    x: 2, y: 0, source: "Shapes"}, //Shapes -> Links
    {id: "Areas",    x: 2, y: 1, source: "Shapes"}, //Shapes -> Areas
    {id: "Arcs",     x: 2, y: 2, source: "Shapes"}, //Shapes -> Arcs
    {id: "Ordinal",  x: 2, y: 3, source: "Scales"}, //Scales -> Ordinal
    {id: "Quantize", x: 2, y: 4, source: "Scales"}];//Scales -> Quantize

   var xScale = d3.scaleLinear().domain([0, 2]).range([25, 175]);
   var yScale = d3.scaleLinear().domain([0,4]).range([175, 25]);

   var link = d3.linkHorizontal()
        .source(d => nodeData.find(x => x.id === d.source))
        .target(d => d)
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));

    d3.select("#demoEAll") //Adds the circle nodes
        .selectAll("circle")
        .data(nodeData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 5)
        .attr("stroke", "black")
        .attr("fill", "black");

	d3.select("#demoEAll") //adds the link paths
      	  .selectAll("path")
      	  .data(nodeData)
          .enter()
          .append("path")
          .attr("d", link)
          .attr("fill", "none")
          .attr("stroke", "black");

    d3.select("#demoEAll") //adds the text labels
          .selectAll("text")
          .data(nodeData)
          .enter()
          .append("text")
          .attr("font-size", "12px")
          .attr("text-anchor", "middle")
          .attr("x", d => xScale(d.x))
          .attr("y", d => yScale(d.y) + 20)
          .text(d => d.id);
</script>

<svg id="demoEAll" width="200" height="200"></svg>
```

+ [d3.linkVertical()](https://github.com/d3/d3-shape#linkVertical)
+ [d3.linkHorizontal()](https://github.com/d3/d3-shape#linkHorizontal)
+ [link(arguments...)](https://github.com/d3/d3-shape#_link)
+ [link.source([source])](https://github.com/d3/d3-shape#link_source)
+ [link.target([target])](https://github.com/d3/d3-shape#link_target)
+ [link.x([x])](https://github.com/d3/d3-shape#link_x)
+ [link.y([y])](https://github.com/d3/d3-shape#link_y)
+ [link.context([context])](https://github.com/d3/d3-shape#link_context)

## Link Radial
+ [d3.linkRadial()](https://github.com/d3/d3-shapes#linkRadial)
+ [linkRadial.angle([angle])](https://github.com/d3/d3-shapes#linkRadial_angle)
+ [linkRadial.radius([radius])](https://github.com/d3/d3-shapes#linkRadial_radius)