'use strict';
// hack to get hold of the installed version of the webdriver,
// can we fix that?
let webdriver = require('/usr/lib/node_modules/browsertime/node_modules/selenium-webdriver');
let spawn = require('child_process').spawn;
let url = require('url');

function spawnFfmpeg(context, exitCallback) {

  context.taskData.name = url.parse(context.url).hostname;
  // caclulate the viewport, lets spend some time and make this better
  let size = '1366x708';
  if (context.options.viewPort) {
    let widthAndHeight = context.options.viewPort.split('x');
    size = widthAndHeight[0] + 'x' + (parseInt(widthAndHeight[1]) - 60);
  }

  // keep track of how many runs we've done
  if (context.taskData.run) {
    context.taskData.run += 1;
  } else {
    context.taskData.run = 1;
  }

  // config for ffmpeg
  // TODO lets make the record with better quality
  let args = ['-y', '-framerate', '30', '-video_size', size, '-f', 'x11grab', '-i', ':99.0+0,60', '/browsertime/' + context.taskData.name + '-run-' + context.taskData.run + '.mpg'];

  let ffmpeg = spawn('ffmpeg', args);
  context.log.debug('Spawning ffmpeg ' + args.join(' '));
  context.taskData.ffmpeg = ffmpeg;
  ffmpeg.on('exit', exitCallback);
  ffmpeg.stderr.on('data', function(data) {
    context.log.debug('err:' + data);
  });
}

module.exports = {
  run(context) {
    return context.runWithDriver((driver) => {
      // start on a blank page and lets make the background orange
      // that will make it easier for VisualMetrics to know when the
      // page is requested
      return driver.get('data:text/html;charset=utf-8,')
        .then(() => {
          return driver.executeScript('document.body.style.background = \"#DE640D\"');
        })
        .then(() => {
          spawnFfmpeg(context, function() {
            context.log.info('finished recording video')
          });
        })
        .then(() => {
          // lets wait so that FFmpeg has started before we navigate to the URL
          return webdriver.promise.delayed(2000);
        })
        .then(() => {
          // we are ready! Make the background white and let Browsertime do the
          // work
          return driver.executeScript('document.body.style.background = \"#FFFFFF\"');
        });

    });
  }
};
