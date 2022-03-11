/*
**	rinn/event-dispatcher.js
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

import Class from './class.js';
import Event from './event.js';

/**
**	Event dispatcher allows several event listeners to be attached, these will be invoked whenever the
**	event that is being listened to is triggered.
*/

export default Class.extend
({
	/**
	**	Name of the class.
	*/
	className: "EventDispatcher",

	/**
	**	Listeners attached to this event dispatcher. Grouped by event name.
	*/
	listeners: null,

	/**
	**	Namespace for event dispatching. Defaults to null. Can be modified using setNamespace().
	*/
	namespace: null,

	/**
	**	Initializes the event dispatcher.
	**
	**	EventDispatcher __ctor ();
	*/
	__ctor: function ()
	{
		this.listeners = { };
	},

	/**
	**	Sets the event dispatching namespace. Used to force all events dispatched to have the specified namespace.
	**
	**	EventDispatcher setNamespace (value: string);
	*/
	setNamespace: function (value)
	{
		this.namespace = value;
		return this;
	},

	/**
	**	Adds an event listener for a specified event to the event dispatcher. The event name can have an optional
	**	namespace indicator which is added to the beginning of the event name and separated using a colon (:). This
	**	indicator can be used to later trigger or remove all handlers of an specific namespace.
	**
	**	EventDispatcher addEventListener (eventName: string, handler: function, context: object, data: object);
	*/
	addEventListener: function (eventName, handler, context, data)
	{
		eventName = eventName.split(":");
		var name = eventName[eventName.length-1];
		var ns = eventName.length > 1 ? eventName[0] : null;

		if (!this.listeners[name])
			this.listeners[name] = [];

		this.listeners[name].push ({ ns: ns, handler: handler, context: context, data: data, silent: 0 });
		return this;
	},

	/**
	**	Removes an event listener from the event dispatcher. If only the name is provided all handlers with the
	**	specified name will be removed. If a context is provided without a handler then any handler matching the
	**	context will be removed. Special event name "*" can be used to match all event names.
	**
	**	EventDispatcher removeEventListener (eventName: string, handler: function, context: object);
	*/
	removeEventListener: function (eventName, handler, context)
	{
		eventName = eventName.split(":");
		var name = eventName[eventName.length-1];
		var ns = eventName.length > 1 ? eventName[0] : null;

		if (name == "*")
		{
			for (var j in this.listeners)
			{
				var list = this.listeners[j];

				for (var i = 0; i < list.length; i++)
				{
					var k = true;

					if (handler)
						k = k && list[i].handler === handler;

					if (context)
						k = k && list[i].context === context;

					if (ns)
						k = k && list[i].ns == ns;

					if (k) list.splice(i--, 1);
				}
			}
		}
		else
		{
			if (!this.listeners[name])
				return this;

			var list = this.listeners[name];

			for (var i = 0; i < list.length; i++)
			{
				var k = true;

				if (handler)
					k = k && list[i].handler === handler;

				if (context)
					k = k && list[i].context === context;

				if (ns)
					k = k && list[i].ns == ns;

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
	*/
	prepareEvent: function (eventName, eventArgs, cbHandler, cbContext)
	{
		var list = [];

		eventName = eventName.split(":");
		var name = eventName[eventName.length-1];
		var ns = eventName.length > 1 ? eventName[0] : null;

		if (this.listeners[name])
			list = list.concat (this.listeners[name]);

		if (this.listeners["*"])
			list = list.concat (this.listeners["*"]);

		for (var i = 0; i < list.length; i++)
			if (list[i].silent) list.splice (i--, 1);

		if (ns)
		{
			for (var i = 0; i < list.length; i++)
				if (list[i].ns != ns) list.splice (i--, 1);
		}

		return new Event (this, list, name, eventArgs, cbHandler, cbContext);
	},

	/**
	**	Silences or unsilences all handlers attached to an event such that if the event fires the handler(s) will
	**	not be invoked. It is recommended to use a namespace to ensure other handlers will continue to be run.
	**
	**	EventDispatcher silence (eventName: string);
	*/
	silence: function (eventName, value)
	{
		eventName = eventName.split(":");

		var name = eventName[eventName.length-1];
		var ns = eventName.length > 1 ? eventName[0] : null;

		value = value === false ? -1 : 1;

		if (name == "*")
		{
			for (var j in this.listeners)
			{
				var list = this.listeners[j];

				for (var i = 0; i < list.length; i++)
				{
					if (ns && list[i].ns != ns)
						continue;

					list[i].silent += value;
				}
			}
		}
		else
		{
			if (!this.listeners[name])
				return this;

			var list = this.listeners[name];

			for (var i = 0; i < list.length; i++)
			{
				if (ns && list[i].ns != ns)
					continue;

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
	*/
	dispatchEvent: function (eventName, eventArgs, cbHandler, cbContext)
	{
		return this.prepareEvent(this.namespace ? this.namespace+':'+eventName : eventName, eventArgs, cbHandler, cbContext).resume();
	}
});
