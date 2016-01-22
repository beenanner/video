#!/bin/bash
set -e
date
# print versions
# Starting Firefox will get us this message
# GLib-CRITICAL **: g_slice_set_config: assertion 'sys_page_size == 0' failed
# https://bugzilla.mozilla.org/show_bug.cgi?id=833117
# firefox -version
firefox --version 2>/dev/null
echo 'Starting Xvfb ...'
2>/dev/null 1>&2 Xvfb :99 -shmem -screen 0 1366x768x24+32 &
#Xvfb :99 -shmem -screen 0 1366x768x16 &
export DISPLAY=:99.0
# ffmpeg -framerate 60 -video_size 1366x768 -f x11grab -i :99.0 /visualmetrics/output.mpg &
exec "$@"
