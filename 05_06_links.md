{{meta {docid: arcs_pie_charts}}}

<script src="https://d3js.org/d3.v5.min.js"></script>

<style>
    svg { background-color: white; display: inline-block;}
    .sandbox-output { text-align: center;}
</style>

# Links

Links are paths that create a smooth Bézier curve from a source point to a target point.
When having a large amount of points that need to be shown as being connected, links can be used to easily show their relation.

Links can be used independently when the coordinates are predefined, or within a [hierarchical layouts](/06_01_hierarchal.html)where the points are computed based on the layout. [Hierarchical layouts](/06_01_hierarchal.html)are discussed in more detail in the next chapter.

There are three different types of link generators that D3 provides:
+ [d3.linkVertical()](https://github.com/d3/d3-shape/blob/master/src/link/index.js#L74) - Typically used when the root is on the left/right edge with the children going right/left.
+ [d3.linkHorizontal()](https://github.com/d3/d3-shape/blob/master/src/link/index.js#L70) - Typically used when the root is on the top/bottom edge with the children going down/up. 
+ [d3.linkRadial()](https://github.com/d3/d3-shape/blob/master/src/link/index.js#L78) - Typically used when the root is centered with the children spreading outwards from the root.

Quick example of each:
```
<script>
    //Same data used for both diagrams
    var nodeData = [
        {id: "D3",       x: 100, y: 25},
        {id: "Scales",   x: 25, y: 175},
        {id: "Shapes",   x: 175, y: 175}];

    var linkData = [
        {source: [100,25], target: [175,175]},   // D3 -> Shapes
        {source: [100,25], target: [25,175]}]; // D3 -> Scales
     
    //Begin making the horizontal link diagram
    var link = d3.linkHorizontal()
            .source(function(d) {
                return [d.source[1], d.source[0]];
            })
            .target(function(d) {
                return [d.target[1], d.target[0]];
            });
            
    d3.select("#quickDemoH") //Adding the Circle nodes
        .selectAll("circle")
        .data(nodeData)
        .join("circle")
        .attr("cx", d => d.y)
        .attr("cy", d => d.x)
        .attr("r", 5)
        .attr("stroke", "black")
        .attr("fill", "black");
        
	d3.select("#quickDemoH") //Adding the link paths
        .selectAll("path")
        .data(linkData)
        .join("path")
        .attr("d", link)
        .attr("fill", "none")
        .attr("stroke", "black");

    d3.select("#quickDemoH") //Adding the text labels
          .selectAll("text")
          .data(nodeData)
          .join("text")
          .attr("font-size", "12px")
          .attr("text-anchor", "middle")
          .attr("x", d => d.y)
          .attr("y", d => d.x + 20)
          .text(d => d.id);

    //Begin making the vertical link diagram
    var link = d3.linkVertical();
    
    d3.select("#quickDemoV") //Adding the circle nodes
        .selectAll("circle")
        .data(nodeData)
        .join("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 5)
        .attr("stroke", "black")
        .attr("fill", "black");

    d3.select("#quickDemoV") //Adding the link paths
        .selectAll("path")
        .data(linkData)
        .join("path")
        .attr("d", link)
        .attr("fill", "none")
        .attr("stroke", "black");

    d3.select("#quickDemoV") //Adding the text label
        .selectAll("text")
        .data(nodeData)
        .join("text")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("x", d => d.id === "D3" ? d.x + 15 : d.x) //If the node is the D3 node, move it over some so it fits right, otherwise d.x
        .attr("y", d => d.y + 20)
        .text(n => n.id);
    
    //Begin making radial link diagram
    var link = d3.linkRadial()
    				.angle(d => xAngleScale(d[0]))
                    .radius(d => yRadiusScale(d[1]));
    
    var xAngleScale = d3.scaleLinear().domain([25,175]).range([Math.PI, Math.PI *2 ]);
    var yRadiusScale = d3.scaleLinear().domain([25,175]).range([0, 80]);
    
    d3.select("#quickDemoR") //Adding the circle nodes
        .selectAll("circle")
        .data(nodeData)
        .join("circle")
        .attr("cx", d => d3.pointRadial(xAngleScale(d.x), yRadiusScale(d.y))[0])
        .attr("cy", d => d3.pointRadial(xAngleScale(d.x), yRadiusScale(d.y))[1])
        .attr("r", 5)
        .attr("stroke", "black")
        .attr("fill", "black")
        .attr("transform", "translate(100,100)");

    d3.select("#quickDemoR") //Adding the link paths
        .selectAll("path")
        .data(linkData)
        .join("path")
        .attr("d", link)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("transform", "translate(100,100)");

    d3.select("#quickDemoR") //Adding the text label
        .selectAll("text")
        .data(nodeData)
        .join("text")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("x", d => d.id === "D3" ? d3.pointRadial(xAngleScale(d.x) - 3, yRadiusScale(d.y) + 20)[0] : d3.pointRadial(xAngleScale(d.x) - .3, yRadiusScale(d.y))[0]) //If the node is the D3 node, move it over some so it fits right, otherwise d.x
        .attr("y", d => d3.pointRadial(xAngleScale(d.x), yRadiusScale(d.y) - 20)[1])
        .text(n => n.id)
        .attr("transform", "translate(100,100)");
</script>
<svg id="quickDemoV" width="200" height="200"></svg>
<svg id="quickDemoH" width="200" height="200"></svg>
<svg id="quickDemoR" width="200" height="200"></svg>
```

By default a link generator needs an object with a source and a target, which each are an array with two numbers representing the `x` and `y` values of where the link should start and end.

An example of a single link object and a default horizontal link generator:
<pre>
var linkGen = d3.linkHorizontal();
var singleLinkData = { source: [25,25], target: [75,75] } ;  
</pre>

We can then take multiples of these objects and put them into an array. Notice how all of the following start at the same point and branch off, this is a recurring theme with links:
<pre>
var multiLinkData = [
    {source: [50,50], target: [175,25]},
    {source: [50,50], target: [175,50]},
    {source: [50,50], target: [175,75]},
];
</pre>

From here we simply select our svg, add data, join and append `path`s, and set the `d` attribute of the `path`s to the link generator: 

<pre>
d3.select("#multiLink")
    .selectAll("path")
    .data(multiLinkData)
    .join("path")
    .attr("d", linkGen)
    .attr("fill", "none")
    .attr("stroke", "black");
</pre>

```
<script>
    //Link generator used for both examples
    var linkGen = d3.linkVertical();
    
    //The single object containing a link
    var singleLinkData = { source: [25,25], target: [175,75] }; 
        
    //Since the single link is not an array of links, we do not add the data of it, we only pass it into the generator    
	d3.select("#singleLink") 
        .append("path")
        .attr("d", linkGen(singleLinkData))
        .attr("fill", "none")
        .attr("stroke", "black");
        
    //The array of multiple links
    var multiLinkData = [
        {source: [100,25], target: [25,75]},
        {source: [100,25], target: [100,75]},
        {source: [100,25], target: [175,75]},
    ];
    
    //Since this is an array of links, we add its data then join to add our paths
    d3.select("#multiLink")
        .selectAll("path")
    	.data(multiLinkData)
        .join("path")
        .attr("d", linkGen)
        .attr("fill", "none")
        .attr("stroke", "black");
            
</script>

<svg id="singleLink" width="200" height="100"></svg>
<svg id="multiLink" width="200" height="100"></svg>
```

### Using d3.linkHorizontal() and d3.linkVertical()
```
<script>
    //Same data used for both diagrams
    var nodeData = [
        {id: "D3",       x: 100, y: 25},
        {id: "Scales",   x: 25, y: 175},
        {id: "Shapes",   x: 175, y: 175}];

    var linkData = [
        {source: [100,25], target: [175,175]},   // D3 -> Shapes
        {source: [100,25], target: [25,175]}]; // D3 -> Scales
     
    //Begin making the horizontal link diagram
    var link = d3.linkHorizontal()
            .source(function(d) {
                return [d.source[1], d.source[0]];
            })
            .target(function(d) {
                return [d.target[1], d.target[0]];
            });
            
    d3.select("#demoH") //Adding the Circle nodes
        .selectAll("circle")
        .data(nodeData)
        .join("circle")
        .attr("cx", d => d.y)
        .attr("cy", d => d.x)
        .attr("r", 5)
        .attr("stroke", "black")
        .attr("fill", "black");
        
	d3.select("#demoH") //Adding the link paths
        .selectAll("path")
        .data(linkData)
        .join("path")
        .attr("d", link)
        .attr("fill", "none")
        .attr("stroke", "black");

    d3.select("#demoH") //Adding the text labels
          .selectAll("text")
          .data(nodeData)
          .join("text")
          .attr("font-size", "12px")
          .attr("text-anchor", "middle")
          .attr("x", d => d.y)
          .attr("y", d => d.x + 20)
          .text(d => d.id);

    //Begin making the vertical link diagram
    var link = d3.linkVertical();
    
    d3.select("#demoV") //Adding the circle nodes
        .selectAll("circle")
        .data(nodeData)
        .join("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 5)
        .attr("stroke", "black")
        .attr("fill", "black");

    d3.select("#demoV") //Adding the link paths
        .selectAll("path")
        .data(linkData)
        .join("path")
        .attr("d", link)
        .attr("fill", "none")
        .attr("stroke", "black");

    d3.select("#demoV") //Adding the text label
        .selectAll("text")
        .data(nodeData)
        .join("text")
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

     d3.select("#demoE")
        .selectAll(".circle")
        .data(nodeData)
        .join("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 5)
        .attr("stroke", "black")
        .attr("fill", "black");

    var link = d3.linkHorizontal()
        .source(d => [xScale(nodeData.find(x => x.id === d.source).x), yScale(nodeData.find(y => y.id === d.source).y)])
        .target(d => [xScale(nodeData.find(x => x.id === d.target).x), yScale(nodeData.find(y => y.id === d.target).y)]);

	d3.select("#demoE")
          .selectAll("path")
          .data(linkData)
          .join("path")
          .attr("d", link)
          .attr("fill", "none")
          .attr("stroke", "black");
          
    d3.select("#demoE")
          .selectAll("text")
          .data(nodeData)
          .join("text")
          .attr("font-size", "12px")
          .attr("text-anchor", "middle")
          .attr("x", d => xScale(d.x))
          .attr("y", d => yScale(d.y) + 20)
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

    d3.select("#demoExy")
        .selectAll(".circle")
        .data(nodeData)
        .join("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 5)
        .attr("stroke", "black")
        .attr("fill", "black");

    var link = d3.linkHorizontal()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));

	d3.select("#demoExy")
          .selectAll("path")
          .data(linkData)
          .join("path")
          .attr("d", link)
          .attr("fill", "none")
          .attr("stroke", "black");
              
    d3.select("#demoExy")
          .selectAll("text")
          .data(nodeData)
          .join("text")
          .attr("font-size", "12px")
          .attr("text-anchor", "middle")
          .attr("x", d => xScale(d.x))
          .attr("y", d => yScale(d.y) + 20)
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
        .join("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 5)
        .attr("stroke", "black")
        .attr("fill", "black");

	d3.select("#demoEAll") //adds the link paths
      	  .selectAll("path")
      	  .data(nodeData)
          .join("path")
          .attr("d", link)
          .attr("fill", "none")
          .attr("stroke", "black");

    d3.select("#demoEAll") //adds the text labels
          .selectAll("text")
          .data(nodeData)
          .join("text")
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

   var xScale = d3.scaleLinear().domain([0, 2]).range([0, 80]);
   var yScale = d3.scaleLinear().domain([0,5]).range([0, Math.PI * 2]);

    d3.select("#demoRadial")
        .selectAll("circle")
        .data(nodeData)
        .join("circle")
        .attr("cx", d => d3.pointRadial(yScale(d.y), xScale(d.x))[0])
        .attr("cy", d => d3.pointRadial(yScale(d.y), xScale(d.x))[1])
        .attr("r", 5)
        .attr("stroke", "black")
        .attr("fill", "black")
        .attr("transform", "translate(100,100)");

    var link = d3.linkRadial()
        .angle(function(d) { return yScale(d.y); })
        .radius(function(d) { return xScale(d.x); });

	d3.select("#demoRadial")
        .selectAll("path")
        .data(linkData)
        .join("path")
        .attr("d", link)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("transform", "translate(100,100)");
        
    d3.select("#demoRadial")
          .selectAll("text")
          .data(nodeData)
          .join("text")
          .attr("font-size", "10px")
          .attr("text-anchor", "right")
          .attr("x", d => d3.pointRadial(yScale(d.y)-.2, xScale(d.x)+10)[0] )
          .attr("y", d => d3.pointRadial(yScale(d.y)-.2, xScale(d.x)+10)[1] )
          .text(d => d.id)
          .attr("transform", "translate(100,100)");
</script>

<svg id="demoRadial" width="200" height="200"></svg>
```