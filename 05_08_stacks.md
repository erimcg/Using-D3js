{{meta {docid: arcs_pie_charts}}}

<script src="https://unpkg.com/d3-area-label@1.4.0/build/d3-area-label.js"></script>
<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.25.6/d3-legend.min.js"></script>

<style>
    svg { background-color: white; display: inline-block;}
    .sandbox-output { text-align: center;}
</style>

<script>
//This is the function that adds the axis to some of the stacks

function addAxis(svgSel, d, xscale, yscale, firstStack){
	let dates, maxPValues, maxNValues;
	
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
        maxPValues = [0,0];
        maxNValues = [0,0];
    }
    if(xscale){
        xscale.domain([dates[0], dates[dates.length - 1]]);
        // Add xAxis
        let xAxis = d3.axisBottom(xscale)
            .tickValues(dates.filter((date, i, arr) => i % parseInt(arr.length/4) == 0 ));
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
            .attr("transform", "translate(50, 0)")
            .call(yAxis);
    }
}
</script>

# Stacks

+ [Stacks](https://github.com/d3/d3-shape#stacks)

+ [d3.stack()](https://github.com/d3/d3-shape/blob/master/src/stack.js)
+ [stack(data[,arguements])]()


### Using Stacks with Rects
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
    var xScale = d3.scaleTime().range([70,250]);
        var yScale = d3.scaleLinear().range([275,25]);
    var colorScale = d3.scaleOrdinal()
            .domain(["apples", "bananas", "cherries", "dates"])
            .range(["red", "yellow", "pink", "brown"]);
            
    addAxis(d3.select("#demo1"), data, xScale, yScale, true);
    addAxis(d3.select("#demo1"), null, d3.scaleLinear().range([50,275]), null);
            
	// Create a g element for each series
    var g = d3.select("#demo1")
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
        .attr('width', 39)
        .attr('y', (d) => yScale(d[1]))
        .attr('x', (d, i) => i * 60 + 50)
        .attr('height', (d) => yScale(d[0]) -  yScale(d[1]));
</script>

<svg id="demo1" width="300" height="300">
<g></g>
</svg>
```

### Using Stacks with Areas
```
<script>
    var data = [
      {month: new Date(2015, 0, 1), apples: 3840, bananas: 1920, cherries: 960, dates: 400},
      {month: new Date(2015, 1, 1), apples: 1600, bananas: 1440, cherries: 960, dates: 400},
      {month: new Date(2015, 2, 1), apples:  640, bananas:  960, cherries: 640, dates: 400},
      {month: new Date(2015, 3, 1), apples:  320, bananas:  480, cherries: 640, dates: 400},
      {month: new Date(2015, 4, 1), apples:  400, bananas: 1080, cherries: 640, dates: 400},
      {month: new Date(2015, 5, 1), apples: 1000, bananas: 2500, cherries: 860, dates: 400},
      {month: new Date(2015, 6, 1), apples: 1500, bananas: 1250, cherries: 960, dates: 400},
      {month: new Date(2015, 7, 1), apples: 1000, bananas:  750, cherries: 1060, dates: 400}
    ];
    
    var stack = d3.stack()
        .keys(["apples", "bananas", "cherries", "dates"])
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    var stackedSeries = stack(data);

    var xScale = d3.scaleTime().range([50,275]);
    var yScale = d3.scaleLinear().range([275,25]);
    
    addAxis(d3.select("#demo2"), data, xScale, yScale, true);
        
    
    var colorScale = d3.scaleOrdinal()
            .domain(["apples", "bananas", "cherries", "dates"])
            .range(["red", "yellow", "pink", "brown"]);
    var legend = d3.legendColor()
        .scale(colorScale);

    var area = d3.area()
    	.x((d) => xScale(d.data.month) )
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]))
        .curve(d3.curveBasis);
        
    var areaLabel = d3.areaLabel()
        .paddingLeft(0.1)
        .paddingRight(.1)
        .paddingBottom(0.1)
        .paddingTop(0.1)
        .minHeight(9.5)
        .x((d) => xScale(d.data.month))
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]));
        
    d3.select("#demo2")
    	.selectAll('.areas')
        .data(stackedSeries)
        .join('path')
        .attr('d', (d) => area(d))
        .attr("fill", d => colorScale(d.key));

    d3.select("#demo2Legend")
        .append("g")
        .attr("transform", "translate(10,150)")
        .call(legend);
        
    d3.select("#demo2")
        .selectAll('.label')
        .data(stackedSeries)
        .join('text')
        .text(d => d.key)
        .attr('transform', areaLabel)
        .attr("fill", "black");
</script>

<svg id="demo2" width="300" height="300"></svg>
<svg id="demo2Legend" width="1" height="300"></svg>
```

### Setting `.value()`
```
<script>
    var data = [
      {month: new Date(2015, 0, 1), fruitSales: {apples: 3840, bananas: 1920, cherries: 960,  dates: 400, oranges: 2500, grapes: 200}},
      {month: new Date(2015, 1, 1), fruitSales: {apples: 1600, bananas: 1440, cherries: 960,  dates: 400, oranges: 2000, grapes: 250}},
      {month: new Date(2015, 2, 1), fruitSales: {apples:  640, bananas:  960, cherries: 640,  dates: 400, oranges: 1500, grapes: 300}},
      {month: new Date(2015, 3, 1), fruitSales: {apples:  320, bananas:  480, cherries: 640,  dates: 400, oranges: 1000, grapes: 200}},
      {month: new Date(2015, 4, 1), fruitSales: {apples:  400, bananas: 1080, cherries: 640,  dates: 400, oranges: 1150, grapes: 450}},
      {month: new Date(2015, 5, 1), fruitSales: {apples: 1000, bananas: 2500, cherries: 860,  dates: 400, oranges: 2250, grapes: 500}},
      {month: new Date(2015, 6, 1), fruitSales: {apples: 1500, bananas: 1250, cherries: 960,  dates: 400, oranges: 2000, grapes: 150}},
      {month: new Date(2015, 7, 1), fruitSales: {apples: 1000, bananas:  750, cherries: 1060, dates: 400, oranges: 2100, grapes: 100}}
    ];

    var stack = d3.stack()
        .keys(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
        .value((d, key) => d.fruitSales[key])
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    var stackedSeries = stack(data);

    var xScale = d3.scaleTime().range([50,275]);
    var yScale = d3.scaleLinear().range([275,25]);
    var colorScale = d3.scaleOrdinal()
            .domain(["apples", "bananas", "cherries", "dates", "oranges", "grapes"])
            .range(["red", "yellow", "pink", "brown", "orange", "purple"]);
    var legend = d3.legendColor()
        .scale(colorScale);

    addAxis(d3.select("#demo3"), data, xScale, yScale);

    var area = d3.area()
    	.x((d) => xScale(d.data.month))
        .y0((d) => yScale(d[0]))
        .y1((d) => yScale(d[1]))
        .curve(d3.curveBasis);
        
    var areaLabel = d3.areaLabel()
        .paddingLeft(0.1)
        .paddingRight(.1)
        .paddingBottom(0.1)
        .paddingTop(0.1)
        .minHeight(9.5)
        .x((d) => xScale(d.data.month))
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]));
	
    //console.stringify(stackedSeries);
    
    d3.select("#demo3")
    	.selectAll('.areas')
        .data(stackedSeries)
        .join('path')
        .attr('d', (d) => area(d))
        .attr("fill", d => colorScale(d.key));

    d3.select("#demo3Legend")
        .append("g")
        .attr("transform", "translate(10,100)")
        .call(legend);
        
    d3.select("#demo3")
        .selectAll('.label')
        .data(stackedSeries)
        .join('text')
        .text(d => d.key)
        .attr('transform', areaLabel)
        .attr("fill", "black");
</script>

<svg id="demo3" width="300" height="300"></svg>
<svg id="demo3Legend" width="1" height="300"></svg>
```
+ [stack.keys([keys])]()
+ [stack.value([value])]()
+ [stack.order([order])]()
+ [stack.offset([offset])]()

## Stack Ordering

By setting the `.order([order])` accessor of a stack we can change where each series appears in the stack. The default ordering if one is not set is d3.stackOrderNone.

+ [d3.stackOrderNone(series)]() - Orders all the series based on the ordering of the keys. If you define the stack with `.keys(["a", "b", "c"])` the order of the series will be "a", "b", "c", from bottom to top.
+ [d3.stackOrderReverse(series)]() - Orders all the series based on the <b>reverse</b> ordering of the keys. If you define the stack with `.keys(["a", "b", "c"])` the order of the series will be "a", "b", "c", from <b>top to bottom</b>. This is the opposite of `d3.stackOrderNone()`.
```
<script>
    var data = [
        {month: new Date(2015, 0, 1), fruitSales: {apples: 3840, bananas: 1920, cherries: 960,  dates: 400, oranges: 2500, grapes: 200}},
        {month: new Date(2015, 1, 1), fruitSales: {apples: 1600, bananas: 1440, cherries: 960,  dates: 400, oranges: 2000, grapes: 250}},
        {month: new Date(2015, 2, 1), fruitSales: {apples:  640, bananas:  960, cherries: 640,  dates: 400, oranges: 1500, grapes: 300}},
        {month: new Date(2015, 3, 1), fruitSales: {apples:  320, bananas:  480, cherries: 640,  dates: 400, oranges: 1000, grapes: 200}},
        {month: new Date(2015, 4, 1), fruitSales: {apples:  400, bananas: 1080, cherries: 640,  dates: 400, oranges: 1150, grapes: 450}},
        {month: new Date(2015, 5, 1), fruitSales: {apples: 1000, bananas: 2500, cherries: 860,  dates: 400, oranges: 2250, grapes: 500}},
        {month: new Date(2015, 6, 1), fruitSales: {apples: 1500, bananas: 1250, cherries: 960,  dates: 400, oranges: 2000, grapes: 150}},
        {month: new Date(2015, 7, 1), fruitSales: {apples: 1000, bananas:  750, cherries: 1060, dates: 400, oranges: 2100, grapes: 100}}
    ];



    var xScale = d3.scaleTime().domain([data[0].month, data[data.length - 1].month]).range([50,275]);
    var yScale = d3.scaleLinear().domain([0,10000]).range([275,25]);
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
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]))
        .curve(d3.curveBasis);
        
    var areaLabel = d3.areaLabel() // Area Label for adding labels to each series' areas
        .paddingLeft(0.1)
        .paddingRight(.1)
        .paddingBottom(0.1)
        .paddingTop(0.1)
        .minHeight(9.5)
        .x((d) => xScale(d.data.month))
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]));
                
    d3.select("#demo4n") // Areas to stackOrderNone
        .selectAll('.areas')
        .data(stackedSeries1)
        .join('path')
        .attr('d', (d) => area(d))
        .attr("fill", d => colorScale(d.key));

    d3.select("#demo4r") // Areas to stackOrderReverse
        .selectAll('.areas')
        .data(stackedSeries2)
        .join('path')
        .attr('d', (d) => area(d))
        .attr("fill", d => colorScale(d.key));
        
    d3.select("#demo4n") // Labels to stackOrderNone
        .selectAll('.label')
        .data(stackedSeries1)
        .join('text')
        .text(d => d.key)
        .attr('transform', areaLabel)
        .attr("fill", "black");   
                
    d3.select("#demo4r") // Labels to stackOrderReverse
        .selectAll('.label')
        .data(stackedSeries2)
        .join('text')
        .text(d => d.key)
        .attr('transform', areaLabel)
        .attr("fill", "black");
</script>

<svg id="demo4n" width="300" height="300"></svg>
<svg id="demo4r" width="300" height="300"></svg>
```

+ [d3.stackOrderAscending(series)]() - Orders all the series based on the sum of <i>all</i> the values of each series. The series with the smallest sum with be placed on the bottom, ascending upwards to the largest.
+ [d3.stackOrderDescending(series)]() - Orders all the series based on the sum of <i>all</i> the values of each series. The series with the largest sum with be placed on the bottom, ascending upwards to the smallest. This is the opposite of `d3.stackOrderAscending()`.
```
<script>
        var data = [
            {month: new Date(2015, 0, 1), fruitSales: {apples: 3840, bananas: 1920, cherries: 960,  dates: 400, oranges: 2500, grapes: 200}},
            {month: new Date(2015, 1, 1), fruitSales: {apples: 1600, bananas: 1440, cherries: 960,  dates: 400, oranges: 2000, grapes: 250}},
            {month: new Date(2015, 2, 1), fruitSales: {apples:  640, bananas:  960, cherries: 640,  dates: 400, oranges: 1500, grapes: 300}},
            {month: new Date(2015, 3, 1), fruitSales: {apples:  320, bananas:  480, cherries: 640,  dates: 400, oranges: 1000, grapes: 200}},
            {month: new Date(2015, 4, 1), fruitSales: {apples:  400, bananas: 1080, cherries: 640,  dates: 400, oranges: 1150, grapes: 450}},
            {month: new Date(2015, 5, 1), fruitSales: {apples: 1000, bananas: 2500, cherries: 860,  dates: 400, oranges: 2250, grapes: 500}},
            {month: new Date(2015, 6, 1), fruitSales: {apples: 1000, bananas: 1250, cherries: 960,  dates: 400, oranges: 2000, grapes: 150}},
            {month: new Date(2015, 7, 1), fruitSales: {apples: 1000, bananas:  750, cherries: 1060, dates: 400, oranges: 2100, grapes: 100}}
        ];
       
        var xScale = d3.scaleTime().domain([data[0].month,data[data.length -1].month]).range([50,275]);
        var yScale = d3.scaleLinear().domain([0,10000]).range([275,25]);
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
            .y0(d => yScale(d[0]))
            .y1(d => yScale(d[1]))
            .curve(d3.curveBasis);
            
		var areaLabel = d3.areaLabel()
            .paddingLeft(0.1)
            .paddingRight(.1)
            .paddingBottom(0.1)
            .paddingTop(0.1)
            .minHeight(9.5)
            .x((d) => xScale(d.data.month))
            .y0(d => yScale(d[0]))
            .y1(d => yScale(d[1]));
            
        d3.select("#demo5a")
            .selectAll('.areas')
            .data(stackedSeries1)
            .join('path')
            .attr('d', (d) => area(d))
            .attr("fill", d => colorScale(d.key));

        d3.select("#demo5d")
            .selectAll('.areas')
            .data(stackedSeries2)
            .join('path')
            .attr('d', (d) => area(d))
            .attr("fill", d => colorScale(d.key));
            
        d3.select("#demo5a")
            .selectAll('text')
            .data(stackedSeries1)
            .join('text')
            .text(d => d.key)
            .attr('transform', areaLabel)
            .attr("fill", "black");   
            
        d3.select("#demo5d")
            .selectAll('text')
            .data(stackedSeries2)
            .join('text')
            .text(d => d.key)
            .attr('transform', areaLabel)
            .attr("fill", "black");
   </script>

   <svg id="demo5a" width="300" height="300"></svg>
   <svg id="demo5d" width="300" height="300"></svg>
```

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

+ [d3.stackOrderApperance(series)]() - will place the smallest indices on the bottom of the stack, and the series with the largest index will be on the top.
+ [d3.stackOrderInsideOut(series)]() - will place the smallest indices in the middle working its way outward for the largest. 
`d3.stackOrderInsideOut()` should have its `offest` set to `d3.stackOffsetWiggle()` and is used to make steamgraphs.

```
<script>
    var data = [
   		{month: new Date(2015, 0, 1), fruitSales: {apples: 1,    bananas: 1,   oranges: 1,   grapes: 1}},
        {month: new Date(2015, 1, 1),  fruitSales: {apples: 10,   bananas: 1,   oranges: 1,   grapes: 1}},
        {month: new Date(2015, 2, 1),  fruitSales: {apples: 25,   bananas: 1,   oranges: 1,   grapes: 1}},
        {month: new Date(2015, 3, 1),  fruitSales: {apples: 10,   bananas: 1,   oranges: 1,   grapes: 1}},
        {month: new Date(2015, 4, 1),  fruitSales: {apples: 1,    bananas: 1,  oranges: 1,   grapes: 10}},
        {month: new Date(2015, 5, 1),  fruitSales: {apples: 1,    bananas: 1,  oranges: 1,   grapes: 25}},
        {month: new Date(2015, 6, 1),  fruitSales: {apples: 1,    bananas: 1,  oranges: 1,   grapes: 10}},
        {month: new Date(2015, 7, 1),  fruitSales: {apples: 1,    bananas: 1,   oranges: 10,  grapes: 1}},
        {month: new Date(2015, 8, 1),  fruitSales: {apples: 1,    bananas: 1,   oranges: 25,  grapes: 1}},
        {month: new Date(2015, 9, 1),  fruitSales: {apples: 1,    bananas: 1,   oranges: 10,  grapes: 1}},
        {month: new Date(2015, 10, 1), fruitSales: {apples: 1,    bananas: 10,   oranges: 1,   grapes: 1}},
        {month: new Date(2015, 11, 1), fruitSales: {apples: 1,    bananas: 25,   oranges: 1,   grapes: 1}},
        {month: new Date(2016, 0, 1),  fruitSales: {apples: 1,    bananas: 10,   oranges: 1,   grapes: 1}},
        {month: new Date(2016, 1, 1),  fruitSales: {apples: 1,    bananas: 1,   oranges: 1,   grapes: 1}}
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
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]))
        .curve(d3.curveBasis);
    var area2 = d3.area()
        .x((d) => xScale(d.data.month))
        .y0(d => yScale(d[0] + 25/2))
        .y1(d => yScale(d[1] + 25/2))
        .curve(d3.curveBasis);
        
    var areaLabel = d3.areaLabel()
        .paddingLeft(0.1)
        .paddingRight(0.1)
        .paddingBottom(0.1)
        .paddingTop(0.1)
        .minHeight(9.5)
        .x((d) => xScale(d.data.month))
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]));

    d3.select("#demo6a")
        .selectAll('.areas')
        .data(stackedSeries1)
        .join('path')
        .attr('d', (d) => area1(d))
        .attr("fill", d => colorScale(d.key));

    d3.select("#demo6i")
        .selectAll('.areas')
        .data(stackedSeries2)
        .join('path')
        .attr('d', (d) => area2(d))
        .attr("fill", d => colorScale(d.key));
        
    d3.select("#demo6a")
        .selectAll('text')
        .data(stackedSeries1)
        .join('text')
        .text(d => d.key)
        .attr('transform', areaLabel)
        .attr("fill", "black");   
        
    d3.select("#demo6i")
    	.append("g")
        .attr("transform", "translate(0,-65)")
        .selectAll('text')
        .data(stackedSeries2)
        .join('text')
        .text(d => d.key)
        .attr('transform', areaLabel)
        .attr("fill", "black");
</script>

<svg id="demo6a" class="svgClass" width="300" height="200"></svg>
<svg id="demo6i" class="svgClass" width="300" height="200"></svg>
```

## Stack Offsets

By setting the `.offset([offset])` we can control the baselines that our stacks use. The baseline for the default offset is 0, so every stack bottoms out at zero and works its way up. 

+ [d3.stackOffsetNone(series, order)]() - Applies a zero baseline. Is the default offset.
+ [d3.stackOffsetExpand(series, order)]() - Applies a zero baseline, and normalizes every point to be within the range `[`0,1`]`.

```
<script>
    var data = [
        {month: new Date(2015, 0, 1), fruitSales: {apples: 3840, bananas: 1920, cherries: 960,  dates: 400, oranges: 2500, grapes: 200}},
        {month: new Date(2015, 1, 1), fruitSales: {apples: 1600, bananas: 1440, cherries: 960,  dates: 400, oranges: 2000, grapes: 250}},
        {month: new Date(2015, 2, 1), fruitSales: {apples:  640, bananas:  960, cherries: 640,  dates: 400, oranges: 1500, grapes: 300}},
        {month: new Date(2015, 3, 1), fruitSales: {apples:  320, bananas:  480, cherries: 640,  dates: 400, oranges: 1000, grapes: 200}},
        {month: new Date(2015, 4, 1), fruitSales: {apples:  400, bananas: 1080, cherries: 640,  dates: 400, oranges: 1150, grapes: 450}},
        {month: new Date(2015, 5, 1), fruitSales: {apples: 1000, bananas: 2500, cherries: 860,  dates: 400, oranges: 2250, grapes: 500}},
        {month: new Date(2015, 6, 1), fruitSales: {apples: 1500, bananas: 1250, cherries: 960,  dates: 400, oranges: 2000, grapes: 150}},
        {month: new Date(2015, 7, 1), fruitSales: {apples: 1000, bananas:  750, cherries: 1060, dates: 400, oranges: 2100, grapes: 100}}
    ];

    var xScale = d3.scaleTime().domain([data[0].month, data[data.length - 1].month]).range([50,275]);
    var yScaleNone = d3.scaleLinear().domain([0,10000]).range([275,25]);
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
        .y0(d => yScaleNone(d[0]))
        .y1(d => yScaleNone(d[1]))
        .curve(d3.curveBasis);
        
    var areaExpanding = d3.area()
        .x((d) => xScale(d.data.month))
        .y0(d => yScaleExpand(d[0]))
        .y1(d => yScaleExpand(d[1]))
        .curve(d3.curveBasis);
    
                
    d3.select("#demo7n") // Areas to stackOrderNone
        .selectAll('.areas')
        .data(stackedSeries1)
        .join('path')
        .attr('d', (d) => areaNone(d))
        .attr("fill", d => colorScale(d.key));

    d3.select("#demo7e") // Areas to stackOrderReverse
        .selectAll('.areas')
        .data(stackedSeries2)
        .join('path')
        .attr('d', (d) => areaExpanding(d))
        .attr("fill", d => colorScale(d.key));
        
    d3.select("#demo7n") // Labels to stackOrderNone
        .selectAll('.label')
        .data(stackedSeries1)
        .join('text')
        .text(d => d.key)
        .attr('transform', d3.areaLabel(areaNone).minHeight(9.5))
        .attr("fill", "black");   
                
    d3.select("#demo7e") // Labels to stackOrderReverse
        .selectAll('.label')
        .data(stackedSeries2)
        .join('text')
        .text(d => d.key)
        .attr('transform', d3.areaLabel(areaExpanding).minHeight(9.5))
        .attr("fill", "black");
</script>

<svg id="demo7n" width="300" height="300"></svg>
<svg id="demo7e" width="300" height="300"></svg>
```

+ [d3.stackOffsetDiverging(series, order)]() - Has positive values above 0, and negative values below 0. Best used with SVG Rects instead of areas.
```
<script>
    var data = [
        {month: new Date(2015, 0, 1), fruitSales: {apples: 3840, bananas: 1920, cherries: 960,  dates: 400, oranges: 2500, grapes: 200}},
        {month: new Date(2015, 1, 1), fruitSales: {apples: 1600, bananas: 1440, cherries: 960,  dates: 400, oranges: 2000, grapes: 250}},
        {month: new Date(2015, 2, 1), fruitSales: {apples:  640, bananas:  960, cherries: 640,  dates: 400, oranges: 1500, grapes: -300}},
        {month: new Date(2015, 3, 1), fruitSales: {apples:  320, bananas:  480, cherries: 640,  dates: 400, oranges: 1000, grapes: -200}},
        {month: new Date(2015, 4, 1), fruitSales: {apples:  400, bananas: 1080, cherries: 640,  dates: 400, oranges: 1150, grapes: -450}},
        {month: new Date(2015, 5, 1), fruitSales: {apples: 1000, bananas: -2500, cherries: 860,  dates: 400, oranges: -2250, grapes: 500}},
        {month: new Date(2015, 6, 1), fruitSales: {apples: 1500, bananas: -1250, cherries: 960,  dates: 400, oranges: -2000, grapes: 150}},
        {month: new Date(2015, 7, 1), fruitSales: {apples: 1000, bananas:  -750, cherries: 1060, dates: 400, oranges: -2100, grapes: 100}}
    ];

    var xScale = d3.scaleTime().domain([data[0].month, data[data.length - 1].month]).range([50+225/data.length/2, 275 - 225/data.length/2]);
    var yScaleDiv = d3.scaleLinear().domain([-10000,10000]).range([275,25]);
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
        .select('g')
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
</script>

<svg id="demo8d" width="300" height="300">
<g></g>
</svg>
```

+ [d3.stackOffsetSilhouette(series, order)]() - Shifts the baseline so that the center of the steamgraph is 0.
+ [d3.stackOffsetWiggle(series, order)]() - Shifts the baseline to minimize the wiggle of the layers. Recommended for steamgraphs alongside `d3.stackOrderInsideOut())`.

```
<script>
    var data = [
        {month: new Date(2015, 0, 1), fruitSales: {apples: 3840, bananas: 1920, cherries: 960,  dates: 400, oranges: 2500, grapes: 200}},
        {month: new Date(2015, 1, 1), fruitSales: {apples: 1600, bananas: 1440, cherries: 960,  dates: 400, oranges: 2000, grapes: 250}},
        {month: new Date(2015, 2, 1), fruitSales: {apples:  640, bananas:  960, cherries: 640,  dates: 400, oranges: 1500, grapes: 300}},
        {month: new Date(2015, 3, 1), fruitSales: {apples:  320, bananas:  480, cherries: 640,  dates: 400, oranges: 1000, grapes: 200}},
        {month: new Date(2015, 4, 1), fruitSales: {apples:  400, bananas: 1080, cherries: 640,  dates: 400, oranges: 1150, grapes: 450}},
        {month: new Date(2015, 5, 1), fruitSales: {apples: 1000, bananas: 2500, cherries: 860,  dates: 400, oranges: 2250, grapes: 500}},
        {month: new Date(2015, 6, 1), fruitSales: {apples: 1500, bananas: 1250, cherries: 960,  dates: 400, oranges: 2000, grapes: 150}},
        {month: new Date(2015, 7, 1), fruitSales: {apples: 1000, bananas:  750, cherries: 1060, dates: 400, oranges: 2100, grapes: 100}}
    ];

    var xScale = d3.scaleTime().domain([data[0].month, data[data.length - 1].month]).range([50,275]);
    var yScale = d3.scaleLinear().domain([0,10000]).range([275,25]);
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
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]))
        .curve(d3.curveBasis);
    
                
    d3.select("#demo9s") // Areas to stackOffsetSilhouette
        .selectAll('.areas')
        .data(stackedSeries1)
        .join('path')
        .attr('d', (d) => area(d))
        .attr("fill", d => colorScale(d.key))
        .attr("transform", "translate(0,-150)");

    d3.select("#demo9w") // Areas to stackOffsetWiggle
        .selectAll('.areas')
        .data(stackedSeries2)
        .join('path')
        .attr('d', (d) => area(d))
        .attr("fill", d => colorScale(d.key));
        
    d3.select("#demo9s") // Labels to stackOffsetSilhouette
    	.append('g')
        .attr("transform", "translate(0, -150)")
        .selectAll('.label')
        .data(stackedSeries1)
        .join('text')
        .text(d => d.key)
        .attr('transform', d3.areaLabel(area).minHeight(9.5))
        .attr("fill", "black");   
                
    d3.select("#demo9w") // Labels to stackOffsetWiggle
        .selectAll('.label')
        .data(stackedSeries2)
        .join('text')
        .text(d => d.key)
        .attr('transform', d3.areaLabel(area).minHeight(9.5))
        .attr("fill", "black");
</script>

<svg id="demo9s" width="300" height="300"></svg>
<svg id="demo9w" width="300" height="300"></svg>
```


#### Axis Code

Below is the function `addAxis` which is used to determine the scales and add axis to some stacks on this page.

```
<script>
//This is the function that adds the axis to some of the stacks

function addAxis(svgSel, d, xscale, yscale, firstStack){
	let dates, maxPValues, maxNValues;
	
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
        maxPValues = [0,0];
        maxNValues = [0,0];
    }
    if(xscale){
        xscale.domain([dates[0], dates[dates.length - 1]]);
        // Add xAxis
        let xAxis = d3.axisBottom(xscale)
            .tickValues(dates.filter((date, i, arr) => i % parseInt(arr.length/4) == 0 ));
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
            .attr("transform", "translate(50, 0)")
            .call(yAxis);
    }
}
</script>
```

## d3-area-label