// Use Bluebird for now until I write my own (so I understand what is going on)
Promise = require('./../libraries/bluebird');

// Long stack traces imply a substantial performance penalty, around 4-5x for throughput and 0.5x for latency
Promise.longStackTraces();