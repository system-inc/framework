Framework = require('./../../../Framework.js');
Project = new Framework(__dirname);
Project.initialize();

// This runs on all cores
//if(Node.Cluster.isMaster) {
//    // Fork workers
//    for(var i = 0; i < Node.OperatingSystem.cpus().length; i++) {
//        Console.log('Forking...');
//        Node.Cluster.fork();
//    }

//    Node.Cluster.on('exit', function(worker, code, signal) {
//        Console.log('Worker "'+worker.process.pid+'" died.');
//    });
//}
//else {
//	Project = new Framework(__dirname);
//	Project.initialize();	
//}