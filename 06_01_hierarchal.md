{{meta {docid: hierarchal_layouts}}}

<script src="https://d3js.org/d3.v4.min.js"></script>

# Hierarchal Layouts

D3's <a href="https://github.com/d3/d3-hierarchy">hierarchy</a> module provides methods to layout (i.e. compute position and size values for) a set of visual elements.  These methods require a hierarchal model created from hierarchal data.

Hierarchal data is any data that can be modeled as a set of nodes (with one node denoted as the root node) and links between nodes representing parent-child relationships.  Below, for example, is a tree built from hierarchal data.

```
<style>
.node {
  fill: steelblue;
  stroke: none;
}

.link {
  fill: none;
  stroke: #ccc;
  stroke-width: 1px;
}
</style>

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

var treeLayout = d3.tree();
treeLayout.size([200, 100]);
treeLayout(root);

// Add links and nodes groups
var svg = d3.select("#demo1");

svg.append("g")
  .classed("links", true);
svg.append("g")
  .classed("nodes", true);

// Links
svg.select('g.links')
  .selectAll('line.link')
  .data(root.links())
  .enter()
  .append('line')
  .classed('link', true)
  .attr('x1', function(d) {return d.source.x + 10;})
  .attr('y1', function(d) {return d.source.y + 10;})
  .attr('x2', function(d) {return d.target.x + 10;})
  .attr('y2', function(d) {return d.target.y + 10;});


svg.select('g.nodes')
  .selectAll('circle.node')
  .data(root.descendants())
  .enter()
  .append('circle')
  .classed('node', true)
  .attr('cx', function(d) {return d.x + 10;})
  .attr('cy', function(d) {return d.y + 10;})
  .attr('r', 5);

</script>

<svg id="demo1" width=200 height=120></svg>
```

The hierarchal data used to create the tree is shown below.

<pre>
var data = {"name":"A", "value":10, "children":[
               {"name":"B", "value":5},
               {"name":"C", "value":5, "children":[
                   {"name":"E", "value":1},
                   {"name":"F", "value":1}]},
               {"name":"D", "value":5}]};
</pre>

This data is represented in JSON, where the *root* object with name "A" has 3 children in an array named "children".   Within that array are 3 objects with names "B", "C", and "D".  The object with name "C" also has children with the names "E" and "F".

## d3.hierarchy

The [d3.hierarchy(data[,children])](https://github.com/d3/d3-hierarchy#hierarchy) method builds a model, consisting of nodes and links, from a hierarchal data source.  This model, as we alluded to earlier, is a prerequisite for the d3 layout methods.  The method takes a root object as an argument and creates a node object for it.  It then traverses the data structure starting at the root.  As it traverses the data structure, if it finds a property named "children" it expects the value of that property to be an array of objects.  For each element in the array, it creates one new node and link object.

The `d3.hierarchy` method returns a node object representing the root which we can save in a variable.

<pre>
var root = d3.hierarchy(data);
</pre>

Each node in the model has the following fields:

+ node.data - the original object associated with this node
+ node.depth - the length of the path from this node to the root
+ node.height - the greatest distance from this node to a descendent leaf node
+ node.parent - a reference to the parent node (null for the root node)
+ node.children - an array of child nodes (null for leaf nodes)
+ node.value - optional - used by sum() and count()

Each node in the model also has the following methods to access other sets of nodes and links.

+ [node.ancestors()](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_ancestors) - returns an array of nodes from this node up to the root
+ [node.descendants()](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_descendants) - returns an array of all descendent nodes in topological order
+ [node.leaves()](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_descendants) - returns the array of leaf nodes
+ [node.path(target)](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_path) - returns the shortest path (???) from this node to the target node
+ [node.links()](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_links) - returns the links for this object; each link object has a source and a target field that hold references to nodes

The following methods can also be called on node objects.

+ [node.sum(value)](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_sum)
+ [node.count()](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_count)
+ [node.sort(compare)](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_sort)
+ [node.each(function)](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_each)
+ [node.eachAfter(function)](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_eachAfter)
+ [node.eachBefore(function)](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_eachBefore)
+ [node.copy()](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_copy)