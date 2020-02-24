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

/**
**	Templating module. The template formats available are shown below, note that the sym-open and sym-close symbols are by
**	default the square brackets, however those can be modified since are just parameters.
**
**	HTML Escaped Output:			[data.value]					Escapes HTML characters from the output.
**	Raw Output:						[!data.value]					Does not escape HTML characters from the output (used to output direct HTML).
**	Double-Quoted Escaped Output:	[$data.value]					Escapes HTML characters and surrounds with double quotes.
**	Immediate Reparse:				[<....] OR [@....]				Reparses the contents as if parseTemplate() was called again.
**	Immediate Output:				[:...]							Takes the contents and outputs exactly as-is without format and optionally surrounded by the
**																	sym-open and sym-close symbols when the first character is not '<', sym_open or space.
**	Filtered Output:				[filterName ... <expr> ...]		Runs a filter call, 'expr' can be any of the allowed formats shown here (nested if desired),
**																	filterName should map to one of the available filter functions in the Rin.Template.filters map,
**																	each of which have their own parameters.
*/

let Template = module.exports =
{
	/**
	**	Parses a template and returns the compiled 'parts' structure to be used by the 'expand' method.
	**
	**	>> array parseTemplate (string template, char sym_open, char sym_close, bool is_tpl=false);
	*/
	parseTemplate: function (template, sym_open, sym_close, is_tpl)
	{
		let nflush = 'string', flush = null, state = 0, count = 0;
		let str = '', nstr = '';
		let parts = [], mparts = parts, nparts = false;
	
		if (is_tpl === true)
		{
			template = template.trim();
			state = 2;
	
			mparts.push(parts = []);
		}
	
		template += "\0";
	
		for (let i = 0; i < template.length; i++)
		{
			switch (state)
			{
				case 0:
					if (template[i] == '\0')
					{
						flush = 'string';
					}
					else if (template[i] == sym_open && template[i+1] == '<')
					{
						state = count = 1;
						flush = 'string';
						nflush = 'parse-string-and-merge';
					}
					else if (template[i] == sym_open && template[i+1] == '@')
					{
						state = count = 1;
						flush = 'string';
						nflush = 'parse-string-and-merge';
						i++;
					}
					else if (template[i] == sym_open && template[i+1] == ':')
					{
						state = 4; count = 1;
						flush = 'string';
						nflush = 'string';
						i++;
					}
					else if (template[i] == sym_open)
					{
						state = count = 1;
						flush = 'string';
						nflush = 'parse-template';
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
	
				case 2:
					if (template[i] == '\0')
					{
						flush = nflush;
						break;
					}
					else if (template[i] == '.')
					{
						flush = nflush;
						nflush = 'string';
						break;
					}
					else if (template[i].match(/[\t\n\r\f\v ]/) != null)
					{
						flush = nflush;
						nflush = 'string';
						nparts = true;
	
						while (template[i].match(/[\t\n\r\f\v ]/) != null) i++;
						i--;
	
						break;
					}
					else if (template[i] == sym_open && template[i+1] == '<')
					{
						if (str) flush = nflush;
						state = 3; count = 1; nflush = 'parse-string-and-merge';
						break;
					}
					else if (template[i] == sym_open && template[i+1] == '@')
					{
						if (str) flush = nflush;
						state = 3; count = 1; nflush = 'parse-string-and-merge';
						i++;
						break;
					}
					else if (template[i] == sym_open && template[i+1] == ':')
					{
						if (str) flush = nflush;
						state = 5; count = 1; nflush = 'string';
						i++;
						break;
					}
					else if (template[i] == sym_open)
					{
						if (str)
						{
							flush = nflush;
							nstr = template[i];
						}
	
						state = 3; count = 1; nflush = 'parse-string';
	
						if (str) break;
					}
	
					str += template[i];
					break;
	
				case 3:
					if (template[i] == '\0')
						throw new Error ("Parse error: Unexpected end of template");
	
					if (template[i] == sym_close)
					{
						count--;
	
						if (count < 0)
							throw new Error ("Parse error: Unmatched " + sym_close);

						if (count == 0)
						{
							state = 2;
	
							if (nflush == 'parse-string-and-merge')
								break;
						}
					}
					else if (template[i] == sym_open)
					{
						count++;
					}
	
					str += template[i];
					break;

				case 4:
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

				case 5:
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

							state = 2;
							break;
						}
					}
					else if (template[i] == sym_open)
					{
						count++;
					}
	
					str += template[i];
					break;
			}
	
			if (flush != null)
			{
				if (flush == 'parse-template')
				{
					str = Template.parseTemplate (str, sym_open, sym_close, true);
				}
				else if (flush == 'parse-string')
				{
					str = Template.parseTemplate (str, sym_open, sym_close, false);
					str = str[0];
				}
				else if (flush == 'parse-string-and-merge')
				{
					str = Template.parseTemplate (str, sym_open, sym_close, false);
				}
	
				if (typeof(str) != 'string' || str.length != 0)
				{
					if (flush == 'parse-string-and-merge')
					{
						for (let i = 0; i < str.length; i++)
							parts.push(str[i]);
					}
					else
						parts.push(str);
				}
	
				if (nparts)
				{
					mparts.push(parts = []);
					nparts = false;
				}
	
				flush = null;
				str = nstr;
				nstr = '';
			}
		}
	
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
	**	Expands a template using the given data object, mode can be set to 'text' or 'obj' allowing to expand the template as
	**	a string (text) or an array of objects (obj) respectively. If none provided it will be expanded as text.
	**
	**	>> string/array expand (array parts, object data, string mode='text');
	*/
	expand: function (parts, data, mode)
	{
		// Expand variable parts.
		if (mode == 'var')
		{
			parts = Template.expand(parts, data, 'obj');

			if (parts[0] == 'nl')
				return '\n';

			let escape = true;
			let quote = false;

			while (true)
			{
				if (parts[0][0] == '$')
				{
					parts[0] = parts[0].substr(1);
					quote = true;
				}
				else if (parts[0][0] == '!')
				{
					parts[0] = parts[0].substr(1);
					escape = false;
				}
				else
					break;
			}

			let i = 0;

			if (parts[i] == 'this')
				i++;

			for (; i < parts.length && data != null; i++)
			{
				if (parts[i] in data)
					data = data[parts[i]];
				else
					data = null;
			}

			if (typeof(data) == 'string')
			{
				if (escape)
					data = data.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

				if (quote)
					data = '"' + data + '"';
			}

			return data;
		}
	
		// Expand function parts.
		if (mode == 'fn')
		{
			var args = [];

			args.push(Template.expand(parts[0], data, 'arg'));

			if ('_'+args[0] in Template.filters)
				args[0] = '_'+args[0];

			if (!(args[0] in Template.filters))
				return `(Unknown: ${args[0]})`;

			if (args[0][0] == '_')
				return Template.filters[args[0]] (parts, data);

			for (let i = 1; i < parts.length; i++)
				args.push(Template.expand(parts[i], data, 'arg'));

			return Template.filters[args[0]] (args, parts, data);
		}
	
		// Expand template parts.
		if (mode == 'tpl')
		{
			if (parts.length == 1)
				return Template.expand(parts[0], data, 'var');
	
			return Template.expand(parts, data, 'fn');
		}
	
		// Expand string parts.
		let s = [];
	
		for (let i = 0; i < parts.length; i++)
		{
			if (typeof(parts[i]) != 'string')
				s.push(Template.expand(parts[i], data, 'tpl'));
			else
				s.push(parts[i]);
		}
	
		// Return as argument ('object' if only one, or string if more than one), that is, the first item in the result.
		if (mode == 'arg')
		{
			if (s.length != 1)
				return s.join('');
	
			return s[0];
		}
	
		if (mode != 'obj') /* AKA if (mode == 'text') */
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

		return function (data, mode) {
			return Template.expand(template, data, mode);
		};
	}
};


/**
**	Template filters, functions that are used to format data. Each function takes three parameters (args, parts and data). By default the filter arguments
**	are expanded and passed via 'args' for convenience, however if the filter name starts with '_' the 'args' parameter will be skipped and only (parts, data)
**	will be available, each 'part' must be expanded manually by calling Template.expand.
*/

Template.filters =
{
	/**
	**	Expression filters.
	*/
	'not': function(args) { return !args[1]; },
	'notnull': function(args) { return !!args[1]; },
	'int': function(args) { return ~~args[1]; },
	'eq': function(args) { return args[1] == args[2]; },
	'ne': function(args) { return args[1] != args[2]; },
	'lt': function(args) { return args[1] < args[2]; },
	'le': function(args) { return args[1] <= args[2]; },
	'gt': function(args) { return args[1] > args[2]; },
	'ge': function(args) { return args[1] >= args[2]; },
	'and': function(args) { for (let i = 1; i < args.length; i++) if (!args[i]) return false; return true; },
	'or': function(args) { for (let i = 1; i < args.length; i++) if (~~args[i]) return true; return false; },

	/**
	**	Returns the JSON representation of the expression.
	**
	**	json <expr>
	*/
	'json': function(args)
	{
		return JSON.stringify(args[1], null, 4);
	},

	/**
	**	Sets a variable in the data context.
	**
	**	set <var-name> <expr>
	*/
	'set': function(args, parts, data)
	{
		data[args[1]] = args[2];
		return '';
	},

	/**
	**	Returns the expression without white-space on the left or right. The expression can be a string or an array.
	**
	**	trim <expr>
	*/
	'trim': function(args)
	{
		return args[1] ? (typeof(args[1]) == "object" ? args[1].map(e => e.trim()) : args[1].trim()) : '';
	},

	/**
	**	Returns the expression in uppercase. The expression can be a string or an array.
	**
	**	upper <expr>
	*/
	'upper': function(args)
	{
		return args[1] ? (typeof(args[1]) == "object" ? args[1].map(e => e.toUpperCase()) : args[1].toUpperCase()) : '';
	},

	/**
	**	Returns the expression in lower. The expression can be a string or an array.
	**
	**	lower <expr>
	*/
	'lower': function(args)
	{
		return args[1] ? (typeof(args[1]) == "object" ? args[1].map(e => e.toLowerCase()) : args[1].toLowerCase()) : '';
	},

	/**
	**	Converts all new-line chars in the expression to <br/>, the expression can be a string or an array.
	**
	**	nl2br <expr>
	*/
	'nl2br': function(args)
	{
		return args[1] ? (typeof(args[1]) == "object" ? args[1].map(e => e.replace(/\n/g, "<br/>")) : args[1].replace(/\n/g, "<br/>")) : '';
	},

	/**
	**	Returns the expression inside an XML tag named 'tag-name', the expression can be a string or an array.
	**
	**	% <tag-name> <expr>
	*/
	'%': function(args)
	{
		args.shift();
		var name = args.shift();

		let s = '';

		for (let i = 0; i < args.length; i++)
		{
			if (typeof(args[i]) != 'string')
			{
				for (let j = 0; j < args[i].length; j++)
					s += `<${name}>${args[i][j]}</${name}>`;
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
	'%%': function(args)
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
	'join': function(args)
	{
		if (args[2] && typeof(args[2]) == "object" && "join" in args[2])
			return args[2].join(args[1]);

		return '';
	},

	/**
	**	Splits the given expression by the specified string. Returns an array.
	**
	**	split <string-expr> <expr>
	*/
	'split': function(args)
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
	'keys': function(args)
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
	'values': function(args)
	{
		if (args[1] && typeof(args[1]) == "object")
			return Object.values(args[1]);

		return [];
	},

	/**
	**	Constructs an array obtained by expanding the given template for each of the items in the list-expr, the optional varname
	**	parameter (defaults to 'i') indicates the name of the variable that will contain the data of each item as the list-expr is
	**	traversed, also the default variable i# (suffix '#') is introduced to denote the index/key of the current item.
	**
	**	each <list-expr> [<varname:i>] <template>
	*/
	'each': function(args, parts, data)
	{
		let var_name = 'i';
		let list = args[1];

		let k = 2;

		if (args[k] && args[k].match(/^[A-Za-z0-9_-]+$/) != null)
			var_name = args[k++];

		let s = [];

		for (let i in list)
		{
			data[var_name] = list[i];
			data[var_name + '#'] = i;

			for (let j = k; j < parts.length; j++)
				s.push(Template.expand(parts[j], data, 'obj'));
		}

		delete data[var_name];
		delete data[var_name + '#'];

		return s;
	},

	/**
	**	Returns the valueA if the expression is true otherwise valueB, this is a short version of the 'if' filter with the
	**	difference that the result is 'obj' instead of text.
	**
	**	? <expr> <valueA> [<valueB>]
	*/
	'_?': function(parts, data)
	{
		if (Template.expand(parts[1], data, 'arg'))
			return Template.expand(parts[2], data, 'arg');

		if (parts.length > 3)
			return Template.expand(parts[3], data, 'arg');

		return '';
	},

	/**
	**	Returns the value if the expression is true, supports 'elif' and 'else' as well. The result of this filter is always text.
	**
	**	if <expr> <value> [elif <expr> <value>] [else <value>]
	*/
	'_if': function(parts, data)
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
	'_switch': function(parts, data)
	{
		let value = Template.expand(parts[1], data, 'arg');

		for (let i = 2; i < parts.length; i += 2)
		{
			let case_value = Template.expand(parts[i], data, 'arg');
			if (case_value == value || case_value == 'default')
				return Template.expand(parts[i+1], data, 'arg');
		}

		return '';
	},

	/**
	**	Repeats the specified template for a number of times.
	**
	**	repeat <count> [<varname:i>] <template>
	*/
	'repeat': function(args, parts, data)
	{
		let var_name = 'i';
		let count = ~~(args[1]);

		let k = 2;

		if (args[k] && args[k].match(/^[A-Za-z0-9_-]+$/) != null)
			var_name = args[k++];

		let s = [];

		for (let i = 0; i < count; i++)
		{
			data[var_name] = i;

			for (let j = k; j < parts.length; j++)
				s.push(Template.expand(parts[j], data, 'obj'));
		}

		delete data[var_name];

		return s;
	}
};
