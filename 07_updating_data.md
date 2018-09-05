{{meta {docid: updating_data}}}

<script src="https://d3js.org/d3.v4.min.js"></script>

# Updating Data

In this tutorial, we'll look at how to add new visual elements after new data has been added to the array of joined data. To that end, we'll look again at the `data` method, and in particular, the use of a key function that is passed as an argument to the method.

+ [selection.data(array, key-function)](https://github.com/d3/d3-selection/blob/master/README.md#selection_data) - join data to elements

## The Data Method - A Review

Lets review the `data` method.  The `data` method binds data to visual elements by adding a __data__ property to the visual elements' nodes.  The method returns an update selection that contains all of the visual elements that were bound.  The update selection has an `entry` method and an `exit` method that return a set of pseudo-elements for each unbound data element when we have too few visual elements and a set of visual elements that did not have data bound to them when we have too many visual elements, respectively.

## Rejoining a Data Array

When the data array has been modified we need to update the visual elements to reflect the new data, possibly adding or removing visual elements.

Suppose, for example, we have a svg element with 2 rect child elements that has been joined to a data array with 2 integer values containing the values 100 and 10 ([100, 10]). So the first rect is bound to 100 and the second rect is bound to 10.  Suppose next that a new value (1000) has been added to the beginning of the array.  So now the array hold 3 integers, and looks like this: [1000,100,10].

When we use the general form for joining data, we first select the svg and then the rect elements (there are 2), and then call the `data` method, passing in the array.  Since there are 2 visual elements the `data` method binds the first 2 elements in the array to those 2 visual elements.  So, 1000 is bound to the first rect and 100 is bound to the second rect.

We then call `enter` to get the entry selection (which contains one pseudo-element bound to 10) and call `append` to add a rect for the pseudo-element.  This produces a third rect element bound to the value 10.

Recall that 10 was bound to the second rect earlier; now it is bound to the third.  This movement of data from one visual element to another causes unnecessary computation and unpleasant visual side effects as shown below.

```
<script>
var data = [
    {"state": "California","population": 134278 },
    {"state": "Florida",   "population": 32190 },
    {"state": "Washington","population": 21112 },
    {"state": "New York","population": 89503 },
    {"state": "Texas","population": 23548 }
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
    {"state": "California","population": 134278 },
    {"state": "Florida",   "population": 32190 },
    {"state": "Washington","population": 21112 },
    {"state": "New York","population": 89503 },
    {"state": "Texas","population": 23548 }
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
    {"state": "California","population": 134278 },
    {"state": "Florida",   "population": 32190 },
    {"state": "Washington","population": 21112 },
    {"state": "New York","population": 89503 },
    {"state": "Texas","population": 23548 }
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
    {"state": "California","population": 134278 },
    {"state": "Florida",   "population": 32190 },
    {"state": "Washington","population": 21112 },
    {"state": "New York","population": 89503 },
    {"state": "Texas","population": 23548 }
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