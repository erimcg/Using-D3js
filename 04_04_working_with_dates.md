{{meta {docid: working_with_dates}}}
{{meta {description: ""}}}

<style>
  svg {
      background-color: lightblue;
  }
</style>

<script src="https://d3js.org/d3.v4.min.js"></script>

# Working With Dates

When displaying temporal data we often need to

+ Convert string representations of the temporal data to Date objects
+ Define a scale function that can map the Date objects to some range
+ Create an axis based on the scale function
+ Adjust the number of ticks and format the tick labels
+ Draw the axis and ticks
+ Draw visual elements for the data elements

## Converting Strings to Dates

When creating a scale for temporal data, we need to specify the domain of the scale with an array containing 2 Date objects.  These Date objects correspond to the beginning of the time scale and the end of the time scale.

D3 provides a method named [timeParse(specifier)](https://github.com/d3/d3-time-format) than can be used to convert string representations of temporal data to Date objects.  The method takes a string as an argument that specifies the format of the data.  The string contains directives that specify what types of temporal information is in the temporal data.  For example %Y is a directive that represents a 4-digit year.  As example, the specifier for a date of the form "April 1, 1970" is  "%b %d, %Y".  A complete list of directives can be found [here](https://github.com/d3/d3-time-format#locale_format).

The `timeParse` method returns a function object that when passed a string representing temporal data of the form specified by the specifier, will return a Date object representing the data.

In the example below, we create a time parsing function by calling timeParse with the specifier "%b %d, %Y".  We then iterate over the objects in data array and for each object, parse the date field to create a Date object, and push the date object in the dates array.

<pre>
var data = [
  {"date": "Apr 1, 1970", "event": "A"},
  {"date": "Jun 15, 1971", "event": "B"},
  {"date": "Mar 30, 1972", "event": "C"},
  {"date": "Jan 1, 1973", "event": "D"},
  {"date": "Jun 15, 1973", "event": "E"}
];

var parseTime = d3.timeParse("%b %d, %Y");

var dates = [];
for (let obj of data) {
  dates.push(parseTime(obj.date));
}
</pre>

## Getting the Minimum and Maximum Dates

When creating a scale we need to define the domain for the scale using a scale generator's `domain` method.  The `domain` method takes an array containing the minimum and maximum dates for the scale as an argument.  An easy way to create an array for the `domain` method is to use the `extent` method.  The `extent` method takes an array as an argument and returns a new array containing only the minimum and maximum elements.

<pre>
var domain = d3.extent(dates);
</pre>

## Creating a Time Scaled Axis

Next, we create a temporal scaling function using [d3.scaleTime](https://github.com/d3/d3-scale/blob/master/README.md#scaleTime),  We set the domain of the scale by passing the array containing the min and max dates to the `domain` method and set the range relative to the width of the svg element by calling the `range` method.  An axis function is created by calling `axisBottom`, passing it the scaling function.   Once we have the axis function, we call it to draw the axis.

<pre>
var xScale = d3.scaleTime()
  .domain(domain)
  .range([25, 555]);

var xAxis = d3.axisBottom(xScale);

var svg = d3.select("#dateDemo1");

svg.append("g")
  .attr("transform", "translate(0,60)")
  .call(xAxis);
</pre>

Putting this all together we get the following axis.

```
<script>
  function drawDemo1() {
    var data = [
      {"date": "Apr 1, 1970", "event": "A"},
      {"date": "Jun 15, 1971", "event": "B"},
      {"date": "Mar 30, 1972", "event": "C"},
      {"date": "Jan 1, 1973", "event": "D"},
      {"date": "Jun 15, 1973", "event": "E"}
    ];

    var parseTime = d3.timeParse("%b %d, %Y");

    var dates = [];
    for (let obj of data) {
        dates.push(parseTime(obj.date));
    }

    var domain = d3.extent(dates);

    var xScale = d3.scaleTime()
          .domain(domain)
          .range([25, 555]);

    var xAxis = d3.axisBottom(xScale);

    var svg = d3.select("#dateDemo1");

    svg.append("g")
        .attr("transform", "translate(0,60)")
        .call(xAxis);
  }

  drawDemo1();
</script>

<svg id="dateDemo1" width="580" height="100"></svg>
```

## Limiting Ticks to Year Marks

As you can see above, sometimes the number of ticks and their labels are not ideal.  We can configure d3's axis function to draw ticks at a specific time intervals by calling `ticks` on the axis function and passing in one of the [d3 time interval](https://github.com/d3/d3/blob/master/API.md#time-intervals-d3-time) objects.  Below we pass in `d3.timeYear` to `ticks` which causes the axis function to draw ticks at the beginning of each year.

<pre>
svg.append("g")
   .attr("transform", "translate(0,60)")
   .call(xAxis.ticks(d3.timeYear));
 </pre>

```
<script>
  function drawDemo2() {
    var data = [
      {"date": "Apr 1, 1970", "event": "A"},
      {"date": "Jun 15, 1971", "event": "B"},
      {"date": "Mar 30, 1972", "event": "C"},
      {"date": "Jan 1, 1973", "event": "D"},
      {"date": "Jun 15, 1973", "event": "E"}
    ];

    var parseTime = d3.timeParse("%b %d, %Y");

    var dates = [];
    for (let obj of data) {
        dates.push(parseTime(obj.date));
    }

    var domain = d3.extent(dates);

    var xScale = d3.scaleTime()
          .domain(domain)
          .range([25, 555]);

    var xAxis = d3.axisBottom(xScale);

    var svg = d3.select("#dateDemo2");

    svg.append("g")
        .attr("transform", "translate(0,60)")
        .call(xAxis.ticks(d3.timeYear));
  }

  drawDemo2();
</script>

<svg id="dateDemo2" width="580" height="100"></svg>
```

## Expanding the Domain

If you'd like the domain to begin at the start of one year and end at the start of another year, we can use the time interval `floor` and `ceil` methods on the `timeYear` interval.  The `floor` method takes a `Date` as an argument and returns a `Date` object holding the smallest date in the same year (midnight, Jan 1, same year).  Similarly, the `ceil` method takes a `Date` object as an argument and returns the smallest date in the next year's interval (midnight, Jan 1, next year).

<pre>
domain = [d3.timeYear.floor(domain[0]), d3.timeYear.ceil(domain[1])];
</pre>

```
<script>
  function drawDemo3() {
    var data = [
      {"date": "Apr 1, 1970", "event": "A"},
      {"date": "Jun 15, 1971", "event": "B"},
      {"date": "Mar 30, 1972", "event": "C"},
      {"date": "Jan 1, 1973", "event": "D"},
      {"date": "Jun 15, 1973", "event": "E"}
    ];

    var parseTime = d3.timeParse("%b %d, %Y");

    var dates = [];
    for (let obj of data) {
        dates.push(parseTime(obj.date));
    }

    var domain = d3.extent(dates);
    domain = [d3.timeYear.floor(domain[0]), d3.timeYear.ceil(domain[1])];

    var xScale = d3.scaleTime()
          .domain(domain)
          .range([25, 555]);

    var xAxis = d3.axisBottom(xScale);

    var svg = d3.select("#dateDemo3");

    svg.append("g")
        .attr("transform", "translate(0,60)")
        .call(xAxis.ticks(d3.timeYear));
  }

  drawDemo3();
</script>

<svg id="dateDemo3" width="580" height="100"></svg>
```

## Adding Month Ticks and an Axis Label

If you'd like to add a second set of tick marks you can do so with the original x-axis function.  Below we draw tick marks for each month.  We also remove the text for the monthly tick marks since they're not necessary when analyzing the axis.  Note that if we draw yearly ticks as well, we'd want to draw the yearly ticks after drawing the monthly ticks so as to not remove the labels for the yearly ticks.

<pre>
svg.append("g")
    .attr("transform", "translate(0,60)")
    .call(xAxis.ticks(d3.timeMonth));

svg.selectAll(".tick text").remove();
</pre>

Below is code that draws a Label reading "Dates" for the axis.

<pre>
svg.append("text")
    .attr("transform", "translate(300,95)")
   .style("text-anchor", "middle")
   .attr("fill", "black")
   .text("Dates");
</pre>

```
<script>
  function drawDemo4() {
    var data = [
      {"date": "Apr 1, 1970", "event": "A"},
      {"date": "Jun 15, 1971", "event": "B"},
      {"date": "Mar 30, 1972", "event": "C"},
      {"date": "Jan 1, 1973", "event": "D"},
      {"date": "Jun 15, 1973", "event": "E"}
    ];

    var parseTime = d3.timeParse("%b %d, %Y");

    var dates = [];
    for (let obj of data) {
        dates.push(parseTime(obj.date));
    }

    var domain = d3.extent(dates);
    domain = [d3.timeYear.floor(domain[0]), d3.timeYear.ceil(domain[1])];

    var xScale = d3.scaleTime()
          .domain(domain)
          .range([25, 555]);

    var xAxis = d3.axisBottom(xScale);

    var svg = d3.select("#dateDemo4");

    svg.append("g")
        .attr("transform", "translate(0,60)")
        .call(xAxis.ticks(d3.timeMonth));

    svg.selectAll(".tick text").remove();

    svg.append("g")
        .attr("transform", "translate(0,60)")
        .call(xAxis.ticks(d3.timeYear));

    svg.append("text")
        .attr("transform", "translate(300,95)")
        .style("text-anchor", "middle")
        .attr("fill", "black")
        .text("Dates");
  }

  drawDemo4();
</script>

<svg id="dateDemo4" width="580" height="100"></svg>
```

## Adding Data Points

Recall from earlier that we have an array containing 5 objects, where each object has a date property and an event property.  Below, we join the data to new circle elements and set the circle's radii, color, and position. Since the date property is a string, in order to find its position on the x-axis using the `xScale` scaling function, we need to convert the string to a `Date` object.  To do so, we can use the same parsing function that we created earlier (`parseTime`) and pass the result to the scaling function (`xScale`).

<pre>
svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("fill", "black")
    .attr("cx", (d) =&gt; xScale(parseTime(d.date)))
    .attr("cy", 50);
</pre>

```
<style>
  div.tooltip {
    position: absolute;
    text-align: center;
    padding: 2px;
    font: 12px sans-serif;
    background: lightsteelblue;
    border: 0px;
    border-radius: 8px;
    pointer-events: none;
}
</style>

<script>
  function drawDemo5() {

    var tooltip = d3.select("body").append("div")
                  .attr("class", "tooltip")
                  .style("opacity", 0);

    var data = [
      {"date": "Apr 1, 1970", "event": "A"},
      {"date": "Jun 15, 1971", "event": "B"},
      {"date": "Mar 30, 1972", "event": "C"},
      {"date": "Jan 1, 1973", "event": "D"},
      {"date": "Jun 15, 1973", "event": "E"}
    ];

    var parseTime = d3.timeParse("%b %d, %Y");

    var dates = [];
    for (let obj of data) {
        dates.push(parseTime(obj.date));
    }

    var domain = d3.extent(dates);
    domain = [d3.timeYear.floor(domain[0]), d3.timeYear.ceil(domain[1])];

    var xScale = d3.scaleTime()
          .domain(domain)
          .range([25, 555]);

    var xAxis = d3.axisBottom(xScale);

    var svg = d3.select("#dateDemo5");

    svg.append("g")
        .attr("transform", "translate(0,60)")
        .call(xAxis.ticks(d3.timeMonth));

    svg.selectAll(".tick text").remove();

    svg.append("g")
        .attr("transform", "translate(0,60)")
        .call(xAxis.ticks(d3.timeYear));

    svg.append("text")
        .attr("transform", "translate(300,95)")
        .style("text-anchor", "middle")
        .attr("fill", "black")
        .text("Dates");

    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 7)
      .attr("fill", "black")
      .attr("cx", (d) => xScale(parseTime(d.date)))
      .attr("cy", 50)
      .on("mouseover", function(d) {
                          tooltip.transition()
                              .duration(200)
                              .style("opacity", .9);
                          tooltip.html(d.date)
                              .style("left", (d3.event.pageX) + "px")
                              .style("top", (d3.event.pageY - 28) + "px");
                      })
      .on("mouseout", function(d) {
                          tooltip.transition()
                              .duration(500)
                              .style("opacity", 0);
      });
  }

  drawDemo5();
</script>

<svg id="dateDemo5" width="580" height="100"></svg>
```