{{meta {docid: dispathes}}}

<style>

</style>

<script src="https://d3js.org/d3.v5.min.js"></script>

# Dispatches

To create a dispatch we call `d3.dispatch` and pass in the `types` of events that we want the dispatch to handle. Each `type` is a string. 

For example, to create a dispatch that handles custom events "start" and "end":

<pre>
var dispatchEx = d3.dispatch("start", "end");
</pre>

+ [d3.dispatch(types...)](https://github.com/d3/d3-dispatch#dispatch) - Creates a new dispatch for the specified event types.

Next, we need to define what the custom events `start` and `end` do. To do this we call `dispatch.on` where is `dispatch` is instance of a dispatch created in the method above. To use `dispatch.onn` we pass in the string of the type of the event and then the callback function that will be invoked when the dispatch is called.

For example, to define what the `start` and `end` events do:

<pre>
dispatchEx.on("start", <i>callback function</i>);
dispatchEx.on("end", <i>callback function</i>);
</pre>

+ [dispatch.on(typenames[, callback])](https://github.com/d3/d3-dispatch#dispatch_on)

All that is left now is to call our dispatch events. To do this we can use `dispatch.call` on our instance of `d3.dispatch`. For this method we first pass in the event of that dispatch we want to invoke; following this is by what we want `this` to refer to within the dispatch events callback function; finally we add any arguments we want to pass into the callback function.

For example, to call `start` and `ende` when a `circle` has its `mouseenter` and `mouseout` events invoked.
Recall that within the callback function of `selection.on` `this` refers to the node that called the event:

<pre>
circleSelection
  .on("mouseenter", function(){
    dispatchEx.call("start", this, arguments...);
    //Passes in the node that called the event as 'this'
  })
  .on("mouseout", function(){
    dispatchEx.call("start", d3.select(this), arguments...);
    //Passes in a selection of the node that call the event as 'this'
  });
</pre>

+ [dispatch.call(type[, that[, arguments...]])](https://github.com/d3/d3-dispatch#dispatch_call)

In Figure 1 we create a dispatch with the types `start` and `end`. We then set `start` and `end` to change the color of `this` (which is passed in) to green and red respectively. In `start`, `this` is a node, and in `end`, `this` is a selection. We then append a `circle` and set its `mouseenter` and `mouseout` events to call the dispatches `start` and `end` respectively.

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
<figure class="sandbox"><figcaption>Figure 1 - A circle with mouseenter and mouseout events that are handled by a dispatch.  </figcaption></figure>

## Subtypes

When declaring the types in `d3.dispatch` we can use subtypes that are also called whenever its type is called. To define a subtype we name the type followed by a `.` and the subtype. Whenever we call a dispatches type all of its subtypes will also be invoked. This is useful for when we have separate events that may need to be called at the same time.

For example, to define the subtypes `start.foo` and `start.boo`:

<pre>
var dispatchEx = d3.dispatch("start.foo", "start.boo", "end");
</pre>

Now, whenever we call `dispatchEx.call("start")` `start.foo` and `start.boo` will both be invoked (assuming we give them both callback functions). 

An example of this can be seen in Figure 2.

## Copy

D3.js supplies us with `dispatch.copy` to create a deep copy of a dispatch. The new dispatch retains all events and callbacks that the original dispatch had. The new dispatch does not contain any references to the previous, so after creating a copy changing either will not change the other.

<pre>
var dispatchEx = d3.dispatch("start", "end");
var dispatchEx2 = dispatchEx.copy();
</pre>

+ [dispatch.copy()](https://github.com/d3/d3-dispatch#dispatch_copy) - Returns a deep copy of a dispatch. The copy does not contain any references to the original.

## Call vs Apply

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