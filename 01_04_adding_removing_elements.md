{{meta {docid: adding_removing_elements}}}

<style>

.box {
    display: inline-block;
    vertical-align: middle;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    margin: 0 15px 0 15px;
    border: 0;
    padding: 0;
    background-color: lightblue;
}
.blue-box {
    background-color: lightblue;
}
.pink-box {
    background-color: pink;
}
.aqua-box {
    background-color: aquamarine;
}

button{
    display: inline;
    vertical-align: middle;
}
svg {
    display: inline-block;
    vertical-align: middle;
}
</style>

<script src="https://d3js.org/d3.v4.min.js"></script>


# Adding and Removing Elements

The d3.selection type has a number of methods that allow us to add and remove elements from the DOM based on the elements that have been selected.  Per the API, these methods are:

+ [selection.append(type)](https://github.com/d3/d3-selection/blob/master/README.md#selection_append) - create, append, and select new elements
+ [selection.insert(type[, selector])](https://github.com/d3/d3-selection/blob/master/README.md#selection_insert) - create, insert and select new elements
+ [selection.clone([deep])](https://github.com/d3/d3-selection/blob/master/README.md#selection_clone) - insert clones of selected elements
+ [selection.remove()](https://github.com/d3/d3-selection/blob/master/README.md#selection_remove) - remove elements from the document

## Selection.append

The `selection.append(type)` method takes as an argument a string holding the name of an element or a function that returns a node.   The method creates a new element node for each element in the selection and adds it as the last child of each element in the selection.  The method returns the selection containing the new elements.

If the argument is a string then an element of that type is created.  The string is considered in the same namespace as its parent unless it has a namspace prefix such as svg:circle.

In the example below, we append a circle element to the svg element and add attributes to the circle element.  Since the selected element is an svg element in the svg namespace, we don't need to add the svg: prefix to the element type name (circle) when calling the append method.

```
<script>
function appendElement() {
    d3.select("#appendElement")
      .append("circle")
      .attr("r", 25)
      .attr("cx", (d,i,nodes) => {
        return +nodes[i].previousElementSibling.getAttribute("cx") + 75;
       })
      .attr("cy", 50)
      .attr("fill", "lightblue");
}
</script>

<button id="appendElementButton" onclick="appendElement()">Append</button>

<svg id="appendElement" width="600" height="100">
    <circle r="25" cx="50" cy="50" fill="pink" />
    <circle r="25" cx="125" cy="50" fill="pink" />
    <circle r="25" cx="200" cy="50" fill="pink" />
</svg>
```


The argument to append can also be a function that returns an element node.  The function below creates a circle and sets its attributes.  Since the circle element is in the svg namespace we  have to use `createElementNS` to create the element and pass to it the namespace URI and the element name.  We can then pass addCircle to the append method to append a circle to the selection.

```
<script>
    function createCircle() {
        var ns = "http://www.w3.org/2000/svg";
        var circle = document.createElementNS(ns, "circle");
        circle.setAttribute("r",25);
        circle.setAttribute("cx", 275);
        circle.setAttribute("cy", 50);
        circle.setAttribute("fill", "lightblue");
        return circle;
    }

    function appendWithFunction() {
        d3.select("#appendWithFunction")
          .append(createCircle);
    }
</script>

<button id="appendWithFunctionButton" onclick="appendWithFunction()">Append</button>

<svg id="appendWithFunction" width="600" height="100">
    <circle r="25" cx="50" cy="50" fill="lightblue" />
    <circle r="25" cx="125" cy="50" fill="lightblue" />
    <circle r="25" cx="200" cy="50" fill="lightblue" />
</svg>
```

In the example below we have an outer div that contains a div (pink box) and a circle.  We can move the inner pink box div so that it is positioned after the svg by selecting the pink box and appending it to the outer container div.  Note that selection.node() returns the first non-null element in the selection.

```
<script>
    function rotate() {
        d3.select("#moveContainer")
          .append(() => d3.select("#moveContainer > :first-child").node());
    }
</script>

<button id="moveButton" onclick="rotate()">Rotate</button>

<div id="moveContainer" style="display: inline">
    <div class="box pink-box">1</div>
    <div class="box pink-box">2</div>
    <div class="box pink-box">3</div>
</div>
```

## Selection.insert

Like selection.append(type), the selection.insert(type [, selector]) method takes as its first argument either a string containing an element name or a function that returns a new element node.  The second optional argument can be a CSS selector or a function that returns returns a child element before which the element will be inserted.  The insert method returns a new selection containing the newly inserted elements.

In the example below we have an outer div with id set to "insertBox".  Nested within the outer div are 3 div elements that have the box class (and their background-color set to pink).  We can insert additional boxes by selecting the outer div and inserting div elements as the outer div's first child.

```
<script>
    function insertBox() {
        d3.select("#insertBox")
          .insert("div", ":first-child")
          .classed("box", true)
          .html("X");
    }
</script>

<button id="insertBoxButton" onclick="insertBox()">Insert</button>

<div id="insertBox" style="display: inline-block;">
    <div class="box aqua-box"></div>
    <div class="box aqua-box"></div>
    <div class="box aqua-box"></div>
</div>
```

## Selection.clone

The selection.clone([deep]) method clones all of the selected elements and inserts them immediately after each element.  If true is passed to clone, the descendent nodes of the selected elements will be cloned as well. A selection containing the newly created clones is returned.

In the example below we select all of the box divs and clone them.  Since the clone method returns a selection of the newly created nodes, we can immediately change their background color to lightblue.

```
<script>
    function cloneBoxes() {
        d3.selectAll("#cloneBoxes div")
          .clone(false)
          .style("background-color", "lightblue")
          .html("X");
    }
</script>

<button onclick="cloneBoxes()">Clone</button>

<div id="cloneBoxes" style="display: inline-block;">
    <div class="box pink-box"></div>
    <div class="box pink-box"></div>
    <div class="box pink-box"></div>
</div>
```

##  Selection.remove

The selection.remove() method removes the elements in the selection from the DOM and returns the original selection.  Below we select the pink boxes and remove them.

```
<script>
    function removeBoxes() {
        d3.selectAll("#removeBoxes .pink-box").remove();
    }
</script>

<button id="removeBoxesButton" onclick="removeBoxes()">Remove</button>

<div id="removeBoxes" style="display: inline-block;">
    <div class="box pink-box"></div>
    <div class="box aqua-box"></div>
    <div class="box pink-box"></div>
    <div class="box aqua-box"></div>
    <div class="box pink-box"></div>
    <div class="box aqua-box"></div>
</div>
```