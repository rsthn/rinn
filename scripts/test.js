const template = require('../template');

let data = {
	name: 'Jon',
	last: 'Doe'
};

try {
	console.log(
		template.eval(`

A = [json [& name: 'A' last: 'B']]
B = [json [& name 'A' last 'B']]
C = [json [& :name 'A' :last 'B']]

		`, data)
	);
}
catch (e) {
	console.error(e.message);
}
