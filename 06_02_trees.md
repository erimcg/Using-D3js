{{meta {docid: trees}}}

<script src="https://d3js.org/d3.v4.min.js"></script>


# Trees

[d3.tree()](https://github.com/d3/d3-hierarchy/blob/master/README.md#tree) returns a layout function that can be used to layout the nodes in a hierarchal model as a tree.

We'll often see this method used to create visualization, like the one below, where the nodes are represented by circles and the links are represented by lines drawn between the pairs of circles.

```
<svg id="demo1" width=200 height=120>
    <g transform="translate(10,10)">
      <g class="links"></g>
      <g class="nodes"></g>
    </g>
</svg>

<script>
var data = {
    "name": "A", "value": 10,
    "children": [
         {"name": "B", "value": 5},
         {"name": "C", "value": 5,
          "children": [
              {"name": "E", "value": 1},
              {"name": "F", "value": 1}
          ]},
         {"name": "D", "value": 5}
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

For this example we'll create an `svg` element, like the one below, to hold the visualization.

<pre>
&lt;svg id="demo1" width=200 height=120&gt;
     &lt;g transform="translate(10,10)"&gt;
         &lt;g class="links"&gt;&lt;/g&gt;
         &lt;g class="nodes"&gt;&lt;/g&gt;
     &lt;/g&gt;
&lt;/svg&gt;
</pre>

We pass a hierarchal data object (below)

<pre>
var data = {"name":"A", "value":10, "children":[
               {"name":"B", "value":5},
               {"name":"C", "value":5, "children":[
                   {"name":"E", "value":1},
                   {"name":"F", "value":1}]},
               {"name":"D", "value":5}]};
</pre>

to `d3.hierarchy` to create the hierarchal model and obtain a reference to the root node.

<pre>
var root = d3.hierarchy(data);
</pre>

Then, we create a tree layout function by calling `d3.tree` and set bounds on the dimensions of the tree by calling the `size` method.

<pre>
>var treeLayout = d3.tree()
    .size([180, 100]);
</pre>

Next, we call the layout function, passing to it the root node.

<pre>
treeLayout(root);
</pre>

The layout function adds `x` and `y` properties to each node in the model.  This can be seen when inspecting the root object.

<img class="alignnone wp-image-4530 size-large" src="http://www.n0code.net/wp/csci240/wp-content/uploads/sites/2/2018/04/Screen-Shot-2018-04-12-at-11.35.51-PM-1024x669.png" alt="" width="708" height="463" />

After updating the model with position information, we select the SVG element.

<pre>
var svg = d3.select("#demo1");
</pre>

And render the lines, one for each link.

<pre>
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
</pre>

And render the circles, one for each node.

<pre>
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