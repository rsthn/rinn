const template = require('../template');

console.log(
	template.eval('[set x.name HELLO][x.name] World!', { x: { } })
);
