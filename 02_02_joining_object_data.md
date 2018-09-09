{{meta {docid: joining_object_data}}}

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

# Joining Object Data

The array that we pass to the `selection.data` method can contain any type of data, including objects.  And this is how we'll often see data formatted when we import data from outside sources.  For example, the homeless population data that we used in the previous tutorial is better presented as an array of objects, where each object contains, not only the size of the homeless population in a state, but also the name of the state.  When the data is presented in this way, we're able to label the visual elements to make our visualizations more meaningful.

## Using the Value of an Object Property

Our first example joins objects to a set of rect elements and uses the population property of each object in the computation for the length of the rect element.

We start with a svg element whose id is *bargraph1* and that has no children.

<pre>
&lt;svg id="bargraph1" width="400" height="100" &gt;&lt;/svg&gt;
</pre>

Next, we declare a variable named *homeless* and assigning it the array of objects.  Each object contains two properties: *state* and *population*.

Last, we use the general pattern for joining data.  When we call `selectAll("rect")`, no elements are selected.  Then when we join the array of data to this empty selection, 5 virtual elements are created in the *enter* section.  We then process the enter section, appending nodes and setting their attributes.  When we compute the width for each rect element, we use d.population which references the value stored in the population field of the object joined to the element.

```
<script>
  homeless = [
    {"state": "California", "population": 134278 },
    {"state": "New York", "population": 89503 },
    {"state": "Florida", "population": 32190 },
    {"state": "Texas", "population": 23548 },
    {"state": "Washington", "population": 21112 }];

  var u = d3.select("#bargraph1")
            .selectAll("rect")
            .data(homeless);

  u.enter()
   .append("rect")
   .merge(u)
   .attr("height", 19)
   .attr("width", (d) => d.population/500)
   .attr("x", 0)
   .attr("y", (d, i) => i * 20)
   .attr("fill", "pink");

  u.exit().remove();
</script>

<svg id="bargraph1" width="400" height="100" ></svg>
```

## Adding Labels

Next, lets look at how we can add state labels to the left of each bar.  Just as before we add rect elements for each object in the data array.  This time, however, we start each rect element farther out on the x-axis by setting their `x` attributes to `100`.

Next we add the labels.  Here we use the same process as with rect elements, except we append text elements and set the text element attributes *x*, *y*, and *text-anchor*.

Notice that the text-anchor attribute is set to end.  This configures the text element so that the (x,y) coordinates that are specified using the x and y attributes refer to the right-hand side of the text, effectively aligning the text to the right.

``` {cm: active}
<script>
  var u = d3.select("#bargraph2")
    .selectAll("rect")
    .data(homeless);

  u.enter()
    .append("rect")
    .merge(u)
    .attr("height", 19)
    .attr("width", (d) => d.population/500)
    .attr("x", 100)
    .attr("y", (d, i) => i * 20)
    .attr("fill", "pink");

  u.exit().remove();

  u = d3.select("#bargraph2")
    .selectAll('text')
    .data(homeless);

  u.enter()
    .append('text')
    .merge(u)
    .text((d) => d.state)
    .attr('x', 96)
    .attr('text-anchor', 'end')
    .attr('y', (d, i) => i * 20 + 17);

  u.exit().remove();
</script>

<svg id="bargraph2" width="400" height="100" ></svg>
```