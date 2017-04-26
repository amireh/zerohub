exports.rethrow = fn => error => { fn(error); throw error; };
exports.pass = fn => value => { fn(value); return value; };
