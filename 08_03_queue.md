{{meta {docid: queues}}}

<style>

</style>

<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://d3js.org/d3-queue.v3.min.js"></script>

# Queues

In this section we discuss `d3.queue`.

`d3-queue` is not apart of the full d3.js that we download and has to be loaded seperately:
<pre>
&lt;script src="https://d3js.org/d3-queue.v3.min.js">&lt;/script>
</pre>

## Queues

`d3.queue` is used to run asynchronous tasks simultaneously and can perform operations on the results of the tasks. 

+ [d3.queue([concurrency])](https://github.com/d3/d3-queue#queue) - Returns a queue that will only run a specified amount (concurrency) of tasks at once.
+ [queue.defer(task[, arguments…])](https://github.com/d3/d3-queue#queue_defer) - Runs the `task` with the specified arguements listed out.

## Await
+ [queue.await(callback)](https://github.com/d3/d3-queue#queue_await) - Runs the `callback` with any error as the first argument (`null` if none) and all deferred task results listed out in order of task start.

```javascript 1.8
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
```

+ [queue.awaitAll(callback)](https://github.com/d3/d3-queue#queue_awaitAll)Runs the `callback` with any error as the first argument (`null` if none) and *an array* of the results of all task in order of task start.

```javascript 1.8
function rndNum(){
    return d3.randomUniform(0,15);
}
d3.queue()
    .defer(rndNum())
    .defer(rndNum())
    .defer(rndNum())
    .awaitAll(function(error, results){
        for(num in results){
            console.log(num);
        }
    });
```

## Aborting Tasks
+ [queue.abort()](https://github.com/d3/d3-queue#queue_abort) - Calls every deferred tasks `task.abort` function. Immediately calls `await` or `awaitAll` with an abortion error. If a task does not have an `abort` function then it will continue to run, but will not call `await` or `awaitAll` when it succeeds or fails.
