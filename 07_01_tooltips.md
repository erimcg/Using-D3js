{{meta {docid: tooltips}}}

<script src="https://d3js.org/d3.v4.min.js"></script>

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

# Tooltips

A *tooltip* is a box (usually containing text) that appears when the user hovers over an element on the page and disappears when the user moves the mouse off the element.

To create a tool tip we need a `div`.  The `div` will be that box that holds the text.  Below, we create a `div`, give it the class name *tooltip*, and make it transparent.

<pre>
var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
</pre>

The `tooltip` class sets a number of style properties including, and perhaps most importantly, the `position` property.  The `position` property is set to `absolute` allowing us to change the box's position dynamically in JavaScript using the `left` and `top` properties.

<pre>
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
</pre>

We then register handers for the `mouseover` and `mouseout` events.  When the user hovers over the any of the code segments on this page (created with `pre` elements) we transition the tooltip to visible using the `opacity` property, set its text with the `html` method, and move it to a location near the mouse click using the `left` and `top` properties.  When the user moves off the code segments, we make the tooltip transparent again.

<pre>
d3.selectAll("pre")
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
</pre>

<script>
  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  d3.selectAll("pre")
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
