{{meta {docid: packs}}}

<script src="https://d3js.org/d3.v4.min.js"></script>

<style>
circle {
  fill: cadetblue;
  opacity: 0.3;
  stroke: black;
}
</style>

# Circle-Packing Layouts

The circle-pack layout represents nodes in a hierarchal model as circles and positions each child node's circle inside its parent's circle.

```
<script>
var data = {"children": [
                {"children": [
                  {"stat": 1},
                  {"stat": 1},
                  {"stat": 1}
                ]},
                {"children": [
                  {"stat": 1},
                  {"stat": 1},
                  {"stat": 2},
                  {"stat": 3}
                ]},
                {"children": [
                  {"stat": 1},
                  {"stat": 1},
                  {"stat": 1},
                  {"stat": 1},
                  {"stat": 2},
                  {"stat": 2},
                  {"stat": 2},
                  {"stat": 4},
                  {"stat": 4},
                  {"stat": 8}
                ]},
            ]};

var root = d3.hierarchy(data)
  .sum(d => d.hasOwnProperty("stat") ? d.stat : 0)
  .sort((a,b) => b.value - a.value);

var partition = d3.pack()
  .size([250,250]);

partition(root);

d3.select("#demo1 g")
  .selectAll('circle.node')
  .data(root.descendants())
  .enter()
  .append('circle')
  .classed('node', true)
  .attr('cx', d => d.x)
  .attr('cy', d => d.y)
  .attr('r', d => d.r);
</script>

<svg id="demo1" width=260 height=260>
  <g  transform="translate(5,5)"></g>
</svg>
```

## Getting Tightly Packed Circles

Sorting the hierarchal model may be necessary to produce a layout that tightly packs the circles.  Below is an example that uses a hierarchal model that is not sorted.  As you can see, the circles are not packed as tightly as when the hierarchal model is sorted.

```
<script>
var data = {"children": [
                {"children": [
                  {"stat": 1},
                  {"stat": 1},
                  {"stat": 1}
                ]},
                {"children": [
                  {"stat": 1},
                  {"stat": 1},
                  {"stat": 2},
                  {"stat": 3}
                ]},
                {"children": [
                  {"stat": 1},
                  {"stat": 1},
                  {"stat": 1},
                  {"stat": 1},
                  {"stat": 2},
                  {"stat": 2},
                  {"stat": 2},
                  {"stat": 4},
                  {"stat": 4},
                  {"stat": 8}
                ]},
            ]};

var root = d3.hierarchy(data)
  .sum(d => d.hasOwnProperty("stat") ? d.stat : 0);

var partition = d3.pack()
  .size([250,250]);

partition(root);

d3.select("#demo2 g")
  .selectAll('circle.node')
  .data(root.descendants())
  .enter()
  .append('circle')
  .classed('node', true)
  .attr('cx', d => d.x)
  .attr('cy', d => d.y)
  .attr('r', d => d.r);
</script>

<svg id="demo2" width=260 height=260>
  <g  transform="translate(5,5)"></g>
</svg>
```

## Creating a Circle-Packing Layout

The [d3.pack()](https://github.com/d3/d3-hierarchy#pack) method is a function generator that returns a circle-packing layout.  We can chain a call to [pack.size([width,height])](https://github.com/d3/d3-hierarchy#pack_size) to set the size of the rendering area.

We can also chain a call to [pack.padding([padding])](https://github.com/d3/d3-hierarchy#pack_padding) to add padding between tangent circles and between the enclosing parents' circles and their children.

Below we create a circle-packing with padding set to 10 pixels.

```
<script>
var data = {"children": [
                {"children": [
                  {"stat": 1},
                  {"stat": 1},
                  {"stat": 1}
                ]},
                {"children": [
                  {"stat": 1},
                  {"stat": 1},
                  {"stat": 2},
                  {"stat": 3}
                ]},
                {"children": [
                  {"stat": 1},
                  {"stat": 1},
                  {"stat": 1},
                  {"stat": 1},
                  {"stat": 2},
                  {"stat": 2},
                  {"stat": 2},
                  {"stat": 4},
                  {"stat": 4},
                  {"stat": 8}
                ]},
            ]};

var root = d3.hierarchy(data)
  .sum(d => d.hasOwnProperty("stat") ? d.stat : 0)
  .sort((a,b) => b.value - a.value);

var partition = d3.pack()
  .size([250,250])
  .padding(10);

partition(root);

d3.select("#demo3 g")
  .selectAll('circle.node')
  .data(root.descendants())
  .enter()
  .append('circle')
  .classed('node', true)
  .attr('cx', d => d.x)
  .attr('cy', d => d.y)
  .attr('r', d => d.r);
</script>

<svg id="demo3" width=260 height=260>
  <g  transform="translate(5,5)"></g>
</svg>
```

## Setting the Radius Accessor Function

[pack.radius([radius])](https://github.com/d3/d3-hierarchy#pack_radius) is used to set the radius accessor function.  The method takes a function as an argument and returns the layout.  By default, the radius is derived from the node's `value` property.

In the example below we change the radius accessor function so that the radii are computed using `Math.random()`.

```
<script>
var data = {"children": [
                {"children": [
                  {"stat": 1},
                  {"stat": 1},
                  {"stat": 1}
                ]},
                {"children": [
                  {"stat": 1},
                  {"stat": 1},
                  {"stat": 2},
                  {"stat": 3}
                ]},
                {"children": [
                  {"stat": 1},
                  {"stat": 1},
                  {"stat": 1},
                  {"stat": 1},
                  {"stat": 2},
                  {"stat": 2},
                  {"stat": 2},
                  {"stat": 4},
                  {"stat": 4},
                  {"stat": 8}
                ]},
            ]};

var root = d3.hierarchy(data)
  .sum(d => d.hasOwnProperty("stat") ? d.stat : 0)
  .sort((a,b) => b.value - a.value);

var partition = d3.pack()
  .radius(d => Math.random() * 20)
  .size([250,250])

partition(root);

d3.select("#demo4 g")
  .selectAll('circle.node')
  .data(root.descendants())
  .enter()
  .append('circle')
  .classed('node', true)
  .attr('cx', d => d.x)
  .attr('cy', d => d.y)
  .attr('r', d => d.r);
</script>

<svg id="demo4" width=260 height=260>
  <g  transform="translate(5,5)"></g>
</svg>
```

## Packing an Array of Circles

[d3.packSiblings(cirlces)](https://github.com/d3/d3-hierarchy#packSiblings) positions each of the circles in the given array in a circle-packing by setting `x` and `y` properties in each circle object.  Each of the circles in the array must have a property named `r` set to the value of its radius.

## Finding a Parent Circle

[d3.packEnclose(circles)](https://github.com/d3/d3-hierarchy#packEnclose) computes the smallest circle that encloses the circles in the specified array.  Each circle in the array must have `x`, `y`, and `r` properties, specifying the cirlce's center and radius respectively.
