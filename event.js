/*
**	rin/event
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
let Class = require('./class');

/**
**	Holds the information about a triggered event. It also provides a mechanism to allow asynchronous
**	event propagation to ensure the event chain order.
*/

module.exports = Class.extend
({
	/**
	**	Name of the class.
	*/
	className: "Event",

	/**
	**	Source of the event.
	*/
	source: null,

	/**
	**	Name of the event.
	*/
	name: null,

	/**
	**	Arguments of the event.
	*/
	args: null,

	/**
	**	Indicates if the last event handler wants to use async mode.
	*/
	_async: false,

	/**
	**	Queue of all handlers to invoke.
	*/
	list: null,

	/**
	**	Next event to be executed in the event chain.
	*/
	next: null,

	/**
	**	Return values from event handlers.
	*/
	ret: null,

	/**
	**	Original root event.
	*/
	original: null,

	/**
	**	Index of the current event handler.
	*/
	i: -1,

	/**
	**	Contructs an event object with the specified parameters. Source is the event-dispatcher object, list is
	**	an array with all the listeners to invoke. The eventName and eventArgs are the event information to be
	**	passed to each handler and if a callback is specified (cbHandler+cbContext) it will be executed once all
	**	the event handlers have been processed.
	**
	**	Event __ctor (source: EventDispatcher, list: Array, eventName: string, eventArgs: map, cbHandler: function, cbContext: object);
	*/
	__ctor: function (source, list, eventName, eventArgs, cbHandler, cbContext)
	{
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
	*/
	reset: function ()
	{
		this.next = null;
		this.ret = [];

		this._async = false;
		this.i = -1;

		return this;
	},

	/**
	**	Sets the internal asynchronous flag. Should be called before a handler returns. If a handler
	**	calls this method it should also call resume() when async operations are finished.
	**
	**	Event wait ();
	*/
	wait: function ()
	{
		this._async = true;
		return this;
	},

	/**
	**	Resumes event propagation. Should be called manually by event handlers that also call wait().
	**
	**	Event resume ();
	*/
	resume: function ()
	{
		this._async = false;

		while (!this._async)
		{
			if (++this.i >= this.list.length)
				break;

			if (this.list[this.i].silent)
				continue;

			if (Rin.typeOf(this.list[this.i].handler) == "string")
			{
				if (this.list[this.i].context)
				{
					if (!this.list[this.i].context[this.list[this.i].handler])
						continue;

					if (this.list[this.i].context[this.list[this.i].handler] (this, this.args, this.list[this.i].data) === false)
						break;
				}
				else
				{
					if (globalThis[this.list[this.i].handler].call (null, this, this.args, this.list[this.i].data) === false)
						break;
				}
			}
			else
			{
				if (this.list[this.i].handler.call (this.list[this.i].context, this, this.args, this.list[this.i].data) === false)
					break;
			}
		}

		if (this._async)
			return this;

		if (this.i >= this.list.length && this.next) this.next.resume();

		if (this.cbHandler)
			this.cbHandler.call (this.cbContext);

		return this;
	},

	/**
	**	Sets the "original" property of the event to indicate where the original event comes from.
	**
	**	Event from (event: Event);
	*/
	from: function (event)
	{
		this.original = event;
		return this;
	},

	/**
	**	Enqueues the specified event to be executed upon the current event process is finished. The "original"
	**	property of the chained event will be set to the current event.
	**
	**	Event enqueueEvent (event: Event);
	*/
	enqueue: function (event)
	{
		if (!event) return this;

		var evt;
		for (evt = this; evt.next != null; evt = evt.next);

		evt.next = event;
		event.from (this);

		return this;
	}
});
