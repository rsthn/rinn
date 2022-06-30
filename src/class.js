
import Rinn from './alpha.js';

/**
 * Base class used to create other classes with complex prototype based multiple inheritance while at the
 * same time avoiding the prototype chain for faster access. Supports calling parent class methods.
 */

//!class Class
const Class = function ()
{
};

/**
 * Reference to the class itself.
 */
Class._class = Class;

/**
 * Contains the methods of each of the super classes.
 */
Class._super = { };

/**
 * Name of the class, if none specified the class will be considered "final" and will not be inheritable.
 * !readonly string className;
 */
Class.prototype.className = 'Class';

/**
 * Class constructor, should initialize the instance. Invoked when the `new` keyword is used with the class.
 * !constructor();
 */
Class.prototype.__ctor = function ()
{
};

/**
 * Class destructor, should clear the instance and release any used resources, invoked when the global `dispose` function is called with an instance as parameter.
 * !__dtor() : void;
 */
Class.prototype.__dtor = function ()
{
};

/**
 * Returns true if the object is an instance of the specified class, the parameter can be a class name (string), a constructor (function) or
 * a class instance (object), in any cases the appropriate checks will be done.
 * !isInstanceOf (className: string|function|object) : boolean;
 */
Class.prototype.isInstanceOf = function (className)
{
	if (className === null)
		return false;

	if (typeof(className) === 'function')
	{
		className = className.prototype.className;
	}
	else if (typeof(className) !== 'string')
	{
		className = className.__proto__.className;
	}

	return this.className === className ? true : this._super.hasOwnProperty(className);
};

/**
 * Returns true if the given object is an instance of the specified class, the parameter can be a class name (string), a constructor (function)
 * or a class instance (object), in any cases the appropriate checks will be done.
 * !instanceOf (object: object, className: string|function|object) : boolean;
 */
Class.instanceOf = function (object, className)
{
	if (object === null || className === null)
		return false;

	return object.isInstanceOf(className);
};

/**
 * Internal method to ensure the _super field of an instance has all functions properly bound to the instance.
 */
Class.prototype._initSuperRefs = function ()
{
	let _super = this.constructor._super;
	let _newSuper = { };

	const self = this;

	for (let i in _super)
	{
		let o = { };

		let _prot = _super[i].prototype;
		for (let j in _prot)
		{
			if (Rinn.typeOf(_prot[j]) !== 'function')
				continue;

			o[j] = (function(fn)
			{
				return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
					return fn.call(self, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
				};
			})
			(_prot[j]);
		}

		_newSuper[i] = o;
	}

	this._super = _newSuper;
};


/*
**	Extends the class with the specified prototype. The prototype can be a function (class constructor) or an object. Note that the
**	class will be modified (and returned) instead of creating a new class. Must be called at the class-level (**not** instance level).
**	When a class is provided all fields starting with uppercase at the class-level will not be inherited, this is used to create constants
**	on classes without having them to be copied to derived classes.
**
**	>> class inherit (constructor classConstructor);
**	>> class inherit (object obj);
*/
Class.inherit = function (proto)
{
	let self = this._class;

	let _super = self._super;
	let _class = self._class;

	if (Rinn.typeOf(proto) === 'function')
	{
		// Move constants (uppercased properties) to the class-level instead of prototype-level.
		for (let i in proto._class)
			if (!/^[A-Z]/.test(i)) self[i] = proto._class[i];

		// Combine methods and properties.
		Rinn.override (self.prototype, proto._class.prototype);

		// Combine super references.
		Rinn.override (_super, proto._class._super);

		// Add new super reference if className specified in inherited prototypes.
		if (proto._class.prototype.className)
			_super[proto._class.prototype.className] = proto._class;
	}
	else
	{
		Rinn.override (self.prototype, proto);
	}

	self._super = _super;
	self._class = _class;

	return self;
};


/**
 * Internal method used to extend a class with one or more prototypes.
 */
Class.prototype._extend = function (base, protos)
{
	if (protos.length === 0)
		return base;

	//VIOLET OPTIMIZE
	const _class = function (...args)
	{
		this._initSuperRefs();
		this.__ctor.apply(this, args);
	};

	_class._class = _class;
	_class._super = { };

	Class.inherit.call (_class, base);
	delete _class.prototype.className;

	for (let i = 0; i < protos.length; i++)
		_class.inherit (protos[i]);

	delete _class._super.Class;

	if ('classInit' in _class.prototype)
		_class.prototype.classInit();

	_class.isInstance = function(value) {
		return Rinn.isInstanceOf(value, _class);
	};

	return _class;
};


/**
 * Creates a new class with the specified prototypes each of which can be a class constructor (function) or an object.
 */
Class.extend = function (...protos)
{
	return this._class.prototype._extend (this, protos);
};


/**
 * Creates a new instance of a class resulting from extending the self class with the specified prototype.
 */
Class.create = function (proto)
{
	return new (this.extend(proto)) ();
};

/**
 * Mutates the host object to be an instance of the specified class.
 * !static mutate (classConstructor: object, host: object, override?: object) : object;
 */
Class.mutate = function (classConstructor, host, override=null)
{
	let zombie = new classConstructor ();

	// Copy all members from the class prototype.
	for (let i in classConstructor.prototype)
	{
		if (host.hasOwnProperty(i))
			continue;
	
		host[i] = classConstructor.prototype[i];
	}
	
	// Copy all members from the zombie class instance.
	for (let i in zombie)
	{
		if (host.hasOwnProperty(i))
			continue;
	
		host[i] = zombie[i];
	}

	// Rebind the super references.
	if (host._super)
	{
		for (let i in host._super)
		{
			for (let j in host._super[i]) {
				host._super[i][j] = classConstructor.prototype.constructor._super[i].prototype[j].bind(host);
			}
		}
	}

	// Copy override members.
	if (override !== null) {
		for (let i in override)
			host[i] = override[i];
	}

	return host;
};

export default Class;
