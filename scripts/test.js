const template = require('../template');

const data = {
	list: [1, 2, 3, 4, 5],
	name: 'test',
	test: function (x, list)
	{
		return 'List is: ' + list.map( i => i*x ).join(', ') + '\n';
	}
};

try {
	console.log(
		template.eval('[call this.[name] 10 [map i [filter i [list] [gt [i] 3]] [** 2 [i]]]]', data, 'arg')
	);
}
catch (e) {
	console.error(e.message);
}
