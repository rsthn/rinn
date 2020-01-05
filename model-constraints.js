/*
**	rin/model-constraints
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
let Regex = require('./model-regex');

/**
**	Map of model constraint handlers. Each function should accept parameters (in order): the model object (model), the constraint value (ctval),
**	the property name (name), the property value (value) and return the corrected value once verified or throw an exception if errors occur.
*/

module.exports =
{
	/**
	**	Utility function (not a handler) to get the real value given a reference string. If the value is not a string, the value itself will
	**	be returned, if it is a string starting with '#' the model property will be returned, if starts with '@' the object property will be
	**	returned, otherwise the contents of the string will eval'd and returned.
	*/
	_getref: function (value, obj)
	{
		if (typeof(value) == "string")
		{
			if (value.substr(0, 1) == "#")			value = obj.get(value.substr(1));
			else if (value.substr(0, 1) == "@")		value = obj[value.substr(1)];

			if (typeof(value) == "string")
				return eval(value);

			return value;
		}
		else
			return value;
	},


	/**
	**	Verifies that the new value is of the valid type before storing it on the property. When possible if the
	**	input is of compatible type it will be converted to the target type.
	*/
	type: function (model, ctval, name, value)
	{
		switch (ctval)
		{
			case "int":
				value = parseInt(value);
				if (isNaN(value)) throw new Error (ctval);
				break;

			case "float":
				value = parseFloat(value);
				if (isNaN(value)) throw new Error (ctval);
				break;

			case "string":
				value = (value === null || value === undefined) ? "" : value.toString();
				break;

			case "bit":
				if (value === true || value === false) {
					value = value ? 1 : 0;
					break;
				}

				value = parseInt(value);
				if (isNaN(value)) throw new Error (ctval);

				value = value ? 1 : 0;
				break;

			case "array":
				if (Rin.typeOf(value) == "array")
					break;

				if (value === null || value === undefined)
				{
					value = [];
					break;
				}

				throw new Error (ctval);
				break;

			case "bool":
				if (value === "true" || value === true) {
					value = true;
					break;
				}

				if (value === "false" || value === false) {
					value = false;
					break;
				}

				throw new Error (ctval);
				break;
		}

		return value;
	},


	/**
	**	Verifies that the field is of the specified model type.
	*/
	model: function (model, ctval, name, value)
	{
		var mclass = this._getref(ctval, model);
		if (!mclass) throw new Error (ctval);

		if (!value)
			return new mclass();

		return mclass.ensure (value);
	},


	/**
	**	Verifies that the field is of the specified class.
	*/
	cls: function (model, ctval, name, value)
	{
		var mclass = this._getref(ctval, model);
		if (!value) return new mclass();

		return Rin.ensureTypeOf(mclass, value);
	},


	/**
	**	Verifies that the array contents are of the specified class. Returns error if the class does not exist
	**	or if the field is not an array. Therefore a type:array constraint should be used before this one.
	*/
	arrayof: function (model, ctval, name, value)
	{
		var mclass = this._getref(ctval, model);
		if (!value) value = [];

		if (!mclass || Rin.typeOf(value) != "array")
			throw new Error (ctval);

		for (var i = 0; i < value.length; i++)
			value[i] = Rin.ensureTypeOf(mclass, value[i]);
		
		return value;
	},


	/**
	**	Verifies that the array contents are not null. Returns error if the field is not an array, therefore a
	**	type:array constraint should be used before this one.
	*/
	arraynull: function (model, ctval, name, value)
	{
		var remove = false;

		if (Rin.typeOf(ctval) == "object")
		{
			if (ctval.remove) remove = ctval.remove;
			ctval = ctval.value;
		}

		if (ctval) return value;

		if (Rin.typeOf(value) != "array")
			throw new Error (ctval);

		for (var i = 0; i < value.length; i++)
		{
			if (value[i] == null)
			{
				if (remove)
					value.splice (i--, 1);
				else
					throw new Error (ctval);
			}
		}

		return value;
	},


	/**
	**	Verifies that the array contents are all compliant. Returns error if the field is not an array, therefore
	**	a type:array constraint should be used before this one.
	*/
	arraycompliant: function (model, ctval, name, value)
	{
		var remove = false;

		if (Rin.typeOf(ctval) == "object")
		{
			if (ctval.remove) remove = ctval.remove;
			ctval = ctval.value;
		}

		if (!ctval) return value;

		if (Rin.typeOf(value) != "array")
			throw new Error (ctval);

		for (var i = 0; i < value.length; i++)
		{
			if (value[i] == null)
				continue;

			if (!value[i].isCompliant())
			{
				if (remove)
					value.splice (i--, 1);
				else
					throw new Error (ctval);
			}
		}

		return value;
	},


	/**
	**	Verifies the presense of the field.
	*/
	required: function (model, ctval, name, value)
	{
		if (value === null || value === undefined)
			throw new Error (ctval ? "" : "null");

		switch (Rin.typeOf(value))
		{
			case "array":
				if (value.length == 0) throw new Error (ctval ? "" : "null");
				break;

			default:
				if (value.toString().length == 0) throw new Error (ctval ? "" : "null");
				break;
		}

		return value;
	},


	/**
	**	Verifies the minimum length of the field.
	*/
	minlen: function (model, ctval, name, value)
	{
		if (value.toString().length < ctval)
			throw new Error (ctval);

		return value;
	},


	/**
	**	Verifies the maximum length of the field.
	*/
	maxlen: function (model, ctval, name, value)
	{
		if (value.toString().length > ctval)
			throw new Error (ctval);

		return value;
	},


	/**
	**	Verifies the minimum value of the field.
	*/
	minval: function (model, ctval, name, value)
	{
		if (parseFloat(value) < ctval)
			throw new Error (ctval);

		return value;
	},


	/**
	**	Verifies the maximum value of the field.
	*/
	maxval: function (model, ctval, name, value)
	{
		if (parseFloat(value) > ctval)
			throw new Error (ctval);

		return value;
	},


	/**
	**	Verifies the minimum number of items in the array.
	*/
	mincount: function (model, ctval, name, value)
	{
		if (Rin.typeOf(value) != "array" || value.length < ctval)
			throw new Error (ctval);

		return value;
	},


	/**
	**	Verifies the maximum number of items in the array.
	*/
	maxcount: function (model, ctval, name, value)
	{
		if (Rin.typeOf(value) != "array" || value.length > ctval)
			throw new Error (ctval);

		return value;
	},


	/**
	**	Verifies the format of the field using a regular expression. The constraint value should be the name of
	**	one of the Model.Regex regular expressions.
	*/
	pattern: function (model, ctval, name, value)
	{
		if (!Regex[ctval].test (value.toString()))
			throw new Error (ctval);

		return value;
	},


	/**
	**	Verifies that the field is inside the specified set of options. The set can be an array or a string with
	**	the options separated by vertical bar (|). The comparison is case-sensitive.
	*/
	inset: function (model, ctval, name, value)
	{
		if (Rin.typeOf(ctval) != "array")
		{
			if (!new RegExp("^("+ctval.toString()+")$").test (value.toString()))
				throw new Error (ctval);

			return value;
		}

		if (ctval.indexOf(value.toString()) == -1)
			throw new Error (ctval.join("|"));

		return value;
	},


	/**
	**	Sets the field to upper case.
	*/
	upper: function (model, ctval, name, value)
	{
		return ctval ? value.toString().toUpperCase() : value;
	},


	/**
	**	Sets the field to lower case.
	*/
	lower: function (model, ctval, name, value)
	{
		return ctval ? value.toString().toLowerCase() : value;
	}
};
