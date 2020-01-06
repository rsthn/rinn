/*
**	rin/element
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

/*
**	Base class for custom elements.
*/

let _Element = module.exports = 
{
	/**
	**	Indicates if the element is a root element, that is, the target element to attach elements having data-ref attribute.
	*/
	isRoot: false,

	/**
	**	Model type (class) for the element's model.
	*/
	modelt: Model,

	/**
	**	Data model related to the element.
	*/
	model: null,

	/**
	**	Events map.
	*/
	events: null,

	/**
	**	Element constructor.
	*/
	__ctor: function()
	{
		this.init.apply(this, arguments);

		if (this.events)
			this.bindEvents (this.events);

		this.init();
	},

	/**
	**	Initializes the element. Called after construction of the instance.
	**
	**	>> void init();
	*/
	init: function()
	{
	},

	/**
	**	Sets the model of the element and executes the modelChanged event handler.
	**
	**	>> Element setModel (Model model);
	*/
	setModel: function (model)
	{
		if (!model) return this;

		if (!(model instanceof this.modelt))
			model = new this.modelt (model);

		if (this.model != null)
		{
			this.model.removeEventListener ("modelChanged", this.onModelChanged, this);
			this.model.removeEventListener ("propertyChanging", this.onModelPropertyChanging, this);
			this.model.removeEventListener ("propertyChanged", this.onModelPropertyChanged, this);
			this.model.removeEventListener ("propertyRemoved", this.onModelPropertyRemoved, this);
		}

		this.model = model;

		this.model.addEventListener ("modelChanged", this.onModelChanged, this);
		this.model.addEventListener ("propertyChanging", this.onModelPropertyChanging, this);
		this.model.addEventListener ("propertyChanged", this.onModelPropertyChanged, this);
		this.model.addEventListener ("propertyRemoved", this.onModelPropertyRemoved, this);

		this.onModelChanged ();
		return this;
	},

	/**
	**	Returns the model of the element. This is a dummy function returning the public attribute "model" of this class.
	**
	**	>> Model getModel();
	*/
	getModel: function ()
	{
		return this.model;
	},

	/**
	**	Binds all events in the specified map to the element, the events map can have one of the following forms:
	**
	**		"click .button": "doSomething",		(Delegated Event)
	**		"click .button": function() { },	(Delegated Event)
	**		"myevt @this": "...",				(Element Event)
	**		"myevt": "...",						(Element Event)
	**		"myevt @objName": "...",			(Element Event)
	**		"#propname": "...",					(Property Changed Event)
	**		"keyup(10) .input": "..."			(Delegated Event with Parameters)
	**
	**	>> Element bindEvents (object events);
	*/
	bindEvents: function (events)
	{
		for (var evtstr in events)
		{
			let hdl = events[evtstr];

			if (Rin.typeOf(hdl) == 'string')
				hdl = this[hdl];

			hdl = hdl.bind(this);

			var i = evtstr.indexOf(" ");

			var name = i == -1 ? evtstr : evtstr.substr(0, i);
			var selector = i == -1 ? "" : evtstr.substr(i + 1);

			var args = null;

			var j = name.indexOf("(");
			if (j != -1)
			{
				args = name.substr(j+1, name.length-j-2).split(",");
				name = name.substr(0, j);
			}

			if (selector.substr(0,1) == "@")
			{
				if (selector.substr(1) == "this")
				{
					this.listen(name, hdl);
				}
				else
					this[selector.substr(1)].addEventListener(name, hdl);

				continue;
			}

			if (name.substr(0, 1) == "#")
			{
				this.listen("propertyChanged."+name.substr(1), hdl);
				continue;
			}

			if (args != null)
			{
				switch (name)
				{
					case "keyup": case "keydown":
						this.listen (name, selector, function (evt, args)
						{
							if (Rin.indexOf(args, evt.keyCode.toString()) != -1)
								return hdl (evt, args);
						});
						continue;
				}
			}

			this.listen (name, selector, hdl);
		}

		return this;
	},

	/**
	**	Listens for an event for elements matching the specified selector.
	**
	**	>> void listen (string eventName, string selector, function handler);
	**	>> void listen (string eventName, function handler);
	*/
	listen: function (eventName, selector, handler)
	{
		if (Rin.typeOf(selector) == "function")
		{
			handler = selector;
			selector = null;
		}

		this.addEventListener (eventName, (evt) =>
		{
			if (selector && selector != "*")
			{
				let elems = this.querySelectorAll(selector);

				evt.source = evt.target;

				while (evt.source !== this)
				{
					let i = Rin.indexOf(elems, evt.source);
					if (i !== null)
					{
						handler.call (this, evt, evt.detail);
						break;
					}
					else
					{
						evt.source = evt.source.parentNode;
					}
				}
			}
			else
			{
				handler.call (this, evt, evt.detail);
			}

			evt.stopPropagation();
		});
	},

	/**
	**	Dispatches a new event with the specified name and the given arguments.
	**
	**	>> void dispatch (string eventName, object args);
	*/
	dispatch: function (eventName, args)
	{
		this.dispatchEvent (new CustomEvent (eventName, { bubbles: true, detail: args }));
	},

	/**
	**	Handler for the DOM connected event.
	**
	**	>> void onConnected ();
	*/
	onConnected: function()
	{
	},

	/**
	**	Handler for the DOM disconnected event.
	**
	**	>> void onDisconnected ();
	*/
	onDisconnected: function()
	{
	},

	/**
	**	Event handler invoked when the model has changed.
	**
	**	>> void onModelChanged (evt, args);
	*/
	onModelChanged: function (evt, args)
	{
	},

	/**
	**	Event handler invoked when a property of the model is changing.
	**
	**	>> void onModelPropertyChanging (evt, args);
	*/
	onModelPropertyChanging: function (evt, args)
	{
	},

	/**
	**	Event handler invoked when a property of the model has changed. Automatically triggers an
	**	internal event named "propertyChanged.<propertyName>".
	**
	**	>> void onModelPropertyChanged (evt, args);
	*/
	onModelPropertyChanged: function (evt, args)
	{
		this.dispatch ("propertyChanged." + args.name, args);
	},

	/**
	**	Event handler invoked when a property of the model is removed.
	**
	**	>> void onModelPropertyRemoved (evt, args);
	*/
	onModelPropertyRemoved: function (evt, args)
	{
	},

	/*
	**	Registers a new custom element with the specified name, extra functionality can be added with one or more prototypes,
	**	by default all elements also get the Rin.Element prototype.
	**
	**	>> class register (string name, object... protos);
	*/
	register: function (name, ...protos)
	{
		var newElement = class extends HTMLElement
		{
			constructor()
			{
				super();
				this.invokeConstructor = true;
			}

			findRoot()
			{
				let elem = this;

				while (elem != null)
				{
					if ("isRoot" in elem && elem.isRoot)
						return elem;

					elem = elem.parentNode;
				}

				return null;
			}

			connectedCallback()
			{
				if (this.dataset.ref)
				{
					let root = this.findRoot();
					if (root) root[this.dataset.ref] = this;
				}

				if (this.invokeConstructor)
				{
					this.__ctor();
					this.invokeConstructor = false;
				}

				this.onConnected();
			}

			disconnectedCallback()
			{
				if (this.dataset.ref)
				{
					let root = this.findRoot();
					if (root) root[this.dataset.ref] = null;
				}

				this.onDisconnected();
			}
		};

		Rin.override (newElement.prototype, _Element);

		for (let i = 0; i < protos.length; i++)
			Rin.override (newElement.prototype, protos[i]);

		customElements.define (name, newElement);
		return newElement;
	}
};
