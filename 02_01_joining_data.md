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

<script src="https://d3js.org/d3.v4.min.js"></script>

<script>
var homeless = [134278, 89503, 32190, 23548, 21112];
</script>

# Joining Data to Elements

The d3.selection type has a number of methods that allow you to bind data to visual elements and get the data that is bound to visual elements.  Per the API these methods are:

+ [selection.data(array)](https://github.com/d3/d3-selection/blob/master/README.md#joining-data) - join elements to data
+ [selection.enter()](https://github.com/d3/d3-selection/blob/master/README.md#selection_enter) - get the temporary elements for the data not bound to elements
+ [selection.exit()](https://github.com/d3/d3-selection/blob/master/README.md#selection_exit) - get the elements that are missing data
+ [selection.datum([value])](https://github.com/d3/d3-selection/blob/master/README.md#selection_datum) - get or set the data bound to the elements in the selection
+ [selection.join(enter,[,update][,exit])](https://github.com/d3/d3-selection/blob/v1.4.0/README.md#selection_join) - a convenience method which can be used as an alternative to the above method calls.

When creating data visualizations we often change the appearance of the visual elements based on some data.  For example, the length of each bar in a bar graph.

When using D3, we can *join* individual data elements to the visual elements and then use the data when manipulating the appearance of the visual elements. When joining data in D3, the data must be stored in an array.  The array can contain any type of data: strings, numbers, objects, and even other arrays.

For example, below we have an array containing an estimate of the average number of homeless people in 5 US cities during 2017.  This data was obtained from the United States Interagency Council on Homelessness [website](https://goo.gl/XauGmj)

<pre>
var homeless = [134278, 89503, 32190, 23548, 21112];
</pre>
To join data to the visual elements in a web page, we select a set of visual elements and call the `selection.data` method on the selection, passing in an array of data to the data method.  The data method iterates over the elements in the array and for each data element adds a __data__ attribute with the data value to one of the visual element in the selection.

For example, below we have a svg element whose id is *bargraph1*.  The svg element contains 5 rect elements.  We've positioned each rect element, but have omitted the width attribute for each rectangle.

<pre>
&lt;svg id="bargraph1" width="400" height="90" &gt;
    &lt;rect x="0" y="0" height="10" fill="lightblue" /&gt;
    &lt;rect x="0" y="20" height="10" fill="lightblue" /&gt;
    &lt;rect x="0" y="40" height="10" fill="lightblue" /&gt;
    &lt;rect x="0" y="60" height="10" fill="lightblue" /&gt;
    &lt;rect x="0" y="80" height="10" fill="lightblue" /&gt;
&lt;/svg&gt;
</pre>

In JavaScript, we select the svg element with `select`, select all of the rect elements with `selectAll` and then call `data`, passing to the `data` method the array named `homeless`.  The `data` method returns what is called an *update selection* that contains all of the elements for which data has been joined (all 5 rect elements, in this case).  We then call the `attr` method on the update selection to modify the width of each bar based on the data.

<pre>
d3.select("#bargraph1")
  .selectAll("rect")
  .data(homeless)
  .attr("width", function(d) { return d/500;});
</pre>

When the `attr` method is invoked, the function that is passed as the second argument to `attr` is called for each element in the *update selection*.  When called, the data that is bound to the individual visual element is passed to the function in the variable *d*.  The function uses the value stored in d to compute the value of the attribute for the visual element and returns it.  In the example above we scale the value in d down by dividing it by 500 so that the bar fits within the svg element.

```
<script>
var homeless = [134278, 89503, 32190, 23548, 21112];

function setBarGraph1() {
    d3.select("#bargraph1")
      .selectAll("rect")
      .data(homeless)
      .attr("width", function(d) { return d/500;});
}
</script>

<button id="barGraph1Button" onclick="setBarGraph1()">Join Data</button>

<svg id="bargraph1" width="400" height="90" >
        <rect x="0" y="0" height="10" width="50" fill="lightblue" />
        <rect x="0" y="20" height="10" width="50" fill="lightblue" />
        <rect x="0" y="40" height="10" width="50" fill="lightblue" />
        <rect x="0" y="60" height="10" width="50" fill="lightblue" />
        <rect x="0" y="80" height="10" width="50" fill="lightblue" />
</svg>
```

## Enter and Exit Selections

In the example above, the number of elements in the data array was equal to the number of rect elements.  It is often the case that the number of elements in the data array is different than the number of visual elements in the selection.  There are 3 different scenarios:

+ There are no visual element in the selection.
+ There are not enough visual elements in the selection.
+ There are too many visual elements in the selection.

D3 provides 2 methods named `enter` and `exit` to help deal with these situations.

The `enter` method is called on an *update selection* and returns an *enter selection* that contains one *pseudo-element* for each data element that was **not joined** to a visual element by the `data` method.  We can then call `append` on the enter selection which creates a new visual element for each pseudo-element and joins the data in the pseudo-element to the newly created visual element.

The `exit` method is also called on an *update selection* but returns an *exit selection* that contains all of the visual elements in the *update selection* that did not have data joined to them.  We often call `remove` on the exit selection to remove the unnecessary visual elements.

## Dealing With No Visual Elements in an Update Selection

Below we start with a svg element whose id is *bargraph* and that has no rect elements within it.

<pre>
&lt;svg id="bargraph2" width="400" height="90" &gt;&lt;/svg&gt;
</pre>

We select the svg element using `select` and then call `selectAll` to select all of the rect elements within the svg element (for which there are none).  `SelectAll` returns empty selection whose elements (though there are none) have the svg element as their parent. This chaining of `select` and `selectAll` is important because when we append new elements later, their parent element will be the svg element.

Note: If we attempt to select all of the rect elements just using selectAll, as in `selectAll("#bargraph1 rect")`, for some reason we loose the parentNode attribute causing `append` not to work properly, so be sure to call `select` to select the parent element and then `selectAll` to get the child elements.

We then call the `data` method on the empty selection returned by `selectAll`.  The data method returns a *update selection* that contains the visual elements that were bound to data (again none) on which we can call the `enter` method.  The `enter` method returns an *enter selection* that contains a set of pseudo-elements, one for each data element that wasn't joined to a visual element.  Since no data point were joined to visual element by the `data` method, the *enter selection* contains 5 pseudo-elements.  We then call `append` on the *enter selection* which appends 5 new rect elements to the parent element (the svg) and set their properties using multiple `attr` calls.

<pre>
d3.select("#bargraph2")
 .selectAll("rect")
 .data(homeless)
 .enter()
 .append("rect")
 .attr("height", 10)
 .attr("width", function(d) { return d/500; })
 .attr("x", 0)
 .attr("y", function (d, i) { return i * 20; })
 .attr("fill", "pink");
</pre>

```
<script>
function setBarGraph2() {
    d3.selectAll("#bargraph2")
      .selectAll("rect")
      .data(homeless)
      .enter()
      .append("rect")
      .attr("height", 10)
      .attr("width", function(d) { return d/500; })
      .attr("x", 0)
      .attr("y", function (d, i) { return i * 20; })
      .attr("fill", "pink");
}
</script>

<button id="barGraph2Button" onclick="setBarGraph2()">Join Data</button>

<svg id="bargraph2" width="400" height="90" ></svg>
```

## Dealing With Too Few Visual Elements in an Update Selection

In the example above, we were able to modify the attributes of all of the visual elements by chaining `attr` method calls after calling `append`, since `append` returned a selection containing **all** of the visual elements.  Recall the *update selection* returned by `data` was empty.

Suppose now that we have an svg element that has 3 rect elements within it and a data array with 5 elements.

<pre>
&lt;svg id="bargraph3" width="400" height="90" &gt;
    &lt;rect x="0" y="0" height="10" width="50" fill="aquamarine" /&gt;
    &lt;rect x="0" y="20" height="10" width="50" fill="aquamarine" /&gt;
    &lt;rect x="0" y="40" height="10" width="50" fill="aquamarine" /&gt;
&lt;/svg&gt;
</pre>

When we select all of the rect elements and join the data array to them we'll have 3 elements in the *update selection*.  To make our code as efficient as possible we'll save a reference to this selection for later use.

<pre>
var u = d3.selectAll("#bargraph3")
 .selectAll("rect")
 .data(homeless);
</pre>

We then call `enter` on the *update selection* (u) and call `append` to append new rect elements to the svg.  Now, if we were simply call `attr` on the selection returned by `append` we'd only be modifying the attributes of the newly created elements.  Instead, we'll merge the elements in the update selection with those in the selection returned by `append` by calling `merge` on the selection returned by `append`, passing into it the reference to the update selection (u).  The `merge` method will return a selection containing all 5 elements that we can then call `attr` on to modify their attributes.

<pre>
u.enter()
 .append("rect")
 .merge(u)
 .attr("height", 10)
 .attr("width", function(d) { return d/500; })
 .attr("x", 0)
 .attr("y", function (d, i) { return i * 20; })
 .attr("fill", "pink");
</pre>

```
<script>
function setBarGraph3() {
    var u = d3.selectAll("#bargraph3")
              .selectAll("rect")
              .data(homeless);

    u.enter()
     .append("rect")
     .merge(u)
     .attr("height", 10)
     .attr("width", function(d) { return d/500; })
     .attr("x", 0)
     .attr("y", function (d, i) { return i * 20; })
     .attr("fill", "aquamarine");
}
</script>

<button id="barGraph3Button" onclick="setBarGraph3()">Join Data</button>

<svg id="bargraph3" width="400" height="90" >
  <rect x="0" y="0" height="10" width="50" fill="aquamarine" />
  <rect x="0" y="20" height="10" width="50" fill="aquamarine" />
  <rect x="0" y="40" height="10" width="50" fill="aquamarine" />
</svg>
```

## Dealing With Too Many Visual Elements

When joining data, if there are more visual elements in the selection than there are data points we need to delete the extra visual elements. To do so, we call the `exit` method on the *update selection*.  The `exit` method will return an *exit selection* containing all of the visual elements that do not have data bound to them.  We can then call `remove` on the *exit selection* to remove them from the DOM.

For example, suppose we have a svg element that contains 7 rect elements.

<pre>
&lt;svg id="bargraph4" width="400" height="130" &gt;
    &lt;rect x="0" y="0" height="10" fill="lightblue" /&gt;
    &lt;rect x="0" y="20" height="10" fill="lightblue" /&gt;
    &lt;rect x="0" y="40" height="10" fill="lightblue" /&gt;
    &lt;rect x="0" y="60" height="10" fill="lightblue" /&gt;
    &lt;rect x="0" y="80" height="10" fill="lightblue" /&gt;
    &lt;rect x="0" y="100" height="10" fill="lightblue" /&gt;
    &lt;rect x="0" y="120" height="10" fill="lightblue" /&gt;
&lt;/svg&gt;
</pre>

As before, we'll save a reference to the *update selection* that is returned by the `data` method.  We then call `exit` on the *update selection* and call `remove` on the *exit selection* returned by `exit` to remove any unnecessary visual elements.

<pre>
var u = d3.selectAll("#bargraph4")
          .selectAll("rect")
          .data(homeless);

u.exit().remove();
</pre>

```
<script>
function setBarGraph4() {
    var u = d3.selectAll("#bargraph4")
      .selectAll("rect")
      .data(homeless);

    u.enter()
      .append("rect")
      .merge(u)
      .attr("height", 10)
      .attr("width", function(d) { return d/500; })
      .attr("x", 0)
      .attr("y", function (d, i) { return i * 20; })
      .attr("fill", "lightblue");

    u.exit().remove();
}
</script>

<button id="barGraph4Button" onclick="setBarGraph4()">Join Data</button>

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

If you don't know whether or not the parent container has too few or too many visual elements, process both the *entry selection* and *exit selection* since there is no harm in doing so.  The code in the example below is the general form for joining data.

<pre>
var u = d3.selectAll("#bargraph4")
          .selectAll("rect")
          .data(homeless);

u.enter()
 .append("rect")
 .merge(u)
 .attr("height", 10)
 .attr("width", function(d) { return d/500; })
 .attr("x", 0)
 .attr("y", function (d, i) { return i * 20; })
 .attr("fill", "pink");

u.exit().remove();
</pre>

## Setting and Getting Bound Data

The `datum` method can be used to get and to set the data bound to the elements of a selection.  If a constant is passed to the method, the __data__ property is set equal to the constant for each element in the selection.  A function can also be passed to `datum`.  The function will be called for each element in the selection and will be passed the current data (d), the index of the element (i), and an array of nodes (nodes).  The `datum` method however does not affect the entry and exit selections like the `data` method does.

If no value (or function) is passed to the `datum` method, then the method returns the bound data for the **first** non-null element in the selection.

## Further Reading

The tutorial [How Selections Work](https://bost.ocks.org/mike/selection/) written by Bostock describes in depth what d3.selection object are and how data is joined to the elements in the selection.  We recommend everyone read this tutorial!