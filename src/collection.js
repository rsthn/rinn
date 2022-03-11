/*
**	rinn/collection.js
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

import Flattenable from './flattenable.js';
import Schema from './schema.js';
import Rinn from './alpha.js';

/**
**	Flattenable collection class, used to store items and manipulate them. The items should also be flattenable.
*/

export default Flattenable.extend
({
	/**
	**	Name of the class.
	*/
	className: "Collection",

	/**
	**	Describes the type schema of the underlying items.
	*/
	itemTypeSchema: null,

	/**
	**	Array of items.
	*/
	items: null, /* Array */

	/**
	**	Constructs the collection.
	*/
	__ctor: function (itemTypeSchema)
	{
		if (!itemTypeSchema) itemTypeSchema = this.itemTypeSchema;

		if (itemTypeSchema)
			this.typeSchema = Schema.Property('items').is(Schema.Array().of(itemTypeSchema));

		this.reset();
	},

	/*
	**	Executed after the collection has been unflattened, re-adds the items to ensure onItemAdded() is called.
	*/
	onUnflattened: function()
	{
		let items = this.items;
		this.reset();

		for (let i of items)
			this.add(i);
	},

	/**
	 * 	Executed when the value in `items` is changed.
	 */
	itemsReferenceChanged: function()
	{
	},

	/*
	**	Resets the collection to empty. Note that onItemRemoved will not be called.
	*/
	reset: function ()
	{
		this.items = [];
		this.itemsReferenceChanged();

		return this;
	},

	/*
	**	Clears the contents of the collection (removes each item manually, onItemRemoved will be called).
	*/
	clear: function ()
	{
		var items = this.items;
		this.reset();

		for (var i = 0; i < items.length; i++)
			this.onItemRemoved (items[i], 0);

		return this;
	},

	/*
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

	/*
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
			if (exc && Rinn.partialCompare(this.items[i], exc))
				continue;

			if (Rinn.partialCompare(this.items[i], inc))
				return this.items[i];
		}

		return null;
	},

	/*
	**	Returns the container array.
	*/
	getItems: function ()
	{
		return this.items;
	},

	/*
	**	Returns the number of items in the collection.
	*/
	length: function ()
	{
		return this.items.length;
	},

	/*
	**	Returns true if the collection is empty.
	*/
	isEmpty: function ()
	{
		return !this.items.length;
	},

	/*
	**	Returns the index of the specified item, or -1 if not found.
	*/
	indexOf: function (item)
	{
		return this.items.indexOf(item);
	},

	/*
	**	Returns the item at the specified index, or null if not found. When `relative` is true, negative offsets are allowed such that -1 refers to the last item.
	*/
	getAt: function (index, relative=false)
	{
		if (index < 0 && relative == true)
			index += this.items.length;

		return index >= 0 && index < this.items.length ? this.items[index] : null;
	},

	/*
	**	Returns the first item in the collection.
	*/
	first: function ()
	{
		return this.getAt(0);
	},

	/*
	**	Returns the last item in the collection.
	*/
	last: function ()
	{
		return this.getAt(-1, true);
	},

	/*
	**	Adds an item at the specified index, effectively moving the remaining items to the right.
	*/
	addAt: function (index, item)
	{
		if (!item || !this.onBeforeItemAdded (item))
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
			this.itemsReferenceChanged();
		}

		this.onItemAdded (item);
		return this;
	},

	/*
	**	Adds an item to the start of the collection, onBeforeItemAdded and onItemAdded will be triggered.
	*/
	unshift: function (item)
	{
		return this.addAt(0, item);
	},

	/*
	**	Adds an item to the end of the collection, onBeforeItemAdded and onItemAdded will be triggered.
	*/
	push: function (item)
	{
		return this.addAt(this.items.length, item);
	},

	/*
	**	Adds an item to the end of the collection, onBeforeItemAdded and onItemAdded will be triggered.
	*/
	add: function (item)
	{
		return this.push(item);
	},

	/*
	**	Removes the item at the specified index. When `relative` is true, negative offsets are allowed such that -1 refers to the last item.
	*/
	removeAt: function (index, relative=false)
	{
		if (index < 0 && relative == true)
			index += this.items.length;

		if (index < 0 || index >= this.items.length)
			return null;

		var item = this.items[index];
		this.items.splice (index, 1);
		this.onItemRemoved (item, index);

		return item;
	},

	/*
	**	Removes an item from the end of the collection.
	*/
	pop: function (item)
	{
		return this.removeAt(-1, true);
	},

	/*
	**	Removes an item from the start of the collection.
	*/
	shift: function (item)
	{
		return this.removeAt(0);
	},

	/*
	**	Removes the specified item from the collection.
	*/
	remove: function (item)
	{
		return this.removeAt (this.indexOf(item));
	},

	/*
	**	Runs the specified callback for each of the items in the collection, if false is returned by the callback this function
	**	will exit immediately. Parameters to the callback are: (item, index, collection).
	*/
	forEach: function (callback)
	{
		if (this.isEmpty())
			return this;

		for (var i = 0; i < this.items.length; i++)
			if (callback (this.items[i], i, this) === false) break;

		return this;
	},

	/*
	**	Executes a method call with the specified parameters on each of the items in the collection, if false is returned by the
	**	item's method this function will exit immediately.
	*/
	forEachCall: function (method, ...args)
	{
		if (this.isEmpty())
			return this;

		for (var i = 0; i < this.items.length; i++)
			if (this.items[i][method] (...args) === false) break;

		return this;
	},

	/*
	**	Exactly the same as forEach but in reverse order.
	*/
	forEachRev: function (callback)
	{
		if (this.isEmpty())
			return this;

		for (var i = this.items.length-1; i >= 0; i--)
			if (callback (this.items[i], i, this) === false) break;

		return this;
	},

	/*
	**	Exactly the same as forEachCall but in reverse order.
	*/
	forEachRevCall: function (method, ...args)
	{
		if (this.isEmpty())
			return this;

		for (var i = this.items.length-1; i >= 0; i--)
			if (this.items[i][method] (...args) === false) break;

		return this;
	},

	/*
	**	Handler for the beforeItemAdded event. If returns false the item will not be added.
	*/
	onBeforeItemAdded: function (item)
	{
		return true;
	},

	/*
	**	Handler for the itemAdded event.
	*/
	onItemAdded: function (item)
	{
	},

	/*
	**	Handler for the itemRemoved event.
	*/
	onItemRemoved: function (item)
	{
	}
});
