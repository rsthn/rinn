const template = require('../template');

console.log(
	template.eval('[?? [null] world]', { x: { } })
);
