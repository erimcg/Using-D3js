
{{meta {docid: stack}}}

<script src="https://unpkg.com/d3-area-label@1.4.0/build/d3-area-label.js"></script>
<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.25.6/d3-legend.min.js"></script>

<script>
//This is the function that adds the axis to some of the stacks
function addAxis(svgSel, d, xscale, yscale, firstStack){
	let dates, maxPValues, maxNValues, blankAxis;
	
	if(d){
      dates = d.map( (d) => d.month );
      if(firstStack){
        maxPValues = d.map( (d) => {
            let sum = 0;
            for(let [key, value] of Object.entries(d)){ sum += key != "month" ? value : 0; }
            return sum;
         });
        maxNValues = [0,0]; 
      }
      else {
      	maxPValues = d.map( (d) => {
            let sum = 0;
            for(let [key, value] of Object.entries(d.fruitSales)){ sum += key != "month" ? (value > 0 ? value : 0): 0; }
            return sum;
         });
        maxPValues.push(0);
        
        maxNValues = d.map( (d) => {
            let sum = 0;
            for(let [key, value] of Object.entries(d.fruitSales)){ sum += key != "month" ? (value < 0 ? value : 0 ): 0; }
            return sum;
         });
        maxNValues.push(0);
        }
    }
    else{
    	dates = [0,0];
    	blankAxis = true;
        maxPValues = [0,0];
        maxNValues = [0,0];
    }
    
    if(xscale){
        xscale.domain([dates[0], dates[dates.length - 1]]);
        // Add xAxis
        let xAxis = d3.axisBottom(xscale)
        	.tickValues(blankAxis ? [] : dates)
        	.tickFormat(d3.timeFormat("%b"));
        svgSel.append("g")
            .attr("transform", "translate(0, 275)")
            .call(xAxis);
    }
    if(yscale){
        yDomain = d3.extent(maxPValues.concat(maxNValues));
        yscale.domain(yDomain);
        // Add yAxis
        let yAxis = d3.axisLeft(yscale)
            .ticks(8);
        svgSel.append("g")
            .attr("transform", "translate(49, 0)")
            .call(yAxis);
    }
}

//This function is used to add labels to all the areas
function addLabels(selection, data, area){
        selection.selectAll(".label")
            .data(data)
            .join("text")
            .text((d) => d.key)
            .attr("transform", d3.areaLabel(area).minHeight(9.5))
            .attr("fill", "black");
    }
</script>

# Stacks

When having multivariate data, it may be useful to show the data depicted as areas stacked on top of each other. Examples of this include [stacked bar charts](https://bl.ocks.org/mbostock/1134768), [stacked area graphs](http://bl.ocks.org/anaeliaovalle/e57763e85def2a95be931c69eff6bfa6), and [streamgraphs](http://bl.ocks.org/WillTurman/4631136).

Consider the following array containing sales data for three fruits over three months.  

<pre>
var data = [
    {month: new Date(2018, 1, 1), apples: 10, bananas: 20, oranges: 15},
    {month: new Date(2018, 2, 1), apples: 15, bananas: 15, oranges: 15},
    {month: new Date(2018, 3, 1), apples: 20, bananas: 25, oranges: 15}
];
</pre>

This dataset has a form that is typically visualized using a stacked chart or graph.  The data for each fruit is referred to as a series.  For example, the data for apples is the series `(10, 15, 20)`. Each series can be displayed as an area, with one stacked on top of the other as shown in the visualization below.  The number of objects in each series determines the width of the areas.

 ```
<script>
var data = [
    {month: new Date(2018, 1, 1), apples: 10, bananas: 20, oranges: 15},
    {month: new Date(2018, 2, 1), apples: 15, bananas: 15, oranges: 15},
    {month: new Date(2018, 3, 1), apples: 20, bananas: 25, oranges: 15}
];

var stackGen = d3.stack()
  .keys(["apples", "bananas", "oranges"]);
    
var stackedSeries = stackGen(data); 

var xScale = d3.scaleTime().domain([data[0].month, data[2].month]).range([50, 275]);
var yScale = d3.scaleLinear().domain([0,60]).range([275, 25]);

addAxis(d3.select("#demo0"), data, xScale, yScale, true); 

var colorScale = d3.scaleOrdinal()
  .domain(["apples", "bananas", "oranges"])
  .range(["red", "yellow", "orange"]);

var areaGen = d3.area()
  .x((d) => xScale(d.data.month))
  .y0((d) => yScale(d[0]))
  .y1((d) => yScale(d[1]));
    
d3.select("#demo0")
  .selectAll(".areas")
  .data(stackedSeries)
  .join("path")
  .attr("d", areaGen)
  .attr("fill", (d) => colorScale(d.key));
    
addLabels(d3.select("#demo0"), stackedSeries, areaGen);
</script>

<svg id="demo0" width= "300" height="300"></svg>
 ```
<figure class="sandbox"><figcaption>Figure 1. A stacked area graph. </figcaption></figure>

In order to create stacked areas we need to compute cumulative y-values for each data point in each series.  Let's consider the stacked area graph shown above to see what we mean by *cumulative values*.

Notice that the visualization shows apples on the bottom, bananas in the middle, and oranges on top.  Also notice that the bottom line of the apple area is the x-axis, and that the bottom line of the other two areas is the top line of the area below it.  Therefore in order to define the areas we only need to compute the top lines of each area.  Since the top lines are line segments drawn from points at each month mark on the x-axis, we only need to compute the value of the top line at these points.

Let's start at the bottom of the graph and work our way up.  Since the number of apples sold each month is depicted in the lower area, the y-coordinates of the points on the top line of the apple area are simply the values in the `apples` series.  For the next layer, bananas, at each month point, the y-coordinate of the point on the top line of the bananas area is the y-coordinate of the point on the top line of the apples area *plus* the respective value in the `bananas` series.  Similarly, at each time interval, the y-coordinate of the point on the top line of the oranges area is the y-coordinate of the point on the top line of the bananas area *plus* the respective value in the `oranges` series.

Thankfully, D3.js provides a stack generator that does this computation for us.

## Creating Stacks

To create a stacked visualization using D3.js, we can use `d3.stack`, a method that returns a stack generator.  

+ [d3.stack()](https://github.com/d3/d3-shape#stack) - returns a stack generator. 

We may not want to create an area/layer for each series in the original dataset.  Therefore, when using `d3.stack`, we need to specify which properties (series) in the dataset to use.  We do so by using `stack.keys`.  When we call `d3.stack` to create the generator, we'll chain a call to `stack.keys` passing to it an array of the strings, where each string is the name of a property that we want to create a layer for.

+ [stack.keys([keys])](https://github.com/d3/d3-shape#stack_keys) - Takes an array of strings as an argument and returns the stack generator.

For the dataset used in Figure 1, the keys are `apples`, `bananas`, and `oranges`, therefore to create a stack generator and assign the keys, we'll do the following.

<pre>
var stackGen = d3.stack()
  .keys(["apples", "bananas", "oranges"]);
</pre>

After setting up the stack generator we invoke it, passing to it the dataset.

<pre>
var stackedSeries = stackGen(data); 
</pre>

+ [stack(data[,arguements])](https://github.com/d3/d3-shape#_stack) - Takes an array of data as an argument and returns back an array of series data.

When the stack generator is invoked with a dataset, it maps each series in the dataset that we specified in `stack.keys` to a new series. Each new series contains the bottom and top y-coordinates for each data point in the original series, as well as reference to the object in the original dataset from which the top y-coordinate is computed.

The array referenced by `stackedSeries` holds the following data:

<pre>
[
  [[0,  10, data[0]], [0,  15, data[1]], [0,  20, data[2]]],  //apples
  [[10, 30, data[0]], [15, 30, data[1]], [20, 45, data[2]]],  //bananas
  [[30, 45, data[0]], [30, 45, data[1]], [45, 60, data[2]]]   //oranges
]   
</pre>

To render this data into stacked areas we need an area generator and some scales:

<pre>
var xScale = d3.scaleTime()
  .domain([data[0].month, data[2].month])
  .range([50, 275]);
  
var yScale = d3.scaleLinear()
  .domain([0,60])
  .range([275, 25]);

var colorScale = d3.scaleOrdinal()
  .domain(["apples", "bananas", "oranges"])
  .range(["red", "yellow", "orange"]);

var areaGen = d3.area()
  .x((d) => xScale(d.data.month))
  .y0((d) => yScale(d[0]))
  .y1((d) => yScale(d[1]));
</pre>
 
Now we can use the `stackedSeries` data with our `areaGen` to create multiple SVG paths:

<pre>
d3.select("#demo1")
  .selectAll(".areas")
  .data(stackedSeries)
  .join("path")
  .attr("d", areaGen)
  .attr("fill", (d) => colorScale(d.key));
</pre>

 ```
<script>
var data = [
    {month: new Date(2018, 1, 1), apples: 10, bananas: 20, oranges: 15},
    {month: new Date(2018, 2, 1), apples: 15, bananas: 15, oranges: 15},
    {month: new Date(2018, 3, 1), apples: 20, bananas: 25, oranges: 15}
];

var stackGen = d3.stack()
  .keys(["apples", "bananas", "oranges"]);
    
var stackedSeries = stackGen(data);

var xScale = d3.scaleTime().domain([data[0].month, data[2].month]).range([50, 275]);
var yScale = d3.scaleLinear().domain([0,60]).range([275, 25]);

var colorScale = d3.scaleOrdinal()
  .domain(["apples", "bananas", "oranges"])
  .range(["red", "yellow", "orange"]);

var areaGen = d3.area()
  .x((d) => xScale(d.data.month))
  .y0((d) => yScale(d[0]))
  .y1((d) => yScale(d[1]));
    
d3.select("#demo1")
  .selectAll(".areas")
  .data(stackedSeries)
  .join("path")
  .attr("d", areaGen)
  .attr("fill", (d) => colorScale(d.key));
    
</script>

<svg id="demo1" width= "300" height="300"></svg>
 ```
<figure class="sandbox"><figcaption>Figure 2. A basic stacked area graph. </figcaption></figure>

### Creating Bar Graphs

Alternately, instead of appending areas we can append SVG rects. This is useful for making bar charts and for cases where we have negative values ([d3.stackOffsetDiverging](#diverging) on this page has an example of negative values).

To start off with, we will now use actual dates instead of arbitrary days, along with a new scale for it:
<pre>
var data = [
    {month: new Date(2018, 1, 1), apples: 400, bananas: 200, cherries: 96, dates: 40},
    {month: new Date(2018, 2, 1), apples: 160, bananas: 150, cherries: 96, dates: 40},
    {month: new Date(2018, 3, 1), apples:  64, bananas:  96, cherries: 64, dates: 40},
    {month: new Date(2018, 4, 1), apples:  32, bananas:  48, cherries: 64, dates: 40}
];
var xScale = d3.scaleTime().domain([data[0].month, data[3].month]).range([50,235]);
</pre>

To do this effectively, we will append each series rects at once. (All apple nodes => all banana nodes => ...) To do this, we will first bind the data to new `g` elements in our SVG, there will be a `g` for each series:

To generate our rects we first have to add some `g` elements to our SVG. Each of these `g` elements will be a particular series (apple, banana, etc). To do this we will select our already existing `g`, select all the new `g.series` elements, bind each series to its `g` node, join `g` elements, and set attributes (such as color for the series):

<pre>
var g = d3.select("#demo2")
    .select('g')
    .selectAll('g.series')
    .data(stackedSeries)
    .join('g')
    .classed('series', true)
    .style('fill', (d) => colorScale(d.key));
</pre>

Now for each of the series we will append rects. To do this we will select all the rects, bind each month to each rect and set their attributes:

<pre>
g.selectAll('rect')
    .data((d) => d)
    .join('rect')
    .attr('width', 40)
    .attr('y', (d) => yScale(d[1]))
    .attr('x', (d) => xScale(d.data.month) - 20)
    .attr('height', (d) => yScale(d[0]) -  yScale(d[1]));
</pre>

For this and many examples we see on this page, there are functions that generate our axis, labels, or areas. The definitions of these functions can be found at the bottom of this page.

```
<script>
    var data = [
      {month: new Date(2018, 1, 1), apples: 400, bananas: 200, cherries: 96, dates: 40},
      {month: new Date(2018, 2, 1), apples: 160, bananas: 150, cherries: 96, dates: 40},
      {month: new Date(2018, 3, 1), apples:  64, bananas:  96, cherries: 64, dates: 40},
      {month: new Date(2018, 4, 1), apples:  32, bananas:  48, cherries: 64, dates: 40}
    ];

    var stack = d3.stack()
        .keys(["apples", "bananas", "cherries", "dates"]);
    var stackedSeries = stack(data);

    var xScale = d3.scaleTime().domain([data[0].month, data[3].month]).range([50,235]);
    var yScale = d3.scaleLinear().domain([0, 650]).range([275,25]);
    var colorScale = d3.scaleOrdinal()
            .domain(["apples", "bananas", "oranges", "cherries", "grapes", "dates"])
            .range(["red", "yellow", "orange", "pink", "purple", "brown"]);
            
    //See end of page for addAxis() function definition
    addAxis(d3.select("#demo2").append("g")
        .attr("transform", "translate(20,0)"), data, xScale, null, true);    //Adds in the X axis with ticks
    addAxis(d3.select("#demo2"), data, null, yScale, true);                  //Adds in the Y axis
    addAxis(d3.select("#demo2"), null, d3.scaleLinear().range([50,275]), null, true);  //Adds in a blank X axis
            
	// Create a g element for each series
    var g = d3.select("#demo2")
        .select('g')
        .selectAll('g.series')
        .data(stackedSeries)
        .join('g')
        .classed('series', true)
        .style('fill', (d) => colorScale(d.key));

    // For each series create a rect element for each day
    g.selectAll('rect')
        .data((d) => d)
        .join('rect')
        .attr('width', 40)
        .attr('y', (d) => yScale(d[1]))
        .attr('x', (d) => xScale(d.data.month) - 20)
        .attr('height', (d) => yScale(d[0]) -  yScale(d[1]));
</script>

<svg id="demo2" width="300" height="300"></svg>
```
<figure class="sandbox"><figcaption>Figure 3. . </figcaption></figure>

### Setting .value()
It is rare for our data to not be nested in any way. For instance, let us say we now have the following data set:

<pre>
var data = [
      {month: new Date(2018, 0, 1), fruitSales: {apples: 400, bananas: 200, cherries: 96,  dates: 40, oranges: 250, grapes: 20}},
      {month: new Date(2018, 1, 1), fruitSales: {apples: 160, bananas: 150, cherries: 96,  dates: 40, oranges: 200, grapes: 25}},
      {month: new Date(2018, 2, 1), fruitSales: {apples:  64, bananas:  96, cherries: 64,  dates: 40, oranges: 150, grapes: 30}}
      ...
    ];
</pre>

Now, all our sales data is inside `fruitSales` and setting `keys` will not be enough for the stack generator to find our data. To get our stack generator to work with this data still we can set `value` equal to our `fruitSales`. The `value` is where the stack generator looks for its `keys`. By default the `value` is each the top level array in each data set passed in. 

<pre>
var stack = d3.stack()
        .keys(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
        .value((d, key) => d.fruitSales[key]);
</pre>

`key` is the named object `value` is looking for in the data array passed in. Now our stack generator will look in `fruitSales` for the keys.

+ [stack.value([value])](https://github.com/d3/d3-shape#stack_value) - Takes a function. Sets the value for where the stack generator will look for keys.

```
<script>
    var data = [
      {month: new Date(2018, 0, 1), fruitSales: {apples: 400, bananas: 200, cherries: 96,  dates: 40, oranges: 250, grapes: 20}},
      {month: new Date(2018, 1, 1), fruitSales: {apples: 160, bananas: 150, cherries: 96,  dates: 40, oranges: 200, grapes: 25}},
      {month: new Date(2018, 2, 1), fruitSales: {apples:  64, bananas:  96, cherries: 64,  dates: 40, oranges: 150, grapes: 30}},
      {month: new Date(2018, 3, 1), fruitSales: {apples:  32, bananas:  48, cherries: 64,  dates: 40, oranges: 100, grapes: 20}},
      {month: new Date(2018, 4, 1), fruitSales: {apples:  40, bananas: 100, cherries: 64,  dates: 40, oranges: 115, grapes: 45}},
      {month: new Date(2018, 5, 1), fruitSales: {apples: 100, bananas: 250, cherries: 86,  dates: 40, oranges: 225, grapes: 50}},
      {month: new Date(2018, 6, 1), fruitSales: {apples: 150, bananas: 125, cherries: 96,  dates: 40, oranges: 200, grapes: 15}},
      {month: new Date(2018, 7, 1), fruitSales: {apples: 100, bananas:  75, cherries: 106, dates: 40, oranges: 210, grapes: 10}}
    ];

    var stack = d3.stack()
        .keys(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
        .value((d, key) => d.fruitSales[key]);

    var stackedSeries = stack(data);

    var xScale = d3.scaleTime().range([50,275]);
    var yScale = d3.scaleLinear().range([275,25]);
    var colorScale = d3.scaleOrdinal()
            .domain(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
            .range(["red", "yellow", "pink", "brown", "orange", "purple"]);

    addAxis(d3.select("#demo3"), data, xScale, yScale, false);

    var area = d3.area()
    	.x((d) => xScale(d.data.month))
        .y0((d) => yScale(d[0]))
        .y1((d) => yScale(d[1]))
        .curve(d3.curveBasis);
	
    d3.select("#demo3")
    	.selectAll('.areas')
        .data(stackedSeries)
        .join('path')
        .attr('d', area)
        .attr("fill", (d) => colorScale(d.key));
        
    addLabels(d3.select("#demo3"), stackedSeries, area);
</script>

<svg id="demo3" width="300" height="300"></svg>
```
<figure class="sandbox"><figcaption>Figure 4. . </figcaption></figure>


### Adding Areas Function
In all future examples we will be using this function to add the areas of our stacks:

``` {cm: visible}
<script>
    function addAreas(selection, data, area, customTransform){ //customTransform not neccesary
        selection.selectAll(".areas")
            .data(data)
            .join("path")
            .attr("d", area)
            .attr("fill", (d) => colorScale(d.key))
            .attr("transform" , customTransform);
    }
</script>
```

## Stack Ordering

By setting the `.order([order])` accessor of a stack we can change where each series appears in the stack. The default ordering if one is not set is d3.stackOrderNone.

+ [stack.order([order])](https://github.com/d3/d3-shape#stack_order) - Takes an order type or a function that is used to determine the order. The order is where the series in the stack appear.

+ [d3.stackOrderNone(series)](https://github.com/d3/d3-shape#stackOrderNone) - Orders all the series based on the ordering of the keys. If you define the stack with `.keys(["a", "b", "c"])` the order of the series will be "a", "b", "c", from bottom to top.
+ [d3.stackOrderReverse(series)](https://github.com/d3/d3-shape#stackOrderReverse) - Orders all the series based on the <b>reverse</b> ordering of the keys. If you define the stack with `.keys(["a", "b", "c"])` the order of the series will be "a", "b", "c", from <b>top to bottom</b>. This is the opposite of `d3.stackOrderNone()`.
```
<script>
    var data = [
        {month: new Date(2018, 0, 1), fruitSales: {apples: 400, bananas: 200, cherries: 96,  dates: 40, oranges: 250, grapes: 20}},
        {month: new Date(2018, 1, 1), fruitSales: {apples: 160, bananas: 150, cherries: 96,  dates: 40, oranges: 200, grapes: 25}},
        {month: new Date(2018, 2, 1), fruitSales: {apples:  64, bananas:  96, cherries: 64,  dates: 40, oranges: 150, grapes: 30}},
        {month: new Date(2018, 3, 1), fruitSales: {apples:  32, bananas:  48, cherries: 64,  dates: 40, oranges: 100, grapes: 20}},
        {month: new Date(2018, 4, 1), fruitSales: {apples:  40, bananas: 100, cherries: 64,  dates: 40, oranges: 115, grapes: 45}},
        {month: new Date(2018, 5, 1), fruitSales: {apples: 100, bananas: 250, cherries: 86,  dates: 40, oranges: 225, grapes: 50}},
        {month: new Date(2018, 6, 1), fruitSales: {apples: 150, bananas: 125, cherries: 96,  dates: 40, oranges: 200, grapes: 15}},
        {month: new Date(2018, 7, 1), fruitSales: {apples: 100, bananas:  75, cherries: 106, dates: 40, oranges: 210, grapes: 10}}
    ];

    var xScale = d3.scaleTime().domain([data[0].month, data[data.length - 1].month]).range([50,275]);
    var yScale = d3.scaleLinear().domain([0,1000]).range([275,25]);
    var colorScale = d3.scaleOrdinal()
        .domain(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
        .range(["red", "yellow", "pink", "brown", "orange", "purple"]);

    var stack1 = d3.stack() 
            .keys(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
            .value((d, key) => d.fruitSales[key])
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);
    var stackedSeries1 = stack1(data);

    var stack2 = d3.stack()
            .keys(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
            .value((d, key) => d.fruitSales[key])
            .order(d3.stackOrderReverse)
            .offset(d3.stackOffsetNone);
    var stackedSeries2 = stack2(data);

    var area = d3.area()
        .x((d) => xScale(d.data.month))
        .y0((d) => yScale(d[0]))
        .y1((d) => yScale(d[1]))
        .curve(d3.curveBasis);
                
    addAreas(d3.select("#demo4n"), stackedSeries1, area); // Areas to stackOrderNone
    addAreas(d3.select("#demo4r"), stackedSeries2, area); // Areas to stackOrderReverse
     
    addLabels(d3.select("#demo4n"), stackedSeries1, area) // Labels to stackOrderNone
    addLabels(d3.select("#demo4r"), stackedSeries2, area) // Labels to stackOrderReverse
</script>

<svg id="demo4n" width="300" height="300"></svg>
<svg id="demo4r" width="300" height="300"></svg>
```
<figure class="sandbox"><figcaption>Figure 5. . </figcaption></figure>

+ [d3.stackOrderAscending(series)](https://github.com/d3/d3-shape#stackOrderAscending) - Orders all the series based on the sum of <i>all</i> the values of each series. The series with the smallest sum with be placed on the bottom, ascending upwards to the largest.
+ [d3.stackOrderDescending(series)](https://github.com/d3/d3-shape#stackOrderDescending) - Orders all the series based on the sum of <i>all</i> the values of each series. The series with the largest sum with be placed on the bottom, ascending upwards to the smallest. This is the opposite of `d3.stackOrderAscending()`.
```
<script>
        var data = [
            {month: new Date(2018, 0, 1), fruitSales: {apples: 400, bananas: 200, cherries: 96,  dates: 40, oranges: 250, grapes: 20}},
            {month: new Date(2018, 1, 1), fruitSales: {apples: 160, bananas: 150, cherries: 96,  dates: 40, oranges: 200, grapes: 25}},
            {month: new Date(2018, 2, 1), fruitSales: {apples:  64, bananas:  96, cherries: 64,  dates: 40, oranges: 150, grapes: 30}},
            {month: new Date(2018, 3, 1), fruitSales: {apples:  32, bananas:  48, cherries: 64,  dates: 40, oranges: 100, grapes: 20}},
            {month: new Date(2018, 4, 1), fruitSales: {apples:  40, bananas: 100, cherries: 64,  dates: 40, oranges: 115, grapes: 45}},
            {month: new Date(2018, 5, 1), fruitSales: {apples: 100, bananas: 250, cherries: 86,  dates: 40, oranges: 225, grapes: 50}},
            {month: new Date(2018, 6, 1), fruitSales: {apples: 100, bananas: 125, cherries: 96,  dates: 40, oranges: 200, grapes: 15}},
            {month: new Date(2018, 7, 1), fruitSales: {apples: 100, bananas:  75, cherries: 106, dates: 40, oranges: 210, grapes: 10}}
        ];
       
        var xScale = d3.scaleTime().domain([data[0].month,data[data.length -1].month]).range([50,275]);
        var yScale = d3.scaleLinear().domain([0,1000]).range([275,25]);
        var colorScale = d3.scaleOrdinal()
            .domain(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
            .range(["red", "yellow", "pink", "brown", "orange", "purple"]);
            
        var stack1 = d3.stack()
                .keys(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
                .value((d, key) => d.fruitSales[key])
                .order(d3.stackOrderAscending)
                .offset(d3.stackOffsetNone);
        var stackedSeries1 = stack1(data);

        var stack2 = d3.stack()
                .keys(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
                .value((d, key) => d.fruitSales[key])
                .order(d3.stackOrderDescending)
                .offset(d3.stackOffsetNone);
        var stackedSeries2 = stack2(data);

        var area = d3.area()
            .x((d) => xScale(d.data.month))
            .y0((d) => yScale(d[0]))
            .y1((d) => yScale(d[1]))
            .curve(d3.curveBasis);
        
        addAreas(d3.select("#demo5a"), stackedSeries1, area); // Areas to stackOrderAscending
        addAreas(d3.select("#demo5d"), stackedSeries2, area); // Areas to stackOrderDescending 
        
        addLabels(d3.select("#demo5a"), stackedSeries1, area); // Add Labels to stackOrderAcsending
        addLabels(d3.select("#demo5d"), stackedSeries2, area); // Add Labels to stackOrderDescending
   </script>

   <svg id="demo5a" width="300" height="300"></svg>
   <svg id="demo5d" width="300" height="300"></svg>
```
<figure class="sandbox"><figcaption>Figure 6. . </figcaption></figure>

## d3.stackOrderAppearance( and d3.stackOrderInsideOut()

When having stacks with large amount of data, readability is important. `d3.stackOrderAppearance()` and `d3.stackOrderInsideOut()` can be used to improve readability in our stacks.
The ways that `d3.stackOrderAppearance()` and `d3.stackOrderInsideOut()` sort are further explained and reasoned in [Stacked Graphs—Geometry & Aesthetics](http://leebyron.com/streamgraph/stackedgraphs_byron_wattenberg.pdf) by Byron & Wattenberg.

Below is an graphic explanation on how these orderings sort our data.

First `d3.stackOrderAppearance()` and `d3.stackOrderInsideOut()` finds at what index each series has its maximum value.

<table style="border-collapse:collapse;border-spacing:0;border-color:#9ABAD9;margin:0px auto" class="tg"><tr><th style="font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#fff;background-color:#409cff;text-align:center;vertical-align:top">Index</th><th style="font-family:Arial, sans-serif;font-size:13px;font-weight:normal;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#000000;background-color:#ff5858;text-align:center;vertical-align:top">Apples</th><th style="font-family:Arial, sans-serif;font-size:13px;font-weight:normal;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#000000;background-color:#fffe65;text-align:center;vertical-align:top">Bananas</th><th style="font-family:Arial, sans-serif;font-size:13px;font-weight:normal;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#000000;background-color:#ffcb2f;text-align:center;vertical-align:top">Oranges</th><th style="font-family:Arial, sans-serif;font-size:13px;font-weight:normal;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#000000;background-color:#b56fff;text-align:center;vertical-align:top">Grapes</th></tr><tr><td style="font-family:Arial, sans-serif;font-size:14px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">0</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td></tr><tr><td style="font-family:Arial, sans-serif;font-size:14px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">10</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td></tr><tr><td style="font-family:Arial, sans-serif;font-size:14px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#ff5858;text-align:center;vertical-align:top">2</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#000000;background-color:#ff5858;font-weight:bold;text-align:center;vertical-align:top">25</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td></tr><tr><td style="font-family:Arial, sans-serif;font-size:14px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">3</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">10</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td></tr><tr><td style="font-family:Arial, sans-serif;font-size:14px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">4</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">10</td></tr><tr><td style="font-family:Arial, sans-serif;font-size:14px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#b56fff;text-align:center;vertical-align:top">5</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#b56fff;font-weight:bold;text-align:center;vertical-align:top">25</td></tr><tr><td style="font-family:Arial, sans-serif;font-size:14px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">6</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">10</td></tr><tr><td style="font-family:Arial, sans-serif;font-size:14px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">7</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">10</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td></tr><tr><td style="font-family:Arial, sans-serif;font-size:14px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#f8a102;text-align:center;vertical-align:top">8</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#ffcb2f;font-weight:bold;text-align:center;vertical-align:top">25</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td></tr><tr><td style="font-family:Arial, sans-serif;font-size:14px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">9</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">10</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td></tr><tr><td style="font-family:Arial, sans-serif;font-size:14px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">10</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">10</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td></tr><tr><td style="font-family:Arial, sans-serif;font-size:14px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#fffc9e;text-align:center;vertical-align:top">11</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#000000;background-color:#fffc9e;font-weight:bold;text-align:center;vertical-align:top">25</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td></tr><tr><td style="font-family:Arial, sans-serif;font-size:14px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">12</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">10</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td></tr><tr><td style="font-family:Arial, sans-serif;font-size:14px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">13</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">1</td></tr><tr><td style="font-family:Arial, sans-serif;font-size:14px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">Index at <br>Max Value</td><td style="font-family:Arial, sans-serif;font-size:14px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#ff5858;text-align:center;vertical-align:top">Apples: 2</td><td style="font-family:Arial, sans-serif;font-size:14px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#fffc9e;text-align:center;vertical-align:top">Bananas: 11</td><td style="font-family:Arial, sans-serif;font-size:14px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#ffcc67;text-align:center;vertical-align:top">Oranges: 8</td><td style="font-family:Arial, sans-serif;font-size:14px;padding:1px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#b56fff;text-align:center;vertical-align:top">Grapes: 5</td></tr></table><br>

Next, the orderings create an array of the indices of its maximum value.

<table style="border-collapse:collapse;border-spacing:0;border-color:#9ABAD9;margin:0px auto" class="tg"><tr><th style="font-family:Arial, sans-serif;font-size:13px;font-weight:normal;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#000000;background-color:#409cff;text-align:center"></th><th style="font-family:Arial, sans-serif;font-size:13px;font-weight:normal;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#000000;background-color:#ff5858;text-align:center">Apples</th><th style="font-family:Arial, sans-serif;font-size:13px;font-weight:normal;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#000000;background-color:#fffc9e;text-align:center;vertical-align:top">Bananas</th><th style="font-family:Arial, sans-serif;font-size:13px;font-weight:normal;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#000000;background-color:#ffcb2f;text-align:center;vertical-align:top">Oranges</th><th style="font-family:Arial, sans-serif;font-size:13px;font-weight:normal;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#000000;background-color:#b56fff;text-align:center;vertical-align:top">Grapes</th></tr><tr><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center">Index</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center">2</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">11</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">8</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">5</td></tr></table>
<br>

Finally those indices are sorted least to greatest:

<table style="border-collapse:collapse;border-spacing:0;border-color:#9ABAD9;margin:0px auto" class="tg"><tr><th style="font-family:Arial, sans-serif;font-size:13px;font-weight:normal;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#000000;background-color:#409cff;text-align:center"></th><th style="font-family:Arial, sans-serif;font-size:13px;font-weight:normal;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#000000;background-color:#ff5858;text-align:center">Apples</th><th style="font-family:Arial, sans-serif;font-size:13px;font-weight:normal;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#000000;background-color:#b56fff;text-align:center;vertical-align:top">Grapes</th><th style="font-family:Arial, sans-serif;font-size:13px;font-weight:normal;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#000000;background-color:#ffcb2f;text-align:center;vertical-align:top">Oranges</th><th style="font-family:Arial, sans-serif;font-size:13px;font-weight:normal;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#000000;background-color:#fffc9e;text-align:center;vertical-align:top">Bananas</th></tr><tr><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center">Index</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center">2</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">5</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">8</td><td style="font-family:Arial, sans-serif;font-size:13px;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:center;vertical-align:top">11</td></tr><tr><td style="font-family:Arial, sans-serif;font-size:14px;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:left;vertical-align:top"></td><td style="font-family:Arial, sans-serif;font-size:14px;padding:1px 15px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#9ABAD9;color:#444;background-color:#EBF5FF;text-align:left;vertical-align:top" colspan="4">-------------------------------------------------------&gt;</td></tr></table>

+ [d3.stackOrderApperance(series)](https://github.com/d3/d3-shape#stackOrderAppearance) - will place the smallest indices on the bottom of the stack, and the series with the largest index will be on the top.
+ [d3.stackOrderInsideOut(series)](https://github.com/d3/d3-shape#stackOrderInsideOut) - will place the smallest indices in the middle working its way outward for the largest. 
`d3.stackOrderInsideOut()` should have its `offest` set to `d3.stackOffsetWiggle()` and is used to make streamgraphs.

```
<script>
    var data = [
   		{month: new Date(2018, 0, 1),  fruitSales: {apples: 1,    bananas: 1,   oranges: 1,   grapes: 1}},
        {month: new Date(2018, 1, 1),  fruitSales: {apples: 10,   bananas: 1,   oranges: 1,   grapes: 1}},
        {month: new Date(2018, 2, 1),  fruitSales: {apples: 25,   bananas: 1,   oranges: 1,   grapes: 1}},
        {month: new Date(2018, 3, 1),  fruitSales: {apples: 10,   bananas: 1,   oranges: 1,   grapes: 1}},
        {month: new Date(2018, 4, 1),  fruitSales: {apples: 1,    bananas: 1,  oranges: 1,   grapes: 10}},
        {month: new Date(2018, 5, 1),  fruitSales: {apples: 1,    bananas: 1,  oranges: 1,   grapes: 25}},
        {month: new Date(2018, 6, 1),  fruitSales: {apples: 1,    bananas: 1,  oranges: 1,   grapes: 10}},
        {month: new Date(2018, 7, 1),  fruitSales: {apples: 1,    bananas: 1,   oranges: 10,  grapes: 1}},
        {month: new Date(2018, 8, 1),  fruitSales: {apples: 1,    bananas: 1,   oranges: 25,  grapes: 1}},
        {month: new Date(2018, 9, 1),  fruitSales: {apples: 1,    bananas: 1,   oranges: 10,  grapes: 1}},
        {month: new Date(2018, 10, 1), fruitSales: {apples: 1,    bananas: 10,   oranges: 1,   grapes: 1}},
        {month: new Date(2018, 11, 1), fruitSales: {apples: 1,    bananas: 25,   oranges: 1,   grapes: 1}},
        {month: new Date(2019, 0, 1),  fruitSales: {apples: 1,    bananas: 10,   oranges: 1,   grapes: 1}},
        {month: new Date(2019, 1, 1),  fruitSales: {apples: 1,    bananas: 1,   oranges: 1,   grapes: 1}}
    ];

    var xScale = d3.scaleLinear().domain([data[0].month, data[data.length-1].month]).range([10,290]);
    var yScale = d3.scaleLinear().domain([0,30]).range([175,25]);
    var colorScale = d3.scaleOrdinal()
        .domain(["apples", "bananas", "oranges", "grapes"])
        .range(["red", "yellow", "orange", "purple"]);

    var stack1 = d3.stack()
            .keys(["apples", "bananas", "oranges", "grapes"])
            .value((d, key) => d.fruitSales[key])
            .order(d3.stackOrderAppearance)
            .offset(d3.stackOffsetNone);
    var stackedSeries1 = stack1(data);

    var stack2 = d3.stack()
            .keys(["apples", "bananas", "oranges", "grapes"])
            .value((d, key) => d.fruitSales[key])
            .order(d3.stackOrderInsideOut)
            .offset(d3.stackOffsetWiggle);
    var stackedSeries2 = stack2(data);

    var area1 = d3.area()
        .x((d) => xScale(d.data.month))
        .y0((d) => yScale(d[0]))
        .y1((d) => yScale(d[1]))
        .curve(d3.curveBasis);
    var area2 = d3.area()
        .x((d) => xScale(d.data.month))
        .y0((d) => yScale(d[0] + 25/2))
        .y1((d) => yScale(d[1] + 25/2))
        .curve(d3.curveBasis);

    addAreas(d3.select("#demo6a"), stackedSeries1, area1); // Areas to stackOrderAppearance
    addAreas(d3.select("#demo6i"), stackedSeries2, area2); // Areas to stackOrderInsideOut
        
    addLabels(d3.select("#demo6a"), stackedSeries1, area1); // Labels to stackOrderAppearance
    addLabels(d3.select("#demo6i"), stackedSeries2, area2); // Labels to stackOrderInsideOut
</script>

<svg id="demo6a" class="svgClass" width="300" height="200"></svg>
<svg id="demo6i" class="svgClass" width="300" height="200"></svg>
```
<figure class="sandbox"><figcaption>Figure 7. . </figcaption></figure>

## Stack Offsets

By setting the `.offset([offset])` we can control the baselines that our stacks use. The baseline for the default offset is 0, so every stack bottoms out at zero and works its way up. 

+ [stack.offset([offset])](https://github.com/d3/d3-shape#stack_offset) - Takes an offset type or function that computes the offset. Sets the stack generators offset, which determines how the series in the stack appear.

+ [d3.stackOffsetNone(series, order)](https://github.com/d3/d3-shape#stackOffsetNone) - Applies a zero baseline. Is the default offset.
+ [d3.stackOffsetExpand(series, order)](https://github.com/d3/d3-shape#stackOffsetExpand) - Applies a zero baseline, and normalizes every point to be within the range `[`0,1`]`.

```
<script>
    var data = [
        {month: new Date(2018, 0, 1), fruitSales: {apples: 400, bananas: 200, cherries: 96,  dates: 40, oranges: 250, grapes: 20}},
        {month: new Date(2018, 1, 1), fruitSales: {apples: 160, bananas: 150, cherries: 96,  dates: 40, oranges: 200, grapes: 25}},
        {month: new Date(2018, 2, 1), fruitSales: {apples:  64, bananas:  96, cherries: 64,  dates: 40, oranges: 150, grapes: 30}},
        {month: new Date(2018, 3, 1), fruitSales: {apples:  32, bananas:  48, cherries: 64,  dates: 40, oranges: 100, grapes: 20}},
        {month: new Date(2018, 4, 1), fruitSales: {apples:  40, bananas: 100, cherries: 64,  dates: 40, oranges: 115, grapes: 45}},
        {month: new Date(2018, 5, 1), fruitSales: {apples: 100, bananas: 250, cherries: 86,  dates: 40, oranges: 225, grapes: 50}},
        {month: new Date(2018, 6, 1), fruitSales: {apples: 150, bananas: 125, cherries: 96,  dates: 40, oranges: 200, grapes: 15}},
        {month: new Date(2018, 7, 1), fruitSales: {apples: 100, bananas:  75, cherries: 106, dates: 40, oranges: 210, grapes: 10}}
    ];

    var xScale = d3.scaleTime().domain([data[0].month, data[data.length - 1].month]).range([50,275]);
    var yScaleNone = d3.scaleLinear().domain([0,1000]).range([275,25]);
    var yScaleExpand = d3.scaleLinear().domain([0,1]).range([275,25]);
    var colorScale = d3.scaleOrdinal()
        .domain(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
        .range(["red", "yellow", "pink", "brown", "orange", "purple"]);

    var stack1 = d3.stack() 
            .keys(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
            .value((d, key) => d.fruitSales[key])
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);
    var stackedSeries1 = stack1(data);

    var stack2 = d3.stack()
            .keys(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
            .value((d, key) => d.fruitSales[key])
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetExpand);
    var stackedSeries2 = stack2(data);

    var areaNone = d3.area()
        .x((d) => xScale(d.data.month))
        .y0((d) => yScaleNone(d[0]))
        .y1((d) => yScaleNone(d[1]))
        .curve(d3.curveBasis);
        
    var areaExpanding = d3.area()
        .x((d) => xScale(d.data.month))
        .y0((d) => yScaleExpand(d[0]))
        .y1((d) => yScaleExpand(d[1]))
        .curve(d3.curveBasis);
    
    addAreas(d3.select("#demo7n").select("#stack"), stackedSeries1, areaNone); // Areas to stackOffsetNone
    addAreas(d3.select("#demo7e").select("#stack"), stackedSeries2, areaExpanding); // Areas to stackOffsetExpanding
        
    addLabels(d3.select("#demo7n").select("#stack"), stackedSeries1, areaNone); // Labels to stackOffsetNone
    addLabels(d3.select("#demo7e").select("#stack"), stackedSeries2, areaExpanding); // Labels to stackOffsetExpanding
</script>

<svg id="demo7n" width="300" height="300">
  <g id="stack"></g>
  <g id="baseline">
      <text y="290">Baseline</text>
      <path d="M 25 275 l 325 0" stroke="green" stroke-width="3px"></path>
  </g>
</svg>
<svg id="demo7e" width="300" height="300">
  <g id="stack"></g>
  <g id="baseline">
  		<text x="" y="290">Baseline</text>
        <text x="290" y="270">0</text>
        <text x="290" y="40">1</text>
        <path d="M 25 25 l 325 0" stroke="green" stroke-width="3px"></path>
        <path d="M 25 275 l 325 0" stroke="green" stroke-width="3px"></path>
  </g>
</svg>
```
<figure class="sandbox"><figcaption>Figure 8. . </figcaption></figure>

+ <a id="diverging"></a>[d3.stackOffsetDiverging(series, order)](https://github.com/d3/d3-shape#stackOffsetDiverging) - Has positive values above 0, and negative values below 0. Best used with SVG Rects instead of areas.
```
<script>
    var data = [
        {month: new Date(2018, 0, 1), fruitSales: {apples: 400, bananas: 200, cherries: 96,  dates: 40, oranges: 250, grapes: 20}},
        {month: new Date(2018, 1, 1), fruitSales: {apples: 160, bananas: 150, cherries: 96,  dates: 40, oranges: 200, grapes: 25}},
        {month: new Date(2018, 2, 1), fruitSales: {apples:  64, bananas:  96, cherries: 64,  dates: 40, oranges: 150, grapes: -30}},
        {month: new Date(2018, 3, 1), fruitSales: {apples:  32, bananas:  48, cherries: 64,  dates: 40, oranges: 100, grapes: -20}},
        {month: new Date(2018, 4, 1), fruitSales: {apples:  40, bananas: 100, cherries: 64,  dates: 40, oranges: 115, grapes: -45}},
        {month: new Date(2018, 5, 1), fruitSales: {apples: 100, bananas: -25, cherries: 86,  dates: 40, oranges: -225, grapes: 50}},
        {month: new Date(2018, 6, 1), fruitSales: {apples: 150, bananas: -125, cherries: 96,  dates: 40, oranges: -200, grapes: 15}},
        {month: new Date(2018, 7, 1), fruitSales: {apples: 100, bananas:  -75, cherries: 106, dates: 40, oranges: -210, grapes: 10}}
    ];

    var xScale = d3.scaleTime().domain([data[0].month, data[data.length - 1].month]).range([50+225/data.length/2, 275 - 225/data.length/2]);
    var yScaleDiv = d3.scaleLinear().domain([-1000,1000]).range([275,25]);
    var colorScale = d3.scaleOrdinal()
        .domain(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
        .range(["red", "yellow", "pink", "brown", "orange", "purple"]);

    var stack = d3.stack() 
            .keys(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
            .value((d, key) => d.fruitSales[key])
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetDiverging);
    var stackedSeries = stack(data);

	addAxis(d3.select("#demo8d"), data, xScale, yScaleDiv);
	addAxis(d3.select("#demo8d"), null, d3.scaleTime().range([50,275]), null);

    // Create a g element for each series
    var g = d3.select("#demo8d")
        .select('#stack')
        .selectAll('g.series')
        .data(stackedSeries)
        .join('g')
        .classed('series', true)
        .style('fill', (d) => colorScale(d.key));

    // For each series create a rect element for each month
    g.selectAll('rect')
        .data((d) => d)
        .join('rect')
        .attr('width', 225/data.length)
        .attr('y', (d) => yScaleDiv(d[1]))
        .attr('x', (d, i) => i * (225/data.length) + 50)
        .attr('height', (d) => yScaleDiv(d[0]) -  yScaleDiv(d[1])); 
        
    //Adds in the baseline
    d3.select("#baseline8").append("path").attr("d", "M 25 " + yScaleDiv(0) + " l 325 0").attr("stroke", "green").attr("stroke-width", "5px");
    d3.select("#baseline8").append("text").attr("x", 0).attr("y", yScaleDiv(0) - 10).text("Baseline");
        
</script>

<svg id="demo8d" width="300" height="300">
    <g id="stack"></g>
    <g id="baseline8"></g>
</svg>
```
<figure class="sandbox"><figcaption>Figure 9. . </figcaption></figure>

+ [d3.stackOffsetSilhouette(series, order)](https://github.com/d3/d3-shape#stackOffsetSilhouette) - Shifts the baseline so that the center of the streamgraph is 0.
+ [d3.stackOffsetWiggle(series, order)](https://github.com/d3/d3-shape#stackOffsetWiggle) - Shifts the baseline to minimize the wiggle of the layers. Recommended for streamgraphs alongside `d3.stackOrderInsideOut())`. Has a variable baseline that changes throughout the streamgraph.

```
<script>
    var data = [
        {month: new Date(2018, 0, 1), fruitSales: {apples: 400, bananas: 200, cherries: 96,  dates: 40, oranges: 250, grapes: 20}},
        {month: new Date(2018, 1, 1), fruitSales: {apples: 160, bananas: 150, cherries: 96,  dates: 40, oranges: 200, grapes: 25}},
        {month: new Date(2018, 2, 1), fruitSales: {apples:  64, bananas:  96, cherries: 64,  dates: 40, oranges: 150, grapes: 30}},
        {month: new Date(2018, 3, 1), fruitSales: {apples:  32, bananas:  48, cherries: 64,  dates: 40, oranges: 100, grapes: 20}},
        {month: new Date(2018, 4, 1), fruitSales: {apples:  40, bananas: 100, cherries: 64,  dates: 40, oranges: 115, grapes: 45}},
        {month: new Date(2018, 5, 1), fruitSales: {apples: 100, bananas: 250 , cherries: 86,  dates: 40, oranges: 225, grapes: 50}},
        {month: new Date(2018, 6, 1), fruitSales: {apples: 150, bananas: 125, cherries: 96,  dates: 40, oranges: 200, grapes: 15}},
        {month: new Date(2018, 7, 1), fruitSales: {apples: 100, bananas:  75, cherries: 106, dates: 40, oranges: 210, grapes: 10}}
    ];

    var xScale = d3.scaleTime().domain([data[0].month, data[data.length - 1].month]).range([50,275]);
    var yScale = d3.scaleLinear().domain([0,1000]).range([275,25]);
    var colorScale = d3.scaleOrdinal()
        .domain(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
        .range(["red", "yellow", "pink", "brown", "orange", "purple"]);

    var stack1 = d3.stack() 
            .keys(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
            .value((d, key) => d.fruitSales[key])
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetSilhouette);
    var stackedSeries1 = stack1(data);

    var stack2 = d3.stack()
            .keys(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
            .value((d, key) => d.fruitSales[key])
            .order(d3.stackOrderInsideOut)
            .offset(d3.stackOffsetWiggle);
    var stackedSeries2 = stack2(data);

    var area = d3.area()
        .x((d) => xScale(d.data.month))
        .y0((d) => yScale(d[0]))
        .y1((d) => yScale(d[1]))
        .curve(d3.curveBasis);
    
    addAreas(d3.select("#demo9s").select("#stack9s"), stackedSeries1, area, "translate(0, -150)"); // Areas to stackOffsetSilhouette
    addAreas(d3.select("#demo9w").select("#stack9w"), stackedSeries2, area); // Areas to stackOrderReverse // Areas to stackOffsetWiggle
    
    addLabels(d3.select("#demo9s").select("#stack9s").append("g").attr("transform", "translate(0, -150)"), stackedSeries1, area); // Labels to stackOffsetSilhouette
    addLabels(d3.select("#demo9w").select("#stack9w"), stackedSeries2, area); // Labels to stackOffsetWiggle

    //Adds the baseline the Silhouette
	d3.select("#baseline9s").append("path").attr("d", "M 25 " + yScale(0) + " l 325 0").attr("stroke", "green").attr("stroke-width", "5px");
    d3.select("#baseline9s").append("text").attr("x", 0).attr("y", yScale(0) - 10).text("Baseline");
</script>

<svg id="demo9s" width="300" height="300">
  <g id="stack9s"></g>
  <g id="baseline9s" transform="translate(0,-150)")></g>
</svg>
<svg id="demo9w" width="300" height="300">
  <g id="stack9w"></g>
</svg>
```
<figure class="sandbox"><figcaption>Figure 10. . </figcaption></figure>

#### Axis Code

Below is the function `addAxis` which is used to determine the scales and add axis to some stacks on this page. If you need a refresher see [axis](./04_03_axis.html). It may seem complex at first, but the function checks for `null` frequently so that we can only use what we need.

```
<script>
//This is the function that adds the axis to some of the stacks

function addAxis(svgSel, d, xscale, yscale, firstStack){
	let dates, maxPValues, maxNValues, blankAxis;
	
	if(d){
      dates = d.map( (d) => d.month );
      if(firstStack){
        maxPValues = d.map( (d) => {
            let sum = 0;
            for(let [key, value] of Object.entries(d)){ sum += key != "month" ? value : 0; }
            return sum;
         });
        maxNValues = [0,0]; 
      }
      else {
      	maxPValues = d.map( (d) => {
            let sum = 0;
            for(let [key, value] of Object.entries(d.fruitSales)){ sum += key != "month" ? (value > 0 ? value : 0): 0; }
            return sum;
         });
        maxPValues.push(0);
        
        maxNValues = d.map( (d) => {
            let sum = 0;
            for(let [key, value] of Object.entries(d.fruitSales)){ sum += key != "month" ? (value < 0 ? value : 0 ): 0; }
            return sum;
         });
        maxNValues.push(0);
        }
    }
    else{
    	dates = [0,0];
    	blankAxis = true;
        maxPValues = [0,0];
        maxNValues = [0,0];
    }
    
    if(xscale){
        xscale.domain([dates[0], dates[dates.length - 1]]);
        // Add xAxis
        let xAxis = d3.axisBottom(xscale)
        	.tickValues(blankAxis ? [] : dates)
        	.tickFormat(d3.timeFormat("%b"));
        svgSel.append("g")
            .attr("transform", "translate(0, 275)")
            .call(xAxis);
    }
    if(yscale){
        yDomain = d3.extent(maxPValues.concat(maxNValues));
        yscale.domain(yDomain);
        // Add yAxis
        let yAxis = d3.axisLeft(yscale)
            .ticks(8);
        svgSel.append("g")
            .attr("transform", "translate(49, 0)")
            .call(yAxis);
    }
}
</script>
```
<figure class="sandbox"><figcaption>Figure 11. . </figcaption></figure>

## d3-area-label

Below is the function `addLabel` which is used to add text labels to our areas. If you need a refresher see the previous section [areas](./05_04_areas.html)

```
<script>
    //This function is used to add labels to all the areas
    function addLabels(selection, data, area){
        selection.selectAll(".label")
            .data(data)
            .join("text")
            .text((d) => d.key)
            .attr("transform", d3.areaLabel(area).minHeight(9.5))
            .attr("fill", "blaack");
    }
</script>
```