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
 
D3.js provides [d3.now]() to get the amount of time a page has been loaded. This time is in milliseconds and is useful if we want an event to trigger at a specific time (such as 5 seconds after the page loads). Internally, it uses `performance.now` to check the time elapsed, however note that some browsers randomize this timestamp and it is not 100% accurate. If `performance.now` is not available, `d3.now` uses `Date.now` instead.
 
+ [d3.now()](https://github.com/d3/d3-timer#now) - Returns [performance.now]() if available, or [Date.now]() if not.

## d3.timer

+ [d3.timer(callback[, delay[, time]])](https://github.com/d3/d3-timer#timer) - Creates a new timer that calls `callback` repeatedly. Can pass in a `delay` and `time` that will start the timer after the `delay` in milliseconds after the `time` specified. `time` and `delay` defaults to `d3.now()` and `0`, receptively. The callback is passed the elapsed time from when the timeout was declared and when the callback is invoked.

In Figure 1 we have a function `printTime` which displays in a `div` the string passed in. We also have a `d3.timer` with the callback function being set to `printTime`. `d3.timer` calls `printTime` repeatedly. Each time `printTime` is called, `d3.timer` passes in the time elapsed from when that timer was originally declared to when that timer calls `printTime` that time. 

``` {cm: visible, edit: uneditable}
<script>
    function printTime1(elapsed){
        d3.select("#demo1").text(Math.round(elapsed) + "ms")
    }
    d3.timer(printTime1);
</script>
<div id="demo1"></div>
```
<figure class="sandbox"><figcaption>Figure 1  - A timer set to constantly call printTime, which displays how long the timer has been running.  </figcaption></figure>

## d3.interval

Running a function constantly with `d3.timer` can be taxing on our computers, and running many timers at once can result in visual studders if it relates to animation. To remedy this we can use a timer that is not called constantly but instead every X milliseconds.

+ [d3.interval(callback[, delay[, time]])](https://github.com/d3/d3-timer#interval) - Like `d3.timer` except it runs every `delay` milliseconds, not constantly. If `delay` is not set, it is equivalent to timer. The callback is passed the elapsed time.

In Figure 2 we use the `printTime` function like we did in Figure 1, however now instead of using `d3.timer`, we use `d3.interval` to call the function *every* 100ms.
``` {cm: visible, edit: uneditable}
<script>
    function printTime2(elapsed){
        d3.select("#demo2").text(Math.round(elapsed) + "ms")
    }
    d3.interval(printTime2, 100);
</script>
<div id="demo2"></div>
```
<figure class="sandbox"><figcaption>Figure 2  - An interval set to call printTime every 100ms, which displays how long the interval has been running.  </figcaption></figure>

## d3.timeout

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

+ [timer.restart(callback[, delay[, time]]](https://github.com/d3/d3-timer#timer_restart) - Equivalent to calling `timer.stop` on a timer and creating a new timer with the specified parameters. Only works on `d3.timer` and `d3.timeout`. Calling on `d3.interval` turns the `d3.interval` into a `d3.timer`.



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
<figure class="sandbox"><figcaption>Figure 4  - A timer set to constantly call printTime, such as in Figure 1. The timer is then stopped after 250 ms with a timeout.  </figcaption></figure>

## d3.timerFlush

+ [d3.timerFlush()](https://github.com/d3/d3-timer#timerFlush) - Immediately invokes the callbacks of any zero-delay timers.
