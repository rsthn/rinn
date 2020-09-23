const template = require('../template');

let data = {
	name: 'Jon',
	last: 'Doe'
};

try {
	console.log(
		template.eval(`

[join ' ' [map i [repeat i from 1 count 20 [if [lt [i] 4] [i] else [break]]  ] [* 2 [i]]]]

		`, data)
	);
}
catch (e) {
	console.error(e.message);
}
