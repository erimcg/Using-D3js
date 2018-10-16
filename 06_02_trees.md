{{meta {docid: trees}}}

<script src="https://d3js.org/d3.v4.min.js"></script>


# Trees

[d3.tree()](https://github.com/d3/d3-hierarchy/blob/master/README.md#tree) is a function generator that returns a layout function that, when passed a root object of a hierarchy, sets the x and y coordinates for each node in the hierarchy in a manner that keeps nodes that are at the same level aligned.

Below we create a hierarchal model of some trivial data, call a tree layout function to establish the x and y coordinates for the nodes, and render circles and lines to represent nodes and edges of the tree, respectively.

```
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
   .size([580, 80]);

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
  .attr('r', 10)
  .attr("fill", "lightblue")
  .attr('stroke', "darkgray")
  .attr('stroke-width', 1);
</script>

<svg id="demo1" width=600 height=100>
    <g transform="translate(0,10)">
      <g class="links"></g>
      <g class="nodes"></g>
    </g>
</svg>
```

## Example Explained

We start by creating an `svg` element, like the one below, to hold the visual elements.  Notice that svg element has a group element that is translated 10 pixels down.  We do this because the layout function, as we'll see later, positions the y-coordinate of the root element at 0.  When we draw nodes, we'll make their radii 10 pixels.  Since the center of the root will be at *y=0*, we translate the entire tree down by 10, so that we can see the entire root node.

<pre>
&lt;svg id="demo1" width=600 height=100&gt;
     &lt;g transform="translate(0,10)"&gt;
         &lt;g class="links"&gt;&lt;/g&gt;
         &lt;g class="nodes"&gt;&lt;/g&gt;
     &lt;/g&gt;
&lt;/svg&gt;
</pre>

We pass a hierarchal data object to `d3.hierarchy` to create the hierarchal model and to obtain a reference to the root node.

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

Then, we create a tree layout function by calling `d3.tree` and chain a call to [tree.size([size])](https://github.com/d3/d3-hierarchy/blob/master/README.md#tree_size) to set the bounds on the dimensions of the tree based on the size of the svg element in which the tree will be rendered.  The layout function will then compute x and y coordinates for the nodes so that they fill the region.  In the example we specify a region 580 pixels wide and 80 pixels high.

<pre>
var treeLayout = d3.tree()
    .size([580, 80]);
</pre>

Next, we *call* the layout function, passing it the root node.  The layout function adds `x` and `y` properties to each node in the model.

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
    .attr('r', 10)
    .attr("fill", "lightblue")
    .attr('stroke', "darkgray")
    .attr('stroke-width', 1);
</pre>

## Tree Methods

The `d3.tree` tree layout function generator has three methods that can be called to initialize the layout function.  These methods are:

* [tree.size([size])](https://github.com/d3/d3-hierarchy/blob/master/README.md#tree_size) - sets spacial bounds on the positioning of the nodes.
* [tree.nodeSize([size])](https://github.com/d3/d3-hierarchy/blob/master/README.md#tree_nodeSize) - informs the layout algorithm of the intended size of the nodes, rather than spacial bounds.
* [tree.separation([separation])](https://github.com/d3/d3-hierarchy/blob/master/README.md#tree_separation) - specifies a function used to determine the desired separation between two nodes placed adjacent to one another.


### tree.nodeSize

The `tree.nodeSize([width, height) takes as an argument a pair of values that represent the height and width of the nodes and returns a tree layout function.

`
var treeLayout = d3.tree()
   .nodeSize([20, 20]);
`

When the layout function is called the root node is positioned at (0,0) and the other nodes in the tree are packed together as closely as possible without overlapping.

In the example below, since the root of the tree is positioned at (0,0) in order to see all of the nodes in the tree we have to translate the entire tree 30 pixels to the right and 10 pixels down.

```
<script>
var data = {"name": "A", "size": 15, "children": [
                {"name": "B", "size": 10},
                {"name": "C", "size": 10, "children": [
                    {"name": "E", "size": 5},
                    {"name": "F", "size": 5}
                ]},
                {"name": "D", "size": 10}
            ]};

var root = d3.hierarchy(data);

var treeLayout2 = d3.tree()
   .nodeSize([20, 20]);

treeLayout2(root);

// Select the SVG element
var svg2 = d3.select("#demo2");

// Links
svg2.select('g.links')
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


svg2.select('g.nodes')
  .selectAll('circle.node')
  .data(root.descendants())
  .enter()
  .append('circle')
  .classed('node', true)
  .attr('cx', function(d) {return d.x;})
  .attr('cy', function(d) {return d.y;})
  .attr('r', 10)
  .attr("fill", "lightblue")
  .attr('stroke', "darkgray")
  .attr('stroke-width', 1);
</script>

<svg id="demo2" width=200 height=60>
    <g transform="translate(30,10)">
      <g class="links"></g>
      <g class="nodes"></g>
    </g>
</svg>
```

### tree.separation

The `tree.separation` method is intended to be used with `tree.nodeSize`.  The method takes a function as an argument and returns a tree layout function.  The function argument must take two nodes as arguments and return a number that specifies the desired separation between the two nodes.

```
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

var treeLayout3 = d3.tree()
  .nodeSize([20,20])
  .separation((a,b) => 2);

treeLayout3(root);

// Select the SVG element
var svg3 = d3.select("#demo3");

// Links
svg3.select('g.links')
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


svg3.select('g.nodes')
  .selectAll('circle.node')
  .data(root.descendants())
  .enter()
  .append('circle')
  .classed('node', true)
  .attr('cx', function(d) {return d.x;})
  .attr('cy', function(d) {return d.y;})
  .attr('r', 10)
  .attr("fill", "lightblue")
  .attr('stroke', "darkgray")
  .attr('stroke-width', 1);
</script>

<svg id="demo3" width=600 height=80>
    <g transform="translate(110,10)">
      <g class="links"></g>
      <g class="nodes"></g>
    </g>
</svg>
```
