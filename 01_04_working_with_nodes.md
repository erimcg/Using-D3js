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

<script src="https://d3js.org/d3.v4.min.js"></script>


# Working With Nodes


## Selection Nodes

The `d3.selection` type has two methods that allow us to retrieve an individual node from the selection and retrieve an array containing the nodes in the selection.  Note too that these methods do not return selection objects.

+ [selection.node()](https://github.com/d3/d3-selection/blob/master/README.md#selection_node) - returns the first non-null element
+ [selection.nodes()](https://github.com/d3/d3-selection/blob/master/README.md#selection_nodes) - returns an array of the elements that have been selected

## Node Functions

d3.window

d3.style


