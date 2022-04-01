/*
**	rinn/class.js
**
**	Copyright (c) 2013-2022, RedStar Technologies, All rights reserved.
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

import Rinn from './alpha.js';

/**
 * 	Base class used to create other classes with complex prototype based multiple inheritance while at the
 * 	same time avoiding the prototype chain for faster access. Supports calling parent class methods.
 */

//!class Class
const Class = function ()
{
};

/**
 * 	Reference to the class itself.
 */
Class._class = Class;

/**
 * 	Contains the methods of each of the super classes.
 */
Class._super = { };

/**
 * 	Name of the class, if none specified the class will be considered "final" and will not be inheritable.
 * 	@public @type {string}
 * 	!string className;
 */
Class.prototype.className = 'Class';

/**
 * 	Class constructor, should initialize the instance. Invoked when the `new` keyword is used with the class.
 * 	!__ctor() : Class;
 */
Class.prototype.__ctor = function ()
{
};

/**
 * 	Class destructor, should clear the instance and release any used resources, invoked when the global `dispose` function
 * 	is called with an instance as parameter.
 * 	!__dtor() : void;
 */
Class.prototype.__dtor = function ()
{
};

/**
 * 	Returns true if the object is an instance of the specified class, the parameter can be a class name (string), a constructor (function) or
 * 	a class instance (object), in any cases the appropriate checks will be done.
 *
 * 	@param {string|function|object} className
 * 	@returns {boolean}
 *
 * 	!isInstanceOf (className: string|function|object) : boolean;
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
 * 	Returns true if the given object is an instance of the specified class, the parameter can be a class name (string), a constructor (function)
 * 	or a class instance (object), in any cases the appropriate checks will be done.
 *
 * 	@param {Object} object
 * 	@param {string|function|object} className
 *
 *	!instanceOf (object: object, className: string|function|object) : boolean;
 */
Class.instanceOf = function (object, className)
{
	if (object === null || className === null)
		return false;

	return object.isInstanceOf(className);
};

/**
 * 	Internal method to ensure the _super field of an instance has all functions properly bound to the instance.
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
				return function (a00, a01, a02, a03, a04, a05, a06, a07, a08, a09, a0A) {
					return fn.call(self, a00, a01, a02, a03, a04, a05, a06, a07, a08, a09, a0A);
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


/*
**	Internal method used to extend a class with one or more prototypes.
**
**	>> class _extend (object base, object[] protos);
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
 * 	Creates a new class with the specified prototypes each of which can be a class constructor (function) or an object.
 */
Class.extend = function (...protos)
{
	return this._class.prototype._extend (this, protos);
};


/*
**	Creates a new instance of a class resulting from extending the self class with the specified prototype.
**
**	>> object create (object proto);
*/
Class.create = function (proto)
{
	return new (this.extend(proto)) ();
};

export default Class;
