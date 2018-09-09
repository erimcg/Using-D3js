{{meta {docid: legends}}}

<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.25.6/d3-legend.min.js"></script>

<style>
  .label { font-size: 12px; }
</style>

# Legends

D3 doesn't have built-in support for legends, however, Susie Lu has developed a module named d3-legend that can be used to easily create legends.  Here user documentation can be found at [d3-legend.susielu.com](http://d3-legend.susielu.com).

The latest version of the module can be imported into a script using the [CDN](https://cdnjs.com/libraries/d3-legend) as shown below:

<pre>
&lt;script src="https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.25.6/d3-legend.min.js"&gt;&lt;/script&gt;
</pre>

D3-legend provides 3 types of legends: color legend, size legend, and symbol legend.  We can construct legend generators using the following methods:

+ [d3.legendColor()]()
+ [d3.legendSize()]()
+ [d3.legendSymbol()]()

## Color Legend

The example below construct a plot and legend in a svg element.

<pre>
&lt;svg id="demo1" width="580" height="120"&gt;&lt;/svg&gt;
</pre>

The plot consists of 8 circle elements with data joined to them and their fill properties set using a color scale created using `scaleLinear`.

<pre>
var colorScale = d3.scaleLinear()
    .domain([0,2500])
    .range(["red", "blue"]);
</pre>

The color scale is also used to create a legend.  Below we create a color legend using the `legendColor` generator and the `scale` functions to set the scale.

<pre>
var legend = d3.legendColor()
    .scale(colorScale);
</pre>

We then create a group element, shift it down and to the right, and draw the legend within the group element.

<pre>
svg.append("g")
    .attr("transform", "translate(500,10)")
    .call(legend);
</pre>

```
<style>
    svg { background-color: pink; }
</style>

<svg id="demo1" width="580" height="120"></svg>

<script>
  var svg = d3.select("#demo1");

  /*** Draw X-Axis ***/
  var xScale = d3.scaleLinear()
    .domain([0,9])
    .range([25, 475]);

  var xAxis = d3.axisBottom(xScale);

  svg.append("g")
    .attr("transform", "translate(0,80)")
    .call(xAxis);

  /*** Create color scale ***/
  var colorScale = d3.scaleLinear()
    .domain([0,2500])
    .range(["red", "blue"]);

  /*** Draw data points using color scale ***/

  svg.selectAll("circle")
    .data([300, 580, 900, 1200, 1500, 1800, 2100, 2400])
    .enter()
    .append("circle")
    .attr("cx", (d,i) => xScale(i+1))
    .attr("cy", 50)
    .attr("r", 13)
    .attr("fill", (d) => colorScale(d));

  var legend = d3.legendColor()
    .scale(colorScale);

  svg.append("g")
    .attr("transform", "translate(500,10)")
    .call(legend);

</script>
```

There are various methods that can be called on a legend function object returned by the d3.legendColor generator.  You can find information on each of these below and at [http://d3-legend.susielu.com](http://d3-legend.susielu.com).

+ legendColor.cells(arg) - set the number of symbol/label pairs in the legend or specify the intervals for which symbol/label pairs are drawn.
+ legendColor.cellFilter(function) - specify a function to exclude certain symbol/label pairs from the legend.
+ legendColor.orient(string) - specify if the legend should be "vertical" or "horizontal".
+ legendColor.ascending(boolean) - sets the order of the scale.
+ legendColor.shape(string [,path]) - specify the shape of the symbols.
+ legendColor.shapeWidth(number) - set the width of "rect" or "line" shape symbols.
+ legendColor.shapeHeight(number) - set the height of "rect" shape symbols.
+ legendColor.shapePadding(number) - set the spacing between legend symbols.
+ legendOffset(number) - set the spacing between symbols and labels.
+ legendColor.useClass(boolean) - if true, sets the symbol's class to the value returned by the scale function.
+ legendColor.classPrefix(string) - adds string to each class name???
+ legendColor.title(string) - sets the title for the legend.
+ legendColor.titleWidth(number) - width of each title line.
+ legendColor.labels([strings] | function) - explicitly set the labels.
+ legendColor.labelAlign(string) - sets label alignment to "start", "middle" or "end" for horizontally oriented legends.
+ legendColor.labelFormat(d3.format) - set format of labels.
+ legendColor.locale(d3.format locale) - set label format locale.
+ legendColor.labelDelimiter(string) - replace "to" text when using quantize scale.
+ legendColor.labelWrap(number) - set max width of a line of a label.
+ legendColor.on(string, function) - set event handler for "cellover", "cellout", or "cellclick".

## Setting the Number of Symbol/Label Pairs

Below we set the number of symbol/label pairs to 3.

<pre>
var legend = d3.legendColor()
    .scale(colorScale)
    .cells(3);
</pre>

```
<svg id="demo2" width="580" height="120"></svg>

<script>
  var svg = d3.select("#demo2");

  /*** Draw X-Axis ***/
  var xScale = d3.scaleLinear()
    .domain([0,9])
    .range([25, 475]);

  var xAxis = d3.axisBottom(xScale);

  svg.append("g")
    .attr("transform", "translate(0,80)")
    .call(xAxis);

  /*** Create color scale ***/
  var colorScale = d3.scaleLinear()
    .domain([0,2500])
    .range(["red", "blue"]);

  /*** Draw data points using color scale ***/

  svg.selectAll("circle")
    .data([300, 580, 900, 1200, 1500, 1800, 2100, 2400])
    .enter()
    .append("circle")
    .attr("cx", (d,i) => xScale(i+1))
    .attr("cy", 50)
    .attr("r", 13)
    .attr("fill", (d) => colorScale(d));

  /*** Create and draw the legend ***/
  var legend = d3.legendColor()
    .scale(colorScale)
    .cells(3);

  svg.append("g")
    .attr("transform", "translate(500,10)")
    .call(legend);

</script>
```

## Setting Label Text

We can also format the label text and provide a title for the legend using the lableFormat and title methods respectively.  Below we remove the mantissa digits (digits after the decimal point) and add "Legend" as the title of the legend.

<pre>
var legend = d3.legendColor()
    .scale(colorScale)
    .labelFormat(d3.format(".0f"))
    .title("Legend");
</pre>

```
<svg id="demo4" width="580" height="120"></svg>

<script>
  var svg = d3.select("#demo4");

  /*** Draw X-Axis ***/
  var xScale = d3.scaleLinear()
    .domain([0,9])
    .range([25, 475]);

  var xAxis = d3.axisBottom(xScale);

  svg.append("g")
    .attr("transform", "translate(0,80)")
    .call(xAxis);

  /*** Create color scale ***/
  var colorScale = d3.scaleLinear()
    .domain([0,2500])
    .range(["red", "blue"]);

  /*** Draw data points using color scale ***/

  svg.selectAll("circle")
    .data([300, 580, 900, 1200, 1500, 1800, 2100, 2400])
    .enter()
    .append("circle")
    .attr("cx", (d,i) => xScale(i+1))
    .attr("cy", 50)
    .attr("r", 13)
    .attr("fill", (d) => colorScale(d));

  /*** Create and draw the legend ***/
  var legend = d3.legendColor()
    .scale(colorScale)
    .cells(3)
    .labelFormat(d3.format(".0f"))
    .title("Legend");

  svg.append("g")
    .attr("transform", "translate(500,20)")
    .call(legend);

</script>
```

## Using Classes

In the example below we have defined 4 CSS classes in a CSS stylesheet.

<pre>
.one { fill: red;}
.two { fill: orange;}
.three { fill: green;}
.four { fill: blue;}
</pre>

We also have a quantize scale that uniformly segments a continuous domain into 4 segments and maps each segment to one of 4 strings (the names of the above classes).

<pre>
var colorScale = d3.scaleQuantize()
    .domain([0,2500])
    .range(["one", "two", "three", "four"]);
</pre>

We're going to use the color scale in two ways.  First to assign classes to circle elements so that their fill properties will be set to an appropriate color.  Second, to determine the number of symbol/label pairs in the legend and to define the fill of each of the symbols.

We can set the class name for each circle drawn by using the `each` method on the selection of circles after the circles are created.

<pre>
svg.selectAll("circle")
    .each((d, i, nodes) =&gt; {
        nodes[i].classList.add(colorScale(d));
    });
</pre>

By default the legend creates rect elements and fills them with a color returned by the scale.  In our case, the scale doesn't return a color, but rather the name of a class.  By calling useClass, each symbol in the legend is assigned one of the class names returned by the scale - thus setting the fill color.

<pre>
var legend = d3.legendColor()
    .scale(colorScale)
    .useClass(true);
</pre>

```
<style>
.one { fill: red;}
.two { fill: orange;}
.three { fill: green;}
.four { fill: blue;}
</style>

<svg id="demo3" width="700" height="120"></svg>

<script>
  var svg = d3.select("#demo3");

  /*** Draw X-Axis ***/
  var xScale = d3.scaleLinear()
    .domain([0,9])
    .range([25, 475]);

  var xAxis = d3.axisBottom(xScale);

  svg.append("g")
    .attr("transform", "translate(0,80)")
    .call(xAxis);

  /*** Create color scale ***/
  var colorScale = d3.scaleQuantize()
    .domain([0,2500])
    .range(["one", "two", "three", "four"]);

  /*** Draw data points using color scale ***/

  svg.selectAll("circle")
    .data([300, 580, 900, 1200, 1500, 1800, 2100, 2400])
    .enter()
    .append("circle")
    .attr("cx", (d,i) => xScale(i+1))
    .attr("cy", 50)
    .attr("r", 13);

  svg.selectAll("circle")
    .each((d, i, nodes) => {
        nodes[i].classList.add(colorScale(d));
  });

  /*** Create and draw the legend ***/
  var legend = d3.legendColor()
    .scale(colorScale)
    .useClass(true);

  svg.append("g")
    .attr("transform", "translate(500,10)")
    .call(legend);

</script>
```
