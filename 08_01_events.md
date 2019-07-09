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



## Adding an event using HTML
```
<script>
function mouseEnter(node){
    d3.select(node)
    	.attr("fill", "green");
}
function mouseOut(node){
    d3.select(node)
    	.attr("fill", "red");
}
</script>

<svg id="demoEvent" width=200 height=200>
    <circle id="circleColorChangeH" cx=100 cy=100 r=50 onmouseenter="mouseEnter(this)" onmouseout="mouseOut(this)" ></circle> 
</svg>
```
<figure class="sandbox"><figcaption>Figure 1 - A circle with an onmouseenter and onmouseout function. All the events were added in the HTML, not by JavaScript. </figcaption></figure>

## Adding an event using javascript

Adding our events into the HTML code is nice when we already have the elements in the `.html` file, but if we are dynamically adding elements to our page this method will not work. Instead, we can use JavaScript to add event listeners 

```
<script>
    var selection = d3.select("#demoJSEvent");
    document.getElementById("circleColorChangeJ")
        .addEventListener("mouseenter", function(event){
            selection
                .select("#circleColorChangeJ")
                .attr("fill", "red");
        });
    document.getElementById("circleColorChangeJ")
        .addEventListener("mouseout", function(event){
            selection
                .select("#circleColorChangeJ")
                .attr("fill", "green");
        });
</script>
<svg id="demoJSEvent" width=200 height=200>
    <circle id="circleColorChangeJ" cx=100 cy=100 r=50></circle> 
</svg>
```
<figure class="sandbox"><figcaption>Figure 2 - A circle with an onmouseenter and onmouseout function (right). All the events were added via javascript. </figcaption></figure>

## Adding an event using D3.js

+ [*selection*.on(typenames[,listener[, options]])](https://github.com/d3/d3-selection#selection_on) - 

Adds `typenames` listeners to every node in the selection. 
Calls the `listener` function when the event is invoked. 
Passing in a `listener` function will replace any current `listener` function, or remove it if null is passed in. 
If there is no `listener` function passed in, any already assigned `listener` function for that event will be called instead.

`this` and `n[i]` refer to the node calling the event.

```
<script>
d3.select("#demoSelectOn")
    .select("#circleColorChangeD")
	.on("mouseenter", (d,i,n) => n[i].setAttribute("fill", "green"))
    .on("mouseout",   (d,i,n) => n[i].setAttribute("fill", "red"));

</script>

<svg id="demoSelectOn" width=200px height=200px>
    <circle id="circleColorChangeD" cx=100 cy=100 r=50></circle>
</svg>
```
<figure class="sandbox"><figcaption>Figure 3 - A circle with an onmouseenter and onmouseout function. All the events were added using selection.on from D3.js. </figcaption></figure>

## d3.event

Using `selection.on` has additional advantages when it comes to handling events. Any event that is registered via `selection.on` will be accessible inside the event handler with the static field `d3.event`. 
`d3.event` always points to the *current* event being invoked, so it is useful inside event functions to access various fields or methods on the event (such as `event.timeStamp` or `event.preventDefault()`). 

+ [d3.event](https://github.com/d3/d3-selection#event) - Returns the current event being invoked. This contains various fields such as event.pathX/Y and event.timeStamp and methods like event.preventDefault(). Only works when the event handler that is triggered was registered by `selection.on`

In Figure 4 we show an example using `d3.event.timeStamp`.
```
<script>
d3.select("#circleTime")
    .on("click", function(){
        d3.select("#textTime")
            .text(Math.round(d3.event.timeStamp) + "ms");
    });
</script>

<svg id="demoTime" width=200 height=200>
    <circle id="circleTime" cx="100" cy="100" r="50"></circle>
    <text id= "textTime" x="100" y="190" text-anchor="middle" font-size="16px"></text>
</svg>
```
<figure class="sandbox"><figcaption>Figure 4 - A circle with an onclick function that shows when the circle was clicked (in milliseconds from the load of the page).  </figcaption></figure>

One situation we may run into is needing to know where an event is triggered. `d3.event` contains the fields `event.pathX` and `event.pathY` which tell us the position of the mouse when the event was triggered, but this position is in relation to the *entire HTML document*. So while it may help us in some situations, it wont help us figure out where the mouse is within our visualizations. To aid in this scenario D3.js provides us with `d3.mouse(container)`.

When we call `d3.mouse(container)` we pass in the node that we want to have our event position related to. `d3.mouse` will return back an array of the `x` and `y` positions of where the current event was triggered. In many cases, we will pass in the `svg` node that our visualizations lie in. 

+ [d3.mouse(container)](https://github.com/d3/d3-selection#mouse) - Returns the location of the current event relative to the specified `container`. A *container* is an HTML node. Uses the same event that is in `d3.event`, so the event must have been registered by `selection.on`.

In Figure 5 we use `d3.mouse` and pass in the svg node. We use the position it returns to update a text element to show the position.

<figure class="sandbox"><figcaption>Figure 5 - A circle with an onmousemove function that shows where the mouse is on the SVG.  </figcaption></figure>

```
<script>
d3.select("#demoMouseMove")
    .select("#circleMouseMoveM")
	.on("mousemove", function() {
	    let pos = d3.mouse(d3.select("#demoMouseMove").node());
    	d3.select("#demoMouseMove")
        	.select("#textMouseMoveM")
        	.text("Position: [" + Math.round(pos[0]) + " , " + Math.round(pos[1]) + "]");
	});
</script>

<svg id="demoMouseMove" width=200px height=200px>
    <circle id="circleMouseMoveM" cx=100 cy=100 r=50></circle>
    <text id="textMouseMoveM" x=40 y=190 font-size="15px" text-anchor="start"></text>
</svg>
```
<figure class="sandbox"><figcaption>Figure 5 - A circle with an onmousemove function that shows where the mouse is on the svg. The event was added via D3.js. </figcaption></figure>

+ [d3.clientPoint(container, event)](https://github.com/d3/d3-selection#clientPoint) - Returns the location of the event passed in relative to the specified `container`. This accepts any event, not just `d3.event`, so it is useful for event handlers registered outside of `selection.on`. 


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