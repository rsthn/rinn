
import Class from './class.js';

/**
**	Class used to add flattening and unflattening capabilities to any object. A "flat" object is an object composed
**	only of native types, that is: `null,` `boolean`, `integer`, `number`, `array` or `object`.
*/

export default Class.extend
({
	/**
	**	Name of the class.
	*/
	className: "Flattenable",

	/**
	**	Type schema used to flatten/unflatten the contents of this class. See Schema class for more information.
	*/
	typeSchema: null,

	/**
	**	Returns the flattened contents of the object.
	*/
	flatten: function (context)
	{
		return this.typeSchema.flatten(this, context);
	},

	/**
	**	Unflattens the given object and overrides the local contents.
	*/
	unflatten: async function (value, context)
	{
		Object.assign(this, await this.typeSchema.unflatten(value, context));
		await this.onUnflattened();
		return this;
	},

	/*
	**	Executed when the unflatten() method is called on the object.
	*/
	onUnflattened: async function ()
	{
	}
});
