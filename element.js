/*
**	rin.element.js
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
	**	Base element constructor.
	*/
	__ctor: function()
	{
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

		this.addEventListener (eventName, function (evt)
		{
			if (selector && selector != "*")
			{
				let i = Rin.indexOf(this.querySelectorAll(selector), evt.target);
				if (i !== null)
				{
					evt.stopPropagation();
					handler.call (this, evt, evt.detail);
				}
			}
			else
			{
				evt.stopPropagation();
				handler.call (this, evt, evt.detail);
			}
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
