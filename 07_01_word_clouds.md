{{meta {docid: word_clouds}}}

<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3-cloud/1.2.5/d3.layout.cloud.js"></script>

# Word Clouds

A word cloud is a visualization that displays a set of words in a cluster, with various orientations and sizes.

```
<script>
var fill = d3.scaleOrdinal(d3.schemeCategory20);

var data = [
    {text: "Hello", value:6260},
    {text: "happy", value:5370},
    {text: "beautiful", value:2480},
    {text: "rainbow", value:4350},
    {text: "unicorn", value:1250},
    {text: "glitter", value:3140},
    {text: "happy", value:990},
    {text: "pie", value:4230}];

var layout = d3.layout.cloud()
    .size([400, 300])
    .words(data)
    .on("end", draw);

layout.start();

function draw(words) {
    d3.select("#demo1")
      .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .text((d) => d.text)
      .style("font-size", (d) => d.size + "px")
      .style("font-family", (d) => d.font)
      .style("fill", (d, i) => fill(i))
      .attr("text-anchor", "middle")
      .attr("transform", (d) => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")");
}
</script>

<svg id="demo1" width="400" height="300"></svg>
```

D3 doesn't have a word cloud module, however Jason Davies created one named [d3-cloud](https://github.com/jasondavies/d3-cloud). It can be downloaded from the following CDN.

<pre>
https://cdnjs.cloudflare.com/ajax/libs/d3-cloud/1.2.5/d3.layout.cloud.js
</pre>

As with all of these demos we start with a SVG element.

<pre>
&lt;svg id="demo1" width="400" height="300"&gt;&lt;/svg&gt;
</pre>

Our script starts by defining a color scale that we'll use to color the words.

<pre>
var fill = d3.scaleOrdinal(d3.schemeCategory20);
</pre>

The data that we need is in the form of an array of objects.  Each object in the array must have a property that holds text and a property that holds some value that is used when computing the font size.  The cloud layout function, by default, uses accessor functions that assume the text is in a property named *text* and the value used to compute the font size is in a property named *value* as shown in the example below.  In addition, the default font size accessor function sets the font size to the square root of the value assigned to the value property.

<pre>
var data = [
    {text: "Hello", value:6260},
    {text: "happy", value:5370},
    {text: "beautiful", value:2480},
    {text: "rainbow", value:4350},
    {text: "unicorn", value:1250},
    {text: "glitter", value:3140},
    {text: "happy", value:990},
    {text: "pie", value:4230}];
</pre>

If the data set that we're using uses other property names, we can change the accessor functions.  We discuss how later.

After we've downloaded or created a dataset, we create a cloud layout object that will be used to add position and font properties to each object in the data set.  We create the layout object by calling [d3.layout.cloud()](https://github.com/jasondavies/d3-cloud#cloud) and chaining other method calls to it.  The [size](https://github.com/jasondavies/d3-cloud#size) method sets the size of the word cloud, the [words](https://github.com/jasondavies/d3-cloud#words) method sets the dataset, and the [on](https://github.com/jasondavies/d3-cloud#on) method registers a function (draw in this case) to execute when the layout algorithm has completed and the "end" event is dispatched.

<pre>
var layout = d3.layout.cloud()
    .size([400, 300])
    .words(data)
    .on("end", draw);
</pre>

We next start the layout algorithm by calling the [start](https://github.com/jasondavies/d3-cloud#start) method on the layout object.

<pre>
layout.start();
</pre>

When the layout algorithm has completed, our `draw` method will be called with a new data array passed to it. The layout algorithm adds the following properties (if not already there) to each object in the array.

+ text - may be undefined if another [text](https://github.com/jasondavies/d3-cloud#text) accessor function is used
+ hasText
+ size - set by the [fontSize](https://github.com/jasondavies/d3-cloud#fontSize) accessor function
+ font - set by the [font](https://github.com/jasondavies/d3-cloud#font) accessor function
+ weight - set by the [fontWeight](https://github.com/jasondavies/d3-cloud#fontWeight) accessor function
+ style - set by the [fontStyle](https://github.com/jasondavies/d3-cloud#fontStyle) accessor function
+ padding - set by the [padding](https://github.com/jasondavies/d3-cloud#padding) accessor function
+ rotate - set by the [rotate](https://github.com/jasondavies/d3-cloud#rotate) accessor function
+ x
+ x0
+ x1
+ xoff
+ y
+ y0
+ y1
+ yoff
+ height
+ width

In the draw method we use d3's selection, append, join and other methods to add text elements to our svg element.  We position and stylize the text using the properties added to the joined data objects by the cloud layout function.

<pre>
function draw(words) {
    d3.select("#demo1")
        .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .text((d) =&gt; d.text)
        .style("font-size", (d) =&gt; d.size + "px")
        .style("font-family", (d) =&gt; d.font)
        .style("fill", (d, i) =&gt; fill(i))
        .attr("text-anchor", "middle")
        .attr("transform", (d) =&gt; "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")");
}
</pre>

## Text and FontSize

If the objects in the initial data array don't have properties named *text* and *value*, we can supply accessor functions to identify which properties to use, and in the case of value, a mathematical expression to define how to size the words.  The method named [text](https://github.com/jasondavies/d3-cloud#text) is used to set the text accessor function and the method named [fontSize](https://github.com/jasondavies/d3-cloud#fontSize) is used to set the fontSize accessor function.

Suppose the data is supplied in the form below.

<pre>
var data = [
    {word: "Hello", frequency:62},
    {word: "happy", frequency:53},
    ...
</pre>

Then when creating the cloud layout function we could define new accessor functions as shown below.

<pre>
var layout = d3.layout.cloud()
    .text((d) =&gt; d.word)
    .fontSize((d) =&gt; Math.sqrt(d.frequency *100))
    ...
</pre>

## Other Accessors

When we create the cloud layout function, we can also specify accessor functions for the font, font weight, font style, padding and rotation angle using the following functions.

+ [layout.font([accessor])](https://github.com/jasondavies/d3-cloud#font)
+ [layout.fontWeight([accessor])](https://github.com/jasondavies/d3-cloud#fontWeight)
+ [layout.fontStyle([accessor])](https://github.com/jasondavies/d3-cloud#fontStyle)
+ [layout.padding([accessor])](https://github.com/jasondavies/d3-cloud#padding)
+ [layout.rotation([accessor])](https://github.com/jasondavies/d3-cloud#rotate)

In the example below we use some of these accessor functions.

<pre>
var layout = d3.layout.cloud()
    .size([400, 300])
    .words(data)
    .font("Impact")
    .padding(5)
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .on("end", draw);
</pre>

```
<script>
  var fill = d3.scaleOrdinal(d3.schemeCategory20);

  var data = [
      {text: "Hello", value:6260},
      {text: "happy", value:5370},
      {text: "beautiful", value:2480},
      {text: "rainbow", value:4350},
      {text: "unicorn", value:1250},
      {text: "glitter", value:3140},
      {text: "happy", value:990},
      {text: "pie", value:4230}];

  var layout = d3.layout.cloud()
      .size([400, 300])
      .words(data)
      .font("Impact")
      .padding(5)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .on("end", draw);

  layout.start();

  function draw(words) {
      d3.select("#demo2")
        .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .text((d) => d.text)
        .style("font-size", (d) => d.size + "px")
        .style("font-family", (d) => d.font)
        .style("fill", (d, i) => fill(i))
        .attr("text-anchor", "middle")
        .attr("transform", (d) => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")");
  }
</script>

<svg id="demo2" width="400" height="300"></svg>
```

## Other Functions

Other functions in the module include:

+ [layout.stop()](https://github.com/jasondavies/d3-cloud#stop)
+ [layout.timeInterval([time])](https://github.com/jasondavies/d3-cloud#timeInterval)
+ [layout.spiral([spiral])](https://github.com/jasondavies/d3-cloud#spiral)
+ [layout.random([random])](https://github.com/jasondavies/d3-cloud#random)
+ [layout.canvas([canvas])](https://github.com/jasondavies/d3-cloud#canvas)