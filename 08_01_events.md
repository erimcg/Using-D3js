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

In this section we discuss adding and handling events using D3.js.

When displaying our visualizations in a webpage, it may help our readers if our visualizations are intractable. 
Buttons that alter the graphic and tooltips that display additional information are good ways to help convey the information in our visualizations.

To add in these intractable features to our visualizations we will need to use [`events`](https://developer.mozilla.org/en-US/docs/Web/API/Event). When adding an event to any element or node we need to set two things: the event type and the listener function.

The event type is what scenario the element is checking for, such as when the mouse comes onto or goes off of the element (`onmouseenter` and `onmouseout` respectively).
The listener is the function that is called whenever the event is triggered. 
For example, our listener function could change the color of an element whenever the mouse goes over the element.

A complete list of [event types](https://developer.mozilla.org/en-US/docs/Web/Events), [properties, and methods](https://developer.mozilla.org/en-US/docs/Web/API/Event).

## Adding an event using HTML

One way to add events to our elements is to set the event in our `html` file. To do this we name the event type and set its listener function in the `.html` file that our page loads. 

For example to set a `<circle>` event listener:
<pre>
&lt;circle id="id" onmouseenter="foo(this, event)">&lt;/circle>
</pre>   

In the above example we set the `onmouseenter` event to call `foo` when it is triggered. We also pass `this` and `event` into `foo`. `this` is a reference to the node that called the event, in this case the `<circle>` node. `event` is a reference to the event itself that was called; it contains various properties and methods of the event.

In Figure 1, we set `onmouseenter` and `onmouseout` and set their respective listener functions. The circle will change colors when the mouse comes over it, and again when the mouse leaves it.

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
<figure class="sandbox"><figcaption>Figure 1 - A circle with an onmouseenter and onmouseout function. All the events were added in the HTML. </figcaption></figure>

## Adding an event using javascript

Adding our events into the HTML code works when we already have the elements in the `.html` file, but if we are dynamically adding elements and events to our page this method will not work. 
Instead, the typical way to add event listeners with JavaScript is to use [`node.addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener). 
To use `node.addEventListener(type, listener)` we pass in the `type` (such as `mouseenter` or `mousemove`) and the `listener` (the function called when the event is triggered).

<pre>
document.getElementById(id)
    .addEventListener("mouseenter", function(event){
        //do stuff
    });
</pre>

It is important to note that in the last example we added `onmouseenter` in our `.html` but when we are adding event in JavaScript we drop the `on-` and use `mouseenter`. 
This pattern holds true in all event types that start with `on-`. 

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

Now we know how to add events to elements in JavaScript; however, the `addEventListener` method only works on a single element at a time. 
We could make a `for` loop to iterate over multiple elements, but this would be cumbersome, especially when working with selections from D3.js.

Luckily D3.js allows us to add an event to every node in a selection at once with `selection.on(typenames[,listener[,options]])`. 
We use `selection.on` in a similar way as `addEventListener`.

First we pass in the the type of event we want to add; however, now we can add multiple events at the same time by separating the event types with a space such as `"mouseenter mouseout"`. 
Next we pass in the `listener` function for the event(s). This `listener` will replace any current `listener` applied to that event on that node. 
If we want to get rid of a `listener`, we can choose to not pass one in.
Finally, we can choose to add optional parameters to our event listener as outlined in this [event.addEventListener documentation](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener).

When creating the `listener` we can use either `this` or `nodes[i]` to refer to the node that triggered the event.

For example to have an element change to a random color everytime the mouse comes onto and leaves the element we could use:
<pre>
d3.select(id)
    .on("mouseenter mouseout", function(){
        d3.select(this)
            .attr("fill", randomColor);
    });
</pre>

+ [*selection*.on(typenames[,listener[, options]])](https://github.com/d3/d3-selection#selection_on) - Sets (or removes) a `listener` on the `typenames` event(s).

In Figure 3 we use `selection.on` to add our event listeners to a circle. The circle turns green when the mouse goes over it, and red when the mouse leaves.

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

Using `selection.on` has additional advantages when it comes to handling events. Any event that is registered by `selection.on` will be accessible inside the event handler with the static field `d3.event`. 
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

## d3.mouse

One situation we may run into is needing to know where an event is triggered. `d3.event` contains the fields `event.pathX` and `event.pathY` which tell us the position of the mouse when the event was triggered, but this position is in relation to the *entire HTML document*. So while it may help us in some situations, it wont help us figure out where the mouse is within our visualizations. To aid in this scenario D3.js provides us with `d3.mouse(container)`.

When we call `d3.mouse(container)` we pass in the node that we want to have our event position related to. `d3.mouse` will return back an array of the `x` and `y` positions of where the current event was triggered. In many cases, we will pass in the `svg` node that our visualizations lie in. 

+ [d3.mouse(container)](https://github.com/d3/d3-selection#mouse) - Returns the location of the current event relative to the specified `container`. A *container* is an HTML node. Uses the same event that is in `d3.event`, so the event must have been registered by `selection.on`.

In Figure 5 we use `d3.mouse` and pass in the svg node. We use the position it returns to update a text element to show the position.

```
<script>


d3.select("#demoMouseMove")
	.on("mousemove", function() {
	    let pos = d3.mouse(this);
        d3.select(this)
            .append("circle")
            .attr("fill", "red")
            .attr("r", 1.5)
            .attr("cx", pos[0])
            .attr("cy", pos[1]);
	});
</script>

<svg id="demoMouseMove" width=200px height=200px>
     <path d="M0,0 L200,0 L200,200 L0,200 Z" stroke="black" stroke-width="5px" fill="none"></path>>
</svg>
```
<figure class="sandbox"><figcaption>Figure 5 - An SVG with an onmousemove event that adds a circle whenever the mouse is moved. The event was added ny selection.on from D3.js. </figcaption></figure>

## d3.clientPoint

There are some situations where we cannot use `selection.on` to add an event. However, we may still need to know the position of the mouse. Since we cannot use `d3.mouse` or `d3.event`, D3.js provides us with an alternate method to find the position of an event, `d3.clientPoint(container, event)`. Just like with `d3.mouse` we pass in the `container` (a node), but now we also have to pass in the event to find its location.  

+ [d3.clientPoint(container, event)](https://github.com/d3/d3-selection#clientPoint) - Returns the location of the event passed in relative to the specified `container`. This method accepts any event, not just `d3.event`, so it is useful for event handlers registered outside of `selection.on`. 

In Figure 6 we use `d3.clientPoint` to find the position of the mouse event. The event was created in the HTML and it passes the event to the `findPosition` function that finds the location.

```
<script>
var clientNode = d3.select("#demoClient").node();

function createDot(event){
    let pos = d3.clientPoint(clientNode, event);
    d3.select(clientNode)
        .append("circle")
        .attr("fill", "red")
        .attr("r", 1.5)
        .attr("cx", pos[0])
        .attr("cy", pos[1]);
}
</script>

<svg id="demoClient" width=200px height=200px onmousemove="createDot(event)">
    <path d="M0,0 L200,0 L200,200 L0,200 Z" stroke="black" stroke-width="5px" fill="none"></path>
</svg>
```
<figure class="sandbox"><figcaption>Figure 6 - An SVG with an onmousemove event that adds a circle whenever the mouse is moved. The event was added in the HTML. </figcaption></figure>


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