{{meta {docid: continuous_scales}}}

<script src="https://d3js.org/d3.v4.min.js"></script>

# Continuous Scales

Recall from the last tutorial that continuous scaling functions map a **continuous numeric domain** defined by an interval to a **continuous range** defined by another interval.

Continuous scaling functions are created using the following methods:

+ [continuous d3.scaleLinear()](https://github.com/d3/d3-scale/blob/master/README.md#linear-scales)
+ [pow d3.scalePow()](https://github.com/d3/d3-scale/blob/master/README.md#power-scales)
+ [pow d3.scaleSqrt()](https://github.com/d3/d3-scale/blob/master/README.md#scaleSqrt)
+ [log d3.scaleLog()](https://github.com/d3/d3-scale/blob/master/README.md#log-scales)
+ [time d3.scaleTime()](https://github.com/d3/d3-scale/blob/master/README.md#scaleTime)
+ [time d3.scaleUtc()](https://github.com/d3/d3-scale/blob/master/README.md#scaleUtc)

Each of these methods returns a reference to an instances of one of the following Function object types: continuous, pow, log or time.

Each of these Function object types has a set of methods associated with it that are used to get and set various properties of the scaling function.  You can find a [comprehensive list](https://github.com/d3/d3/blob/master/API.md#continuous-scales) in the API documentation.   Below is a list of the methods provided by each of the function types.

<div>
  <svg id="methodList" width="600" height="300"></svg>
</div>

<script>
var methodNames = [
  "invert",
  "domain",
  "range",
  "rangeRound",
  "clamp",
  "interpolate",
  "ticks",
  "tickFormat",
  "nice",
  "copy",
  "exponent",
  "base"];

var columns = ["methods", "continuous", "pow", "log", "time"];

var contMethods = [0,1,2,3,4,5,6,7,8,9];
var powMethods = [0,1,2,3,4,5,6,7,8,9,10];
var logMethods = [0,1,2,3,4,5,6,7,8,9,11];
var timeMethods = [0,1,2,3,4,5,6,7,8,9];

  var yScale = d3.scaleLinear()
    .domain([0,11])
    .range([40,280]);

  d3.select("#methodList")
     .selectAll("g")
     .data(columns)
     .enter()
     .append("g")
     .attr("id", (d) => d);

  d3.select("#" + columns[0])
      .selectAll("text")
      .data(methodNames)
      .enter()
      .append("text")
      .attr("x", 100)
      .attr("y", (d,i) => yScale(i))
      .text((d) => d)
      .attr('text-anchor', 'end');

function drawCircles(colNum, data, cx) {
  var u = d3.select("#" + columns[colNum]);

  u.append("text")
      .attr("x", cx)
      .attr("y", 20)
      .attr('text-anchor', 'middle')
      .text(columns[colNum]);

  u.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", cx)
      .attr("cy", (d) => yScale(d))
      .attr("r", 8)
      .attr("fill", "pink");
}

drawCircles(1, contMethods, 150);
drawCircles(2, powMethods, 220);
drawCircles(3, logMethods, 290);
drawCircles(4, timeMethods, 360);

</script>

## Example

The example below shows a typical pattern for defining and using a continuous scaling function.

We'll use the homeless population that we've used in some of our previous examples.
<pre>
var data = [
    {"state": "California","population": 134278 },
    {"state": "Florida","population": 32190 },
    {"state": "Washington","population": 21112 },
    {"state": "New York","population": 89503 },
    {"state": "Texas","population": 23548 }
];
</pre>

Rather than displaying a bar graph as we did in previous examples, let's create 5 circles in a row, one circle for each state, where the radius of a circles is proportional to the size of the homeless population in the respective state.

Since we want to maintain the proportional differences between data points we'll use the `scaleLinear` method. The `scaleLinear` method returns a reference to a `continuous` object on which we can call the `domain` and `range` methods to set the domain and range of the scaling function.

Below we create two scaling functions, one to be used when computing the radii and the other to compute where along the x-axis to place the circle.
<pre>
var rScale = d3.scaleLinear()
    .domain([0,140000])
    .range([1,30]);

var xScale = d3.scaleLinear()
    .domain([0,4])
    .range([50,550]);
    </pre>

Below we create 5 circles, set their properties, and create 5 text elements to display the state names.  The calls to the scaling functions are in bold font.

<pre>
var u = d3.select("#homeless1")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d,i) =&gt; <strong>xScale(i)</strong>)
    .attr("cy", 50)
    .attr("r", (d,i) =&gt; <strong>rScale(d.population)</strong>)
    .attr("fill", "pink");

u = d3.select("#homeless1")
    .selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .text((d) =&gt; d.state)
    .attr('x', (d,i) =&gt; <strong>xScale(i)</strong>)
    .attr('y', 95)
    .attr('text-anchor', 'middle');
</pre>

``` {cm: active}
<svg id="homeless1" width="600" height="100" ></svg>

<script>
  var data = [
      {"state": "California","population": 134278 },
      {"state": "Florida",   "population": 32190 },
      {"state": "Washington","population": 21112 },
      {"state": "New York","population": 89503 },
      {"state": "Texas","population": 23548 }
  ];

  var rScale = d3.scaleLinear()
      .domain([0,140000])
      .range([1,30]);

  var xScale = d3.scaleLinear()
      .domain([0,4])
      .range([50,550]);

  var u = d3.select("#homeless1")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d,i) => xScale(i))
      .attr("cy", 50)
      .attr("r", (d,i) => rScale(d.population))
      .attr("fill", "pink");

  u = d3.select("#homeless1")
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .text((d) => d.state)
      .attr('x', (d,i) => xScale(i))
      .attr('y', 95)
      .attr('text-anchor', 'middle');

</script>
```

## Domain and Range Intervals

The domain and range intervals can include more than 2 values, but they should have the same number of values. If a domain is specified as [x1, x2, ..., xn] and the range is specified as [y1, y2, ..., yn]  then values between x1 and x2 are mapped to values between y1 and y2, and values between x2 and x3 are mapped to values between y2 and y3, etc.

## Color Scales

The range interval for a continuous scaling function can also specify colors, rather than numbers.

Below we add a third scaling function that we use to compute the colors of the circles.
<pre>
var cScale = d3.scaleLinear()
    .domain([0,140000])
    .range(["yellow", "red"]);
</pre>

```
<svg id="homeless2" width="600" height="100" ></svg>

<script>
  var data = [
      {"state": "California","population": 134278 },
      {"state": "Florida",   "population": 32190 },
      {"state": "Washington","population": 21112 },
      {"state": "New York","population": 89503 },
      {"state": "Texas","population": 23548 }
  ];
  
  var cScale = d3.scaleLinear()
      .domain([0,140000])
      .range(["yellow", "red"]);
      
  var xScale = d3.scaleLinear()
      .domain([0,4])
      .range([50,550]);
      
  var rScale = d3.scaleLinear()
      .domain([0,140000])
      .range([1,30]);

  var u = d3.select("#homeless2")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d,i) => xScale(i))
      .attr("cy", 50)
      .attr("r", (d) => rScale(d.population))
      .attr("fill", (d) => cScale(d.population));

  u = d3.select("#homeless2")
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .text((d) => d.state)
      .attr('x', (d,i) => xScale(i))
      .attr('y', 95)
      .attr('text-anchor', 'middle');

</script>
```

## Clamping

By default, each of the continuous scaling functions accept values outside of the domain and uses extrapolation to compute a return value.  If we'd like to turn off extrapolation and return only values within the range, we can use the `clamp` method.

<pre>
xScale.clamp(true);
</pre>

## Invert

If the scale function has a numeric domain, the `invert` method maps a value within the range to a value within the domain.

## Nice

When a domain interval is created using actual data, it is often necessary to extend the domain on both ends so that when data values are scaled, the result is not a boundary of the range.  The `nice` method does just that, it rounds the domain to *nice* round values.