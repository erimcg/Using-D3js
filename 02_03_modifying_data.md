
{{meta {docid: modifying_data}}}

<script src="https://d3js.org/d3.v5.min.js"></script>


# Modifying Data

When the dataset used for a visualization changes, we may need to update the visual elements to reflect the new data, possibly adding or removing visual elements, and changing the visual characteristics of elements. 

If the data is held in an array, then the position of the new data in the array, may affect the rendering speed and appearance of the visualization as the following examples shows.

The two visualizations below use buttons to incrementally add data to an array.  The elements in the array are then bound to the elements in the visualization (appending elements when necessary) and the bound data is then used to change the appearance of the elements.

When interacting with the two examples, notice how they render differently when the data is prepended to the beginning of the arrays and when data is inserted in the middle of the arrays.

```
<script>
var data = [
    {"state": "Washington","population": 21112},
    {"state": "Texas","population": 23548},
    {"state": "Florida",   "population": 32190},
    {"state": "New York","population": 89503}
];

var homeless = [{"state": "California","population": 134278}];

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
      {"state": "New York","population": 89503}
  ];

  homeless = [{"state": "California","population": 134278}];
  joinWithoutKey(homeless);
}

function joinWithoutKey(array) {
    var u = d3.select("#bargraph1")
      .selectAll('rect')
      .data(array);

    u.join('rect')
      .transition()
      .attr("height", 19)
      .attr("width", (d) => d.population/500)
      .attr("x", 100)
      .attr("y", (d, i) => i * 20)
      .attr("fill", "pink");
      
	u = d3.select("#bargraph1")
      .selectAll('text')
      .data(array);

    u.join('text')
      .text((d) => d.state)
      .transition()
      .attr('x', 96)
      .attr('text-anchor', 'end')
      .attr('y', (d, i) => i * 20 + 17);
}

joinWithoutKey(homeless);
</script>

<svg id="bargraph1" width="400" height="100"></svg>

<button onclick="prependData()">Prepend</button>
<button onclick="insertData()">Insert</button>
<button onclick="appendData()">Append</button>
<button onclick="reset()">Reset</button>
```
<figure>
<figcaption style="text-align: center;">Example 1</figcaption>
</figure>

```
<script>
var data2 = [
    {"state": "Washington","population": 21112},
    {"state": "Texas","population": 23548},
    {"state": "Florida",   "population": 32190},
    {"state": "New York","population": 89503}
];

var homeless2 = [{"state": "California","population": 134278}];

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
    {"state": "New York","population": 89503}
    ];

    homeless2 = [{"state": "California","population": 134278}];
    joinWithKey(homeless2);
}

function joinWithKey(array) {
    var u = d3.select("#bargraph2")
      .selectAll('rect')
      .data(array, (d) => d.state);

    u.join('rect')
      .transition()
      .attr("height", 19)
      .attr("width", (d) => d.population/500)
      .attr("x", 100)
      .attr("y", (d, i) => i * 20)
      .attr("fill", "pink");
      
	u = d3.select("#bargraph2")
      .selectAll('text')
      .data(array, (d) => d.state);

    u.join('text')
      .text((d) => d.state)
      .transition()
      .attr('x', 96)
      .attr('text-anchor', 'end')
      .attr('y', (d, i) => i * 20 + 17);
}
joinWithKey(homeless);
</script>

<svg id="bargraph2" width="400" height="100"></svg>

<button onclick="prependData2()">Prepend</button>
<button onclick="insertData2()">Insert</button>
<button onclick="appendData2()">Append</button>
<button onclick="reset2()">Reset</button>
```

<figure>
<figcaption style="text-align: center;">Example 2</figcaption>
</figure>

The difference between the two examples shown above is the second example uses a *key function* while the first one does not.

## Key Functions

The [selection.data([data[, key]])](https://github.com/d3/d3-selection/blob/master/README.md#joining-data) method has two parameters: `data` (which can be an array or a function) and an optional `key` function.  The key function provided must return a string.  The strings returned by the key function arew used to determine which datum is bound to which visual elements.

When a key function is passed to the `data` method, the key function is called for each data element in the selection (producing a string for each element) and the key function is called for each datum in the array (producing a string for each datum).   If a datum's key string matches an element's key string, the datum is bound to the element.  

This matching mechanism allows an element in the DOM to maintain the data that is bound to it regardless of the data's position in the data array.  In example 1, when data is prepended to the array and the array is passed to `data` without a key function, the new data at index `0` is bound to an preexisting rectangle requiring the appearance (width) of the element to be modified.  The data that used to be bound to that element must be bound to a different element (perhaps a new one) and it's appearance modified.  This cascading affect of moving the data bound to the existing elements causes all of the existing elements to be recomputed and rerendered.

In the second example, the key function ensures that the data bound to the existing elements is never changed and so only the location of the elements might have to be changed.

## Key Function Arguments

We stated above that the key function is called for each element in the selection and for each data element.  When called for an element in the selection, the key function is passed (`d`) the data that is already joined to the element, (`i`) the index of the element in the selection group, and (`nodes`) the group itself.

When called for an element in the data array, the key function is passed (`d`) the data element, (`i`) the index of the element in the data array, and (`nodes`) the data array.

In example 2, above, we pass a key function in the form of a lambda expression to the `data` method.  

<pre>
.data(array, (d) =&gt; d.state);
</pre>

This key function returns the string stored in the state property of the data object that is passed to it.