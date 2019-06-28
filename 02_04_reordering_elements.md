{{meta {docid: sorting_elements}}}

<style>
    button{
        display: inline;
        vertical-align: middle;
    }
    svg {
        display: inline-block;
        vertical-align: middle;
    }
    .lightblue {
        fill: lightblue;
    }
    .pink {
        fill: pink;
    }
    #pink {
        fill: pink;
    }
    .box {
        display: inline-block;
        vertical-align: middle;
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        margin: 15px;
        border: 0;
        padding: 0;
    }
    .circle {
        border-radius: 25px;
    }
    .blue-box {
        background-color: lightblue;
    }
    .pink-box {
        background-color: pink;
    }
    .violet-box {
      background-color: violet;
    }


</style>

<script src="https://d3js.org/d3.v5.min.js"></script>

# Reordering Elements

We can reorder elements in a selection of elements that have data bound to them by using the following two `selection` methods.

+ [selection.sort(compare)](https://github.com/d3/d3-selection/blob/master/README.md#selection_sort) - reposition in the DOM the selected elements based on a comparator function
+ [selection.order()](https://github.com/d3/d3-selection/blob/v1.4.0/README.md#selection_order) - reposition in the DOM the selected elements based on the order of the elements in the selection.

## Selection.sort

The [selection.sort(compare)](https://github.com/d3/d3-selection/blob/master/README.md#selection_sort) method sorts the elements in a selection based on the *data* that is *bound* to the elements and `compare`, a comparator function, and then reinserts the elements into the DOM in the newly sorted order.

The comparator is a function that takes as arguments a pair of *data* `(a, b)` that are bound to a pair of arbitrary elements in the selection.

+ If the function returns a negative number, then the first element is positioned *before* the second element.
+ If the function returns a positive number, then the first element is positioned *after* the second element.
+ If the function returns 0, then the order of the elements is unchanged.

You can pass `sort` a user defined comparator or pass it one of the comparators provided by D3.js.  Two comparators provided by D3.js that are commonly used are named [d3.ascending](https://github.com/d3/d3-array#ascending) and [d3.descending](https://github.com/d3/d3-array#descending) which when passed to `sort` order the data elements in ascending and descending order, respectively.  If no comparator is passed to `sort`, it uses `d3.ascending`.

Note that `sort`, only repositions the elements in the DOM.  If the elements need to be repositioned on the screen, based on their new order in the DOM, then the `attr` method should be called after `sort`.

### Sorting Circles

In the example below we select all of the circles in an SVG, sort them based on their radii, and change their `cx` property so that they appear in sorted order.
  
Initially, no data is bound to the circles so we bind to each circle the value of its radius using the `selection.datum` method.

<pre>
d3.selectAll("#sortSVG circle")
  .datum((d,i,nodes) => +nodes[i].getAttribute("r"))
</pre>

We then call `selection.sort`, passing it a lambda expression which returns the difference between the radii of two elements.

<pre>
.sort((a,b) => b - a)
</pre>

Last, we position the circles in order by changing their `cx` attribute based on the order in which they are found in their group.

<pre>
.attr("cx", (d, i) => 30 + (i * 50));
</pre>

```
<script>
function sortByRadius(){
  d3.selectAll("#sortSVG circle")
    .datum((d,i,nodes) => +nodes[i].getAttribute("r"))
    .sort((a,b) => b - a)
    .attr("cx", (d, i) => 30 + (i * 50));
}
</script>

<svg id="sortSVG" width="400" height="60">
  <circle r="25" cx="30" cy="30" fill="lightblue" />
  <circle r="5" cx="80" cy="30" fill="lightblue" />
  <circle r="10" cx="130" cy="30" fill="lightblue" />
  <circle r="20" cx="180" cy="30" fill="lightblue" />
  <circle r="15" cx="230" cy="30" fill="lightblue" />
</svg>

<button onclick="sortByRadius()">Sort</button>
```

### Sorting Bars

Sometimes we'll bind object data to the elements in a selection and sort them according to some property of the bound data.

In the example below, we bind the objects in the following array to `rect` elements in an `svg`.  

<pre>
var homelessData = [
  {"state": "California","population": 134278},
  {"state": "Florida",   "population": 32190},
  {"state": "Washington","population": 21112},
  {"state": "New York","population": 89503},
  {"state": "Texas","population": 23548}
];
</pre>

When the button is pressed, the rectangles and labels are selected, sorted in ascending order according to the values in their bound data's population properties, and positioned along the y-axis according to their sorted group position.

<pre>
  d3.select("#bargraph")
      .selectAll("rect")
      .sort((a,b) => d3.ascending(a.population, b.population))
      .attr("y", (d, i) => i * 20);

  d3.select("#bargraph")
      .selectAll("text")
      .sort((a,b) => d3.ascending(a.population, b.population))
      .attr("y", (d, i) => i * 20 + 17);
</pre>

```
<script>
var homelessData = [
  {"state": "California","population": 134278},
  {"state": "Florida",   "population": 32190},
  {"state": "Washington","population": 21112},
  {"state": "New York","population": 89503},
  {"state": "Texas","population": 23548}
];

d3.select("#bargraph")
  .selectAll("rect")
  .data(homelessData)
  .join("rect")
  .attr("height", 19)
  .attr("width", (d) => d.population/500)
  .attr("x", 100)
  .attr("y", (d, i) => i * 20)
  .attr("fill", "pink");

d3.select("#bargraph")
  .selectAll("text")
  .data(homelessData)
  .join("text")
  .text((d) => d.state)
  .attr("x", 96)
  .attr("text-anchor", "end")
  .attr("y", (d, i) => i * 20 + 17);

function sortData() {
  d3.select("#bargraph")
    .selectAll("rect")
    .sort((a,b) => d3.ascending(a.population, b.population))
    .attr("y", (d, i) => i * 20);

  d3.select("#bargraph")
    .selectAll("text")
    .sort((a,b) => d3.ascending(a.population, b.population))
    .attr("y", (d, i) => i * 20 + 17);
}
</script>

<svg id="bargraph" width="400" height="100"></svg>

<button onclick="sortData()">Sort</button>
```

## Selection.order

We've seen earlier that `selection.sort` can be used to reorder a set of nodes in the DOM that *have data bound to them* by using a comparator function.  We can also reorder a set of nodes in the DOM by using `data` and [selection.order()](https://github.com/d3/d3-selection/blob/v1.4.0/README.md#selection_order).

When we use `order` (which `sort` uses) to reorder the elements in the DOM, we use an array containing the data that is bound to our selected elements to determine the order of the elements in the DOM.  The order in which the data appears in the array will be the order in which the elements in the selection will be stored in the DOM.

Once we've created the array of data and ordered it, we call `data`, passing it the newly ordered array as well as a key function.  The key function ensures that the data that is bound to each selected element does not change.  The selection returned by `data` will have groups of elements that are sorted according to the array passed to `data`.  We then call the `order` method to reorder the elements in the DOM based on the order in which they appear in the selection's groups.

### Ordering Letters

In the example below we create six `div` elements, each displaying a letter (a-f) that has also been bound to it, and order them in the DOM in a random order.

When the `sort` button is pressed, first we sort the letters a-f in an array, in ascending order.  We then select the six `div` elements and call `data` on the selection, passing it the sorted array and a key function.  Finally, we call `order` which sorts the elements in the DOM.

<pre>
function sort() {    
  stats.sort();
  
  d3.select("#order")
    .selectAll("div")
    .data(stats, (d) => d)
    .order();
}
</pre>

```
<script>
var stats = ["f", "b", "e", "a", "c", "d"];
stats.sort(() => Math.random() - 0.5);

d3.select("#order")
  .selectAll("div")
  .data(stats)
  .enter()
  .append("div")
  .style("display", "inline-block")
  .style("font-size", "20px")
  .html((d) => d + "&nbsp;");
    
function sort() {    
  stats.sort();
  
  d3.select("#order")
    .selectAll("div")
    .data(stats, (d) => d)
    .order();
}
</script>

<div id="order"></div>
<br>
<button onclick="sort()">Sort</button>
```

### Swapping Circles and Squares

The following examples shows how we can reorder a pair of circles using `order`.

In this example, we initially bind the values 1-4 to the four circles using an array passed to `data`.  When the button is pressed, we swap the values at index 1 and index 2.  We then reselect all of the `circle` elements and rebind the data (with a key function).  This orders the elements in the selection's group array so that the circles are swapped.  We then call `order` to swap them in the DOM.  

At this point the circles are swapped in the DOM, but still have their original `cx` property values.  To change the position of the `circles` in the `svg` we change their `cx` properties using the `attr` method.

<pre>
function swap() {  
  var temp = circleOrder[1];
  circleOrder[1] = circleOrder[2];
  circleOrder[2] = temp; 

  d3.select("#orderSVG")
    .selectAll("circle")
    .data(circleOrder, (d) => d)
    .order()
    .attr("cx", (d, i) => 30 + (i * 50));    
}
</pre>

```
<script>
var circleOrder = [1, 2, 3, 4];

d3.select("#orderSVG")
  .selectAll("circle")
  .data(circleOrder);
    
function swap() {  
  var temp = circleOrder[1];
  circleOrder[1] = circleOrder[2];
  circleOrder[2] = temp; 

  d3.select("#orderSVG")
    .selectAll("circle")
    .data(circleOrder, (d) => d)
    .order()
    .attr("cx", (d, i) => 30 + (i * 60));    
}
</script>

<svg id="orderSVG" width="300" height="60">
  <circle r="25" cx="30" cy="30" fill="lightblue" />
  <circle r="25" cx="90" cy="30" fill="pink" />
  <circle r="25" cx="150" cy="30" fill="violet" />
  <circle r="25" cx="210" cy="30" fill="lightblue" />
</svg>

<button onclick="swap()">Swap</button>
```
Note that you cannot swap arbitrary elements in the DOM using `order`.  Consider the following example. Here we select the pink and violet `div` elements and attempt to swap them using two techniques.  The button labeled *Swap 1* uses the technique shown above and the button labeled *Swap 2* uses [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) method calls.
  
The first method fails when there is a square between the two selected divs because the `order` method reorders the elements in the selection by reinserting the elements in the selection, one by one into the DOM, making them adjacent to one another.  
```
<script>
var circleOrder = [1, 2, 3, 4];

d3.select("#swap2")
  .selectAll("div")
  .data(circleOrder);
    
function swap2() { 
  var arr = [];
  
  var pair = d3.selectAll("#box1,#box2")
    .each((d) => { arr.push(d); });
  
  var temp = arr[0];
  arr[0] = arr[1];
  arr[1] = temp;
  
  pair.data(arr, (d) => d)
    .order();
}

function swap3() {
  var box1 = document.getElementById("box1");  //violet
  var clone = box1.cloneNode(true);
  var box2 = document.getElementById("box2");  //pink
  var box2_parent = box2.parentNode;
  var box2_nextSibling = box2.nextSibling;
  
  box1.parentNode.replaceChild(box2, box1);
  
  if (box2_nextSibling == box1) {
  	box2_parent.insertBefore(box1, box2);
  } 
  else if (box2_nextSibling) {
  	box2_parent.insertBefore(box1, box2_nextSibling);
  }
  else {
    box2_parent.append(box1);
  }
}
</script>

<div id="swap2" style="display: inline-block;">
    <div class="box blue-box"></div>
    <div id="box1" class="box violet-box" ></div>
    <div class="box blue-box"></div>
    <div id="box2" class="box pink-box"></div>
    <div class="box blue-box"></div>
</div>
<button onclick="swap2()">Swap 1</button>
<button onclick="swap3()">Swap 2</button>
```
