{{meta {docid: shapes}}}

# Shapes

The [d3-shapes](https://github.com/d3/d3-shape#d3-shape) module provides methods to create shape generator functions that can be called to produce the line, arc and other data necessary to render a SVG element.  For example, we can use `d3.arc()` to create a generator which when called returns the data that can be assigned to the `d` attribute of a `path` element.

The d3-shape module contains the following components:

[Arcs](https://github.com/d3/d3-shape#arcs)
 - [d3.arc()](https://github.com/d3/d3-shape#arcs) - returns an arc path generator
 - [d3.pie()](https://github.com/d3/d3-shape#pies) - returns an angle generator

[Line](https://github.com/d3/d3-shape#lines)
 - [d3.line()](https://github.com/d3/d3-shape#lines) - returns a line path generator
 - [d3.lineRadial()](https://github.com/d3/d3-shape#lineRadial) - returns a radial line generator
 - [Curves](https://github.com/d3/d3-shape#curves) - interpolators for drawing continuous lines and areas

[Area](https://github.com/d3/d3-shape#areas)
 - [d3.area()](https://github.com/d3/d3-shape#areas) - returns an area generator
 - [d3.areaRadial()](https://github.com/d3/d3-shape#areaRadial) - returns a radial area generator
 - [Curves](https://github.com/d3/d3-shape#curves) - interpolators for drawing continuous lines and areas

[Stack](https://github.com/d3/d3-shape#stacks)
 - [d3.stack()](https://github.com/d3/d3-shape#stacks) - returns a generator that computes positions

[Links](https://github.com/d3/d3-shape#links)
 - [d3.linkVertical()](https://github.com/d3/d3-shape#linkVertical) - returns a link generator with vertical tangents
 - [d3.linkHorizontal()](https://github.com/d3/d3-shape#linkHorizontal) - returns a link generator with horizontal tangents
 - [d3.linkRadial()](https://github.com/d3/d3-shape#linkRadial)

[Symbols](https://github.com/d3/d3-shape#symbols)
 - [d3.symbol()](https://github.com/d3/d3-shape#symbols) - returns a symbol generator
