/*
**	rin.alpha.js
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

let Rin = { };

/**
**	Invokes the specified function 'fn' 10ms later.
**
**	>> void invokeLater (function fn);
*/
Rin.invokeLater = function (fn)
{
	if (fn) setTimeout (function() { fn(); }, 10);
};


/**
**	Returns the type of an element 'o', properly detects arrays and null types. The return string is always in lowercase.
**
**	>> string typeOf (any o);
*/
Rin.typeOf = function (o)
{
	if (o instanceof Array)
		return "array";

	if (o === null)
		return "null";

	return (typeof(o)).toString().toLowerCase();
};


/**
**	Returns boolean indicating if the type of the element is an array or an object.
**
**	>> bool isArrayOrObject (any o);
*/
Rin.isArrayOrObject = function (o)
{
	switch (Rin.typeOf(o))
	{
		case "array": case "object":
			return true;
	}

	return false;
};


/**
**	Creates a clone (deep copy) of the specified element. The element can be an array, an object or a primitive type.
**
**	>> T clone (T elem);
*/
Rin.clone = function (elem)
{
	var o;

	if (Rin.typeOf(elem) == "array")
	{
		o = [ ];

		for (let i = 0; i < elem.length; i++)
			o.push (Rin.clone(elem[i]));
	}
	else if (Rin.typeOf(elem) == "object")
	{
		o = { };

		for (let i in elem)
			o[i] = Rin.clone(elem[i]);
	}
	else
	{
		o = elem;
	}

	return o;
};


/**
**	Merges all given elements into the first one, object fields are cloned.
**
**	>> T merge (T... elems)
*/
Rin.merge = function (output, ...objs)
{
	if (Rin.typeOf(output) == "array")
	{
		for (let i = 0; i < objs.length; i++)
		{
			let arr = objs[i];

			if (Rin.typeOf(arr) != "array")
			{
				output.push(arr);
			}
			else
			{
				for (let j = 0; j < arr.length; j++)
				{
					output.push(Rin.clone(arr[j]));
				}
			}
		}
	}
	else if (Rin.typeOf(output) == "object")
	{
		for (let i = 0; i < objs.length; i++)
		{
			let obj = objs[i];
			if (Rin.typeOf(obj) != "object") continue;

			for (let field in obj)
			{
				if (Rin.isArrayOrObject(obj[field]))
				{
					if (field in output)
						Rin.merge(output[field], obj[field]);
					else
						output[field] = Rin.clone(obj[field]);
				}
				else
					output[field] = obj[field];
			}
		}
	}

	return output;
};


/**
**	Assigns all fields from the specified objects into the first one.
**
**	>> object override (object output, object... objs)
*/
Rin.override = function (output, ...objs)
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


/**
**	Traverses the given object attempting to find the index/key that does an identical match with the specified value,
**	if not found returns null, otherwise the index/key where the value was found.
**
**	>> int indexOf (array container, T value)
**	>> string indexOf (object container, T value)
*/
Rin.indexOf = function (container, value)
{
	for (let i in container)
	{
		if (container[i] == value)
			return i;
	}

	return null;
};


/**
**	Escapes a string using HTML entities.
**
**	>> string escape (string str);
*/
Rin.escape = function (str)
{
	return (str+"").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};


/**
**	Verifies if the specified object is of class m, if not it will create a new instance.
**
**	>> object ensureTypeOf (class m, object o);
*/
Rin.ensureTypeOf = function (m, o)
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


/**
**	Serializes an object and returns its JSON string representation.
**
**	>> string serialize (object o);
*/
Rin.serialize = function (o)
{
	return JSON.stringify(o);
};

/**
**	Deserializes a string in JSON format and returns an object.
**
**	>> object deserialize (string s);
*/
Rin.deserialize = function (s)
{
	return JSON.parse(s);
};


// *****************************************
Object.assign(exports, Rin);
