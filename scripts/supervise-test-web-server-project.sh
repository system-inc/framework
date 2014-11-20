#!/bin/bash
#supervisor --harmony --no-restart-on exit --extensions node,js,json --watch ../framework tests/projects/web-server/Project.js
node ProcessManager.js --harmony --extensions node,js,json --watch ../framework tests/projects/web-server/Project.js