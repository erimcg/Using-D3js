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

<script src="https://d3js.org/d3.v5.min.js"></script>

# Creating Selections

As we'll soon see, more often than not, when we want to change a attribute or property of an element, we'll want to do the same for a whole set of elements in the DOM.  Sometimes we can accomplish this by calling `getElementsByClassName` or `getElementsByTagName` and then use a for-loops to iterate over the selected elements. Bostock has engineered a smarter way: [Selections](https://github.com/d3/d3-selection/blob/master/README.md#selection).

The tutorial [How Selections Work](https://bost.ocks.org/mike/selection/) written by Bostock describes in depth how the d3.selection object works.  It is highly recommended that you read this tutorial after you've read this one.

The D3 API has 3 methods that can be used to select elements from the DOM.  These are:
+ [d3.select(selector)](https://github.com/d3/d3-selection/blob/master/README.md#select) - select a single element from the document
+ [d3.selectAll(selector)](https://github.com/d3/d3-selection/blob/master/README.md#selectAll) - select multiple elements from the document
+ [d3.selection()](https://github.com/d3/d3-selection/blob/master/README.md#selection) - select the root element in the document

Each returns zero or more elements from the DOM in a [d3.selection](https://github.com/d3/d3-selection/blob/master/README.md#selection) object.  The `d3.selection` type is a subclass of `array` and contains methods that when called effect all of the elements contained in the `selection` object.

[d3.select(selector)](https://github.com/d3/d3-selection/blob/master/README.md#select) returns a `selection` containing zero or one element or node. A `selector` arguement can be either an string that holds any valid CSS selector or a reference to a node.  If the `selector` is a string, it returns a `selection` containing the *first* element found in the DOM that satisfies the CSS selector criteria.  If no element is found then it returns an empty `selection`.  If the selector is a reference to a node then it returns a `section` object containing that single node.


[d3.selectAll(selector)](https://github.com/d3/d3-selection/blob/master/README.md#selectAll) returns a `selection` of zero or more elements or nodes. The method takes as an argument a string that holds a CSS selector, an array of nodes, or a pseudo-array like a `NodeList`.  If the argument is a string, the method returns a selection containing all of the elements that match the CSS selector defined by the string.  If no elements match, the `selection` object that is returned is empty.  If the selector contains references to nodes then the method returns a selection that contains the nodes.

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

In the script below we select different subsets of the 5 circles using the selection methods.  Note that we don't do anything with the selections just yet.  We're just demonstrating how to select sets of elements.


<pre>
let firstBlueCircle = d3.select(".lightblue");
let allBlueCircles = d3.selectAll(".lightblue");
let secondPinkCircle = d3.select("#secondPink");
let allCircles = d3.selectAll("circle");
</pre>


In the first statement we set `firstBlueCircle` equal to the `selection` object that contains a single element, the *first* element having the class name *lightblue*.  The second statement uses the same CSS selector, but calls `selectAll` to return a selection containing *all* of the elements having a class name *lightblue*.  The third statement sets the variable `secondPinkCircle` to the selection object containing a single element, namely the element whose id attribute is set to *secondPink*.  The fourth statement retrieves a selection containing all of the circle elements in the web page's DOM.

Remember that each of the select methods discussed above return a `selection` object, not a Node object or a set of Node objects.  Also, *any* valid CSS selector can be passed to `select` and `selectAll`.

[d3.selection()](https://github.com/d3/d3-selection/blob/master/README.md#selection) is used to retrieve a `selection` object that contains only the root document element (i.e. [document.documentElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement)) of the web page.

## Selecting Descendant Elements
The `selection` type has two methods that allow you to select zero or more descendant elements based on the elements in the current selection.  Per the API, these methods are:

+ [selection.select(selector)](https://github.com/d3/d3-selection/blob/master/README.md#selection_select) - select zero or one descendant for each item in the selection
+ [selection.selectAll(selector)](https://github.com/d3/d3-selection/blob/master/README.md#selection_selectAll) - select zero or more descendants for each item in the selection

Consider the SVG in the example below. The SVG element uses &lt;g&gt; tags to group circle elements into rows.  In order to get all of the circles that are descendents of the first g element we chain calls to `selection.select` (to get the first g element) and `selection.selectAll` (to get all of the circle elements that are children of the selected g element).  Once we have a selection containing the elements we want to modify, we can modify the attributes of the elements in the selection using the *attr* method (we discuss the attr method in the next section).


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

The [selection.filter(filter)](https://github.com/d3/d3-selection/blob/master/README.md#selection_filter) method takes a filter as an argument and returns a selection containing a subset of the objects in the selection on which it is called.  The *filter* argument can be either a selection string as discussed above or a function.  If the filter is a selection string, the method returns the elements in the selection that match the selection string.

If the filter is a function, the function is called for each element in the selection, in order.  The elements for which the function returns true are retained in the selection and the others are removed.  When the function is called for an element, the function is passed three arguments (d, i, nodes):  the datum joined to the element (discussed in the next chapter), an integer specifying the group index of the element, and the group itself.  As you can see in the example code, the filter method uses *nodes[i]* to access the element in the selection that is being processed.

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
