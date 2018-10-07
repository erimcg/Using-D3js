{{meta {docid: d3_fetch}}}

<style>
    .lightblue {
        background-color: lightblue;
        display: block;
        margin: 5px;
    }
</style>

<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://d3js.org/d3-fetch.v1.min.js"></script>

<script>
    function drawText(id, data) {
        d3.select(id)
            .selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("y", (d,i) => i * 20 + 20)
            .attr("x", 10)
            .text((d) => d.letter + " " + d.number + " " + d.color);
    }
</script>


# Using D3-fetch

The [d3-fetch](https://github.com/d3/d3-fetch) module provides various convenience methods that are built on top of the [Fetch](https://fetch.spec.whatwg.org) data transfer standard.

<pre>
&lt;<span class="pl-ent">script</span> <span class="pl-e">src</span>=<span class="pl-s"><span class="pl-pds">"</span>https://d3js.org/d3-fetch.v1.min.js<span class="pl-pds">"</span></span>&gt;&lt;/<span class="pl-ent">script</span>&gt;
</pre>

The [d3-fetch](https://github.com/d3/d3-fetch) convenience methods are shown below.

+ [d3.dsv(delimiter, input[, init][, row])](https://github.com/d3/d3-fetch#dsv) - returns an array of objects, one for each row
+ [d3.csv(input[, init][, row])](https://github.com/d3/d3-fetch#csv) - returns an array of objects, one for each row
+ [d3.tsv(input[, init][, row])](https://github.com/d3/d3-fetch#tsv) - returns an array of objects, one for each row
+ [d3.json(input[, init])](https://github.com/d3/d3-fetch#json) - returns a single object
+ [d3.xml(input[, init])](https://github.com/d3/d3-fetch#xml) - returns a XML document node
+ [d3.html(input[, init])](https://github.com/d3/d3-fetch#html) - returns a HTML document node
+ [d3.text(input[, init])](https://github.com/d3/d3-fetch#text) - returns a string
+ [d3.svg(input[, init])](https://github.com/d3/d3-fetch#svg) - returns a SVG node
+ [d3.image(input[, init])](https://github.com/d3/d3-fetch#image) - returns an image element
+ [d3.blob(input[, init])](https://github.com/d3/d3-fetch#blob) - returns a Blob
+ [d3.buffer(input[, init])](https://github.com/d3/d3-fetch#buffer) - returns an ArrayBuffer

Below are examples on how to use all but the last 2 methods.

When calling the dsv, csv, tsv, json, xml, html, and text download functions, you'll find a call to `then` chained to the download function call as shown below. The code in the function passed to `then` is executed *after* the file is downloaded and the data within the file is ready to be used.

<pre>
d3.dsv(delimiter, fileName)
    .<strong>then</strong>(function(data) {
    // download has completed - do something with data
});

// may be executed before the code passed to then() is executed!
</pre>

This pattern is necessary because the browser does not wait for the data to be downloaded.  Instead, the browser will request the download and continue with the rest of the code in the JavaScript file.  When the download has finished, the browser will jump to the code within the call to `then` and execute it.

To be clear, any code that relies on the data in the downloaded file must be executed *after* the file has been downloaded and is usually included in the function passed to `then`. Second, any code that is written after the `then` call, *may be* executed before the file has been downloaded and before the function passed to `then` is executed.

In the examples below we use the d3-fetch functions to retrieve the contents of various data files that we have on our server.  All of the files store similar information, just in different formats.  In each examples, we pass a function to `then` that converts the data that is returned by the helper functions to an array of objects, each having the properties letter, number, and color (if it is not already in that format).  We then pass the id of an svg element and the array of objects to `drawText` (shown below) which writes the text contained in the objects of the array to the svg element.

<pre>
function drawText(id, data) {
    d3.select(id)
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("y", (d,i) =&gt; i * 20 + 20)
      .attr("x", 10)
      .text((d) =&gt; d.letter + " " + d.number + " " + d.color);
 }
 </pre>

## d3.dsv

The code fragment below fetches a file named sample.dsv which contains the following text.

<pre>
letter|number|color
A|1|red
B|2|blue
</pre>

Here is the code to read the dsv file.

``` {cm: visible}
<script>
  d3.dsv("|", "samples/sample.dsv")
      .then(function(data) {

          drawText("#dsvDemo", data);
       });
</script>

<svg id="dsvDemo" class="lightblue" width="80" height="50"></svg>
```

## d3.csv

The code fragment below fetches a file named sample.csv which contains the following text.

<pre>
letter,number,color
A,1,red
B,2,blue
</pre>

Here is the code to read the csv file.

``` {cm: visible}
<script>
  d3.csv("samples/sample.csv")
      .then(function(data) {

          drawText("#csvDemo", data);
       });
</script>

<svg id="csvDemo" class="lightblue" width="80" height="50"></svg>
```

## d3.tsv

The code fragment below fetches a file named sample.tsv which contains the following text.

<pre>
letter  number  color
A   1   red
B   2   blue
</pre>

Here is the code to read the tsv file.

``` {cm: visible}
<script>
  d3.tsv("samples/sample.tsv")
      .then(function(data) {

          drawText("#tsvDemo", data);
       });
</script>

<svg id="tsvDemo" class="lightblue" width="80" height="50"></svg>
```

## d3.json

The code fragment below fetches a file named sample.json which contains the following text.

<pre>
{
  "0":{
    "letter": "A",
    "number": 1,
    "color": "red"
    },
  "1": {
    "letter": "B",
    "number": 2,
    "color": "blue"
    }
}
</pre>

Here is the code to read the json file.

``` {cm: visible}
<script>
  d3.json("samples/sample.json")
      .then(function(data) {

          // data is an object, convert to array.
          data = [data[0], data[1]];

          drawText("#jsonDemo", data);
       });
</script>

<svg id="jsonDemo" class="lightblue" width="80" height="50"></svg>
```

## d3.xml

The code fragment below fetches a file named sample.xml which contains the following text.

<pre>
&lt;?xml version="1.0" encoding="UTF-8" ?&gt;
&lt;data&gt;
  &lt;item&gt;
      &lt;letter&gt;A&lt;/letter&gt;
      &lt;number&gt;1&lt;/number&gt;
      &lt;color&gt;red&lt;/color&gt;
  &lt;/item&gt;
  &lt;item&gt;
      &lt;letter&gt;B&lt;/letter&gt;
      &lt;number&gt;2&lt;/number&gt;
      &lt;color&gt;blue&lt;/color&gt;
  &lt;/item&gt;
&lt;/data&gt;
</pre>

Here is the code to read the xml file.

``` {cm: visible}
<script>
  d3.xml("samples/sample.xml")
      .then(function(data) {

          // data is an XML document, parse document
          data = [].map.call(data.querySelectorAll("item"), function(item) {

              return {
                  letter: item.querySelector("letter").textContent,
                  number: item.querySelector("number").textContent,
                  color: item.querySelector("color").textContent
              };
          });

          drawText("#xmlDemo", data);

       });
</script>

<svg id="xmlDemo" class="lightblue" width="80" height="50"></svg>
```

## d3.html

The code fragment below fetches a file named sample.html which contains the following text.

<pre>
&lt;html&gt;
  &lt;body&gt;
    &lt;p&gt;A 1 red&lt;/p&gt;
    &lt;p&gt;B 2 blue&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;
</pre>

Here is the code to read the html file.

``` {cm: visible}
<script>
  d3.html("samples/sample.html")
      .then(function(data) {

          // data is an HTML document, parse document
          data = [].map.call(data.querySelectorAll("p"), function(node) {

              let tokens = node.textContent.split(" ");

              return {
                  letter: tokens[0],
                  number: tokens[1],
                  color: tokens[2]
              };
          });

          drawText("#htmlDemo", data);
       });
</script>

<svg id="htmlDemo" class="lightblue" width="80" height="50"></svg>
```

##d3.text

The code fragment below fetches a file named sample.txt which contains the following text.

<pre>
A 1 red
B 2 blue
</pre>

Here is the code to read the text file.

``` {cm: visible}
<script>
  d3.text("samples/sample.txt")
      .then(function(data) {

          // data is a string
          data = data.split("\n");

          data = data.map((str) => {
              let tokens = str.split(" ");

              return {
                  letter: tokens[0],
                  number: tokens[1],
                  color: tokens[2]
              };
          });

          drawText("#textDemo", data);
       });
</script>

<svg id="textDemo" class="lightblue" width="80" height="50"></svg>
```

## d3.svg

The code fragment below fetches a file named sample.svg which contains the following text.

<pre>
&lt;svg id="svgDemo" xmlns="http://www.w3.org/2000/svg" version="1.1" baseProfile="full" width="64" height="64" &gt;
    &lt;rect width="100%" height="100%" fill="green" /&gt;
    &lt;circle cx="40" cy="40" r="40" fill="blue" /&gt;
&lt;/svg&gt;
</pre>

Here is the code to read the svg file.

``` {cm: visible}
<script>
  d3.svg("samples/sample.svg")
      .then(function(data) {

         var oldChild = document.getElementById("svgDemo");
         document.getElementById("svgDemo").parentNode.replaceChild(data.documentElement, oldChild);
       });
</script>

<svg id="svgDemo" class="lightblue" width="80" height="50"></svg>
```

## d3.image

The code fragment below fetches a file named sample.png which contains a png that was created by exporting the above svg to a file with the png format.

Here is the code to read the png file.

``` {cm: visible}
<script>
  d3.image("samples/sample.png")
      .then(function(data) {

         let canvas = document.getElementById("imageDemo");
         let ctx = canvas.getContext('2d');
         ctx.drawImage(data, 0,0);
       });
</script>

<canvas id="imageDemo" width="64px" height="64px"></canvas>
```