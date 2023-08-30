function $parcel$export(t,e,n,r){Object.defineProperty(t,e,{get:n,set:r,enumerable:!0,configurable:!0})}var $parcel$global="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},$parcel$modules={},$parcel$inits={},parcelRequire=$parcel$global.parcelRequire25d2;null==parcelRequire&&((parcelRequire=function(t){if(t in $parcel$modules)return $parcel$modules[t].exports;if(t in $parcel$inits){var e=$parcel$inits[t];delete $parcel$inits[t];var n={id:t,exports:{}};return $parcel$modules[t]=n,e.call(n.exports,n,n.exports),n.exports}var r=Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(t,e){$parcel$inits[t]=e},$parcel$global.parcelRequire25d2=parcelRequire),parcelRequire.register("leTsS",function(module,exports){$parcel$export(module.exports,"default",()=>$f765ede7a2bbed38$export$2e2bcd8739ae039);var $1V76q=parcelRequire("1V76q"),$8swMk=parcelRequire("8swMk"),/**
**	Map of model constraint handlers. Each function should accept parameters (in order): the model object (model), the constraint value (ctval),
**	the property name (name), the property value (value) and return the corrected value once verified or throw an exception if errors occur.
*/$f765ede7a2bbed38$export$2e2bcd8739ae039={/**
	**	Utility function (not a handler) to get the real value given a reference string. If the value is not a string, the value itself will
	**	be returned, if it is a string starting with '#' the model property will be returned, if starts with '@' the object property will be
	**	returned, otherwise the contents of the string will eval'd and returned.
	*/_getref:function(value,obj){return"string"!=typeof value?value:("#"==value.substr(0,1)?value=obj.get(value.substr(1)):"@"==value.substr(0,1)&&(value=obj[value.substr(1)]),"string"==typeof value)?eval(value):value},/**
	**	Verifies that the new value is of the valid type before storing it on the property. When possible if the
	**	input is of compatible type it will be converted to the target type.
	*/type:function(t,e,n,r){switch(e){case"int":if(isNaN(r=parseInt(r)))throw Error(e);break;case"float":if(isNaN(r=parseFloat(r)))throw Error(e);break;case"string":r=null==r?"":r.toString();break;case"bit":if(!0===r||!1===r){r=r?1:0;break}if(isNaN(r=parseInt(r)))throw Error(e);r=r?1:0;break;case"array":if("array"==(0,$1V76q.default).typeOf(r))break;if(null==r){r=[];break}throw Error(e);case"bool":if("true"===r||!0===r){r=!0;break}if("false"===r||!1===r){r=!1;break}throw Error(e)}return r},/**
	**	Verifies that the field is of the specified model type.
	*/model:function(t,e,n,r){var i=this._getref(e,t);if(!i)throw Error(e);return r?i.ensure(r):new i},/**
	**	Verifies that the field is of the specified class.
	*/cls:function(t,e,n,r){var i=this._getref(e,t);return r?(0,$1V76q.default).ensureTypeOf(i,r):new i},/**
	**	Verifies that the array contents are of the specified class. Returns error if the class does not exist
	**	or if the field is not an array. Therefore a type:array constraint should be used before this one.
	*/arrayof:function(t,e,n,r){var i=this._getref(e,t);if(r||(r=[]),!i||"array"!=(0,$1V76q.default).typeOf(r))throw Error(e);for(var s=0;s<r.length;s++)r[s]=(0,$1V76q.default).ensureTypeOf(i,r[s]);return r},/**
	**	Verifies that the array contents are not null. Returns error if the field is not an array, therefore a
	**	type:array constraint should be used before this one.
	*/arraynull:function(t,e,n,r){var i=!1;if("object"==(0,$1V76q.default).typeOf(e)&&(e.remove&&(i=e.remove),e=e.value),e)return r;if("array"!=(0,$1V76q.default).typeOf(r))throw Error(e);for(var s=0;s<r.length;s++)if(null==r[s]){if(i)r.splice(s--,1);else throw Error(e)}return r},/**
	**	Verifies that the array contents are all compliant. Returns error if the field is not an array, therefore
	**	a type:array constraint should be used before this one.
	*/arraycompliant:function(t,e,n,r){var i=!1;if("object"==(0,$1V76q.default).typeOf(e)&&(e.remove&&(i=e.remove),e=e.value),!e)return r;if("array"!=(0,$1V76q.default).typeOf(r))throw Error(e);for(var s=0;s<r.length;s++)if(null!=r[s]&&!r[s].isCompliant()){if(i)r.splice(s--,1);else throw Error(e)}return r},/**
	**	Verifies the presense of the field.
	*/required:function(t,e,n,r){if(null==r)throw Error(e?"":"null");if("array"===(0,$1V76q.default).typeOf(r)){if(0==r.length)throw Error(e?"":"null")}else if(0==r.toString().length)throw Error(e?"":"null");return r},/**
	**	Verifies the minimum length of the field.
	*/minlen:function(t,e,n,r){if(r.toString().length<e)throw Error(e);return r},/**
	**	Verifies the maximum length of the field.
	*/maxlen:function(t,e,n,r){if(r.toString().length>e)throw Error(e);return r},/**
	**	Verifies the minimum value of the field.
	*/minval:function(t,e,n,r){if(parseFloat(r)<e)throw Error(e);return r},/**
	**	Verifies the maximum value of the field.
	*/maxval:function(t,e,n,r){if(parseFloat(r)>e)throw Error(e);return r},/**
	**	Verifies the minimum number of items in the array.
	*/mincount:function(t,e,n,r){if("array"!=(0,$1V76q.default).typeOf(r)||r.length<e)throw Error(e);return r},/**
	**	Verifies the maximum number of items in the array.
	*/maxcount:function(t,e,n,r){if("array"!=(0,$1V76q.default).typeOf(r)||r.length>e)throw Error(e);return r},/**
	**	Verifies the format of the field using a regular expression. The constraint value should be the name of
	**	one of the Model.Regex regular expressions.
	*/pattern:function(t,e,n,r){if(!(0,$8swMk.default)[e].test(r.toString()))throw Error(e);return r},/**
	**	Verifies that the field is inside the specified set of options. The set can be an array or a string with
	**	the options separated by vertical bar (|). The comparison is case-sensitive.
	*/inset:function(t,e,n,r){if("array"!=(0,$1V76q.default).typeOf(e)){if(!RegExp("^("+e.toString()+")$").test(r.toString()))throw Error(e);return r}if(-1==e.indexOf(r.toString()))throw Error(e.join("|"));return r},/**
	**	Sets the field to upper case.
	*/upper:function(t,e,n,r){return e?r.toString().toUpperCase():r},/**
	**	Sets the field to lower case.
	*/lower:function(t,e,n,r){return e?r.toString().toLowerCase():r}}}),parcelRequire.register("1V76q",function(t,e){$parcel$export(t.exports,"default",()=>r);let n={};var r=n;/*
**	Invokes the specified function 'fn' 10ms later.
**
**	>> void invokeLater (function fn);
*/n.invokeLater=function(t){t&&setTimeout(function(){t()},10)},/*
**	Waits for the specified amount of milliseconds. Returns a Promise.
**
**	>> Promise wait (int millis);
*/n.wait=function(t){return new Promise(function(e,n){setTimeout(e,t)})},/*
**	Returns the type of an element 'o', properly detects arrays and null types. The return string is always in lowercase.
**
**	>> string typeOf (any o);
*/n.typeOf=function(t){return t instanceof Array?"array":null===t?"null":(typeof t).toString().toLowerCase()},/*
**	Returns boolean indicating if the type of the element is an array or an object.
**
**	>> bool isArrayOrObject (any o);
*/n.isArrayOrObject=function(t){switch(n.typeOf(t)){case"array":case"object":return!0}return!1},/*
**	Creates a clone (deep copy) of the specified element. The element can be an array, an object or a primitive type.
**
**	>> T clone (T elem);
*/n.clone=function(t){let e=n.typeOf(t);if("array"===e){e=[];for(let r=0;r<t.length;r++)e.push(n.clone(t[r]))}else if("object"===e){if("clone"in t&&"function"==typeof t.clone)return t.clone();for(let r in e={},t)e[r]=n.clone(t[r])}else e=t;return e},/*
**	Merges all given elements into the first one, object fields are cloned.
**
**	>> T merge (T... elems)
*/n.merge=function(t,...e){if("array"==n.typeOf(t))for(let r=0;r<e.length;r++){let i=e[r];if("array"!=n.typeOf(i))t.push(i);else for(let e=0;e<i.length;e++)t.push(n.clone(i[e]))}else if("object"==n.typeOf(t))for(let r=0;r<e.length;r++){let i=e[r];if("object"==n.typeOf(i))for(let e in i)n.isArrayOrObject(i[e])?e in t?n.merge(t[e],i[e]):t[e]=n.clone(i[e]):t[e]=i[e]}return t},/*
**	Assigns all fields from the specified objects into the first one.
**
**	>> object override (object output, object... objs)
*/n.override=function(t,...e){for(let n=0;n<e.length;n++)for(let r in e[n])t[r]=e[n][r];return t},/*
**	Compares two objects and returns `true` if all properties in "partial" find a match in "full".
*/n.partialCompare=function(t,e){if(null==t||null==e)return!1;if(t===e)return!0;for(var n in e)if(t[n]!=e[n])return!1;return!0},/*
**	Performs a partial search for an object (o) in the specified array and returns its index or `false` if the
**	object was not found. When `getObject` is set to `true` the object will be returned instead of an index, or
**	`null` if not found.
*/n.arrayFind=function(t,e,n){for(var r=0;t&&r<t.length;r++)if(this.partialCompare(t[r],e))return n?t[r]:r;return!!n&&null},/*
**	Verifies if the specified object is of class `m`, returns boolean.
**
**	>> bool isTypeOf (object obj, class _class);
*/n.isInstanceOf=function(t,e){return!!t&&!!e&&"object"==typeof t&&(t instanceof e||"isInstanceOf"in t&&t.isInstanceOf(e))},/*
**	Traverses the given object attempting to find the index/key that does an identical match with the specified value,
**	if not found returns -1, otherwise the index/key where the value was found.
**
**	>> int indexOf (array container, T value)
**	>> string indexOf (object container, T value)
*/n.indexOf=function(t,e,n=!1){if(n){for(let n=0;n<t.length;n++)if(t[n]===e)return n;return -1}for(let n in t)if(t[n]===e)return n;return -1},/*
**	Escapes a string using HTML entities.
**
**	>> string escape (string str);
*/n.escape=function(t){return(t+"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")},/*
**	Verifies if the specified object is of class `m`, if not it will create a new instance of `m` passing `o` as parameter.
**
**	>> object ensureTypeOf (class m, object o);
*/n.ensureTypeOf=function(t,e){return!e||!t||e instanceof t||e.isInstanceOf&&t.prototype.className&&e.isInstanceOf(t.prototype.className)?e:new t(e)},/*
**	Serializes an object and returns its JSON string representation.
**
**	>> string serialize (object o);
*/n.serialize=function(t){return JSON.stringify(t)},/*
**	Deserializes a string in JSON format and returns the result.
**
**	>> any deserialize (string s);
*/n.deserialize=function(t){return JSON.parse(t)},/*
**	Chains a new function to an existing one on some object, such that invoking the function on the object will cause
**	both functions to run (order would be oldFunction then newFunction).
**
**	If the `conditional` flag is set to `true`, the second function will be run only if the first one returns non-false.
**	Returns an object with a single method 'unhook' which will revert the changes to leave only the original function.
**
**	>> object{function unhook} hook (Object object, String functionName, function newFunction, bool conditional=false);
*/n.hookAppend=function(t,e,n,r=!0){let i=t[e];return r?t[e]=function(...t){if(!1!==i.apply(this,t))return n.apply(this,t)}:t[e]=function(...t){return i.apply(this,t),n.apply(this,t)},{unhook:function(){t[e]=i}}},/*
**	Chains a new function to an existing one on some object, such that invoking the function on the object will cause
**	both functions to run (order would be oldFunction then newFunction).
**
**	If the `conditional` flag is set to `true`, the second function will be run only if the first one returns non-false.
**	Returns an object with a single method 'unhook' which will revert the changes to leave only the original function.
**
**	>> object{function unhook} hook (Object object, String functionName, function newFunction, bool conditional=false);
*/n.hookPrepend=function(t,e,n,r=!0){let i=t[e];return r?t[e]=function(...t){if(!1!==n.apply(this,t))return i.apply(this,t)}:t[e]=function(...t){return n.apply(this,t),i.apply(this,t)},{unhook:function(){t[e]=i}}}}),parcelRequire.register("8swMk",function(t,e){$parcel$export(t.exports,"default",()=>n);/**
**	Common regular expressions for pattern validation.
*/var n={email:/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)+$/i,url:/^[\w-]+:\/\/[\w-]+(\.\w+)+.*$/,urlNoProt:/^[\w-]+(\.\w+)+.*$/,name:/^[-A-Za-z0-9_.]+$/,uname:/^['\pL\pN ]+$/,text:/^[^&<>{}]*$/,utext:/^([\r\n\pL\pN\pS &!@#$%*\[\]()_+=;',.\/?:"~-]+)$/}});var $1V76q=parcelRequire("1V76q"),$1V76q=parcelRequire("1V76q");/**
 * Base class used to create other classes with complex prototype based multiple inheritance while at the
 * same time avoiding the prototype chain for faster access. Supports calling parent class methods.
 *///!class Class
const $948f072c447a9569$var$Class=function(){};/**
 * Reference to the class itself.
 */$948f072c447a9569$var$Class._class=$948f072c447a9569$var$Class,/**
 * Contains the methods of each of the super classes.
 */$948f072c447a9569$var$Class._super={},/**
 * Name of the class, if none specified the class will be considered "final" and will not be inheritable.
 * !readonly string className;
 */$948f072c447a9569$var$Class.prototype.className="Class",/**
 * Class constructor, should initialize the instance. Invoked when the `new` keyword is used with the class.
 * !constructor();
 */$948f072c447a9569$var$Class.prototype.__ctor=function(){},/**
 * Class destructor, should clear the instance and release any used resources, invoked when the global `dispose` function is called with an instance as parameter.
 * !__dtor() : void;
 */$948f072c447a9569$var$Class.prototype.__dtor=function(){},/**
 * Returns true if the object is an instance of the specified class, the parameter can be a class name (string), a constructor (function) or
 * a class instance (object), in any cases the appropriate checks will be done.
 * !isInstanceOf (className: string|function|object) : boolean;
 */$948f072c447a9569$var$Class.prototype.isInstanceOf=function(t){return null!==t&&("function"==typeof t?t=t.prototype.className:"string"!=typeof t&&(t=t.__proto__.className),this.className===t||this._super.hasOwnProperty(t))},/**
 * Returns true if the given object is an instance of the specified class, the parameter can be a class name (string), a constructor (function)
 * or a class instance (object), in any cases the appropriate checks will be done.
 * !instanceOf (object: object, className: string|function|object) : boolean;
 */$948f072c447a9569$var$Class.instanceOf=function(t,e){return null!==t&&null!==e&&t.isInstanceOf(e)},/**
 * Internal method to ensure the _super field of an instance has all functions properly bound to the instance.
 */$948f072c447a9569$var$Class.prototype._initSuperRefs=function(){let t=this.constructor._super,e={},n=this;for(let r in t){let i={},s=t[r].prototype;for(let t in s)"function"===(0,$1V76q.default).typeOf(s[t])&&(i[t]=function(t){return function(e,r,i,s,a,l,u,o,f,h,c){return t.call(n,e,r,i,s,a,l,u,o,f,h,c)}}(s[t]));e[r]=i}this._super=e},/*
**	Extends the class with the specified prototype. The prototype can be a function (class constructor) or an object. Note that the
**	class will be modified (and returned) instead of creating a new class. Must be called at the class-level (**not** instance level).
**	When a class is provided all fields starting with uppercase at the class-level will not be inherited, this is used to create constants
**	on classes without having them to be copied to derived classes.
**
**	>> class inherit (constructor classConstructor);
**	>> class inherit (object obj);
*/$948f072c447a9569$var$Class.inherit=function(t){let e=this._class,n=e._super,r=e._class;if("function"===(0,$1V76q.default).typeOf(t)){// Move constants (uppercased properties) to the class-level instead of prototype-level.
for(let n in t._class)/^[A-Z]/.test(n)||(e[n]=t._class[n]);// Combine methods and properties.
(0,$1V76q.default).override(e.prototype,t._class.prototype),// Combine super references.
(0,$1V76q.default).override(n,t._class._super),t._class.prototype.className&&(n[t._class.prototype.className]=t._class)}else(0,$1V76q.default).override(e.prototype,t);return e._super=n,e._class=r,e},/**
 * Internal method used to extend a class with one or more prototypes.
 */$948f072c447a9569$var$Class.prototype._extend=function(t,e){if(0===e.length)return t;//VIOLET OPTIMIZE
let n=function(...t){this._initSuperRefs(),this.__ctor.apply(this,t)};n._class=n,n._super={},$948f072c447a9569$var$Class.inherit.call(n,t),delete n.prototype.className;for(let t=0;t<e.length;t++)n.inherit(e[t]);return delete n._super.Class,"classInit"in n.prototype&&n.prototype.classInit(),n.isInstance=function(t){return(0,$1V76q.default).isInstanceOf(t,n)},n},/**
 * Creates a new class with the specified prototypes each of which can be a class constructor (function) or an object.
 */$948f072c447a9569$var$Class.extend=function(...t){return this._class.prototype._extend(this,t)},/**
 * Creates a new instance of a class resulting from extending the self class with the specified prototype.
 */$948f072c447a9569$var$Class.create=function(t){return new(this.extend(t))},/**
 * Mutates the host object to be an instance of the specified class.
 * !static mutate (classConstructor: object, host: object, override?: object) : object;
 */$948f072c447a9569$var$Class.mutate=function(t,e,n=null){let r=new t;// Copy all members from the class prototype.
for(let n in t.prototype)e.hasOwnProperty(n)||(e[n]=t.prototype[n]);// Copy all members from the zombie class instance.
for(let t in r)e.hasOwnProperty(t)||(e[t]=r[t]);// Rebind the super references.
if(e._super)for(let n in e._super)for(let r in e._super[n])e._super[n][r]=t.prototype.constructor._super[n].prototype[r].bind(e);// Copy override members.
if(null!==n)for(let t in n)e[t]=n[t];return e};var $948f072c447a9569$export$2e2bcd8739ae039=$948f072c447a9569$var$Class,$1V76q=parcelRequire("1V76q"),/**
**	Holds the information about a triggered event. It also provides a mechanism to allow asynchronous
**	event propagation to ensure the event chain order.
*/$7c8e31460e56f4d6$export$2e2bcd8739ae039=$948f072c447a9569$export$2e2bcd8739ae039.extend({/**
	**	Name of the class.
	*/className:"Event",/**
	**	Source of the event.
	*/source:null,/**
	**	Name of the event.
	*/name:null,/**
	**	Arguments of the event.
	*/args:null,/**
	**	Indicates if the last event handler wants to use async mode.
	*/_async:!1,/**
	**	Queue of all handlers to invoke.
	*/list:null,/**
	**	Next event to be executed in the event chain.
	*/next:null,/**
	**	Return values from event handlers.
	*/ret:null,/**
	**	Original root event.
	*/original:null,/**
	**	Index of the current event handler.
	*/i:-1,/**
	**	Contructs an event object with the specified parameters. Source is the event-dispatcher object, list is
	**	an array with all the listeners to invoke. The eventName and eventArgs are the event information to be
	**	passed to each handler and if a callback is specified (cbHandler+cbContext) it will be executed once all
	**	the event handlers have been processed.
	**
	**	Event __ctor (source: EventDispatcher, list: Array, eventName: string, eventArgs: map, cbHandler: function, cbContext: object);
	*/__ctor:function(t,e,n,r,i,s){this.source=t,this.name=n,this.args=r,this.cbHandler=i,this.cbContext=s,this.list=e,this.reset()},/**
	**	Resets the event to its initial state. An event object can be reused by resetting it and then
	**	invoking the resume event.
	**
	**	Event reset ();
	*/reset:function(){return this.next=null,this.ret=[],this._async=!1,this.i=-1,this},/**
	**	Changes the source of the event.
	**
	**	Event setSource (object value);
	*/setSource:function(t){return this.source=t,this},/**
	**	Sets the internal asynchronous flag. Should be called before a handler returns. If a handler
	**	calls this method it should also call resume() when async operations are finished.
	**
	**	Event wait ();
	*/wait:function(){return this._async=!0,this},/**
	**	Resumes event propagation. Should be called manually by event handlers that also call wait().
	**
	**	Event resume ();
	*/resume:function(){for(this._async=!1;!this._async&&!(++this.i>=this.list.length);)if(!this.list[this.i].silent){if("string"==(0,$1V76q.default).typeOf(this.list[this.i].handler)){if(this.list[this.i].context){if(!this.list[this.i].context[this.list[this.i].handler])continue;if(!1===this.list[this.i].context[this.list[this.i].handler](this,this.args,this.list[this.i].data))break}else if(!1===$parcel$global[this.list[this.i].handler].call(null,this,this.args,this.list[this.i].data))break}else if(!1===this.list[this.i].handler.call(this.list[this.i].context,this,this.args,this.list[this.i].data))break}return this._async||(this.i>=this.list.length&&this.next&&this.next.resume(),this.cbHandler&&this.cbHandler.call(this.cbContext)),this},/**
	**	Sets the "original" property of the event to indicate where the original event comes from.
	**
	**	Event from (event: Event);
	*/from:function(t){return this.original=t,this},/**
	**	Enqueues the specified event to be executed upon the current event process is finished. The "original"
	**	property of the chained event will be set to the current event.
	**
	**	Event enqueueEvent (event: Event);
	*/enqueue:function(t){var e;if(!t)return this;for(e=this;null!=e.next;e=e.next);return e.next=t,t.from(this),this}}),/**
**	Event dispatcher allows several event listeners to be attached, these will be invoked whenever the
**	event that is being listened to is triggered.
*/$0681abc29226a7a0$export$2e2bcd8739ae039=$948f072c447a9569$export$2e2bcd8739ae039.extend({/**
	**	Name of the class.
	*/className:"EventDispatcher",/**
	**	Listeners attached to this event dispatcher. Grouped by event name.
	*/listeners:null,/**
	**	Namespace for event dispatching. Defaults to null. Can be modified using setNamespace().
	*/namespace:null,/**
	**	Initializes the event dispatcher.
	**
	**	EventDispatcher __ctor ();
	*/__ctor:function(){this.listeners={}},/**
	**	Sets the event dispatching namespace. Used to force all events dispatched to have the specified namespace.
	**
	**	EventDispatcher setNamespace (value: string);
	*/setNamespace:function(t){return this.namespace=t,this},/**
	**	Adds an event listener for a specified event to the event dispatcher. The event name can have an optional
	**	namespace indicator which is added to the beginning of the event name and separated using a colon (:). This
	**	indicator can be used to later trigger or remove all handlers of an specific namespace.
	**
	**	EventDispatcher addEventListener (eventName: string, handler: function, context: object, data: object);
	*/addEventListener:function(t,e,n,r){var i=(t=t.split(":"))[t.length-1],s=t.length>1?t[0]:null;return this.listeners[i]||(this.listeners[i]=[]),this.listeners[i].push({ns:s,handler:e,context:n,data:r,silent:0}),this},/**
	**	Removes an event listener from the event dispatcher. If only the name is provided all handlers with the
	**	specified name will be removed. If a context is provided without a handler then any handler matching the
	**	context will be removed. Special event name "*" can be used to match all event names.
	**
	**	EventDispatcher removeEventListener (eventName: string, handler: function, context: object);
	*/removeEventListener:function(t,e,n){var r=(t=t.split(":"))[t.length-1],i=t.length>1?t[0]:null;if("*"==r)for(var s in this.listeners)for(var a=this.listeners[s],l=0;l<a.length;l++){var u=!0;e&&(u=u&&a[l].handler===e),n&&(u=u&&a[l].context===n),i&&(u=u&&a[l].ns==i),u&&a.splice(l--,1)}else{if(!this.listeners[r])return this;for(var a=this.listeners[r],l=0;l<a.length;l++){var u=!0;e&&(u=u&&a[l].handler===e),n&&(u=u&&a[l].context===n),i&&(u=u&&a[l].ns==i),u&&a.splice(l--,1)}}return this},/**
	**	Prepares an event with the specified parameters for its later usage. The event is started when
	**	the resume() method is called. If a callback is specified it will be executed once all event
	**	handlers have been processed.
	**
	**	Event prepareEvent (eventName: string, eventArgs: map, cbHandler: function, cbContext: object);
	**	Event prepareEvent (eventName: string, eventArgs: map);
	*/prepareEvent:function(t,e,n,r){var i=[],s=(t=t.split(":"))[t.length-1],a=t.length>1?t[0]:null;this.listeners[s]&&(i=i.concat(this.listeners[s])),this.listeners["*"]&&(i=i.concat(this.listeners["*"]));for(var l=0;l<i.length;l++)i[l].silent&&i.splice(l--,1);if(a)for(var l=0;l<i.length;l++)i[l].ns!=a&&i.splice(l--,1);return new $7c8e31460e56f4d6$export$2e2bcd8739ae039(this,i,s,e,n,r)},/**
	**	Silences or unsilences all handlers attached to an event such that if the event fires the handler(s) will
	**	not be invoked. It is recommended to use a namespace to ensure other handlers will continue to be run.
	**
	**	EventDispatcher silence (eventName: string);
	*/silence:function(t,e){var n=(t=t.split(":"))[t.length-1],r=t.length>1?t[0]:null;if(e=!1===e?-1:1,"*"==n)for(var i in this.listeners)for(var s=this.listeners[i],a=0;a<s.length;a++)r&&s[a].ns!=r||(s[a].silent+=e);else{if(!this.listeners[n])return this;for(var s=this.listeners[n],a=0;a<s.length;a++)r&&s[a].ns!=r||(s[a].silent+=e)}return this},/**
	**	Dispatches an event to the respective listeners. If a callback is specified it will be executed once
	**	all event handlers have been processed.
	**
	**	Event dispatchEvent (eventName: string, eventArgs: map, cbHandler: function, cbContext: object);
	**	Event dispatchEvent (eventName: string, eventArgs: map);
	*/dispatchEvent:function(t,e,n,r){return this.prepareEvent(this.namespace?this.namespace+":"+t:t,e,n,r).resume()}}),$1V76q=parcelRequire("1V76q"),$leTsS=parcelRequire("leTsS");/**
**	A model is a high-integrity data object used to store properties and more importantly to provide event support to notify of any
**	kind of change that occurs to the model's properties. Integrity of the model is maintained by optionally using property constraints.
*/let $d7fcaaa29d0ffaa7$var$_Model=$0681abc29226a7a0$export$2e2bcd8739ae039.extend({/**
	**	Name of the class.
	*/className:"Model",/**
	**	Default properties for the model. Can be a map with the property name and its default value or a function
	**	returning a map with dynamic default values. This is used to reset the model to its initial state.
	*/defaults:null,/**
	**	Model property contraints. A map with the property name and an object specifying the constraints of the
	**	property. This is used to determine the type, format and behavior of each property in the model.
	*/constraints:null,/**
	**	Properties of the model.
	*/data:null,/**
	**	Array with the name of the properties that have changed. Populated prior modelChanged event.
	*/changedList:null,/**
	**	Silent mode indicator. While in silent mode events will not be dispatched.
	*/_silent:0,/**
	**	Current nesting level of the set() method. This is used to determine when all the property
	**	changes are done.
	*/_level:0,/**
	**	Initializes the model and sets the properties to the specified data object.
	**
	**	>> Model __ctor (object data);
	**	>> Model __ctor (object data, object defaults);
	*/__ctor:function(t,e){if(this._super.EventDispatcher.__ctor(),this.data={},null!=e)this.reset(e,!1);else{let t=null;if(!this.defaults&&this.constraints)for(let e in t={},this.constraints){let n=this.constraints[e];if(null===n.def||void 0===n.def){t[e]=null;continue}"function"==typeof n.def?t[e]=n.def():t[e]=n.def}this.reset(t)}this.init(),null!=t&&this.set(t,!0),this.constraints&&this.update(),this.ready()},/**
	**	Resets the model to its default state and triggers update events. If a map is provided the defaults of
	**	the model will be set to the specified map.
	**
	**	>> Model reset (object defaults, [bool nsilent=true]);
	**	>> Model reset ([bool nsilent=true]);
	*/reset:function(t,e){if(!this.defaults){if(!t||"object"!==(0,$1V76q.default).typeOf(t)&&"function"!==(0,$1V76q.default).typeOf(t))return this;this.defaults=t}return"function"===(0,$1V76q.default).typeOf(this.defaults)?this.data=this.defaults():this.data=(0,$1V76q.default).clone(this.defaults),!1===e||!1===t?this:this.update(null,!0)},/**
	**	Initializes the model. Called before the model properties are set.
	**
	**	>> void init ();
	*/init:function(){},/**
	**	Initialization epilogue. Called after initialization and after model properties are set.
	**
	**	>> void ready ();
	*/ready:function(){},/**
	**	Enables or disables silent mode. When the model is in silent mode events will not be dispatched.
	**
	**	>> Model silent (value: bool);
	*/silent:function(t){return this._silent+=t?1:-1,this},/**
	**	Validates a property name and value against the constraints defined in the model (if any). Returns the
	**	final value if successful or throws an empty exception if errors occur.
	**
	**	>> T _validate (string name, T value);
	*/_validate:function(t,e){if(!this.constraints||!this.constraints[t])return e;var n=this.constraints[t],r=e;for(var i in n)if($d7fcaaa29d0ffaa7$var$_Model.Constraints[i])try{r=$d7fcaaa29d0ffaa7$var$_Model.Constraints[i](this,n[i],t,r)}catch(e){if("null"==e.message)break;throw Error(`Constraint [${i}:${n[i]}] failed on property '${t}'.`)}return r},/**
	**	Sets the value of a property and returns the value set. This method is internally used to set properties
	**	one at a time. If constraints are present in the model for the specified property all constraints will be
	**	verified. When constraint errors occur the constraintError event will be raised and the property value
	**	will not be changed.
	**
	**	>> T _set (string name, T value);
	*/_set:function(t,e){if(!this.constraints||!this.constraints[t])return this.data[t]=e,e;var n=this.constraints[t];this.data[t];var r=e;for(var i in n)if($d7fcaaa29d0ffaa7$var$_Model.Constraints[i])try{r=$d7fcaaa29d0ffaa7$var$_Model.Constraints[i](this,n[i],t,r)}catch(n){if("null"==n.message)break;this._silent||this.dispatchEvent("constraintError",{constraint:i,message:n.message,name:t,value:e});break}return this.data[t]=r},/**
	**	Triggers property events to indicate a property is changing. First triggers "propertyChanging" and then
	**	"propertyChanged". If the first event returns false the second event will not be triggered.
	**
	**	>> void _propertyEvent (string name, T prev, T value, bool direct=false);
	*/_propertyEvent:function(t,e,n,r){var i={name:t,old:e,value:n,level:this._level},s=this.dispatchEvent("propertyChanging",i);r?this.data[t]=i.value:i.value=this._set(t,i.value),null!=s&&s.ret.length&&!1===s.ret[0]||(this.dispatchEvent("propertyChanged."+t,i),this.dispatchEvent("propertyChanged",i),this.changedList.push(t))},/**
	**	Sets one or more properties of the model. Possible arguments can be two strings or a map.
	**
	**	>> Model set (string name, T value, bool force=true);
	**	>> Model set (string name, T value, bool silent=false);
	**	>> Model set (string name, T value);
	**	>> Model set (object data);
	*/set:function(){var t=arguments.length,e=!1,n=!1;if((t>2||2==t&&"object"==(0,$1V76q.default).typeOf(arguments[0]))&&"boolean"==(0,$1V76q.default).typeOf(arguments[t-1])&&(e=arguments[--t],!1===e&&(n=!0)),0==this._level&&(this.changedList=[]),this._level++,2==t)(this.data[arguments[0]]!==arguments[1]||e)&&(this._silent||n?this._set(arguments[0],arguments[1]):this._propertyEvent(arguments[0],this.data[arguments[0]],this._validate(arguments[0],arguments[1])));else for(var r in arguments[0])(this.data[r]!==arguments[0][r]||e)&&(this._silent||n?this._set(r,arguments[0][r]):this._propertyEvent(r,this.data[r],this._validate(r,arguments[0][r])));return--this._level||!this.changedList.length||n||this._silent||this.dispatchEvent("modelChanged",{fields:this.changedList}),this},/**
	**	Returns true if the given key exists in the model.
	**
	**	>> boolean has (string name);
	*/has:function(t){return t in this.data},/**
	**	Returns the value of a property. If no name is specified the whole map of properties will be returned.
	**	If a boolean value of "true" is provided the properties map will be returned but first will be compacted
	**	using the default data to ensure only valid properties are present.
	**
	**	>> T get (string name);
	**	>> object get ();
	**	>> object get (true);
	**	>> object get (false);
	**	
	*/get:function(t,e){return 0==arguments.length||!1===t?this.data:1==arguments.length&&!0===t?this.flatten():2==arguments.length&&void 0===this.data[t]?e:this.data[t]},/**
	**	Returns the value of a property as an integer number.
	**
	**	>> int getInt (string name, [int def]);
	*/getInt:function(t,e){return 2==arguments.length&&void 0===this.data[t]?e:parseInt(this.data[t])},/**
	**	Returns the value of a property as a floating point number.
	**
	**	>> float getFloat (string name, [float def]);
	*/getFloat:function(t,e){return 2==arguments.length&&void 0===this.data[t]?e:parseFloat(this.data[t])},/**
	**	Returns the value of a property as a boolean value (true or false).
	**
	**	>> bool getBool (string name, [bool def]);
	**	
	*/getBool:function(t,e){return t=2==arguments.length&&void 0===this.data[t]?e:this.data[t],"true"===t||!0===t||"false"!==t&&!1!==t&&!!parseInt(t)},/**
	**	Returns a reference object for a model property. The resulting object contains two methods
	**	named "get" and "set" to modify the value of the property.
	**
	**	>> object getReference (string name);
	*/getReference:function(t){var e=this;return{get:function(){return e.get(t)},set:function(n){e.set(t,n)}}},/**
	**	Sets or returns a constraint given the property name. 
	**
	**	>> Model constraint (string field, string constraint, T value);
	**	>> Model constraint (string field, object constraint);
	**	>> Model constraint (object constraints);
	**	>> object constraint (string field);
	*/constraint:function(t,e,n){if(3==arguments.length||2==arguments.length||1==arguments.length&&"object"==(0,$1V76q.default).typeOf(t)){switch(this.constraints===this.constructor.prototype.constraints&&(this.constraints=(0,$1V76q.default).clone(this.constraints)),arguments.length){case 1:(0,$1V76q.default).override(this.constraints,t);break;case 2:(0,$1V76q.default).override(this.constraints[t],e);break;case 3:this.constraints[t][e]=n}return this}return t?this.constraints[t]:this},/**
	**	Returns a compact version of the model properties. That is, a map only with validated properties that are
	**	also present in the default data map. Returns null if the object is not compliant. If the "safe" parameter
	**	is set one last property named "class" will be attached, this specifies the original classPath of the object.
	**
	**	>> object flatten ([bool safe=false]);
	*/flatten:function(t,e){if(t){var n=this.flatten(!1,!0);return null==n?null:(n.class=this.classPath,n)}if(!this.constraints&&!this.defaults)return this.data;if(!this.isCompliant())return{};var r=this.constraints,i=this.defaults?"function"==(0,$1V76q.default).typeOf(this.defaults)?this.defaults():this.defaults:this.constraints,n={};for(var s in this.data)if(s in i){if(r&&r[s]){var a=r[s];if(a.model){n[s]=this.data[s]?this.data[s].flatten(e):null;continue}if(a.arrayof){n[s]=[];for(var l=0;l<this.data[s].length;l++)n[s][l]=this.data[s][l]?this.data[s][l].flatten(e):null;continue}if(a.cls){n[s]=this.data[s]?this.data[s].flatten():null;continue}}n[s]=this.data[s]}return n},/**
	**	Removes a property or a list of properties.
	**
	**	>> void remove (string name, [bool nsilent=true]);
	**	>> void remove (array name, [bool nsilent=true]);
	*/remove:function(t,e){if("array"==(0,$1V76q.default).typeOf(t)){for(var n=0;n<t.length;n++)delete this.data[t[n]];!1===e||this._silent||this.dispatchEvent("propertyRemoved",{fields:t})}else delete this.data[t],!1===e||this._silent||this.dispatchEvent("propertyRemoved",{fields:[t]})},/**
	**	Triggers data change events for one or more properties. Ensure that silent mode is not enabled or else
	**	this method will have no effect. If no parameters are provided a full update will be triggered on all of
	**	the model properties.
	**
	**	>> Model update (array fields);
	**	>> Model update (string name);
	**	>> Model update (bool forceModelChanged);
	**	>> Model update ();
	*/update:function(t,e){if(this._silent)return this;if(0==this._level&&(this.changedList=[]),this._level++,t&&"string"==(0,$1V76q.default).typeOf(t))this._propertyEvent(t,this.data[t],this.data[t],e);else if(t&&"array"==(0,$1V76q.default).typeOf(t))for(var n of t)this._propertyEvent(n,this.data[n],this.data[n],e);else for(var n in this.data)this._propertyEvent(n,this.data[n],this.data[n],e);return--this._level||this._silent||0==this.changedList.length&&!0!==t||this.dispatchEvent("modelChanged",{fields:this.changedList}),this},/**
	**	Validates one or mode model properties using the defined constraints. If no parameters are provided all of
	**	the properties in the model will be validated.
	**
	**	>> Model validate (array fields);
	**	>> Model validate (string name);
	**	>> Model validate ();
	*/validate:function(t){if(!this.constraints)return this;if(t&&"string"==(0,$1V76q.default).typeOf(t))this._set(t,this.data[t]);else for(var e in this.data)t&&-1==(0,$1V76q.default).indexOf(t,e)||this._set(e,this.data[e]);return this},/**
	**	Validates all the properties in the model and returns a boolean indicating if all of them comply with the
	**	constraints defined in the model.
	**
	**	>> bool isCompliant ();
	*/isCompliant:function(){if(!this.constraints)return!0;try{for(var t in this.data)this._validate(t,this.data[t]);return!0}catch(t){}return!1},/**
	**	Registers an event handler for changes in a specific property of the model.
	**
	**	>> void observe (string property, function handler, object context);
	*/observe:function(t,e,n){this.addEventListener("propertyChanged."+t,e,n)},/**
	**	Unregisters an event handler from changes in a specific property of the model.
	**
	**	>> void unobserve (string property, function handler, object context);
	*/unobserve:function(t,e,n){this.removeEventListener("propertyChanged."+t,e,n)},/**
	**	Adds a propertyChanged event handler for the given property. The property name can have an event namespace prepended and separated by colon.
	**
	**	>> void watch (string property, function handler);
	*/watch:function(t,e){1==(t=t.split(":")).length&&(t[1]=t[0],t[0]="watch"),this.addEventListener(t[0]+":propertyChanged."+t[1],function(t,n){e(n.value,n,t)})},/**
	**	Removes propertyChanged handlers related to the specified property. The property name can have an event namespace prepended and separated by colon.
	**
	**	>> void unwatch (string property);
	*/unwatch:function(t){1==(t=t.split(":")).length&&(t[1]=t[0],t[0]="watch"),this.removeEventListener(t[0]+":propertyChanged."+t[1])},/**
	 * Triggers a field change event. Even if the value of the field is the same as the model's, the event will still be triggered.
	 */trigger:function(t,e=null){return this.set(t,e,!0)},/**
	**	Serializes the model into a string.
	**
	**	string toString ();
	*/toString:function(){return(0,$1V76q.default).serialize(this.get(!0))}});$d7fcaaa29d0ffaa7$var$_Model.Constraints=$leTsS.default;var $d7fcaaa29d0ffaa7$export$2e2bcd8739ae039=$d7fcaaa29d0ffaa7$var$_Model,$1V76q=parcelRequire("1V76q"),/**
**	Generic list for models.
*/$7a8546796ed70f75$export$2e2bcd8739ae039=$d7fcaaa29d0ffaa7$export$2e2bcd8739ae039.extend({/**
	**	Name of the class.
	*/className:"ModelList",/**
	**	Class of the items in the list, can be overriden by child classes to impose a more strict constraint.
	*/itemt:$d7fcaaa29d0ffaa7$export$2e2bcd8739ae039,/**
	**	Mirror of data.contents
	*/contents:null,/**
	**	IDs of every item in the contents.
	*/itemId:null,/**
	**	Autoincremental ID for the next item to be added.
	*/nextId:null,/**
	**	Default properties of the model.
	*/defaults:{contents:null},/**
	**	Constraints of the model to ensure integrity.
	*/constraints:{contents:{type:"array",arrayof:"@itemt"}},/**
	**	Constructor.
	*/__ctor:function(...t){this.itemId=[],this.nextId=0,this._super.Model.__ctor(...t)},/**
	**	Initialization epilogue. Called after initialization and after model properties are set.
	*/ready:function(){this._eventGroup="ModelList_"+Date.now()+":modelChanged",this.contents=this.data.contents},/**
	**	Connects the event handlers to the item.
	**
	**	>> Model _bind (int iid, Model item);
	*/_bind:function(t,e){return e&&e.addEventListener&&e.addEventListener(this._eventGroup,this._onItemEvent,this,t),e},/**
	**	Disconnects the event handlers from the item.
	**
	**	>> Model _unbind (Model item);
	*/_unbind:function(t){return t&&t.removeEventListener&&t.removeEventListener(this._eventGroup),t},/**
	**	Handler for item events.
	**
	**	>> Model _onItemEvent (Event evt, object args, int iid);
	*/_onItemEvent:function(t,e,n){this.prepareEvent("itemChanged",{id:n,item:t.source}).from(t).enqueue(this.prepareEvent("modelChanged",{fields:["contents"]})).resume()},/**
	**	Returns the number of items in the list.
	**
	**	>> int length ();
	*/length:function(){return this.data.contents.length},/**
	**	Clears the contents of the list.
	**
	**	>> void clear ();
	*/clear:function(){for(var t=0;t<this.data.contents;t++)this._unbind(this.data.contents[t]);return this.itemId=[],this.nextId=0,this.contents=this.data.contents=[],this.prepareEvent("itemsCleared").enqueue(this.prepareEvent("modelChanged",{fields:["contents"]})).resume(),this},/**
	**	Sets the contents of the list with the specified array. All items will be ensured to be of the same model
	**	type as the one specified in the list.
	**
	**	>> ModelList setData (array data);
	*/setData:function(t){if(this.clear(),!t)return this;for(var e=0;e<t.length;e++){var n=(0,$1V76q.default).ensureTypeOf(this.itemt,t[e]);this.itemId.push(this.nextId++),this.data.contents.push(n),this._bind(this.nextId-1,n)}return this.prepareEvent("itemsChanged").enqueue(this.prepareEvent("modelChanged",{fields:["contents"]})).resume(),this},/**
	**	Returns the raw array contents of the list.
	**
	**	>> array getData ();
	*/getData:function(){return this.data.contents},/**
	**	Returns the item at the specified index or null if the index is out of bounds.
	**
	**	>> Model getAt (int index);
	*/getAt:function(t){return t<0||t>=this.data.contents.length?null:this.data.contents[t]},/**
	**	Removes and returns the item at the specified index. Returns null if the index is out of bounds.
	**
	**	>> Model removeAt (int index);
	*/removeAt:function(t){if(t<0||t>=this.data.contents.length)return null;let e=this.data.contents.splice(t,1)[0],n=this.itemId.splice(t,1)[0];return this._unbind(e),this.prepareEvent("itemRemoved",{id:n,item:e}).enqueue(this.prepareEvent("modelChanged",{fields:["contents"]})).resume(),e},/**
	**	Sets the item at the specified index. Returns false if the index is out of bounds, true otherwise. The
	**	item will be ensured to be of the model defined in the list.
	**
	**	>> bool setAt (int index, Model item);
	*/setAt:function(t,e){return!(t<0)&&!(t>=this.data.contents.length)&&(e=(0,$1V76q.default).ensureTypeOf(this.itemt,e),this._unbind(this.data.contents[t]),this.data.contents[t]=e,this._bind(this.itemId[t],e),this.prepareEvent("itemChanged",{id:this.itemId[t],item:e}).enqueue(this.prepareEvent("modelChanged",{fields:["contents"]})).resume(),!0)},/**
	**	Notifies a change in the item at the specified index. Returns false if the index is out of bounds.
	**
	**	>> bool updateAt (int index);
	*/updateAt:function(t){return!(t<0)&&!(t>=this.data.contents.length)&&(this.prepareEvent("itemChanged",{id:this.itemId[t],item:this.data.contents[t]}).enqueue(this.prepareEvent("modelChanged",{fields:["contents"]})).resume(),!0)},/**
	**	Adds an item to the bottom of the list. Returns null if the item is not an object or a model. The item
	**	will be ensured to be of the model specified in the list.
	**
	**	>> Model push (Model item);
	*/push:function(t){return t&&"object"!=(0,$1V76q.default).typeOf(t)?null:(t=(0,$1V76q.default).ensureTypeOf(this.itemt,t),this.itemId.push(this.nextId++),this.data.contents.push(t),this._bind(this.nextId-1,t),this.prepareEvent("itemAdded",{id:this.itemId[this.itemId.length-1],item:t,position:"tail"}).enqueue(this.prepareEvent("modelChanged",{fields:["contents"]})).resume(),t)},/**
	**	Removes and returns an item from the bottom of the list.
	**
	**	>> Model pop ();
	*/pop:function(){return this._unbind(this.data.contents.pop())},/**
	**	Adds an item to the top of the list. Returns null if the item is not an object or a model. The item
	**	will be ensured to be of the model specified in the list.
	**
	**	>> Model unshift (Model item);
	*/unshift:function(t){return t&&"object"!=(0,$1V76q.default).typeOf(t)?null:(t=(0,$1V76q.default).ensureTypeOf(this.itemt,t),this.itemId.unshift(this.nextId++),this.data.contents.unshift(t),this._bind(this.nextId-1,t),this.prepareEvent("itemAdded",{id:this.itemId[0],item:t,position:"head"}).enqueue(this.prepareEvent("modelChanged",{fields:["contents"]})).resume(),t)},/**
	**	Removes and returns an item from the top of the list.
	**
	**	>> Model shift ();
	*/shift:function(){return this._unbind(this.data.contents.shift())},/**
	**	Searches for an item matching the specified partial definition and returns its index. Returns -1 if the
	**	item was not found. If retObject is set to true the object will be returned instead of its index and null
	**	will be returned when the item is not found.
	**
	**	int|object find (object data, bool retObject=false);
	*/find:function(t,e=!1){for(var n=this.data.contents,r=0;r<n.length;r++)if((0,$1V76q.default).partialCompare(n[r].data,t))return e?n[r]:r;return e?null:-1}}),$1V76q=parcelRequire("1V76q");/**
 * The utility functions in this module allow to create a very strict serialization/deserialization schema
 * to ensure that all values are of the specific type when stored in string format.
 */let $b774d0942594d100$var$Schema={Type:function(t){let e={flatten:function(t,e){return t},unflatten:function(t,e){return t}};return t?(0,$1V76q.default).override(e,t):e},String:function(){return $b774d0942594d100$var$Schema.Type({flatten:function(t,e){return null!=t?t.toString():null},unflatten:function(t,e){return null!=t?t.toString():null}})},Integer:function(){return $b774d0942594d100$var$Schema.Type({flatten:function(t,e){return~~t},unflatten:function(t,e){return~~t}})},Number:function(t){return $b774d0942594d100$var$Schema.Type({_precision:t,_round:!1,precision:function(t){return this._precision=~~t,this},flatten:function(t,e){return t=parseFloat(t),this._precision>0&&(t=~~(t*Math.pow(10,this._precision))/Math.pow(10,this._precision)),t},unflatten:function(t,e){return parseFloat(t)}})},Bool:function(t){return $b774d0942594d100$var$Schema.Type({_compact:t,compact:function(t){return this._compact=t,this},flatten:function(t,e){return t=~~t,this._compact?t>0?1:0:t>0},unflatten:function(t,e){return!!~~t}})},SharedString:function(){return $b774d0942594d100$var$Schema.Type({flatten:function(t,e){return null==t?0:(t=t.toString(),"strings"in e||(e.index={},e.strings=[]),t in e.index||(e.strings.push(t),e.index[t]=e.strings.length),e.index[t])},unflatten:function(t,e){return null==t||0==t?null:e.strings[~~t-1]}})},Array:function(t){return $b774d0942594d100$var$Schema.Type({itemType:t,_debug:!1,_filter:null,debug:function(t){return this._debug=t,this},of:function(t){return this.itemType=t,this},filter:function(t){return this._filter=t,this},flatten:function(t,e){if(null==t)return null;let n=[];for(let r=0;r<t.length;r++)(!this._filter||this._filter(t[r],r))&&n.push(this.itemType.flatten(t[r],e));return n},unflatten:async function(t,e){if(null==t)return null;let n=[];for(let r=0;r<t.length;r++)n.push(await this.itemType.unflatten(t[r],e));return n}})},Object:function(){return $b774d0942594d100$var$Schema.Type({properties:[],property:function(t,e,n=null){return this.properties.push({name:t,source:t,type:e,defvalue:n}),this},propertyAlias:function(t,e,n,r=null){return this.properties.push({name:t,source:e,type:n,defvalue:r}),this},flatten:function(t,e){let n;if(null==t)return null;if(!0===e.symbolic){n={};for(let r=0;r<this.properties.length;r++)this.properties[r].source in t?n[this.properties[r].name]=this.properties[r].type.flatten(t[this.properties[r].source],e):n[this.properties[r].name]=this.properties[r].type.flatten(this.properties[r].defvalue,e)}else{n=[];for(let r=0;r<this.properties.length;r++)this.properties[r].source in t?n.push(this.properties[r].type.flatten(t[this.properties[r].source],e)):n.push(this.properties[r].type.flatten(this.properties[r].defvalue,e))}return n},unflatten:async function(t,e){if(null==t)return null;let n={};if(!0===e.symbolic)for(let r=0;r<this.properties.length;r++)n[this.properties[r].name]=await this.properties[r].type.unflatten(this.properties[r].name in t?t[this.properties[r].name]:this.properties[r].defvalue,e);else for(let r=0;r<this.properties.length;r++)n[this.properties[r].name]=await this.properties[r].type.unflatten(r in t?t[r]:this.properties[r].defvalue,e);return n}})},Class:function(t){return $b774d0942594d100$var$Schema.Type({_constructor:t,constructor:function(t){return this._constructor=t,this},flatten:function(t,e){return null==t?null:t.flatten(e)},unflatten:async function(t,e){return null==t?null:await new this._constructor().unflatten(t,e)}})},/*
	**	Used when you want to specify just a single property.
	*/Property:function(t,e){return $b774d0942594d100$var$Schema.Type({property:t,type:e,name:function(t){return this.property=t,this},is:function(t){return this.type=t,this},flatten:function(t,e){let n;return null==t?null:(!0===e.symbolic?(n={})[this.property]=this.type.flatten(t[this.property],e):n=this.type.flatten(t[this.property],e),n)},unflatten:async function(t,e){if(null==t)return null;let n={};return!0===e.symbolic?n[this.property]=await this.type.unflatten(t[this.property],e):n[this.property]=await this.type.unflatten(t,e),n}})},Map:function(){return $b774d0942594d100$var$Schema.Type({flatten:function(t,e){if(null==t)return null;if(!0===e.symbolic)return t;let n=[];for(let e in t)n.push(e),n.push(t[e]);return n},unflatten:function(t,e){if(null==t)return null;if(!0===e.symbolic)return t;let n={};for(let e=0;e<t.length;e+=2)n[t[e]]=t[e+1];return n}})},Selector:function(){return $b774d0942594d100$var$Schema.Type({conditions:[],value:null,when:function(t,e){return this.conditions.push([e=>e===t,e]),this},with:function(t){return this.value=t,this},flatten:function(t,e){if(null==t)return null;for(let n of this.conditions)if(!0===n[0](this.value))return n[1].flatten(t,e);return null},unflatten:async function(t,e){if(null==t)return null;for(let n of this.conditions)if(!0===n[0](this.value))return await n[1].unflatten(t,e);return null}})}};var $b774d0942594d100$export$2e2bcd8739ae039=$b774d0942594d100$var$Schema,/**
**	Class used to add flattening and unflattening capabilities to any object. A "flat" object is an object composed
**	only of native types, that is: `null,` `boolean`, `integer`, `number`, `array` or `object`.
*/$d46d380bfeb80f47$export$2e2bcd8739ae039=$948f072c447a9569$export$2e2bcd8739ae039.extend({/**
	**	Name of the class.
	*/className:"Flattenable",/**
	**	Type schema used to flatten/unflatten the contents of this class. See Schema class for more information.
	*/typeSchema:null,/**
	**	Returns the flattened contents of the object.
	*/flatten:function(t){return this.typeSchema.flatten(this,t)},/**
	**	Unflattens the given object and overrides the local contents.
	*/unflatten:async function(t,e){return Object.assign(this,await this.typeSchema.unflatten(t,e)),await this.onUnflattened(),this},/*
	**	Executed when the unflatten() method is called on the object.
	*/onUnflattened:async function(){}}),$1V76q=parcelRequire("1V76q"),/**
**	Flattenable collection class, used to store items and manipulate them. The items should also be flattenable.
*/$16da3fe9744df3bc$export$2e2bcd8739ae039=$d46d380bfeb80f47$export$2e2bcd8739ae039.extend({/**
	**	Name of the class.
	*/className:"Collection",/**
	**	Describes the type schema of the underlying items.
	*/itemTypeSchema:null,/**
	**	Array of items.
	*/items:null,/* Array *//**
	**	Constructs the collection.
	*/__ctor:function(t){t||(t=this.itemTypeSchema),t&&(this.typeSchema=$b774d0942594d100$export$2e2bcd8739ae039.Property("items").is($b774d0942594d100$export$2e2bcd8739ae039.Array().of(t))),this.reset()},/*
	**	Executed after the collection has been unflattened, re-adds the items to ensure onItemAdded() is called.
	*/onUnflattened:function(){let t=this.items;for(let e of(this.reset(),t))this.add(e)},/**
	 * 	Executed when the value in `items` is changed.
	 */itemsReferenceChanged:function(){},/*
	**	Resets the collection to empty. Note that onItemRemoved will not be called.
	*/reset:function(){return this.items=[],this.itemsReferenceChanged(),this},/*
	**	Clears the contents of the collection (removes each item manually, onItemRemoved will be called).
	*/clear:function(){var t=this.items;this.reset();for(var e=0;e<t.length;e++)this.onItemRemoved(t[e],0);return this},/*
	**	Sorts the collection. A comparison function should be provided, or the name of a property to sort by.
	**
	**	Object sort (fn: Function)
	**	Object sort (prop: string, [desc:bool=false])
	*/sort:function(t,e){return"function"!=typeof t?this.items.sort(function(n,r){return(n[t]<=r[t]?-1:1)*(!0===e?-1:1)}):this.items.sort(t),this},/*
	**	Searches for an item with the specified fields and returns it. The "inc" object is the "inclusive" map, meaning all fields must match
	**	and the optional "exc" is the exclusive map, meaning not even one field should match.
	**
	**	Object findItem (inc: Object, exc: Object);
	*/findItem:function(t,e){if(!this.items)return null;for(var n=0;n<this.items.length;n++)if(!(e&&(0,$1V76q.default).partialCompare(this.items[n],e))&&(0,$1V76q.default).partialCompare(this.items[n],t))return this.items[n];return null},/*
	**	Returns the container array.
	*/getItems:function(){return this.items},/*
	**	Returns the number of items in the collection.
	*/length:function(){return this.items.length},/*
	**	Returns true if the collection is empty.
	*/isEmpty:function(){return!this.items.length},/*
	**	Returns the index of the specified item, or -1 if not found.
	*/indexOf:function(t){return this.items.indexOf(t)},/*
	**	Returns the item at the specified index, or null if not found. When `relative` is true, negative offsets are allowed such that -1 refers to the last item.
	*/getAt:function(t,e=!1){return t<0&&!0==e&&(t+=this.items.length),t>=0&&t<this.items.length?this.items[t]:null},/*
	**	Returns the first item in the collection.
	*/first:function(){return this.getAt(0)},/*
	**	Returns the last item in the collection.
	*/last:function(){return this.getAt(-1,!0)},/*
	**	Adds an item at the specified index, effectively moving the remaining items to the right.
	*/addAt:function(t,e){if(!e||!this.onBeforeItemAdded(e))return this;if(t<0&&(t=0),t>this.items.length&&(t=this.items.length),0==t)this.items.unshift(e);else if(t==this.items.length)this.items.push(e);else{var n=this.items.splice(0,t);n.push(e),this.items=n.concat(this.items),this.itemsReferenceChanged()}return this.onItemAdded(e),this},/*
	**	Adds an item to the start of the collection, onBeforeItemAdded and onItemAdded will be triggered.
	*/unshift:function(t){return this.addAt(0,t)},/*
	**	Adds an item to the end of the collection, onBeforeItemAdded and onItemAdded will be triggered.
	*/push:function(t){return this.addAt(this.items.length,t)},/*
	**	Adds an item to the end of the collection, onBeforeItemAdded and onItemAdded will be triggered.
	*/add:function(t){return this.push(t)},/*
	**	Removes the item at the specified index. When `relative` is true, negative offsets are allowed such that -1 refers to the last item.
	*/removeAt:function(t,e=!1){if(t<0&&!0==e&&(t+=this.items.length),t<0||t>=this.items.length)return null;var n=this.items[t];return this.items.splice(t,1),this.onItemRemoved(n,t),n},/*
	**	Removes an item from the end of the collection.
	*/pop:function(t){return this.removeAt(-1,!0)},/*
	**	Removes an item from the start of the collection.
	*/shift:function(t){return this.removeAt(0)},/*
	**	Removes the specified item from the collection.
	*/remove:function(t){return this.removeAt(this.indexOf(t))},/*
	**	Runs the specified callback for each of the items in the collection, if false is returned by the callback this function
	**	will exit immediately. Parameters to the callback are: (item, index, collection).
	*/forEach:function(t){if(this.isEmpty())return this;for(var e=0;e<this.items.length&&!1!==t(this.items[e],e,this);e++);return this},/*
	**	Executes a method call with the specified parameters on each of the items in the collection, if false is returned by the
	**	item's method this function will exit immediately.
	*/forEachCall:function(t,...e){if(this.isEmpty())return this;for(var n=0;n<this.items.length&&!1!==this.items[n][t](...e);n++);return this},/*
	**	Exactly the same as forEach but in reverse order.
	*/forEachRev:function(t){if(this.isEmpty())return this;for(var e=this.items.length-1;e>=0&&!1!==t(this.items[e],e,this);e--);return this},/*
	**	Exactly the same as forEachCall but in reverse order.
	*/forEachRevCall:function(t,...e){if(this.isEmpty())return this;for(var n=this.items.length-1;n>=0&&!1!==this.items[n][t](...e);n--);return this},/*
	**	Handler for the beforeItemAdded event. If returns false the item will not be added.
	*/onBeforeItemAdded:function(t){return!0},/*
	**	Handler for the itemAdded event.
	*/onItemAdded:function(t){},/*
	**	Handler for the itemRemoved event.
	*/onItemRemoved:function(t){}}),$1V76q=parcelRequire("1V76q");/**
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
*/let $5965a8a303d1bb14$var$Template={/*
	**	Strict mode flag. When set, any undefined expression function will trigger an exception.
	*/strict:!1,/**
	**	Parses a template and returns the compiled 'parts' structure to be used by the 'expand' method.
	**
	**	>> array parseTemplate (string template, char sym_open, char sym_close, bool is_tpl=false);
	*/parseTemplate:function(t,e,n,r=!1,i=1){let s="string",a=null,l=0,u=0,o="",f=[],h=f,c=!1;function p(t){if("object"==typeof t){if(t instanceof Array)for(let e=0;e<t.length;e++)p(t[e]);else t.data=p(t.data);return t}for(let e=0;e<t.length;e++)if("\\"==t[e]){let n=t[e+1];switch(n){case"n":n="\n";break;case"r":n="\r";break;case"f":n="\f";break;case"v":n="\v";break;case"t":n="	";break;case"s":n="s";break;case'"':n='"';break;case"'":n="'"}t=t.substr(0,e)+n+t.substr(e+2)}return t}function d(t,r){if("template"==t?r=$5965a8a303d1bb14$var$Template.parseTemplate(r,e,n,!0,0):"parse"==t?(r=$5965a8a303d1bb14$var$Template.parseTemplate(r,e,n,!1,0),t="base-string","array"==(0,$1V76q.default).typeOf(r)&&(t=r[0].type,r=r[0].data)):"parse-trim-merge"==t?r=$5965a8a303d1bb14$var$Template.parseTemplate(r.trim().split("\n").map(t=>t.trim()).join("\n"),e,n,!1,0):"parse-merge"==t?r=$5965a8a303d1bb14$var$Template.parseTemplate(r,e,n,!1,0):"parse-merge-alt"==t&&(r=$5965a8a303d1bb14$var$Template.parseTemplate(r,"{","}",!1,0)),"parse-merge"==t||"parse-merge-alt"==t||"parse-trim-merge"==t)for(let t=0;t<r.length;t++)f.push(r[t]);else f.push({type:t,data:r});c&&(h.push(f=[]),c=!1)}!0===r&&(t=t.trim(),s="identifier",l=10,h.push(f=[])),t+="\x00";for(let r=0;r<t.length;r++){if("\\"==t[r]){o+="\\"+t[++r];continue}switch(l){case 0:"\x00"==t[r]?a="string":t[r]==e&&"<"==t[r+1]?(l=1,u=1,a="string",s="parse-merge"):t[r]==e&&"@"==t[r+1]?(l=1,u=1,a="string",s="parse-trim-merge",r++):t[r]==e&&":"==t[r+1]?(l=12,u=1,a="string",s="string",r++):t[r]==e?(l=1,u=1,a="string",s="template"):o+=t[r];break;case 1:if("\x00"==t[r])throw Error("Parse error: Unexpected end of template");if(t[r]==n){if(--u<0)throw Error("Parse error: Unmatched "+n);if(0==u){l=0,a=s;break}}else t[r]==e&&u++;o+=t[r];break;case 10:if("\x00"==t[r]){a=s;break}if("."==t[r]){d(s,o),d("access","."),s="identifier",o="";break}if(null!=t[r].match(/[\t\n\r\f\v ]/)){for(a=s,s="identifier",c=!0;null!=t[r].match(/[\t\n\r\f\v ]/);)r++;r--;break}if(t[r]==e&&"<"==t[r+1]){o&&(a=s),l=11,u=1,s="parse-merge";break}else if(t[r]==e&&"@"==t[r+1]){o&&(a=s),l=11,u=1,s="parse-trim-merge",r++;break}else if('"'==t[r]){o&&(a=s),l=14,u=1,s="parse-merge";break}else if("'"==t[r]){o&&(a=s),l=15,u=1,s="parse-merge";break}else if("`"==t[r]){o&&(a=s),l=16,u=1,s="parse-merge-alt";break}else if(t[r]==e&&":"==t[r+1]){o&&(a=s),l=13,u=1,s="string",r++;break}else if(t[r]==e){o&&d(s,o),l=11,u=1,s="parse",o=""+t[r];break}"identifier"!=s&&(d(s,o),o="",s="identifier"),o+=t[r];break;case 11:if("\x00"==t[r])throw Error("Parse error: Unexpected end of template");if(t[r]==n){if(--u<0)throw Error("Parse error: Unmatched "+n);if(0==u&&(l=10,"parse-merge"==s||"parse-merge-alt"==s||"parse-trim-merge"==s))break}else t[r]==e&&u++;o+=t[r];break;case 12:if("\x00"==t[r])throw Error("Parse error: Unexpected end of template");if(t[r]==n){if(--u<0)throw Error("Parse error: Unmatched "+n);if(0==u){0==o.length||"<"==o[0]||"["==o[0]||" "==o[0]||(o=e+o+n),l=0,a=s;break}}else t[r]==e&&u++;o+=t[r];break;case 13:if("\x00"==t[r])throw Error("Parse error: Unexpected end of template");if(t[r]==n){if(--u<0)throw Error("Parse error: Unmatched "+n);if(0==u){"<"==o[0]||"["==o[0]||" "==o[0]||(o=e+o+n),l=10;break}}else t[r]==e&&u++;o+=t[r];break;case 14:if("\x00"==t[r])throw Error("Parse error: Unexpected end of template");if('"'==t[r]){if(--u<0)throw Error('Parse error: Unmatched "');if(0==u&&(l=10,"parse-merge"==s||"parse-merge-alt"==s||"parse-trim-merge"==s))break}o+=t[r];break;case 15:if("\x00"==t[r])throw Error("Parse error: Unexpected end of template");if("'"==t[r]){if(--u<0)throw Error("Parse error: Unmatched '");if(0==u&&(l=10,"parse-merge"==s||"parse-merge-alt"==s||"parse-trim-merge"==s))break}o+=t[r];break;case 16:if("\x00"==t[r])throw Error("Parse error: Unexpected end of template");if("`"==t[r]){if(--u<0)throw Error("Parse error: Unmatched `");if(0==u&&(l=10,"parse-merge"==s||"parse-merge-alt"==s||"parse-trim-merge"==s))break}o+=t[r]}a&&(d(a,o),a=o="")}if(!r){let t=0;for(;t<h.length;)if("string"==h[t].type&&""==h[t].data)h.splice(t,1);else break;for(t=h.length-1;t>0;)if("string"==h[t].type&&""==h[t].data)h.splice(t--,1);else break;0==h.length&&h.push({type:"string",data:""})}return i&&p(h),h},/**
	**	Parses a template and returns the compiled 'parts' structure to be used by the 'expand' method. This
	**	version assumes the sym_open and sym_close chars are [ and ] respectively.
	**
	**	>> array parse (string template);
	*/parse:function(t){return this.parseTemplate(t.trim(),"[","]",!1)},/**
	**	Removes all static parts from a parsed template.
	**
	**	>> array clean (array parts);
	*/clean:function(t){for(let e=0;e<t.length;e++)"template"!=t[e].type&&(t.splice(e,1),e--);return t},/**
	**	Expands a template using the given data object, ret can be set to 'text' or 'obj' allowing to expand the template as
	**	a string (text) or an array of objects (obj) respectively. If none provided it will be expanded as text.
	**
	**	>> string/array expand (array parts, object data, string ret='text', string mode='base-string');
	*/expand:function(t,e,n="text",r="base-string"){let i=[];// Expand variable parts.
if("var"==r){let n=!0,r=!1,s=e,a=null,l=!0,u="";for(let i=0;i<t.length&&null!=e;i++)switch(t[i].type){case"identifier":case"string":u+=t[i].data,a=null;break;case"template":u+="object"!=typeof(a=this.expand(t[i].data,s,"arg","template"))?a:"";break;case"base-string":u+=this.expand(t[i].data,s,"arg","base-string"),a=null;break;case"access":if(a&&"object"==typeof a)e=a;else{for(""==u&&(u="this");;)if("!"==u[0])u=u.substr(1),n=!1;else if("$"==u[0])u=u.substr(1),r=!0;else break;if("this"!=u&&null!=e){let t=e;null===(e=u in e?e[u]:null)&&l&&u in $5965a8a303d1bb14$var$Template.functions&&(e=$5965a8a303d1bb14$var$Template.functions[u](null,null,t)),l=!1}}u=""}for(;""!=u;)if("!"==u[0])u=u.substr(1),n=!1;else if("$"==u[0])u=u.substr(1),r=!0;else break;if("this"!=u){let n=!1;if(null!=e?u in e?e=e[u]:(n=!0,e=null):n=!0,n&&1==t.length&&!0==$5965a8a303d1bb14$var$Template.strict)throw Error("Expression function `"+u+"` not found.")}"string"==typeof e&&(n&&(e=e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")),r&&(e='"'+e+'"')),i.push(e)}// Expand variable parts and returns a reference to it.
if("varref"==n){let n=e,r=null,i=!0,s="";for(let a=0;a<t.length&&null!=e;a++)switch(t[a].type){case"identifier":case"string":s+=t[a].data,r=null;break;case"template":s+="object"!=typeof(r=this.expand(t[a].data,n,"arg","template"))?r:"";break;case"base-string":s+=this.expand(t[a].data,n,"arg","base-string"),r=null;break;case"access":if(r&&"object"==typeof r)e=r;else{for(""==s&&(s="this");;)if("!"==s[0])s=s.substr(1);else if("$"==s[0])s=s.substr(1);else break;if("this"!=s&&null!=e){let t=e;null===(e=s in e?e[s]:null)&&i&&s in $5965a8a303d1bb14$var$Template.functions&&(e=$5965a8a303d1bb14$var$Template.functions[s](null,null,t)),i=!1}}s=""}for(;""!=s;)if("!"==s[0])s=s.substr(1);else if("$"==s[0])s=s.substr(1);else break;return"this"!=s?[e,s]:null}// Expand function parts.
if("fn"==r){var s=[];if(s.push($5965a8a303d1bb14$var$Template.expand(t[0],e,"text","base-string")),"_"+s[0] in $5965a8a303d1bb14$var$Template.functions&&(s[0]="_"+s[0]),!(s[0]in $5965a8a303d1bb14$var$Template.functions)){if(!0==$5965a8a303d1bb14$var$Template.strict)throw Error("Expression function `"+s[0]+"` not found.");return`(Unknown: ${s[0]})`}if("_"==s[0][0])return $5965a8a303d1bb14$var$Template.functions[s[0]](t,e);for(let n=1;n<t.length;n++)s.push($5965a8a303d1bb14$var$Template.expand(t[n],e,"arg","base-string"));i.push($5965a8a303d1bb14$var$Template.functions[s[0]](s,t,e))}// Template mode.
if("template"==r){if(1==t.length){if(1==t[0].length&&"string"==t[0][0].type)return t[0][0].data;if(1==t[0].length&&"identifier"==t[0][0].type){let r=t[0][0].data;if(r in $5965a8a303d1bb14$var$Template.functions||"_"+r in $5965a8a303d1bb14$var$Template.functions)return $5965a8a303d1bb14$var$Template.expand(t,e,n,"fn")}return $5965a8a303d1bb14$var$Template.expand(t[0],e,n,"var")}return $5965a8a303d1bb14$var$Template.expand(t,e,n,"fn")}// Expand parts.
if("base-string"==r){let r=-1;for(let s of t){let a=null;switch(r++,s.type){case"template":a=$5965a8a303d1bb14$var$Template.expand(s.data,e,n,"template");break;case"string":case"identifier":a=s.data;break;case"base-string":a=$5965a8a303d1bb14$var$Template.expand(s.data,e,n,"base-string")}"void"!=n&&("last"!=n||r==t.length-1)&&i.push(a)}}// Return types for direct objects.
if("obj"==n)return i;if("last"==n)return"Rose\\Arry"==typeOf(i)&&(i=i[0]),i;// When the output is not really needed.
if("void"==n)return null;// Return as argument ('object' if only one, or string if more than one), that is, the first item in the result.
if("arg"==n)return"array"==(0,$1V76q.default).typeOf(i)?1!=i.length?i.join(""):i[0]:i;if("text"==n&&"array"==(0,$1V76q.default).typeOf(i)){let t=e=>null!=e&&"object"==typeof e?"map"in e?e.map(t).join(""):"join"in e?e.join(""):e.toString():e;i=i.map(t).join("")}return i},/**
	**	Parses the given template and returns a function that when called with an object will expand the template.
	**
	**	>> object compile (string template);
	*/compile:function(t){return t=$5965a8a303d1bb14$var$Template.parse(t),function(e=null,n="text"){return $5965a8a303d1bb14$var$Template.expand(t,e||{},n)}},/**
	**	Parses and expands the given template immediately.
	**
	**	>> object eval (string template, object data, string mode='text');
	*/eval:function(t,e=null,n="text"){return t=$5965a8a303d1bb14$var$Template.parse(t),$5965a8a303d1bb14$var$Template.expand(t,e||{},n)},/**
	**	Expands the template as 'arg' and returns the result.
	**
	**	>> object value (string parts, object data);
	*/value:function(t,e=null){return"array"!=(0,$1V76q.default).typeOf(t)?t:$5965a8a303d1bb14$var$Template.expand(t,e||{},"arg")},/**
	**	Registers an expression function.
	**
	**	>> object register (string name, function fn);
	*/register:function(t,e){$5965a8a303d1bb14$var$Template.functions[t]=e},/**
	**	Calls an expression function.
	**
	**	>> object call (string name, object args, object data);
	*/call:function(t,e,n=null){return t in $5965a8a303d1bb14$var$Template.functions?$5965a8a303d1bb14$var$Template.functions[t](e,null,n):null},/**
	**	Returns a map given a 'parts' array having values of the form "name: value" or ":name value".
	**
	**	>> Map getNamedValues (array parts, object data, int i=1, bool expanded=true);
	*/getNamedValues:function(t,e,n=1,r=!0){let i={},s=0;for(;n<t.length;n+=2){let a=$5965a8a303d1bb14$var$Template.expand(t[n],e,"arg");s||(s=a.startsWith(":")?1:a.endsWith(":")?2:3),1==s?a=a.substr(1):2==s&&(a=a.substr(0,a.length-1)),r?i[a]=$5965a8a303d1bb14$var$Template.expand(t[n+1],e,"arg"):i[a]=t[n+1]}return i}};/**
**	Template functions, functions that are used to format data. Each function takes three parameters (args, parts and data). By default the function arguments
**	are expanded and passed via 'args' for convenience, however if the function name starts with '_' the 'args' parameter will be skipped and only (parts, data)
**	will be available, each 'part' must be expanded manually by calling Template.expand.
*/$5965a8a303d1bb14$var$Template.functions={/**
	**	Expression functions.
	*/global:function(t){return globalThis},null:function(t){return null},true:function(t){return!0},false:function(t){return!1},len:function(t){return t[1].toString().length},int:function(t){return~~t[1]},str:function(t){return t[1].toString()},float:function(t){return parseFloat(t[1])},chr:function(t){return String.fromCharCode(t[1])},ord:function(t){return t[1].toString().charCodeAt(0)},not:function(t){return!t[1]},neg:function(t){return-t[1]},abs:function(t){return Math.abs(t[1])},and:function(t){for(let e=1;e<t.length;e++)if(!t[e])return!1;return!0},or:function(t){for(let e=1;e<t.length;e++)if(~~t[e])return!0;return!1},eq:function(t){return t[1]==t[2]},ne:function(t){return t[1]!=t[2]},lt:function(t){return t[1]<t[2]},le:function(t){return t[1]<=t[2]},gt:function(t){return t[1]>t[2]},ge:function(t){return t[1]>=t[2]},isnotnull:function(t){return!!t[1]},isnull:function(t){return!t[1]},iszero:function(t){return 0==parseInt(t[1])},"eq?":function(t){return t[1]==t[2]},"ne?":function(t){return t[1]!=t[2]},"lt?":function(t){return t[1]<t[2]},"le?":function(t){return t[1]<=t[2]},"gt?":function(t){return t[1]>t[2]},"ge?":function(t){return t[1]>=t[2]},"notnull?":function(t){return!!t[1]},"null?":function(t){return!t[1]},"zero?":function(t){return 0==parseInt(t[1])},typeof:function(t){return(0,$1V76q.default).typeOf(t[1])},"*":function(t){let e=t[1];for(let n=2;n<t.length;n++)e*=t[n];return e},"/":function(t){let e=t[1];for(let n=2;n<t.length;n++)e/=t[n];return e},"+":function(t){let e=t[1];for(let n=2;n<t.length;n++)e-=-t[n];return e},"-":function(t){let e=t[1];for(let n=2;n<t.length;n++)e-=t[n];return e},mul:function(t){let e=t[1];for(let n=2;n<t.length;n++)e*=t[n];return e},div:function(t){let e=t[1];for(let n=2;n<t.length;n++)e/=t[n];return e},sum:function(t){let e=t[1];for(let n=2;n<t.length;n++)e-=-t[n];return e},sub:function(t){let e=t[1];for(let n=2;n<t.length;n++)e-=t[n];return e},mod:function(t){let e=t[1];for(let n=2;n<t.length;n++)e%=t[n];return e},pow:function(t){let e=t[1];for(let n=2;n<t.length;n++)e=Math.pow(e,t[n]);return e},/**
	**	Returns the JSON representation of the expression.
	**
	**	dump <expr>
	*/dump:function(t){return JSON.stringify(t[1])},/**
	**	Sets one or more variables in the data context.
	**
	**	set <var-name> <expr> [<var-name> <expr>]*
	*/_set:function(t,e){for(let n=1;n+1<t.length;n+=2){let r=$5965a8a303d1bb14$var$Template.value(t[n+1],e);if(t[n].length>1){let i=$5965a8a303d1bb14$var$Template.expand(t[n],e,"varref");null!=i&&(i[0][i[1]]=r)}else e[$5965a8a303d1bb14$var$Template.value(t[n],e)]=r}return""},/**
	**	Removes one or more variables from the data context.
	**
	**	unset <var-name> [<var-name>]*
	*/_unset:function(t,e){for(let n=1;n<t.length;n++)if(t[n].length>1){let r=$5965a8a303d1bb14$var$Template.expand(t[n],e,"varref");null!=r&&delete r[0][r[1]]}else delete e[$5965a8a303d1bb14$var$Template.value(t[n],e)];return null},/**
	**	Returns the expression without white-space on the left or right. The expression can be a string or an array.
	**
	**	trim <expr>
	*/trim:function(t){return t[1]?"object"==typeof t[1]?t[1].map(t=>t.trim()):t[1].trim():""},/**
	**	Returns the expression in uppercase. The expression can be a string or an array.
	**
	**	upper <expr>
	*/upper:function(t){return t[1]?"object"==typeof t[1]?t[1].map(t=>t.toUpperCase()):t[1].toUpperCase():""},/**
	**	Returns the expression in lower. The expression can be a string or an array.
	**
	**	lower <expr>
	*/lower:function(t){return t[1]?"object"==typeof t[1]?t[1].map(t=>t.toLowerCase()):t[1].toLowerCase():""},/**
	**	Returns a sub-string of the given string.
	**
	**	substr <start> <count> <string>
	**	substr <start> <string>
	*/substr:function(t){let e=t[t.length-1].toString(),n=0,r=null;return 4==t.length?(n=~~t[1],r=~~t[2]):(n=~~t[1],r=null),n<0&&(n+=e.length),r<0&&(r+=e.length),null===r&&(r=e.length-n),e.substr(n,r)},/**
	**	Replaces a matching string with the given replacement string in a given text.
	**
	**	replace <search> <replacement> <text>
	*/replace:function(t){return t[3].split(t[1]).join(t[2])},/**
	**	Converts all new-line chars in the expression to <br/>, the expression can be a string or an array.
	**
	**	nl2br <expr>
	*/nl2br:function(t){return t[1]?"object"==typeof t[1]?t[1].map(t=>t.replace(/\n/g,"<br/>")):t[1].replace(/\n/g,"<br/>"):""},/**
	**	Returns the expression inside an XML tag named 'tag-name', the expression can be a string or an array.
	**
	**	% <tag-name> <expr>
	*/"%":function(t){t.shift();var e=t.shift();let n="";for(let r=0;r<t.length;r++)if("array"==(0,$1V76q.default).typeOf(t[r])){n+=`<${e}>`;for(let e=0;e<t[r].length;e++)n+=t[r][e];n+=`</${e}>`}else n+=`<${e}>${t[r]}</${e}>`;return n},/**
	**	Returns the expression inside an XML tag named 'tag-name', attributes are supported.
	**
	**	%% <tag-name> [<attr> <value>]* [<content>]
	*/"%%":function(t){t.shift();var e=t.shift();let n="",r="";for(let e=0;e<t.length;e+=2)e+1<t.length?n+=` ${t[e]}="${t[e+1]}"`:r=t[e];return r?`<${e}${n}>${r}</${e}>`:`<${e}${n}/>`},/**
	**	Joins the given array expression into a string. The provided string-expr will be used as separator.
	**
	**	join <string-expr> <array-expr>
	*/join:function(t){return t[2]&&"array"==(0,$1V76q.default).typeOf(t[2])?t[2].join(t[1]):""},/**
	**	Splits the given expression by the specified string. Returns an array.
	**
	**	split <string-expr> <expr>
	*/split:function(t){return t[2]&&"string"==typeof t[2]?t[2].split(t[1]):[]},/**
	**	Returns an array with the keys of the given object-expr.
	**
	**	keys <object-expr>
	*/keys:function(t){return t[1]&&"object"==typeof t[1]?Object.keys(t[1]):[]},/**
	**	Returns an array with the values of the given object-expr.
	**
	**	values <object-expr>
	*/values:function(t){return t[1]&&"object"==typeof t[1]?Object.values(t[1]):[]},/**
	**	Constructs a string obtained by concatenating the expanded template for each of the items in the list-expr, the mandatory varname
	**	parameter (namely 'i') indicates the name of the variable that will contain the data of each item as the list-expr is
	**	traversed. Extra variables i# and i## (suffix '#' and '##') are introduced to denote the index/key and numeric index
	**	of the current item respectively, note that the later will always have a numeric value.
	**
	**	each <varname> <list-expr> <template>
	*/_each:function(t,e){let n=$5965a8a303d1bb14$var$Template.expand(t[1],e,"arg"),r=$5965a8a303d1bb14$var$Template.expand(t[2],e,"arg"),i="",s=0;if(!r)return i;for(let a in r)e[n]=r[a],e[n+"##"]=s++,e[n+"#"]=a,i+=$5965a8a303d1bb14$var$Template.expand(t[3],e,"text");return delete e[n],delete e[n+"##"],delete e[n+"#"],i},/**
	**	Expands the given template for each of the items in the list-expr, the mandatory varname parameter (namely 'i') indicates the name of the variable
	**	that will contain the data of each item as the list-expr is traversed. Extra variables i# and i## (suffix '#' and '##') are introduced to denote
	**	the index/key and numeric index of the current item respectively, note that the later will always have a numeric value.
	**
	**	Does not produce any output (returns null).
	**
	**	foreach <varname> <list-expr> <template>
	*/_foreach:function(t,e){let n=$5965a8a303d1bb14$var$Template.expand(t[1],e,"arg"),r=$5965a8a303d1bb14$var$Template.expand(t[2],e,"arg"),i=0;if(!r)return null;for(let s in r)e[n]=r[s],e[n+"##"]=i++,e[n+"#"]=s,$5965a8a303d1bb14$var$Template.expand(t[3],e,"text");return delete e[n],delete e[n+"##"],delete e[n+"#"],null},/**
	**	Returns the valueA if the expression is true otherwise valueB, this is a short version of the 'if' function with the
	**	difference that the result is 'obj' instead of text.
	**
	**	? <expr> <valueA> [<valueB>]
	*/"_?":function(t,e){return $5965a8a303d1bb14$var$Template.expand(t[1],e,"arg")?$5965a8a303d1bb14$var$Template.expand(t[2],e,"arg"):t.length>3?$5965a8a303d1bb14$var$Template.expand(t[3],e,"arg"):""},/**
	**	Returns the valueA if it is not null (or empty or zero), otherwise returns valueB.
	**
	**	?? <valueA> <valueB>
	*/"_??":function(t,e){return $5965a8a303d1bb14$var$Template.expand(t[1],e,"arg")||$5965a8a303d1bb14$var$Template.expand(t[2],e,"arg")},/**
	**	Returns the value if the expression is true, supports 'elif' and 'else' as well. The result of this function is always text.
	**
	**	if <expr> <value> [elif <expr> <value>] [else <value>]
	*/_if:function(t,e){for(let n=0;n<t.length;n+=3){if("else"==$5965a8a303d1bb14$var$Template.expand(t[n],e,"arg"))return $5965a8a303d1bb14$var$Template.expand(t[n+1],e,"text");if($5965a8a303d1bb14$var$Template.expand(t[n+1],e,"arg"))return $5965a8a303d1bb14$var$Template.expand(t[n+2],e,"text")}return""},/**
	**	Loads the expression value and attempts to match one case.
	**
	**	switch <expr> <case1> <value1> ... <caseN> <valueN> default <defvalue> 
	*/_switch:function(t,e){let n=$5965a8a303d1bb14$var$Template.expand(t[1],e,"arg");for(let r=2;r<t.length;r+=2){let i=$5965a8a303d1bb14$var$Template.expand(t[r],e,"arg");if(i==n||"default"==i)return $5965a8a303d1bb14$var$Template.expand(t[r+1],e,"text")}return""},/**
	**	Exits the current inner most loop.
	**
	**	break
	*/_break:function(t,e){throw Error("EXC_BREAK")},/**
	**	Skips execution and continues the next cycle of the current inner most loop.
	**
	**	continue
	*/_continue:function(t,e){throw Error("EXC_CONTINUE")},/**
	**	Constructs an array with the results of repeating the specified template for a number of times.
	**
	**	repeat <varname:i> [from <number>] [to <number>] [count <number>] [step <number>] <template>
	*/_repeat:function(t,e){if(t.length<3||(1&t.length)!=1)return"(`repeat`: Wrong number of parameters)";let n=$5965a8a303d1bb14$var$Template.value(t[1],e),r=null,i=0,s=null,a=null;for(let n=2;n<t.length-1;n+=2)switch($5965a8a303d1bb14$var$Template.value(t[n],e).toLowerCase()){case"from":i=parseFloat($5965a8a303d1bb14$var$Template.value(t[n+1],e));break;case"to":s=parseFloat($5965a8a303d1bb14$var$Template.value(t[n+1],e));break;case"count":r=parseFloat($5965a8a303d1bb14$var$Template.value(t[n+1],e));break;case"step":a=parseFloat($5965a8a303d1bb14$var$Template.value(t[n+1],e))}let l=t[t.length-1],u=[];if(null!==s){if(null===a&&(a=i>s?-1:1),a<0)for(let t=i;t>=s;t+=a)try{e[n]=t,u.push($5965a8a303d1bb14$var$Template.value(l,e))}catch(e){let t=e.message;if("EXC_BREAK"==t)break;if("EXC_CONTINUE"==t)continue;throw e}else for(let t=i;t<=s;t+=a)try{e[n]=t,u.push($5965a8a303d1bb14$var$Template.value(l,e))}catch(e){let t=e.message;if("EXC_BREAK"==t)break;if("EXC_CONTINUE"==t)continue;throw e}}else if(null!==r){null===a&&(a=1);for(let t=i;r>0;r--,t+=a)try{e[n]=t,u.push($5965a8a303d1bb14$var$Template.value(l,e))}catch(e){let t=e.message;if("EXC_BREAK"==t)break;if("EXC_CONTINUE"==t)continue;throw e}}else{null===a&&(a=1);for(let t=i;;t+=a)try{e[n]=t,u.push($5965a8a303d1bb14$var$Template.value(l,e))}catch(e){let t=e.message;if("EXC_BREAK"==t)break;if("EXC_CONTINUE"==t)continue;throw e}}return delete e[n],u},/**
	**	Repeats the specified template for a number of times.
	**
	**	for <varname:i> [from <number>] [to <number>] [count <number>] [step <number>] <template>
	*/_for:function(t,e){if(t.length<3||(1&t.length)!=1)return"(`for`: Wrong number of parameters)";let n=$5965a8a303d1bb14$var$Template.value(t[1],e),r=null,i=0;to=null;let s=null;for(let n=2;n<t.length-1;n+=2)switch((value=$5965a8a303d1bb14$var$Template.value(t[n],e)).toLowerCase()){case"from":i=parseFloat($5965a8a303d1bb14$var$Template.value(t[n+1],e));break;case"to":to=parseFloat($5965a8a303d1bb14$var$Template.value(t[n+1],e));break;case"count":r=parseFloat($5965a8a303d1bb14$var$Template.value(t[n+1],e));break;case"step":s=parseFloat($5965a8a303d1bb14$var$Template.value(t[n+1],e))}let a=t[t.length-1];if(null!==to){if(null===s&&(s=i>to?-1:1),s<0)for(let t=i;t>=to;t+=s)try{e[n]=t,$5965a8a303d1bb14$var$Template.value(a,e)}catch(e){let t=e.message;if("EXC_BREAK"==t)break;if("EXC_CONTINUE"==t)continue;throw e}else for(let t=i;t<=to;t+=s)try{e[n]=t,$5965a8a303d1bb14$var$Template.value(a,e)}catch(e){let t=e.message;if("EXC_BREAK"==t)break;if("EXC_CONTINUE"==t)continue;throw e}}else if(null!==r){null===s&&(s=1);for(let t=i;r>0;r--,t+=s)try{e[n]=t,$5965a8a303d1bb14$var$Template.value(a,e)}catch(e){let t=e.message;if("EXC_BREAK"==t)break;if("EXC_CONTINUE"==t)continue;throw e}}else{null===s&&(s=1);for(let t=i;;t+=s)try{e[n]=t,$5965a8a303d1bb14$var$Template.value(a,e)}catch(e){let t=e.message;if("EXC_BREAK"==t)break;if("EXC_CONTINUE"==t)continue;throw e}}return delete e[n],null},/**
	**	Repeats the specified template infinitely until a "break" is found.
	**
	**	loop <template>
	*/_loop:function(t,e){if(t.length<2)return"(`loop`: Wrong number of parameters)";let n=t[1];for(;;)try{$5965a8a303d1bb14$var$Template.value(n,e)}catch(e){let t=e.message;if("EXC_BREAK"==t)break;if("EXC_CONTINUE"==t)continue;throw e}return null},/**
	**	Writes the specified arguments to the console.
	**
	**	echo <expr> [<expr>...]
	*/_echo:function(t,e){let n="";for(let r=1;r<t.length;r++)n+=$5965a8a303d1bb14$var$Template.expand(t[r],e,"arg");return console.log(n),""},/**
	**	Constructs a list from the given arguments and returns it.
	**
	**	# <expr> [<expr>...]
	*/"_#":function(t,e){let n=[];for(let r=1;r<t.length;r++)n.push($5965a8a303d1bb14$var$Template.expand(t[r],e,"arg"));return n},/**
	**	Constructs a non-expanded list from the given arguments and returns it.
	**
	**	## <expr> [<expr>...]
	*/"_##":function(t,e){let n=[];for(let e=1;e<t.length;e++)n.push(t[e]);return n},/**
	**	Constructs an associative array (dictionary) and returns it.
	**
	**	& <name>: <expr> [<name>: <expr>...]
	**	& :<name> <expr> [:<name> <expr>...]
	*/"_&":function(t,e){return $5965a8a303d1bb14$var$Template.getNamedValues(t,e,1,!0)},/**
	**	Constructs a non-expanded associative array (dictionary) and returns it.
	**
	**	&& <name>: <expr> [<name>: <expr>...]
	**	&& :<name> <expr> [:<name> <expr>...]
	*/"_&&":function(t,e){return $5965a8a303d1bb14$var$Template.getNamedValues(t,e,1,!1)},/**
	**	Returns true if the specified map contains all the specified keys. If it fails the global variable `err` will contain an error message.
	**
	**	contains <expr> <name> [<name>...]
	*/contains:function(t,e,n){let r=t[1];if("object"!=typeof r)return n.err="Argument is not a Map",!1;let i="";for(let e=2;e<t.length;e++)t[e]in r||(i+=", "+t[e]);return""==i||(n.err=i.substr(1),!1)},/**
	**	Returns true if the specified map has the specified key. Returns boolean.
	**
	**	has <name> <expr>
	*/has:function(t,e,n){let r=t[2];return"object"==(0,$1V76q.default).typeOf(r)&&t[1]in r},/**
	**	Returns a new array/map contaning the transformed values of the array/map (evaluating the template). And just as in 'each', the i# and i## variables be available.
	**
	**	map <varname> <list-expr> <template>
	*/_map:function(t,e){let n=$5965a8a303d1bb14$var$Template.expand(t[1],e,"arg"),r=$5965a8a303d1bb14$var$Template.expand(t[2],e,"arg");if(!r)return r;let i="array"==(0,$1V76q.default).typeOf(r),s=i?[]:{},a=0;for(let l in r)e[n]=r[l],e[n+"##"]=a++,e[n+"#"]=l,i?s.push($5965a8a303d1bb14$var$Template.expand(t[3],e,"arg")):s[l]=$5965a8a303d1bb14$var$Template.expand(t[3],e,"arg");return delete e[n],delete e[n+"##"],delete e[n+"#"],s},/**
	**	Returns a new array/map contaning the elements where the template evaluates to non-zero. Just as in 'each', the i# and i## variables be available.
	**
	**	filter <varname> <list-expr> <template>
	*/_filter:function(t,e){let n=$5965a8a303d1bb14$var$Template.expand(t[1],e,"arg"),r=$5965a8a303d1bb14$var$Template.expand(t[2],e,"arg");if(!r)return r;let i="array"==(0,$1V76q.default).typeOf(r),s=i?[]:{},a=0;for(let l in r)e[n]=r[l],e[n+"##"]=a++,e[n+"#"]=l,~~$5965a8a303d1bb14$var$Template.expand(t[3],e,"arg")&&(i?s.push(r[l]):s[l]=r[l]);return delete e[n],delete e[n+"##"],delete e[n+"#"],s},/**
	**	Expands the specified template string with the given data. The sym_open and sym_close will be '{' and '}' respectively.
	**	If no data is provided, current data parameter will be used.
	**
	**	expand <template> <data>
	*/expand:function(t,e,n){return $5965a8a303d1bb14$var$Template.expand($5965a8a303d1bb14$var$Template.parseTemplate(t[1],"{","}"),3==t.length?t[2]:n)},/**
	**	Calls a function described by the given parameter.
	**
	**	call <function> <args...>
	*/_call:function(t,e){let n=$5965a8a303d1bb14$var$Template.expand(t[1],e,"varref");if(!n||"function"!=typeof n[0][n[1]])throw Error("Expression is not a function: "+$5965a8a303d1bb14$var$Template.expand(t[1],e,"obj").map(t=>null==t?".":t).join(""));let r=[];for(let n=2;n<t.length;n++)r.push($5965a8a303d1bb14$var$Template.value(t[n],e));return n[0][n[1]](...r)}};var $5965a8a303d1bb14$export$2e2bcd8739ae039=$5965a8a303d1bb14$var$Template;const $5eaf60761b941187$export$eefcfe56efaaa57d=$1V76q.default,$5eaf60761b941187$export$4c85e640eb41c31b=$948f072c447a9569$export$2e2bcd8739ae039,$5eaf60761b941187$export$d61e24a684f9e51=$7c8e31460e56f4d6$export$2e2bcd8739ae039,$5eaf60761b941187$export$ec8b666c5fe2c75a=$0681abc29226a7a0$export$2e2bcd8739ae039,$5eaf60761b941187$export$a1edc412be3e1841=$d7fcaaa29d0ffaa7$export$2e2bcd8739ae039,$5eaf60761b941187$export$59eced47f477f85a=$7a8546796ed70f75$export$2e2bcd8739ae039,$5eaf60761b941187$export$19342e026b58ebb7=$b774d0942594d100$export$2e2bcd8739ae039,$5eaf60761b941187$export$3a9581c9ade29768=$d46d380bfeb80f47$export$2e2bcd8739ae039,$5eaf60761b941187$export$fb8073518f34e6ec=$16da3fe9744df3bc$export$2e2bcd8739ae039,$5eaf60761b941187$export$14416b8d99d47caa=$5965a8a303d1bb14$export$2e2bcd8739ae039;$parcel$global.rinn={Rinn:$5eaf60761b941187$export$eefcfe56efaaa57d,Class:$5eaf60761b941187$export$4c85e640eb41c31b,Event:$5eaf60761b941187$export$d61e24a684f9e51,EventDispatcher:$5eaf60761b941187$export$ec8b666c5fe2c75a,Model:$5eaf60761b941187$export$a1edc412be3e1841,ModelList:$5eaf60761b941187$export$59eced47f477f85a,Schema:$5eaf60761b941187$export$19342e026b58ebb7,Flattenable:$5eaf60761b941187$export$3a9581c9ade29768,Collection:$5eaf60761b941187$export$fb8073518f34e6ec,Template:$5eaf60761b941187$export$14416b8d99d47caa};//# sourceMappingURL=rinn.js.map

//# sourceMappingURL=rinn.js.map
