
import Rinn from './alpha.js';
import EventDispatcher from './event-dispatcher.js';

/**
**	A model is a high-integrity data object used to store properties and more importantly to provide event support to notify of any
**	kind of change that occurs to the model's properties. Integrity of the model is maintained by optionally using property constraints.
*/

let _Model = EventDispatcher.extend
({
	/**
	**	Name of the class.
	*/
	className: "Model",

	/**
	**	Default properties for the model. Can be a map with the property name and its default value or a function
	**	returning a map with dynamic default values. This is used to reset the model to its initial state.
	*/
	defaults: null,

	/**
	**	Model property contraints. A map with the property name and an object specifying the constraints of the
	**	property. This is used to determine the type, format and behavior of each property in the model.
	*/
	constraints: null,

	/**
	**	Properties of the model.
	*/
	data: null,

	/**
	**	Array with the name of the properties that have changed. Populated prior modelChanged event.
	*/
	changedList: null,

	/**
	**	Silent mode indicator. While in silent mode events will not be dispatched.
	*/
	_silent: 0,

	/**
	**	Current nesting level of the set() method. This is used to determine when all the property
	**	changes are done.
	*/
	_level: 0,

	/**
	**	Initializes the model and sets the properties to the specified data object.
	**
	**	>> Model __ctor (object data);
	**	>> Model __ctor (object data, object defaults);
	*/
	__ctor: function (data, defaults)
	{
		this._super.EventDispatcher.__ctor();

		this.data = { };

		if (defaults != null)
		{
			this.reset (defaults, false);
		}
		else
		{
			let o = null;

			if (!this.defaults && this.constraints)
			{
				o = { };

				for (let i in this.constraints)
				{
					let j = this.constraints[i];
					if (j.def === null || j.def === undefined)
					{
						o[i] = null;
						continue;
					}

					if (typeof(j.def) === 'function')
						o[i] = j.def();
					else
						o[i] = j.def;
				}
			}

			this.reset(o);
		}

		this.init();

		if (data != null)
			this.set (data, true);

		if (this.constraints) this.update();

		this.ready();
	},

	/**
	**	Resets the model to its default state and triggers update events. If a map is provided the defaults of
	**	the model will be set to the specified map.
	**
	**	>> Model reset (object defaults, [bool nsilent=true]);
	**	>> Model reset ([bool nsilent=true]);
	*/
	reset: function (defaults, nsilent)
	{
		if (!this.defaults)
		{
			if (!defaults || (Rinn.typeOf(defaults) !== 'object' && Rinn.typeOf(defaults) !== 'function'))
				return this;

			this.defaults = defaults;
		}

		if (Rinn.typeOf(this.defaults) === 'function')
			this.data = this.defaults();
		else
			this.data = Rinn.clone(this.defaults);

		return (nsilent === false || defaults === false) ? this : this.update(null, true);
	},

	/**
	**	Initializes the model. Called before the model properties are set.
	**
	**	>> void init ();
	*/
	init: function ()
	{
	},

	/**
	**	Initialization epilogue. Called after initialization and after model properties are set.
	**
	**	>> void ready ();
	*/
	ready: function ()
	{
	},

	/**
	**	Enables or disables silent mode. When the model is in silent mode events will not be dispatched.
	**
	**	>> Model silent (value: bool);
	*/
	silent: function (value)
	{
		this._silent += value ? 1 : -1;
		return this;
	},

	/**
	**	Validates a property name and value against the constraints defined in the model (if any). Returns the
	**	final value if successful or throws an empty exception if errors occur.
	**
	**	>> T _validate (string name, T value);
	*/
	_validate: function (name, value)
	{
		if (!this.constraints || !this.constraints[name])
			return value;

		var constraints = this.constraints[name];

		var nvalue = value;

		for (var ctname in constraints)
		{
			if (!_Model.Constraints[ctname])
				continue;

			try {
				nvalue = _Model.Constraints[ctname] (this, constraints[ctname], name, nvalue);
			}
			catch (e)
			{
				if (e.message == "null")
					break;

				throw new Error (`Constraint [${ctname}:${constraints[ctname]}] failed on property '${name}'.`);
			}
		}

		return nvalue;
	},

	/**
	**	Sets the value of a property and returns the value set. This method is internally used to set properties
	**	one at a time. If constraints are present in the model for the specified property all constraints will be
	**	verified. When constraint errors occur the constraintError event will be raised and the property value
	**	will not be changed.
	**
	**	>> T _set (string name, T value);
	*/
	_set: function (name, value)
	{
		if (!this.constraints || !this.constraints[name])
		{
			this.data[name] = value;
			return value;
		}

		var constraints = this.constraints[name];

		var cvalue = this.data[name];
		var nvalue = value;

		for (var ctname in constraints)
		{
			if (!_Model.Constraints[ctname])
				continue;

			try {
				nvalue = _Model.Constraints[ctname] (this, constraints[ctname], name, nvalue);
			}
			catch (e)
			{
				if (e.message == "null")
					break;

				if (!this._silent)
					this.dispatchEvent ("constraintError", { constraint: ctname, message: e.message, name: name, value: value });

				break;
			}
		}

		return (this.data[name] = nvalue);
	},

	/**
	**	Triggers property events to indicate a property is changing. First triggers "propertyChanging" and then
	**	"propertyChanged". If the first event returns false the second event will not be triggered.
	**
	**	>> void _propertyEvent (string name, T prev, T value, bool direct=false);
	*/
	_propertyEvent: function (name, prev, value, direct)
	{
		var temp = { name: name, old: prev, value: value, level: this._level };

		var evt = this.dispatchEvent ("propertyChanging", temp);

		if (!direct)
			temp.value = this._set (name, temp.value);
		else
			this.data[name] = temp.value;

		if (evt != null && evt.ret.length && evt.ret[0] === false)
			return;

		this.dispatchEvent ("propertyChanged." + name, temp);
		this.dispatchEvent ("propertyChanged", temp);

		this.changedList.push (name);
	},

	/**
	**	Sets one or more properties of the model. Possible arguments can be two strings or a map.
	**
	**	>> Model set (string name, T value, bool force=true);
	**	>> Model set (string name, T value, bool silent=false);
	**	>> Model set (string name, T value);
	**	>> Model set (object data);
	*/
	set: function ()
	{
		var n = arguments.length;
		var force = false, silent = false;

		if ((n > 2 || (n == 2 && Rinn.typeOf(arguments[0]) == "object")) && Rinn.typeOf(arguments[n-1]) == "boolean")
		{
			force = arguments[--n];
			if (force === false) silent = true;
		}

		if (this._level == 0)
		{
			this.changedList = [];
		}

		this._level++;

		if (n == 2)
		{
			if (this.data[arguments[0]] !== arguments[1] || force)
			{
				if (!this._silent && !silent)
					this._propertyEvent (arguments[0], this.data[arguments[0]], this._validate (arguments[0], arguments[1]));
				else
					this._set (arguments[0], arguments[1]);
			}
		}
		else
		{
			for (var i in arguments[0])
			{
				if (this.data[i] !== arguments[0][i] || force)
				{
					if (!this._silent && !silent)
						this._propertyEvent (i, this.data[i], this._validate (i, arguments[0][i]));
					else
						this._set (i, arguments[0][i]);
				}
			}
		}

		if (!--this._level && this.changedList.length && !silent && !this._silent)
			this.dispatchEvent ("modelChanged", { fields: this.changedList });

		return this;
	},

	/**
	**	Returns true if the given key exists in the model.
	**
	**	>> boolean has (string name);
	*/
	has: function (name)
	{
		return name in this.data;
	},

	/**
	**	Returns the value of a property. If no name is specified the whole map of properties will be returned.
	**	If a boolean value of "true" is provided the properties map will be returned but first will be compacted
	**	using the default data to ensure only valid properties are present.
	**
	**	>> T get (string name);
	**	>> object get ();
	**	>> object get (true);
	**	>> object get (false);
	**	
	*/
	get: function (name, def)
	{
		if (arguments.length == 0 || name === false)
			return this.data;

		if (arguments.length == 1 && name === true)
			return this.flatten ();

		if (arguments.length == 2)
			return this.data[name] === undefined ? def : this.data[name];

		return this.data[name];
	},

	/**
	**	Returns the value of a property as an integer number.
	**
	**	>> int getInt (string name, [int def]);
	*/
	getInt: function (name, def)
	{
		if (arguments.length == 2)
			return this.data[name] === undefined ? def : parseInt (this.data[name]);

		return parseInt (this.data[name]);
	},

	/**
	**	Returns the value of a property as a floating point number.
	**
	**	>> float getFloat (string name, [float def]);
	*/
	getFloat: function (name, def)
	{
		if (arguments.length == 2)
			return this.data[name] === undefined ? def : parseFloat (this.data[name]);

		return parseFloat (this.data[name]);
	},

	/**
	**	Returns the value of a property as a boolean value (true or false).
	**
	**	>> bool getBool (string name, [bool def]);
	**	
	*/
	getBool: function (name, def)
	{
		if (arguments.length == 2)
			name = this.data[name] === undefined ? def : this.data[name];
		else
			name = this.data[name];

		if (name === "true" || name === true)
			return true;

		if (name === "false" || name === false)
			return false;

		return parseInt (name) ? true : false;
	},

	/**
	**	Returns a reference object for a model property. The resulting object contains two methods
	**	named "get" and "set" to modify the value of the property.
	**
	**	>> object getReference (string name);
	*/
	getReference: function (name)
	{	
		var m = this;

		return {
			get: function() {
				return m.get(name);
			},

			set: function(value) {
				m.set(name, value);
			}
		};
	},

	/**
	**	Sets or returns a constraint given the property name. 
	**
	**	>> Model constraint (string field, string constraint, T value);
	**	>> Model constraint (string field, object constraint);
	**	>> Model constraint (object constraints);
	**	>> object constraint (string field);
	*/
	constraint: function (field, constraint, value)
	{
		if (arguments.length == 3 || arguments.length == 2 || (arguments.length == 1 && Rinn.typeOf(field) == "object"))
		{
			if (this.constraints === this.constructor.prototype.constraints)
				this.constraints = Rinn.clone (this.constraints);

			switch (arguments.length)
			{
				case 1:
					Rinn.override (this.constraints, field);
					break;

				case 2:
					Rinn.override (this.constraints[field], constraint);
					break;

				case 3:
					this.constraints[field][constraint] = value;
					break;
			}

			return this;
		}

		return !field ? this : this.constraints[field];
	},

	/**
	**	Returns a compact version of the model properties. That is, a map only with validated properties that are
	**	also present in the default data map. Returns null if the object is not compliant. If the "safe" parameter
	**	is set one last property named "class" will be attached, this specifies the original classPath of the object.
	**
	**	>> object flatten ([bool safe=false]);
	*/
	flatten: function (safe, rsafe)
	{
		if (safe)
		{
			var data = this.flatten(false, true);
			if (data == null) return null;

			data["class"] = this.classPath;
			return data;
		}

		if (!this.constraints && !this.defaults)
			return this.data;

		if (!this.isCompliant())
			return { };

		var constraints = this.constraints;
		var keys = this.defaults ? (Rinn.typeOf(this.defaults) == "function" ? this.defaults() : this.defaults) : this.constraints;

		var data = { };

		for (var i in this.data)
		{
			if (!(i in keys)) continue;

			if (constraints && constraints[i])
			{
				var ct = constraints[i];

				if (ct.model)
				{
					data[i] = this.data[i] ? this.data[i].flatten(rsafe) : null;
					continue;
				}

				if (ct.arrayof)
				{
					data[i] = [];

					for (var j = 0; j < this.data[i].length; j++)
						data[i][j] = this.data[i][j] ? this.data[i][j].flatten(rsafe) : null;

					continue;
				}

				if (ct.cls)
				{
					data[i] = this.data[i] ? this.data[i].flatten() : null;
					continue;
				}
			}

			data[i] = this.data[i];
		}

		return data;
	},

	/**
	**	Removes a property or a list of properties.
	**
	**	>> void remove (string name, [bool nsilent=true]);
	**	>> void remove (array name, [bool nsilent=true]);
	*/
	remove: function (name, nsilent)
	{
		if (Rinn.typeOf(name) == "array")
		{
			for (var i = 0; i < name.length; i++)
				delete this.data[name[i]];

			if (nsilent !== false && !this._silent)
				this.dispatchEvent ("propertyRemoved", { fields: name });
		}
		else
		{
			delete this.data[name];

			if (nsilent !== false && !this._silent)
				this.dispatchEvent ("propertyRemoved", { fields: [name] });
		}
	},

	/**
	**	Triggers data change events for one or more properties. Ensure that silent mode is not enabled or else
	**	this method will have no effect. If no parameters are provided a full update will be triggered on all of
	**	the model properties.
	**
	**	>> Model update (array fields);
	**	>> Model update (string name);
	**	>> Model update (bool forceModelChanged);
	**	>> Model update ();
	*/
	update: function (fields, direct)
	{
		if (this._silent) return this;

		if (this._level == 0)
		{
			this.changedList = [];
		}

		this._level++;

		if (fields && Rinn.typeOf(fields) == 'string')
		{
			this._propertyEvent (fields, this.data[fields], this.data[fields], direct);
		}
		else if (fields && Rinn.typeOf(fields) == 'array')
		{
			for (var i of fields)
				this._propertyEvent (i, this.data[i], this.data[i], direct);
		}
		else
		{
			for (var i in this.data)
				this._propertyEvent (i, this.data[i], this.data[i], direct);
		}

		if (!--this._level && !this._silent && (this.changedList.length != 0 || fields === true))
			this.dispatchEvent ("modelChanged", { fields: this.changedList });

		return this;
	},

	/**
	**	Validates one or mode model properties using the defined constraints. If no parameters are provided all of
	**	the properties in the model will be validated.
	**
	**	>> Model validate (array fields);
	**	>> Model validate (string name);
	**	>> Model validate ();
	*/
	validate: function (fields)
	{
		if (!this.constraints) return this;

		if (fields && Rinn.typeOf(fields) == "string")
		{
			this._set (fields, this.data[fields])
		}
		else
		{
			for (var i in this.data)
			{
				if (fields && Rinn.indexOf(fields, i) == -1)
					continue;

				this._set (i, this.data[i])
			}
		}

		return this;
	},

	/**
	**	Validates all the properties in the model and returns a boolean indicating if all of them comply with the
	**	constraints defined in the model.
	**
	**	>> bool isCompliant ();
	*/
	isCompliant: function ()
	{
		if (!this.constraints) return true;

		try
		{
			for (var i in this.data)
				this._validate (i, this.data[i]);

			return true;
		}
		catch (e) {
		}

		return false;
	},

	/**
	**	Registers an event handler for changes in a specific property of the model.
	**
	**	>> void observe (string property, function handler, object context);
	*/
	observe: function (property, handler, context)
	{
		this.addEventListener ("propertyChanged." + property, handler, context);
	},

	/**
	**	Unregisters an event handler from changes in a specific property of the model.
	**
	**	>> void unobserve (string property, function handler, object context);
	*/
	unobserve: function (property, handler, context)
	{
		this.removeEventListener ("propertyChanged." + property, handler, context);
	},

	/**
	**	Adds a propertyChanged event handler for the given property. The property name can have an event namespace prepended and separated by colon.
	**
	**	>> void watch (string property, function handler);
	*/
	watch: function (property, handler)
	{
		property = property.split(':');

		if (property.length == 1)
		{
			property[1] = property[0];
			property[0] = 'watch';
		}

		this.addEventListener (property[0]+":propertyChanged."+property[1], function (evt, args) {
			handler (args.value, args, evt);
		});
	},

	/**
	**	Removes propertyChanged handlers related to the specified property. The property name can have an event namespace prepended and separated by colon.
	**
	**	>> void unwatch (string property);
	*/
	unwatch: function (property)
	{
		property = property.split(':');
		if (property.length == 1)
		{
			property[1] = property[0];
			property[0] = 'watch';
		}

		this.removeEventListener (property[0]+":propertyChanged."+property[1]);
	},

	/**
	 * Triggers a field change event. Even if the value of the field is the same as the model's, the event will still be triggered.
	 */
	trigger: function (name, value=null)
	{
		return this.set(name, value, true);
	},

	/**
	**	Serializes the model into a string.
	**
	**	string toString ();
	*/
	toString: function ()
	{
		return Rinn.serialize(this.get (true));
	}
});


/**
**	Import model constraints.
*/

import Constraints from './model-constraints.js';
_Model.Constraints = Constraints;

export default _Model;
