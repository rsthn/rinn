
import Rinn from './alpha.js';
import Model from './model.js';

/**
**	Generic list for models.
*/

export default Model.extend
({
	/**
	**	Name of the class.
	*/
	className: "ModelList",

	/**
	**	Class of the items in the list, can be overriden by child classes to impose a more strict constraint.
	*/
	itemt: Model,

	/**
	**	Mirror of data.contents
	*/
	contents: null,

	/**
	**	IDs of every item in the contents.
	*/
	itemId: null,

	/**
	**	Autoincremental ID for the next item to be added.
	*/
	nextId: null,

	/**
	**	Default properties of the model.
	*/
	defaults:
	{
		contents: null
	},

	/**
	**	Constraints of the model to ensure integrity.
	*/
	constraints:
	{
		contents: {
			type: "array",
			arrayof: "@itemt"
		}
	},

	/**
	**	Constructor.
	*/
	__ctor: function (...args)
	{
		this.itemId = [];
		this.nextId = 0;

		this._super.Model.__ctor(...args);
	},

	/**
	**	Initialization epilogue. Called after initialization and after model properties are set.
	*/
	ready: function ()
	{
		this._eventGroup = "ModelList_" + Date.now() + ":modelChanged";

		this.contents = this.data.contents;
	},

	/**
	**	Connects the event handlers to the item.
	**
	**	>> Model _bind (int iid, Model item);
	*/
	_bind: function (iid, item)
	{
		if (item && item.addEventListener) item.addEventListener (this._eventGroup, this._onItemEvent, this, iid);
		return item;
	},

	/**
	**	Disconnects the event handlers from the item.
	**
	**	>> Model _unbind (Model item);
	*/
	_unbind: function (item)
	{
		if (item && item.removeEventListener) item.removeEventListener (this._eventGroup);
		return item;
	},

	/**
	**	Handler for item events.
	**
	**	>> Model _onItemEvent (Event evt, object args, int iid);
	*/
	_onItemEvent: function (evt, args, iid)
	{
		this.prepareEvent ("itemChanged", { id: iid, item: evt.source }).from (evt)
		.enqueue (this.prepareEvent ("modelChanged", { fields: ["contents"] })).resume ();
	},

	/**
	**	Returns the number of items in the list.
	**
	**	>> int length ();
	*/
	length: function ()
	{
		return this.data.contents.length;
	},

	/**
	**	Clears the contents of the list.
	**
	**	>> void clear ();
	*/
	clear: function ()
	{
		for (var i = 0; i < this.data.contents; i++)
			this._unbind (this.data.contents[i]);

		this.itemId = [];
		this.nextId = 0;

		this.contents = this.data.contents = [];

		this.prepareEvent ("itemsCleared")
		.enqueue (this.prepareEvent ("modelChanged", { fields: ["contents"] })).resume ();

		return this;
	},

	/**
	**	Sets the contents of the list with the specified array. All items will be ensured to be of the same model
	**	type as the one specified in the list.
	**
	**	>> ModelList setData (array data);
	*/
	setData: function (data)
	{
		this.clear();
		if (!data) return this;

		for (var i = 0; i < data.length; i++)
		{
			var item = Rinn.ensureTypeOf(this.itemt, data[i]);

			this.itemId.push(this.nextId++);
			this.data.contents.push(item);

			this._bind(this.nextId-1, item);
		}

		this.prepareEvent ("itemsChanged")
		.enqueue (this.prepareEvent ("modelChanged", { fields: ["contents"] })).resume ();

		return this;
	},

	/**
	**	Returns the raw array contents of the list.
	**
	**	>> array getData ();
	*/
	getData: function ()
	{
		return this.data.contents;
	},

	/**
	**	Returns the item at the specified index or null if the index is out of bounds.
	**
	**	>> Model getAt (int index);
	*/
	getAt: function (index)
	{
		if (index < 0 || index >= this.data.contents.length)
			return null;

		return this.data.contents[index];
	},

	/**
	**	Removes and returns the item at the specified index. Returns null if the index is out of bounds.
	**
	**	>> Model removeAt (int index);
	*/
	removeAt: function (index)
	{
		if (index < 0 || index >= this.data.contents.length)
			return null;

		let item = this.data.contents.splice(index, 1)[0];
		let id = this.itemId.splice(index, 1)[0];

		this._unbind (item);

		this.prepareEvent ("itemRemoved", { id: id, item: item })
		.enqueue (this.prepareEvent ("modelChanged", { fields: ["contents"] })).resume();

		return item;
	},

	/**
	**	Sets the item at the specified index. Returns false if the index is out of bounds, true otherwise. The
	**	item will be ensured to be of the model defined in the list.
	**
	**	>> bool setAt (int index, Model item);
	*/
	setAt: function (index, item)
	{
		if (index < 0 || index >= this.data.contents.length)
			return false;

		item = Rinn.ensureTypeOf(this.itemt, item);

		this._unbind(this.data.contents[index]);
		this.data.contents[index] = item;
		this._bind(this.itemId[index], item);

		this.prepareEvent ("itemChanged", { id: this.itemId[index], item: item })
		.enqueue (this.prepareEvent ("modelChanged", { fields: ["contents"] })).resume ();

		return true;
	},

	/**
	**	Notifies a change in the item at the specified index. Returns false if the index is out of bounds.
	**
	**	>> bool updateAt (int index);
	*/
	updateAt: function (index)
	{
		if (index < 0 || index >= this.data.contents.length)
			return false;

		this.prepareEvent ("itemChanged", { id: this.itemId[index], item: this.data.contents[index] })
		.enqueue (this.prepareEvent ("modelChanged", { fields: ["contents"] })).resume ();

		return true;
	},

	/**
	**	Adds an item to the bottom of the list. Returns null if the item is not an object or a model. The item
	**	will be ensured to be of the model specified in the list.
	**
	**	>> Model push (Model item);
	*/
	push: function (item)
	{
		if (item && Rinn.typeOf(item) != "object")
			return null;

		item = Rinn.ensureTypeOf(this.itemt, item);

		this.itemId.push(this.nextId++);
		this.data.contents.push (item);
		this._bind(this.nextId-1, item);

		this.prepareEvent ("itemAdded", { id: this.itemId[this.itemId.length-1], item: item, position: 'tail' })
		.enqueue (this.prepareEvent ("modelChanged", { fields: ["contents"] })).resume ();

		return item;
	},

	/**
	**	Removes and returns an item from the bottom of the list.
	**
	**	>> Model pop ();
	*/
	pop: function ()
	{
		return this._unbind(this.data.contents.pop());
	},

	/**
	**	Adds an item to the top of the list. Returns null if the item is not an object or a model. The item
	**	will be ensured to be of the model specified in the list.
	**
	**	>> Model unshift (Model item);
	*/
	unshift: function (item)
	{
		if (item && Rinn.typeOf(item) != "object")
			return null;

		item = Rinn.ensureTypeOf(this.itemt, item);

		this.itemId.unshift(this.nextId++);
		this.data.contents.unshift (item);
		this._bind(this.nextId-1, item);

		this.prepareEvent ("itemAdded", { id: this.itemId[0], item: item, position: 'head' })
		.enqueue (this.prepareEvent ("modelChanged", { fields: ["contents"] })).resume ();

		return item;
	},

	/**
	**	Removes and returns an item from the top of the list.
	**
	**	>> Model shift ();
	*/
	shift: function ()
	{
		return this._unbind(this.data.contents.shift());
	},

	/**
	**	Searches for an item matching the specified partial definition and returns its index. Returns -1 if the
	**	item was not found. If retObject is set to true the object will be returned instead of its index and null
	**	will be returned when the item is not found.
	**
	**	int|object find (object data, bool retObject=false);
	*/
	find: function (data, retObject=false)
	{
		var contents = this.data.contents;

		for (var i = 0; i < contents.length; i++)
		{
			if (Rinn.partialCompare (contents[i].data, data))
				return retObject ? contents[i] : i;
		}

		return retObject ? null : -1;
	}
});
