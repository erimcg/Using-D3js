{{meta {docid: partitions}}}

<script src="https://d3js.org/d3.v4.min.js"></script>

<style>
rect {
  fill: aquamarine;
  opacity: 1.0;
  stroke: white;
}
</style>



# Partition Layouts

The partition layout represents nodes in a hierarchy model as rectangles with rectangles for child nodes positioned adjacent to the rectangles for their parents' and the length of a rectangle being proportional to the value of the node's `value` property.

Below we show a tree and a partition, both created using the same hierarchal model.

```
<script>
var data = {"name": "A", "children": [
                {"name": "B"},
                {"name": "C", "children": [
                    {"name": "E"},
                    {"name": "F"}
                ]},
                {"name": "D"},
                {"name": "G"},
                {"name": "H", "children": [
                    {"name": "I"},
                    {"name": "J"}
                ]},
                {"name": "K"},
                {"name": "L"},
                {"name": "M", "children": [
                  {"name": "M"},
                  {"name": "N"}
                ]},
                {"name": "O"}
            ]};

var drawTree = function() {
  let root = d3.hierarchy(data)
    .count();

  let treeLayout4 = d3.tree()
    .size([200, 200]);

  treeLayout4(root);

  let svg = d3.select("#demo1");

  // draw links
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

  // draw nodes
  svg.select('g.nodes')
    .selectAll('circle.node')
    .data(root.descendants())
    .enter()
    .append('circle')
    .classed('node', true)
    .attr('cx', function(d) {return d.x;})
    .attr('cy', function(d) {return d.y;})
    .attr('r', 6)
    .attr("fill", "lightblue")
    .attr('stroke', "darkgray")
    .attr('stroke-width', 1);
};

var drawPartition = function() {
  let root = d3.hierarchy(data)
  .count();

  let partition = d3.partition()
    .size([210,210]);

  partition(root);

  d3.select("#demo2")
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

drawTree();
drawPartition();

</script>

<svg id="demo1" width=250 height=250>
    <g transform="rotate(-90), translate(-220,10)">
      <g class="rects"></g>
      <g class="links"></g>
      <g class="nodes"></g>
    </g>
</svg>

<svg id="demo2" width=250 height=250 transform="rotate(-90), translate(20,0)"></svg>
```

## Creating the Layout

We generate a partion layout using [d3.partition()](https://github.com/d3/d3-hierarchy#partition) and can specify the height and width of the layout region by chaining a call to [partion.size([width,height])](https://github.com/d3/d3-hierarchy#partition_size).

The [partition.round([boolean])](https://github.com/d3/d3-hierarchy#partition_round) method takes a boolean as an argument and sets whether or not the layout will round to exact pixel boundaries.

Below we illustrate the [partition.padding([padding])](https://github.com/d3/d3-hierarchy#partition_padding) method which puts space between adjacent children and between children and their parent.  Note that we also sort the nodes in the hierarchal model before we  call the partition layout function.

```
<script>
var data = {"name": "A", "children": [
                {"name": "B"},
                {"name": "C", "children": [
                    {"name": "E"},
                    {"name": "F"}
                ]},
                {"name": "D"},
                {"name": "G"},
                {"name": "H", "children": [
                    {"name": "I"},
                    {"name": "J"}
                ]},
                {"name": "K"},
                {"name": "L"},
                {"name": "M", "children": [
                  {"name": "M"},
                  {"name": "N"}
                ]},
                {"name": "O"}
            ]};

var root = d3.hierarchy(data)
  .sort((a,b) => b.height - a.height || a.data.name.localeCompare(b.data.name))
  .count();

var partition = d3.partition()
  .size([210,210])
  .padding(10);

partition(root);

d3.select("#demo3")
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

<svg id="demo3" width=250 height=250 transform="rotate(-90), translate(20,0)"></svg>
```

The partition layout, when called, adds `x0`, `y0`, `x1`, and `y1` properties, representing rectangles, in each node of the hierarchal model that is passed as an argument to the layout function.  The values of these properties are dependent on the values in the nodes' `value` properties.  As mentioned in the hierarchy section, the `node.sum` and `node.count` methods can be called on the root node to set the `value` properties of each node in the hierarchy.