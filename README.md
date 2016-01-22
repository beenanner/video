# SpeedIndex using Browsertime

This is a POC for using the coming Browsertime 1.0 together with [VisualMetrics](https://github.com/WPO-Foundation/visualmetrics) to fetch SpeedIndex and start render.

## What
This is the current flow:
Start browsertime
Open a browser, go to a empty page, set the background color to orange
start the video recording (done in pretask.js)
change the background color to white (done in pretask.js)
navigate to the URL
stop the recording (done in posttask.js)
run VisualMetrics on the generated video (done in posttask.js)
inject the result into the metrics from Browsertime

´´´json
"visualMetrics": {
  "firstVisualChange": 467,
  "lastVisualChange": 1234,
  "speedIndex": 590,
  "visualProgress": "0=0%, 467=2%, 567=92%, 600=92%, 634=94%, 667=96%, 700=96%, 800=97%, 1134=97%, 1200=99%, 1234=100%"
}
´´´

## Build the container
docker build -t sitespeedio/video .

## Run
 docker run -v "$(pwd)":/browsertime sitespeedio/video browsertime --preTask /home/root/scripts/pretask.js -b chrome --postTask /home/root/scripts/posttask.js https://en.wikipedia.org/wiki/California_State_Route_75 -n 3 --viewPort 1300x700 --output /browsertime/metrics.json

 ## TODO
 Lets create issues of what's left 2do
 - setup the video correctly (quality etc)
 - find a good structure for keeping the video and screenshots
 - make browsertime take multiple pre & post tasks
