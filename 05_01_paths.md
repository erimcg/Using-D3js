{{meta {docid: shapes}}}

<script src="https://d3js.org/d3.v5.min.js"></script>

<h1><a href="https://github.com/d3/d3-path#d3-path">Paths</a></h1>

The [d3-shapes](https://github.com/d3/d3-shape#d3-shape) module provides methods to create shape generator functions that can be called to produce the line, arc and other data necessary to render a SVG element.  For example, we can use `d3.arc()` to create a generator which when called returns the data that can be assigned to the `d` attribute of a `path` element.

