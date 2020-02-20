/*
**	rin/schema
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
**	The utility functions in this module allow to create a very strict serialization/deserialization schema
**	to ensure that all values are of the specific type when stored in string format.
*/

let Schema = module.exports =
{
	Type: function (proto)
    {
		var tmp =
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

	Numeric: function (precision)
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
                    context.strings_map = { };
                    context.strings = [ ];
                }

                if (!(value in context.strings_map))
                {
                    context.strings.push(value);
                    context.strings_map[value] = context.strings.length;
                }

                return context.strings_map[value];
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

            of: function (type) {
                this.itemType = type;
                return this;
            },

			flatten: function (value, context)
			{
				if (value == null) return null;

                var o = [ ];
                
                for (var i = 0; i < value.length; i++)
                    o.push(this.itemType.flatten(value[i], context));

                return o;
            },

			unflatten: function (value, context)
			{
				if (value == null) return null;

                var o = [ ];

                for (var i = 0; i < value.length; i++)
                    o.push(this.itemType.unflatten(value[i], context));

                return o;
            }
        });
    },

    Object: function()
    {
        return Schema.Type({

            properties: [ ],

            property: function (name, type)
            {
                this.properties.push({ name: name, type: type });
                return this;
            },

            flatten: function (value, context)
            {
				if (value == null) return null;

				if (context.symbolic === true)
				{
					var o = { };

					for (var i = 0; i < this.properties.length; i++)
					{
						o[this.properties[i].name] = this.properties[i].type.flatten(value[this.properties[i].name], context);
					}
				}
				else
				{
					var o = [ ];

					for (var i = 0; i < this.properties.length; i++)
					{
						o.push(this.properties[i].type.flatten(value[this.properties[i].name], context));
					}
				}

                return o;
            },
            
            unflatten: function (value, context)
            {
				if (value == null) return null;

				var o = { };

				if (context.symbolic === true)
				{
					for (var i = 0; i < this.properties.length; i++)
					{
						o[this.properties[i].name] = this.properties[i].type.unflatten(value[this.properties[i].name], context);
					}
				}
				else
				{
				
					for (var i = 0; i < this.properties.length; i++)
					{
						o[this.properties[i].name] = this.properties[i].type.unflatten(value[i], context);
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

            unflatten: function (value, context)
            {
				return value == null ? null : (new this._constructor()).unflatten(value, context);
            }
        });
    }
};
