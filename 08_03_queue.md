{{meta {docid: queues}}}

<style>

</style>

<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://d3js.org/d3-queue.v3.min.js"></script>

# Queues

In this section we discuss `d3.queue`.

`d3-queue` is not apart of the main d3.js script that we have been using so we have to download it separately:
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

Next we need to assign some tasks (functions) for our queue to run. To set a task to run we call `queue.defer`. When calling this we first pass in the name of the task or function we want to queue, followed by a list of arguments that we want to pass into it. Any task or function we call this way should be defined to have its first argument be `callback`. `callback` is passed into the function from `queue.defer` and is used by the function to throw errors or return data to be used later by `queue.await`. When throwing errors or returning data on the callback, we call `callback(<i>error</i>, <i>data</i>)`.

+ [queue.defer(task[, arguments…])](https://github.com/d3/d3-queue#queue_defer) - Runs the `task` with the specified arguements listed out.

In Figure 1 we have the function `print` which we call twice by using `queue.defer`. The `callback` in `print` has `null` as its error and returned data since there should not be any errors and `value` is not needed again.

``` {cm: visible}
function print(callback, value){
    console.log(value);
    callback(null, null);
        // (no error, nothing to return)
}

var queue = d3.queue();
queue
    .defer(print, "applesause")
    .defer(print, "blueberry");
</pre>
```

## Await
+ [queue.await(callback)](https://github.com/d3/d3-queue#queue_await) - Runs the `callback` with any error as the first argument (`null` if none) and all deferred task results listed out in order of task start.

``` {cm: visible}
<script>
function rndNum(callback){
    callback(null, d3.randomUniform(0,15)());
}
d3.queue()
    .defer(rndNum)
    .defer(rndNum)
    .defer(rndNum)
    .await(function(error, result1, result2, result3){
        console.log(result1);
        console.log(result2);
        console.log(result3);
    });
</script>
```

+ [queue.awaitAll(callback)](https://github.com/d3/d3-queue#queue_awaitAll)Runs the `callback` with any error as the first argument (`null` if none) and *an array* of the results of all task in order of task start.

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

## Aborting Tasks
+ [queue.abort()](https://github.com/d3/d3-queue#queue_abort) - Calls every deferred tasks `task.abort` function. Immediately calls `await` or `awaitAll` with an abortion error. If a task does not have an `abort` function then it will continue to run, but will not call `await` or `awaitAll` when it succeeds or fails.
