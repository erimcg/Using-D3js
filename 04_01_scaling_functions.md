{{meta {docid: scaling_functions}}}
{{meta {description: ""}}}

<script src="https://d3js.org/d3.v4.min.js"></script>

# Scaling Functions

Scaling functions are used to convert values from one set (the domain) to values in another (the range).  We'll find them particularly helpful when we want to convert a data element that has been joined to a visual element to a value that can be used to change the appearance of the visual element.  For example, we can scale a population value within the interval [0, 20000] to a value within [1, 5] that can be used to define the radius of a circle.

D3 provides various scaling functions which can classified into 4 types: Continuous, Sequential, Quantized and Ordinal.

*Continuous scaling functions* map a **continuous numeric domain** defined by an interval to a **continuous range** defined by another interval. Continuous scaling functions are created using the following methods:
  - [d3.scaleLinear()](https://github.com/d3/d3-scale/blob/master/README.md#linear-scales)
  - [d3.scalePow()](https://github.com/d3/d3-scale/blob/master/README.md#power-scales)
  - [d3.scaleSqrt()](https://github.com/d3/d3-scale/blob/master/README.md#scaleSqrt)
  - [d3.scaleLog()](https://github.com/d3/d3-scale/blob/master/README.md#log-scales)
  - [d3.scaleTime()](https://github.com/d3/d3-scale/blob/master/README.md#scaleTime)
  - [d3.scaleUtc()](https://github.com/d3/d3-scale/blob/master/README.md#scaleUtc)


*Sequential scaling functions* map a **continuous numeric domain** defined by an interval to a **continuous range** *defined by an interpolator function* which takes as an argument a value within the domain.  Sequential scales are created using:
  - [d3.scaleSequential(interpolator)](https://github.com/d3/d3-scale/blob/master/README.md#sequential-scales)


*Quantize scaling functions* map a **continuous numeric domain** defined by an interval to a **discrete range** defined by an array of elements.  The domain is partitioned into k partitions where k is the number of elements in the range.  Each partition is associated with a unique element in the range and all elements with a partitioned are mapped to the element associated with the partition.
  - [d3.scaleQuantize()](https://github.com/d3/d3-scale/blob/master/README.md#quantize-scales)
  - [d3.scaleQuantile()](https://github.com/d3/d3-scale/blob/master/README.md#quantile-scales)
  - [d3.scaleThreshold()](https://github.com/d3/d3-scale/blob/master/README.md#threshold-scales)


*Ordinal scaling functions* map elements within a **discrete domain** to a **discrete set of elements** within a **continuous range**.  Ordinal scales are created using the following methods:
  - [d3.scaleOrdinal()](https://github.com/d3/d3-scale/blob/master/README.md#ordinal-scales)
  - [d3.scaleBand()](https://github.com/d3/d3-scale/blob/master/README.md#band-scales)
  - [d3.scalePoint()](https://github.com/d3/d3-scale/blob/master/README.md#point-scales)
