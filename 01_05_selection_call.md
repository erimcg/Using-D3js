{{meta {docid: selection_call}}}

<style>
.container {
    display: inline-block;
    margin: 0;
    border: 0;
    padding: 0;
}
.box {
    display: block;
    float: left;
    width: 50px;
    height: 50px;
    line-height: 50px;
    font-size: 0;
    margin: 0;
    border: 0;
    padding: 0;
    background-color: lightblue;
    border-radius: 10px;
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
</style>

<script src="https://d3js.org/d3.v5.min.js"></script>


# Selection.call

The [selection.call(f [, arguments...])](https://github.com/d3/d3-selection/blob/master/README.md#selection_call) method takes a function `f` as an argument.  When `selection.call` is executed, it executes the `f`, passing to it *this*, the `selection` on which `call` was called.  If `f` has *k* parameters, the first one being the selection, then *k-1* additional arguments must be passed to `call`.  When `f` is executed, the additional values passed to `call` are passed to `f`.  `Selection.call` returns the selection on which it was called so it can be called in a chain.  

This method is useful when you have a set of manipulations that you need to run on multiple selections.  

In the example, below we have a method named `addElements` which adds `n` aquamarine colored divs before each element in the selection.  Note: this isn't possible with the `selection.insert` method which can only insert elements as children of the elements in the selection.

```
<script>
function addElements(selection, n) {
  let nodeList = selection.nodes();
  for (let i = 0; i < nodeList.length; i++) {
    for (let j = 0; j < n; j++) {
      let newElm = d3.create("div").node();
      newElm.className = "box aqua-box";
      nodeList[i].parentNode.insertBefore(newElm, nodeList[i]);
    }
  }
}

function addElementsWithCall() {
    d3.selectAll("#callBoxes > div")
      .call(addElements, 2);
}
</script>

<button onclick="addElementsWithCall()">Insert Elements</button>

<div id="callBoxes" class="container">
    <div class="box pink-box"></div>
    <div class="box pink-box"></div>
    <div class="box pink-box"></div>
</div>
```
