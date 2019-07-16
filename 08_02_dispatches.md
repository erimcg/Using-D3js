{{meta {docid: dispathes}}}

<style>

</style>

<script src="https://d3js.org/d3.v5.min.js"></script>

# Dispatches

+ [d3.dispatch(types...)](https://github.com/d3/d3-dispatch#dispatch) - Creates a new dispatch for the specified event types.

<pre>
var dispatch = d3.dispatch("start", "end");
</pre>

+ [dispatch.on(typenames[, callback])](https://github.com/d3/d3-dispatch#dispatch_on)

<pre>
dispatch.on("start", <i>callback function</i>);
</pre>

```
<script>
var dispatch1 = d3.dispatch("start", "end");

dispatch1.on("start", function() {
	d3.select(this).attr("fill", "green");
});
dispatch1.on("end", function() {
	this.attr("fill", "red");
});

d3.select("#demo1")
    .append("circle")
    .attr("fill", "black")
    .attr("cx", 100)
    .attr("cy", 100)
    .attr("r", 80)
    .on("mouseenter", function(){
        dispatch1.call("start", this);
    })
    .on("mouseout", function(){
        dispatch1.call("end", d3.select(this));
    });

</script>
<svg id="demo1" width=200 height=200></svg>
```

+ [dispatch.copy()](https://github.com/d3/d3-dispatch#dispatch_copy)


+ [dispatch.call(type[, that[, arguments...]])](https://github.com/d3/d3-dispatch#dispatch_call)
+ [dispatch.apply(type[, that[,arguments]])](https://github.com/d3/d3-dispatch#dispatch_apply)

```
<script>
var people = [
    ["John", "Smith", "Doctor"],
    ["Rose", "Tyler", "Retailer"],
    ["Clara", "Oswald", "Teacher"],
    ["Yasmin", "Khan", "Police Officer"]
];

var dispatchPeople = d3.dispatch("show");

var previousCircle;
var textSelection = d3.select("#demo4").selectAll("text"); 

dispatchPeople.on("show.color", function(first, last, occupation){
    if (previousCircle)
    	d3.select(previousCircle).attr("fill", "black");
    this.attr("fill", "#003B6F");
    previousCircle = this.node();
});
dispatchPeople.on("show.name", function(first, last, occupation){
	textSelection
   		.data(["Name: " + first + " " + last, "Occupation: " + occupation])
   		.text((d) => d);
});

d3.select("#demo4")
    .selectAll()
    .data(people)
    .join("circle")
    .attr("cx", (d,i) => i * 50 + 25)
    .attr("cy", 50)
    .attr("r", 20)
    .attr("fill", "black")
    .on("click", function(d){
        //dispatchPeople.call("show", d3.select(this), d[0], d[1], d[2]);
        dispatchPeople.apply("show", d3.select(this), d);
    });
</script>
<svg id=demo4 width=200 height=200>
	<text id="demo4TextName" x=100 y=125 text-anchor="middle"></text>
    <text id="demo4TextOccupation" x=100 y=150 text-anchor="middle"></text>
</svg>
```