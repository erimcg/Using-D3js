{{meta {docid: sorting_elements}}}

<script src="https://d3js.org/d3.v4.min.js"></script>

# Sorting Elements

The `selection.sort` method sorts the elements in a selection based on data that is joined to the nodes, and then reinserts each node into the DOM in the order in which they appear in the selection.

+ [selection.sort(compare)](https://github.com/d3/d3-selection/blob/master/README.md#selection_sort) - sort elements in the document based on the data joined to them

The `sort` method returns a sorted selection that is based on a comparator.   The comparator is a function that takes as arguments two *data* objects (a,b) that are joined to a pair of elements in the selection and returns an integer value based on the order relationship between a and b.

+ If the first element should be positioned *before* the second, then the function returns a negative number.
+ If the first element should be positioned *after* the second, the the function returns a positive number.
+ If it is irrelevant which element is positioned first, then the function returns 0.

D3 provides 2 helper functions named `ascending` and `descending` which can be used to implement comparison functions which order the data elements in ascending and descending order respectively.

Recall that `sort`, only repositions the elements in the DOM.  If the elements need to be repositioned on the screen, based on their new order in the DOM, then the `attr` method can be called after `sort`.

In the example we select all of the circles in the SVG and sort them.  But initially, no data is joined to the circles, we join the circle elements themselves as data to themselves using the `selection.datum` method as shown below.

<pre>
.datum((d,i,nodes) => nodes[i])
</pre>

We then call `selection.sort`, passing it a lambda expression which returns the difference between the "r" attribute values of the elements.

<pre>
.sort((a,b) => +b.getAttribute("r") - +a.getAttribute("r"))
</pre>

Last, we position the circles in order by changing their "cx" attribute based on the order in which they appear in the selection.

<pre>
.attr("cx", (d, i) => 30 + (i * 70));
</pre>

```
<script>
  function sortByRadius(){
    d3.selectAll("#sortSVG circle")
      .datum((d,i,nodes) => nodes[i])
      .sort((a,b) => +b.getAttribute("r") - +a.getAttribute("r"))
      .attr("cx", (d, i) => 30 + (i * 70));
  }
</script>

<svg id="sortSVG" width="300" height="60">
  <circle r="20" cx="30" cy="30" fill="lightblue" />
  <circle r="5" cx="80" cy="30" fill="lightblue" />
  <circle r="15" cx="130" cy="30" fill="lightblue" />
  <circle r="10" cx="180" cy="30" fill="lightblue" />
</svg>

<button onclick="sortByRadius()">Sort</button>
```

More often than not, we'll join data to the elements in a selection and sort them according to some value in the data.

In the example below, once the SVG is loaded, the `initializeSVG` function joins the data shown below to the `rect` elements of an SVG element.  Since there aren't any `rect` elements, the enter section has 5 virtual nodes with data joined to them.

<pre>
var homelessData = [
  {"state": "California","population": 134278 },
  {"state": "Florida",   "population": 32190 },
  {"state": "Washington","population": 21112 },
  {"state": "New York","population": 89503 },
  {"state": "Texas","population": 23548 }
];
</pre>

Continuing in `initializeSVG`, you'll see us process the enter section and append, merge, and position new `rect` elements for each of the virtual elements.  The same process is performed for `text` elements to provide lables for each rectangle.

When the button is pressed, the rectangles and labels are selected, sorted in ascending order, and moved along the y-axis to their sorted position.

<pre>
  d3.select("#bargraph")
      .selectAll("rect")
      .sort((a,b) => d3.ascending(a.population, b.population))
      .attr("y", (d, i) => i * 20);

  d3.select("#bargraph")
      .selectAll("text")
      .sort((a,b) => d3.ascending(a.population, b.population))
      .attr('y', (d, i) => i * 20 + 17);
</pre>

```
<script>
  var homelessData = [
    {"state": "California","population": 134278 },
    {"state": "Florida",   "population": 32190 },
    {"state": "Washington","population": 21112 },
    {"state": "New York","population": 89503 },
    {"state": "Texas","population": 23548 }
  ];

  function initializeSVG() {
    let u = d3.select("#bargraph")
              .selectAll("rect")
              .data(homelessData);

    u.enter()
     .append("rect")
     .merge(u)
     .attr("height", 19)
     .attr("width", (d) => d.population/500)
     .attr("x", 100)
     .attr("y", (d, i) => i * 20)
     .attr("fill", "pink");

    u = d3.select("#bargraph")
          .selectAll('text')
          .data(homelessData);

    u.enter()
     .append('text')
     .merge(u)
     .text((d) => d.state)
     .attr('x', 96)
     .attr('text-anchor', 'end')
     .attr('y', (d, i) => i * 20 + 17);
  }

  var interval = setInterval(checkSVG, 10);

  function checkSVG() {
    if (document.getElementById("bargraph")) {
      clearInterval(interval);
      initializeSVG();
    }
  }

  function sortData() {
    d3.select("#bargraph")
      .selectAll("rect")
      .sort((a,b) => d3.ascending(a.population, b.population))
      .attr("y", (d, i) => i * 20);

    d3.select("#bargraph")
      .selectAll("text")
      .sort((a,b) => d3.ascending(a.population, b.population))
      .attr('y', (d, i) => i * 20 + 17);
  }
</script>

<svg id="bargraph" width="400" height="100"></svg>

<button onclick="sortData()">Sort</button>
```