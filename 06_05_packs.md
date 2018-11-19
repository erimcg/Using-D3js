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

In the example below we set the radius accessor function so that the radii are computed using `Math.random()`.  Click on the reset button to render the circles with a different set of radii.

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

[d3.packSiblings(cirlces)](https://github.com/d3/d3-hierarchy#packSiblings) positions takes an array of objects as an argument, each with an `r` property, and sets `x` and `y` properties in each object indicating the center of the circle.  *Note*: the array of objects that is passed to `packSiblings` need not be an array of svg circle elements.  It can simply be an array of objects with `r` properties as shown below.

<pre>
var circles = [{"r": 10},{"r": 20},{"r": 40}];
</pre>

Before calling `packSiblings` you may want to sort the objects according to `r` (in decreasing order) in order to get a dense packing.

<pre>
circles.sort((a,b) => b.r - a.r);
</pre>

```
<script>
var circles = [{"r": 10},
               {"r": 10},
               {"r": 10},
               {"r": 20},
               {"r": 20},
               {"r": 20},
               {"r": 40},
               {"r": 40},
               {"r": 40}];

circles.sort((a,b) => b.r - a.r);

d3.packSiblings(circles);

d3.select("#demo5 g")
  .selectAll('circle.node')
  .data(circles)
  .enter()
  .append('circle')
  .classed('node', true)
  .attr('cx', d => d.x)
  .attr('cy', d => d.y)
  .attr('r', d => d.r);

</script>

<svg id="demo5" width=250 height=250>
  <g  transform="translate(125,125)"></g>
</svg>
```

## Finding a Parent Circle

[d3.packEnclose(circles)](https://github.com/d3/d3-hierarchy#packEnclose) returns an object representing the smallest circle that encloses an array of objects representing circles.  Each object in the array must have `x`, `y`, and `r` properties, specifying the circle's center and radius respectively.  The object returned also has `x`, `y`, and `r` properties.

```
<script>
var circles = [{"r": 10},
               {"r": 10},
               {"r": 10},
               {"r": 20},
               {"r": 20},
               {"r": 20},
               {"r": 40},
               {"r": 40},
               {"r": 40}];

circles.sort((a,b) => b.r - a.r);

d3.packSiblings(circles);

var parent = d3.packEnclose(circles);
circles.push(parent);

d3.select("#demo6 g")
  .selectAll('circle.node')
  .data(circles)
  .enter()
  .append('circle')
  .classed('node', true)
  .attr('cx', d => d.x)
  .attr('cy', d => d.y)
  .attr('r', d => d.r);

</script>

<svg id="demo6" width=250 height=250>
  <g  transform="translate(125,125)"></g>
</svg>
```