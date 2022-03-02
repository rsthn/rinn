/*
**	rin/schema
**
**	Copyright (c) 2013-2020, RedStar Technologies, All rights reserved.
**	https://rsthn.com/
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

import Rin from './alpha.js';

/**
**	The utility functions in this module allow to create a very strict serialization/deserialization schema
**	to ensure that all values are of the specific type when stored in string format.
*/

let Schema =
{
	Type: function (proto)
    {
		let tmp =
		{
            flatten: function (value, context) {
                return value;
            },

            unflatten: function (value, context) {
                return value;
            }
        };

        return proto ? Rin.override(tmp, proto) : tmp;
    },

	String: function()
	{
		return Schema.Type
		({
			flatten: function (value, context) {
				return value != null ? value.toString() : null;
			},

			unflatten: function (value, context) {
				return value != null ? value.toString() : null;
			}
		});
	},

	Integer: function()
	{
		return Schema.Type
		({
			flatten: function (value, context) {
				return ~~value;
			},

			unflatten: function (value, context) {
				return ~~value;
			}
		});
	},

	Number: function (precision)
	{
		return Schema.Type
		({
			_precision: precision,
			_round: false,

			precision: function (value)
			{
				this._precision = ~~value;
				return this;
			},

			flatten: function (value, context)
			{
				value = parseFloat(value);

				if (this._precision > 0)
					value = (~~(value*Math.pow(10, this._precision))) / Math.pow(10, this._precision);

				return value;
			},

			unflatten: function (value, context) {
				return parseFloat(value);
			}
		});
	},

	Bool: function (compact)
	{
		return Schema.Type
		({
			_compact: compact,

			compact: function(value)
			{
				this._compact = value;
				return this;
			},

			flatten: function (value, context) {
				value = ~~value;
				return this._compact ? (value > 0 ? 1 : 0) : (value > 0 ? true : false);
			},

			unflatten: function (value, context) {
				return (~~value) ? true : false;
			}
		});
	},

	SharedString: function()
	{
		return Schema.Type
		({
			flatten: function (value, context)
			{
				if (value == null) return 0;

				value = value.toString();

                if (!("strings" in context))
                {
                    context.index = { };
                    context.strings = [ ];
                }

                if (!(value in context.index))
                {
                    context.strings.push(value);
                    context.index[value] = context.strings.length;
                }

                return context.index[value];
            },

			unflatten: function (value, context)
			{
                return value == null || value == 0 ? null : context.strings[~~value - 1];
            }
        });
    },

	Array: function (type)
    {
        return Schema.Type({

			itemType: type,
			_debug: false,
			_filter: null,

			debug: function(v) {
				this._debug = v;
				return this;
			},

            of: function (type) {
                this.itemType = type;
                return this;
            },

			filter: function (callback) {
				this._filter = callback;
				return this;
			},

			flatten: function (value, context)
			{
				if (value == null) return null;

                let o = [ ];

                for (let i = 0; i < value.length; i++)
				{
					if (this._filter && !this._filter(value[i], i))
						continue;

                    o.push(this.itemType.flatten(value[i], context));
				}

                return o;
            },

			unflatten: async function (value, context)
			{
				if (value == null) return null;

                let o = [ ];

				for (let i = 0; i < value.length; i++)
				{
					o.push(await this.itemType.unflatten(value[i], context));
				}

                return o;
            }
        });
    },

    Object: function()
    {
        return Schema.Type({

            properties: [ ],

            property: function (name, type, defvalue=null)
            {
                this.properties.push({ name: name, type: type, defvalue: defvalue });
                return this;
            },

            flatten: function (value, context)
            {
				if (value == null) return null;

				let o;

				if (context.symbolic === true)
				{
					o = { };

					for (let i = 0; i < this.properties.length; i++)
					{
						if (this.properties[i].name in value)
							o[this.properties[i].name] = this.properties[i].type.flatten(value[this.properties[i].name], context);
						else
							o[this.properties[i].name] = this.properties[i].type.flatten(this.properties[i].defvalue, context);
					}
				}
				else
				{
					o = [ ];

					for (let i = 0; i < this.properties.length; i++)
					{
						if (this.properties[i].name in value)
							o.push(this.properties[i].type.flatten(value[this.properties[i].name], context));
						else
							o.push(this.properties[i].type.flatten(this.properties[i].defvalue, context));
					}
				}

                return o;
            },
            
            unflatten: async function (value, context)
            {
				if (value == null) return null;

				let o = { };

				if (context.symbolic === true)
				{
					for (let i = 0; i < this.properties.length; i++)
					{
						o[this.properties[i].name] = await this.properties[i].type.unflatten(this.properties[i].name in value ? value[this.properties[i].name] : this.properties[i].defvalue, context);
					}
				}
				else
				{
				
					for (let i = 0; i < this.properties.length; i++)
					{
						o[this.properties[i].name] = await this.properties[i].type.unflatten(i in value ? value[i] : this.properties[i].defvalue, context);
					}
				}

                return o;
            }
        });
	},

    Class: function (classConstructor)
    {
		return Schema.Type
		({
            _constructor: classConstructor,

            constructor: function (classConstructor)
            {
                this._constructor = classConstructor;
                return this;
            },

            flatten: function (value, context)
            {
                return value == null ? null : value.flatten(context);
            },

            unflatten: async function (value, context)
            {
				return value == null ? null : await (new this._constructor()).unflatten(value, context);
            }
        });
	},

	/*
	**	Used when you want to specify just a single property.
	*/
    Property: function(name, type)
    {
        return Schema.Type({

			property: name,
			type: type,

			name: function (name)
			{
				this.property = name;
				return this;
			},

			is: function (type)
			{
				this.type = type;
				return this;
			},

            flatten: function (value, context)
            {
				if (value == null) return null;

				let o;

				if (context.symbolic === true)
				{
					o = { };
					o[this.property] = this.type.flatten(value[this.property], context);
				}
				else
				{
					o = this.type.flatten(value[this.property], context);
				}

                return o;
            },

            unflatten: async function (value, context)
            {
				if (value == null) return null;

				let o = { };

				if (context.symbolic === true)
					o[this.property] = await this.type.unflatten(value[this.property], context);
				else
					o[this.property] = await this.type.unflatten(value, context);

                return o;
            }
        });
	},

    Map: function()
    {
        return Schema.Type({

            flatten: function (value, context)
            {
				if (value == null) return null;

				if (context.symbolic === true)
					return value;

				let o = [ ];

				for (let i in value)
				{
					o.push(i);
					o.push(value[i]);
				}

                return o;
            },

            unflatten: function (value, context)
            {
				if (value == null) return null;

				if (context.symbolic === true)
					return value;

				let o = { };

				for (let i = 0; i < value.length; i += 2)
					o[value[i]] = value[i+1];

                return o;
            }
        });
	},

    Selector: function ()
    {
        return Schema.Type({

			conditions: [],
			value: null,

			when: function (value, type)
			{
				this.conditions.push([ (val) => val === value, type ]);
				return this;
			},

			with: function (value)
			{
				this.value = value;
				return this;
			},

            flatten: function (value, context)
            {
				if (value == null) return null;

				for (let i of this.conditions)
				{
					if (i[0](this.value) === true)
						return i[1].flatten(value, context);
				}

                return null;
            },

            unflatten: async function (value, context)
            {
				if (value == null) return null;

				for (let i of this.conditions)
				{
					if (i[0](this.value) === true)
						return await i[1].unflatten(value, context);
				}

                return null;
            }

        });
	}
};

export default Schema;
