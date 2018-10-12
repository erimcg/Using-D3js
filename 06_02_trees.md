{{meta {docid: trees}}}

<script src="https://d3js.org/d3.v4.min.js"></script>


# Trees

[d3.tree()](https://github.com/d3/d3-hierarchy/blob/master/README.md#tree) returns a layout function that, when called, sets x and y coordinates for each node in the hierarchy in a manner that keeps nodes that are at the same level aligned.

Below we create a hierarchal model of some data, call a tree layout function to establish x and y coodinates for the nodes, and render circles and lines to represent nodes and lines, respectively.

```
<svg id="demo1" width=200 height=120>
    <g transform="translate(10,10)">
      <g class="links"></g>
      <g class="nodes"></g>
    </g>
</svg>

<script>
var data = {"name": "A", "children": [
                {"name": "B"},
                {"name": "C", "children": [
                    {"name": "E"},
                    {"name": "F"}
                ]},
                {"name": "D"}
            ]};

var root = d3.hierarchy(data);

var treeLayout = d3.tree()
   .size([180, 100]);

treeLayout(root);

// Select the SVG element
var svg = d3.select("#demo1");

// Links
svg.select('g.links')
  .selectAll('line.link')
  .data(root.links())
  .enter()
  .append('line')
  .classed('link', true)
  .attr('x1', function(d) {return d.source.x;})
  .attr('y1', function(d) {return d.source.y;})
  .attr('x2', function(d) {return d.target.x;})
  .attr('y2', function(d) {return d.target.y;})
  .attr('stroke', "darkgray")
  .attr('stroke-width', 2);


svg.select('g.nodes')
  .selectAll('circle.node')
  .data(root.descendants())
  .enter()
  .append('circle')
  .classed('node', true)
  .attr('cx', function(d) {return d.x;})
  .attr('cy', function(d) {return d.y;})
  .attr('r', 5)
  .attr("fill", "lightblue")
  .attr('stroke', "darkgray")
  .attr('stroke-width', 1);

</script>
```

We start by creating an `svg` element, like the one below, to hold the visual elements.

<pre>
&lt;svg id="demo1" width=200 height=120&gt;
     &lt;g transform="translate(10,10)"&gt;
         &lt;g class="links"&gt;&lt;/g&gt;
         &lt;g class="nodes"&gt;&lt;/g&gt;
     &lt;/g&gt;
&lt;/svg&gt;
</pre>

We pass a hierarchal data object to `d3.hierarchy` to create the hierarchal model and obtain a reference to the root node.

<pre>
var data = {"name": "A", "children": [
                {"name": "B"},
                {"name": "C", "children": [
                    {"name": "E"},
                    {"name": "F"}
                ]},
                {"name": "D"}
            ]};

var root = d3.hierarchy(data);
</pre>

Then, we create a tree layout function by calling `d3.tree` and set bounds on the dimensions of the tree by calling the `size` method.

<pre>
var treeLayout = d3.tree()
    .size([180, 100]);
</pre>

Next, we call the layout function, passing to it the root node.  The layout function adds `x` and `y` properties to each node in the model.

<pre>
treeLayout(root);
</pre>

We can see the `x` and `y` properties when inspecting the root object, as shown in the screenshot below.

<img src="img/screenshots/tree_node.png" alt="" height="300" />

After updating the model with position information (x and y properties), we use the position information to render the lines, one for each link, and the circles, one for each node.

To render the lines we join the link objects returned by `root.links` to an empty selection.  Each link has source.x, source.y, target.x, and target.y properties.  Then in the entry selection, we append a line element to the svg for each link.

To render the circles we join the data returned by `root.descendants` to an empty selection.  In the entry selection, we append a circle element for each of the descendant nodes.  Since the layout function added x and y properties to each node we can use them to position each circle elements.

<pre>
var svg = d3.select("#demo1");

svg.select('g.links')
    .selectAll('line.link')
    .data(root.links())
    .enter()
    .append('line')
    .attr('x1', function(d) {return d.source.x;})
    .attr('y1', function(d) {return d.source.y;})
    .attr('x2', function(d) {return d.target.x;})
    .attr('y2', function(d) {return d.target.y;})
    .attr('stroke', "darkgray")
    .attr('stroke-width', 2);

svg.select('g.nodes')
    .selectAll('circle.node')
    .data(root.descendants())
    .enter()
    .append('circle')
    .attr('cx', function(d) {return d.x;})
    .attr('cy', function(d) {return d.y;})
    .attr('r', 5)
    .attr("fill", "lightblue")
    .attr('stroke', "darkgray")
    .attr('stroke-width', 1);
</pre>

