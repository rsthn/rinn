/*
**	rin/model-list
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
let Model = require('./model');

/**
**	Generic list for models.
*/

module.exports = Model.extend
({
	/**
	**	Name of the class.
	*/
	className: "List",

	/**
	**	Class of the items in the list, can be overriden by child classes to impose a more strict constraint.
	*/
	itemt: Model,

	/**
	**	Mirror of properties.contents
	*/
	contents: null,

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
	**	Initialization epilogue. Called after initialization and after model properties are set.
	**
	**	>> void ready ();
	*/
	ready: function ()
	{
		this._eventGroup = "ModelList_" + Date.now() + ":modelChanged";

		this.contents = this.properties.contents;
	},

	/**
	**	Connects the event handlers to the item.
	**
	**	>> Model _bind (int index, Model item);
	*/
	_bind: function (index, item)
	{
		if (item && item.addEventListener) item.addEventListener (this._eventGroup, this._onItemEvent, this, index);
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
	**	>> Model _onItemEvent (Event evt, object args, object data);
	*/
	_onItemEvent: function (evt, args, data)
	{
		this.prepareEvent ("itemChanged", { index: data, item: evt.source }).from (evt)
		.enqueue (this.prepareEvent ("modelChanged", { fields: ["contents"] })).resume ();
	},

	/**
	**	Returns the number of items in the list.
	**
	**	>> int count ();
	*/
	count: function ()
	{
		return this.properties.contents.length;
	},

	/**
	**	Clears the contents of the list.
	**
	**	>> void clear ();
	*/
	clear: function ()
	{
		for (var i = 0; i < this.properties.contents; i++)
			this._unbind (this.properties.contents[i]);

		this.properties.contents = [];

		this.prepareEvent ("itemCleared")
		.enqueue (this.prepareEvent ("modelChanged", { fields: ["contents"] })).resume ();
	},

	/**
	**	Sets the contents of the list with the specified array. All items will be ensured to be of the same model
	**	type as the one specified in the list.
	**
	**	>> void setData (array data);
	*/
	setData: function (data)
	{
		this.clear ();
		if (!data) return;

		for (var i = 0; i < data.length; i++)
		{
			var item = Rin.ensureTypeOf(this.itemt, data[i]);
			this._bind (i, item);

			this.properties.contents.push (item);
		}

		this.prepareEvent ("itemsChanged")
		.enqueue (this.prepareEvent ("modelChanged", { fields: ["contents"] })).resume ();
	},

	/**
	**	Returns the raw array contents of the list.
	**
	**	>> array getData ();
	*/
	getData: function ()
	{
		return this.properties.contents;
	},

	/**
	**	Returns the item at the specified index or null if the index is out of bounds.
	**
	**	>> Model getAt (int index);
	*/
	getAt: function (index)
	{
		if (index < 0 || index >= this.properties.contents.length)
			return null;

		return Rin.ensureTypeOf(this.itemt, this.properties.contents[index]);
	},

	/**
	**	Removes and returns the item at the specified index. Returns null if the index is out of bounds.
	**
	**	>> Model removeAt (int index);
	*/
	removeAt: function (index)
	{
		if (index < 0 || index >= this.properties.contents.length)
			return null;

		var item = Rin.ensureTypeOf(this.itemt, this.properties.contents.splice(index, 1)[0]);
		this._unbind (item);

		this.prepareEvent ("itemRemoved", { index: index, item: item })
		.enqueue (this.prepareEvent ("modelChanged", { fields: ["contents"] })).resume ();

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
		if (index < 0 || index >= this.properties.contents.length)
			return false;

		item = Rin.ensureTypeOf(this.itemt, item);

		this.properties.contents[index] = item;
		this._bind (index, item);

		this.prepareEvent ("itemChanged", { index: index, item: item })
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
		if (index < 0 || index >= this.properties.contents.length)
			return false;

		this.prepareEvent ("itemChanged", { index: index, item: this.properties.contents[index] })
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
		if (item && Rin.typeOf(item) != "object")
			return null;

		item = Rin.ensureTypeOf(this.itemt, item);

		this.properties.contents.push (item);
		this._bind (this.properties.contents.length-1, item);

		this.prepareEvent ("itemAdded", { index: this.properties.contents.length-1, item: item })
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
		return this._unbind (Rin.ensureTypeOf(this.itemt, this.properties.contents.pop()));
	},

	/**
	**	Adds an item to the top of the list. Returns null if the item is not an object or a model. The item
	**	will be ensured to be of the model specified in the list.
	**
	**	>> Model unshift (Model item);
	*/
	unshift: function (item)
	{
		if (item && Rin.typeOf(item) != "object")
			return null;

		item = Rin.ensureTypeOf(this.itemt, item);

		this.properties.contents.unshift (item);
		this._bind (0, item);

		this.prepareEvent ("itemAdded", { index: 0, item: item })
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
		return this._unbind (Rin.ensureTypeOf(this.itemt, this.properties.contents.shift()));
	},

	/**
	**	Searches for an item matching the specified partial definition and returns its index. Returns -1 if the
	**	item was not found. If retObject is set to true the object will be returned instead of its index and null
	**	will be returned when the item is not found.
	**
	**	int|object find (object data, bool retObject=false);
	*/
	find: function (data, retObject)
	{
		var contents = this.properties.contents;

		for (var i = 0; i < contents.length; i++)
		{
			if (Rin.partialCompare (contents[i].properties, data))
				return retObject ? contents[i] : i;
		}

		return retObject ? null : -1;
	}
});
