{{meta {docid: arcs_pie_charts}}}

<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.25.6/d3-legend.min.js"></script>

<style>
    svg { background-color: white; }
</style>

# Stacks

+ [Stacks](https://github.com/d3/d3-shape#stacks)

+ [d3.stack()](https://github.com/d3/d3-shape/blob/master/src/stack.js)
+ [stack(data[,arguements])]()
Uaing Rects
```
<script>
    var data = [
      {month: new Date(2015, 0, 1), apples: 3840, bananas: 1920, cherries: 960, dates: 400},
      {month: new Date(2015, 1, 1), apples: 1600, bananas: 1440, cherries: 960, dates: 400},
      {month: new Date(2015, 2, 1), apples:  640, bananas:  960, cherries: 640, dates: 400},
      {month: new Date(2015, 3, 1), apples:  320, bananas:  480, cherries: 640, dates: 400}
    ];

    var stack = d3.stack()
        .keys(["apples", "bananas", "cherries", "dates"])
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    var stackedSeries = stack(data);

    var xFruitScale = d3.scaleOrdinal()
            .domain(["apples", "bananas", "cherries", "dates"])
            .range(["0","1","2","3"]);
    var xScale = d3.scaleLinear().domain([0,3]).range([25,275]);
    var yScale = d3.scaleLinear().domain([0,7500]).range([275,25]);
    var colorScale = d3.scaleOrdinal()
            .domain(["apples", "bananas", "cherries", "dates"])
            .range(["red", "yellow", "pink", "brown"]);

	// Create a g element for each series
    var g = d3.select('g')
        .selectAll('g.series')
        .data(stackedSeries)
        .enter()
        .append('g')
        .classed('series', true)
        .style('fill', function(d) {
            return colorScale(d.key);
        });

    // For each series create a rect element for each day
    g.selectAll('rect')
        .data(function(d) {
            return d;
        })
        .enter()
        .append('rect')
        .attr('width', 39)
        .attr('y', function(d) {
            return yScale(d[1]);
        })
        .attr('x', function(d, i) {
            return i * 60 + 40;
        })
        .attr('height', function(d) {
            return yScale(d[0]) -  yScale(d[1]);
        });

    /*for(var i = 0; i < series.length; i += 1){
    	//for(var n = 0; n < series[i].length; n += 1)
          console.log(series[i]);
          d3.select("#demo1")
              .append("path")
              .attr("d", area(series[i]))
              .attr("stroke", "red")
              .attr("fill", colorScale(series[i].key));
        //}
    }*/
</script>

<svg id="demo1" width="300" height="300">
<g></g>
</svg>
```

Using areas
```
<script>
    var data = [
      {month: new Date(2015, 0, 1), apples: 3840, bananas: 1920, cherries: 960, dates: 400},
      {month: new Date(2015, 1, 1), apples: 1600, bananas: 1440, cherries: 960, dates: 400},
      {month: new Date(2015, 2, 1), apples:  640, bananas:  960, cherries: 640, dates: 400},
      {month: new Date(2015, 3, 1), apples:  320, bananas:  480, cherries: 640, dates: 400},
      {month: new Date(2015, 0, 1), apples:  400, bananas: 1080, cherries: 640, dates: 400},
      {month: new Date(2015, 1, 1), apples: 1000, bananas: 2500, cherries: 860, dates: 400},
      {month: new Date(2015, 2, 1), apples: 1500, bananas: 1250, cherries: 960, dates: 400},
      {month: new Date(2015, 3, 1), apples: 1000, bananas:  750, cherries: 1060, dates: 400}
    ];

    var stack = d3.stack()
        .keys(["apples", "bananas", "cherries", "dates"])
        .order(d3.stackOrderInsideOut)
        .offset(d3.stackOffsetWiggle);

    var stackedSeries = stack(data);

    var xScale = d3.scaleLinear().domain([0,7]).range([25,275]);
    var yScale = d3.scaleLinear().domain([0,7500]).range([275,25]);
    var colorScale = d3.scaleOrdinal()
            .domain(["apples", "bananas", "cherries", "dates"])
            .range(["red", "yellow", "pink", "brown"]);
    var legend = d3.legendColor()
        .scale(colorScale);

    var area = d3.area()
    	.x((d, i) => xScale(i))
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]))
        .curve(d3.curveBasis);

    d3.select("#demo2")
    	.selectAll('.areas')
        .data(stackedSeries)
        .enter()
        .append('path')
        .attr('d', (d) => area(d))
        .attr("fill", d => colorScale(d.key));

    d3.select("#demo2Legend")
        .append("g")
        .attr("transform", "translate(10,150)")
        .call(legend);

</script>

<svg id="demo2" width="300" height="300"></svg>
<svg id="demo2Legend" width="100" height="300"></svg>
```

Using areas with .value()
```
<script>
    var data = [
      {month: new Date(2015, 0, 1), fruitSales: {apples: 3840, bananas: 1920, cherries: 960,  dates: 400, oranges: 2500, grapes: 200}},
      {month: new Date(2015, 1, 1), fruitSales: {apples: 1600, bananas: 1440, cherries: 960,  dates: 400, oranges: 2000, grapes: 250}},
      {month: new Date(2015, 2, 1), fruitSales: {apples:  640, bananas:  960, cherries: 640,  dates: 400, oranges: 1500, grapes: 300}},
      {month: new Date(2015, 3, 1), fruitSales: {apples:  320, bananas:  480, cherries: 640,  dates: 400, oranges: 1000, grapes: 200}},
      {month: new Date(2015, 0, 1), fruitSales: {apples:  400, bananas: 1080, cherries: 640,  dates: 400, oranges: 1150, grapes: 450}},
      {month: new Date(2015, 1, 1), fruitSales: {apples: 1000, bananas: 2500, cherries: 860,  dates: 400, oranges: 2250, grapes: 500}},
      {month: new Date(2015, 2, 1), fruitSales: {apples: 1500, bananas: 1250, cherries: 960,  dates: 400, oranges: 2000, grapes: 150}},
      {month: new Date(2015, 3, 1), fruitSales: {apples: 1000, bananas:  750, cherries: 1060, dates: 400, oranges: 2100, grapes: 100}}
    ];

    var stack = d3.stack()
        .keys(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
        .value((d, key) => d.fruitSales[key])
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    var stackedSeries = stack(data);

    var xScale = d3.scaleLinear().domain([0,7]).range([25,275]);
    var yScale = d3.scaleLinear().domain([0,10000]).range([275,25]);
    var colorScale = d3.scaleOrdinal()
            .domain(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
            .range(["red", "yellow", "pink", "brown", "orange", "purple"]);
    var legend = d3.legendColor()
        .scale(colorScale);

    var area = d3.area()
    	.x((d, i) => xScale(i))
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]))
        .curve(d3.curveBasis);

    d3.select("#demo3")
    	.selectAll('.areas')
        .data(stackedSeries)
        .enter()
        .append('path')
        .attr('d', (d) => area(d))
        .attr("fill", d => colorScale(d.key));

    d3.select("#demo3Legend")
        .append("g")
        .attr("transform", "translate(10,100)")
        .call(legend);

</script>

<svg id="demo3" width="300" height="300"></svg>
<svg id="demo3Legend" width="100" height="300"></svg>
```
+ [stack.keys([keys])]()
+ [stack.value([value])]()
+ [stack.order([order])]()
+ [stack.offset([offset])]()

## Stack Ordering

By setting the `.order([order])` accessor of a stack we can change where each series appears in the stack. The default ordering if one is not set is d3.stackOrderNone.

+ [d3.stackOrderNone(series)]() - orders the series' based on the ordering of the keys. If you define the stack with `.keys(["a", "b", "c"])` the order of the series will be "a", "b", "c", from bottom to top.
+ [d3.stackOrderReverse(series)]() - orders the series' based on the <b>reverse</b> ordering of the keys. If you define the stack with `.keys(["a", "b", "c"])` the order of the series will be "a", "b", "c", from <b>top to bottom</b>
```
<script>
    var data = [
        {month: new Date(2015, 0, 1), fruitSales: {apples: 3840, bananas: 1920, cherries: 960,  dates: 400, oranges: 2500, grapes: 200}},
        {month: new Date(2015, 1, 1), fruitSales: {apples: 1600, bananas: 1440, cherries: 960,  dates: 400, oranges: 2000, grapes: 250}},
        {month: new Date(2015, 2, 1), fruitSales: {apples:  640, bananas:  960, cherries: 640,  dates: 400, oranges: 1500, grapes: 300}},
        {month: new Date(2015, 3, 1), fruitSales: {apples:  320, bananas:  480, cherries: 640,  dates: 400, oranges: 1000, grapes: 200}},
        {month: new Date(2015, 0, 1), fruitSales: {apples:  400, bananas: 1080, cherries: 640,  dates: 400, oranges: 1150, grapes: 450}},
        {month: new Date(2015, 1, 1), fruitSales: {apples: 1000, bananas: 2500, cherries: 860,  dates: 400, oranges: 2250, grapes: 500}},
        {month: new Date(2015, 2, 1), fruitSales: {apples: 1500, bananas: 1250, cherries: 960,  dates: 400, oranges: 2000, grapes: 150}},
        {month: new Date(2015, 3, 1), fruitSales: {apples: 1000, bananas:  750, cherries: 1060, dates: 400, oranges: 2100, grapes: 100}}
    ];



    var xScale = d3.scaleLinear().domain([0,7]).range([25,275]);
    var yScale = d3.scaleLinear().domain([0,10000]).range([275,25]);
    var colorScale = d3.scaleOrdinal()
        .domain(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
        .range(["red", "yellow", "pink", "brown", "orange", "purple"]);
    var legend = d3.legendColor()
        .scale(colorScale);

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
        .x((d, i) => xScale(i))
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]))
        .curve(d3.curveBasis);

    d3.select("#demo6n")
        .selectAll('.areas')
        .data(stackedSeries1)
        .enter()
        .append('path')
        .attr('d', (d) => area(d))
        .attr("fill", d => colorScale(d.key));

    d3.select("#demo6r")
        .selectAll('.areas')
        .data(stackedSeries2)
        .enter()
        .append('path')
        .attr('d', (d) => area(d))
        .attr("fill", d => colorScale(d.key));

    d3.select("#demo6Legend")
        .append("g")
        .attr("transform", "translate(10,100)")
        .call(legend);
</script>

<svg id="demo6n" width="300" height="300"></svg>
<svg id="demo6r" width="300" height="300"></svg>
<svg id="demo6Legend" width="100" height="300"></svg>
```

+ [d3.stackOrderAscending(series)]()
+ [d3.stackOrderDescending(series)]()
```
<script>
        var data = [
            {month: new Date(2015, 0, 1), fruitSales: {apples: 3840, bananas: 1920, cherries: 960,  dates: 400, oranges: 2500, grapes: 200}},
            {month: new Date(2015, 1, 1), fruitSales: {apples: 1600, bananas: 1440, cherries: 960,  dates: 400, oranges: 2000, grapes: 250}},
            {month: new Date(2015, 2, 1), fruitSales: {apples:  640, bananas:  960, cherries: 640,  dates: 400, oranges: 1500, grapes: 300}},
            {month: new Date(2015, 3, 1), fruitSales: {apples:  320, bananas:  480, cherries: 640,  dates: 400, oranges: 1000, grapes: 200}},
            {month: new Date(2015, 0, 1), fruitSales: {apples:  400, bananas: 1080, cherries: 640,  dates: 400, oranges: 1150, grapes: 450}},
            {month: new Date(2015, 1, 1), fruitSales: {apples: 1000, bananas: 2500, cherries: 860,  dates: 400, oranges: 2250, grapes: 500}},
            {month: new Date(2015, 2, 1), fruitSales: {apples: 1500, bananas: 1250, cherries: 960,  dates: 400, oranges: 2000, grapes: 150}},
            {month: new Date(2015, 3, 1), fruitSales: {apples: 1000, bananas:  750, cherries: 1060, dates: 400, oranges: 2100, grapes: 100}}
        ];

        var xScale = d3.scaleLinear().domain([0,7]).range([25,275]);
        var yScale = d3.scaleLinear().domain([0,10000]).range([275,25]);
        var colorScale = d3.scaleOrdinal()
            .domain(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
            .range(["red", "yellow", "pink", "brown", "orange", "purple"]);
        var legend = d3.legendColor()
            .scale(colorScale);

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
            .x((d, i) => xScale(i))
            .y0(d => yScale(d[0]))
            .y1(d => yScale(d[1]))
            .curve(d3.curveBasis);

        d3.select("#demo4a")
            .selectAll('.areas')
            .data(stackedSeries1)
            .enter()
            .append('path')
            .attr('d', (d) => area(d))
            .attr("fill", d => colorScale(d.key));

        d3.select("#demo4d")
            .selectAll('.areas')
            .data(stackedSeries2)
            .enter()
            .append('path')
            .attr('d', (d) => area(d))
            .attr("fill", d => colorScale(d.key));

        d3.select("#demo4Legend")
            .append("g")
            .attr("transform", "translate(10,100)")
            .call(legend);
   </script>

   <svg id="demo4a" width="300" height="300"></svg>
   <svg id="demo4d" width="300" height="300"></svg>
   <svg id="demo4Legend" width="100" height="300"></svg>
```


+ [d3.stackOrderApperance(series)]()
+ [d3.stackOrderInsideOut(series)]()
```
<script>
    var data = [
   		{month: new Date(2014, 10, 1), fruitSales: {apples: 100, bananas: 100, cherries: 100,  dates: 100, oranges: 100, grapes: 100}},
    	{month: new Date(2014, 11, 1), fruitSales: {apples: 100, bananas: 100, cherries: 100,  dates: 100, oranges: 100, grapes: 100}},
        {month: new Date(2015, 0, 1), fruitSales: {apples: 1000, bananas: 100, cherries: 100,  dates: 100, oranges: 100, grapes: 100}},
        {month: new Date(2015, 1, 1), fruitSales: {apples: 2500, bananas: 100, cherries: 100,  dates: 100, oranges: 100, grapes: 100}},
        {month: new Date(2015, 2, 1), fruitSales: {apples: 1000, bananas: 100, cherries: 100,  dates: 100, oranges: 100, grapes: 100}},
        {month: new Date(2015, 3, 1), fruitSales: {apples: 100, bananas: 1000, cherries: 100,  dates: 100, oranges: 100, grapes: 100}},
        {month: new Date(2015, 4, 1), fruitSales: {apples: 100, bananas: 2500, cherries: 100,  dates: 100, oranges: 100, grapes: 100}},
        {month: new Date(2015, 5, 1), fruitSales: {apples: 100, bananas: 1000, cherries: 100,  dates: 100, oranges: 100, grapes: 100}},
        {month: new Date(2015, 6, 1), fruitSales: {apples: 100, bananas: 100, cherries: 1000,  dates: 100, oranges: 100, grapes: 100}},
        {month: new Date(2015, 7, 1), fruitSales: {apples: 100, bananas: 100, cherries: 2500,  dates: 100, oranges: 100, grapes: 100}},
        {month: new Date(2015, 8, 1), fruitSales: {apples: 100, bananas: 100, cherries: 1000,  dates: 100, oranges: 100, grapes: 100}},
        {month: new Date(2015, 9, 1), fruitSales: {apples: 100, bananas: 100, cherries: 100,  dates: 1000, oranges: 100, grapes: 100}},
        {month: new Date(2015, 10, 1), fruitSales: {apples: 100, bananas: 100, cherries: 100,  dates: 2500, oranges: 100, grapes: 100}},
        {month: new Date(2015, 11, 1), fruitSales: {apples: 100, bananas: 100, cherries: 100,  dates: 1000, oranges: 100, grapes: 100}},
        {month: new Date(2016, 0, 1), fruitSales: {apples: 100, bananas: 100, cherries: 100,  dates: 100, oranges: 1000, grapes: 100}},
        {month: new Date(2016, 1, 1), fruitSales: {apples: 100, bananas: 100, cherries: 100,  dates: 100, oranges: 2500, grapes: 100}},
        {month: new Date(2016, 2, 1), fruitSales: {apples: 100, bananas: 100, cherries: 100,  dates: 100, oranges: 1000, grapes: 100}},
        {month: new Date(2016, 3, 1), fruitSales: {apples: 100, bananas: 100, cherries: 100,  dates: 100, oranges: 100, grapes: 1000}},
        {month: new Date(2016, 4, 1), fruitSales: {apples: 100, bananas: 100, cherries: 100,  dates: 100, oranges: 100, grapes: 2500}},
        {month: new Date(2016, 5, 1), fruitSales: {apples: 100, bananas: 100, cherries: 100,  dates: 100, oranges: 100, grapes: 1000}},
        {month: new Date(2016, 6, 1), fruitSales: {apples: 100, bananas: 100, cherries: 100,  dates: 100, oranges: 100, grapes: 100}},
        {month: new Date(2016, 7, 1), fruitSales: {apples: 100, bananas: 100, cherries: 100,  dates: 100, oranges: 100, grapes: 100}}
    ];



    var xScale = d3.scaleLinear().domain([0,data.length-1]).range([25,275]);
    var yScale = d3.scaleLinear().domain([0,7500]).range([275,25]);
    var colorScale = d3.scaleOrdinal()
        .domain(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
        .range(["red", "yellow", "pink", "brown", "orange", "purple"]);
    var legend = d3.legendColor()
        .scale(colorScale);

    var stack1 = d3.stack()
            .keys(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
            .value((d, key) => d.fruitSales[key])
            .order(d3.stackOrderAppearance)
            .offset(d3.stackOffsetNone);
    var stackedSeries1 = stack1(data);

    var stack2 = d3.stack()
            .keys(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
            .value((d, key) => d.fruitSales[key])
            .order(d3.stackOrderInsideOut)
            .offset(d3.stackOffsetWiggle);
    var stackedSeries2 = stack2(data);

    var area1 = d3.area()
        .x((d, i) => xScale(i))
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]))
        .curve(d3.curveBasis);
    var area2 = d3.area()
        .x((d, i) => xScale(i))
        .y0(d => yScale(d[0] + 7500/2))
        .y1(d => yScale(d[1] + 7500/2))
        .curve(d3.curveBasis);

    d3.select("#demo5a")
        .selectAll('.areas')
        .data(stackedSeries1)
        .enter()
        .append('path')
        .attr('d', (d) => area1(d))
        .attr("fill", d => colorScale(d.key));

    d3.select("#demo5i")
        .selectAll('.areas')
        .data(stackedSeries2)
        .enter()
        .append('path')
        .attr('d', (d) => area2(d))
        .attr("fill", d => colorScale(d.key));

    d3.select("#demo5Legend")
        .append("g")
        .attr("transform", "translate(10,100)")
        .call(legend);
</script>

<style>
 	.svgClass { background-color: lightblue; !important}
</style>

<svg id="demo5a" class="svgClass" width="300" height="300"></svg>
<svg id="demo5i" class="svgClass" width="300" height="300"></svg>
<svg id="demo5Legend" width="100" height="300"></svg>
```




## Stack Offsets

+ [d3.stackOffsetExpand(series, order)]()
+ [d3.stackOffsetDiverging(series, order)]()
+ [d3.stackOffsetNone(series, order)]()
+ [d3.stackOffsetSilhouette(series, order)]()
+ [d3.stackOffsetWiggle(series, order)]()