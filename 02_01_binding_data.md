
{{meta {docid: joining_data}}}

<style>
  button{
      display: inline;
      vertical-align: middle;
  }
  svg {
      display: inline-block;
      vertical-align: middle;
  }
</style>

<script src="https://d3js.org/d3.v5.min.js"></script>

<script>
var arr = [13, 8, 3, 2, 2];
</script>

# Binding Data to Elements

In the previous chapter we looked at the selection methods provided by D3.js that allow us to select sets of elements from the DOM, modify the elements in the selection, and modify the DOM.  In this chapter we'll look at an even more powerful feature: data binding.
 
As you are probably aware, D3 is short for Data Driven Documents.  One of the objective of D3.js is to provide mechanisms that make creating visualizations of data easier.  Toward that goal, D3.js provides a set of selection methods that allow us to pair up the values in a set of data points with distinct visual elements, adding and removing visual elements when necessary.  Once this pairing (binding) is complete, we can modify the visual elements according to their bound data.

The process we use to create this pairing is as follows:
1. Bind a set of data to a set of existing visual elements
2. Determine the subset of data that isn't paired to a visual element and create visual elements for them
3. Determine the subset of the visual elements that don't have data bound to them and remove them
4. Modify the visual elements to represent the data that is bound to them

The `d3.selection` methods used to bind data to elements and retrieve data bound to elements are as follows:

+ [selection.data([data[, key]])](https://github.com/d3/d3-selection/blob/master/README.md#joining-data) - bind data to elements
+ [selection.datum([value])](https://github.com/d3/d3-selection/blob/master/README.md#selection_datum) - get or set the data bound to the elements in the selection

The methods that allow us to match up the data to a set of visual elements are:

+ [selection.enter()](https://github.com/d3/d3-selection/blob/master/README.md#selection_enter) - get the temporary elements for the data not bound to elements
+ [selection.merge(selection)](https://github.com/d3/d3-selection/blob/master/README.md#selection_merge) - merge this selection with another selection
+ [selection.exit()](https://github.com/d3/d3-selection/blob/master/README.md#selection_exit) - get the elements that are missing data

D3.js also provides a convenience method that allows us to match up the data to a set of visual elements with a single method call:

+ [selection.join(enter,[,update][,exit])](https://github.com/d3/d3-selection/blob/v1.4.0/README.md#selection_join) - a convenience method which can be used as an alternative to `enter`, `merge`, and `exit`.

## Selection.data

When using D3.js, we often *bind* individual data values to the visual elements in a selection and then modify the appearance of the visual elements to reflect the data.   To bind data to the elements in a selection we call [selection.data([data[, key]])](https://github.com/d3/d3-selection/blob/master/README.md#joining-data) on the selection.  The `data` method takes as an argument either an array of any type of data or a function.

Here we demonstrate passing an array to `data` and discuss passing functions at the end of this section.  The data used in the following example is simply an array of integers.

<pre>
var arr = [13, 8, 3, 2, 2];
</pre>

When the `data` method is executed, it iterates over the elements in the array and for each data value adds a `__data__` property holding the data value to one of the visual element in the selection.

In the example below, we have a `svg` element that contains 5 `rect` elements.  We've positioned each `rect` element by setting their `x` and `y` properties, but have omitted the `width` attribute for each rectangle (for now), because we'd like the width of each rectangle to be dependent on the data that is bound to the element.

<pre>
&lt;svg id="bargraph1" width="400" height="90" &gt;
    &lt;rect x="0" y="0" height="10" fill="lightblue" /&gt;
    &lt;rect x="0" y="20" height="10" fill="lightblue" /&gt;
    &lt;rect x="0" y="40" height="10" fill="lightblue" /&gt;
    &lt;rect x="0" y="60" height="10" fill="lightblue" /&gt;
    &lt;rect x="0" y="80" height="10" fill="lightblue" /&gt;
&lt;/svg&gt;
</pre>

When the button is pressed, we select the `svg` element with `select`, select all of the `rect` elements with `selectAll` and then call `data`, passing to the `data` method the array named `arr`.

<pre>
d3.select("#bargraph1")
  .selectAll("rect")
  .data(arr)                // returns the update selection
  .attr("width", (d) => d * (400/13));
</pre>  

The `data` method returns a new selection, called an *update selection*, that contains all of the elements for which data has been joined (all 5 rect elements, in this case).  We then call the `attr` method on the *update selection* to modify the width of each bar based on the data that is bound to them.

As mentioned in the previous chapter `attr` may take a function as a second argument.  If passed a function, the function is executed for each element in the selection and the function is passed the data that is bound to the element (d) as its first argument.

The function we pass to `attr` uses the value stored in `d` to computes and returns the value of the element's `width` attribute.  In the example above we normalize the data so that the bars fits within the `svg` element.

```
<script>
var arr = [13, 8, 3, 2, 2];

function createBarGraph1() {
    d3.select("#bargraph1")
      .selectAll("rect")
      .data(arr)
      .attr("width", (d) => d * (400/13));
}
</script>

<button onclick="createBarGraph1()">Bind Data</button>

<svg id="bargraph1" width="400" height="90" >
        <rect x="0" y="0" height="10" width="50" fill="lightblue" />
        <rect x="0" y="20" height="10" width="50" fill="lightblue" />
        <rect x="0" y="40" height="10" width="50" fill="lightblue" />
        <rect x="0" y="60" height="10" width="50" fill="lightblue" />
        <rect x="0" y="80" height="10" width="50" fill="lightblue" />
</svg>
```

## Enter and Exit Selections

In the example above, the number of elements in the data array was equal to the number of `rect` elements in the `svg`.  It is often the case that the number of elements in the data array is different than the number of visual elements in the selection.  There are 3 different scenarios:

+ There are no visual element in the selection.
+ There are not enough visual elements in the selection.
+ There are too many visual elements in the selection.

D3.js provides two selection methods named `enter` and `exit` that can be called on an *update selection* to help deal with these situations.

The `enter` method is called on an *update selection* and returns an *enter selection* that contains one *pseudo-element* for each data element that was **not bound** to a visual element by the `data` method.  Each *pseudo-element* holds the data that was not bound.

To create visual elements for each pseudo-element we call `append` on the enter selection.  In addition to creating a new visual element, `append` binds the data that is stored in the pseudo-elements to the newly created visual elements.

The `exit` method is also called on an *update selection* but returns a selection called the *exit selection* that contains all of the visual elements in the original selection that did not have data bound to them.  We often call `remove` on the exit selection to remove the unnecessary visual elements.

## Dealing With No Visual Elements in an Update Selection

Below we start with a `svg` element that has no `rect` elements within it.

<pre>
&lt;svg id="bargraph2" width="400" height="90" &gt;&lt;/svg&gt;
</pre>

When the button is pressed, the button handler selects the `svg` element using `select` and then calls `selectAll` to select all of the `rect` elements within the `svg` element (for which there are none).  `SelectAll` returns empty selection whose elements (though there are none) have the `svg` element as their parent. This chaining of `select` and `selectAll` is important because when we append new elements later, their parent element will be the svg element.

We then call the `data` method on the empty selection returned by `selectAll`.  The data method returns a *update selection* that contains the visual elements that were bound to data (again none) on which we can call the `enter` method.  The `enter` method returns an *enter selection* that contains a set of pseudo-elements, one for each data element that wasn't joined to a visual element.  Since no data point was joined to a visual element by the `data` method, the *enter selection* contains 5 pseudo-elements.  We then call `append` on the *enter selection* which appends 5 new `rect` elements to the parent element (the `svg`) and set their properties using multiple `attr` calls.

``` {cm: visible}
<script> 
function createBarGraph2() {
    d3.select("#bargraph2")
      .selectAll("rect")
      .data(arr)
      .enter()
      .append("rect")
      .attr("height", 10)
      .attr("width", (d) => d * (400/13))
      .attr("x", 0)
      .attr("y", (d, i) => i * 20)
      .attr("fill", "pink");
}
</script>

<button onclick="createBarGraph2()">Bind Data</button>

<svg id="bargraph2" width="400" height="90" ></svg>
```

To summarize, we started with an empty `svg` element, selected the children of the svg (of which there were none), bound data to that empty set, then appended `rect` elements to the svg for each data point that was not bound (all 5) when `data` was executed.   This is a technique that is typically used when dynamically creating data visualizations.

## Dealing With Too Few Visual Elements in an Update Selection

In the example above, we were able to modify the attributes of all of the visual elements by chaining `attr` method calls after calling `append`, since `append` returned a selection containing *all* 5 of the newly created visual elements.

Below we have a `svg` element that contains 3 'rect' elements within it and a data array with 5 elements.

When the button is pressed, the handler selects all of the `rect` elements and calls `data` to bind data to them.   This creates 3 elements in the *update selection* (the selection returned by `data`).  To make our code as efficient as possible we'll save a reference to this selection (`update`) for later use.

<pre>
var update = d3.select("#bargraph3")
 .selectAll("rect")
 .data(arr);
</pre>

We then call `enter` on the *update selection* to retrieve a selection containing 2 pseudo-elements that have data bound to them and call `append` to replace the pseudo-elements with `rect` elements.  

Now, if we were to simply call `attr` on the selection returned by `append` we'd only be modifying the attributes of the 2 newly created elements.  Instead, we'll merge the elements in the update selection with those in the selection returned by `append` by calling `merge` on the selection returned by `append`, passing to it the reference to the update selection (`update`).  The `merge` method will return a selection containing all 5 elements that we can then call `attr` on in order to modify their attributes.

<pre>
update.enter()
 .append("rect")
 .merge(update)
 .attr("height", 10)
 .attr("width", (d) => d * (400/13))
 .attr("x", 0)
 .attr("y", (d, i) => i * 20)
 .attr("fill", "pink");
</pre>

```
<script>
function createBarGraph3() {
    var update = d3.select("#bargraph3")
              .selectAll("rect")
              .data(arr);

    update.enter()
     .append("rect")
     .merge(update)
     .attr("height", 10)
     .attr("width", (d) => d * (400/13))
     .attr("x", 0)
     .attr("y", (d, i) => i * 20)
     .attr("fill", "aquamarine");
}
</script>

<button onclick="createBarGraph3()">Bind Data</button>

<svg id="bargraph3" width="400" height="90" >
  <rect x="0" y="0" height="10" width="50" fill="aquamarine" />
  <rect x="0" y="20" height="10" width="50" fill="aquamarine" />
  <rect x="0" y="40" height="10" width="50" fill="aquamarine" />
</svg>
```

## Dealing With Too Many Visual Elements

When joining data, if there are more visual elements in the selection than there are data points we often need to delete the extra visual elements. To do so, we call the `exit` method on the *update selection*.  The `exit` method will return an *exit selection* containing all of the visual elements that do not have data bound to them.  We can then call `remove` on the *exit selection* to remove them from the DOM.

For example, suppose we have a svg element that contains 7 rect elements.  As before, we first save a reference to the *update selection* that is returned by the `data` method.  We then call `exit` on the *update selection* and call `remove` on the *exit selection* returned by `exit` to remove any unnecessary visual elements.

<pre>
var update = d3.select("#bargraph4")
          .selectAll("rect")
          .data(arr);

update.exit().remove();
</pre>

```
<script>
function createBarGraph4() {
    var update = d3.select("#bargraph4")
      .selectAll("rect")
      .data(arr);

    update.enter()
      .append("rect")
      .merge(update)
      .attr("height", 10)
      .attr("width", (d) => d * (400/13))
      .attr("x", 0)
      .attr("y", (d, i) => i * 20)
      .attr("fill", "lightblue");

    update.exit().remove();
}
</script>

<button onclick="createBarGraph4()">Bind Data</button>

<svg id="bargraph4" width="400" height="130" >
  <rect x="0" y="0" height="10" width="50" fill="lightblue" />
  <rect x="0" y="20" height="10" width="50" fill="lightblue" />
  <rect x="0" y="40" height="10" width="50" fill="lightblue" />
  <rect x="0" y="60" height="10" width="50" fill="lightblue" />
  <rect x="0" y="80" height="10" width="50" fill="lightblue" />
  <rect x="0" y="100" height="10" width="50" fill="lightblue" />
  <rect x="0" y="120" height="10" width="50" fill="lightblue" />
</svg>
```

## The General Form: Call Enter, Merge, and Exit

Often we don't know whether the parent container has too few or too many visual elements, so we process both the *entry selection* and *exit selection*, since there is no harm in doing so.  The code shown below is the general form for binding data.

<pre>
var update = d3.select("#bargraph4")
          .selectAll("rect")
          .data(arr);

update.enter()
 .append("rect")
 .merge(update)
 .attr("height", 10)
 .attr("width", (d) => d * (400/13))
 .attr("x", 0)
 .attr("y", (d, i) => i * 20)
 .attr("fill", "pink");

update.exit().remove();
</pre>

## Selection.join

[`Selection.join(enter[, update][, exit]`](https://github.com/d3/d3-selection/blob/v1.4.0/README.md#selection_join) is a convenience method that allows us to process the entry, update, and exit selections with one method call.  

The `join` method requires at least one argument, but may take three.  The first argument may be either a string or a function and the last two must be functions.  `Join` returns a selection that contains a set of newly appended elements as well as the elements in the update selection.

In the example, rather than appending 'rect' elements to the enter selection and then merging the selection returned from append with the update selection, after we call `data`, we simply call `join` and pass it the a string specifying the type of element to append.

``` {cm: visible}
<script> 
  function createBarGraph5() {
      d3.select("#bargraph5")
        .selectAll("rect")
        .data(arr)
        .join('rect')  
        .attr("height", 10)
        .attr("width", (d) => d * (400/13))
        .attr("x", 0)
        .attr("y", (d, i) => i * 20)
        .attr("fill", "lightblue");
  }
</script>

<button onclick="createBarGraph5()">Bind Data</button>

<svg id="bargraph5" width="400" height="90"></svg>
```

If the first, second, or third argument passed to `join` is a function, it is passed a reference to the enter, update, or exit selection respectively.

## Working With Multiple Groups

In the above examples, we created selections on which `data` was called by calling `select` followed by `selectAll` producing selections having a single group.  In cases like these where a selection has a single group, it is appropriate to pass an array to `data`.  When we do, the `i`^th^ value in the array is bound to the `i`^th^ element in the group.  When a selection has multiple groups, for example when we chain two calls to `selectAll` together, `data` processes each group in the selection separately, so it may be more appropriate to pass a function to `data` that returns a different array for each group.

### Using 2-dimensional Data

Given a `N x M` dataset, we can create `N*M` visual elements and bind the dataset values to the visual elements in various ways.  One way is to copy the values in the 2D array to a 1D array and create the elements using the technique showed above.  Another way is to bind each of the `N` rows of data (arrays) to non-visual elements, and then create create `M` visual elements for each non-visual element.

Consider the following example.  In it we have an `svg` element and a 2D array of data held in the variable `arr2`. 

<pre>
var arr2 = [[1,2,3],
           [4,5,6]];
</pre>

Since the dataset has two rows, we'd like to create two `g` elements and bind the array `[1,2,3]` to one of them, and bind `[4,5,6]` to the other.  To do this we select the `svg` element, and then call `selectAll` to create an empty selection.  When we then bind `arr2` (an array containing 2 arrays) to the empty selection using `data`, since there are 2 elements in `arr2` and no elements in the selection, the enter selection will have 2 pseudo-elements in it, each having an array bound to it.  When we then call `join`, two new `g` elements are appended to the group with `[1,2,3]` bound to one of the `g` elements and `[4,5,6]` bound to the other.

<pre>
var g_nodes = d3.select(`#dataSVG`)
.selectAll('g')
.data(arr)
.join('g');
</pre>

Now we need to create 3 `circle` elements for each `g` element.  To do so, we'll use the data (arrays) bound to the `g` elements.  

Our goal is to create an enter selection having two groups, with each group having 3 pseudo-elements from which we can create the `circle` elements.  We'll again create an empty selection by calling `selectAll` on the selection of `g` elements.  Since the selection of `g` elements contains two element, when we call `selectAll` to create the empty selection, we create two (empty) groups in the empty selection, each having a `g` element as their parent.

Recall each parent has an array of length 3 bound to it.  When we call `data` on the empty selection, we pass a lambda expression that returns an array, rather than passing `data` an array.  When we do this, the lambda expression is invoked *for each group* and the elements in the array returned by the lambda expression are bound to the elements in the group.  

When `data` is passed a function (or lambda expression), the data bound to the group's parent (`d`) is passed to the function.  In our case, the parents are the two `g` elements and the data bound to them are the arrays `[1,2,3]` and `[4,5,6]`.  Our lambda expression simply returns the array that is passed to it (`d`).  The elements in the array are then bound to the elements in the respective (empty) groups.  Since each array contains three elements and the groups are empty, each group in the enter selection will have three pseudo-elements.  We then call `join` to create `circle` elements for each of the six pseudo-elements.

<pre>
var c_nodes = g_nodes.selectAll('circle')
  .data(d => d)
  .join('circle');
</pre>
 
 Alas, we select all of the `circle` elements and set their size, location, and fill color.
 
<pre>
c_nodes.attr('r', d => d * 3)
  .attr('cx' , d => 55 * d)
  .attr('cy', 30)
  .attr('fill', 'pink');
</pre> 
 
```
<script>
  var arr2 = [[1,2,3],[4,5,6]];

  var g_nodes = d3.select('#dataSVG')
    .selectAll('g')
    .data(arr2)
    .join('g');

  var c_nodes = g_nodes.selectAll('circle')
    .data(d => d)
    .join('circle');
  
  c_nodes.attr('r', d => d * 3)
    .attr('cx' , d => 55 * d)
    .attr('cy', 30)
    .attr('fill', 'pink');
    
</script>

<svg id="dataSVG" width="400" height="60"></svg>
```

## Setting and Getting Bound Data

The [selection.datum([value])](https://github.com/d3/d3-selection/blob/v1.4.0/README.md#selection_datum) method can be used to get set, or clear the data bound to the elements of a selection.  The method has an optional argument that can hold null, a constant, or a function.  Regardless of the input, the method returns the selection on which it is called.  Unlike `selection.data`, the selection returned does not contain enter or exit selections.

If no value is passed to the `datum` method, then the method returns the data that is bound to the *first* non-null element in the selection.  If null is passed ot the `datum` method, the data bound to the elements in the selected are cleared.   If a constant is passed to the method, the constant is bound to each element in the selection.  If a function is passed to `datum` the function will be called for each element in the selection and will be passed `(d, i, nodes)` where `d` is the element's current data, `i` is the group index for the element, and `nodes` is the the current group (array).

## Further Reading

The tutorial [How Selections Work](https://bost.ocks.org/mike/selection/) written by Bostock describes in depth what d3.selection object are and how data is joined to the elements in the selection.  We recommend everyone read this tutorial!