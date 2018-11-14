{{meta {docid: trees}}}

<script src="https://d3js.org/d3.v4.min.js"></script>

# Treemaps

A treemap is a rectangular visualization of a hierarchal model where each weighted node in the model is represented by rectangle whose size is proportional to the node's weight.

The [d3.treemap()](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap) method returns a treemap layout with the default settings.

<pre>
let treemap = d3.treemap();
</pre>

Like with trees and clusters, there are a number of methods that can be called on the treemap layout.

+ [treemap.tile([tile])](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap_tile)
+ [treemap.size([size])](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap_size)
+ [treemap.round([round])](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap_round)
+ [treemap.padding([padding])](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap_padding)
+ [treemap.paddingInner([padding])](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap_padding)
+ [treemap.paddingOuter([padding])](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap_padding)
+ [treemap.paddingTop([padding])](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap_padding)
+ [treemap.paddingRight([padding])](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap_padding)
+ [treemap.paddingBottom([padding])](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap_padding)
+ [treemap.paddingLeft([padding])](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap_padding)

```
<style>
rect {
  fill: cadetblue;
  opacity: 0.3;
  stroke: white;
}
</style>

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

var root = d3.hierarchy(data);

root.sum(function(d) {
  return d.value;
});

var treemap = d3.treemap()
  .size([580,250])
  .paddingOuter(10);

treemap(root);

var svg = d3.select("#demo1");

svg.selectAll('rect.node')
  .data(root.descendants())
  .enter()
  .append('rect')
  .classed('node', true)
  .attr('x', d => d.x0)
  .attr('y', d => d.y0)
  .attr('width', d => d.x1 - d.x0)
  .attr('height', d => d.y1 - d.y0);

</script>

<svg id="demo1" width=580 height=250>

</svg>