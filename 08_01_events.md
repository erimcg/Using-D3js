{{meta {docid: tooltips}}}

<!--<style>
  .tooltip {
    position: absolute;
    text-align: center;
    padding: 2px;
    font: 12px sans-serif;
    background: lightsteelblue;
    border: 0px;
    border-radius: 8px;
    pointer-events: none;
  }
  .box {
    width: 580px;
    height: 100px;
    background: lightblue;
  }
</style>-->

<script src="https://d3js.org/d3.v5.min.js"></script>

<script>
    //Put global scripts here
</script>

# Events


## selection.on

+ [*selection*.on(typenames[,listener[, options]])](https://github.com/d3/d3-selection#selection_on) - 

Adds `typenames` listeners to every node in the selection. 
Calls the `listener` function when the event is invoked. 
Passing in a `listener` function will replace any current `listener` function, or remove it if null is passed in. 
If there is no `listener` function passed in, any already assigned `listener` function for that event will be called instead.

```
<script>
d3.select("#circleMouseMove")
	.on("mousemove", function() {
	    let pos = d3.mouse(d3.select("#demoMouse").node());
    	d3.select("#textMouseMove")
        	.text("Position: [" + Math.round(pos[0]) + " , " + Math.round(pos[1]) + "]");
	});
    
d3.select("#circleColorChange")
	.on("mouseenter", (d,i,n) => n[i].setAttribute("fill", "green"))
    .on("mouseout",   (d,i,n) => n[i].setAttribute("fill", "red"));

</script>

<svg id="demoMouse" width=300px height=200px>
    <circle id="circleMouseMove" cx=90 cy=100 r=50></circle>
    <text id="textMouseMove" x=30 y=190 font-size="15px" text-anchor="start"></text>
    
    <circle id="circleColorChange" cx=210 cy=100 r=50></circle> <text id="textMouseEnter" x=200 y=190 font-size="12px" text-anchor="middle"></text>
</svg>
```

## d3.event

+ [d3.event](https://github.com/d3/d3-selection#event) - Returns the current event being invoked. This contains various fields such as event.pathX/Y and event.timeStamp and methods like event.preventDefault(). Only works when the event handler that is triggered was registered by `*selection*.on`
+ [d3.mouse(container)](https://github.com/d3/d3-selection#mouse) - Returns the location of the current event relative to the specified `container`. A *container* is an HTML node. Works on `d3.event` which is the current event that has been triggered, so long as its handler was registered by `*selection*.on`.

+ [d3.clientPoint(container, event)](https://github.com/d3/d3-selection#clientPoint) - Returns the location of the event passed in relative to the specified `container`. This accepts any event, not just `d3.event`, so it is useful for event handlers registered outside of `*selection*.on`. 

<!--
## Tooltips

A *tooltip* is a box (usually containing some descriptive text) that appears when the user hovers over an element on the page and disappears when the user moves the mouse off the element.

To create a tool tip we need a `div`.  The `div` will be that box that holds the text.  Below, we create a `div`, give it the class name *tooltip*, and make it transparent.

<pre>
var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
</pre>

The `tooltip` class sets a number of style properties including, and perhaps most importantly, the `position` property.  The `position` property is set to `absolute` allowing us to change the box's position dynamically in JavaScript using the `left` and `top` properties.

<pre>
&lt;style&gt;
  .tooltip {
    position: absolute;
    text-align: center;
    padding: 2px;
    font: 12px sans-serif;
    background: lightsteelblue;
    border: 0px;
    border-radius: 8px;
    pointer-events: none;
  }
  .box {
    width: 580px;
    height: 100px;
    background: lightblue;
  }
&lt;/style&gt;
</pre>

We then register handers for the `mouseover` and `mouseout` events.  When the user hovers over the blue box below we transition the tooltip to visible using the `opacity` property, set its text with the `html` method, and move it to a location near the mouse click using the `left` and `top` properties.  When the user moves off the code segments, we make the tooltip transparent again.

``` {cm: visible}
<script>
var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.selectAll(".box")
  .on("mouseover", function(d) {
     tooltip.transition()
        .duration(200)
        .style("opacity", .9);
     tooltip.html("Happy Birthday!")
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 10) + "px");
  })
  .on("mouseout", function(d) {
     tooltip.transition()
        .duration(500)
        .style("opacity", 0);
  });
</script>

<div class="box"></div>
```

-->