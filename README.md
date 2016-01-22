# SpeedIndex using Browsertime

This is a POC for using the coming Browsertime 1.0 together with [VisualMetrics](https://github.com/WPO-Foundation/visualmetrics) to fetch SpeedIndex and start render.

## The flow
When you run and start test a URL this is what happens:
* Start browsertime
* Open a browser, go to an empty page, set the background color to orange
* Start the video recording (done in pretask.js)
* Change the background color to white (done in pretask.js)
* Navigate to the URL
* Wait on the page to finish 
* Stop the recording (done in posttask.js)
* Run VisualMetrics on the generated video (done in posttask.js)
* Inject the result into the metrics from Browsertime

```json
"visualMetrics": {
  "firstVisualChange": 467,
  "lastVisualChange": 1234,
  "speedIndex": 590,
  "visualProgress": "0=0%, 467=2%, 567=92%, 600=92%, 634=94%, 667=96%, 700=96%, 800=97%, 1134=97%, 1200=99%, 1234=100%"
}
```

## Build the container
docker build -t sitespeedio/video .

## Run
You need to specify the path to the pre and post tasks and where yoy want to output the result.

```
 docker run -v "$(pwd)":/browsertime sitespeedio/video browsertime --preTask /home/root/scripts/pretask.js -b chrome --postTask /home/root/scripts/posttask.js https://en.wikipedia.org/wiki/California_State_Route_75 -n 3 --viewPort 1300x700 --output /browsertime/metrics.json
 ```

## TODO
There's a lot 2 do to make this ready for sitespeed.io 4.0 (I'll create issues asap):
- setup the video correctly (quality)
- find a good structure for keeping the video and screenshots
- make browsertime take multiple pre & post tasks (so we can also do login or whatever)
- Cleanup up the pre/post tasks.
- Think about how we do to include this in the Docker containers of 4.0.
