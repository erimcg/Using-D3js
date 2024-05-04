{{meta {docid: treemaps}}}
{{meta {description: ""}}}

<script src="https://d3js.org/d3.v4.min.js"></script>

<style>
rect {
  fill: cadetblue;
  opacity: 0.3;
  stroke: white;
}
</style>

# Treemaps

A treemap is a rectangular visualization for a hierarchal model as shown below.

```
<script>
var data = {"value": 45.25, "children": [
                {"value": 2.25},
                {"value": 1},
                {"value": 3},
                {"value": 3},
                {"value": 4},
                {"value": 3},
                {"value": 6},
                {"value": 11},
                {"value": 3},
                {"value": 2},
                {"value": 5.25},
                {"value": 1.50},
                {"value": 0.25}
            ]};

var root = d3.hierarchy(data);

var treemap = d3.treemap()
  .size([580,250])
  .paddingOuter(10);

treemap(root);

d3.select("#demo1")
  .selectAll('rect.node')
  .data(root.descendants())
  .enter()
  .append('rect')
  .classed('node', true)
  .attr('x', d => d.x0)
  .attr('y', d => d.y0)
  .attr('width', d => d.x1 - d.x0)
  .attr('height', d => d.y1 - d.y0);
</script>

<svg id="demo1" width=580 height=250></svg>
```

Each node in the model is represented by a rectangle in the visualization and the rectangles for child nodes are placed within the rectangles for the parent nodes.  For example, in the treemap shown above, each of the darker green inner rectangles represent nodes that are children of a parent node that is represented by the lighter green outer rectangle.

## The Treemap Layout

[d3.treemap()](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap) is a function generator that returns a new treemap layout.  When we call the treemap layout, we pass it the root of a hierarchy model.  It then computes the location for each rectangle and sets 4 properties in each node: `x0`, `y0`, `x1`, and `y1`.  These properties represent the top left and bottom right corners of the rectangle.

The proportion of space that a child's rectangle covers inside its parent's rectangle is based on the values in the child's and the parent's `value` attributes.  For example, to fully pack a parent rectangle with rectangles for its children, the parent's `value` property should be equal to the sum of the childrens' `value` properties.

The location of each rectangle is determined by the tiling method used.  D3 supports 6 [built-in](https://github.com/d3/d3-hierarchy#treemap-tiling) tiling methods which will be discussed later.  The default tiling method is [d3.treemapSquarify](https://github.com/d3/d3-hierarchy#treemapSquarify).  To change the tiling method we can call [treemap.tile([tile])](https://github.com/d3/d3-hierarchy#treemap_tile).

The default size of the outermost rectangle is [1,1].  To change the size we can call [treemap.size([width,height])](https://github.com/d3/d3-hierarchy#treemap_size).


## Creating a Treemap

To create a treemap we do the following:

+ Get the root element from a d3.hierarchy model.
+ If any node in the model doesn't have a `value` attribute, add it.
+ Create a new treemap layout, setting the size and tiling method, if necessary.
+ Call the treemap layout function, passing it the root of the hierarchy model. This creates `x0`, `y0`, `x1`, and `y1` properties in each node.
+ Render the rectangles using the `x0`, `y0`, `x1`, and `y1` properties.

## Setting the Value Properties

The D3 `node` object has various methods that can be called to set the `value` properties if the objects in the data passed to `d3.hierarchy` don't have value properties.  Both [node.sum(function)](https://github.com/d3/d3-hierarchy#node_sum) and [node.eachAfter(function)](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_eachAfter) traverse the herarchy in post-order traversal.

`node.sum` is an accumulator method that takes a function as an argument and returns the node.  The function that is passed to `node.sum` is called for each node and when called, it is passed the data object (not the node itself) associated with the node.  The value set in the node's `value` property is equal to the value returned by the `sum's` function argument plus the sum of the values stored in each child node's `value` property.

In the two examples below, our data consists of a root node for New York City, and 5 child nodes, one for each borough.  Each borough object has a `population` property, but the root node does not.  None of the nodes have a value property.

We can create value properties in each node in various ways.  The simplest way is to call `root.sum` and pass it a function which returns the population value if one exists otherwise it returns 0.

<pre>
root.sum(d => d.hasOwnProperty("population") ? d.population : 0);
</pre>

Recall, the `sum` method sets the `value` properties automatically.  Since the borough nodes have `population` properties and do not have children, their `value` property in each node will be set equal to the value in their `population` property plus 0.  The node for New York City, however does not have a `population` property but does have children, so the value for its `value` property will be set to 0 plus the sum of its children's `value` properties.

An alternative way to set the `value` properties is to set them manually using `node.eachAfter`, as shown below and as illustrated in the second example.

<pre>
root.eachAfter(d => {
  if (!d.hasOwnProperty("children")) {
    d.value = d.data.population;
  }
  else {
    d.value = 0;
    for (var i in d.children)
        d.value += d.children[i].value;
  }
});

</pre>

```
<script>
var data = {"name": "New York City", "children": [
                {"name": "Bronx", "population": 1471160},
                {"name": "Brooklyn", "population": 2648771},
                {"name": "Manhattan", "population": 1664727},
                {"name": "Queens", "population": 2358582},
                {"name": "Staten Island", "population": 479458}
            ]};

var drawTreemap = function(id) {
  let root = d3.hierarchy(data);

  if (id === "demo2") {
    root.sum(d => d.hasOwnProperty("population") ? d.population : 0);
  }
  else if (id === "demo3") {
    root.eachAfter(d => {
      if (!d.hasOwnProperty("children")) {
        d.value = d.data.population;
      }
      else {
        d.value = 0;
        for (var i in d.children)
            d.value += d.children[i].value;
      }
    });
  }

  let treemap = d3.treemap()
    .size([250,250])
    .paddingOuter(10);

  treemap(root);

  d3.select("#" + id)
    .selectAll('rect.node')
    .data(root.descendants())
    .enter()
    .append('rect')
    .classed('node', true)
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0);
};

drawTreemap("demo2");
drawTreemap("demo3");
</script>

<svg id="demo2" width=250 height=250></svg>
<svg id="demo3" width=250 height=250></svg>
```


## Sorting the Nodes

A treemap visualization is often more informative when sibling rectangles are positioned from largest to smallest.  To accomplish this we simply need to sort the nodes using [node.sort(compare)](https://github.com/d3/d3-hierarchy#node_sort) prior to calling the treemap layout. In the example below we set the `value` properties and then sort the nodes by descending height and for nodes at the same height by descending value.

<pre>
var root = d3.hierarchy(data)
  .sum(d => d.hasOwnProperty("population") ? d.population : 0)
  .sort((a, b) => b.height - a.height || b.value - a.value);
</pre>

```
<script>
var data = {"name": "New York City", "children": [
                {"name": "Bronx", "population": 1471160},
                {"name": "Brooklyn", "population": 2648771},
                {"name": "Manhattan", "population": 1664727},
                {"name": "Queens", "population": 2358582},
                {"name": "Staten Island", "population": 479458}
            ]};

var root = d3.hierarchy(data)
  .sum(d => d.hasOwnProperty("population") ? d.population : 0)
  .sort((a, b) => b.value - a.value);

var treemap = d3.treemap()
  .size([250,250])
  .paddingOuter(10);

treemap(root);

d3.select("#demo4")
  .selectAll('rect.node')
  .data(root.descendants())
  .enter()
  .append('rect')
  .classed('node', true)
  .attr('x', d => d.x0)
  .attr('y', d => d.y0)
  .attr('width', d => d.x1 - d.x0)
  .attr('height', d => d.y1 - d.y0);
</script>

<svg id="demo4" width=250 height=250></svg>
```

## Tiling Methods

D3 provides the following 6 tiling methods:

+ [d3.treemapBinary(node, x0, y0, x1, y1)](https://github.com/d3/d3-hierarchy#treemapBinary)
+ [d3.treemapDice(node, x0, y0, x1, y1)](https://github.com/d3/d3-hierarchy#treemapDice)
+ [d3.treemapSlice(node, x0, y0, x1, y1)](https://github.com/d3/d3-hierarchy#treemapSlice)
+ [d3.treemapSliceDice(node, x0, y0, x1, y1)](https://github.com/d3/d3-hierarchy#treemapSliceDice)
+ [d3.treemapSquarify(node, x0, y0, x1, y1)](https://github.com/d3/d3-hierarchy#treemapSquarify)
+ [d3.treemapResquarify(node, x0, y0, x1, y1)](https://github.com/d3/d3-hierarchy#treemapResquarify)

We can change the tiling method using [treemap.tile([tile])](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap_tile).  Below are examples of each of the tiling methods on the same data set.  For more information on these tiling methods please consult the D3 API documentation.

```
<script>
var data = {"name": "New York City", "children": [
                {"name": "Bronx", "population": 1471160},
                {"name": "Brooklyn", "population": 2648771},
                {"name": "Manhattan", "population": 1664727},
                {"name": "Queens", "population": 2358582},
                {"name": "Staten Island", "population": 479458}
            ]};

var root = d3.hierarchy(data)
  .sum(d => d.hasOwnProperty("population") ? d.population : 0)
  .sort((a, b) => b.value - a.value);

var renderRect = function(id, tileMap) {

  var treemap = d3.treemap()
    .size([150,150])
    .tile(tileMap)
    .paddingOuter(5);

  treemap(root);

  d3.select("#" + id)
    .selectAll('rect.node')
    .data(root.descendants())
    .enter()
    .append('rect')
    .classed('node', true)
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0);
};

renderRect("demo5", d3.treemapBinary);
renderRect("demo6", d3.treemapDice);
renderRect("demo7", d3.treemapSlice);
renderRect("demo8", d3.treemapSliceDice);
renderRect("demo9", d3.treemapSquarify);
renderRect("demo10", d3.treemapResquarify);

</script>

<svg id="demo5" name="treemapBinary" width=150 height=150></svg>
<svg id="demo6" width=150 height=150></svg>
<svg id="demo7" width=150 height=150></svg><br>
<svg id="demo8" width=150 height=150></svg>
<svg id="demo9" width=150 height=150></svg>
<svg id="demo10" width=150 height=150></svg>

```

## Rounding

Per [D3v3](https://github.com/d3/d3-3.x-api-reference/blob/master/Treemap-Layout.md#round) the [treemap.round([round])](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap_round) method takes a boolean as an argument and "sets whether or not the treemap layout will round to exact pixel boundaries. This can be nice to avoid antialiasing artifacts in SVG."

## Padding

Each of the padding methods takes either a number or a function as an argument.  By default the inner padding is 0

+ [treemap.padding([padding])](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap_padding) - sets the inner and outer padding
+ [treemap.paddingInner([padding])](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap_padding) - inner padding separates child nodes.  If padding is a function it is called for each node that has children and passes in the current node.
+ [treemap.paddingOuter([padding])](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap_padding) - sets the top, right, bottom, and left padding.
+ [treemap.paddingTop([padding])](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap_padding) - separates the top edge of a node from its children.
+ [treemap.paddingRight([padding])](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap_padding) - separates the right edge of a node from its children.
+ [treemap.paddingBottom([padding])](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap_padding) - separates the bottom edge of a node from its children.
+ [treemap.paddingLeft([padding])](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap_padding) - separates the left edge of a node from its children.

Below are demonstrations of each of these in the order given above.

```
<script>
var data = {"value": 45.25, "children": [
                {"value": 2.25},
                {"value": 1},
                {"value": 3},
                {"value": 3},
                {"value": 4},
                {"value": 3},
                {"value": 6},
                {"value": 11},
                {"value": 3},
                {"value": 2},
                {"value": 5.25},
                {"value": 1.50},
                {"value": 0.25}
            ]};

var root = d3.hierarchy(data);

var renderRect = function(id) {

  let treemap = d3.treemap()
    .size([150,150]);

  if (id === "demo12")
    treemap.padding(10);
  else if (id === "demo13")
    treemap.paddingInner(10);
  else if (id === "demo14")
    treemap.paddingOuter(10);
  else if (id === "demo15")
    treemap.paddingTop(10);
  else if (id === "demo16")
    treemap.paddingRight(10);
  else if (id === "demo17")
    treemap.paddingBottom(10);
  else if (id === "demo18")
    treemap.paddingLeft(10);

  treemap(root);

  d3.select("#" + id)
    .selectAll('rect.node')
    .data(root.descendants())
    .enter()
    .append('rect')
    .classed('node', true)
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr('fill', d => d.height == 0 ? "cadetblue" : "pink");
};

renderRect("demo12");
renderRect("demo13");
renderRect("demo14");
renderRect("demo15");
renderRect("demo16");
renderRect("demo17");
renderRect("demo18");

</script>

<svg id="demo12" width=150 height=150></svg>
<svg id="demo13" width=150 height=150></svg>
<svg id="demo14" width=150 height=150></svg><br>
<svg id="demo15" width=150 height=150></svg>
<svg id="demo16" width=150 height=150></svg>
<svg id="demo17" width=150 height=150></svg>
<svg id="demo18" width=150 height=150></svg>

```