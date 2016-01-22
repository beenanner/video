'use strict';

let spawn = require('child_process').spawn;

function spawnPython(context) {
  let args = ['/visualmetrics/visualmetrics.py', '--video', '/browsertime/' + context.taskData.name + '-run-' +  context.taskData.run + '.mpg', '--orange', '--dir', '/browsertime/images', '--force']

  let python = spawn('python', args);

  return new Promise(function(resolve, reject) {
    let metrics = {};
    let metricNames = {
      firstVisualChange: 'First Visual Change',
      lastVisualChange: 'Last Visual Change',
      speedIndex: 'Speed Index'
    };

    python.stdout.on('data', function(data) {
      Object.keys(metricNames).forEach(function(metric) {
        if (data.indexOf(metricNames[metric]) > -1) {
          var reg = metricNames[metric] + ': ([0-9]*)?';
          metrics[metric] = parseInt(data.toString().match(reg)[1]);
        }
      });

      metrics['visualProgress'] = data.toString().slice(data.toString().indexOf('Visual Progress:') + 17, data.toString().length - 1);
    });

    python.on('exit', function(code, signal) {
      context.results.visualMetrics = metrics;
      context.log.debug('Collected metrics ' + JSON.stringify(metrics));
      delete context.taskData.ffmpeg;
      resolve();
    });

    python.on('error', function(err) {
      reject(new Error('Python process error with code: ' + err));
    });

    python.on('close', function(code) {
      reject(new Error('Python process exited with code: ' + code));
    });
  });

}

module.exports = {
  run(context) {
    if (context.taskData.ffmpeg) {
      context.taskData.ffmpeg.kill('SIGHUP');
    }
    return spawnPython(context);
  }
};
