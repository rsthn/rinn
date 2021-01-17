const template = require('../template');

let data = {
	name: 'Jon',
	last: 'Doe'
};

try {
	console.log(
		template.eval(`
[unset name]
[name] [last]
		`, data)
	);
}
catch (e) {
	console.error(e.message);
}
