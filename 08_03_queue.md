{{meta {docid: queues}}}

<style>

</style>

<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://d3js.org/d3-queue.v3.min.js"></script>

# Queues

In this section we discuss `d3.queue`.

`d3-queue` is not included in `d3.v5.min.js` so it has to be loaded separately: 
<pre>
&lt;script src="https://d3js.org/d3-queue.v3.min.js">&lt;/script>
</pre>

## Queues

`d3.queue` is used to run asynchronous tasks simultaneously and once the tasks are completed, perform operations on the results of the tasks. 

To use `d3.queue` we must first create an instance of it by calling `d3.queue([concurrency])`. `concurrency` is the amount of tasks that each queue will allow to run at once. By default the value is infinity, so all tasks will be run as soon as we set them. If we set this to `1` then the queue will run tasks sequentially as they are completed.

<pre>
var queue = d3.queue([<i>number</i>]);
</pre>

+ [d3.queue([concurrency])](https://github.com/d3/d3-queue#queue) - Returns a queue that will only run a specified amount (concurrency) of tasks at once.

Next we need to assign some tasks (functions) for our queue to run. To set a task to run we call `queue.defer`. When calling this we first pass in the name of the task or function we want to queue, followed by a list of arguments that we want to pass into it. Any task or function we call this way should be defined to have its *last* argument be `callback`. `callback` is passed into the function from `queue.defer` and is used by the function to throw errors or pass data on to be used later by `queue.await`. When throwing errors or passing on data through the callback, we call `callback(<i>error</i>, <i>data</i>)`.

+ [queue.defer(task[, arguments…])](https://github.com/d3/d3-queue#queue_defer) - Runs the `task` with the specified arguments listed out.

In Figure 1 we have the function `print` which we call twice by using `queue.defer`. The `callback` in `print` has `null` as its error and passes no data since we have not implement `queue.await` yet.

``` {cm: visible}
<script>
function print(value, callback){
    console.log(value);
    callback(null, null);
        // (no error, nothing to pass on)
}

var queue = d3.queue();
queue
    .defer(print, "applesause")
    .defer(print, "blueberry");
</script>
```
<figure class="sandbox"><figcaption>Figure 1  - A queue deferring two tasks of print which print out the strings passed in.  </figcaption></figure>

## Await

After all the tasks are finished, we may want to perform operations from any results of the tasks. To do this we can either use `queue.await` or `queue.awaitAll`. For both we set a callback function for the queue to run once all task are completed. 

For `d3.await` this callback function should have its first parameter be any errors that could have occurred in any task deferred; this is followed by a list of data returned in order of when the task is called.

+ [queue.await(callback)](https://github.com/d3/d3-queue#queue_await) - Runs`callback` with any error as the first argument (`null` if none) and all deferred task results listed out in order of task start.

In Figure 2 we have a function `rndNum` that passes a random number to the callback function in `await`. We then defer this function as a task three times and in `await` we pass our callback function any errors (none) and the results of each of the tasks. The callback function then prints out each of the randomly generated numbers. 
 
``` {cm: visible}
<script>
function rndNum(callback){
    callback(null, d3.randomUniform(0,15)());
}
d3.queue()
    .defer(rndNum) //result1
    .defer(rndNum) //result2
    .defer(rndNum) //result3
    .await(function(error, result1, result2, result3){
        console.log(result1);
        console.log(result2);
        console.log(result3);
    });
</script>
```
<figure class="sandbox"><figcaption>Figure 2 - A queue deferring three task of rndNum and then printing out the results in await.  </figcaption></figure>

For `d3.awaitAll`, the callback function should also have its first parameter be any errors that could have occurred in any task ran, however now, this is followed by array containing the data returned in order of when the task is called.

+ [queue.awaitAll(callback)](https://github.com/d3/d3-queue#queue_awaitAll)Runs the `callback` with any error as the first argument (`null` if none) and *an array* of the results of all tasks in order of task start.

In Figure 3 we have a function `rndNum` that passes a random number to the callback function in `awaitAll`. We then defer this function three times and in `awaitAll` we pass our callback function any errors (none) and *an array* of the results of each of the tasks. The callback function then prints out each of the randomly generated numbers.

``` {cm: visible}
<script>
function rndNum(callback){
    callback(null, d3.randomUniform(0,15)());
}
d3.queue()
    .defer(rndNum)
    .defer(rndNum)
    .defer(rndNum)
    .awaitAll(function(error, results){
        for(num of results){
            console.log(num);
        }
    });
</script>
```
<figure class="sandbox"><figcaption>Figure 3 - A queue deferring three tasks of rndNum and then printing out the results in awaitAll.  </figcaption></figure>

## Aborting Tasks

Sometimes we may need to stop all tasks from running further. In this case we can use `queue.abort`. `queue.abort` will calls every `abort` function returned by the tasks (an example can be seen below). It will then immediately call `queue.await` or `queue.awaitAll` and pass in an abort error. 

We will use a new function that has a timeout which can be stopped:
<pre>
function delayedPrint(text, callback) {
  var timeout = setTimeout(function() {
    console.log(text);
    callback(null);
  }, 250);
}
</pre>

Now we will return an abort function within this function that stops the timeout:
<pre>
function delayedPrint(text, callback) {
    let timeout = setTimeout(function() {
        console.log(text);
        callback(null);
    }, 250);
    
    return {
        abort: function(){
            clearTimeout(timeout);
        }
    }
}
</pre>

Now inside a queue we can call `abort`  to stop the tasks and print out the error in `await`:
<pre>
d3.queue()
    .defer(delayedPrint, "Hello")
    .defer(delayedPrint, "Goodbye")
    .abort()
    .await(function(error, args){
        console.log(error);
    });
</pre>

+ [queue.abort()](https://github.com/d3/d3-queue#queue_abort) - Calls every deferred tasks returned `abort` function. Immediately calls `await` or `awaitAll` with an abort error. If a task does not return an `abort` function then it will continue to run, but that task will not call `await` or `awaitAll` when it succeeds or fails.

In Figure 4 we use the snippets above to abort two tasks from running further. We then print out the error in `await`.

```
<script>
    function delayedPrint(text, callback) {
        let timeout = setTimeout(function() {
            console.log(text);
            callback(null);
        }, 250);
        
        return {
            abort: function(){
                clearTimeout(timeout);
            }
        }
    }
    d3.queue()
        .defer(delayedPrint, "Hello")
        .defer(delayedPrint, "Goodbye")
        .abort()
        .await(function(error, args){
            console.log(error);
        });
</script>
```
<figure class="sandbox"><figcaption>Figure 4  - A queue deferring two tasks of delayedPrint, aborting the tasks, then printing the error.  </figcaption></figure>