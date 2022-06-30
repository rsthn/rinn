
/**
**	Common regular expressions for pattern validation.
*/

export default
{
	email: /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)+$/i,
	url: /^[\w-]+:\/\/[\w-]+(\.\w+)+.*$/,
	urlNoProt: /^[\w-]+(\.\w+)+.*$/,
	name: /^[-A-Za-z0-9_.]+$/,
	uname: /^['\pL\pN ]+$/,
	text: /^[^&<>{}]*$/,
	utext: /^([\r\n\pL\pN\pS &!@#$%*\[\]()_+=;',.\/?:"~-]+)$/
};
