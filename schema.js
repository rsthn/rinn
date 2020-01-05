/*
**	rin/schema
**
**	Copyright (c) 2013-2020, RedStar Technologies, All rights reserved.
**	https://www.redstar-technologies.com/
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

let _Schema = module.exports =
{
	Type: function (data)
    {
		var o =
		{
            flatten: function (value, context) {
                return value;
            },

            unflatten: function (value, context) {
                return value;
            }
        };

        return data ? Rin.override(o, data) : o;
    },

	String: function()
	{
		return _Schema.Type({
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
		return _Schema.Type({
			flatten: function (value, context) {
				return ~~value;
			},

			unflatten: function (value, context) {
				return ~~value;
			}
		});
	},

	Numeric: function()
	{
		return _Schema.Type({
			flatten: function (value, context) {
				return parseFloat(value);
			},

			unflatten: function (value, context) {
				return parseFloat(value);
			}
		});
	},

	Bool: function()
	{
		return _Schema.Type({
			flatten: function (value, context) {
				return (~~value) ? true : false;
			},

			unflatten: function (value, context) {
				return (~~value) ? true : false;
			}
		});
	},

	SharedString: function()
	{
		return _Schema.Type
		({
			flatten: function (value, context)
			{
				if (value == null) return null;

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
                return value == null ? null : context.strings[~~value - 1];
            }
        });
    },

	Array: function()
    {
        return _Schema.Type({

            contains: null,

            of: function (type) {
                this.contains = type;
                return this;
            },

			flatten: function (value, context)
			{
				if (value == null) return null;

                var o = [ ];
                
                for (var i = 0; i < value.length; i++)
                    o.push(this.contains.flatten(value[i], context));

                return o;
            },
            
			unflatten: function (value, context)
			{
				if (value == null) return null;

                var o = [ ];

                for (var i = 0; i < value.length; i++)
                    o.push(this.contains.unflatten(value[i], context));

                return o;
            }
        });
    },

    Object: function()
    {
        return _Schema.Type({

            properties: [ ],

            property: function (name, type)
            {
                this.properties.push({ name: name, type: type });
                return this;
            },

            flatten: function (value, context)
            {
				if (value == null) return null;

                var o = [ ];

                for (var i = 0; i < this.properties.length; i++)
                {
                    o.push(this.properties[i].type.flatten(value[this.properties[i].name], context));
                }

                return o;
            },
            
            unflatten: function (value, context)
            {
				if (value == null) return null;

                var o = { };
                
                for (var i = 0; i < this.properties.length; i++)
                {
                    o[this.properties[i].name] = this.properties[i].type.unflatten(value[i], context);
                }

                return o;
            }
        });
    }
};
