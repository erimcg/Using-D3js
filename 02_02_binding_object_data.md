
{{meta {docid: binding_object_data}}}

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


# Binding Object Data

We are not limited to binding primitive type values to the elements in a visualization.  We can also bind objects (and arrays).  Take for example, the following array containing estimates for the homeless population in five U.S. states in January of 2018 provided by the [United States Interagency Council on Homelessness](https://www.usich.gov/tools-for-action/map/#fn[]=1400&fn[]=2900&fn[]=6000&fn[]=9900&fn[]=13500).

The data consists of an array of objects where each object has a `state` and a `population` property.

<pre>
var homeless = [
    {state: "California", population: 129972 },
    {state: "New York", population: 91897 },
    {state: "Florida", population: 31030 },
    {state: "Texas", population: 25310 },
    {state: "Washington", population: 22304 }];
</pre>

We can bind this data to an empty selection and create `text` and `rect` elements for each object using `join`.  Once the visual elements are added we can use the `state` and `population` properties of the bound data to set the text labels and to determine the lengths of the rectangles, respectively.

``` {cm: visible}
<script>
  var homeless = [
    {state: "California", population: 129972 },
    {state: "New York", population: 91897 },
    {state: "Florida", population: 31030 },
    {state: "Texas", population: 25310 },
    {state: "Washington", population: 22304 }];
    
  var bar = d3.select("#bargraph1")
    .selectAll()
    .data(homeless);
    
  bar.join("text")
    .text((d) => d.state)
    .attr('x', 96)
    .attr('text-anchor', 'end')
    .attr('y', (d, i) => i * 20 + 17);
    
  bar.join("rect")
    .attr("height", 19)
    .attr("width", (d) => d.population/500)
    .attr("x", 100)
    .attr("y", (d, i) => i * 20)
    .attr("fill", "pink");
</script>

<svg id="bargraph1" width="400" height="100" ></svg>
```
