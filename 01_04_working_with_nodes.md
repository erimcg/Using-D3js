{{meta {docid: working_with_nodes}}}

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

<script src="https://d3js.org/d3.v5.min.js"></script>


# Working With Nodes


## Retrieving Nodes

The `d3.selection` type has two methods that allow us to retrieve nodes from a selection.

+ [selection.node()](https://github.com/d3/d3-selection/blob/master/README.md#selection_node) - returns the first non-null element in the selection
+ [selection.nodes()](https://github.com/d3/d3-selection/blob/master/README.md#selection_nodes) - returns an array containing all of the non-null elements in the selection

## Retrieving the Window Object

+ [d3.window(node)](https://github.com/d3/d3-selection/blob/master/README.md#window) - returns the window that own's the node, if it exists.

Specifically if `node` is a window, `d3.window` returns the window node; if `node` is a document, `d3.window` returns the document's default view (i.e. its window); and if `node` has a ownerDocument property (i.e. the node descends a document node) the function returns the document's default view.  Otherwise, undefined is returned.

``` {cm: visible}
<script>
  var div1 = d3.select("#div1").node();
  
  var win1 = d3.window(div1.ownerDocument.defaultView);
  var win2 = d3.window(div1.ownerDocument);
  var win3 = d3.window(div1);
  var win4 = d3.window("blah");
  
  console.log(win1);
  console.log(win2);
  console.log(win3);
  console.log(win4);
</script>

<div id="div1"></div>
```

## Node Style

D3.js provides a convenience method for retrieving the value of a style property.

+ [d3.style(node, name)](https://github.com/d3/d3-selection/blob/v1.4.0/README.md#style)

`d3.style(node, name)` takes 2 arguments, a node and a string, and returns the value of named property in the node's style property.  If the node has an inline style attribute with the given name, its value is returned.  Otherwise the computed value is returned.  See [HTMLElement.style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) for the difference between inline style values and computed values.