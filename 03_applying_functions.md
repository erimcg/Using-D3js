{{meta {docid: applying_functions}}}

<style>
    button{
        display: inline;
        vertical-align: middle;
    }
    svg {
        display: inline-block;
        vertical-align: middle;
    }
    .lightblue {
        fill: lightblue;
    }
    .pink {
        fill: pink;
    }
    #pink {
        fill: pink;
    }
    .box {
        display: inline-block;
        vertical-align: middle;
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        margin: 15px;
        border: 0;
        padding: 0;
    }
    .circle {
        border-radius: 25px;
    }
    .blue-box {
        background-color: lightblue;
    }
    .pink-box {
        background-color: pink;
    }
</style>
<script src="https://d3js.org/d3.v4.min.js"></script>

# Applying Functions to Selected Elements

+ [selection.each(function)](https://github.com/d3/d3-selection/blob/master/README.md#selection_each) - call a function for each element
+ [selection.call(function[, arguments...])](https://github.com/d3/d3-selection/blob/master/README.md#selection_call) - call a function with the this selection


## Selection.each

The selection.each method allows us to apply a function to each element in the selection in order.  The argument to each is a function.  As before, we can pass in a named function, unnamed function, a lambda expression, or specify the function inline. The function is passed d (data from a data join), i (index), and nodes (an array of elements in the current group. For information on groups read [How Selections Work](https://bost.ocks.org/mike/selection/). The nodes array can be used to get a particular element using nodes[i].

<pre>
d3.selectAll("#eachSVG circle").each((d,i,nodes) => {
    if (i % 2 == 0) {
        nodes[i].setAttribute("fill", "pink");
    }});
</pre>

```
<script>
    function applyEach(){
        d3.selectAll("#eachSVG circle").each((d,i,nodes) => {
            if (i % 2 == 0) {
                nodes[i].setAttribute("fill", "pink");
            }});
    }
</script>

<svg id="eachSVG" width="300" height="60">
    <circle r="20" cx="30" cy="30" fill="lightblue" />
    <circle r="20" cx="80" cy="30" fill="lightblue" />
    <circle r="20" cx="130" cy="30" fill="lightblue" />
    <circle r="20" cx="180" cy="30" fill="lightblue" />
</svg>

<button id="eachButton" onclick="applyEach()">Apply Each</button>
```

## Selection.call

The selection.call method executes the function that is passed into it once while passing in a reference to the given selection on which it is called along with any optional arguments that are passed into the call method.

For example, suppose we have the following function that takes a selection, attribute name, and attribute value as arguments, and sets the attribute for each circle element in the selection.

<pre>
function setAttr(selection, attr, value) {
    selection.selectAll("circle").attr(attr, value);
}
</pre>

Suppose also that we have an SVG element with an id attribute set to "callSVG".  Then we can select the SVG element using select and *call* the call function on it.  If we pass the name of the above function, setAttr, along with the strings "fill" and "pink" as arguments to call, then all of the circles in the selection will have their fill attributes set to pink.

<pre>
d3.select("#callSVG").call(setAttr, "fill", "pink");
</pre>

```
<script>
    function setAttr(selection, attr, value) {
        selection.selectAll("circle").attr(attr, value);
    }

    function applyCall(){
        d3.select("#callSVG").call(setAttr, "fill", "pink");
    }
</script>

<svg id="callSVG" width="300" height="60">
    <circle r="20" cx="30" cy="30" fill="lightblue" />
    <circle r="20" cx="80" cy="30" fill="lightblue" />
    <circle r="20" cx="130" cy="30" fill="lightblue" />
    <circle r="20" cx="180" cy="30" fill="lightblue" />
</svg>

<button id="callButton" onclick="applyCall()">Apply Call</button>
```
