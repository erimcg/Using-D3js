{{meta {docid: arcs_pie_charts}}}

<script src="https://d3js.org/d3.v5.min.js"></script>

<style>
    svg { background-color: white; display: inline-block; }
    .sandbox-output { text-align: center; }
    .link { fill: none; stroke: black;}
    .circle { r: 5px; fill: black; stroke: black; }
</style>

# Links

Links are paths that create a smooth Bézier curve from a source point to a target point.
When having a large amount of points that need to be shown as being connected, links can be used to easily show their relation.

Links can be used independently when the coordinates are predefined, or within a [hierarchical layouts](/06_01_hierarchal.html)where the points are computed based on the layout. [Hierarchical layouts](/06_01_hierarchal.html)are discussed in more detail in the next chapter.

There are three different types of link generators that D3 provides:
+ [d3.linkVertical()](https://github.com/d3/d3-shape#linkVertical) - Typically used when the root is on the left/right edge with the children going right/left.
+ [d3.linkHorizontal()](https://github.com/d3/d3-shape#linkHorizontal) - Typically used when the root is on the top/bottom edge with the children going down/up. 
+ [d3.linkRadial()](https://github.com/d3/d3-shape#linkRadial) - Typically used when the root is centered with the children spreading outwards from the root.

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
        .classed("circle", true);
        
	d3.select("#quickDemoH") //Adding the link paths
        .selectAll("path")
        .data(linkData)
        .join("path")
        .attr("d", link)
        .classed("link", true);

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
        .classed("circle", true);

    d3.select("#quickDemoV") //Adding the link paths
        .selectAll("path")
        .data(linkData)
        .join("path")
        .attr("d", link)
        .classed("link", true);

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
        .classed("circle", true)
        .attr("transform", "translate(100,100)");

    d3.select("#quickDemoR") //Adding the link paths
        .selectAll("path")
        .data(linkData)
        .join("path")
        .attr("d", link)
        .classed("link", true)
        .attr("transform", "translate(100,100)");

    d3.select("#quickDemoR") //Adding the text label
        .selectAll("text")
        .data(nodeData)
        .join("text")
        .attr("font-size", "12px")
        .attr("text-anchor", "left")
        .attr("x", d => d3.pointRadial(xAngleScale(d.x), yRadiusScale(d.y))[0] + 10)
        .attr("y", d => d3.pointRadial(xAngleScale(d.x), yRadiusScale(d.y))[1])
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

We can also take multiples of these objects and put them into an array:
<pre>
var multiLinkData = [
    {source: [50,50], target: [175,25]},
    {source: [50,50], target: [175,50]},
    {source: [50,50], target: [175,75]},
];
</pre>

From here we simply select our svg, add data, `join` `path`s, and set the `d` attribute of the `path`s to the link generator:

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
        .classed("link", true);
        
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
        .classed("link", true);
            
</script>

<svg id="singleLink" width="200" height="100"></svg>
<svg id="multiLink" width="200" height="100"></svg>
```

### `link.source()` and `link.target()`
In most situations, the source and target are not going to be separate and easily accessible from our data like they are in the previous examples. 
For these times the `.source()` and `.target()` can be manuelly changed to fit whatever data is being used.

Let's use the following data:
<pre>
var nodeData = [
    {id: "D3",      position: [100, 25],  parentPosition: [100, 25]},
    {id: "Scales",  position: [25, 175],  parentPosition: [100, 25]},
    {id: "Shapes",  position: [175, 175], parentPosition: [100, 25]}];
</pre>

Now instead of having an array of links, we have an array of nodes with positions and a parent position. 
We can take this array and create links between each node's position and it's parent position by setting the `source` and `target` of our link generator:

+ [link.source([source])](https://github.com/d3/d3-shape#link_source) - Where the link originates from, by default needs an array where `source[0]` is `x` and `source[1]` is `y`, however where source looks for `x` and `y` can be overridden 
+ [link.target([target])](https://github.com/d3/d3-shape#link_target) - Where the link goes to, same requirements as `link.source`

<pre>
var link = d3.linkHorizontal()
        .source(d => d.parentPosition)
        .target(d => d.position);
</pre>
For this example, the link generator will create a link from the parent position to the node position.


```
<script>
    var nodeData = [
        {id: "D3",       position: [100, 25],   parentPosition: [100, 25] },
        {id: "Scales",   position: [25, 175],   parentPosition: [100, 25] },
        {id: "Shapes",   position: [175, 175],  parentPosition: [100, 25] }];

    //Adding in circles where the node positions are
    d3.select("#demoSrcTar")
        .selectAll(".circle")
        .data(nodeData)
        .join("circle")
        .attr("cx", d => d.position[0])
        .attr("cy", d => d.position[1])
        .classed("circle", true);

    //Link generator with .source and .target set
    var link = d3.linkVertical()
        .source(d => d.parentPosition)
        .target(d => d.position);

    //Creating path elements by adding in our data and calling link
	d3.select("#demoSrcTar")
          .selectAll("path")
          .data(nodeData)
          .join("path")
          .attr("d", link)
          .classed("link", true);
          
    d3.select("#demoSrcTar")
          .selectAll("text")
          .data(nodeData)
          .join("text")
          .attr("font-size", "12px")
          .attr("text-anchor", "end")
          .attr("x", d => d.position[0] + 20)
          .attr("y", d => d.position[1] + 20)
          .text(n => n.id);
</script>

<svg id="demoSrcTar" width="200" height="200"></svg>
```

### `link.x()` and `link.y()`

Other times, we may want to have our `x` and `y` positions put through a scale so we do not have to manually compute their positions.
This can be very helpful in cases where our data is dynamic and we do not always know what exact positions to use.

+ [link.x([x])](https://github.com/d3/d3-shape#link_x)
+ [link.y([y])](https://github.com/d3/d3-shape#link_y)

For this example we will use a larger data set:
<pre>
var nodeData = [
    {id: "D3",       position: [2, 0], parentPosition: [2, 0]},
    {id: "Shapes",   position: [1, 1], parentPosition: [2, 0]},
    {id: "Scales",   position: [3, 1], parentPosition: [2, 0]},
    {id: "Links",    position: [0, 2], parentPosition: [1, 1]},
    {id: "Areas",    position: [1, 2], parentPosition: [1, 1]},
    {id: "Arcs",     position: [2, 2], parentPosition: [1, 1]},
    {id: "Ordinal",  position: [3, 2], parentPosition: [3, 1]},
    {id: "Quantize", position: [4, 2], parentPosition: [3, 1]}];
</pre>

In our new data array the positions are no longer absolute and should be put through a `d3.linearScale()` to get the real values that will be displayed in the svg. 

Since we changed how the real `x` and `y` positions are computed we will need to set up our link generator to accommodate this; we also need to set up our scales:
<pre>
var xScale = d3.scaleLinear().domain([0, 4]).range([25, 175]);
var yScale = d3.scaleLinear().domain([0,2]).range([25, 175]);

var linkGen = d3.linkVertical()
    .source(d => d.position)
    .target(d => d.parentPosition)
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]));
</pre>

```
<script>
    //Our larger node data
     var nodeData = [
        {id: "D3",       position: [2, 0], parentPosition: [2, 0]},
        {id: "Shapes",   position: [1, 1], parentPosition: [2, 0]},
        {id: "Scales",   position: [3, 1], parentPosition: [2, 0]},
        {id: "Links",    position: [0, 2], parentPosition: [1, 1]},
        {id: "Areas",    position: [1, 2], parentPosition: [1, 1]},
        {id: "Arcs",     position: [2, 2], parentPosition: [1, 1]},
        {id: "Ordinal",  position: [3, 2], parentPosition: [3, 1]},
        {id: "Quantize", position: [4, 2], parentPosition: [3, 1]}];

    //x and y scales
   var xScale = d3.scaleLinear().domain([0, 4]).range([25, 175]);
   var yScale = d3.scaleLinear().domain([0,2]).range([25, 175]);

    // Adding the circle nodes
    d3.select("#demoXY")
        .selectAll(".circle")
        .data(nodeData)
        .join("circle")
        .attr("cx", d => xScale(d.position[0]))
        .attr("cy", d => yScale(d.position[1]))
        .classed("circle", true);

    // Our link generator with the new .x() and .y() definitions
    var linkGen = d3.linkVertical()
    	.source(d => d.position)
        .target(d => d.parentPosition)
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]));

    // Adding the links
	d3.select("#demoXY")
          .selectAll("path")
          .data(nodeData)
          .join("path")
          .attr("d", linkGen)
          .classed("link", true);
             
    // Adding the text nodes
    d3.select("#demoXY")
          .selectAll("text")
          .data(nodeData)
          .join("text")
          .attr("font-size", "10px")
          .attr("text-anchor", "middle")
          .attr("x", d => xScale(d.position[0]))
          .attr("y", d => yScale(d.position[1]) + 15 )
          .text(d => d.id);
</script>

<svg id="demoXY" width="200" height="200"></svg>
```

### Using `d3.linkHorizontal()` and `d3.linkVertical()`

We have been using `d3.linkVertical()` for most of this section. `d3.linkVertical()` should be used when your graph is rooted at the top or bottom. 
Another link generator, `d3.linkHorizontal()` can be used when your graph is rooted to the left or right. 

It is easy to make a `d3.linkHorizontal()` graph out of an existing `d3.linkVertical()` graph. 
All we have to do is flip the `x` and `y` positions of a `d3.linkVertical()` graph and we will get a `d3.linkHorizontal()` graph.

You could do this by making a new array and flipping the `x` and `y` values, however an easier way is to flip the `x` and `y` in the `source` and `target` of `d3.linkHorizontal()`:
<pre>
var link = d3.linkHorizontal()
    .source( d => [d.position[1], d.position[0]] )
    .target( d => [d.parentPosition[1], d.parentPosition[0]] );
</pre>

Since we flipped the `x` and `y` positions in our link generator we will need to make sure to flip them when we are creating the `circle` and `text` nodes.

+ [d3.linkVertical()](https://github.com/d3/d3-shape#linkVertical) - The default link generator, assumes root at top or bottom.
+ [d3.linkHorizontal()](https://github.com/d3/d3-shape#linkHorizontal) - Assumes left to right, converted from `d3.linkVertical()` by flipping `x` and `y` positions.

```
<script>
    //Same data used for both diagrams
    var nodeData = [
        {id: "D3",       position: [100, 25],   parentPosition: [100,25] },
        {id: "Scales",   position: [25, 175],   parentPosition: [100, 25] },
        {id: "Shapes",   position: [175, 175],  parentPosition: [100, 25] }];
     
    //Begin making the horizontal link diagram
    var link = d3.linkHorizontal()
        .source( d => [d.position[1], d.position[0]] )
        .target( d => [d.parentPosition[1], d.parentPosition[0]] );
            
    d3.select("#demoH") //Adding the circle nodes
        .selectAll("circle")
        .data(nodeData)
        .join("circle")
        .attr("cx", d => d.position[1]) // Flipped X
        .attr("cy", d => d.position[0]) // Flipped Y
        .classed("circle", true);
        
	d3.select("#demoH") //Adding the link paths
        .selectAll("path")
        .data(nodeData)
        .join("path")
        .attr("d", link)
        .classed("link", true);

    d3.select("#demoH") //Adding the text labels
          .selectAll("text")
          .data(nodeData)
          .join("text")
          .attr("font-size", "12px")
          .attr("text-anchor", "middle")
          .attr("x", d => d.position[1]) // Flipped X
          .attr("y", d => d.position[0]+ 20) // Flipped Y
          .text(d => d.id);

    //Begin making the vertical link diagram
    var link = d3.linkVertical();
    
    d3.select("#demoV") //Adding the circle nodes
        .selectAll("circle")
        .data(nodeData)
        .join("circle")
        .attr("cx", d => d.position[0])
        .attr("cy", d => d.position[1])
        .classed("circle", true);

    d3.select("#demoV") //Adding the link paths
        .selectAll("path")
        .data(linkData)
        .join("path")
        .attr("d", link)
        .classed("link", true);

    d3.select("#demoV") //Adding the text label
        .selectAll("text")
        .data(nodeData)
        .join("text")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("x", d => d.id === "D3" ? d.position[0] + 15 : d.position[0])
        .attr("y", d => d.position[1] + 20)
        .text(n => n.id);
</script>
<svg id="demoH" width="200" height="200"></svg>
<svg id="demoV" width="200" height="200"></svg>
```

+ [d3.linkVertical()](https://github.com/d3/d3-shape#linkVertical)
+ [d3.linkHorizontal()](https://github.com/d3/d3-shape#linkHorizontal)

## Link Radial

D3 also provides a circular link generator, `d3.linkRadial()`. Just as with `d3.linkHorizontal()`, `d3.linkRadial()` can be easily converted from an existing `d3.linkVertical()` graph.

To convert a `d3.linkVertical()` into a `d3.linkRadial()` all we need to do is change our `x` position to become an `angle` and our `y` position will become the `radius`. We will also need to change our scales to reflect angles and radii.
Note that for this example the data set is expanded again.
<pre>
var xScale = d3.scaleLinear().domain([0, 8]).range([0, Math.PI * 2]);
var yScale = d3.scaleLinear().domain([0,2]).range([0, 80]);

var link = d3.linkRadial()
    .source(d => d.position)
    .target(d => d.parentPosition)
    .angle( d => xScale(d[0]))
    .radius( d => yScale(d[1]));
</pre>

Our `circle` and `text` nodes will no longer be at the right point without changing their coordinates as well, so we will use `d3.pointRadial`s to place them into the right spot.
<pre>
<i>circleSelection</i> | <i>textSelection</i>
    .attr("cx", d => d3.pointRadial(xScale(d.position[0]), yScale(d.position[1]) )[0] )
    .attr("cy", d => d3.pointRadial(xScale(d.position[0]), yScale(d.position[1]) )[1] )
</pre>
+ [d3.linkRadial()](https://github.com/d3/d3-shape#linkRadial)
+ [linkRadial.angle([angle])](https://github.com/d3/d3-shape#linkRadial_angle)
+ [linkRadial.radius([radius])](https://github.com/d3/d3-shape#linkRadial_radius)    
    
```
<script>
    //Our larger node data
     var nodeData = [
        {id: "D3",       position: [2, 0], parentPosition: [2, 0]},
        {id: "Shapes",   position: [1, 1], parentPosition: [2, 0]},
        {id: "Scales",   position: [3, 1], parentPosition: [2, 0]},
        {id: "Layouts",  position: [6, 1], parentPosition: [2, 0]},
        {id: "Links",    position: [0, 2], parentPosition: [1, 1]},
        {id: "Areas",    position: [1, 2], parentPosition: [1, 1]},
        {id: "Arcs",     position: [2, 2], parentPosition: [1, 1]},
        {id: "Ordinal",  position: [3, 2], parentPosition: [3, 1]},
        {id: "Quantize", position: [4, 2], parentPosition: [3, 1]},
        {id: "Tree", 	 position: [5, 2], parentPosition: [6, 1]},
        {id: "Cluster",	 position: [6, 2], parentPosition: [6, 1]},
        {id: "Partition",position: [7, 2], parentPosition: [6, 1]}];

   var xScale = d3.scaleLinear().domain([0, 8]).range([0, Math.PI * 2]);
   var yScale = d3.scaleLinear().domain([0,2]).range([0, 133]);

    d3.select("#demoRadial")
        .selectAll("circle")
        .data(nodeData)
        .join("circle")
        .attr("cx", d => d3.pointRadial(xScale(d.position[0]), yScale(d.position[1]) )[0] )
        .attr("cy", d => d3.pointRadial(xScale(d.position[0]), yScale(d.position[1]) )[1] )
        .classed("circle", true)
        .attr("transform", "translate(175,175)");

    var link = d3.linkRadial()
        .source(d => d.position)
        .target(d => d.parentPosition)
        .angle( d => xScale(d[0]))
        .radius( d => yScale(d[1]));

	d3.select("#demoRadial")
        .selectAll("path")
        .data(nodeData)
        .join("path")
        .attr("d", link)
        .classed("link", true)
        .attr("transform", "translate(175,175)");

    d3.select("#demoRadial")
        .selectAll("text")
        .data(nodeData)
        .join("text")
        .attr("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("x", function(d) {
        	if(d.position[1] == 2)
        	    return d3.pointRadial(xScale(d.position[0]), yScale(d.position[1]) + 25)[0];
            if(d.position[1] == 1){
                var xPos = d3.pointRadial(xScale(d.position[0]), yScale(d.position[1]))[0];
                xPos = xPos > 0 ? xPos - 25 : xPos + 15;
                return xPos;
            }                   
            return 0;})
        .attr("y", function(d){
        		return d.position[1] == 2 ? d3.pointRadial(xScale(d.position[0]), yScale(d.position[1]) + 20)[1] + 4 :
                	   d.position[1] == 1 ? d3.pointRadial(xScale(d.position[0]) + .15, yScale(d.position[1]) + 10)[1] :
                        					20 
                })
        .text(d => d.id)
        .attr("transform", "translate(175,175)");
</script>

<svg id="demoRadial" width="350" height="350"></svg>
```

+ [link.context([context])](https://github.com/d3/d3-shape#link_context)