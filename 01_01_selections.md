{{meta {docid: selections}}}

<style>
  svg {
      display: inline-block;
      vertical-align: middle;
  }
  button{
      display: inline;
      vertical-align: middle;
  }
  .lightblue {
      fill: lightblue;
  }
  .pink {
    fill: pink;
  }
</style>

<script src="https://d3js.org/d3.v4.min.js"></script>

# Selections

Before we discuss how to manipulate the DOM, we need to discuss a set of methods that D3 provides which can be used to select sets of elements from the DOM.  With a set of elements we can then manipulate all of the elements in the set at once.

The D3 API has 3 methods (see below) that return 0 or more elements from the DOM in a [d3.selection](https://github.com/d3/d3-selection/blob/master/README.md#selection) object.  The `d3.selection` type is a subclass of `array` and contains methods that when called effect all of the elements contained in the `selection` object.

The tutorial [How Selections Work](https://bost.ocks.org/mike/selection/) by Mike Bostock describes in depth how the d3.selection object works.  It is highly recommended that you read Mike's tutorial after you've read this one.


Per the API, the 3 methods that return selection objects are:
+ [d3.select(selector)](https://github.com/d3/d3-selection/blob/master/README.md#select) - select a single element from the document
+ [d3.selectAll(selector)](https://github.com/d3/d3-selection/blob/master/README.md#selectAll) - select multiple elements from the document
+ [d3.selection()](https://github.com/d3/d3-selection/blob/master/README.md#selection) - select the root element in the document.


[d3.select(selector)](https://github.com/d3/d3-selection/blob/master/README.md#select) takes as an argument a string that holds a CSS selector or a reference to a node.  If the argument is a string, it returns the *first* element found in the DOM that satisfies the CSS selector criteria.  If no element is found it returns an empty selection.  If the selector is a reference to a node then it returns a section containing that node.


[d3.selectAll(selector)](https://github.com/d3/d3-selection/blob/master/README.md#selectAll) takes as an argument a string that holds a CSS selector, an array of nodes, or a pseudo-array like a NodeList.  If the argument is a string, the method returns a selection containing all of the elements that match the CSS selector defined by the string.  If no elements match, the selection object that is returned is empty.  If the selector contains references to nodes then the method returns a selection that contains the nodes.

To illustrate various ways that we can use these methods, lets suppose we have 5 circles rendered in an svg as shown below.

``` {cm: visible}
<svg width="425" height="100" >
  <circle class="lightblue" cx="50" cy="50" r="25" />
  <circle class="lightblue" cx="125" cy="50" r="25" />
  <circle class="pink" cx="200" cy="50" r="25" />
  <circle id="secondPink" class="pink" cx="275" cy="50" r="25"" />
  <circle cx="350" cy="50" r="25" fill="aquamarine" />
</svg>
```

In the script below we select different subsets of the 5 circles using the selection methods.  Note that we don't do anything with the selections just yet.  We're just demonstrating how to select collections of elements.


<pre>
let firstBlueCircle = d3.select(".lightblue");
let allBlueCircles = d3.selectAll(".lightblue");
let secondPinkCircle = d3.select("#secondPink");
let allCircles = d3.selectAll("circle");
</pre>


In the first statement we set `firstBlueCircle` equal to the `d3.selection` object that contains a single element, the *first* element having the class name *lightblue*.  The second statement uses the same CSS selector, but calls `d3.selectAll` to return a selection containing *all* of the elements having a class name *lightblue*.  The third statement sets the variable `secondPinkCircle` to the selection object containing a single element, namely the element whose id attribute is set to *secondPink*.  The fourth statement retrieves a selection containing all of the circle elements in the web page's DOM.

Remember that each of the select methods discussed above return a `d3.selection` object, not a Node object or a set of Node objects.  Also, *any* valid CSS selector can be passed to `d3.select` and `d3.selectAll`.

[d3.selection()](https://github.com/d3/d3-selection/blob/master/README.md#selection) is used to retrieve a `d3.selection` object that contains only the root document element (i.e. [document.documentElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement)) of the web page.

## Selecting Descendant Elements
The d3.selection type has two methods that allow you to select 0 or more descendant elements based on the elements in the current selection.  Per the API, these methods are:

+ [selection.select(selector)](https://github.com/d3/d3-selection/blob/master/README.md#selection_select) - select a single descendant for each selected element
+[selection.selectAll(selector)](https://github.com/d3/d3-selection/blob/master/README.md#selection_selectAll) - select multiple descendants for each selected element

The SVG element below uses &lt;g&gt; elements to group the circles in each row.  In order to get all of the circles that are decendents of the first &lt;g&gt; element we chain calls to `selection.select` and `selection.selectAll`.  We can then modify the attributes of the new selection.


<pre>
d3.select("g")
  .selectAll("circle")
  .attr("stroke", "gray")
  .attr("stroke-width", "3");
</pre>


```
<script>
  function nestedSelect() {
    d3.select("g")
      .selectAll("circle")
      .attr("stroke", "gray")
      .attr("stroke-width", "3");
  }
</script>

<svg width="160" height="100">
  <g>
    <circle r="20" cx="30" cy="30" fill="lightblue" />
    <circle r="20" cx="80" cy="30" fill="lightblue" />
    <circle r="20" cx="130" cy="30" fill="lightblue" />
  </g>
  <g>
    <circle r="20" cx="30" cy="80" fill="lightblue" />
    <circle r="20" cx="80" cy="80" fill="lightblue" />
    <circle r="20" cx="130" cy="80" fill="lightblue" />
  </g>
</svg>
<button id="nestedSelectButton" onclick="nestedSelect()">Add Stroke</button>
```

## Filtering Selections

The [selection.filter(function)](https://github.com/d3/d3-selection/blob/master/README.md#selection_filter) - method takes a function as an argument and keeps the elements for which the function returns true.  The method returns a selection containing the remaining elements.

In the example below, the 5 circle elements have radii between 5 and 25.  We select all of the circle elements, filter the selection down to only those with radii greater than or equal to 20, then remove the elements left in the selection.

```
<script>
  function filterOnRadius() {
    d3.selectAll("#filterOnRadius circle")
        .filter((d,i,nodes) => nodes[i].getAttribute("r") >= 20)
        .remove();
  }
</script>

<button onclick="filterOnRadius()">Filter</button>
<svg id="filterOnRadius" width="400" height="100">
  <circle cx="50" cy="50" r="5" fill="pink" />
  <circle cx="125" cy="50" r="10" fill="pink" />
  <circle cx="200" cy="50" r="15" fill="pink" />
  <circle cx="275" cy="50" r="20" fill="pink" />
  <circle cx="350" cy="50" r="25" fill="pink" />
</svg>
```

## Selection Size and Elements
The `d3.selection` type has a number of methods that allow us retrieve the size and elements in the selection.  Per the API these methods are:

+ [d3.empty()](https://github.com/d3/d3-selection/blob/master/README.md#selection_empty) - returns true if the selection is empty
+ [d3.size()](https://github.com/d3/d3-selection/blob/master/README.md#selection_size) - returns the number of elements that have been selected
+ [d3.node()](https://github.com/d3/d3-selection/blob/master/README.md#selection_node) - returns the first non-null element
+ [d3.nodes()](https://github.com/d3/d3-selection/blob/master/README.md#selection_nodes) - returns an array of the elements that have been selected

Note that these four methods **do not** return a selection object.