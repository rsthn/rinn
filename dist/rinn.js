function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
var $parcel$global =
typeof globalThis !== 'undefined'
  ? globalThis
  : typeof self !== 'undefined'
  ? self
  : typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
  ? global
  : {};
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire25d2"];
if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire25d2"] = parcelRequire;
}
parcelRequire.register("9yHY9", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $6f5965606422620f$export$2e2bcd8739ae039; });


var $fXZtT = parcelRequire("fXZtT");
var /**
**	Map of model constraint handlers. Each function should accept parameters (in order): the model object (model), the constraint value (ctval),
**	the property name (name), the property value (value) and return the corrected value once verified or throw an exception if errors occur.
*/ $6f5965606422620f$export$2e2bcd8739ae039 = {
    /**
	**	Utility function (not a handler) to get the real value given a reference string. If the value is not a string, the value itself will
	**	be returned, if it is a string starting with '#' the model property will be returned, if starts with '@' the object property will be
	**	returned, otherwise the contents of the string will eval'd and returned.
	*/ _getref: function(value, obj) {
        if (typeof value == "string") {
            if (value.substr(0, 1) == "#") value = obj.get(value.substr(1));
            else if (value.substr(0, 1) == "@") value = obj[value.substr(1)];
            if (typeof value == "string") return eval(value);
            return value;
        } else return value;
    },
    /**
	**	Verifies that the new value is of the valid type before storing it on the property. When possible if the
	**	input is of compatible type it will be converted to the target type.
	*/ type: function(model, ctval, name, value) {
        switch(ctval){
            case "int":
                value = parseInt(value);
                if (isNaN(value)) throw new Error(ctval);
                break;
            case "float":
                value = parseFloat(value);
                if (isNaN(value)) throw new Error(ctval);
                break;
            case "string":
                value = value === null || value === undefined ? "" : value.toString();
                break;
            case "bit":
                if (value === true || value === false) {
                    value = value ? 1 : 0;
                    break;
                }
                value = parseInt(value);
                if (isNaN(value)) throw new Error(ctval);
                value = value ? 1 : 0;
                break;
            case "array":
                if ($0f51e41db87486be$export$2e2bcd8739ae039.typeOf(value) == "array") break;
                if (value === null || value === undefined) {
                    value = [];
                    break;
                }
                throw new Error(ctval);
            case "bool":
                if (value === "true" || value === true) {
                    value = true;
                    break;
                }
                if (value === "false" || value === false) {
                    value = false;
                    break;
                }
                throw new Error(ctval);
        }
        return value;
    },
    /**
	**	Verifies that the field is of the specified model type.
	*/ model: function(model, ctval, name, value) {
        var mclass = this._getref(ctval, model);
        if (!mclass) throw new Error(ctval);
        if (!value) return new mclass();
        return mclass.ensure(value);
    },
    /**
	**	Verifies that the field is of the specified class.
	*/ cls: function(model, ctval, name, value) {
        var mclass = this._getref(ctval, model);
        if (!value) return new mclass();
        return $0f51e41db87486be$export$2e2bcd8739ae039.ensureTypeOf(mclass, value);
    },
    /**
	**	Verifies that the array contents are of the specified class. Returns error if the class does not exist
	**	or if the field is not an array. Therefore a type:array constraint should be used before this one.
	*/ arrayof: function(model, ctval, name, value) {
        var mclass = this._getref(ctval, model);
        if (!value) value = [];
        if (!mclass || $0f51e41db87486be$export$2e2bcd8739ae039.typeOf(value) != "array") throw new Error(ctval);
        for(var i = 0; i < value.length; i++)value[i] = $0f51e41db87486be$export$2e2bcd8739ae039.ensureTypeOf(mclass, value[i]);
        return value;
    },
    /**
	**	Verifies that the array contents are not null. Returns error if the field is not an array, therefore a
	**	type:array constraint should be used before this one.
	*/ arraynull: function(model, ctval, name, value) {
        var remove = false;
        if ($0f51e41db87486be$export$2e2bcd8739ae039.typeOf(ctval) == "object") {
            if (ctval.remove) remove = ctval.remove;
            ctval = ctval.value;
        }
        if (ctval) return value;
        if ($0f51e41db87486be$export$2e2bcd8739ae039.typeOf(value) != "array") throw new Error(ctval);
        for(var i = 0; i < value.length; i++)if (value[i] == null) {
            if (remove) value.splice(i--, 1);
            else throw new Error(ctval);
        }
        return value;
    },
    /**
	**	Verifies that the array contents are all compliant. Returns error if the field is not an array, therefore
	**	a type:array constraint should be used before this one.
	*/ arraycompliant: function(model, ctval, name, value) {
        var remove = false;
        if ($0f51e41db87486be$export$2e2bcd8739ae039.typeOf(ctval) == "object") {
            if (ctval.remove) remove = ctval.remove;
            ctval = ctval.value;
        }
        if (!ctval) return value;
        if ($0f51e41db87486be$export$2e2bcd8739ae039.typeOf(value) != "array") throw new Error(ctval);
        for(var i = 0; i < value.length; i++){
            if (value[i] == null) continue;
            if (!value[i].isCompliant()) {
                if (remove) value.splice(i--, 1);
                else throw new Error(ctval);
            }
        }
        return value;
    },
    /**
	**	Verifies the presense of the field.
	*/ required: function(model, ctval, name, value) {
        if (value === null || value === undefined) throw new Error(ctval ? "" : "null");
        switch($0f51e41db87486be$export$2e2bcd8739ae039.typeOf(value)){
            case "array":
                if (value.length == 0) throw new Error(ctval ? "" : "null");
                break;
            default:
                if (value.toString().length == 0) throw new Error(ctval ? "" : "null");
                break;
        }
        return value;
    },
    /**
	**	Verifies the minimum length of the field.
	*/ minlen: function(model, ctval, name, value) {
        if (value.toString().length < ctval) throw new Error(ctval);
        return value;
    },
    /**
	**	Verifies the maximum length of the field.
	*/ maxlen: function(model, ctval, name, value) {
        if (value.toString().length > ctval) throw new Error(ctval);
        return value;
    },
    /**
	**	Verifies the minimum value of the field.
	*/ minval: function(model, ctval, name, value) {
        if (parseFloat(value) < ctval) throw new Error(ctval);
        return value;
    },
    /**
	**	Verifies the maximum value of the field.
	*/ maxval: function(model, ctval, name, value) {
        if (parseFloat(value) > ctval) throw new Error(ctval);
        return value;
    },
    /**
	**	Verifies the minimum number of items in the array.
	*/ mincount: function(model, ctval, name, value) {
        if ($0f51e41db87486be$export$2e2bcd8739ae039.typeOf(value) != "array" || value.length < ctval) throw new Error(ctval);
        return value;
    },
    /**
	**	Verifies the maximum number of items in the array.
	*/ maxcount: function(model, ctval, name, value) {
        if ($0f51e41db87486be$export$2e2bcd8739ae039.typeOf(value) != "array" || value.length > ctval) throw new Error(ctval);
        return value;
    },
    /**
	**	Verifies the format of the field using a regular expression. The constraint value should be the name of
	**	one of the Model.Regex regular expressions.
	*/ pattern: function(model, ctval, name, value) {
        if (!$fXZtT.default[ctval].test(value.toString())) throw new Error(ctval);
        return value;
    },
    /**
	**	Verifies that the field is inside the specified set of options. The set can be an array or a string with
	**	the options separated by vertical bar (|). The comparison is case-sensitive.
	*/ inset: function(model, ctval, name, value) {
        if ($0f51e41db87486be$export$2e2bcd8739ae039.typeOf(ctval) != "array") {
            if (!new RegExp("^(" + ctval.toString() + ")$").test(value.toString())) throw new Error(ctval);
            return value;
        }
        if (ctval.indexOf(value.toString()) == -1) throw new Error(ctval.join("|"));
        return value;
    },
    /**
	**	Sets the field to upper case.
	*/ upper: function(model, ctval, name, value) {
        return ctval ? value.toString().toUpperCase() : value;
    },
    /**
	**	Sets the field to lower case.
	*/ lower: function(model, ctval, name, value) {
        return ctval ? value.toString().toLowerCase() : value;
    }
};

});
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
*/ let $0f51e41db87486be$var$Rinn = {
};
var $0f51e41db87486be$export$2e2bcd8739ae039 = $0f51e41db87486be$var$Rinn;
/*
**	Invokes the specified function 'fn' 10ms later.
**
**	>> void invokeLater (function fn);
*/ $0f51e41db87486be$var$Rinn.invokeLater = function(fn) {
    if (fn) setTimeout(function() {
        fn();
    }, 10);
};
/*
**	Waits for the specified amount of milliseconds. Returns a Promise.
**
**	>> Promise wait (int millis);
*/ $0f51e41db87486be$var$Rinn.wait = function(millis) {
    return new Promise(function(resolve, reject) {
        setTimeout(resolve, millis);
    });
};
/*
**	Returns the type of an element 'o', properly detects arrays and null types. The return string is always in lowercase.
**
**	>> string typeOf (any o);
*/ $0f51e41db87486be$var$Rinn.typeOf = function(o) {
    if (o instanceof Array) return "array";
    if (o === null) return "null";
    return (typeof o).toString().toLowerCase();
};
/*
**	Returns boolean indicating if the type of the element is an array or an object.
**
**	>> bool isArrayOrObject (any o);
*/ $0f51e41db87486be$var$Rinn.isArrayOrObject = function(o) {
    switch($0f51e41db87486be$var$Rinn.typeOf(o)){
        case "array":
        case "object":
            return true;
    }
    return false;
};
/*
**	Creates a clone (deep copy) of the specified element. The element can be an array, an object or a primitive type.
**
**	>> T clone (T elem);
*/ $0f51e41db87486be$var$Rinn.clone = function(elem) {
    let o = $0f51e41db87486be$var$Rinn.typeOf(elem);
    if (o === 'array') {
        o = [];
        for(let i = 0; i < elem.length; i++)o.push($0f51e41db87486be$var$Rinn.clone(elem[i]));
    } else if (o === 'object') {
        if ('clone' in elem && typeof elem.clone === 'function') return elem.clone();
        o = {
        };
        for(let i in elem)o[i] = $0f51e41db87486be$var$Rinn.clone(elem[i]);
    } else o = elem;
    return o;
};
/*
**	Merges all given elements into the first one, object fields are cloned.
**
**	>> T merge (T... elems)
*/ $0f51e41db87486be$var$Rinn.merge = function(output, ...objs) {
    if ($0f51e41db87486be$var$Rinn.typeOf(output) == "array") for(let i = 0; i < objs.length; i++){
        let arr = objs[i];
        if ($0f51e41db87486be$var$Rinn.typeOf(arr) != "array") output.push(arr);
        else for(let j = 0; j < arr.length; j++)output.push($0f51e41db87486be$var$Rinn.clone(arr[j]));
    }
    else if ($0f51e41db87486be$var$Rinn.typeOf(output) == "object") for(let i1 = 0; i1 < objs.length; i1++){
        let obj = objs[i1];
        if ($0f51e41db87486be$var$Rinn.typeOf(obj) != "object") continue;
        for(let field in obj)if ($0f51e41db87486be$var$Rinn.isArrayOrObject(obj[field])) {
            if (field in output) $0f51e41db87486be$var$Rinn.merge(output[field], obj[field]);
            else output[field] = $0f51e41db87486be$var$Rinn.clone(obj[field]);
        } else output[field] = obj[field];
    }
    return output;
};
/*
**	Assigns all fields from the specified objects into the first one.
**
**	>> object override (object output, object... objs)
*/ $0f51e41db87486be$var$Rinn.override = function(output, ...objs) {
    for(let i = 0; i < objs.length; i++)for(let j in objs[i])output[j] = objs[i][j];
    return output;
};
/*
**	Compares two objects and returns `true` if all properties in "partial" find a match in "full".
*/ $0f51e41db87486be$var$Rinn.partialCompare = function(full, partial) {
    if (full == null || partial == null) return false;
    if (full === partial) return true;
    for(var i in partial){
        if (full[i] != partial[i]) return false;
    }
    return true;
};
/*
**	Performs a partial search for an object (o) in the specified array and returns its index or `false` if the
**	object was not found. When `getObject` is set to `true` the object will be returned instead of an index, or
**	`null` if not found.
*/ $0f51e41db87486be$var$Rinn.arrayFind = function(arr, o, getObject) {
    for(var i = 0; arr && i < arr.length; i++){
        if (this.partialCompare(arr[i], o)) return getObject ? arr[i] : i;
    }
    return getObject ? null : false;
};
/*
**	Verifies if the specified object is of class `m`, returns boolean.
**
**	>> bool isTypeOf (object obj, class _class);
*/ $0f51e41db87486be$var$Rinn.isInstanceOf = function(obj, _class) {
    if (!obj || !_class || typeof obj !== 'object') return false;
    if (obj instanceof _class) return true;
    if ('isInstanceOf' in obj) return obj.isInstanceOf(_class);
    return false;
};
/*
**	Traverses the given object attempting to find the index/key that does an identical match with the specified value,
**	if not found returns -1, otherwise the index/key where the value was found.
**
**	>> int indexOf (array container, T value)
**	>> string indexOf (object container, T value)
*/ $0f51e41db87486be$var$Rinn.indexOf = function(container, value, forceArray = false) {
    if (forceArray) {
        for(let i = 0; i < container.length; i++){
            if (container[i] === value) return i;
        }
        return -1;
    }
    for(let i in container){
        if (container[i] === value) return i;
    }
    return -1;
};
/*
**	Escapes a string using HTML entities.
**
**	>> string escape (string str);
*/ $0f51e41db87486be$var$Rinn.escape = function(str) {
    return (str + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};
/*
**	Verifies if the specified object is of class `m`, if not it will create a new instance of `m` passing `o` as parameter.
**
**	>> object ensureTypeOf (class m, object o);
*/ $0f51e41db87486be$var$Rinn.ensureTypeOf = function(m, o) {
    if (!o || !m || o instanceof m) return o;
    if (o.isInstanceOf && m.prototype.className) {
        if (o.isInstanceOf(m.prototype.className)) return o;
    }
    return new m(o);
};
/*
**	Serializes an object and returns its JSON string representation.
**
**	>> string serialize (object o);
*/ $0f51e41db87486be$var$Rinn.serialize = function(o) {
    return JSON.stringify(o);
};
/*
**	Deserializes a string in JSON format and returns the result.
**
**	>> any deserialize (string s);
*/ $0f51e41db87486be$var$Rinn.deserialize = function(s) {
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
*/ $0f51e41db87486be$var$Rinn.hookAppend = function(object, functionName, newFunction, conditional = true) {
    const oldFunction = object[functionName];
    if (conditional) object[functionName] = function(...args) {
        if (oldFunction.apply(this, args) !== false) return newFunction.apply(this, args);
    };
    else object[functionName] = function(...args) {
        oldFunction.apply(this, args);
        return newFunction.apply(this, args);
    };
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
*/ $0f51e41db87486be$var$Rinn.hookPrepend = function(object, functionName, newFunction, conditional = true) {
    const oldFunction = object[functionName];
    if (conditional) object[functionName] = function(...args) {
        if (newFunction.apply(this, args) !== false) return oldFunction.apply(this, args);
    };
    else object[functionName] = function(...args) {
        newFunction.apply(this, args);
        return oldFunction.apply(this, args);
    };
    return {
        unhook: function() {
            object[functionName] = oldFunction;
        }
    };
};

parcelRequire.register("fXZtT", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $b9fc0e923c790392$export$2e2bcd8739ae039; });
var /*
**	rinn/model-regex.js
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
*/ /**
**	Common regular expressions for pattern validation.
*/ $b9fc0e923c790392$export$2e2bcd8739ae039 = {
    email: /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)+$/i,
    url: /^[\w-]+:\/\/[\w-]+(\.\w+)+.*$/,
    urlNoProt: /^[\w-]+(\.\w+)+.*$/,
    name: /^[-A-Za-z0-9_.]+$/,
    uname: /^['\pL\pN ]+$/,
    text: /^[^&<>{}]*$/,
    utext: /^([\r\n\pL\pN\pS &!@#$%*\[\]()_+=;',.\/?:"~-]+)$/
};

});




/*
**	Base class used to easily create classes and sub-classes with complex multiple inheritance and
**	support for calls to parent class methods.
*/ let $c7e541a58a884fff$var$Class = function() {
};
var $c7e541a58a884fff$export$2e2bcd8739ae039 = $c7e541a58a884fff$var$Class;
/*
**	Reference to the class itself.
*/ $c7e541a58a884fff$var$Class._class = $c7e541a58a884fff$var$Class;
/*
**	Contains the methods of each of the super classes.
*/ $c7e541a58a884fff$var$Class._super = {
};
/*
**	Name of the class, if none specified the class will be considered "final" and will not be inheritable.
*/ $c7e541a58a884fff$var$Class.prototype.className = 'Class';
/*
**	Class constructor, should initialize the state of the instance. Invoked when the `new` keyword is used with the class.
*/ $c7e541a58a884fff$var$Class.prototype.__ctor = function() {
};
/*
**	Class destructor, should clear the instance state and release any used resources, invoked when the global `dispose`
**	function is called with the instance as parameter.
*/ $c7e541a58a884fff$var$Class.prototype.__dtor = function() {
};
/*
**	Returns true if the object is an instance of the specified class (verifies inheritance), the parameter can be a class
**	name, a class constructor or a class instance, in any case the appropriate checks will be done.
**
**	>> bool isInstanceOf (string className);
**	>> bool isInstanceOf (constructor classConstructor);
**	>> bool isInstanceOf (object classInstance);
*/ $c7e541a58a884fff$var$Class.prototype.isInstanceOf = function(className) {
    className = $0f51e41db87486be$export$2e2bcd8739ae039.typeOf(className) === 'string' ? className : className.prototype ? className.prototype.className : className.constructor.prototype.className;
    return className in this._super ? true : this.className === className;
};
/*
**	Internal method to ensure the _super field of an instance has all functions properly bound to the instance.
**
**	>> void _initSuperRefs ();
*/ $c7e541a58a884fff$var$Class.prototype._initSuperRefs = function() {
    let _super = this.constructor._super;
    let _newSuper = {
    };
    const self = this;
    for(let i in _super){
        let o = {
        };
        let _prot = _super[i].prototype;
        for(let j in _prot){
            if ($0f51e41db87486be$export$2e2bcd8739ae039.typeOf(_prot[j]) !== 'function') continue;
            o[j] = (function(fn) {
                return function(a00, a01, a02, a03, a04, a05, a06, a07, a08, a09, a0A) {
                    return fn.call(self, a00, a01, a02, a03, a04, a05, a06, a07, a08, a09, a0A);
                };
            })(_prot[j]);
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
*/ $c7e541a58a884fff$var$Class.inherit = function(proto) {
    let self = this._class;
    let _super = self._super;
    let _class = self._class;
    if ($0f51e41db87486be$export$2e2bcd8739ae039.typeOf(proto) === 'function') {
        // Move constants (uppercased properties) to the class-level instead of prototype-level.
        for(let i in proto._class)if (!/^[A-Z]/.test(i)) self[i] = proto._class[i];
        // Combine methods and properties.
        $0f51e41db87486be$export$2e2bcd8739ae039.override(self.prototype, proto._class.prototype);
        // Combine super references.
        $0f51e41db87486be$export$2e2bcd8739ae039.override(_super, proto._class._super);
        // Add new super reference if className specified in inherited prototypes.
        if (proto._class.prototype.className) _super[proto._class.prototype.className] = proto._class;
    } else $0f51e41db87486be$export$2e2bcd8739ae039.override(self.prototype, proto);
    self._super = _super;
    self._class = _class;
    return self;
};
/*
**	Internal method used to extend a class with one or more prototypes.
**
**	>> class _extend (object base, object[] protos);
*/ $c7e541a58a884fff$var$Class.prototype._extend = function(base, protos) {
    if (protos.length === 0) return base;
    //VIOLET OPTIMIZE
    const _class = function(...args) {
        this._initSuperRefs();
        this.__ctor.apply(this, args);
    };
    _class._class = _class;
    _class._super = {
    };
    $c7e541a58a884fff$var$Class.inherit.call(_class, base);
    delete _class.prototype.className;
    for(let i = 0; i < protos.length; i++)_class.inherit(protos[i]);
    delete _class._super.Class;
    if ('classInit' in _class.prototype) _class.prototype.classInit();
    _class.isInstance = function(value) {
        return $0f51e41db87486be$export$2e2bcd8739ae039.isInstanceOf(value, _class);
    };
    return _class;
};
/*
**	Creates a new class with the specified prototypes each of which can be a class constructor or an object.
**
**	>> constructor extend (object... protos);
*/ $c7e541a58a884fff$var$Class.extend = function(...protos) {
    return this._class.prototype._extend(this, protos);
};
/*
**	Creates a new instance of a class resulting from extending the self class with the specified prototype.
**
**	>> object create (object proto);
*/ $c7e541a58a884fff$var$Class.create = function(proto) {
    return new (this.extend(proto))();
};




var /**
**	Holds the information about a triggered event. It also provides a mechanism to allow asynchronous
**	event propagation to ensure the event chain order.
*/ $ee3ff522d1793c65$export$2e2bcd8739ae039 = $c7e541a58a884fff$export$2e2bcd8739ae039.extend({
    /**
	**	Name of the class.
	*/ className: "Event",
    /**
	**	Source of the event.
	*/ source: null,
    /**
	**	Name of the event.
	*/ name: null,
    /**
	**	Arguments of the event.
	*/ args: null,
    /**
	**	Indicates if the last event handler wants to use async mode.
	*/ _async: false,
    /**
	**	Queue of all handlers to invoke.
	*/ list: null,
    /**
	**	Next event to be executed in the event chain.
	*/ next: null,
    /**
	**	Return values from event handlers.
	*/ ret: null,
    /**
	**	Original root event.
	*/ original: null,
    /**
	**	Index of the current event handler.
	*/ i: -1,
    /**
	**	Contructs an event object with the specified parameters. Source is the event-dispatcher object, list is
	**	an array with all the listeners to invoke. The eventName and eventArgs are the event information to be
	**	passed to each handler and if a callback is specified (cbHandler+cbContext) it will be executed once all
	**	the event handlers have been processed.
	**
	**	Event __ctor (source: EventDispatcher, list: Array, eventName: string, eventArgs: map, cbHandler: function, cbContext: object);
	*/ __ctor: function(source, list, eventName, eventArgs, cbHandler, cbContext) {
        this.source = source;
        this.name = eventName;
        this.args = eventArgs;
        this.cbHandler = cbHandler;
        this.cbContext = cbContext;
        this.list = list;
        this.reset();
    },
    /**
	**	Resets the event to its initial state. An event object can be reused by resetting it and then
	**	invoking the resume event.
	**
	**	Event reset ();
	*/ reset: function() {
        this.next = null;
        this.ret = [];
        this._async = false;
        this.i = -1;
        return this;
    },
    /**
	**	Changes the source of the event.
	**
	**	Event setSource (object value);
	*/ setSource: function(value) {
        this.source = value;
        return this;
    },
    /**
	**	Sets the internal asynchronous flag. Should be called before a handler returns. If a handler
	**	calls this method it should also call resume() when async operations are finished.
	**
	**	Event wait ();
	*/ wait: function() {
        this._async = true;
        return this;
    },
    /**
	**	Resumes event propagation. Should be called manually by event handlers that also call wait().
	**
	**	Event resume ();
	*/ resume: function() {
        this._async = false;
        while(!this._async){
            if (++this.i >= this.list.length) break;
            if (this.list[this.i].silent) continue;
            if ($0f51e41db87486be$export$2e2bcd8739ae039.typeOf(this.list[this.i].handler) == "string") {
                if (this.list[this.i].context) {
                    if (!this.list[this.i].context[this.list[this.i].handler]) continue;
                    if (this.list[this.i].context[this.list[this.i].handler](this, this.args, this.list[this.i].data) === false) break;
                } else {
                    if ($parcel$global[this.list[this.i].handler].call(null, this, this.args, this.list[this.i].data) === false) break;
                }
            } else {
                if (this.list[this.i].handler.call(this.list[this.i].context, this, this.args, this.list[this.i].data) === false) break;
            }
        }
        if (this._async) return this;
        if (this.i >= this.list.length && this.next) this.next.resume();
        if (this.cbHandler) this.cbHandler.call(this.cbContext);
        return this;
    },
    /**
	**	Sets the "original" property of the event to indicate where the original event comes from.
	**
	**	Event from (event: Event);
	*/ from: function(event) {
        this.original = event;
        return this;
    },
    /**
	**	Enqueues the specified event to be executed upon the current event process is finished. The "original"
	**	property of the chained event will be set to the current event.
	**
	**	Event enqueueEvent (event: Event);
	*/ enqueue: function(event) {
        if (!event) return this;
        var evt;
        for(evt = this; evt.next != null; evt = evt.next);
        evt.next = event;
        event.from(this);
        return this;
    }
});




var /**
**	Event dispatcher allows several event listeners to be attached, these will be invoked whenever the
**	event that is being listened to is triggered.
*/ $e33703b9a5d260e3$export$2e2bcd8739ae039 = $c7e541a58a884fff$export$2e2bcd8739ae039.extend({
    /**
	**	Name of the class.
	*/ className: "EventDispatcher",
    /**
	**	Listeners attached to this event dispatcher. Grouped by event name.
	*/ listeners: null,
    /**
	**	Namespace for event dispatching. Defaults to null. Can be modified using setNamespace().
	*/ namespace: null,
    /**
	**	Initializes the event dispatcher.
	**
	**	EventDispatcher __ctor ();
	*/ __ctor: function() {
        this.listeners = {
        };
    },
    /**
	**	Sets the event dispatching namespace. Used to force all events dispatched to have the specified namespace.
	**
	**	EventDispatcher setNamespace (value: string);
	*/ setNamespace: function(value) {
        this.namespace = value;
        return this;
    },
    /**
	**	Adds an event listener for a specified event to the event dispatcher. The event name can have an optional
	**	namespace indicator which is added to the beginning of the event name and separated using a colon (:). This
	**	indicator can be used to later trigger or remove all handlers of an specific namespace.
	**
	**	EventDispatcher addEventListener (eventName: string, handler: function, context: object, data: object);
	*/ addEventListener: function(eventName, handler, context, data) {
        eventName = eventName.split(":");
        var name = eventName[eventName.length - 1];
        var ns = eventName.length > 1 ? eventName[0] : null;
        if (!this.listeners[name]) this.listeners[name] = [];
        this.listeners[name].push({
            ns: ns,
            handler: handler,
            context: context,
            data: data,
            silent: 0
        });
        return this;
    },
    /**
	**	Removes an event listener from the event dispatcher. If only the name is provided all handlers with the
	**	specified name will be removed. If a context is provided without a handler then any handler matching the
	**	context will be removed. Special event name "*" can be used to match all event names.
	**
	**	EventDispatcher removeEventListener (eventName: string, handler: function, context: object);
	*/ removeEventListener: function(eventName, handler, context) {
        eventName = eventName.split(":");
        var name = eventName[eventName.length - 1];
        var ns = eventName.length > 1 ? eventName[0] : null;
        if (name == "*") for(var j in this.listeners){
            var list = this.listeners[j];
            for(var i = 0; i < list.length; i++){
                var k = true;
                if (handler) k = k && list[i].handler === handler;
                if (context) k = k && list[i].context === context;
                if (ns) k = k && list[i].ns == ns;
                if (k) list.splice(i--, 1);
            }
        }
        else {
            if (!this.listeners[name]) return this;
            var list = this.listeners[name];
            for(var i = 0; i < list.length; i++){
                var k = true;
                if (handler) k = k && list[i].handler === handler;
                if (context) k = k && list[i].context === context;
                if (ns) k = k && list[i].ns == ns;
                if (k) list.splice(i--, 1);
            }
        }
        return this;
    },
    /**
	**	Prepares an event with the specified parameters for its later usage. The event is started when
	**	the resume() method is called. If a callback is specified it will be executed once all event
	**	handlers have been processed.
	**
	**	Event prepareEvent (eventName: string, eventArgs: map, cbHandler: function, cbContext: object);
	**	Event prepareEvent (eventName: string, eventArgs: map);
	*/ prepareEvent: function(eventName, eventArgs, cbHandler, cbContext) {
        var list = [];
        eventName = eventName.split(":");
        var name = eventName[eventName.length - 1];
        var ns = eventName.length > 1 ? eventName[0] : null;
        if (this.listeners[name]) list = list.concat(this.listeners[name]);
        if (this.listeners["*"]) list = list.concat(this.listeners["*"]);
        for(var i = 0; i < list.length; i++)if (list[i].silent) list.splice(i--, 1);
        if (ns) {
            for(var i = 0; i < list.length; i++)if (list[i].ns != ns) list.splice(i--, 1);
        }
        return new $ee3ff522d1793c65$export$2e2bcd8739ae039(this, list, name, eventArgs, cbHandler, cbContext);
    },
    /**
	**	Silences or unsilences all handlers attached to an event such that if the event fires the handler(s) will
	**	not be invoked. It is recommended to use a namespace to ensure other handlers will continue to be run.
	**
	**	EventDispatcher silence (eventName: string);
	*/ silence: function(eventName, value) {
        eventName = eventName.split(":");
        var name = eventName[eventName.length - 1];
        var ns = eventName.length > 1 ? eventName[0] : null;
        value = value === false ? -1 : 1;
        if (name == "*") for(var j in this.listeners){
            var list = this.listeners[j];
            for(var i = 0; i < list.length; i++){
                if (ns && list[i].ns != ns) continue;
                list[i].silent += value;
            }
        }
        else {
            if (!this.listeners[name]) return this;
            var list = this.listeners[name];
            for(var i = 0; i < list.length; i++){
                if (ns && list[i].ns != ns) continue;
                list[i].silent += value;
            }
        }
        return this;
    },
    /**
	**	Dispatches an event to the respective listeners. If a callback is specified it will be executed once
	**	all event handlers have been processed.
	**
	**	Event dispatchEvent (eventName: string, eventArgs: map, cbHandler: function, cbContext: object);
	**	Event dispatchEvent (eventName: string, eventArgs: map);
	*/ dispatchEvent: function(eventName, eventArgs, cbHandler, cbContext) {
        return this.prepareEvent(this.namespace ? this.namespace + ':' + eventName : eventName, eventArgs, cbHandler, cbContext).resume();
    }
});





var $9yHY9 = parcelRequire("9yHY9");
/**
**	A model is a high-integrity data object used to store properties and more importantly to provide event support to notify of any
**	kind of change that occurs to the model's properties. Integrity of the model is maintained by optionally using property constraints.
*/ let $f423a1a212f33228$var$_Model = $e33703b9a5d260e3$export$2e2bcd8739ae039.extend({
    /**
	**	Name of the class.
	*/ className: "Model",
    /**
	**	Default properties for the model. Can be a map with the property name and its default value or a function
	**	returning a map with dynamic default values. This is used to reset the model to its initial state.
	*/ defaults: null,
    /**
	**	Model property contraints. A map with the property name and an object specifying the constraints of the
	**	property. This is used to determine the type, format and behavior of each property in the model.
	*/ constraints: null,
    /**
	**	Properties of the model.
	*/ data: null,
    /**
	**	Array with the name of the properties that have changed. Populated prior modelChanged event.
	*/ changedList: null,
    /**
	**	Silent mode indicator. While in silent mode events will not be dispatched.
	*/ _silent: 0,
    /**
	**	Current nesting level of the set() method. This is used to determine when all the property
	**	changes are done.
	*/ _level: 0,
    /**
	**	Initializes the model and sets the properties to the specified data object.
	**
	**	>> Model __ctor (object data);
	**	>> Model __ctor (object data, object defaults);
	*/ __ctor: function(data, defaults) {
        this._super.EventDispatcher.__ctor();
        this.data = {
        };
        if (defaults != null) this.reset(defaults, false);
        else {
            let o = null;
            if (!this.defaults && this.constraints) {
                o = {
                };
                for(let i in this.constraints){
                    let j = this.constraints[i];
                    if (j.def === null || j.def === undefined) {
                        o[i] = null;
                        continue;
                    }
                    if (typeof j.def === 'function') o[i] = j.def();
                    else o[i] = j.def;
                }
            }
            this.reset(o);
        }
        this.init();
        if (data != null) this.set(data, true);
        if (this.constraints) this.update();
        this.ready();
    },
    /**
	**	Resets the model to its default state and triggers update events. If a map is provided the defaults of
	**	the model will be set to the specified map.
	**
	**	>> Model reset (object defaults, [bool nsilent=true]);
	**	>> Model reset ([bool nsilent=true]);
	*/ reset: function(defaults, nsilent) {
        if (!this.defaults) {
            if (!defaults || $0f51e41db87486be$export$2e2bcd8739ae039.typeOf(defaults) !== 'object' && $0f51e41db87486be$export$2e2bcd8739ae039.typeOf(defaults) !== 'function') return this;
            this.defaults = defaults;
        }
        if ($0f51e41db87486be$export$2e2bcd8739ae039.typeOf(this.defaults) === 'function') this.data = this.defaults();
        else this.data = $0f51e41db87486be$export$2e2bcd8739ae039.clone(this.defaults);
        return nsilent === false || defaults === false ? this : this.update(null, true);
    },
    /**
	**	Initializes the model. Called before the model properties are set.
	**
	**	>> void init ();
	*/ init: function() {
    },
    /**
	**	Initialization epilogue. Called after initialization and after model properties are set.
	**
	**	>> void ready ();
	*/ ready: function() {
    },
    /**
	**	Enables or disables silent mode. When the model is in silent mode events will not be dispatched.
	**
	**	>> Model silent (value: bool);
	*/ silent: function(value) {
        this._silent += value ? 1 : -1;
        return this;
    },
    /**
	**	Validates a property name and value against the constraints defined in the model (if any). Returns the
	**	final value if successful or throws an empty exception if errors occur.
	**
	**	>> T _validate (string name, T value);
	*/ _validate: function(name, value) {
        if (!this.constraints || !this.constraints[name]) return value;
        var constraints = this.constraints[name];
        var nvalue = value;
        for(var ctname in constraints){
            if (!$f423a1a212f33228$var$_Model.Constraints[ctname]) continue;
            try {
                nvalue = $f423a1a212f33228$var$_Model.Constraints[ctname](this, constraints[ctname], name, nvalue);
            } catch (e) {
                if (e.message == "null") break;
                throw new Error(`Constraint [${ctname}:${constraints[ctname]}] failed on property '${name}'.`);
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
	*/ _set: function(name, value) {
        if (!this.constraints || !this.constraints[name]) {
            this.data[name] = value;
            return value;
        }
        var constraints = this.constraints[name];
        var cvalue = this.data[name];
        var nvalue = value;
        for(var ctname in constraints){
            if (!$f423a1a212f33228$var$_Model.Constraints[ctname]) continue;
            try {
                nvalue = $f423a1a212f33228$var$_Model.Constraints[ctname](this, constraints[ctname], name, nvalue);
            } catch (e) {
                if (e.message == "null") break;
                if (!this._silent) this.dispatchEvent("constraintError", {
                    constraint: ctname,
                    message: e.message,
                    name: name,
                    value: value
                });
                break;
            }
        }
        return this.data[name] = nvalue;
    },
    /**
	**	Triggers property events to indicate a property is changing. First triggers "propertyChanging" and then
	**	"propertyChanged". If the first event returns false the second event will not be triggered.
	**
	**	>> void _propertyEvent (string name, T prev, T value, bool direct=false);
	*/ _propertyEvent: function(name, prev, value, direct) {
        var temp = {
            name: name,
            old: prev,
            value: value,
            level: this._level
        };
        var evt = this.dispatchEvent("propertyChanging", temp);
        if (!direct) temp.value = this._set(name, temp.value);
        else this.data[name] = temp.value;
        if (evt != null && evt.ret.length && evt.ret[0] === false) return;
        this.dispatchEvent("propertyChanged." + name, temp);
        this.dispatchEvent("propertyChanged", temp);
        this.changedList.push(name);
    },
    /**
	**	Sets one or more properties of the model. Possible arguments can be two strings or a map.
	**
	**	>> Model set (string name, T value, bool force=true);
	**	>> Model set (string name, T value, bool silent=false);
	**	>> Model set (string name, T value);
	**	>> Model set (object data);
	*/ set: function() {
        var n = arguments.length;
        var force = false, silent = false;
        if ((n > 2 || n == 2 && $0f51e41db87486be$export$2e2bcd8739ae039.typeOf(arguments[0]) == "object") && $0f51e41db87486be$export$2e2bcd8739ae039.typeOf(arguments[n - 1]) == "boolean") {
            force = arguments[--n];
            if (force === false) silent = true;
        }
        if (this._level == 0) this.changedList = [];
        this._level++;
        if (n == 2) {
            if (this.data[arguments[0]] != arguments[1] || force) {
                if (!this._silent && !silent) this._propertyEvent(arguments[0], this.data[arguments[0]], this._validate(arguments[0], arguments[1]));
                else this._set(arguments[0], arguments[1]);
            }
        } else {
            for(var i in arguments[0])if (this.data[i] != arguments[0][i] || force) {
                if (!this._silent && !silent) this._propertyEvent(i, this.data[i], this._validate(i, arguments[0][i]));
                else this._set(i, arguments[0][i]);
            }
        }
        if (!--this._level && this.changedList.length && !silent && !this._silent) this.dispatchEvent("modelChanged", {
            fields: this.changedList
        });
        return this;
    },
    /**
	**	Returns true if the given key exists in the model.
	**
	**	>> boolean has (string name);
	*/ has: function(name) {
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
	*/ get: function(name, def) {
        if (arguments.length == 0 || name === false) return this.data;
        if (arguments.length == 1 && name === true) return this.flatten();
        if (arguments.length == 2) return this.data[name] === undefined ? def : this.data[name];
        return this.data[name];
    },
    /**
	**	Returns the value of a property as an integer number.
	**
	**	>> int getInt (string name, [int def]);
	*/ getInt: function(name, def) {
        if (arguments.length == 2) return this.data[name] === undefined ? def : parseInt(this.data[name]);
        return parseInt(this.data[name]);
    },
    /**
	**	Returns the value of a property as a floating point number.
	**
	**	>> float getFloat (string name, [float def]);
	*/ getFloat: function(name, def) {
        if (arguments.length == 2) return this.data[name] === undefined ? def : parseFloat(this.data[name]);
        return parseFloat(this.data[name]);
    },
    /**
	**	Returns the value of a property as a boolean value (true or false).
	**
	**	>> bool getBool (string name, [bool def]);
	**	
	*/ getBool: function(name, def) {
        if (arguments.length == 2) name = this.data[name] === undefined ? def : this.data[name];
        else name = this.data[name];
        if (name === "true" || name === true) return true;
        if (name === "false" || name === false) return false;
        return parseInt(name) ? true : false;
    },
    /**
	**	Returns a reference object for a model property. The resulting object contains two methods
	**	named "get" and "set" to modify the value of the property.
	**
	**	>> object getReference (string name);
	*/ getReference: function(name) {
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
	*/ constraint: function(field, constraint, value) {
        if (arguments.length == 3 || arguments.length == 2 || arguments.length == 1 && $0f51e41db87486be$export$2e2bcd8739ae039.typeOf(field) == "object") {
            if (this.constraints === this.constructor.prototype.constraints) this.constraints = $0f51e41db87486be$export$2e2bcd8739ae039.clone(this.constraints);
            switch(arguments.length){
                case 1:
                    $0f51e41db87486be$export$2e2bcd8739ae039.override(this.constraints, field);
                    break;
                case 2:
                    $0f51e41db87486be$export$2e2bcd8739ae039.override(this.constraints[field], constraint);
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
	*/ flatten: function(safe, rsafe) {
        if (safe) {
            var data = this.flatten(false, true);
            if (data == null) return null;
            data["class"] = this.classPath;
            return data;
        }
        if (!this.constraints && !this.defaults) return this.data;
        if (!this.isCompliant()) return {
        };
        var constraints = this.constraints;
        var keys = this.defaults ? $0f51e41db87486be$export$2e2bcd8739ae039.typeOf(this.defaults) == "function" ? this.defaults() : this.defaults : this.constraints;
        var data = {
        };
        for(var i in this.data){
            if (!(i in keys)) continue;
            if (constraints && constraints[i]) {
                var ct = constraints[i];
                if (ct.model) {
                    data[i] = this.data[i] ? this.data[i].flatten(rsafe) : null;
                    continue;
                }
                if (ct.arrayof) {
                    data[i] = [];
                    for(var j = 0; j < this.data[i].length; j++)data[i][j] = this.data[i][j] ? this.data[i][j].flatten(rsafe) : null;
                    continue;
                }
                if (ct.cls) {
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
	*/ remove: function(name, nsilent) {
        if ($0f51e41db87486be$export$2e2bcd8739ae039.typeOf(name) == "array") {
            for(var i = 0; i < name.length; i++)delete this.data[name[i]];
            if (nsilent !== false && !this._silent) this.dispatchEvent("propertyRemoved", {
                fields: name
            });
        } else {
            delete this.data[name];
            if (nsilent !== false && !this._silent) this.dispatchEvent("propertyRemoved", {
                fields: [
                    name
                ]
            });
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
	*/ update: function(fields, direct) {
        if (this._silent) return this;
        if (this._level == 0) this.changedList = [];
        this._level++;
        if (fields && $0f51e41db87486be$export$2e2bcd8739ae039.typeOf(fields) == 'string') this._propertyEvent(fields, this.data[fields], this.data[fields], direct);
        else if (fields && $0f51e41db87486be$export$2e2bcd8739ae039.typeOf(fields) == 'array') for (var i of fields)this._propertyEvent(i, this.data[i], this.data[i], direct);
        else for(var i in this.data)this._propertyEvent(i, this.data[i], this.data[i], direct);
        if (!--this._level && !this._silent && (this.changedList.length != 0 || fields === true)) this.dispatchEvent("modelChanged", {
            fields: this.changedList
        });
        return this;
    },
    /**
	**	Validates one or mode model properties using the defined constraints. If no parameters are provided all of
	**	the properties in the model will be validated.
	**
	**	>> Model validate (array fields);
	**	>> Model validate (string name);
	**	>> Model validate ();
	*/ validate: function(fields) {
        if (!this.constraints) return this;
        if (fields && $0f51e41db87486be$export$2e2bcd8739ae039.typeOf(fields) == "string") this._set(fields, this.data[fields]);
        else for(var i in this.data){
            if (fields && $0f51e41db87486be$export$2e2bcd8739ae039.indexOf(fields, i) == -1) continue;
            this._set(i, this.data[i]);
        }
        return this;
    },
    /**
	**	Validates all the properties in the model and returns a boolean indicating if all of them comply with the
	**	constraints defined in the model.
	**
	**	>> bool isCompliant ();
	*/ isCompliant: function() {
        if (!this.constraints) return true;
        try {
            for(var i in this.data)this._validate(i, this.data[i]);
            return true;
        } catch (e) {
        }
        return false;
    },
    /**
	**	Registers an event handler for changes in a specific property of the model.
	**
	**	>> void observe (string property, function handler, object context);
	*/ observe: function(property, handler, context) {
        this.addEventListener("propertyChanged." + property, handler, context);
    },
    /**
	**	Unregisters an event handler from changes in a specific property of the model.
	**
	**	>> void unobserve (string property, function handler, object context);
	*/ unobserve: function(property, handler, context) {
        this.removeEventListener("propertyChanged." + property, handler, context);
    },
    /**
	**	Adds a propertyChanged event handler for the given property. The property name can have an event namespace prepended and separated by colon.
	**
	**	>> void watch (string property, function handler);
	*/ watch: function(property, handler) {
        property = property.split(':');
        if (property.length == 1) {
            property[1] = property[0];
            property[0] = 'watch';
        }
        this.addEventListener(property[0] + ":propertyChanged." + property[1], function(evt, args) {
            handler(args.value, args, evt);
        });
    },
    /**
	**	Removes propertyChanged handlers related to the specified property. The property name can have an event namespace prepended and separated by colon.
	**
	**	>> void unwatch (string property);
	*/ unwatch: function(property) {
        property = property.split(':');
        if (property.length == 1) {
            property[1] = property[0];
            property[0] = 'watch';
        }
        this.removeEventListener(property[0] + ":propertyChanged." + property[1]);
    },
    /**
	**	Serializes the model into a string.
	**
	**	string toString ();
	*/ toString: function() {
        return $0f51e41db87486be$export$2e2bcd8739ae039.serialize(this.get(true));
    }
});
$f423a1a212f33228$var$_Model.Constraints = $9yHY9.default;
var $f423a1a212f33228$export$2e2bcd8739ae039 = $f423a1a212f33228$var$_Model;




var /**
**	Generic list for models.
*/ $f0845037318ac40a$export$2e2bcd8739ae039 = $f423a1a212f33228$export$2e2bcd8739ae039.extend({
    /**
	**	Name of the class.
	*/ className: "ModelList",
    /**
	**	Class of the items in the list, can be overriden by child classes to impose a more strict constraint.
	*/ itemt: $f423a1a212f33228$export$2e2bcd8739ae039,
    /**
	**	Mirror of data.contents
	*/ contents: null,
    /**
	**	IDs of every item in the contents.
	*/ itemId: null,
    /**
	**	Autoincremental ID for the next item to be added.
	*/ nextId: null,
    /**
	**	Default properties of the model.
	*/ defaults: {
        contents: null
    },
    /**
	**	Constraints of the model to ensure integrity.
	*/ constraints: {
        contents: {
            type: "array",
            arrayof: "@itemt"
        }
    },
    /**
	**	Constructor.
	*/ __ctor: function(...args) {
        this.itemId = [];
        this.nextId = 0;
        this._super.Model.__ctor(...args);
    },
    /**
	**	Initialization epilogue. Called after initialization and after model properties are set.
	*/ ready: function() {
        this._eventGroup = "ModelList_" + Date.now() + ":modelChanged";
        this.contents = this.data.contents;
    },
    /**
	**	Connects the event handlers to the item.
	**
	**	>> Model _bind (int iid, Model item);
	*/ _bind: function(iid, item) {
        if (item && item.addEventListener) item.addEventListener(this._eventGroup, this._onItemEvent, this, iid);
        return item;
    },
    /**
	**	Disconnects the event handlers from the item.
	**
	**	>> Model _unbind (Model item);
	*/ _unbind: function(item) {
        if (item && item.removeEventListener) item.removeEventListener(this._eventGroup);
        return item;
    },
    /**
	**	Handler for item events.
	**
	**	>> Model _onItemEvent (Event evt, object args, int iid);
	*/ _onItemEvent: function(evt, args, iid) {
        this.prepareEvent("itemChanged", {
            id: iid,
            item: evt.source
        }).from(evt).enqueue(this.prepareEvent("modelChanged", {
            fields: [
                "contents"
            ]
        })).resume();
    },
    /**
	**	Returns the number of items in the list.
	**
	**	>> int length ();
	*/ length: function() {
        return this.data.contents.length;
    },
    /**
	**	Clears the contents of the list.
	**
	**	>> void clear ();
	*/ clear: function() {
        for(var i = 0; i < this.data.contents; i++)this._unbind(this.data.contents[i]);
        this.itemId = [];
        this.nextId = 0;
        this.contents = this.data.contents = [];
        this.prepareEvent("itemsCleared").enqueue(this.prepareEvent("modelChanged", {
            fields: [
                "contents"
            ]
        })).resume();
        return this;
    },
    /**
	**	Sets the contents of the list with the specified array. All items will be ensured to be of the same model
	**	type as the one specified in the list.
	**
	**	>> ModelList setData (array data);
	*/ setData: function(data) {
        this.clear();
        if (!data) return this;
        for(var i = 0; i < data.length; i++){
            var item = $0f51e41db87486be$export$2e2bcd8739ae039.ensureTypeOf(this.itemt, data[i]);
            this.itemId.push(this.nextId++);
            this.data.contents.push(item);
            this._bind(this.nextId - 1, item);
        }
        this.prepareEvent("itemsChanged").enqueue(this.prepareEvent("modelChanged", {
            fields: [
                "contents"
            ]
        })).resume();
        return this;
    },
    /**
	**	Returns the raw array contents of the list.
	**
	**	>> array getData ();
	*/ getData: function() {
        return this.data.contents;
    },
    /**
	**	Returns the item at the specified index or null if the index is out of bounds.
	**
	**	>> Model getAt (int index);
	*/ getAt: function(index) {
        if (index < 0 || index >= this.data.contents.length) return null;
        return this.data.contents[index];
    },
    /**
	**	Removes and returns the item at the specified index. Returns null if the index is out of bounds.
	**
	**	>> Model removeAt (int index);
	*/ removeAt: function(index) {
        if (index < 0 || index >= this.data.contents.length) return null;
        let item = this.data.contents.splice(index, 1)[0];
        let id = this.itemId.splice(index, 1)[0];
        this._unbind(item);
        this.prepareEvent("itemRemoved", {
            id: id,
            item: item
        }).enqueue(this.prepareEvent("modelChanged", {
            fields: [
                "contents"
            ]
        })).resume();
        return item;
    },
    /**
	**	Sets the item at the specified index. Returns false if the index is out of bounds, true otherwise. The
	**	item will be ensured to be of the model defined in the list.
	**
	**	>> bool setAt (int index, Model item);
	*/ setAt: function(index, item) {
        if (index < 0 || index >= this.data.contents.length) return false;
        item = $0f51e41db87486be$export$2e2bcd8739ae039.ensureTypeOf(this.itemt, item);
        this._unbind(this.data.contents[index]);
        this.data.contents[index] = item;
        this._bind(this.itemId[index], item);
        this.prepareEvent("itemChanged", {
            id: this.itemId[index],
            item: item
        }).enqueue(this.prepareEvent("modelChanged", {
            fields: [
                "contents"
            ]
        })).resume();
        return true;
    },
    /**
	**	Notifies a change in the item at the specified index. Returns false if the index is out of bounds.
	**
	**	>> bool updateAt (int index);
	*/ updateAt: function(index) {
        if (index < 0 || index >= this.data.contents.length) return false;
        this.prepareEvent("itemChanged", {
            id: this.itemId[index],
            item: this.data.contents[index]
        }).enqueue(this.prepareEvent("modelChanged", {
            fields: [
                "contents"
            ]
        })).resume();
        return true;
    },
    /**
	**	Adds an item to the bottom of the list. Returns null if the item is not an object or a model. The item
	**	will be ensured to be of the model specified in the list.
	**
	**	>> Model push (Model item);
	*/ push: function(item) {
        if (item && $0f51e41db87486be$export$2e2bcd8739ae039.typeOf(item) != "object") return null;
        item = $0f51e41db87486be$export$2e2bcd8739ae039.ensureTypeOf(this.itemt, item);
        this.itemId.push(this.nextId++);
        this.data.contents.push(item);
        this._bind(this.nextId - 1, item);
        this.prepareEvent("itemAdded", {
            id: this.itemId[this.itemId.length - 1],
            item: item,
            position: 'tail'
        }).enqueue(this.prepareEvent("modelChanged", {
            fields: [
                "contents"
            ]
        })).resume();
        return item;
    },
    /**
	**	Removes and returns an item from the bottom of the list.
	**
	**	>> Model pop ();
	*/ pop: function() {
        return this._unbind(this.data.contents.pop());
    },
    /**
	**	Adds an item to the top of the list. Returns null if the item is not an object or a model. The item
	**	will be ensured to be of the model specified in the list.
	**
	**	>> Model unshift (Model item);
	*/ unshift: function(item) {
        if (item && $0f51e41db87486be$export$2e2bcd8739ae039.typeOf(item) != "object") return null;
        item = $0f51e41db87486be$export$2e2bcd8739ae039.ensureTypeOf(this.itemt, item);
        this.itemId.unshift(this.nextId++);
        this.data.contents.unshift(item);
        this._bind(this.nextId - 1, item);
        this.prepareEvent("itemAdded", {
            id: this.itemId[0],
            item: item,
            position: 'head'
        }).enqueue(this.prepareEvent("modelChanged", {
            fields: [
                "contents"
            ]
        })).resume();
        return item;
    },
    /**
	**	Removes and returns an item from the top of the list.
	**
	**	>> Model shift ();
	*/ shift: function() {
        return this._unbind(this.data.contents.shift());
    },
    /**
	**	Searches for an item matching the specified partial definition and returns its index. Returns -1 if the
	**	item was not found. If retObject is set to true the object will be returned instead of its index and null
	**	will be returned when the item is not found.
	**
	**	int|object find (object data, bool retObject=false);
	*/ find: function(data, retObject) {
        var contents = this.data.contents;
        for(var i = 0; i < contents.length; i++){
            if ($0f51e41db87486be$export$2e2bcd8739ae039.partialCompare(contents[i].data, data)) return retObject ? contents[i] : i;
        }
        return retObject ? null : -1;
    }
});



/**
**	The utility functions in this module allow to create a very strict serialization/deserialization schema
**	to ensure that all values are of the specific type when stored in string format.
*/ let $160a6e172ab4e1e1$var$Schema = {
    Type: function(proto) {
        let tmp = {
            flatten: function(value, context) {
                return value;
            },
            unflatten: function(value, context) {
                return value;
            }
        };
        return proto ? $0f51e41db87486be$export$2e2bcd8739ae039.override(tmp, proto) : tmp;
    },
    String: function() {
        return $160a6e172ab4e1e1$var$Schema.Type({
            flatten: function(value, context) {
                return value != null ? value.toString() : null;
            },
            unflatten: function(value, context) {
                return value != null ? value.toString() : null;
            }
        });
    },
    Integer: function() {
        return $160a6e172ab4e1e1$var$Schema.Type({
            flatten: function(value, context) {
                return ~~value;
            },
            unflatten: function(value, context) {
                return ~~value;
            }
        });
    },
    Number: function(precision) {
        return $160a6e172ab4e1e1$var$Schema.Type({
            _precision: precision,
            _round: false,
            precision: function(value) {
                this._precision = ~~value;
                return this;
            },
            flatten: function(value, context) {
                value = parseFloat(value);
                if (this._precision > 0) value = ~~(value * Math.pow(10, this._precision)) / Math.pow(10, this._precision);
                return value;
            },
            unflatten: function(value, context) {
                return parseFloat(value);
            }
        });
    },
    Bool: function(compact) {
        return $160a6e172ab4e1e1$var$Schema.Type({
            _compact: compact,
            compact: function(value) {
                this._compact = value;
                return this;
            },
            flatten: function(value, context) {
                value = ~~value;
                return this._compact ? value > 0 ? 1 : 0 : value > 0 ? true : false;
            },
            unflatten: function(value, context) {
                return ~~value ? true : false;
            }
        });
    },
    SharedString: function() {
        return $160a6e172ab4e1e1$var$Schema.Type({
            flatten: function(value, context) {
                if (value == null) return 0;
                value = value.toString();
                if (!("strings" in context)) {
                    context.index = {
                    };
                    context.strings = [];
                }
                if (!(value in context.index)) {
                    context.strings.push(value);
                    context.index[value] = context.strings.length;
                }
                return context.index[value];
            },
            unflatten: function(value, context) {
                return value == null || value == 0 ? null : context.strings[~~value - 1];
            }
        });
    },
    Array: function(type1) {
        return $160a6e172ab4e1e1$var$Schema.Type({
            itemType: type1,
            _debug: false,
            _filter: null,
            debug: function(v) {
                this._debug = v;
                return this;
            },
            of: function(type) {
                this.itemType = type;
                return this;
            },
            filter: function(callback) {
                this._filter = callback;
                return this;
            },
            flatten: function(value, context) {
                if (value == null) return null;
                let o = [];
                for(let i = 0; i < value.length; i++){
                    if (this._filter && !this._filter(value[i], i)) continue;
                    o.push(this.itemType.flatten(value[i], context));
                }
                return o;
            },
            unflatten: async function(value, context) {
                if (value == null) return null;
                let o = [];
                for(let i = 0; i < value.length; i++)o.push(await this.itemType.unflatten(value[i], context));
                return o;
            }
        });
    },
    Object: function() {
        return $160a6e172ab4e1e1$var$Schema.Type({
            properties: [],
            property: function(name, type, defvalue = null) {
                this.properties.push({
                    name: name,
                    type: type,
                    defvalue: defvalue
                });
                return this;
            },
            flatten: function(value, context) {
                if (value == null) return null;
                let o;
                if (context.symbolic === true) {
                    o = {
                    };
                    for(let i = 0; i < this.properties.length; i++)if (this.properties[i].name in value) o[this.properties[i].name] = this.properties[i].type.flatten(value[this.properties[i].name], context);
                    else o[this.properties[i].name] = this.properties[i].type.flatten(this.properties[i].defvalue, context);
                } else {
                    o = [];
                    for(let i = 0; i < this.properties.length; i++)if (this.properties[i].name in value) o.push(this.properties[i].type.flatten(value[this.properties[i].name], context));
                    else o.push(this.properties[i].type.flatten(this.properties[i].defvalue, context));
                }
                return o;
            },
            unflatten: async function(value, context) {
                if (value == null) return null;
                let o = {
                };
                if (context.symbolic === true) for(let i = 0; i < this.properties.length; i++)o[this.properties[i].name] = await this.properties[i].type.unflatten(this.properties[i].name in value ? value[this.properties[i].name] : this.properties[i].defvalue, context);
                else for(let i1 = 0; i1 < this.properties.length; i1++)o[this.properties[i1].name] = await this.properties[i1].type.unflatten(i1 in value ? value[i1] : this.properties[i1].defvalue, context);
                return o;
            }
        });
    },
    Class: function(classConstructor1) {
        return $160a6e172ab4e1e1$var$Schema.Type({
            _constructor: classConstructor1,
            constructor: function(classConstructor) {
                this._constructor = classConstructor;
                return this;
            },
            flatten: function(value, context) {
                return value == null ? null : value.flatten(context);
            },
            unflatten: async function(value, context) {
                return value == null ? null : await new this._constructor().unflatten(value, context);
            }
        });
    },
    /*
	**	Used when you want to specify just a single property.
	*/ Property: function(name1, type2) {
        return $160a6e172ab4e1e1$var$Schema.Type({
            property: name1,
            type: type2,
            name: function(name) {
                this.property = name;
                return this;
            },
            is: function(type) {
                this.type = type;
                return this;
            },
            flatten: function(value, context) {
                if (value == null) return null;
                let o;
                if (context.symbolic === true) {
                    o = {
                    };
                    o[this.property] = this.type.flatten(value[this.property], context);
                } else o = this.type.flatten(value[this.property], context);
                return o;
            },
            unflatten: async function(value, context) {
                if (value == null) return null;
                let o = {
                };
                if (context.symbolic === true) o[this.property] = await this.type.unflatten(value[this.property], context);
                else o[this.property] = await this.type.unflatten(value, context);
                return o;
            }
        });
    },
    Map: function() {
        return $160a6e172ab4e1e1$var$Schema.Type({
            flatten: function(value, context) {
                if (value == null) return null;
                if (context.symbolic === true) return value;
                let o = [];
                for(let i in value){
                    o.push(i);
                    o.push(value[i]);
                }
                return o;
            },
            unflatten: function(value, context) {
                if (value == null) return null;
                if (context.symbolic === true) return value;
                let o = {
                };
                for(let i = 0; i < value.length; i += 2)o[value[i]] = value[i + 1];
                return o;
            }
        });
    },
    Selector: function() {
        return $160a6e172ab4e1e1$var$Schema.Type({
            conditions: [],
            value: null,
            when: function(value, type) {
                this.conditions.push([
                    (val)=>val === value
                    ,
                    type
                ]);
                return this;
            },
            with: function(value) {
                this.value = value;
                return this;
            },
            flatten: function(value, context) {
                if (value == null) return null;
                for (let i of this.conditions){
                    if (i[0](this.value) === true) return i[1].flatten(value, context);
                }
                return null;
            },
            unflatten: async function(value, context) {
                if (value == null) return null;
                for (let i of this.conditions){
                    if (i[0](this.value) === true) return await i[1].unflatten(value, context);
                }
                return null;
            }
        });
    }
};
var $160a6e172ab4e1e1$export$2e2bcd8739ae039 = $160a6e172ab4e1e1$var$Schema;



var /**
**	Class used to add flattening and unflattening capabilities to any object. A "flat" object is an object composed
**	only of native types, that is: `null,` `boolean`, `integer`, `number`, `array` or `object`.
*/ $8c5ffc7fb5fb6f99$export$2e2bcd8739ae039 = $c7e541a58a884fff$export$2e2bcd8739ae039.extend({
    /**
	**	Name of the class.
	*/ className: "Flattenable",
    /**
	**	Type schema used to flatten/unflatten the contents of this class. See Schema class for more information.
	*/ typeSchema: null,
    /**
	**	Returns the flattened contents of the object.
	*/ flatten: function(context) {
        return this.typeSchema.flatten(this, context);
    },
    /**
	**	Unflattens the given object and overrides the local contents.
	*/ unflatten: async function(value, context) {
        Object.assign(this, await this.typeSchema.unflatten(value, context));
        await this.onUnflattened();
        return this;
    },
    /*
	**	Executed when the unflatten() method is called on the object.
	*/ onUnflattened: async function() {
    }
});





var /**
**	Flattenable collection class, used to store items and manipulate them. The items should also be flattenable.
*/ $dc37df3258eece89$export$2e2bcd8739ae039 = $8c5ffc7fb5fb6f99$export$2e2bcd8739ae039.extend({
    /**
	**	Name of the class.
	*/ className: "Collection",
    /**
	**	Describes the type schema of the underlying items.
	*/ itemTypeSchema: null,
    /**
	**	Array of items.
	*/ items: null,
    /* Array */ /**
	**	Constructs the collection.
	*/ __ctor: function(itemTypeSchema) {
        if (!itemTypeSchema) itemTypeSchema = this.itemTypeSchema;
        if (itemTypeSchema) this.typeSchema = $160a6e172ab4e1e1$export$2e2bcd8739ae039.Property('items').is($160a6e172ab4e1e1$export$2e2bcd8739ae039.Array().of(itemTypeSchema));
        this.reset();
    },
    /*
	**	Executed after the collection has been unflattened, re-adds the items to ensure onItemAdded() is called.
	*/ onUnflattened: function() {
        let items = this.items;
        this.reset();
        for (let i of items)this.add(i);
    },
    /**
	 * 	Executed when the value in `items` is changed.
	 */ itemsReferenceChanged: function() {
    },
    /*
	**	Resets the collection to empty. Note that onItemRemoved will not be called.
	*/ reset: function() {
        this.items = [];
        this.itemsReferenceChanged();
        return this;
    },
    /*
	**	Clears the contents of the collection (removes each item manually, onItemRemoved will be called).
	*/ clear: function() {
        var items = this.items;
        this.reset();
        for(var i = 0; i < items.length; i++)this.onItemRemoved(items[i], 0);
        return this;
    },
    /*
	**	Sorts the collection. A comparison function should be provided, or the name of a property to sort by.
	**
	**	Object sort (fn: Function)
	**	Object sort (prop: string, [desc:bool=false])
	*/ sort: function(fn, desc) {
        if (typeof fn != "function") this.items.sort(function(a, b) {
            return (a[fn] <= b[fn] ? -1 : 1) * (desc === true ? -1 : 1);
        });
        else this.items.sort(fn);
        return this;
    },
    /*
	**	Searches for an item with the specified fields and returns it. The "inc" object is the "inclusive" map, meaning all fields must match
	**	and the optional "exc" is the exclusive map, meaning not even one field should match.
	**
	**	Object findItem (inc: Object, exc: Object);
	*/ findItem: function(inc, exc) {
        if (!this.items) return null;
        for(var i = 0; i < this.items.length; i++){
            if (exc && $0f51e41db87486be$export$2e2bcd8739ae039.partialCompare(this.items[i], exc)) continue;
            if ($0f51e41db87486be$export$2e2bcd8739ae039.partialCompare(this.items[i], inc)) return this.items[i];
        }
        return null;
    },
    /*
	**	Returns the container array.
	*/ getItems: function() {
        return this.items;
    },
    /*
	**	Returns the number of items in the collection.
	*/ length: function() {
        return this.items.length;
    },
    /*
	**	Returns true if the collection is empty.
	*/ isEmpty: function() {
        return !this.items.length;
    },
    /*
	**	Returns the index of the specified item, or -1 if not found.
	*/ indexOf: function(item) {
        return this.items.indexOf(item);
    },
    /*
	**	Returns the item at the specified index, or null if not found. When `relative` is true, negative offsets are allowed such that -1 refers to the last item.
	*/ getAt: function(index, relative = false) {
        if (index < 0 && relative == true) index += this.items.length;
        return index >= 0 && index < this.items.length ? this.items[index] : null;
    },
    /*
	**	Returns the first item in the collection.
	*/ first: function() {
        return this.getAt(0);
    },
    /*
	**	Returns the last item in the collection.
	*/ last: function() {
        return this.getAt(-1, true);
    },
    /*
	**	Adds an item at the specified index, effectively moving the remaining items to the right.
	*/ addAt: function(index, item) {
        if (!item || !this.onBeforeItemAdded(item)) return this;
        if (index < 0) index = 0;
        if (index > this.items.length) index = this.items.length;
        if (index == 0) this.items.unshift(item);
        else if (index == this.items.length) this.items.push(item);
        else {
            var tmp = this.items.splice(0, index);
            tmp.push(item);
            this.items = tmp.concat(this.items);
            this.itemsReferenceChanged();
        }
        this.onItemAdded(item);
        return this;
    },
    /*
	**	Adds an item to the start of the collection, onBeforeItemAdded and onItemAdded will be triggered.
	*/ unshift: function(item) {
        return this.addAt(0, item);
    },
    /*
	**	Adds an item to the end of the collection, onBeforeItemAdded and onItemAdded will be triggered.
	*/ push: function(item) {
        return this.addAt(this.items.length, item);
    },
    /*
	**	Adds an item to the end of the collection, onBeforeItemAdded and onItemAdded will be triggered.
	*/ add: function(item) {
        return this.push(item);
    },
    /*
	**	Removes the item at the specified index. When `relative` is true, negative offsets are allowed such that -1 refers to the last item.
	*/ removeAt: function(index, relative = false) {
        if (index < 0 && relative == true) index += this.items.length;
        if (index < 0 || index >= this.items.length) return null;
        var item = this.items[index];
        this.items.splice(index, 1);
        this.onItemRemoved(item, index);
        return item;
    },
    /*
	**	Removes an item from the end of the collection.
	*/ pop: function(item) {
        return this.removeAt(-1, true);
    },
    /*
	**	Removes an item from the start of the collection.
	*/ shift: function(item) {
        return this.removeAt(0);
    },
    /*
	**	Removes the specified item from the collection.
	*/ remove: function(item) {
        return this.removeAt(this.indexOf(item));
    },
    /*
	**	Runs the specified callback for each of the items in the collection, if false is returned by the callback this function
	**	will exit immediately. Parameters to the callback are: (item, index, collection).
	*/ forEach: function(callback) {
        if (this.isEmpty()) return this;
        for(var i = 0; i < this.items.length; i++)if (callback(this.items[i], i, this) === false) break;
        return this;
    },
    /*
	**	Executes a method call with the specified parameters on each of the items in the collection, if false is returned by the
	**	item's method this function will exit immediately.
	*/ forEachCall: function(method, ...args) {
        if (this.isEmpty()) return this;
        for(var i = 0; i < this.items.length; i++)if (this.items[i][method](...args) === false) break;
        return this;
    },
    /*
	**	Exactly the same as forEach but in reverse order.
	*/ forEachRev: function(callback) {
        if (this.isEmpty()) return this;
        for(var i = this.items.length - 1; i >= 0; i--)if (callback(this.items[i], i, this) === false) break;
        return this;
    },
    /*
	**	Exactly the same as forEachCall but in reverse order.
	*/ forEachRevCall: function(method, ...args) {
        if (this.isEmpty()) return this;
        for(var i = this.items.length - 1; i >= 0; i--)if (this.items[i][method](...args) === false) break;
        return this;
    },
    /*
	**	Handler for the beforeItemAdded event. If returns false the item will not be added.
	*/ onBeforeItemAdded: function(item) {
        return true;
    },
    /*
	**	Handler for the itemAdded event.
	*/ onItemAdded: function(item) {
    },
    /*
	**	Handler for the itemRemoved event.
	*/ onItemRemoved: function(item) {
    }
});



/**
**	Templating module. The template formats available are shown below, note that the sym-open and sym-close symbols are by
**	default the square brackets, however those can be modified since are just parameters.
**
**	HTML Escaped Output:			[data.value]					Escapes HTML characters from the output.
**	Raw Output:						[!data.value]					Does not escape HTML characters from the output (used to output direct HTML).
**	Double-Quoted Escaped Output:	[data.value]					Escapes HTML characters and surrounds with double quotes.
**	Immediate Reparse:				[<....] [@....] "..." '...'		Reparses the contents as if parseTemplate() was called again.
**	Immediate Output:				[:...]							Takes the contents and outputs exactly as-is without format and optionally surrounded by the
**																	sym-open and sym-close symbols when the first character is not '<', sym_open or space.
**	Filtered Output:				[functionName ... <expr> ...]	Runs a function call, 'expr' can be any of the allowed formats shown here (nested if desired),
**																	functionName should map to one of the available expression functions registered in the
**																	Rinn.Template.functions map, each of which have their own parameters.
*/ let $0547cdb49a1cf689$var$Template = {
    /*
	**	Strict mode flag. When set, any undefined expression function will trigger an exception.
	*/ strict: false,
    /**
	**	Parses a template and returns the compiled 'parts' structure to be used by the 'expand' method.
	**
	**	>> array parseTemplate (string template, char sym_open, char sym_close, bool is_tpl=false);
	*/ parseTemplate: function(template, sym_open, sym_close, is_tpl = false, root = 1) {
        let nflush = 'string', flush = null, state = 0, count = 0;
        let str = '', parts = [], mparts = parts, nparts = false;
        if (is_tpl === true) {
            template = template.trim();
            nflush = 'identifier';
            state = 10;
            mparts.push(parts = []);
        }
        template += "\0";
        function unescape(value) {
            if (typeof value == 'object') {
                if (value instanceof Array) for(let i = 0; i < value.length; i++)unescape(value[i]);
                else value.data = unescape(value.data);
                return value;
            }
            for(let i = 0; i < value.length; i++)if (value[i] == '\\') {
                let r = value[i + 1];
                switch(r){
                    case 'n':
                        r = "\n";
                        break;
                    case 'r':
                        r = "\r";
                        break;
                    case 'f':
                        r = "\f";
                        break;
                    case 'v':
                        r = "\v";
                        break;
                    case 't':
                        r = "\t";
                        break;
                    case 's':
                        r = "\s";
                        break;
                    case '"':
                        r = "\"";
                        break;
                    case "'":
                        r = "\'";
                        break;
                }
                value = value.substr(0, i) + r + value.substr(i + 2);
            }
            return value;
        }
        function emit(type, data) {
            if (type == 'template') data = $0547cdb49a1cf689$var$Template.parseTemplate(data, sym_open, sym_close, true, 0);
            else if (type == 'parse') {
                data = $0547cdb49a1cf689$var$Template.parseTemplate(data, sym_open, sym_close, false, 0);
                type = 'base-string';
                if ($0f51e41db87486be$export$2e2bcd8739ae039.typeOf(data) == 'array') {
                    type = data[0].type;
                    data = data[0].data;
                }
            } else if (type == 'parse-trim-merge') data = $0547cdb49a1cf689$var$Template.parseTemplate(data.trim().split('\n').map((i)=>i.trim()
            ).join("\n"), sym_open, sym_close, false, 0);
            else if (type == 'parse-merge') data = $0547cdb49a1cf689$var$Template.parseTemplate(data, sym_open, sym_close, false, 0);
            else if (type == 'parse-merge-alt') data = $0547cdb49a1cf689$var$Template.parseTemplate(data, '{', '}', false, 0);
            if (type == 'parse-merge' || type == 'parse-merge-alt' || type == 'parse-trim-merge') for(let i2 = 0; i2 < data.length; i2++)parts.push(data[i2]);
            else parts.push({
                type: type,
                data: data
            });
            if (nparts) {
                mparts.push(parts = []);
                nparts = false;
            }
        }
        for(let i1 = 0; i1 < template.length; i1++){
            if (template[i1] == '\\') {
                str += '\\';
                str += template[++i1];
                continue;
            }
            switch(state){
                case 0:
                    if (template[i1] == '\0') flush = 'string';
                    else if (template[i1] == sym_open && template[i1 + 1] == '<') {
                        state = 1;
                        count = 1;
                        flush = 'string';
                        nflush = 'parse-merge';
                    } else if (template[i1] == sym_open && template[i1 + 1] == '@') {
                        state = 1;
                        count = 1;
                        flush = 'string';
                        nflush = 'parse-trim-merge';
                        i1++;
                    } else if (template[i1] == sym_open && template[i1 + 1] == ':') {
                        state = 12;
                        count = 1;
                        flush = 'string';
                        nflush = 'string';
                        i1++;
                    } else if (template[i1] == sym_open) {
                        state = 1;
                        count = 1;
                        flush = 'string';
                        nflush = 'template';
                    } else str += template[i1];
                    break;
                case 1:
                    if (template[i1] == '\0') throw new Error("Parse error: Unexpected end of template");
                    if (template[i1] == sym_close) {
                        count--;
                        if (count < 0) throw new Error("Parse error: Unmatched " + sym_close);
                        if (count == 0) {
                            state = 0;
                            flush = nflush;
                            break;
                        }
                    } else if (template[i1] == sym_open) count++;
                    str += template[i1];
                    break;
                case 10:
                    if (template[i1] == '\0') {
                        flush = nflush;
                        break;
                    } else if (template[i1] == '.') {
                        emit(nflush, str);
                        emit('access', '.');
                        nflush = 'identifier';
                        str = '';
                        break;
                    } else if (template[i1].match(/[\t\n\r\f\v ]/) != null) {
                        flush = nflush;
                        nflush = 'identifier';
                        nparts = true;
                        while(template[i1].match(/[\t\n\r\f\v ]/) != null)i1++;
                        i1--;
                        break;
                    } else if (template[i1] == sym_open && template[i1 + 1] == '<') {
                        if (str) flush = nflush;
                        state = 11;
                        count = 1;
                        nflush = 'parse-merge';
                        break;
                    } else if (template[i1] == sym_open && template[i1 + 1] == '@') {
                        if (str) flush = nflush;
                        state = 11;
                        count = 1;
                        nflush = 'parse-trim-merge';
                        i1++;
                        break;
                    } else if (template[i1] == '"') {
                        if (str) flush = nflush;
                        state = 14;
                        count = 1;
                        nflush = 'parse-merge';
                        break;
                    } else if (template[i1] == '\'') {
                        if (str) flush = nflush;
                        state = 15;
                        count = 1;
                        nflush = 'parse-merge';
                        break;
                    } else if (template[i1] == '`') {
                        if (str) flush = nflush;
                        state = 16;
                        count = 1;
                        nflush = 'parse-merge-alt';
                        break;
                    } else if (template[i1] == sym_open && template[i1 + 1] == ':') {
                        if (str) flush = nflush;
                        state = 13;
                        count = 1;
                        nflush = 'string';
                        i1++;
                        break;
                    } else if (template[i1] == sym_open) {
                        if (str) emit(nflush, str);
                        state = 11;
                        count = 1;
                        str = '';
                        nflush = 'parse';
                        str += template[i1];
                        break;
                    }
                    if (nflush != 'identifier') {
                        emit(nflush, str);
                        str = '';
                        nflush = 'identifier';
                    }
                    str += template[i1];
                    break;
                case 11:
                    if (template[i1] == '\0') throw new Error("Parse error: Unexpected end of template");
                    if (template[i1] == sym_close) {
                        count--;
                        if (count < 0) throw new Error("Parse error: Unmatched " + sym_close);
                        if (count == 0) {
                            state = 10;
                            if (nflush == 'parse-merge' || nflush == 'parse-merge-alt' || nflush == 'parse-trim-merge') break;
                        }
                    } else if (template[i1] == sym_open) count++;
                    str += template[i1];
                    break;
                case 12:
                    if (template[i1] == '\0') throw new Error("Parse error: Unexpected end of template");
                    if (template[i1] == sym_close) {
                        count--;
                        if (count < 0) throw new Error("Parse error: Unmatched " + sym_close);
                        if (count == 0) {
                            if (str.length != 0) {
                                if (!(str[0] == '<' || str[0] == '[' || str[0] == ' ')) str = sym_open + str + sym_close;
                            }
                            state = 0;
                            flush = nflush;
                            break;
                        }
                    } else if (template[i1] == sym_open) count++;
                    str += template[i1];
                    break;
                case 13:
                    if (template[i1] == '\0') throw new Error("Parse error: Unexpected end of template");
                    if (template[i1] == sym_close) {
                        count--;
                        if (count < 0) throw new Error("Parse error: Unmatched " + sym_close);
                        if (count == 0) {
                            if (!(str[0] == '<' || str[0] == '[' || str[0] == ' ')) str = sym_open + str + sym_close;
                            state = 10;
                            break;
                        }
                    } else if (template[i1] == sym_open) count++;
                    str += template[i1];
                    break;
                case 14:
                    if (template[i1] == '\0') throw new Error("Parse error: Unexpected end of template");
                    if (template[i1] == '"') {
                        count--;
                        if (count < 0) throw new Error("Parse error: Unmatched \"");
                        if (count == 0) {
                            state = 10;
                            if (nflush == 'parse-merge' || nflush == 'parse-merge-alt' || nflush == 'parse-trim-merge') break;
                        }
                    }
                    str += template[i1];
                    break;
                case 15:
                    if (template[i1] == '\0') throw new Error("Parse error: Unexpected end of template");
                    if (template[i1] == '\'') {
                        count--;
                        if (count < 0) throw new Error("Parse error: Unmatched '");
                        if (count == 0) {
                            state = 10;
                            if (nflush == 'parse-merge' || nflush == 'parse-merge-alt' || nflush == 'parse-trim-merge') break;
                        }
                    }
                    str += template[i1];
                    break;
                case 16:
                    if (template[i1] == '\0') throw new Error("Parse error: Unexpected end of template");
                    if (template[i1] == '`') {
                        count--;
                        if (count < 0) throw new Error("Parse error: Unmatched `");
                        if (count == 0) {
                            state = 10;
                            if (nflush == 'parse-merge' || nflush == 'parse-merge-alt' || nflush == 'parse-trim-merge') break;
                        }
                    }
                    str += template[i1];
                    break;
            }
            if (flush) {
                emit(flush, str);
                flush = str = '';
            }
        }
        if (!is_tpl) {
            let i = 0;
            while(i < mparts.length){
                if (mparts[i].type == 'string' && mparts[i].data == '') mparts.splice(i, 1);
                else break;
            }
            i = mparts.length - 1;
            while(i > 0){
                if (mparts[i].type == 'string' && mparts[i].data == '') mparts.splice(i--, 1);
                else break;
            }
            if (mparts.length == 0) mparts.push({
                type: 'string',
                data: ''
            });
        }
        if (root) unescape(mparts);
        return mparts;
    },
    /**
	**	Parses a template and returns the compiled 'parts' structure to be used by the 'expand' method. This
	**	version assumes the sym_open and sym_close chars are [ and ] respectively.
	**
	**	>> array parse (string template);
	*/ parse: function(template) {
        return this.parseTemplate(template.trim(), '[', ']', false);
    },
    /**
	**	Removes all static parts from a parsed template.
	**
	**	>> array clean (array parts);
	*/ clean: function(parts) {
        for(let i = 0; i < parts.length; i++)if (parts[i].type != 'template') {
            parts.splice(i, 1);
            i--;
        }
        return parts;
    },
    /**
	**	Expands a template using the given data object, ret can be set to 'text' or 'obj' allowing to expand the template as
	**	a string (text) or an array of objects (obj) respectively. If none provided it will be expanded as text.
	**
	**	>> string/array expand (array parts, object data, string ret='text', string mode='base-string');
	*/ expand: function(parts, data, ret = 'text', mode = 'base-string') {
        let s = [];
        // Expand variable parts.
        if (mode == 'var') {
            let escape = true;
            let quote = false;
            let root = data;
            let last = null;
            let first = true;
            let str = '';
            for(let i = 0; i < parts.length && data != null; i++)switch(parts[i].type){
                case 'identifier':
                case 'string':
                    str += parts[i].data;
                    last = null;
                    break;
                case 'template':
                    last = this.expand(parts[i].data, root, 'arg', 'template');
                    str += typeof last != 'object' ? last : '';
                    break;
                case 'base-string':
                    str += this.expand(parts[i].data, root, 'arg', 'base-string');
                    last = null;
                    break;
                case 'access':
                    if (!last || typeof last != 'object') {
                        if (str == '') str = 'this';
                        while(true){
                            if (str[0] == '!') {
                                str = str.substr(1);
                                escape = false;
                            } else if (str[0] == '$') {
                                str = str.substr(1);
                                quote = true;
                            } else break;
                        }
                        if (str != 'this' && data != null) {
                            let tmp = data;
                            data = str in data ? data[str] : null;
                            if (data === null && first) {
                                if (str in $0547cdb49a1cf689$var$Template.functions) data = $0547cdb49a1cf689$var$Template.functions[str](null, null, tmp);
                            }
                            first = false;
                        }
                    } else data = last;
                    str = '';
                    break;
            }
            while(str != ''){
                if (str[0] == '!') {
                    str = str.substr(1);
                    escape = false;
                } else if (str[0] == '$') {
                    str = str.substr(1);
                    quote = true;
                } else break;
            }
            if (str != 'this') {
                let failed = false;
                if (data != null) {
                    if (!(str in data)) {
                        failed = true;
                        data = null;
                    } else data = data[str];
                } else failed = true;
                if (failed && parts.length == 1) {
                    if ($0547cdb49a1cf689$var$Template.strict == true) throw new Error('Expression function `' + str + '` not found.');
                }
            }
            if (typeof data == 'string') {
                if (escape) data = data.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                if (quote) data = '"' + data + '"';
            }
            s.push(data);
        }
        // Expand variable parts and returns a reference to it.
        if (ret == 'varref') {
            let root = data;
            let last = null;
            let first = true;
            let str = '';
            for(let i = 0; i < parts.length && data != null; i++)switch(parts[i].type){
                case 'identifier':
                case 'string':
                    str += parts[i].data;
                    last = null;
                    break;
                case 'template':
                    last = this.expand(parts[i].data, root, 'arg', 'template');
                    str += typeof last != 'object' ? last : '';
                    break;
                case 'base-string':
                    str += this.expand(parts[i].data, root, 'arg', 'base-string');
                    last = null;
                    break;
                case 'access':
                    if (!last || typeof last != 'object') {
                        if (str == '') str = 'this';
                        while(true){
                            if (str[0] == '!') str = str.substr(1);
                            else if (str[0] == '$') str = str.substr(1);
                            else break;
                        }
                        if (str != 'this' && data != null) {
                            let tmp = data;
                            data = str in data ? data[str] : null;
                            if (data === null && first) {
                                if (str in $0547cdb49a1cf689$var$Template.functions) data = $0547cdb49a1cf689$var$Template.functions[str](null, null, tmp);
                            }
                            first = false;
                        }
                    } else data = last;
                    str = '';
                    break;
            }
            while(str != ''){
                if (str[0] == '!') str = str.substr(1);
                else if (str[0] == '$') str = str.substr(1);
                else break;
            }
            return str != 'this' ? [
                data,
                str
            ] : null;
        }
        // Expand function parts.
        if (mode == 'fn') {
            var args = [];
            args.push($0547cdb49a1cf689$var$Template.expand(parts[0], data, 'text', 'base-string'));
            if ('_' + args[0] in $0547cdb49a1cf689$var$Template.functions) args[0] = '_' + args[0];
            if (!(args[0] in $0547cdb49a1cf689$var$Template.functions)) {
                if ($0547cdb49a1cf689$var$Template.strict == true) throw new Error('Expression function `' + args[0] + '` not found.');
                return `(Unknown: ${args[0]})`;
            }
            if (args[0][0] == '_') return $0547cdb49a1cf689$var$Template.functions[args[0]](parts, data);
            for(let i = 1; i < parts.length; i++)args.push($0547cdb49a1cf689$var$Template.expand(parts[i], data, 'arg', 'base-string'));
            s.push($0547cdb49a1cf689$var$Template.functions[args[0]](args, parts, data));
        }
        // Template mode.
        if (mode == 'template') {
            if (parts.length == 1) {
                if (parts[0].length == 1 && parts[0][0].type == 'string') return parts[0][0].data;
                if (parts[0].length == 1 && parts[0][0].type == 'identifier') {
                    let name = parts[0][0].data;
                    if (name in $0547cdb49a1cf689$var$Template.functions || '_' + name in $0547cdb49a1cf689$var$Template.functions) return $0547cdb49a1cf689$var$Template.expand(parts, data, ret, 'fn');
                }
                return $0547cdb49a1cf689$var$Template.expand(parts[0], data, ret, 'var');
            }
            return $0547cdb49a1cf689$var$Template.expand(parts, data, ret, 'fn');
        }
        // Expand parts.
        if (mode == 'base-string') {
            let index = -1;
            for (let i of parts){
                let tmp = null;
                index++;
                switch(i.type){
                    case 'template':
                        tmp = $0547cdb49a1cf689$var$Template.expand(i.data, data, ret, 'template');
                        break;
                    case 'string':
                    case 'identifier':
                        tmp = i.data;
                        break;
                    case 'base-string':
                        tmp = $0547cdb49a1cf689$var$Template.expand(i.data, data, ret, 'base-string');
                        break;
                }
                if (ret == 'void') continue;
                if (ret == 'last' && index != parts.length - 1) continue;
                s.push(tmp);
            }
        }
        // Return types for direct objects.
        if (ret == 'obj') return s;
        if (ret == 'last') {
            if (typeOf(s) == 'Rose\\Arry') s = s[0];
            return s;
        }
        // When the output is not really needed.
        if (ret == 'void') return null;
        // Return as argument ('object' if only one, or string if more than one), that is, the first item in the result.
        if (ret == 'arg') {
            if ($0f51e41db87486be$export$2e2bcd8739ae039.typeOf(s) == 'array') {
                if (s.length != 1) return s.join('');
                return s[0];
            }
            return s;
        }
        if (ret == 'text' && $0f51e41db87486be$export$2e2bcd8739ae039.typeOf(s) == 'array') {
            let f = (e)=>e != null && typeof e == 'object' ? 'map' in e ? e.map(f).join('') : 'join' in e ? e.join('') : e.toString() : e
            ;
            s = s.map(f).join('');
        }
        return s;
    },
    /**
	**	Parses the given template and returns a function that when called with an object will expand the template.
	**
	**	>> object compile (string template);
	*/ compile: function(template) {
        template = $0547cdb49a1cf689$var$Template.parse(template);
        return function(data = null, mode = 'text') {
            return $0547cdb49a1cf689$var$Template.expand(template, data ? data : {
            }, mode);
        };
    },
    /**
	**	Parses and expands the given template immediately.
	**
	**	>> object eval (string template, object data, string mode='text');
	*/ eval: function(template, data = null, mode = 'text') {
        template = $0547cdb49a1cf689$var$Template.parse(template);
        return $0547cdb49a1cf689$var$Template.expand(template, data ? data : {
        }, mode);
    },
    /**
	**	Expands the template as 'arg' and returns the result.
	**
	**	>> object value (string parts, object data);
	*/ value: function(parts, data = null) {
        return $0f51e41db87486be$export$2e2bcd8739ae039.typeOf(parts) != 'array' ? parts : $0547cdb49a1cf689$var$Template.expand(parts, data ? data : {
        }, 'arg');
    },
    /**
	**	Registers an expression function.
	**
	**	>> object register (string name, function fn);
	*/ register: function(name, fn) {
        $0547cdb49a1cf689$var$Template.functions[name] = fn;
    },
    /**
	**	Calls an expression function.
	**
	**	>> object call (string name, object args, object data);
	*/ 'call': function(name, args, data = null) {
        if (name in $0547cdb49a1cf689$var$Template.functions) return $0547cdb49a1cf689$var$Template.functions[name](args, null, data);
        return null;
    },
    /**
	**	Returns a map given a 'parts' array having values of the form "name: value" or ":name value".
	**
	**	>> Map getNamedValues (array parts, object data, int i=1, bool expanded=true);
	*/ getNamedValues: function(parts, data, i = 1, expanded = true) {
        let s = {
        };
        let mode = 0;
        for(; i < parts.length; i += 2){
            let key = $0547cdb49a1cf689$var$Template.expand(parts[i], data, 'arg');
            if (!mode) {
                if (key.startsWith(':')) mode = 1;
                else mode = key.endsWith(':') ? 2 : 3;
            }
            if (mode == 1) key = key.substr(1);
            else if (mode == 2) key = key.substr(0, key.length - 1);
            if (expanded) s[key] = $0547cdb49a1cf689$var$Template.expand(parts[i + 1], data, 'arg');
            else s[key] = parts[i + 1];
        }
        return s;
    }
};
/**
**	Template functions, functions that are used to format data. Each function takes three parameters (args, parts and data). By default the function arguments
**	are expanded and passed via 'args' for convenience, however if the function name starts with '_' the 'args' parameter will be skipped and only (parts, data)
**	will be available, each 'part' must be expanded manually by calling Template.expand.
*/ $0547cdb49a1cf689$var$Template.functions = {
    /**
	**	Expression functions.
	*/ 'global': function(args) {
        return globalThis;
    },
    'null': function(args) {
        return null;
    },
    'true': function(args) {
        return true;
    },
    'false': function(args) {
        return false;
    },
    'len': function(args) {
        return args[1].toString().length;
    },
    'int': function(args) {
        return ~~args[1];
    },
    'str': function(args) {
        return args[1].toString();
    },
    'float': function(args) {
        return parseFloat(args[1]);
    },
    'chr': function(args) {
        return String.fromCharCode(args[1]);
    },
    'ord': function(args) {
        return args[1].toString().charCodeAt(0);
    },
    'not': function(args) {
        return !args[1];
    },
    'neg': function(args) {
        return -args[1];
    },
    'abs': function(args) {
        return Math.abs(args[1]);
    },
    'and': function(args) {
        for(let i = 1; i < args.length; i++)if (!args[i]) return false;
        return true;
    },
    'or': function(args) {
        for(let i = 1; i < args.length; i++)if (~~args[i]) return true;
        return false;
    },
    'eq': function(args) {
        return args[1] == args[2];
    },
    'ne': function(args) {
        return args[1] != args[2];
    },
    'lt': function(args) {
        return args[1] < args[2];
    },
    'le': function(args) {
        return args[1] <= args[2];
    },
    'gt': function(args) {
        return args[1] > args[2];
    },
    'ge': function(args) {
        return args[1] >= args[2];
    },
    'isnotnull': function(args) {
        return !!args[1];
    },
    'isnull': function(args) {
        return !args[1];
    },
    'iszero': function(args) {
        return parseInt(args[1]) == 0;
    },
    'eq?': function(args) {
        return args[1] == args[2];
    },
    'ne?': function(args) {
        return args[1] != args[2];
    },
    'lt?': function(args) {
        return args[1] < args[2];
    },
    'le?': function(args) {
        return args[1] <= args[2];
    },
    'gt?': function(args) {
        return args[1] > args[2];
    },
    'ge?': function(args) {
        return args[1] >= args[2];
    },
    'notnull?': function(args) {
        return !!args[1];
    },
    'null?': function(args) {
        return !args[1];
    },
    'zero?': function(args) {
        return parseInt(args[1]) == 0;
    },
    'typeof': function(args) {
        return $0f51e41db87486be$export$2e2bcd8739ae039.typeOf(args[1]);
    },
    '*': function(args) {
        let x = args[1];
        for(let i = 2; i < args.length; i++)x *= args[i];
        return x;
    },
    '/': function(args) {
        let x = args[1];
        for(let i = 2; i < args.length; i++)x /= args[i];
        return x;
    },
    '+': function(args) {
        let x = args[1];
        for(let i = 2; i < args.length; i++)x -= -args[i];
        return x;
    },
    '-': function(args) {
        let x = args[1];
        for(let i = 2; i < args.length; i++)x -= args[i];
        return x;
    },
    'mul': function(args) {
        let x = args[1];
        for(let i = 2; i < args.length; i++)x *= args[i];
        return x;
    },
    'div': function(args) {
        let x = args[1];
        for(let i = 2; i < args.length; i++)x /= args[i];
        return x;
    },
    'sum': function(args) {
        let x = args[1];
        for(let i = 2; i < args.length; i++)x -= -args[i];
        return x;
    },
    'sub': function(args) {
        let x = args[1];
        for(let i = 2; i < args.length; i++)x -= args[i];
        return x;
    },
    'mod': function(args) {
        let x = args[1];
        for(let i = 2; i < args.length; i++)x %= args[i];
        return x;
    },
    'pow': function(args) {
        let x = args[1];
        for(let i = 2; i < args.length; i++)x = Math.pow(x, args[i]);
        return x;
    },
    /**
	**	Returns the JSON representation of the expression.
	**
	**	dump <expr>
	*/ 'dump': function(args) {
        return JSON.stringify(args[1]);
    },
    /**
	**	Sets one or more variables in the data context.
	**
	**	set <var-name> <expr> [<var-name> <expr>]*
	*/ '_set': function(parts, data) {
        for(let i = 1; i + 1 < parts.length; i += 2){
            let value = $0547cdb49a1cf689$var$Template.value(parts[i + 1], data);
            if (parts[i].length > 1) {
                let ref = $0547cdb49a1cf689$var$Template.expand(parts[i], data, 'varref');
                if (ref != null) ref[0][ref[1]] = value;
            } else data[$0547cdb49a1cf689$var$Template.value(parts[i], data)] = value;
        }
        return '';
    },
    /**
	**	Removes one or more variables from the data context.
	**
	**	unset <var-name> [<var-name>]*
	*/ '_unset': function(parts, data) {
        for(let i = 1; i < parts.length; i++)if (parts[i].length > 1) {
            let ref = $0547cdb49a1cf689$var$Template.expand(parts[i], data, 'varref');
            if (ref != null) delete ref[0][ref[1]];
        } else delete data[$0547cdb49a1cf689$var$Template.value(parts[i], data)];
        return null;
    },
    /**
	**	Returns the expression without white-space on the left or right. The expression can be a string or an array.
	**
	**	trim <expr>
	*/ 'trim': function(args) {
        return args[1] ? typeof args[1] == "object" ? args[1].map((e)=>e.trim()
        ) : args[1].trim() : '';
    },
    /**
	**	Returns the expression in uppercase. The expression can be a string or an array.
	**
	**	upper <expr>
	*/ 'upper': function(args) {
        return args[1] ? typeof args[1] == "object" ? args[1].map((e)=>e.toUpperCase()
        ) : args[1].toUpperCase() : '';
    },
    /**
	**	Returns the expression in lower. The expression can be a string or an array.
	**
	**	lower <expr>
	*/ 'lower': function(args) {
        return args[1] ? typeof args[1] == "object" ? args[1].map((e)=>e.toLowerCase()
        ) : args[1].toLowerCase() : '';
    },
    /**
	**	Returns a sub-string of the given string.
	**
	**	substr <start> <count> <string>
	**	substr <start> <string>
	*/ 'substr': function(args) {
        let s = args[args.length - 1].toString();
        let start = 0;
        let count = null;
        if (args.length == 4) {
            start = ~~args[1];
            count = ~~args[2];
        } else {
            start = ~~args[1];
            count = null;
        }
        if (start < 0) start += s.length;
        if (count < 0) count += s.length;
        if (count === null) count = s.length - start;
        return s.substr(start, count);
    },
    /**
	**	Replaces a matching string with the given replacement string in a given text.
	**
	**	replace <search> <replacement> <text>
	*/ 'replace': function(args) {
        return args[3].split(args[1]).join(args[2]);
    },
    /**
	**	Converts all new-line chars in the expression to <br/>, the expression can be a string or an array.
	**
	**	nl2br <expr>
	*/ 'nl2br': function(args) {
        return args[1] ? typeof args[1] == "object" ? args[1].map((e)=>e.replace(/\n/g, "<br/>")
        ) : args[1].replace(/\n/g, "<br/>") : '';
    },
    /**
	**	Returns the expression inside an XML tag named 'tag-name', the expression can be a string or an array.
	**
	**	% <tag-name> <expr>
	*/ '%': function(args) {
        args.shift();
        var name = args.shift();
        let s = '';
        for(let i = 0; i < args.length; i++)if ($0f51e41db87486be$export$2e2bcd8739ae039.typeOf(args[i]) == 'array') {
            s += `<${name}>`;
            for(let j = 0; j < args[i].length; j++)s += args[i][j];
            s += `</${name}>`;
        } else s += `<${name}>${args[i]}</${name}>`;
        return s;
    },
    /**
	**	Returns the expression inside an XML tag named 'tag-name', attributes are supported.
	**
	**	%% <tag-name> [<attr> <value>]* [<content>]
	*/ '%%': function(args) {
        args.shift();
        var name = args.shift();
        let attr = '';
        let text = '';
        for(let i = 0; i < args.length; i += 2)if (i + 1 < args.length) attr += ` ${args[i]}="${args[i + 1]}"`;
        else text = args[i];
        return text ? `<${name}${attr}>${text}</${name}>` : `<${name}${attr}/>`;
    },
    /**
	**	Joins the given array expression into a string. The provided string-expr will be used as separator.
	**
	**	join <string-expr> <array-expr>
	*/ 'join': function(args) {
        if (args[2] && $0f51e41db87486be$export$2e2bcd8739ae039.typeOf(args[2]) == 'array') return args[2].join(args[1]);
        return '';
    },
    /**
	**	Splits the given expression by the specified string. Returns an array.
	**
	**	split <string-expr> <expr>
	*/ 'split': function(args) {
        if (args[2] && typeof args[2] == "string") return args[2].split(args[1]);
        return [];
    },
    /**
	**	Returns an array with the keys of the given object-expr.
	**
	**	keys <object-expr>
	*/ 'keys': function(args) {
        if (args[1] && typeof args[1] == "object") return Object.keys(args[1]);
        return [];
    },
    /**
	**	Returns an array with the values of the given object-expr.
	**
	**	values <object-expr>
	*/ 'values': function(args) {
        if (args[1] && typeof args[1] == "object") return Object.values(args[1]);
        return [];
    },
    /**
	**	Constructs a string obtained by concatenating the expanded template for each of the items in the list-expr, the mandatory varname
	**	parameter (namely 'i') indicates the name of the variable that will contain the data of each item as the list-expr is
	**	traversed. Extra variables i# and i## (suffix '#' and '##') are introduced to denote the index/key and numeric index
	**	of the current item respectively, note that the later will always have a numeric value.
	**
	**	each <varname> <list-expr> <template>
	*/ '_each': function(parts, data) {
        let var_name = $0547cdb49a1cf689$var$Template.expand(parts[1], data, 'arg');
        let list = $0547cdb49a1cf689$var$Template.expand(parts[2], data, 'arg');
        let s = '';
        let j = 0;
        if (!list) return s;
        for(let i in list){
            data[var_name] = list[i];
            data[var_name + '##'] = j++;
            data[var_name + '#'] = i;
            s += $0547cdb49a1cf689$var$Template.expand(parts[3], data, 'text');
        }
        delete data[var_name];
        delete data[var_name + '##'];
        delete data[var_name + '#'];
        return s;
    },
    /**
	**	Expands the given template for each of the items in the list-expr, the mandatory varname parameter (namely 'i') indicates the name of the variable
	**	that will contain the data of each item as the list-expr is traversed. Extra variables i# and i## (suffix '#' and '##') are introduced to denote
	**	the index/key and numeric index of the current item respectively, note that the later will always have a numeric value.
	**
	**	Does not produce any output (returns null).
	**
	**	foreach <varname> <list-expr> <template>
	*/ '_foreach': function(parts, data) {
        let var_name = $0547cdb49a1cf689$var$Template.expand(parts[1], data, 'arg');
        let list = $0547cdb49a1cf689$var$Template.expand(parts[2], data, 'arg');
        let j = 0;
        if (!list) return null;
        for(let i in list){
            data[var_name] = list[i];
            data[var_name + '##'] = j++;
            data[var_name + '#'] = i;
            $0547cdb49a1cf689$var$Template.expand(parts[3], data, 'text');
        }
        delete data[var_name];
        delete data[var_name + '##'];
        delete data[var_name + '#'];
        return null;
    },
    /**
	**	Returns the valueA if the expression is true otherwise valueB, this is a short version of the 'if' function with the
	**	difference that the result is 'obj' instead of text.
	**
	**	? <expr> <valueA> [<valueB>]
	*/ '_?': function(parts, data) {
        if ($0547cdb49a1cf689$var$Template.expand(parts[1], data, 'arg')) return $0547cdb49a1cf689$var$Template.expand(parts[2], data, 'arg');
        if (parts.length > 3) return $0547cdb49a1cf689$var$Template.expand(parts[3], data, 'arg');
        return '';
    },
    /**
	**	Returns the valueA if it is not null (or empty or zero), otherwise returns valueB.
	**
	**	?? <valueA> <valueB>
	*/ '_??': function(parts, data) {
        let value = $0547cdb49a1cf689$var$Template.expand(parts[1], data, 'arg');
        if (value) return value;
        return $0547cdb49a1cf689$var$Template.expand(parts[2], data, 'arg');
    },
    /**
	**	Returns the value if the expression is true, supports 'elif' and 'else' as well. The result of this function is always text.
	**
	**	if <expr> <value> [elif <expr> <value>] [else <value>]
	*/ '_if': function(parts, data) {
        for(let i = 0; i < parts.length; i += 3){
            if ($0547cdb49a1cf689$var$Template.expand(parts[i], data, 'arg') == 'else') return $0547cdb49a1cf689$var$Template.expand(parts[i + 1], data, 'text');
            if ($0547cdb49a1cf689$var$Template.expand(parts[i + 1], data, 'arg')) return $0547cdb49a1cf689$var$Template.expand(parts[i + 2], data, 'text');
        }
        return '';
    },
    /**
	**	Loads the expression value and attempts to match one case.
	**
	**	switch <expr> <case1> <value1> ... <caseN> <valueN> default <defvalue> 
	*/ '_switch': function(parts, data) {
        let value = $0547cdb49a1cf689$var$Template.expand(parts[1], data, 'arg');
        for(let i = 2; i < parts.length; i += 2){
            let case_value = $0547cdb49a1cf689$var$Template.expand(parts[i], data, 'arg');
            if (case_value == value || case_value == 'default') return $0547cdb49a1cf689$var$Template.expand(parts[i + 1], data, 'text');
        }
        return '';
    },
    /**
	**	Exits the current inner most loop.
	**
	**	break
	*/ '_break': function(parts, data) {
        throw new Error('EXC_BREAK');
    },
    /**
	**	Skips execution and continues the next cycle of the current inner most loop.
	**
	**	continue
	*/ '_continue': function(parts, data) {
        throw new Error('EXC_CONTINUE');
    },
    /**
	**	Constructs an array with the results of repeating the specified template for a number of times.
	**
	**	repeat <varname:i> [from <number>] [to <number>] [count <number>] [step <number>] <template>
	*/ '_repeat': function(parts, data) {
        if (parts.length < 3 || (parts.length & 1) != 1) return '(`repeat`: Wrong number of parameters)';
        let var_name = $0547cdb49a1cf689$var$Template.value(parts[1], data);
        let count = null;
        let from = 0, to = null;
        let step = null;
        for(let i = 2; i < parts.length - 1; i += 2){
            let value = $0547cdb49a1cf689$var$Template.value(parts[i], data);
            switch(value.toLowerCase()){
                case 'from':
                    from = parseFloat($0547cdb49a1cf689$var$Template.value(parts[i + 1], data));
                    break;
                case 'to':
                    to = parseFloat($0547cdb49a1cf689$var$Template.value(parts[i + 1], data));
                    break;
                case 'count':
                    count = parseFloat($0547cdb49a1cf689$var$Template.value(parts[i + 1], data));
                    break;
                case 'step':
                    step = parseFloat($0547cdb49a1cf689$var$Template.value(parts[i + 1], data));
                    break;
            }
        }
        let tpl = parts[parts.length - 1];
        let arr = [];
        if (to !== null) {
            if (step === null) step = from > to ? -1 : 1;
            if (step < 0) {
                for(let i = from; i >= to; i += step)try {
                    data[var_name] = i;
                    arr.push($0547cdb49a1cf689$var$Template.value(tpl, data));
                } catch (e) {
                    let name = e.message;
                    if (name == 'EXC_BREAK') break;
                    if (name == 'EXC_CONTINUE') continue;
                    throw e;
                }
            } else {
                for(let i = from; i <= to; i += step)try {
                    data[var_name] = i;
                    arr.push($0547cdb49a1cf689$var$Template.value(tpl, data));
                } catch (e) {
                    let name = e.message;
                    if (name == 'EXC_BREAK') break;
                    if (name == 'EXC_CONTINUE') continue;
                    throw e;
                }
            }
        } else if (count !== null) {
            if (step === null) step = 1;
            for(let i = from; count > 0; count--, i += step)try {
                data[var_name] = i;
                arr.push($0547cdb49a1cf689$var$Template.value(tpl, data));
            } catch (e) {
                let name = e.message;
                if (name == 'EXC_BREAK') break;
                if (name == 'EXC_CONTINUE') continue;
                throw e;
            }
        } else {
            if (step === null) step = 1;
            for(let i = from;; i += step)try {
                data[var_name] = i;
                arr.push($0547cdb49a1cf689$var$Template.value(tpl, data));
            } catch (e) {
                let name = e.message;
                if (name == 'EXC_BREAK') break;
                if (name == 'EXC_CONTINUE') continue;
                throw e;
            }
        }
        delete data[var_name];
        return arr;
    },
    /**
	**	Repeats the specified template for a number of times.
	**
	**	for <varname:i> [from <number>] [to <number>] [count <number>] [step <number>] <template>
	*/ '_for': function(parts, data) {
        if (parts.length < 3 || (parts.length & 1) != 1) return '(`for`: Wrong number of parameters)';
        let var_name = $0547cdb49a1cf689$var$Template.value(parts[1], data);
        let count = null;
        let from = 0;
        to = null;
        let step = null;
        for(let i = 2; i < parts.length - 1; i += 2){
            value = $0547cdb49a1cf689$var$Template.value(parts[i], data);
            switch(value.toLowerCase()){
                case 'from':
                    from = parseFloat($0547cdb49a1cf689$var$Template.value(parts[i + 1], data));
                    break;
                case 'to':
                    to = parseFloat($0547cdb49a1cf689$var$Template.value(parts[i + 1], data));
                    break;
                case 'count':
                    count = parseFloat($0547cdb49a1cf689$var$Template.value(parts[i + 1], data));
                    break;
                case 'step':
                    step = parseFloat($0547cdb49a1cf689$var$Template.value(parts[i + 1], data));
                    break;
            }
        }
        let tpl = parts[parts.length - 1];
        if (to !== null) {
            if (step === null) step = from > to ? -1 : 1;
            if (step < 0) {
                for(let i = from; i >= to; i += step)try {
                    data[var_name] = i;
                    $0547cdb49a1cf689$var$Template.value(tpl, data);
                } catch (e) {
                    let name = e.message;
                    if (name == 'EXC_BREAK') break;
                    if (name == 'EXC_CONTINUE') continue;
                    throw e;
                }
            } else {
                for(let i = from; i <= to; i += step)try {
                    data[var_name] = i;
                    $0547cdb49a1cf689$var$Template.value(tpl, data);
                } catch (e) {
                    let name = e.message;
                    if (name == 'EXC_BREAK') break;
                    if (name == 'EXC_CONTINUE') continue;
                    throw e;
                }
            }
        } else if (count !== null) {
            if (step === null) step = 1;
            for(let i = from; count > 0; count--, i += step)try {
                data[var_name] = i;
                $0547cdb49a1cf689$var$Template.value(tpl, data);
            } catch (e) {
                let name = e.message;
                if (name == 'EXC_BREAK') break;
                if (name == 'EXC_CONTINUE') continue;
                throw e;
            }
        } else {
            if (step === null) step = 1;
            for(let i = from;; i += step)try {
                data[var_name] = i;
                $0547cdb49a1cf689$var$Template.value(tpl, data);
            } catch (e) {
                let name = e.message;
                if (name == 'EXC_BREAK') break;
                if (name == 'EXC_CONTINUE') continue;
                throw e;
            }
        }
        delete data[var_name];
        return null;
    },
    /**
	**	Repeats the specified template infinitely until a "break" is found.
	**
	**	loop <template>
	*/ '_loop': function(parts, data) {
        if (parts.length < 2) return '(`loop`: Wrong number of parameters)';
        let tpl = parts[1];
        while(true)try {
            $0547cdb49a1cf689$var$Template.value(tpl, data);
        } catch (e) {
            let name = e.message;
            if (name == 'EXC_BREAK') break;
            if (name == 'EXC_CONTINUE') continue;
            throw e;
        }
        return null;
    },
    /**
	**	Writes the specified arguments to the console.
	**
	**	echo <expr> [<expr>...]
	*/ '_echo': function(parts, data) {
        let s = '';
        for(let i = 1; i < parts.length; i++)s += $0547cdb49a1cf689$var$Template.expand(parts[i], data, 'arg');
        console.log(s);
        return '';
    },
    /**
	**	Constructs a list from the given arguments and returns it.
	**
	**	# <expr> [<expr>...]
	*/ '_#': function(parts, data) {
        let s = [];
        for(let i = 1; i < parts.length; i++)s.push($0547cdb49a1cf689$var$Template.expand(parts[i], data, 'arg'));
        return s;
    },
    /**
	**	Constructs a non-expanded list from the given arguments and returns it.
	**
	**	## <expr> [<expr>...]
	*/ '_##': function(parts, data) {
        let s = [];
        for(let i = 1; i < parts.length; i++)s.push(parts[i]);
        return s;
    },
    /**
	**	Constructs an associative array (dictionary) and returns it.
	**
	**	& <name>: <expr> [<name>: <expr>...]
	**	& :<name> <expr> [:<name> <expr>...]
	*/ '_&': function(parts, data) {
        return $0547cdb49a1cf689$var$Template.getNamedValues(parts, data, 1, true);
    },
    /**
	**	Constructs a non-expanded associative array (dictionary) and returns it.
	**
	**	&& <name>: <expr> [<name>: <expr>...]
	**	&& :<name> <expr> [:<name> <expr>...]
	*/ '_&&': function(parts, data) {
        return $0547cdb49a1cf689$var$Template.getNamedValues(parts, data, 1, false);
    },
    /**
	**	Returns true if the specified map contains all the specified keys. If it fails the global variable `err` will contain an error message.
	**
	**	contains <expr> <name> [<name>...]
	*/ 'contains': function(args, parts, data) {
        let value = args[1];
        if (typeof value != 'object') {
            data.err = 'Argument is not a Map';
            return false;
        }
        let s = '';
        for(let i = 2; i < args.length; i++)if (!(args[i] in value)) s += ', ' + args[i];
        if (s != '') {
            data.err = s.substr(1);
            return false;
        }
        return true;
    },
    /**
	**	Returns true if the specified map has the specified key. Returns boolean.
	**
	**	has <name> <expr>
	*/ 'has': function(args, parts, data) {
        let value = args[2];
        if ($0f51e41db87486be$export$2e2bcd8739ae039.typeOf(value) != 'object') return false;
        return args[1] in value;
    },
    /**
	**	Returns a new array/map contaning the transformed values of the array/map (evaluating the template). And just as in 'each', the i# and i## variables be available.
	**
	**	map <varname> <list-expr> <template>
	*/ '_map': function(parts, data) {
        let var_name = $0547cdb49a1cf689$var$Template.expand(parts[1], data, 'arg');
        let list = $0547cdb49a1cf689$var$Template.expand(parts[2], data, 'arg');
        if (!list) return list;
        let arrayMode = $0f51e41db87486be$export$2e2bcd8739ae039.typeOf(list) == 'array' ? true : false;
        let output = arrayMode ? [] : {
        };
        let j = 0;
        for(let i in list){
            data[var_name] = list[i];
            data[var_name + '##'] = j++;
            data[var_name + '#'] = i;
            if (arrayMode) output.push($0547cdb49a1cf689$var$Template.expand(parts[3], data, 'arg'));
            else output[i] = $0547cdb49a1cf689$var$Template.expand(parts[3], data, 'arg');
        }
        delete data[var_name];
        delete data[var_name + '##'];
        delete data[var_name + '#'];
        return output;
    },
    /**
	**	Returns a new array/map contaning the elements where the template evaluates to non-zero. Just as in 'each', the i# and i## variables be available.
	**
	**	filter <varname> <list-expr> <template>
	*/ '_filter': function(parts, data) {
        let var_name = $0547cdb49a1cf689$var$Template.expand(parts[1], data, 'arg');
        let list = $0547cdb49a1cf689$var$Template.expand(parts[2], data, 'arg');
        if (!list) return list;
        let arrayMode = $0f51e41db87486be$export$2e2bcd8739ae039.typeOf(list) == 'array' ? true : false;
        let output = arrayMode ? [] : {
        };
        let j = 0;
        for(let i in list){
            data[var_name] = list[i];
            data[var_name + '##'] = j++;
            data[var_name + '#'] = i;
            if (~~$0547cdb49a1cf689$var$Template.expand(parts[3], data, 'arg')) {
                if (arrayMode) output.push(list[i]);
                else output[i] = list[i];
            }
        }
        delete data[var_name];
        delete data[var_name + '##'];
        delete data[var_name + '#'];
        return output;
    },
    /**
	**	Expands the specified template string with the given data. The sym_open and sym_close will be '{' and '}' respectively.
	**	If no data is provided, current data parameter will be used.
	**
	**	expand <template> <data>
	*/ 'expand': function(args, parts, data) {
        return $0547cdb49a1cf689$var$Template.expand($0547cdb49a1cf689$var$Template.parseTemplate(args[1], '{', '}'), args.length == 3 ? args[2] : data);
    },
    /**
	**	Calls a function described by the given parameter.
	**
	**	call <function> <args...>
	*/ '_call': function(parts, data) {
        let ref = $0547cdb49a1cf689$var$Template.expand(parts[1], data, 'varref');
        if (!ref || typeof ref[0][ref[1]] != 'function') throw new Error('Expression is not a function: ' + $0547cdb49a1cf689$var$Template.expand(parts[1], data, 'obj').map((i)=>i == null ? '.' : i
        ).join(''));
        let args = [];
        for(let i3 = 2; i3 < parts.length; i3++)args.push($0547cdb49a1cf689$var$Template.value(parts[i3], data));
        return ref[0][ref[1]](...args);
    }
};
var $0547cdb49a1cf689$export$2e2bcd8739ae039 = $0547cdb49a1cf689$var$Template;


const $8832174729c85c16$export$eefcfe56efaaa57d = $0f51e41db87486be$export$2e2bcd8739ae039;
const $8832174729c85c16$export$4c85e640eb41c31b = $c7e541a58a884fff$export$2e2bcd8739ae039;
const $8832174729c85c16$export$d61e24a684f9e51 = $ee3ff522d1793c65$export$2e2bcd8739ae039;
const $8832174729c85c16$export$ec8b666c5fe2c75a = $e33703b9a5d260e3$export$2e2bcd8739ae039;
const $8832174729c85c16$export$a1edc412be3e1841 = $f423a1a212f33228$export$2e2bcd8739ae039;
const $8832174729c85c16$export$59eced47f477f85a = $f0845037318ac40a$export$2e2bcd8739ae039;
const $8832174729c85c16$export$19342e026b58ebb7 = $160a6e172ab4e1e1$export$2e2bcd8739ae039;
const $8832174729c85c16$export$3a9581c9ade29768 = $8c5ffc7fb5fb6f99$export$2e2bcd8739ae039;
const $8832174729c85c16$export$fb8073518f34e6ec = $dc37df3258eece89$export$2e2bcd8739ae039;
const $8832174729c85c16$export$14416b8d99d47caa = $0547cdb49a1cf689$export$2e2bcd8739ae039;


export {$8832174729c85c16$export$eefcfe56efaaa57d as Rinn, $8832174729c85c16$export$4c85e640eb41c31b as Class, $8832174729c85c16$export$d61e24a684f9e51 as Event, $8832174729c85c16$export$ec8b666c5fe2c75a as EventDispatcher, $8832174729c85c16$export$a1edc412be3e1841 as Model, $8832174729c85c16$export$59eced47f477f85a as ModelList, $8832174729c85c16$export$19342e026b58ebb7 as Schema, $8832174729c85c16$export$3a9581c9ade29768 as Flattenable, $8832174729c85c16$export$fb8073518f34e6ec as Collection, $8832174729c85c16$export$14416b8d99d47caa as Template};
//# sourceMappingURL=rinn.js.map
