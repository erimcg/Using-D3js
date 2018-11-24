{{meta {docid: chords}}}

<script src="https://d3js.org/d3.v4.min.js"></script>

<style>
path {
  opacity: 0.9;
  }
</style>

# Chord Layout

The chord layout creates a circular layout for a weighted graph.

The chord library is included in the d3v4 library and can be loaded as a stand-alone library as well.

<pre>
&lt;script src="https://d3js.org/d3-chord.v1.min.js"&gt;&lt;/script&gt;
</pre>

```
<script>
var colors = ['#e45f56', '#a3d39c', '#7accc9', '#49aaa6', '#35404f'];

var m = [
  [0,1.1,1.2,1.3,1.4],
  [2.75,0,0,0,0],
  [1.75,0,0,0,0],
  [1.375,0,0,0,0],
  [0.125,0,0,0,0]];

var chord = d3.chord()
  .padAngle(0.175);

var chords = chord(m);

var ribbon = d3.ribbon()
  .radius(83);

d3.select("#demo1 g.links")
  .selectAll("path")
  .data(chords)
  .enter()
  .append("path")
  .attr("d", ribbon)
  .attr("fill", d => colors[d.source.index])
  .attr("stroke", "gray")
  .attr("stroke-width", 1);

var arcGen = d3.arc()
  .innerRadius(85)
  .outerRadius(90);

d3.select("#demo1 g.ring")
  .selectAll("path")
  .data(chords.groups)
  .enter()
  .append("path")
  .attr("d", arcGen)
  .attr("fill", d => colors[d.index])
  .attr("stroke", "gray")
  .attr("stroke-width", 1);
</script>

<svg id="demo1" width=200 height=200>
  <g class="ring" transform="translate(100,100)"></g>
  <g class="links" transform="translate(100,100)"></g>
</svg>
```

The graph is provided as an adjacency matrix.

<pre>
var m = [
  [0,1.1,1.2,1.3,1.4],
  [2.75,0,0,0,0],
  [1.75,0,0,0,0],
  [1.375,0,0,0,0],
  [0.125,0,0,0,0]];
</pre>

 Each row in matrix can be thought of as a set of weights for a set of directed edges that have a common source node. In other words, if `m[i][j]` has the value `k`, then we consider there to be an edge from `i` to `j` with a weight of `k`.  A value of 0 at `m[i][j]` indicates there is no edge from `i` to `j`.  In the example above, the first row contains [0,1.1,1.2,1.3,1.4] indicating there are edges from node 0 to nodes 1, 2, 3, and 4, with weights 1.1, 1.2, 1.3, and 1.4, respectively.

Nodes are represented as arcs, separated by padding, on the circumference of the circle.  The angle swept by a node's arc is proportional to the sum of the weights of the edges that start at the node.  In the example above, there are 5 arcs on the circumference of the circle, hence 5 nodes.  Since the sum of the weights of the nodes leaving node 0 is 5 and the sum of the weights of all of the nodes is 11, then the angle swept by the arc (in radians) for node 0 (the red one) is `4/11 * (2*PI - padding)`.

Edges are rendered as ribbons where the weight of an edge is represented by the width of the end of the ribbon near the arc of the source node.  If there are 2 edges between a pair of nodes, they are represented by a single ribbon.  The red ribbon for example, represents 2 edges one from node 0 to node 4 with a weight of 1.4, and an edge from node 4 to node 0 with a weight of 0.125.

## Creating a Chord Layout Generator

We create a chord layout using [d3.chord()](https://github.com/d3/d3-chord#chord).

<pre>
var chord = d3.chord()
  .padAngle(0.175);
</pre>

We can also chain the following methods to override the defaults.

+ [chord.padAngle([angle])](https://github.com/d3/d3-chord#chord_padAngle) - sets the pad angle (in radians). The default is 0.
+ [chord.sortGroups([compare])](https://github.com/d3/d3-chord#chord_sortGroups) - sets the comparator that is used to sort the nodes.  The comparator is passed two numbers representing the total weight of the edges emanating from two nodes.
+ [chord.sortSubgroups([compare])](https://github.com/d3/d3-chord#chord_sortSubgroups) - sets the comparator that is used to sort the edges of a node.
+ [chord.sortChords([compare])](https://github.com/d3/d3-chord#chord_sortChords) - sets the comparator that is used to determine the z-order of the chords.

See below for example uses.

## Creating a Set of Chords

When we call the chord layout we pass a matrix to it.  The return value is an array of chords.

<pre>
var chords = chord(m);
</pre>

 Each chord object has source and target properties that contain objects with the following properties:

+ startAngle - the start angle in radians
+ endAngle - the end angle in radians
+ value - the weight
+ index - the source node index
+ subindex - the target node index

Given an array of chords, we can render ribbons for the chords using [d3.ribbon()](https://github.com/d3/d3-chord#ribbon) as shown below.  There we create a ribbon generator, append a set of `path` elements to an `svg` element and use a ribbon generator to compute the path strings from the array of chords that is passed to data.

<pre>
var ribbon = d3.ribbon()
  .radius(83);

d3.select("#demo1 g#links")
  .selectAll("path")
  .data(chords)
  .enter()
  .append("path")
  .attr("d", ribbon)
  .attr("fill", d => colors[d.source.index])
  .attr("stroke", "gray")
  .attr("stroke-width", 1);
</pre>

## Using the Chord Methods

The original example was contrived so that the default chord layout would create a aesthetically  pleasing visualization.  In the examples below we mix the data up so that the default rendering is not idea, and use the chord methods to produce a result that is similar to the original, aside from the color of the ribbons.

The first visualization shows what is rendered when no methods are used.
The second rendering includes padding.
The third sorts the nodes (groups) so that they are rendered according to total weight of edges flowing out from the node, clockwise from largest to smallest.
The forth sorts the chords of each node (subgroup) according to their weight, clockwise from smallest to largest.
The last sets the z-order of the chords so that the larger weighted chords are rendered above smaller weighted chords.

```
<script>
var colors = ['#e45f56', '#a3d39c', '#7accc9', '#49aaa6', '#35404f'];

var m = [
  [0,1.4,1.2,1.1,1.3],
  [0.125,0,0,0,0],
  [1.75,0,0,0,0],
  [2.75,0,0,0,0],
  [1.375,0,0,0,0]];

var renderVis = function(id, chords) {
  let ribbon = d3.ribbon()
    .radius(43);

  d3.select("#" + id + " g.links")
    .selectAll("path")
    .data(chords)
    .enter()
    .append("path")
    .attr("d", ribbon)
    .attr("fill", d => colors[d.source.index])
    .attr("stroke", "gray")
    .attr("stroke-width", 1);

  let arcGen = d3.arc()
    .innerRadius(45)
    .outerRadius(50);

  d3.select("#" + id + " g.ring")
    .selectAll("path")
    .data(chords.groups)
    .enter()
    .append("path")
    .attr("d", arcGen)
    .attr("fill", d => colors[d.index])
    .attr("stroke", "gray")
    .attr("stroke-width", 1);
};

var chords2 = d3.chord()(m);
renderVis("demo2", chords2);

var chords3 = d3.chord().padAngle(0.175)(m);
renderVis("demo3", chords3);

var chords4 = d3.chord()
  .padAngle(0.175)
  .sortGroups((a,b) => b - a)(m);
renderVis("demo4", chords4);

var chords5 = d3.chord()
  .padAngle(0.175)
  .sortGroups((a,b) => b - a)
  .sortSubgroups((a,b) => a - b)(m);
renderVis("demo5", chords5);

var chords6 = d3.chord()
  .padAngle(0.175)
  .sortGroups((a,b) => b - a)
  .sortSubgroups((a,b) => a - b)
  .sortChords((a,b) => b - a)(m);
renderVis("demo6", chords6);
</script>

<svg id="demo2" width=100 height=100>
  <g class="ring" transform="translate(50,50)"></g>
  <g class="links" transform="translate(50,50)"></g>
</svg>

<svg id="demo3" width=100 height=100>
  <g class="ring" transform="translate(50,50)"></g>
  <g class="links" transform="translate(50,50)"></g>
</svg>

<svg id="demo4" width=100 height=100>
  <g class="ring" transform="translate(50,50)"></g>
  <g class="links" transform="translate(50,50)"></g>
</svg>

<svg id="demo5" width=100 height=100>
  <g class="ring" transform="translate(50,50)"></g>
  <g class="links" transform="translate(50,50)"></g>
</svg>

<svg id="demo6" width=100 height=100>
  <g class="ring" transform="translate(50,50)"></g>
  <g class="links" transform="translate(50,50)"></g>
</svg>
```
