{{meta {docid: quantize_scales}}}

<style>
    svg { background-color: lightblue; }
</style>

<script src="https://d3js.org/d3.v4.min.js"></script>

# Quantize Scales

In previous tutorials we discussed continuous and sequential scales.  These scales mapped a continuous domain to a continuous range.  In this tutorial we'll discuss the scale generators that create scales that map a continuous domain to a discrete range.  There are three types of quantize scales.  Each of them divides the domain into uniform size partitions based on the cardinality of the output range.

The quantize scales in d3 include:

+ [d3.scaleQuantize()](https://github.com/d3/d3-scale/blob/master/README.md#scaleQuantize) - maps values within a continuous domain defined by an interval to one or more elements within a set.
+ [d3.scaleQuantile()](https://github.com/d3/d3-scale/blob/master/README.md#scaleQuantile) - maps a continuous domain defined by a sorted set of elements to an array of elements
+ [d3.scaleThreshold()](https://github.com/d3/d3-scale/blob/master/README.md#scaleThreshold) - maps a continuous domain defined by an array of threshold values to an array of elements

## Quantize Scales
The scaleQuantize() method generates a scaling function that segments the domain into *k* uniform segments where *k* is the number of elements with the range set.  Each segment is mapped to a unique element within the range set.

As with the continuous scaling functions the domain and range are specified by calling the domain and range methods respectively.

When a scaling function is passed an value within the domain, the scaling function returns the element in the range that was mapped to the segment containing the argument.

By default the scaleQuantize method creates a scaling function that maps values between 0 and 1 to the elements 0 and 1.  That is, if an input value is in the interval [0, 0.5)  the scaling function returns 0, and if an input value is in [0.5, 1] then the scaling function returns 1.

In the example below the following quantile scale is created.

<pre>
var colorScale = d3.scaleQuantize()
    .domain(<strong>[0,100]</strong>)
    .range(["red", "blue", "green"]);
</pre>

100 rect elements are then positioned at random locations along the x-axis between 0 and 80.  The colorScale function is used to set the fill color of the rectangles based on their location on the x-axis.

<pre>
.attr("fill", (d) =&gt; colorScale(d))
</pre>

Since the quantize scale divides the domain into segments of equal length, the boundaries for the segments are at 33 and 67.

```
<script>
    var svg = d3.select("#demo1");

    var xScale = d3.scaleLinear()
        .domain([0,100])
        .range([25,555]);

    var xAxis = d3.axisBottom(xScale);

    svg.append("g")
       .attr("transform", "translate(0,70)")
       .call(xAxis);

    var ticks = [].map.call(d3.range(3), (d) => 100/3 * (d+1));

    var topAxis = d3.axisTop(xScale)
        .tickValues(ticks);

    svg.append("g")
       .attr("transform", "translate(0,40)")
       .call(topAxis);

    var colorScale = d3.scaleQuantize()
        .domain([0,100])
        .range(["red", "blue", "green"]);

    var data = [].map.call(d3.range(100), (d) => Math.random() * 80);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d))
        .attr("y", 40)
        .attr("width", 3)
        .attr("height", 30)
        .attr("fill", (d) => colorScale(d));

</script>

<svg id="demo1" width="580" height="100"></svg>
```

Other methods you can call on a quantize scale are:

+ [ticks]()
+ [tickFormat]()
+ [nice]()
+ [copy]()
+ [invertExtent]()

## Quantile Scales

The quantile scale uses a finite set of elements to define the domain and a finite set of elements to define the range.  Although the domain is defined by a finite set of values, the domain is considered a continuous interval between the smallest and largest values in the set.  Given *n* elements in the domain set and *k* elements in the range set, the domain is segmented into k intervals such that the first *n/k* elements in the domain set are mapped to the first element in the range set, the second *n/k* elements in the domain set are mapped to the second element in the range set, etc.

Below we create an array containing 100 random values between 0 and 100.

<pre>
var data = [].map.call(d3.range(100), (d) =&gt; Math.random() * 80);
</pre>

And then create a quantile scale using the array of random values to define the domain.

<pre>
var colorScale = d3.scaleQuantile()
    .domain(<strong>data</strong>)
    .range(["red", "blue", "green"]);
</pre>

Since an equal number of values (100/3) in the domain's data array are assigned to a different color, the boundaries of the buckets would very rarely be at the 33 and 67 marks as was the case for the quantize scaling function.

```
<script>
    var svg = d3.select("#demo2");

    var xScale = d3.scaleLinear()
        .domain([0,100])
        .range([25,555]);

    var xAxis = d3.axisBottom(xScale);

    svg.append("g")
       .attr("transform", "translate(0,70)")
       .call(xAxis);

    var data = [].map.call(d3.range(100), (d) => Math.random() * 80);

    var colorScale = d3.scaleQuantile()
        .domain(data)
        .range(["red", "blue", "green"]);

    var ticks = colorScale.quantiles();

    var topAxis = d3.axisTop(xScale)
        .tickValues(ticks);

    svg.append("g")
       .attr("transform", "translate(0,40)")
       .call(topAxis);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d))
        .attr("y", 40)
        .attr("width", 3)
        .attr("height", 30)
        .attr("fill", (d) => colorScale(d));


</script>

<svg id="demo2" width="580" height="100"></svg>
```

Other methods that can be called on the quantile function are:

+ [invertExtent]()
+ [quantiles]()
+ [copy]()

## Threshold Scales

A threshold scale explicitly sets the boundaries for the domain's *k* segments.  This is done by passing an array containing the boundary values to the domain method.

In the example below we create a threshold scale that sets the segment boundaries at 40 and 60.

<pre>
var colorScale = d3.scaleThreshold()
    .domain(<strong>[40,60]</strong>)
    .range(["red", "blue", "green"]);
</pre>

We then, as before create 100 rect elements and randomly position them between 0 and 80 on the x-axis.  We use the colorScale function to determine the fill color for the rect elements.

```
<script>
    var svg = d3.select("#demo3");

    var xScale = d3.scaleLinear()
        .domain([0,100])
        .range([25,555]);

    var xAxis = d3.axisBottom(xScale);

    svg.append("g")
       .attr("transform", "translate(0,70)")
       .call(xAxis);

    var threshold = [40,60];

    var topAxis = d3.axisTop(xScale)
        .tickValues(threshold);

    svg.append("g")
       .attr("transform", "translate(0,40)")
       .call(topAxis);

    var colorScale = d3.scaleThreshold()
        .domain(threshold)
        .range(["red", "blue", "green"]);

    var data = [].map.call(d3.range(100), (d) => Math.random() * 80);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d))
        .attr("y", 40)
        .attr("width", 3)
        .attr("height", 30)
        .attr("fill", (d) => colorScale(d));
</script>

<svg id="demo3" width="580" height="100"></svg>
```