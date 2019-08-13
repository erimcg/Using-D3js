{{meta {docid: timers}}}

<style>

</style>

<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://d3js.org/d3-timer.v1.min.js"></script>

# Timers
 
 In this section we discuss [`d3-timer`](https://github.com/d3/d3-timer).
 
 We may wish to have a function that is called repeatedly, every X seconds, or after a certain amount of time. For these situations, D3.js provides `d3-timer`. 
 
 `d3-timer` is not included in `https://d3js.org/d3.v5.min.js`, so it has to be loaded separately:
 <pre>
 &lt;script src="https://d3js.org/d3-timer.v1.min.js"></script>
 </pre>
 
 ## d3.now
 
D3.js provides [d3.now]() to get the amount of time that a page has been loaded. This time is in milliseconds and is useful if we want an event to trigger at a specific time (such as 5 seconds after the page loads). Internally, it uses `performance.now` to check the time elapsed, however note that some browsers randomize this timestamp and it is not 100% accurate. If `performance.now` is not available, `d3.now` uses `Date.now` instead.
 
+ [d3.now()](https://github.com/d3/d3-timer#now) - Returns [performance.now]() if available, or [Date.now]() if not.

## d3.timer

When making our visualizations we may want a function that continuously keeps executing. This functionality is especially useful in animations or time tracking situations. 

Luckily, D3.js provides us with [d3.timer(callback[, delay[, time]])](https://github.com/d3/d3-timer#timer) to invoke a `callback` function every animation frame (~17ms). 

To use `d3.timer` we first pass in a function to use as our callback. This callback is passed in the elapsed time from when the timer was set up to when the callback is being invoked that specific time. `d3.timer` invokes the callback function once every animation frame (~17ms).

Next, we can pass in an optional `delay` parameter. This `delay` prevents the timer from calling the callback until `delay` milliseconds have passed.

Finally, we can pass in an optional `time` parameter. The `time` parameter is at what time the `delay` starts from. By default `time` is `d3.now`. 

For example setting `time` to `d3.now() + 10` and delay to `250`, will result in an effective delay of 260ms from when the timer is declared to when the first callback function will be called.

+ [d3.timer(callback[, delay[, time]])](https://github.com/d3/d3-timer#timer) - Creates a new timer that calls `callback` every animation frame (~17ms). Can pass in a `delay` and `time` that will start the timer after the `delay` in milliseconds after the `time` specified. `time` and `delay` defaults to `d3.now()` and `0`, receptively. The callback is passed the elapsed time from when the timeout was declared to when the callback is invoked.

In Figure 1 we have a function `printTime` which displays in a `div` the string passed in. We also have a `d3.timer` with the callback function being set to `printTime`. `d3.timer` calls `printTime` every animation frame (~17ms). Each time `printTime` is called, `d3.timer` passes in the time elapsed from when that timer was originally declared to when that timer calls `printTime` that time. 

``` {cm: visible, edit: uneditable}
<script>
    function printTime1(elapsed){
        d3.select("#demo1").text(Math.round(elapsed) + "ms")
    }
    d3.timer(printTime1);
</script>
<div id="demo1"></div>
```
<figure class="sandbox"><figcaption>Figure 1  - A timer set to call printTime every animation frame, which displays how long the timer has been running.  </figcaption></figure>

## d3.interval

Running a function every animation frame with `d3.timer` can be taxing on our computers which can result in visual studders or timing issues if we use too many. To remedy this for less important functions, we can use a timer that is not called every animation frame, but instead every `delay` milliseconds. D3.js provides us `d3.interval` as a solution to this problem.

Like `d3.timer`, `d3.interval` calls a callback function that we supply or define and passes into it the elapsed time.

However, unlike `d3.timer`, `d3.interval` does not run every frame, but instead every `delay` milliseconds. If `delay` is not passed in, `d3.interval` will invoke the callback every frame like with `d3.timer`. `d3.interval` starts the countdown for the first invocation of the callback after `time` milliseconds from when the interval was decalred.
 
+ [d3.interval(callback[, delay[, time]])](https://github.com/d3/d3-timer#interval) - Like `d3.timer` except it runs once every `delay` milliseconds, not every animation frame. If `delay` is not set, it is equivalent to `d3.timer`. The callback is passed the elapsed time.

In Figure 2 we use the `printTime` function like we did in Figure 1, however now instead of using `d3.timer`, we use `d3.interval` to call the function *every* 500ms. 

Note that animation frames are not run every millisecond so there is some variance in every delay we use so it usually waits slightly more or less than 500ms.
``` {cm: visible, edit: uneditable}
<script>
    function printTime2(elapsed){
        d3.select("#demo2").text(Math.round(elapsed) + "ms")
    }
    d3.interval(printTime2, 500);
</script>
<div id="demo2"></div>
```
<figure class="sandbox"><figcaption>Figure 2  - An interval set to call printTime every 500ms, which displays how long the interval has been running.  </figcaption></figure>

## d3.timeout

We may need a function to run just once, but at a later time (such as X seconds after a button is clicked). D3.js provides `d3.timeout` to help us perform this functionality.

Like `d3.timer`, `d3.timeout` calls a callback function that we supply or define and passes into it the elapsed time.

Instead of running every frame after the `delay`, `d3.timeout` runs *once* after `delay` milliseconds. Like `d3.timer`, the `delay` will start "counting down" after the specified `time` after the timeout is defined. 

+ [d3.timeout(callback[, delay[, time]])](https://github.com/d3/d3-timer#timeout) - Like `d3.timer`, except it only runs once. The callback is passed the elapsed time.

In Figure 3 we use the `printTime` function like we did in Figure 1, however now instead of using `d3.timer`, we use `d3.timeout` to call the function *once* after 100ms.
``` {cm: visible, edit: uneditable}
<script>
    function printTime3(elapsed){
        d3.select("#demo3").text(Math.round(elapsed) + "ms")
    }
    d3.timeout(printTime3, 100);
</script>
<div id="demo3"></div>
```
<figure class="sandbox"><figcaption>Figure 3  - An timeout set to call printTime after 100ms, which displays how long it took for the timeout to call printTime.  </figcaption></figure>

## timer.stop

We may need to stop a timer, interval, or timeout from continuing to run. To do this we can invoke `timer.stop` on a timer, interval, or timeout. `timer.stop` will immediately stop any the timer, preventing it from invoking its callback any more. Any callbacks that were started before `timer.stop` was called will continue to execute.

+ [timer.stop()](https://github.com/d3/d3-timer#timer_stop) - Stops the timer from continuing to run, has no effect if a timer is already stopped.

In Figure 4 we use the `printTime` function and a timer like we did in Figure 1, however now we use `timer.stop` to stop the timer after 250ms by also using `d3.timeout`.
``` {cm: visible, edit: uneditable}
<script>
    function printTime4(elapsed){
        d3.select("#demo4").text(Math.round(elapsed) + "ms")
    }
    timer4 = d3.timer(printTime4);
    d3.timeout(() => timer4.stop(), 250);
</script>
<div id="demo4"></div>
```
<figure class="sandbox"><figcaption>Figure 4  - A timer set to constantly call printTime, such as in Figure 1. The timer is then stopped after 250 ms using d3.timeout and timer.stop.  </figcaption></figure>

## timer.restart

All the timers pass into their callbacks the elapsed time from when that timer was set up to when the callback is being called. We may wish to reset the time when the timer was set up (such as whenever a button is repeatedly clicked).

D3.js provides `timer.restart` to reset the timer, including when the timer was define for the elapsed time. To use this function, we have to redefine our `callback`, `delay`, and `time`. 

For `d3.timer` and `d3.timeout`, invoking `timer.restart` stops the old timer immediately and makes a new timer with the specified parameters. If the timer has not invoked its callback at all yet, such as in `d3.timeout`, it will not execute the first time.

`d3.interval` ***is not*** compatible with `timer.restart`. If you call `timer.restart` on an instance of `d3.interval`, the interval will be converted to an intance of `d3.timer` instead, running every frame.

+ [timer.restart(callback[, delay[, time]]](https://github.com/d3/d3-timer#timer_restart) - Equivalent to calling `timer.stop` on a timer and creating a new timer with the specified parameters. Only works on `d3.timer` and `d3.timeout`. Calling on `d3.interval` turns the `d3.interval` into a `d3.timer`.

In Figure 5 we have a timer and `printTime` function similar to Figure 1. We then have a `d3.timeout` which calls the function `restartTimers` after 2.5 seconds. `restartTimers` then restarts both the timer and the timeout with their original parameters.

``` {cm: visible, edit: uneditable}
<script>
    function printTime5(elapsed){
        d3.select("#demo5").text(Math.round(elapsed) + "ms")
    }
    function restartTimers(){
        timer5.restart(printTime5);
        timeout5.restart(() => restartTimers(), 2500);
    }
    timer5 = d3.timer(printTime5);
    timeout5 = d3.timeout(() => restartTimers(), 2500);
</script>
<div id="demo5"></div>  
```
<figure class="sandbox"><figcaption>Figure 5  - A timer and timeout reset every 2.5 seconds.  </figcaption></figure>

## d3.timerFlush

If we ever need to invoke the callbacks of all timers with no `delay`, we can call `d3.timerFlush`. `d3.timerFlush` immediately triggers *all* timers that have no delay.

+ [d3.timerFlush()](https://github.com/d3/d3-timer#timerFlush) - Immediately invokes the callbacks of any zero-delay timers.
