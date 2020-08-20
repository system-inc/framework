// Class
class Primitive {

    static is = function(value) {
        return (typeof value !== 'object' && typeof value !== 'function') || value === null;
    }

}

global.Primitive = Primitive;
