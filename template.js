/*
**	rin/template
**
**	Copyright (c) 2013-2020, RedStar Technologies, All rights reserved.
**	https://www.rsthn.com/
**
**	THIS LIBRARY IS PROVIDED BY REDSTAR TECHNOLOGIES "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
**	INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A 
**	PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL REDSTAR TECHNOLOGIES BE LIABLE FOR ANY
**	DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT 
**	NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; 
**	OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
**	STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
**	USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

let Rin = require('./alpha');

/**
**	Templating module. The template formats available are shown below, note that the sym-open and sym-close symbols are by
**	default the square brackets, however those can be modified since are just parameters.
**
**	HTML Escaped Output:			[data.value]					Escapes HTML characters from the output.
**	Raw Output:						[!data.value]					Does not escape HTML characters from the output (used to output direct HTML).
**	Double-Quoted Escaped Output:	[data.value]					Escapes HTML characters and surrounds with double quotes.
**	Immediate Reparse:				[<....] [@....] "..." '...'		Reparses the contents as if parseTemplate() was called again.
**	Immediate Output:				[:...]							Takes the contents and outputs exactly as-is without format and optionally surrounded by the
**																	sym-open and sym-close symbols when the first character is not '<', sym_open or space.
**	Filtered Output:				[functionName ... <expr> ...]	Runs a function call, 'expr' can be any of the allowed formats shown here (nested if desired),
**																	functionName should map to one of the available expression functions registered in the
**																	Rin.Template.functions map, each of which have their own parameters.
*/

let Template = module.exports =
{
	/*
	**	Strict mode flag. When set, any undefined expression function will trigger an exception.
	*/
	strict: false,

	/**
	**	Parses a template and returns the compiled 'parts' structure to be used by the 'expand' method.
	**
	**	>> array parseTemplate (string template, char sym_open, char sym_close, bool is_tpl=false);
	*/
	parseTemplate: function (template, sym_open, sym_close, is_tpl=false, root=1)
	{
		let nflush = 'string', flush = null, state = 0, count = 0;
		let str = '', parts = [], mparts = parts, nparts = false;

		if (is_tpl === true)
		{
			template = template.trim();
			nflush = 'identifier';
			state = 10;

			mparts.push(parts = []);
		}

		template += "\0";

		function unescape (value)
		{
			if (typeof(value) == 'object')
			{
				if (value instanceof Array)
				{
					for (let i = 0; i < value.length; i++)
						unescape(value[i]);
				}
				else
				{
					value.data = unescape(value.data);
				}

				return value;
			}

			for (let i = 0; i < value.length; i++)
			{
				if (value[i] == '\\')
				{
					let r = value[i+1];

					switch (r)
					{
						case 'n': r = "\n"; break;
						case 'r': r = "\r"; break;
						case 'f': r = "\f"; break;
						case 'v': r = "\v"; break;
						case 't': r = "\t"; break;
						case 's': r = "\s"; break;
						case '"': r = "\""; break;
						case "'": r = "\'"; break;
					}

					value = value.substr(0, i) + r + value.substr(i+2);
				}
			}

			return value;
		}

		function emit (type, data)
		{
			if (type == 'template')
			{
				data = Template.parseTemplate (data, sym_open, sym_close, true, 0);
			}
			else if (type == 'parse')
			{
				data = Template.parseTemplate (data, sym_open, sym_close, false, 0);
				type = 'base-string';

				if (Rin.typeOf(data) == 'array')
				{
					type = data[0].type;
					data = data[0].data;
				}
			}
			else if (type == 'parse-trim-merge')
			{
				data = Template.parseTemplate (data.trim().split('\n').map(i => i.trim()).join("\n"), sym_open, sym_close, false, 0);
			}
			else if (type == 'parse-merge')
			{
				data = Template.parseTemplate (data, sym_open, sym_close, false, 0);
			}
			else if (type == 'parse-merge-alt')
			{
				data = Template.parseTemplate (data, '{', '}', false, 0);
			}

			if (type == 'parse-merge' || type == 'parse-merge-alt' || type == 'parse-trim-merge')
			{
				for (let i = 0; i < data.length; i++)
				{
					parts.push(data[i]);
				}
			}
			else
				parts.push({ type: type, data: data });

			if (nparts)
			{
				mparts.push(parts = []);
				nparts = false;
			}
		}

		for (let i = 0; i < template.length; i++)
		{
			if (template[i] == '\\')
			{
				str += '\\';
				str += template[++i];
				continue;
			}

			switch (state)
			{
				case 0:
					if (template[i] == '\0')
					{
						flush = 'string';
					}
					else if (template[i] == sym_open && template[i+1] == '<')
					{
						state = 1; count = 1;
						flush = 'string';
						nflush = 'parse-merge';
					}
					else if (template[i] == sym_open && template[i+1] == '@')
					{
						state = 1; count = 1;
						flush = 'string';
						nflush = 'parse-trim-merge';
						i++;
					}
					else if (template[i] == sym_open && template[i+1] == ':')
					{
						state = 12; count = 1;
						flush = 'string';
						nflush = 'string';
						i++;
					}
					else if (template[i] == sym_open)
					{
						state = 1; count = 1;
						flush = 'string';
						nflush = 'template';
					}
					else
					{
						str += template[i];
					}

					break;
	
				case 1:
					if (template[i] == '\0')
					{
						throw new Error ("Parse error: Unexpected end of template");
					}
	
					if (template[i] == sym_close)
					{
						count--;
	
						if (count < 0)
							throw new Error ("Parse error: Unmatched " + sym_close);

						if (count == 0)
						{
							state = 0;
							flush = nflush;
							break;
						}
					}
					else if (template[i] == sym_open)
					{
						count++;
					}
	
					str += template[i];
					break;

				case 10:
					if (template[i] == '\0')
					{
						flush = nflush;
						break;
					}
					else if (template[i] == '.')
					{
						emit (nflush, str);
						emit ('access', '.');

						nflush = 'identifier';
						str = '';
						break;
					}
					else if (template[i].match(/[\t\n\r\f\v ]/) != null)
					{
						flush = nflush;
						nflush = 'identifier';
						nparts = true;

						while (template[i].match(/[\t\n\r\f\v ]/) != null) i++;
						i--;

						break;
					}
					else if (template[i] == sym_open && template[i+1] == '<')
					{
						if (str) flush = nflush;
						state = 11; count = 1; nflush = 'parse-merge';
						break;
					}
					else if (template[i] == sym_open && template[i+1] == '@')
					{
						if (str) flush = nflush;
						state = 11; count = 1; nflush = 'parse-trim-merge';
						i++;
						break;
					}
					else if (template[i] == '"')
					{
						if (str) flush = nflush;
						state = 14; count = 1; nflush = 'parse-merge';
						break;
					}
					else if (template[i] == '\'')
					{
						if (str) flush = nflush;
						state = 15; count = 1; nflush = 'parse-merge';
						break;
					}
					else if (template[i] == '`')
					{
						if (str) flush = nflush;
						state = 16; count = 1; nflush = 'parse-merge-alt';
						break;
					}
					else if (template[i] == sym_open && template[i+1] == ':')
					{
						if (str) flush = nflush;
						state = 13; count = 1; nflush = 'string';
						i++;
						break;
					}
					else if (template[i] == sym_open)
					{
						if (str) emit (nflush, str);
						state = 11; count = 1; str = ''; nflush = 'parse';
						str += template[i];
						break;
					}

					if (nflush != 'identifier')
					{
						emit (nflush, str);
						str = '';
						nflush = 'identifier';
					}

					str += template[i];
					break;
	
				case 11:
					if (template[i] == '\0')
						throw new Error ("Parse error: Unexpected end of template");
	
					if (template[i] == sym_close)
					{
						count--;
	
						if (count < 0)
							throw new Error ("Parse error: Unmatched " + sym_close);

						if (count == 0)
						{
							state = 10;
	
							if (nflush == 'parse-merge' || nflush == 'parse-merge-alt' || nflush == 'parse-trim-merge')
								break;
						}
					}
					else if (template[i] == sym_open)
					{
						count++;
					}
	
					str += template[i];
					break;

				case 12:
					if (template[i] == '\0')
						throw new Error ("Parse error: Unexpected end of template");
	
					if (template[i] == sym_close)
					{
						count--;
	
						if (count < 0)
							throw new Error ("Parse error: Unmatched " + sym_close);

						if (count == 0)
						{
							if (str.length != 0)
							{
								if (!(str[0] == '<' || str[0] == '[' || str[0] == ' '))
									str = sym_open + str + sym_close;
							}

							state = 0;
							flush = nflush;
							break;
						}
					}
					else if (template[i] == sym_open)
					{
						count++;
					}
	
					str += template[i];
					break;

				case 13:
					if (template[i] == '\0')
						throw new Error ("Parse error: Unexpected end of template");

					if (template[i] == sym_close)
					{
						count--;
	
						if (count < 0)
							throw new Error ("Parse error: Unmatched " + sym_close);

						if (count == 0)
						{
							if (!(str[0] == '<' || str[0] == '[' || str[0] == ' '))
								str = sym_open + str + sym_close;

							state = 10;
							break;
						}
					}
					else if (template[i] == sym_open)
					{
						count++;
					}
	
					str += template[i];
					break;

				case 14:
					if (template[i] == '\0')
					{
						throw new Error ("Parse error: Unexpected end of template");
					}
	
					if (template[i] == '"')
					{
						count--;
	
						if (count < 0)
							throw new Error ("Parse error: Unmatched " + '"');

						if (count == 0)
						{
							state = 10;
	
							if (nflush == 'parse-merge' || nflush == 'parse-merge-alt' || nflush == 'parse-trim-merge')
								break;
						}
					}

					str += template[i];
					break;

				case 15:
					if (template[i] == '\0')
					{
						throw new Error ("Parse error: Unexpected end of template");
					}
	
					if (template[i] == '\'')
					{
						count--;
	
						if (count < 0)
							throw new Error ("Parse error: Unmatched " + '\'');

						if (count == 0)
						{
							state = 10;
	
							if (nflush == 'parse-merge' || nflush == 'parse-merge-alt' || nflush == 'parse-trim-merge')
								break;
						}
					}

					str += template[i];
					break;

				case 16:
					if (template[i] == '\0')
					{
						throw new Error ("Parse error: Unexpected end of template");
					}
	
					if (template[i] == '`')
					{
						count--;
	
						if (count < 0)
							throw new Error ("Parse error: Unmatched " + '`');

						if (count == 0)
						{
							state = 10;
	
							if (nflush == 'parse-merge' || nflush == 'parse-merge-alt' || nflush == 'parse-trim-merge')
								break;
						}
					}

					str += template[i];
					break;
			}

			if (flush)
			{
				emit (flush, str);
				flush = str = '';
			}
		}

		if (!is_tpl)
		{
			i = 0;
			while (i < mparts.length)
			{
				if (mparts[i].type == 'string' && mparts[i].data == '')
					mparts.splice(i, 1);
				else
					break;
			}

			i = mparts.length-1;
			while (i > 0)
			{
				if (mparts[i].type == 'string' && mparts[i].data == '')
					mparts.splice(i--, 1);
				else
					break;
			}

			if (mparts.length == 0)
				mparts.push({ type: 'string', data: '' });
		}

		if (root)
			unescape(mparts);

		return mparts;
	},

	/**
	**	Parses a template and returns the compiled 'parts' structure to be used by the 'expand' method. This
	**	version assumes the sym_open and sym_close chars are [ and ] respectively.
	**
	**	>> array parse (string template);
	*/
	parse: function (template)
	{
		return this.parseTemplate(template.trim(), '[', ']', false);
	},

	/**
	**	Expands a template using the given data object, ret can be set to 'text' or 'obj' allowing to expand the template as
	**	a string (text) or an array of objects (obj) respectively. If none provided it will be expanded as text.
	**
	**	>> string/array expand (array parts, object data, string ret='text', string mode='base-string');
	*/
	expand: function (parts, data, ret='text', mode='base-string')
	{
		let s = [];

		// Expand variable parts.
		if (mode == 'var')
		{
			let escape = true;
			let quote = false;

			let root = data;
			let last = null;
			let first = true;
			let str = '';

			for (let i = 0; i < parts.length && data != null; i++)
			{
				switch (parts[i].type)
				{
					case 'identifier':
					case 'string':
						str += parts[i].data;
						last = null;
						break;

					case 'template':
						last = this.expand(parts[i].data, root, 'arg', 'template');
						str += typeof(last) != 'object' ? last : '';
						break;

					case 'base-string':
						str += this.expand(parts[i].data, root, 'arg', 'base-string');
						last = null;
						break;

					case 'access':
						if (!last || typeof(last) != 'object')
						{
							if (!str) str = 'this';

							while (true)
							{
								if (str[0] == '!')
								{
									str = str.substr(1);
									escape = false;
								}
								else if (str[0] == '$')
								{
									str = str.substr(1);
									quote = true;
								}
								else
									break;
							}

							if (str != 'this' && data != null)
							{
								let tmp = data;
								data = (str in data) ? data[str] : null;

								if (data === null && first)
								{
									if (str in Template.functions)
										data = Template.functions[str] (null, null, tmp);
								}

								first = false;
							}
						}
						else
							data = last;

						str = '';
						break;
				}
			}

			while (str != '')
			{
				if (str[0] == '!')
				{
					str = str.substr(1);
					escape = false;
				}
				else if (str[0] == '$')
				{
					str = str.substr(1);
					quote = true;
				}
				else
					break;
			}

			if (str != 'this')
			{
				let failed = false;

				if (data != null)
				{
					if (!(str in data))
					{
						failed = true;
						data = null;
					}
					else
						data = data[str];
				}
				else
					failed = true;

				if (failed && parts.length == 1)
				{
					if (Template.strict == true)
						throw new Error ('Expression function `'+str+'` not found.');
				}
			}

			if (typeof(data) == 'string')
			{
				if (escape)
					data = data.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

				if (quote)
					data = '"' + data + '"';
			}

			s.push(data);
		}

		// Expand variable parts and returns a reference to it.
		if (ret == 'varref')
		{
			let root = data;
			let last = null;
			let first = true;
			let str = '';

			for (let i = 0; i < parts.length && data != null; i++)
			{
				switch (parts[i].type)
				{
					case 'identifier':
					case 'string':
						str += parts[i].data;
						last = null;
						break;

					case 'template':
						last = this.expand(parts[i].data, root, 'arg', 'template');
						str += typeof(last) != 'object' ? last : '';
						break;

					case 'base-string':
						str += this.expand(parts[i].data, root, 'arg', 'base-string');
						last = null;
						break;

					case 'access':
						if (!last || typeof(last) != 'object')
						{
							if (!str) str = 'this';

							while (true)
							{
								if (str[0] == '!')
								{
									str = str.substr(1);
								}
								else if (str[0] == '$')
								{
									str = str.substr(1);
								}
								else
									break;
							}

							if (str != 'this' && data != null)
							{
								let tmp = data;
								data = (str in data) ? data[str] : null;

								if (data === null && first)
								{
									if (str in Template.functions)
										data = Template.functions[str] (null, null, tmp);
								}

								first = false;
							}
						}
						else
							data = last;

						str = '';
						break;
				}
			}

			while (str != '')
			{
				if (str[0] == '!')
				{
					str = str.substr(1);
				}
				else if (str[0] == '$')
				{
					str = str.substr(1);
				}
				else
					break;
			}

			return str != 'this' ? [data, str] : null;
		}

		// Expand function parts.
		if (mode == 'fn')
		{
			var args = [];

			args.push(Template.expand(parts[0], data, 'text', 'base-string'));

			if ('_'+args[0] in Template.functions)
				args[0] = '_'+args[0];

			if (!(args[0] in Template.functions))
			{
				if (Template.strict == true)
					throw new Error ('Expression function `'+args[0]+'` not found.');

				return `(Unknown: ${args[0]})`;
			}

			if (args[0][0] == '_')
				return Template.functions[args[0]] (parts, data);

			for (let i = 1; i < parts.length; i++)
				args.push(Template.expand(parts[i], data, 'arg', 'base-string'));

			s.push(Template.functions[args[0]] (args, parts, data));
		}

		// Template mode.
		if (mode == 'template')
		{
			if (parts.length == 1)
			{
				if (parts[0].length == 1 && parts[0][0].type == 'string')
					return parts[0][0].data;

				if (parts[0].length == 1 && parts[0][0].type == 'identifier')
				{
					let name = parts[0][0].data;

					if (name in Template.functions || '_'+name in Template.functions)
						return Template.expand(parts, data, ret, 'fn');
				}
	
				return Template.expand(parts[0], data, ret, 'var');
			}

			return Template.expand(parts, data, ret, 'fn');
		}

		// Expand parts.
		if (mode == 'base-string')
		{
			let index = -1;

			for (let i of parts)
			{
				let tmp = null;
				index++;

				switch (i.type)
				{
					case 'template':
						tmp = Template.expand(i.data, data, ret, 'template');
						break;

					case 'string': case 'identifier':
						tmp = i.data;
						break;

					case 'base-string':
						tmp = Template.expand(i.data, data, ret, 'base-string');
						break;
				}

				if (ret == 'void')
					continue;

				if (ret == 'last' && index != parts.length-1)
					continue;

				s.push(tmp);
			}
		}

		// Return types for direct objects.
		if (ret == 'obj') return s;

		if (ret == 'last')
		{
			if (typeOf(s) == 'Rose\\Arry')
				s = s[0];

			return s;
		}

		// When the output is not really needed.
		if (ret == 'void') return null;

		// Return as argument ('object' if only one, or string if more than one), that is, the first item in the result.
		if (ret == 'arg')
		{
			if (Rin.typeOf(s) == 'array')
			{
				if (s.length != 1)
					return s.join('');

				return s[0];
			}

			return s;
		}

		if (ret == 'text' && Rin.typeOf(s) == 'array')
		{
			let f = (e => e != null && typeof(e) == 'object' ? ('map' in e ? e.map(f).join('') : ('join' in e ? e.join('') : e.toString())) : e);
			s = s.map(f).join('');
		}

		return s;
	},

	/**
	**	Parses the given template and returns a function that when called with an object will expand the template.
	**
	**	>> object compile (string template);
	*/
	compile: function (template)
	{
		template = Template.parse(template);

		return function (data=null, mode='text') {
			return Template.expand(template, data ? data : { }, mode);
		};
	},

	/**
	**	Parses and expands the given template immediately.
	**
	**	>> object eval (string template, object data, string mode='text');
	*/
	eval: function (template, data=null, mode='text')
	{
		template = Template.parse(template);
		return Template.expand(template, data ? data : { }, mode);
	},

	/**
	**	Expands the template as 'arg' and returns the result.
	**
	**	>> object value (string parts, object data);
	*/
	value: function (parts, data=null)
	{
		return Rin.typeOf(parts) != 'array' ? parts : Template.expand(parts, data ? data : { }, 'arg');
	},

	/**
	**	Registers an expression function.
	**
	**	>> object register (string name, function fn);
	*/
	register: function (name, fn)
	{
		Template.functions[name] = fn;
	}
};


/**
**	Template functions, functions that are used to format data. Each function takes three parameters (args, parts and data). By default the function arguments
**	are expanded and passed via 'args' for convenience, however if the function name starts with '_' the 'args' parameter will be skipped and only (parts, data)
**	will be available, each 'part' must be expanded manually by calling Template.expand.
*/

Template.functions =
{
	/**
	**	Expression functions.
	*/
	'null': function(args) { return null; },
	'true': function(args) { return true; },
	'false': function(args) { return false; },

	'len': function(args) { return args[1].toString().length; },
	'int': function(args) { return ~~args[1]; },
	'str': function(args) { return args[1].toString(); },
	'float': function(args) { return parseFloat(args[1]); },
	'chr': function(args) { return String.fromCharCode(args[1]); },
	'ord': function(args) { return args[1].toString().charCodeAt(0); },

	'not': function(args) { return !args[1]; },
	'neg': function(args) { return -args[1]; },
	'abs': function(args) { return Math.abs(args[1]); },

	'eq': function(args) { return args[1] == args[2]; },
	'ne': function(args) { return args[1] != args[2]; },
	'lt': function(args) { return args[1] < args[2]; },
	'le': function(args) { return args[1] <= args[2]; },
	'gt': function(args) { return args[1] > args[2]; },
	'ge': function(args) { return args[1] >= args[2]; },
	'and': function(args) { for (let i = 1; i < args.length; i++) if (!args[i]) return false; return true; },
	'or': function(args) { for (let i = 1; i < args.length; i++) if (~~args[i]) return true; return false; },

	'isnotnull': function(args) { return !!args[1]; },
	'isnull': function(args) { return !args[1]; },

	'*': function(args) { let x = args[1]; for (let i = 2; i < args.length; i++) x *= args[i]; return x; },
	'mul': function(args) { let x = args[1]; for (let i = 2; i < args.length; i++) x *= args[i]; return x; },
	'/': function(args) { let x = args[1]; for (let i = 2; i < args.length; i++) x /= args[i]; return x; },
	'div': function(args) { let x = args[1]; for (let i = 2; i < args.length; i++) x /= args[i]; return x; },
	'+': function(args) { let x = args[1]; for (let i = 2; i < args.length; i++) x -= -args[i]; return x; },
	'sum': function(args) { let x = args[1]; for (let i = 2; i < args.length; i++) x -= -args[i]; return x; },
	'-': function(args) { let x = args[1]; for (let i = 2; i < args.length; i++) x -= args[i]; return x; },
	'sub': function(args) { let x = args[1]; for (let i = 2; i < args.length; i++) x -= args[i]; return x; },
	'mod': function(args) { let x = args[1]; for (let i = 2; i < args.length; i++) x %= args[i]; return x; },
	'**': function(args) { let x = args[1]; for (let i = 2; i < args.length; i++) x = Math.pow(x, args[i]); return x; },
	'pow': function(args) { let x = args[1]; for (let i = 2; i < args.length; i++) x = Math.pow(x, args[i]); return x; },

	/**
	**	Returns the JSON representation of the expression.
	**
	**	json <expr>
	*/
	'json': function (args)
	{
		return JSON.stringify(args[1]);
	},

	/**
	**	Sets a variable in the data context.
	**
	**	set <var-name> <expr>
	*/
	'_set': function (parts, data)
	{
		let value = Template.value(parts[2], data);

		if (parts[1].length > 1)
		{
			let ref = Template.expand(parts[1], data, 'varref');
			if (ref != null) ref[0][ref[1]] = value;
			return '';
		}
	
		data[Template.value(parts[1], data)] = value;
		return '';
	},

	/**
	**	Returns the expression without white-space on the left or right. The expression can be a string or an array.
	**
	**	trim <expr>
	*/
	'trim': function (args)
	{
		return args[1] ? (typeof(args[1]) == "object" ? args[1].map(e => e.trim()) : args[1].trim()) : '';
	},

	/**
	**	Returns the expression in uppercase. The expression can be a string or an array.
	**
	**	upper <expr>
	*/
	'upper': function (args)
	{
		return args[1] ? (typeof(args[1]) == "object" ? args[1].map(e => e.toUpperCase()) : args[1].toUpperCase()) : '';
	},

	/**
	**	Returns the expression in lower. The expression can be a string or an array.
	**
	**	lower <expr>
	*/
	'lower': function (args)
	{
		return args[1] ? (typeof(args[1]) == "object" ? args[1].map(e => e.toLowerCase()) : args[1].toLowerCase()) : '';
	},

	/**
	**	Returns a sub-string of the given string.
	**
	**	substr <start> <count> <string>
	**	substr <start> <string>
	*/
	'substr': function (args)
	{
		let s = args[args.length-1].toString();

		let start = 0;
		let count = null;

		if (args.length == 4)
		{
			start = ~~(args[1]);
			count = ~~(args[2]);
		}
		else
		{
			start = ~~(args[1]);
			count = null;
		}

		if (start < 0) start += s.length;
		if (count < 0) count += s.length;

		if (count === null)
			count = s.length - start;

		return s.substr(start, count);
	},

	/**
	**	Replaces a matching string with the given replacement string in a given text.
	**
	**	replace <search> <replacement> <text>
	*/
	'replace': function (args)
	{
		return args[3].split(args[1]).join(args[2]);
	},

	/**
	**	Converts all new-line chars in the expression to <br/>, the expression can be a string or an array.
	**
	**	nl2br <expr>
	*/
	'nl2br': function (args)
	{
		return args[1] ? (typeof(args[1]) == "object" ? args[1].map(e => e.replace(/\n/g, "<br/>")) : args[1].replace(/\n/g, "<br/>")) : '';
	},

	/**
	**	Returns the expression inside an XML tag named 'tag-name', the expression can be a string or an array.
	**
	**	% <tag-name> <expr>
	*/
	'%': function (args)
	{
		args.shift();
		var name = args.shift();

		let s = '';

		for (let i = 0; i < args.length; i++)
		{
			if (Rin.typeOf(args[i]) == 'array')
			{
				s += `<${name}>`;
				
				for (let j = 0; j < args[i].length; j++)
					s += args[i][j];

				s += `</${name}>`;
			}
			else
				s += `<${name}>${args[i]}</${name}>`;
		}

		return s;
	},

	/**
	**	Returns the expression inside an XML tag named 'tag-name', attributes are supported.
	**
	**	%% <tag-name> [<attr> <value>]* [<content>]
	*/
	'%%': function (args)
	{
		args.shift();
		var name = args.shift();

		let attr = '';
		let text = '';

		for (let i = 0; i < args.length; i += 2)
		{
			if (i+1 < args.length)
				attr += ` ${args[i]}="${args[i+1]}"`;
			else
				text = args[i];
		}

		return text ? `<${name}${attr}>${text}</${name}>` : `<${name}${attr}/>`;
	},

	/**
	**	Joins the given array expression into a string. The provided string-expr will be used as separator.
	**
	**	join <string-expr> <array-expr>
	*/
	'join': function (args)
	{
		if (args[2] && Rin.typeOf(args[2]) == 'array')
			return args[2].join(args[1]);

		return '';
	},

	/**
	**	Splits the given expression by the specified string. Returns an array.
	**
	**	split <string-expr> <expr>
	*/
	'split': function (args)
	{
		if (args[2] && typeof(args[2]) == "string")
			return args[2].split(args[1]);

		return [];
	},

	/**
	**	Returns an array with the keys of the given object-expr.
	**
	**	keys <object-expr>
	*/
	'keys': function (args)
	{
		if (args[1] && typeof(args[1]) == "object")
			return Object.keys(args[1]);

		return [];
	},

	/**
	**	Returns an array with the values of the given object-expr.
	**
	**	values <object-expr>
	*/
	'values': function (args)
	{
		if (args[1] && typeof(args[1]) == "object")
			return Object.values(args[1]);

		return [];
	},

	/**
	**	Constructs an array obtained by expanding the given template for each of the items in the list-expr, the mandatory varname
	**	parameter (namely 'i') indicates the name of the variable that will contain the data of each item as the list-expr is
	**	traversed. Extra variables i# and i## (suffix '#' and '##') are introduced to denote the index/key and numeric index
	**	of the current item respectively, note that the later will always have a numeric value.
	**
	**	each <varname> <list-expr> <template>
	*/
	'_each': function (parts, data)
	{
		let var_name = Template.expand(parts[1], data, 'arg');
		let list = Template.expand(parts[2], data, 'arg');

		let s = [];
		let j = 0;

		if (!list) return s;

		for (let i in list)
		{
			data[var_name] = list[i];
			data[var_name + '##'] = j++;
			data[var_name + '#'] = i;

			s.push(Template.expand(parts[3], data, 'text'));
		}

		delete data[var_name];
		delete data[var_name + '##'];
		delete data[var_name + '#'];

		return s;
	},

	/**
	**	Expands the given template for each of the items in the list-expr, the mandatory varname parameter (namely 'i') indicates the name of the variable
	**	that will contain the data of each item as the list-expr is traversed. Extra variables i# and i## (suffix '#' and '##') are introduced to denote
	**	the index/key and numeric index of the current item respectively, note that the later will always have a numeric value.
	**
	**	Does not produce any output (returns null).
	**
	**	foreach <varname> <list-expr> <template>
	*/
	'_foreach': function (parts, data)
	{
		let var_name = Template.expand(parts[1], data, 'arg');
		let list = Template.expand(parts[2], data, 'arg');

		let j = 0;

		if (!list) return null;

		for (let i in list)
		{
			data[var_name] = list[i];
			data[var_name + '##'] = j++;
			data[var_name + '#'] = i;

			Template.expand(parts[3], data, 'text');
		}

		delete data[var_name];
		delete data[var_name + '##'];
		delete data[var_name + '#'];

		return null;
	},

	/**
	**	Returns the valueA if the expression is true otherwise valueB, this is a short version of the 'if' function with the
	**	difference that the result is 'obj' instead of text.
	**
	**	? <expr> <valueA> [<valueB>]
	*/
	'_?': function (parts, data)
	{
		if (Template.expand(parts[1], data, 'arg'))
			return Template.expand(parts[2], data, 'arg');

		if (parts.length > 3)
			return Template.expand(parts[3], data, 'arg');

		return '';
	},

	/**
	**	Returns the valueA if it is not null (or empty or zero), otherwise returns valueB.
	**
	**	?? <valueA> <valueB>
	*/
	'_??': function (parts, data)
	{
		let value = Template.expand(parts[1], data, 'arg');
		if (value) return value;
	
		return Template.expand(parts[2], data, 'arg');
	},

	/**
	**	Returns the value if the expression is true, supports 'elif' and 'else' as well. The result of this function is always text.
	**
	**	if <expr> <value> [elif <expr> <value>] [else <value>]
	*/
	'_if': function (parts, data)
	{
		for (let i = 0; i < parts.length; i += 3)
		{
			if (Template.expand(parts[i], data, 'arg') == 'else')
				return Template.expand(parts[i+1], data, 'text');

			if (Template.expand(parts[i+1], data, 'arg'))
				return Template.expand(parts[i+2], data, 'text');
		}

		return '';
	},

	/**
	**	Loads the expression value and attempts to match one case.
	**
	**	switch <expr> <case1> <value1> ... <caseN> <valueN> default <defvalue> 
	*/
	'_switch': function (parts, data)
	{
		let value = Template.expand(parts[1], data, 'arg');

		for (let i = 2; i < parts.length; i += 2)
		{
			let case_value = Template.expand(parts[i], data, 'arg');
			if (case_value == value || case_value == 'default')
				return Template.expand(parts[i+1], data, 'text');
		}

		return '';
	},

	/**
	**	Exits the current inner most loop.
	**
	**	break
	*/
	'_break': function (parts, data)
	{
		throw new Error('EXC_BREAK');
	},

	/**
	**	Skips execution and continues the next cycle of the current inner most loop.
	**
	**	continue
	*/
	'_continue': function (parts, data)
	{
		throw new Error('EXC_CONTINUE');
	},

	/**
	**	Constructs an array with the results of repeating the specified template for a number of times.
	**
	**	repeat <varname:i> [from <number>] [to <number>] [count <number>] [step <number>] <template>
	*/
	'_repeat': function (parts, data)
	{
		if (parts.length < 3 || (parts.length & 1) != 1)
			return '(`repeat`: Wrong number of parameters)';

		let var_name = Template.value(parts[1], data);
		let count = null;
		let from = 0, to = null;
		let step = null;

		for (let i = 2; i < parts.length-1; i+=2)
		{
			let value = Template.value(parts[i], data);

			switch (value.toLowerCase())
			{
				case 'from':
					from = parseFloat(Template.value(parts[i+1], data));
					break;

				case 'to':
					to = parseFloat(Template.value(parts[i+1], data));
					break;

				case 'count':
					count = parseFloat(Template.value(parts[i+1], data));
					break;

				case 'step':
					step = parseFloat(Template.value(parts[i+1], data));
					break;
			}
		}

		let tpl = parts[parts.length-1];
		let arr = [];

		if (to !== null)
		{
			if (step === null)
				step = from > to ? -1 : 1;

			if (step < 0)
			{
				for (let i = from; i >= to; i += step)
				{
					try {
						data[var_name] = i;
						arr.push(Template.value(tpl, data));
					} catch (e) {
						let name = e.message;
						if (name == 'EXC_BREAK') break;
						if (name == 'EXC_CONTINUE') continue;
						throw e;
					}
				}
			}
			else
			{
				for (let i = from; i <= to; i += step)
				{
					try {
						data[var_name] = i;
						arr.push(Template.value(tpl, data));
					} catch (e) {
						let name = e.message;
						if (name == 'EXC_BREAK') break;
						if (name == 'EXC_CONTINUE') continue;
						throw e;
					}
				}
			}
		}
		else if (count !== null)
		{
			if (step === null)
				step = 1;

			for (let i = from; count > 0; count--, i += step)
			{
				try {
					data[var_name] = i;
					arr.push(Template.value(tpl, data));
				} catch (e) {
					let name = e.message;
					if (name == 'EXC_BREAK') break;
					if (name == 'EXC_CONTINUE') continue;
					throw e;
				}
			}
		}

		delete data[var_name];
		return arr;
	},

	/**
	**	Repeats the specified template for a number of times.
	**
	**	for <varname:i> [from <number>] [to <number>] [count <number>] [step <number>] <template>
	*/
	'_for': function (parts, data)
	{
		if (parts.length < 3 || (parts.length & 1) != 1)
			return '(`for`: Wrong number of parameters)';

		let var_name = Template.value(parts[1], data);
		let count = null;
		let from = 0; to = null;
		let step = null;

		for (let i = 2; i < parts.length-1; i+=2)
		{
			value = Template.value(parts[i], data);

			switch (value.toLowerCase())
			{
				case 'from':
					from = parseFloat(Template.value(parts[i+1], data));
					break;

				case 'to':
					to = parseFloat(Template.value(parts[i+1], data));
					break;

				case 'count':
					count = parseFloat(Template.value(parts[i+1], data));
					break;

				case 'step':
					step = parseFloat(Template.value(parts[i+1], data));
					break;
			}
		}

		let tpl = parts[parts.length-1];

		if (to !== null)
		{
			if (step === null)
				step = from > to ? -1 : 1;

			if (step < 0)
			{
				for (let i = from; i >= to; i += step)
				{
					try {
						data[var_name] = i;
						Template.value(tpl, data);
					} catch (e) {
						let name = e.message;
						if (name == 'EXC_BREAK') break;
						if (name == 'EXC_CONTINUE') continue;
						throw e;
					}
				}
			}
			else
			{
				for (let i = from; i <= to; i += step)
				{
					try {
						data[var_name] = i;
						Template.value(tpl, data);
					} catch (e) {
						let name = e.message;
						if (name == 'EXC_BREAK') break;
						if (name == 'EXC_CONTINUE') continue;
						throw e;
					}
				}
			}
		}
		else if (count !== null)
		{
			if (step === null)
				step = 1;

			for (let i = from; count > 0; count--, i += step)
			{
				try {
					data[var_name] = i;
					Template.value(tpl, data);
				} catch (e) {
					let name = e.message;
					if (name == 'EXC_BREAK') break;
					if (name == 'EXC_CONTINUE') continue;
					throw e;
				}
			}
		}

		delete data[var_name];
		return null;
	},

	/**
	**	Writes the specified arguments to the console.
	**
	**	echo <expr> [<expr>...]
	*/
	'_echo': function (parts, data)
	{
		let s = '';

		for (let i = 1; i < parts.length; i++)
			s += Template.expand(parts[i], data, 'arg');

		console.log(s);
		return '';
	},

	/**
	**	Constructs a list from the given arguments and returns it.
	**
	**	# <expr> [<expr>...]
	*/
	'_#': function (parts, data)
	{
		let s = [];

		for (let i = 1; i < parts.length; i++)
			s.push(Template.expand(parts[i], data, 'arg'));

		return s;
	},

	/**
	**	Constructs a non-expanded list from the given arguments and returns it.
	**
	**	## <expr> [<expr>...]
	*/
	'_##': function (parts, data)
	{
		let s = [];

		for (let i = 1; i < parts.length; i++)
			s.push(parts[i]);

		return s;
	},

	/**
	**	Constructs an associative array (dictionary) and returns it.
	**
	**	& <name>: <expr> [<name>: <expr>...]
	*/
	'_&': function (parts, data)
	{
		let s = { };

		for (let i = 1; i < parts.length; i += 2)
		{
			let key = Template.expand(parts[i], data, 'arg');
			if (key.substr(-1) == ':')
				key = key.substr(0, key.length-1);

			s[key] = Template.expand(parts[i+1], data, 'arg');
		}

		return s;
	},

	/**
	**	Constructs a non-expanded associative array (dictionary) and returns it.
	**
	**	&& <name>: <expr> [<name>: <expr>...]
	*/
	'_&&': function (parts, data)
	{
		let s = { };

		for (let i = 1; i < parts.length; i += 2)
		{
			let key = Template.expand(parts[i], data, 'arg');
			if (key.substr(-1) == ':')
				key = key.substr(0, key.length-1);

			s[key] = parts[i+1];
		}

		return s;
	},

	/**
	**	Returns true if the specified map contains all the specified keys. If it fails the global variable `err` will contain an error message.
	**
	**	contains <expr> <name> [<name>...]
	*/
	'contains': function (args, parts, data)
	{
		let value = args[1];

		if (typeof(value) != 'object')
		{
			data.err = 'Argument is not a Map';
			return false;
		}

		let s = '';

		for (let i = 2; i < args.length; i++)
		{
			if (!(args[i] in value))
				s += ', '+args[i];
		}

		if (s != '')
		{
			data.err = s.substr(1);
			return false;
		}

		return true;
	},

	/**
	**	Returns true if the specified map has the specified key. Returns boolean.
	**
	**	has <name> <expr>
	*/
	'has': function (args, parts, data)
	{
		let value = args[2];

		if (Rin.typeOf(value) != 'object')
			return false;

		return args[1] in value;
	},

	/**
	**	Returns a new array/map contaning the transformed values of the array/map (evaluating the template). And just as in 'each', the i# and i## variables be available.
	**
	**	map <varname> <list-expr> <template>
	*/
	'_map': function (parts, data)
	{
		let var_name = Template.expand(parts[1], data, 'arg');

		let list = Template.expand(parts[2], data, 'arg');
		if (!list) return list;

		let arrayMode = Rin.typeOf(list) == 'array' ? true : false;
		let output = arrayMode ? [] : {};
		let j = 0;

		for (let i in list)
		{
			data[var_name] = list[i];
			data[var_name + '##'] = j++;
			data[var_name + '#'] = i;

			if (arrayMode)
				output.push(Template.expand(parts[3], data, 'arg'));
			else
				output[i] = Template.expand(parts[3], data, 'arg');
		}

		delete data[var_name];
		delete data[var_name + '##'];
		delete data[var_name + '#'];

		return output;
	},

	/**
	**	Returns a new array/map contaning the elements where the template evaluates to non-zero. Just as in 'each', the i# and i## variables be available.
	**
	**	filter <varname> <list-expr> <template>
	*/
	'_filter': function (parts, data)
	{
		let var_name = Template.expand(parts[1], data, 'arg');

		let list = Template.expand(parts[2], data, 'arg');
		if (!list) return list;

		let arrayMode = Rin.typeOf(list) == 'array' ? true : false;
		let output = arrayMode ? [] : {};
		let j = 0;

		for (let i in list)
		{
			data[var_name] = list[i];
			data[var_name + '##'] = j++;
			data[var_name + '#'] = i;

			if (~~Template.expand(parts[3], data, 'arg'))
			{
				if (arrayMode)
					output.push(list[i]);
				else
					output[i] = list[i];
			}
		}

		delete data[var_name];
		delete data[var_name + '##'];
		delete data[var_name + '#'];

		return output;
	},

	/**
	**	Expands the specified template string with the given data. The sym_open and sym_close will be '{' and '}' respectively.
	**	If no data is provided, current data parameter will be used.
	**
	**	expand <template> <data>
	*/
	'expand': function (args, parts, data)
	{
		return Template.expand (Template.parseTemplate (args[1], '{', '}'), args.length == 3 ? args[2] : data);
	},

	/**
	**	Calls a function described by the given parameter.
	**
	**	call <function> <args...>
	*/
	'_call': function (parts, data)
	{
		let ref = Template.expand(parts[1], data, 'varref');

		if (!ref || typeof(ref[0][ref[1]]) != 'function')
			throw new Error ('Expression is not a function: ' + Template.expand(parts[1], data, 'obj').map(i => i == null ? '.' : i).join(''));

		let args = [];

		for (let i = 2; i < parts.length; i++)
			args.push(Template.value(parts[i], data));

		return ref[0][ref[1]] (...args);
	},
};
