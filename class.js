/*
**	rin/class
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
**	Base class used to easily create classes and sub-classes with complex multiple inheritance and
**	support for calls to parent class methods.
*/

let Class = module.exports = function ()
{
};


/**
**	Reference to the class itself.
*/
Class._class = Class;


/**
**	Contains the methods of each of the super classes.
*/
Class._super = { };


/**
**	Name of the class, if none specified the class will be considered "final" and will not be inheritable.
*/
Class.prototype.className = "Class";


/**
**	Class constructor, should initialize the state of the instance. Invoked when the `new` keyword is used with the class.
*/
Class.prototype.__ctor = function ()
{
};


/**
**	Class destructor, should clear the instance state and release any used resources, invoked when the global `dispose`
**	function is called with the instance as parameter.
*/
Class.prototype.__dtor = function ()
{
};


/**
**	Returns true if the object is an instance of the specified class (verifies inheritance), the parameter can be a class
**	name, a class constructor or a class instance, in any case the appropriate checks will be done.
**
**	>> bool isInstanceOf (string className);
**	>> bool isInstanceOf (constructor classConstructor);
**	>> bool isInstanceOf (object classInstance);
*/
Class.prototype.isInstanceOf = function (className)
{
	className = Rin.typeOf(className) == "string" ? className : (className.prototype ? className.prototype.className : className.constructor.prototype.className);
	return className in this._super ? true : this.className == className;
};


/**
**	Internal method to ensure the _super field of an instance is ready to be used.
**
**	>> void _initSuperRefs ();
*/
Class.prototype._initSuperRefs = function ()
{
	var _super = this.constructor._super;
	var _newSuper = { };

	for (let i in _super)
	{
		let o = { };

		let _prot = _super[i].prototype;
		for (let j in _prot)
		{
			if (Rin.typeOf(_prot[j]) == "function")
				o[j] = _prot[j].bind(this);
		}

		_newSuper[i] = o;
	}

	this._super = _newSuper;
};


/**
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
	var self = this._class;

	var _super = self._super;
	var _class = self._class;

	if (Rin.typeOf(proto) == "function")
	{
		// Move constants (uppercased properties) to the class-level instead of prototype-level.
		for (let i in proto._class)
			if (!/^[A-Z]/.test(i)) self[i] = proto._class[i];

		// Combine methods and properties.
		Rin.override (self.prototype, proto._class.prototype);

		// Combine super methods.
		Rin.override (_super, proto._class._super);

		// Add new super reference if className specified in inherited prototypes.
		if (proto._class.prototype.className)
			_super[proto._class.prototype.className] = proto._class;
	}
	else
	{
		Rin.override (self.prototype, proto);
	}

	self._super = _super;
	self._class = _class;

	return self;
};


/**
**	Internal method used to extend a class with one or more prototypes.
**
**	>> class _extend (object base, object[] protos);
*/
Class.prototype._extend = function (base, protos)
{
	var _class = function (...args)
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

	if ("classInit" in _class.prototype)
		_class.prototype.classInit();

	return _class;
};


/**
**	Creates a new class with the specified prototypes each of which can be a class constructor or an object.
**
**	>> constructor extend (object... protos);
*/
Class.extend = function (...protos)
{
	return this._class.prototype._extend (this, protos);
};


/**
**	Creates a new instance of a class resulting from extending the self class with the specified prototype.
**
**	>> object create (object proto);
*/
Class.create = function (proto)
{
	return new (this.extend(proto)) ();
};
