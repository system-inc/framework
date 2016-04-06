// Class
var Try = function(functionToTry) {
    this.functionToTry = functionToTry;
    this.domain = Node.Domain.create();
    
    this.catch = function(catchFunction) {
        return new Promise(function(resolve, reject) {
            this.domain.on('error', function(error) {
                (function*() {
                    yield catchFunction.run(error);
                    this.domain.exit();
                    return resolve(error);
                }).bind(this).run();
            }.bind(this));

            (function*() {
                this.domain.enter();
                yield this.functionToTry.run();
                this.domain.exit();
                return resolve();
            }).bind(this).run();
        }.bind(this));
    };

    return this;
};

// Export
module.exports = Try;