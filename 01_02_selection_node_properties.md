{{meta {docid: selection_node_properties}}}

<script src="https://d3js.org/d3.v5.min.js"></script>

# Selection and Node Properties

Given a selection, we can retrieve the number of elements in the selection and the [nodes](https://developer.mozilla.org/en-US/docs/Web/API/Node) in the selection, and given a node we can retrieve the window owning the node and and style property of the node.  Below we discuss the methods in D3.js that allow us to do these things.

## Selection.empty and Selection.size

The `d3.selection` type has two methods that allow us determine if a selection is empty and determine how many elements are in the selection.  Note that unlike other selection methods, these to methods do not return selection objects.

+ [selection.empty()](https://github.com/d3/d3-selection/blob/master/README.md#selection_empty) - returns true if the selection is empty
+ [selection.size()](https://github.com/d3/d3-selection/blob/master/README.md#selection_size) - returns the number of elements in the selection

## Selection.node and Selection.nodes

The `d3.selection` type has a pair of methods that allows us to get the [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) objects from a selection.  They are:

+ [selection.node()](https://github.com/d3/d3-selection/blob/master/README.md#selection_node) - returns the first non-null element in the selection
+ [selection.nodes()](https://github.com/d3/d3-selection/blob/master/README.md#selection_nodes) - returns an array containing all of the non-null elements in the selection

## d3.window

[d3.window(node)](https://github.com/d3/d3-selection/blob/master/README.md#window) returns the window that own's the node, if it exists.

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

## d3.style

[d3.style(node, name)](https://github.com/d3/d3-selection/blob/v1.4.0/README.md#style) is a convenience method for retrieving the value of an node's `style` property.

`d3.style(node, name)` takes 2 arguments, a node and a string, and returns the value of named property in the node's style property.  If the node has an inline style attribute with the given name, its value is returned.  Otherwise the computed value is returned.  See [HTMLElement.style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) for the difference between inline style values and computed values.
`