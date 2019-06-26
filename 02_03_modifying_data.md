{{meta {docid: modifying_data}}}

<script src="https://d3js.org/d3.v4.min.js"></script>

# Modifying Data

When the dataset used for a visualization changes, we may need to update the visual elements to reflect the new data, possibly adding or removing visual elements, and changing the visual characteristics of elements. 

If the data is held in an array, then the position of the new data in the array, may affect the rendering speed and appearance of the visualization as the following example shows.

The demonstration below uses buttons to incrementally add and remove data in an (initially empty) array.  The elements in the array are then bound to the elements in the visualization (appending and removing new elements when necessary).  

```
<script>
var data = [
    {"state": "Washington","population": 21112},
    {"state": "Texas","population": 23548},
    {"state": "Florida",   "population": 32190},
    {"state": "New York","population": 89503},
    {"state": "California","population": 134278}
];

var homeless = [];

function prependData() {
    if (data.length == 0) {
        return;
    }

    homeless.unshift(data.pop());
    joinWithoutKey(homeless);
}

function insertData() {
    if (data.length == 0) {
        return;
    }

    var loc = Math.floor(homeless.length / 2);
    homeless.splice(loc, 0, data.pop());
    joinWithoutKey(homeless);
}

function appendData() {
    if (data.length == 0) {
        return;
    }

    homeless.push(data.pop());
    joinWithoutKey(homeless);
}

function reset() {
    data = [
    {"state": "Washington","population": 21112},
    {"state": "Texas","population": 23548},
    {"state": "Florida",   "population": 32190},
    {"state": "New York","population": 89503},
    {"state": "California","population": 134278}
    ];

    homeless = [];
    joinWithoutKey(homeless);
}

function joinWithoutKey(array) {
    var u = d3.select("#bargraph0")
      .selectAll("rect")
      .data(array);

    u.enter()
      .append("rect")
      .merge(u)
      .transition()
      .attr("height", 19)
      .attr("width", (d) => d.population/500)
      .attr("x", 100)
      .attr("y", (d, i) => i * 20)
      .attr("fill", "pink");

    u.exit().remove();

    u = d3.select("#bargraph0")
      .selectAll('text')
      .data(array);

    u.enter()
      .append('text')
      .merge(u)
      .text((d) => d.state)
      .transition()
      .attr('x', 96)
      .attr('text-anchor', 'end')
      .attr('y', (d, i) => i * 20 + 17);

    u.exit().remove();
}
</script>

<svg id="bargraph0" width="400" height="100"></svg>

<button onclick="prependData()">Prepend</button>
<button onclick="insertData()">Insert</button>
<button onclick="appendData()">Append</button>
<button onclick="reset()">Reset</button>
```

## The Key Function

The `data` method has 2 parameters: an array and an optional key function.  The key function assigns a unique key (string) to each visual element.

When a key function is passed to the `data` method, the key-function is called for each data element in order to determine which visual element to bind the data to.  If the key computed for a data element is already assigned to an existing visual element, the data element is joined to that visual element and the node is added to the update selection.

In the example below, we pass a key function to the data method.  The key function returns the string stored in the state property of each data element.  These strings are unique.  When we modify the array and rejoin the data to the visual elements, the data elements that had been previously joined are rejoined to the same visual elements.  The data elements that had not be joined earlier are joined to pseudo-elements in the entry selection.

<pre>
var u = d3.select("#bargraph2")
    .selectAll("rect")
    .data(array, (d) =&gt; d.state);
</pre>

```
<script>
var data2 = [
    {"state": "Washington","population": 21112},
    {"state": "Texas","population": 23548},
    {"state": "Florida",   "population": 32190},
    {"state": "New York","population": 89503},
    {"state": "California","population": 134278}
];

var homeless2 = [];

function prependData2() {
    if (data2.length == 0) {
        return;
    }

    homeless2.unshift(data2.pop());
    joinWithKey(homeless2);
}

function insertData2() {
    if (data2.length == 0) {
        return;
    }

    var loc = Math.floor(homeless2.length / 2);
    homeless2.splice(loc, 0, data2.pop());
    joinWithKey(homeless2);
}

function appendData2() {
    if (data2.length == 0) {
        return;
    }

    homeless2.push(data2.pop());
    joinWithKey(homeless2);
}


function reset2() {
    data2 = [
    {"state": "Washington","population": 21112},
    {"state": "Texas","population": 23548},
    {"state": "Florida",   "population": 32190},
    {"state": "New York","population": 89503},
    {"state": "California","population": 134278}
    ];

    homeless2 = [];
    joinWithKey(homeless2);
}

function joinWithKey(array) {

    var u = d3.select("#bargraph2")
      .selectAll("rect")
      .data(array, (d) => d.state);

    u.enter()
      .append("rect")
      .merge(u)
      .transition()
      .attr("height", 19)
      .attr("width", (d) => d.population/500)
      .attr("x", 100)
      .attr("y", (d, i) => i * 20)
      .attr("fill", "pink");

    u.exit().remove();

    u = d3.select("#bargraph2")
      .selectAll('text')
      .data(array, (d) => d.state);

    u.enter()
      .append('text')
      .merge(u)
      .text((d) => d.state)
      .transition()
      .attr('x', 96)
      .attr('text-anchor', 'end')
      .attr('y', (d, i) => i * 20 + 17);

    u.exit().remove();
}
</script>

<svg id="bargraph2" width="400" height="100"></svg>

<button onclick="prependData2()">Prepend</button>
<button onclick="insertData2()">Insert</button>
<button onclick="appendData2()">Append</button>
<button onclick="reset2()">Reset</button>
```