{{meta {docid: modifying_elements}}}
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


</style>
<script src="https://d3js.org/d3.v7.min.js"></script>

# Modifying Elements in Selections

Once we have a `d3.selection` object, we can modify the elements in the selection in unison by calling the `d3.selection` methods shown below.

+ [selection.each(function)](https://github.com/d3/d3-selection/blob/master/README.md#selection_each) - call a function for each element in the selection

+ [selection.attr(name[, value])](https://github.com/d3/d3-selection/blob/master/README.md#selection_attr) - set, remove, or get an attribute
+ [selection.style(name[, value[, priority]])](https://github.com/d3/d3-selection/blob/master/README.md#selection_style) - set, remove, or get a style property
+ [selection.property(name[, value])](https://github.com/d3/d3-selection/blob/master/README.md#selection_property) - set, remove, or get a (raw) property

+ [selection.classed(names[, value])](https://github.com/d3/d3-selection/blob/master/README.md#selection_classed) -  add, remove, and check the existence of CSS classes

+ [selection.html([value])](https://github.com/d3/d3-selection/blob/master/README.md#selection_html) - set, remove, or get the inner HTML content
+ [selection.text([value])](https://github.com/d3/d3-selection/blob/master/README.md#selection_text) - set, remove, or get the text content

## Selection.each

The `selection.each` method allows us to call a function for each element in a selection.
 The argument to `each` is a function and as with `selection.filter`, we can pass in a named function, unnamed function, or a lambda expression. 
 
When `each` is executed, the function that is passed to it is executed once for each element in the selection and each time it is executed it is passed `d` (the data bound to the element - See [Chapter 2](http://using-d3js.com/02_01_binding_data.html)), `i` (the element's group index), and `nodes` (the element's group.)  `nodes[i]` is used to retrieve the current element in the selection for which the function is being called.
 
In the example below, a lambda expression is called for each element in the selection and each time checks to see if the index of the element is even, and if so, sets its fill color to pink.

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

## Modifying Attributes, Styles, and Properties

The library's author designed `selection.attr`, `selection.style`, and `selection.property` so that they are called and behave in a consistent manner.  Notice that each of them has an optional `value` argument.  Whether or not a method sets, removes, or gets a characteristic depends on what is passed in for the `value` argument.  The pattern is as follows:

+ If a non-null `value` argument is provided to a method, the method is used as a setter for all of the elements in the selection.
+ If `null` is passed as the `value` argument then the method has the effect of clearing or removing the named characteristic from all of the elements in the selection.
+ If a `value` argument is not provided, the method is used as a getter for the *first* non-null element in the selection.

### Setting Attr, Style, and Property Values

When the `value` argument is a non-null value or a function, the methods are used as setters.  If the value argument is a constant, then the characteristic of every element in the selection will be set using the same value.

Below is an example of how we can use `selection.style` to apply the same style to a set of elements.  In the example, boxes are created using div elements with classes named *box* and *pink-box* (the CSS is hidden).  The button handler selects all of the boxes and uses `selection.style` to add a `border-radius` property to each element in the selection.

```
<script>
  function addStyle() {
    d3.selectAll("#styleExampleSVG .box")
      .style("border-radius", "10px");
  }
</script>

<div id="styleExampleSVG" style="display: inline-block;">
    <div class="box blue-box"></div>
    <div class="box pink-box"></div>
    <div class="box pink-box"></div>
</div>
<button id="styleExampleButton" onclick="addStyle()">&#x394; Style</button>
```

If the argument is a function then the function is called for each element in the selection and the values returned from the function are used to set the characteristic of the elements.  When the function is called, it is called with the current datum (d), the current index (i), and the current group (nodes) being passed to the function.

For example, the code below sets the radius of the circle elements to 10, 20, and 30, respectively, by using the index that is passed to the function (0, 1, and 2, respectively) in the radius computation.

```
<script>
  function setRadii() {
    d3.selectAll("#setterExampleSVG circle")
      .attr("r", (d,i,nodes) => 10 + (10 * i));
  }
</script>

<svg id="setterExampleSVG" width="250" height="100">
  <circle cx="50" cy="50" r="25" fill="lightblue" />
  <circle cx="125" cy="50" r="25" fill="lightblue" />
  <circle cx="200" cy="50" r="25" fill="lightblue" />
</svg>
<button id="setterExampleButton" onclick="setRadii()">Set Radii</button>
```

### Deleting Attr, Style, and Property Values

When `selection.attr`, `selection.style`, or `selection.property` is passed `null` as the value argument, then the named attribute, style, or property (respectively) specified in the first argument is removed from each element in the selection.

In the example below we select the blue box and remove the `border-radius` property from its style attribute by passing `null` as the second argument to `selection.style`.

```
<script>
  function removeStyle() {
    d3.selectAll("#removeStyleExampleSVG .blue-box")
      .style("border-radius", null);
  }
</script>

<div id="removeStyleExampleSVG" style="display: inline-block;">
    <div class="box blue-box" style="border-radius: 25px;"></div>
    <div class="box pink-box" style="border-radius: 25px;"></div>
    <div class="box pink-box" style="border-radius: 25px;"></div>
</div>
<button id="styleExampleButton" onclick="removeStyle()">&#x394; Style</button>
```

### Getting Attr, Style, and Property Values

When `selection.attr`, `selection.style`, or `selection.property` is called without a value argument, the method returns the attribute, style property, or raw property (respectively) associated with the name argument of the first non-null element in the selection.

## Modifying Classes

The `value` argument of `selection.classed` is a `boolean`.  If the value argument is `true`, the class names that are provided as a first argument are added to the class attribute of each element in the selection.   If the `value` argument is `false`, then the classes are removed.

In the example below we have a class named `lightblue` that defines the `fill` property as *lightblue*.  In the function `addClass` we select all of the circle elements using `selectAll()`, then chain a call to `classed()` to add the `lightblue` class to each of the circle elements.

```
<script>
  function addClass() {
    d3.selectAll("#classedExampleSVG circle")
      .classed("lightblue", true);
    classedExampleButtonHandler = removeClass;
    d3.select("#classedExampleButton").text('Remove Class');
  }
  function removeClass() {
      d3.selectAll("#classedExampleSVG circle")
        .classed("lightblue", false);
      classedExampleButtonHandler = addClass;
      d3.select("#classedExampleButton").text('Add Class');
  }
  var classedExampleButtonHandler = addClass;
</script>

<svg id="classedExampleSVG" width="250" height="100">
  <circle id="blue" cx="50" cy="50" r="25" fill="lightblue" />
  <circle cx="125" cy="50" r="25" fill="pink" />
  <circle cx="200" cy="50" r="25" fill="pink" />
</svg>
<button id="classedExampleButton" onclick="classedExampleButtonHandler()">Add Class</button>
```

When `selection.classed` is called without a value argument, the method returns `true` if the first non-null element in the selection has the classes specified in the `name` argument, otherwise it returns `false`.

## Modifying Text and InnerHTML

When `selection.text` and `selection.html` are passed a non-null value for the `value` argument, they behave similar to `selection.attr`.  That is, if the value is a constant, then all elements in the selection will have their text or inner HTML, respectively, set to the same value.  If the value is a function then the function is called for each element in the selection and the values returned from the function are used to set the characteristic of the elements.  When the function is called, it is called with the current datum (d), the current index (i), and the current group (nodes) being passed to the function.

When `selection.text` and `selection.html` are passed `null` as a `value` argument, then the text content and inner HTML, respectively, are cleared for each element in the selection.

When `selection.text` or `selection.html` is called without a `value` argument, the method returns the text or inner HTML, respectively, of the first non-null element in the selection.

The example below shows how reverse the letters in an element's text node by using `selection.text` without any arguments to retrieve the text, and using `selection.text` again with a non-null argument to set the text.

To begin we select the box with the class named *box* and retrieve its text using `selection.text`, storing the string in the variable named `str`.  We then reverse the order of the letters in the string and store the result back in `str`.  Last, we select the same box again and set its text by passing `str` to `selection.text`.

```
<script>
  function reverseText() {
    let str = d3.select("#textContainer .box").text();
    str = str.split("").reverse().join("");
    d3.select("#textContainer .box").text(str);
  }
</script>

<div id="textContainer" style="display: inline-block;">
  <div class="box blue-box">BOX</div>
</div>
<button id="changeTextButton" onclick="reverseText()">Reverse Text</button>
<br><br>
```

