# Introduction

[D3.js](https://d3js.org) (Data Driven Documents) is an open source JavaScript library that allows you to create dynamic data visualizations by manipulating a document's DOM.  It was created by Mike Bostic, a former graphics editor for the New York Times.

The library allows you to create standard visualizations like line graphs, pie charts, and scatter plots, but was engineered to be incredibly flexible to also allow developers to create custom visualizations and complex visualizations like the [Steamgraph](https://bl.ocks.org/mbostock/4060954) shown below.

<style>
#button {
    display: block;
    position: relative;
    top: 10px;
    left: 10px;
}
</style>

<div id="steamgraph">
    <button id="button" onclick="transition()">Update</button>
    <svg width="700" height="400"></svg>
</div>

<script src="https://d3js.org/d3.v4.min.js"></script>

<script>
var n = 20, // number of layers
    m = 200, // number of samples per layer
    k = 10; // number of bumps per layer

var stack = d3.stack().keys(d3.range(n)).offset(d3.stackOffsetWiggle),
    layers0 = stack(d3.transpose(d3.range(n).map(function() { return bumps(m, k); }))),
    layers1 = stack(d3.transpose(d3.range(n).map(function() { return bumps(m, k); }))),
    layers = layers0.concat(layers1);

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var x = d3.scaleLinear()
    .domain([0, m - 1])
    .range([0, width]);

var y = d3.scaleLinear()
    .domain([d3.min(layers, stackMin), d3.max(layers, stackMax)])
    .range([height, 0]);

var z = d3.interpolateCool;

var area = d3.area()
    .x(function(d, i) { return x(i); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); });

svg.selectAll("path")
  .data(layers0)
  .enter().append("path")
    .attr("d", area)
    .attr("fill", function() { return z(Math.random()); });

function stackMax(layer) {
  return d3.max(layer, function(d) { return d[1]; });
}

function stackMin(layer) {
  return d3.min(layer, function(d) { return d[0]; });
}

function transition() {
  var t;
  d3.selectAll("path")
    .data((t = layers1, layers1 = layers0, layers0 = t))
    .transition()
      .duration(2500)
      .attr("d", area);
}

// Inspired by Lee Byron’s test data generator.
function bumps(n, m) {
  var a = [], i;
  for (i = 0; i < n; ++i) a[i] = 0;
  for (i = 0; i < m; ++i) bump(a, n);
  return a;
}

function bump(a, n) {
  var x = 1 / (0.1 + Math.random()),
      y = 2 * Math.random() - 0.5,
      z = 10 / (0.1 + Math.random());
  for (var i = 0; i < n; i++) {
    var w = (i / n - y) * z;
    a[i] += x * Math.exp(-w * w);
  }
}

</script>

For hundreds of other great examples, you can browse the [D3.js GitHub Gallery](https://github.com/d3/d3/wiki/Gallery).

## What's in This Book

This book is for those that are new to the D3.js library and those that are looking for a better understanding of how to use the main tools in D3.js.  Throughout the book I assume the reader knows HTML and CSS, and understands how to manipulate the DOM.  I also assume the reader is proficient in JavaScript.

This book does not teach data visualization ...

In the chapters that follow, I lead you through the various objects and methods in the library's API.  When doing so, I provide links to the official [D3.js API documentation](https://github.com/d3/d3/blob/master/API.md), discuss how to use the objects and methods, provide code examples, and give explanations for those examples.

The code is provided in interactive sandboxes like the one below.

``` {cm: active}
<script>
function handler() {
    let node = document.getElementById('name')
    node.innerHTML = 'Got it!'
}
</script>

<style>
button {
    background-color: lightblue;
    border-radius: 10px;
  }
</style>

<div id='name'>Hello World!</div>
<button onclick='handler()'>Press me</button>
```

  The sandbox consists of a [CodeMirror](https://codemirror.net) editor, a menu, and a rendering area. The editor contains lines of code, either HTML or JavaScript, that are numbered.

  Since it is impossible to illustrate every possible use of the various objects and functions in D3.js, the reader is encouraged to modify the code provided and actively experiment with the editor.  When doing so, you'll notice that if you make a change in the editor, the result is not immediately reflected in the rendering area.  To see the result of your changes, you must *Run* the code by pressing the run button in the upper right corner of the editor.  To reset the code to the original code, press the *reset* button.

  Some of the code examples have the editor and rendering area open by default, others do not.  To open the editor on any code block, simply click on the code.

## Getting Started

You can download the latest version from the [D3.js web page](https://d3js.org) or use a link to the latest release of the library as shown below.

<pre>
&lt;script src="https://d3js.org/d3.v5.min.js">&lt;/script>
</pre>