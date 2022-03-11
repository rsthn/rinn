/*
**	rinn/alpha.js
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

let Rinn = { };
export default Rinn;

/*
**	Invokes the specified function 'fn' 10ms later.
**
**	>> void invokeLater (function fn);
*/
Rinn.invokeLater = function (fn)
{
	if (fn) setTimeout (function() { fn(); }, 10);
};


/*
**	Waits for the specified amount of milliseconds. Returns a Promise.
**
**	>> Promise wait (int millis);
*/
Rinn.wait = function (millis)
{
	return new Promise(function (resolve, reject) {
		setTimeout (resolve, millis);
	});
};


/*
**	Returns the type of an element 'o', properly detects arrays and null types. The return string is always in lowercase.
**
**	>> string typeOf (any o);
*/
Rinn.typeOf = function (o)
{
	if (o instanceof Array)
		return "array";

	if (o === null)
		return "null";

	return (typeof(o)).toString().toLowerCase();
};


/*
**	Returns boolean indicating if the type of the element is an array or an object.
**
**	>> bool isArrayOrObject (any o);
*/
Rinn.isArrayOrObject = function (o)
{
	switch (Rinn.typeOf(o))
	{
		case "array": case "object":
			return true;
	}

	return false;
};


/*
**	Creates a clone (deep copy) of the specified element. The element can be an array, an object or a primitive type.
**
**	>> T clone (T elem);
*/
Rinn.clone = function (elem)
{
	let o = Rinn.typeOf(elem);

	if (o === 'array')
	{
		o = [ ];

		for (let i = 0; i < elem.length; i++)
			o.push (Rinn.clone(elem[i]));
	}
	else if (o === 'object')
	{
		if (('clone' in elem) && typeof(elem.clone) === 'function')
			return elem.clone();

		o = { };

		for (let i in elem)
			o[i] = Rinn.clone(elem[i]);
	}
	else
	{
		o = elem;
	}

	return o;
};


/*
**	Merges all given elements into the first one, object fields are cloned.
**
**	>> T merge (T... elems)
*/
Rinn.merge = function (output, ...objs)
{
	if (Rinn.typeOf(output) == "array")
	{
		for (let i = 0; i < objs.length; i++)
		{
			let arr = objs[i];

			if (Rinn.typeOf(arr) != "array")
			{
				output.push(arr);
			}
			else
			{
				for (let j = 0; j < arr.length; j++)
				{
					output.push(Rinn.clone(arr[j]));
				}
			}
		}
	}
	else if (Rinn.typeOf(output) == "object")
	{
		for (let i = 0; i < objs.length; i++)
		{
			let obj = objs[i];
			if (Rinn.typeOf(obj) != "object") continue;

			for (let field in obj)
			{
				if (Rinn.isArrayOrObject(obj[field]))
				{
					if (field in output)
						Rinn.merge(output[field], obj[field]);
					else
						output[field] = Rinn.clone(obj[field]);
				}
				else
					output[field] = obj[field];
			}
		}
	}

	return output;
};


/*
**	Assigns all fields from the specified objects into the first one.
**
**	>> object override (object output, object... objs)
*/
Rinn.override = function (output, ...objs)
{
	for (let i = 0; i < objs.length; i++)
	{
		for (let j in objs[i])
		{
			output[j] = objs[i][j];
		}
	}

	return output;
};


/*
**	Compares two objects and returns `true` if all properties in "partial" find a match in "full".
*/
Rinn.partialCompare = function (full, partial)
{
	if (full == null || partial == null) return false;

	if (full === partial)
		return true;

	for (var i in partial)
	{
		if (full[i] != partial[i])
			return false;
	}

	return true;
};


/*
**	Performs a partial search for an object (o) in the specified array and returns its index or `false` if the
**	object was not found. When `getObject` is set to `true` the object will be returned instead of an index, or
**	`null` if not found.
*/
Rinn.arrayFind = function (arr, o, getObject)
{
	for (var i = 0; arr && i < arr.length; i++)
	{
		if (this.partialCompare (arr[i], o))
			return getObject ? arr[i] : i;
	}

	return getObject ? null : false;
};


/*
**	Verifies if the specified object is of class `m`, returns boolean.
**
**	>> bool isTypeOf (object obj, class _class);
*/
Rinn.isInstanceOf = function (obj, _class)
{
	if (!obj || !_class || typeof(obj) !== 'object')
		return false;

	if (obj instanceof _class)
		return true;

	if ('isInstanceOf' in obj)
		return obj.isInstanceOf(_class);

	return false;
};


/*
**	Traverses the given object attempting to find the index/key that does an identical match with the specified value,
**	if not found returns -1, otherwise the index/key where the value was found.
**
**	>> int indexOf (array container, T value)
**	>> string indexOf (object container, T value)
*/
Rinn.indexOf = function (container, value, forceArray=false)
{
	if (forceArray)
	{
		for (let i = 0; i < container.length; i++)
		{
			if (container[i] === value)
				return i;
		}
	
		return -1;
	}

	for (let i in container)
	{
		if (container[i] === value)
			return i;
	}

	return -1;
};


/*
**	Escapes a string using HTML entities.
**
**	>> string escape (string str);
*/
Rinn.escape = function (str)
{
	return (str+"").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};


/*
**	Verifies if the specified object is of class `m`, if not it will create a new instance of `m` passing `o` as parameter.
**
**	>> object ensureTypeOf (class m, object o);
*/
Rinn.ensureTypeOf = function (m, o)
{
	if (!o || !m || o instanceof m)
		return o;

	if (o.isInstanceOf && m.prototype.className)
	{
		if (o.isInstanceOf (m.prototype.className))
			return o;
	}

	return new m (o);
};


/*
**	Serializes an object and returns its JSON string representation.
**
**	>> string serialize (object o);
*/
Rinn.serialize = function (o)
{
	return JSON.stringify(o);
};


/*
**	Deserializes a string in JSON format and returns the result.
**
**	>> any deserialize (string s);
*/
Rinn.deserialize = function (s)
{
	return JSON.parse(s);
};


/*
**	Chains a new function to an existing one on some object, such that invoking the function on the object will cause
**	both functions to run (order would be oldFunction then newFunction).
**
**	If the `conditional` flag is set to `true`, the second function will be run only if the first one returns non-false.
**	Returns an object with a single method 'unhook' which will revert the changes to leave only the original function.
**
**	>> object{function unhook} hook (Object object, String functionName, function newFunction, bool conditional=false);
*/
Rinn.hookAppend = function (object, functionName, newFunction, conditional=true)
{
	const oldFunction = object[functionName];

	if (conditional)
	{
		object[functionName] = function (...args) {
			if (oldFunction.apply (this, args) !== false)
				return newFunction.apply (this, args);
		};
	}
	else
	{
		object[functionName] = function (...args) {
			oldFunction.apply (this, args);
			return newFunction.apply (this, args);
		};
	}

	return { 
		unhook: function() {
			object[functionName] = oldFunction;
		}
	};
};


/*
**	Chains a new function to an existing one on some object, such that invoking the function on the object will cause
**	both functions to run (order would be oldFunction then newFunction).
**
**	If the `conditional` flag is set to `true`, the second function will be run only if the first one returns non-false.
**	Returns an object with a single method 'unhook' which will revert the changes to leave only the original function.
**
**	>> object{function unhook} hook (Object object, String functionName, function newFunction, bool conditional=false);
*/
Rinn.hookPrepend = function (object, functionName, newFunction, conditional=true)
{
	const oldFunction = object[functionName];

	if (conditional)
	{
		object[functionName] = function (...args) {
			if (newFunction.apply (this, args) !== false)
				return oldFunction.apply (this, args);
		};
	}
	else
	{
		object[functionName] = function (...args) {
			newFunction.apply (this, args);
			return oldFunction.apply (this, args);
		};
	}

	return { 
		unhook: function() {
			object[functionName] = oldFunction;
		}
	};
};
