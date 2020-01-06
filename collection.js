/*
**	rin/collection
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
let Serializable = require('./serializable');

/**
**	Serializable collection class, used to store items and manipulate them. The items should also be serializable.
*/

module.exports = Serializable.extend
({
	/**
	**	Name of the class.
	*/
	className: "Collection",

	/**
	**	Type of the items in the collection, should be overriden by derived classes to reference a valid class.
	*/
	itemt: null, /* Class or Function */

	/**
	**	Indicates if the collection is dynamic. This affects only unflattening. When dynamic the "itemt" attribute is a
	**	function that takes an object as parameter and returns the appropriate instanced class (unflattened).
	*/
	isDynamic: false,

	/**
	**	Array of items.
	*/
	items: null, /* Array */

	/**
	**	Constructs the collection.
	*/
	__ctor: function (opts, isflat)
	{
		this._super.Serializable.__ctor(opts, isflat);
	},

	/**
	**	Initializes the collection with the specified options.
	*/
	init: function (opts)
	{
		Rin.override (this, opts);
		
		this.items = new Array();

		if (opts.items)
		{
			for (var i = 0; i < opts.items.length; i++)
				this.add (opts.items[i]);
		}
	},

	/**
	**	Flattens the collection.
	*/
	flatten: function ()
	{
		var items = [];

		if (this.itemt == null && !("flattenItem" in this))
			throw new Error ("Collection: Unable to flatten, the itemt class was not specified and flattenItem() is not available.");

		for (var i = 0; i < this.items.length; i++)
		{
			if (this.itemt == null)
				items.push (this.flattenItem(this.items[i]));
			else
				items.push (this.items[i].flatten());
		}

		return items;
	},

	/**
	**	Unflattens the collection. Uses the "itemt" attribute to convert the plain objects into class-objects.
	*/
	unflatten: function (o)
	{
		var items = [];

		if (this.itemt == null && !("unflattenItem" in this))
			throw new Error ("Collection: Unable to unflatten, the itemt class was not specified and unflattenItem() is not available.");

		for (var i = 0; i < o.length; i++)
		{
			if (this.itemt == null)
				items.push (this.unflattenItem (o[i]));
			else
				items.push (this.isDynamic ? this.itemt(o[i]) : new this.itemt (o[i], true));
		}

		return { items: items };
	},

	reset: function ()
	{
		this.items = new Array();
		return this;
	},

	clear: function ()
	{
		var items = this.items;
		this.reset();

		for (var i = 0; i < items.length; i++)
			this.onItemRemoved (items[i], 0);

		return this;
	},

	/**
	**	Sorts the collection. A comparison function should be provided, or the name of a property to sort by.
	**
	**	Object sort (fn: Function)
	**	Object sort (prop: string, [desc:bool=false])
	*/
	sort: function (fn, desc)
	{
		if (typeof(fn) != "function")
		{
			this.items.sort(function(a, b)
			{
				return (a[fn] <= b[fn] ? -1 : 1) * (desc === true ? -1 : 1);
			});
		}
		else
			this.items.sort(fn);

		return this;
	},

	/**
	**	Searches for an item with the specified fields and returns it. The "inc" object is the "inclusive" map, meaning all fields must match
	**	and the optional "exc" is the exclusive map, meaning not even one field should match.
	**
	**	Object findItem (inc: Object, exc: Object);
	*/	
	findItem: function (inc, exc)
	{
		if (!this.items) return null;

		for (var i = 0; i < this.items.length; i++)
		{
			if (exc && Rin.partialCompare(this.items[i], exc))
				continue;

			if (Rin.partialCompare(this.items[i], inc))
				return this.items[i];
		}

		return null;
	},

	getItems: function ()
	{
		return this.items;
	},

	count: function ()
	{
		return this.items.length;
	},

	isEmpty: function ()
	{
		return !this.items.length;
	},

	add: function (item)
	{
		if (!item || !this.onBeforeItemAdd(item))
			return this;

		this.items.push (item);
		this.onItemAdded (item);

		return this;
	},

	addAt: function (index, item)
	{
		if (!item || !this.onBeforeItemAdd (item))
			return this;

		if (index < 0) index = 0;
		if (index > this.items.length) index = this.items.length;

		if (index == 0)
		{
			this.items.unshift(item);
		}
		else if (index == this.items.length)
		{
			this.items.push(item);
		}
		else
		{
			var tmp = this.items.splice(0, index);
			tmp.push(item);

			this.items = tmp.concat(this.items);
		}

		this.onItemAdded (item);
		return this;
	},

	addItems: function (list)
	{
		if (!list) return this;

		for (var i = 0; i < list.length; i++)
			this.add (list[i]);

		return this;
	},

	indexOf: function (item)
	{
		return this.items.indexOf(item);
	},

	getAt: function (index, rel)
	{
		if (index < 0 && rel == true)
			index += this.items.length;

		return index >= 0 && index < this.items.length ? this.items[index] : null;
	},

	removeAt: function (index)
	{
		if (index < 0 || index >= this.items.length)
			return this;

		var item = this.items[index];

		this.items.splice (index, 1);

		this.onItemRemoved (item, index);
		return this;
	},

	remove: function (item)
	{
		this.removeAt (this.indexOf(item));
	},

	forEach: function (hdl, ctx)
	{
		if (this.isEmpty())
			return this;

		if (!ctx) ctx = this;

		for (var i = 0; i < this.items.length; i++)
			if (hdl.call (ctx, this.items[i], i) === false) break;

		return this;
	},

	forEachCall: function (method)
	{
		if (this.isEmpty())
			return this;

		var args = new Array ();

		for (var i = 1; i < arguments.length; i++)
			args.push(arguments[i]);

		for (var i = 0; i < this.items.length; i++)
			if (this.items[i][method].apply (this.items[i], args) === false) break;

		return this;
	},

	forEachRev: function (hdl, ctx)
	{
		if (this.isEmpty())
			return this;

		if (!ctx) ctx = this;

		for (var i = this.items.length-1; i >= 0; i--)
			if (hdl.call (ctx, this.items[i], i) === false) break;

		return this;
	},

	forEachRevCall: function (method)
	{
		if (this.isEmpty())
			return this;

		var args = new Array ();

		for (var i = 1; i < arguments.length; i++)
			args.push(arguments[i]);

		for (var i = this.items.length-1; i >= 0; i--)
			if (this.items[i][method].apply (this.items[i], args) === false) break;

		return this;
	},

	onBeforeItemAdd: function (item)
	{
		return true;
	},

	onItemAdded: function (item)
	{
	},

	onItemRemoved: function (item)
	{
	}
});
