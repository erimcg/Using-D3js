{{meta {docid: create_delete_move_elements}}}
{{meta {description: ""}}}

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
    .aqua-box {
        background-color: aquamarine;
    }
</style>
<script src="https://d3js.org/d3.v7.min.js"></script>

# Creating, Deleting, and Moving Elements

D3.js has a number of `selection` methods that add, remove, and reposition elements in the DOM.  They include the following:

+ [selection.append(type)](https://github.com/d3/d3-selection/blob/master/README.md#selection_append) - create, append, and select new elements
+ [selection.insert(type[, selector])](https://github.com/d3/d3-selection/blob/master/README.md#selection_insert) - create, insert and select new elements
+ [selection.clone([deep])](https://github.com/d3/d3-selection/blob/master/README.md#selection_clone) - insert clones of selected elements
+ [selection.remove()](https://github.com/d3/d3-selection/blob/master/README.md#selection_remove) - remove elements from the document
+ [selection.raise()](https://github.com/d3/d3-selection/blob/v1.4.0/README.md#selection_raise) - reinsert selected elements into the DOM as the last child of their respective parents
+ [selection.lower()](https://github.com/d3/d3-selection/blob/v1.4.0/README.md#selection_lower) - reinsert selection elements into the DOM as the last child of their respective parents

D3.js also includes two methods that create elements that are unattached to the DOM.

+ [d3.create(name)](https://github.com/d3/d3-selection/blob/v1.4.0/README.md#create) - creates and returns an unattached element in the current document
+ [d3.creator(name)](https://github.com/d3/d3-selection/blob/v1.4.0/README.md#creator) - creates and returns a function that creates unattached elements in the current document.

## Selection.append

The `selection.append(type)` method takes as an argument a string holding the name of an element or a function that returns a node.   The method creates a new element node for each element in the selection and adds it as the *last child* of each element in the selection.  The method returns a selection containing the new elements.

If the argument is a string then an element of that type is created.  The string is considered in the same namespace as its parent unless it has a namespace prefix such as `svg:circle`.

In the example below, we append a circle element to the svg element.  Since the selected element is an svg element in the svg namespace, we don't need to add the `svg:` prefix to the element type name (`circle`) when calling the `append` method.  Since `append` returns a selection containing only the elements that were appended, the subsequent calls to `attr` only affect the new elements.

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

<button onclick="appendElement()">Append</button>

<svg id="appendElement" width="600" height="100">
  <circle r="25" cx="50" cy="50" fill="pink" />
  <circle r="25" cx="125" cy="50" fill="pink" />
  <circle r="25" cx="200" cy="50" fill="pink" />
</svg>
```

The argument to `append` can also be a function that returns an element node.  The function named `createCircle`, given below, creates a circle and sets its attributes.  Since the circle element that is created is in the svg namespace we have to use `createElementNS` method to create the element and pass to the method the namespace URI and the element name.  We can then pass `createCircle` to the `append` method to append a circle to the selection.

```
<script>
  function createCircle() {
    var ns = "http://www.w3.org/2000/svg";
    var circle = document.createElementNS(ns, "circle");
    circle.setAttribute("r",25);
    return circle;
  }
  
  function appendWithFunction() {
    d3.select("#appendWithFunction")
      .append(createCircle)
      .attr("cx", (d,i,nodes) => {
        return +nodes[i].previousElementSibling.getAttribute("cx") + 75;
       })
      .attr("cy", 50)
      .attr("fill", "pink");
  }
</script>

<button onclick="appendWithFunction()">Append</button>

<svg id="appendWithFunction" width="600" height="100">
  <circle r="25" cx="50" cy="50" fill="lightblue" />
  <circle r="25" cx="125" cy="50" fill="lightblue" />
  <circle r="25" cx="200" cy="50" fill="lightblue" />
</svg>
```

In the example below we have an outer div that contains three inner divs (pink boxes).  We can rotate the pink boxes by selecting the first pink box and appending it to the outer div.  Note that `selection.node()` returns the first non-null element in the selection.

```
<script>
  function rotate() {
    d3.select("#moveContainer")
      .append(() => d3.select("#moveContainer > :first-child").node());
  }
</script>

<button onclick="rotate()">Rotate</button>

<div id="moveContainer" style="display: inline">
  <div class="box pink-box">1</div>
  <div class="box pink-box">2</div>
  <div class="box pink-box">3</div>
</div>
```

## Selection.insert

The `selection.insert` method inserts a new node element as a child, before an existing child, if specified.  If not specified, the new child will be appended to the selected element's children.

Like `selection.append`, the `selection.insert(type [, selector])` method takes as its first argument either a string containing an element name or a function that returns a new element node.  The second optional argument is either a CSS selector or a function that returns returns a *child element* before which the new element will be inserted.  The `insert` method returns a new selection containing the newly inserted elements.

In the example below we have an outer div with its id set to `insertBox`.  Nested within the outer div are 3 div elements that have their background color set to pink.  We can insert additional boxes by selecting the outer div and inserting new div elements before the outer div's first child.

```
<script>
    function insertBox() {
        d3.select("#insertBox")
          .insert("div", ":first-child")
          .classed("box aqua-box", true)
          .html("X");
    }
</script>

<button onclick="insertBox()">Insert</button>

<div id="insertBox" style="display: inline-block;">
    <div class="box pink-box"></div>
    <div class="box pink-box"></div>
    <div class="box pink-box"></div>
</div>
```

The `insert` method inserts a new element for each element in the selection.  In the example below we create a selection containing the 3 blue boxes and call `insert` on it.  The `insert` method creates 3 new pink boxes and appends each of them as a child of a different blue box.

```
<script>
    function insertBox2() {
        d3.selectAll("#insertBox2 > div")
          .insert("div")
          .classed("box pink-box", true)
          .html("X");
    }
</script>

<button onclick="insertBox2()">Insert</button>

<div id="insertBox2" style="display: inline-block;">
    <div class="box blue-box"></div>
    <div class="box blue-box"></div>
    <div class="box blue-box"></div>
</div>
```

## Selection.clone

The `selection.clone([deep])` method clones all of the selected elements and inserts them immediately after each of the selected elements.  If `true` is passed to `clone`, all of the descendant nodes of the selected elements will be cloned as well. A selection containing the newly created cloned nodes is returned.

In the example below we select all of the box divs, clone them, and change their background color to lightblue.

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

The `selection.remove()` method removes the elements in the selection from the DOM and returns the original selection.  Below we select the pink boxes and remove them.

```
<script>
    function removeBoxes() {
        d3.selectAll("#removeBoxes > .pink-box").remove();
    }
</script>

<button onclick="removeBoxes()">Remove</button>

<div id="removeBoxes" style="display: inline-block;">
    <div class="box pink-box"></div>
    <div class="box aqua-box"></div>
    <div class="box pink-box"></div>
    <div class="box aqua-box"></div>
    <div class="box pink-box"></div>
    <div class="box aqua-box"></div>
</div>
```

## Selection.raise

The [selection.raise()](https://github.com/d3/d3-selection/blob/v1.4.0/README.md#selection_raise) method reinserts the elements in the selection into the DOM as the last child of their respective parents.

```
<script>
function raise() {  
  d3.select("#raiseSVG")
    .selectAll("#pink,#violet")
    .raise();
    
  d3.select("#raiseSVG")
    .selectAll("circle")
    .attr("cx", (d, i) => 30 + (i * 60));
}
</script>

<svg id="raiseSVG" width="300" height="60">
  <circle r="25" cx="30" cy="30" fill="lightblue" />
  <circle id="pink" r="25" cx="90" cy="30" fill="pink" />
  <circle id="violet" r="25" cx="150" cy="30" fill="violet" />
  <circle r="25" cx="210" cy="30" fill="lightblue" />
</svg>

<button onclick="raise()">Raise</button>
```

## Selection.lower

The [selection.lower()](https://github.com/d3/d3-selection/blob/v1.4.0/README.md#selection_lower) method reinserts the elements in the selection into the DOM as the first child of their respective parents.

```
<script>  
function lower() {  
  d3.select("#lowerSVG")
    .selectAll("#pink,#violet")
    .lower();
    
  d3.select("#lowerSVG")
    .selectAll("circle")
    .attr("cx", (d, i) => 30 + (i * 60)); 
}
</script>

<svg id="lowerSVG" width="300" height="60">
  <circle r="25" cx="30" cy="30" fill="lightblue" />
  <circle id="pink" r="25" cx="90" cy="30" fill="pink" />
  <circle id="violet" r="25" cx="150" cy="30" fill="violet" />
  <circle r="25" cx="210" cy="30" fill="lightblue" />
</svg>

<button onclick="lower()">Lower</button>
```

## Creating Unattached Elements

D3.js contains a pair of functions that are used to create new elements that are not to the DOM.

+ [d3.create(name)](https://github.com/d3/d3-selection/blob/v1.4.0/README.md#create) - creates and returns an unattached element in the current document
+ [d3.creator(name)](https://github.com/d3/d3-selection/blob/v1.4.0/README.md#creator) - creates and returns a function that creates unattached elements in the current document.

Both `d3.create` and `d3.creator` take as an argument a string that specifies the type of element to create.  Both methods are able to create element in the svg, xhtml, xlink, xml, and xmlns namespaces.

```
<script>
var circleGen = d3.creator("circle");

d3.select("#createSVG")
  .selectAll("circle")
  .data([1,2,3])
  .enter()
  .append(circleGen)
  .attr("r", 25)
  .attr("cx", (d) => d * 60)
  .attr("cy", 50)
  .attr("fill", "lightblue");
</script>

<svg id="createSVG" width="400" height="90" ></svg>

```
