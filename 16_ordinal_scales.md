{{meta {docid: ordinal_scales}}}

<script src="https://d3js.org/d3.v4.min.js"></script>

# Ordinal Scales

Unlike continuous, sequential, and quantize scales, ordinal scales work with discrete domains.

D3 provides the following ordinal scale generators:

+ [d3.scaleOrdinal([range])](https://github.com/d3/d3-scale/blob/master/README.md#ordinal-scales) - maps a discrete domain to a discrete range.</li>
 	<li><a href="https://github.com/d3/d3-scale/blob/master/README.md#band-scales">d3.scaleBand()</a> - maps a discrete domain to a set of discrete points within a continuous interval.</li>
 	<li><a href="https://github.com/d3/d3-scale/blob/master/README.md#point-scales">d3.scalePoint()</a> -</li>
</ul>
<h3>Ordinal Scales</h3>
Typically, when creating an ordinal scale, we'll provide an array of elements for the domain and an array of equal length for the range.  The generator will map each element in the domain, in order, to the elements in the range.

In the example below we join data containing date strings to a set of rect elements that we plot on a time scale.  We create a color scale using scaleOrdinal that maps the years in [1970, 1971, 1972, 1973] to the colors in ["red", "orange", "green", "blue"] as defined below.
<pre>var colorScale = d3.scaleOrdinal()
    .domain([1970, 1971, 1972, 1973])
    .range(["red", "orange", "green", "blue"]);</pre>
We set their fill color using the colorScale function as shown below.
<pre>.attr("fill", (d) =&gt; colorScale(parseTime(d.date).getFullYear()))</pre>
[raw]
<script src="https://d3js.org/d3.v4.min.js"></script>

<svg id="demo1" width="600" height="100"></svg>

<style>
    svg { background-color: lightblue; }
</style>

<script>
    var svg = d3.select("#demo1");

    var data = [
        {"date": "January 1, 1970", "event": "A"},
        {"date": "April 1, 1970", "event": "B"},
        {"date": "July 1, 1970", "event": "C"},
        {"date": "October 1, 1970", "event": "D"},
        {"date": "January 1, 1971", "event": "E"},
        {"date": "April 1, 1971", "event": "F"},
        {"date": "July 1, 1971", "event": "G"},
        {"date": "October 1, 1971", "event": "H"},
        {"date": "January 1, 1972", "event": "I"},
        {"date": "April 1, 1972", "event": "J"},
        {"date": "July 1, 1972", "event": "K"},
        {"date": "October 1, 1972", "event": "L"},
        {"date": "January 1, 1973", "event": "M"},
        {"date": "April 1, 1973", "event": "N"},
        {"date": "July 1, 1973", "event": "O"},
        {"date": "October 1, 1973", "event": "P"}
    ];

    var parseTime = d3.timeParse("%B %d, %Y");

    var dates = [];
    for (let obj of data) {
        dates.push(parseTime(obj.date));
    }

    var domain = d3.extent(dates);
    domain = [d3.timeYear.floor(dates[0]), d3.timeYear.ceil(domain[1])];

    var xScale = d3.scaleTime()
        .domain(domain)
        .range([25, 575]);

    var xAxis = d3.axisBottom(xScale)
        .ticks(d3.timeYear);

    svg.append("g")
       .attr("transform", "translate(0,70)")
       .call(xAxis);

    var years = d3.map(dates, (d) => d.getFullYear()).keys();
    console.log(years);

    var colorScale = d3.scaleOrdinal()
        .domain(years)
        .range(["red", "orange", "green", "blue"]);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(parseTime(d.date)))
        .attr("y", 40)
        .attr("width", 10)
        .attr("height", 30)
        .attr("fill", (d) => colorScale(parseTime(d.date).getFullYear()));

</script>
[/raw]

Other methods and properties available to an ordinal scaling function are:
<ul>
 	<li><a href="https://github.com/d3/d3-scale/blob/master/README.md#ordinal_unknown">unknown([value])</a></li>
 	<li><a href="https://github.com/d3/d3-scale/blob/master/README.md#ordinal_copy">copy()</a></li>
 	<li><a href="https://github.com/d3/d3-scale/blob/master/README.md#scaleImplicit">scaleImplicit</a></li>
</ul>
<h3>Band Scales</h3>
Band scales map a discrete domain to a set of <em>bands</em> within a continuous range.  The domain is specified using an array of values and the range is specified using a 2-element array to define a continuous interval.

A band scale creates <em>k</em> uniformly sized bands across the range, where <em>k</em> is the cardinality (size) of the domain.  The width of the bands is called the <em>bandwidth</em> which can be obtained using the <code class="">bandwidth</code> method.

In the example below, we create a band scale using a domain containing 4 colors and a range consisting of the interval [25, 575].
<pre>var colors = ["red", "orange", "green", "blue"];

var xScale = d3.scaleBand()
    .domain(colors)
    .range([25, 575]);</pre>
We join the colors to a set of rect elements, set the x-axis location using the band scaling function, and set the width of the rect elements to the bandwidth obtained using the <code class="">bandwidth</code> method.
<pre>.attr("x", (d) =&gt; xScale(d))
.attr("width", xScale.bandwidth())</pre>
[raw]
<svg id="demo2" width="600" height="100"></svg>

<script>
    var svg = d3.select("#demo2");

    var colors = ["red", "orange", "green", "blue"];

    var xScale = d3.scaleBand()
        .domain(colors)
        .range([25, 575]);

    var xAxis = d3.axisBottom(xScale);

    svg.append("g")
       .attr("transform", "translate(0,70)")
       .call(xAxis);

    svg.selectAll("rect")
        .data(colors)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d))
        .attr("y", 40)
        .attr("width", xScale.bandwidth())
        .attr("height", 30)
        .attr("fill", (d) => d);

</script>
[/raw]

By default there is no padding between the bands. Padding can be added, however, by passing an array containing a value between 0 and 1 to one the following methods.
<ul>
 	<li><a href="https://github.com/d3/d3-scale/blob/master/README.md#band_paddingOuter">paddingOuter([padding])</a></li>
 	<li><a href="https://github.com/d3/d3-scale/blob/master/README.md#band_paddingInner">paddingInner([padding])</a></li>
 	<li><a href="https://github.com/d3/d3-scale/blob/master/README.md#band_padding">padding([padding])</a></li>
</ul>
The argument to these functions specifies the ratio of the <em>step distance</em> that should be reserved for padding.  The step distance is the distance between the start of one band and the start of an adjacent band.  That is, the step distance is the sum of the bandwidth and the inner padding width.

In the example below we set the outer padding ratio to 0.25 and the inner padding ratio to 0.5.
<pre>var colors = ["red", "orange", "green", "blue"];

var xScale = d3.scaleBand()
    .domain(colors)
    .range([25, 575])
    .paddingOuter([.25])
    .paddingInner([.5]);</pre>
We set the location and width as before.

[raw]
<svg id="demo3" width="600" height="100"></svg>

<script>
    var svg = d3.select("#demo3");

    var colors = ["red", "orange", "green", "blue"];

    var xScale = d3.scaleBand()
        .domain(colors)
        .range([25, 575])
        .paddingOuter([.25])
        .paddingInner([.5]);

    var xAxis = d3.axisBottom(xScale);

    svg.append("g")
       .attr("transform", "translate(0,70)")
       .call(xAxis);

    svg.selectAll("rect")
        .data(colors)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d))
        .attr("y", 40)
        .attr("width", (d) => xScale.bandwidth())
        .attr("height", 30)
        .attr("fill", (d) => d);

</script>
[/raw]

Other methods and properties available to an ordinal scaling function are:
<ul>
 	<li><a href="https://github.com/d3/d3-scale/blob/master/README.md#band_rangeRound">rangeRound([<i>range</i>])</a></li>
 	<li><a href="https://github.com/d3/d3-scale/blob/master/README.md#band_round">round([<i>round</i>])</a></li>
 	<li><a href="https://github.com/d3/d3-scale/blob/master/README.md#band_align">align([<i>align</i>])</a></li>
 	<li><a href="https://github.com/d3/d3-scale/blob/master/README.md#band_bandwidth">bandwidth()</a></li>
 	<li><a href="https://github.com/d3/d3-scale/blob/master/README.md#band_step">step()</a></li>
 	<li><a href="https://github.com/d3/d3-scale/blob/master/README.md#band_copy">copy()</a></li>
</ul>
<h3>Point Scales</h3>
Point scales are band scales where the bandwidth is set to zero.  That is, a point scale maps a discrete domain to a set of points that lie equally spaced within the range. As with band scales, by default, there is no padding.

Below we create a point scale that uses the colors array for the domain and the interval [25, 575] as the range.
<pre>var colors = ["red", "orange", "green", "blue"];

var xScale = d3.scalePoint()
 .domain(colors)
 .range([25, 575]);</pre>
We join the colors data to a set of circle elements and set their center position on the x-axis using the point scale function.
<pre> .attr("cx", (d) =&gt; xScale(d))</pre>
[raw]
<svg id="demo4" width="600" height="100"></svg>

<script>
    var svg = d3.select("#demo4");

    var colors = ["red", "orange", "green", "blue"];

    var xScale = d3.scalePoint()
        .domain(colors)
        .range([25, 575]);

    var xAxis = d3.axisBottom(xScale);

    svg.append("g")
       .attr("transform", "translate(0,70)")
       .call(xAxis);

    svg.selectAll("circle")
        .data(colors)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d))
        .attr("cy", 40)
        .attr("r", 20)
        .attr("fill", (d) => d);

</script>
[/raw]

Other methods and properties available to an point scaling function are:
<ul>
 	<li><a href="https://github.com/d3/d3-scale/blob/master/README.md#point_padding">padding([padding])</a></li>
 	<li><a href="https://github.com/d3/d3-scale/blob/master/README.md#point_rangeRound">rangeRound([<i>range</i>])</a></li>
 	<li><a href="https://github.com/d3/d3-scale/blob/master/README.md#point_round">round([<i>round</i>])</a></li>
 	<li><a href="https://github.com/d3/d3-scale/blob/master/README.md#point_align">align([<i>align</i>])</a></li>
 	<li><a href="https://github.com/d3/d3-scale/blob/master/README.md#point_bandwidth">bandwidth()</a></li>
 	<li><a href="https://github.com/d3/d3-scale/blob/master/README.md#point_step">step()</a></li>
 	<li><a href="https://github.com/d3/d3-scale/blob/master/README.md#point_copy">copy()</a></li>
</ul>