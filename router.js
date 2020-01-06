/*
**	rin/router
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

let EventDispatcher = require('./event-dispatcher');

/**
**	The Router is a special module that detects local URL changes (when a hash-change occurs) and
**	forwards events to the appropriate handlers.
*/

let _Router = module.exports =
{
	Route: EventDispatcher.extend
	({
		/**
		**	Regular expression for the route. This is generated from a simpler expression provided
		**	in the constructor.
		*/
		routeRegex: null,
	
		/**
		**	Original route string value.
		*/
		value: null,
	
		/**
		**	Map with the indices and the names of each paremeter obtained from the route expression.
		*/
		params: null,
	
		/**
		**	Arguments string obtained from the last route dispatch. Used to check if the arguments changed.
		*/
		s_args: null,
	
		/**
		**	Indicates if the route is active because of a past positive dispatch.
		*/
		active: false,
	
		/**
		**	Indicates if the route is active because of a past positive dispatch.
		*/
		changed: false,
	
		/**
		**	Constructor of the route, the specified argument is a route expression.
		**
		**	>> void __ctor (string route);
		*/
		__ctor: function (route)
		{
			this._super.EventDispatcher.__ctor();
			this._compileRoute (this.value = route);
		},
	
		/**
		**	Transforms the specified route expression into a regular expression and a set of parameter
		**	names and stores them in the 'param' array.
		**
		**	>> void _compileRoute (string route);
		*/
		_compileRoute: function (route)
		{
			this.params = [];
	
			while (true)
			{
				var m = /:([!@A-Za-z0-9_-]+)/.exec(route);
				if (!m) break;
	
				route = route.replace(m[0], "([^/]+)");
				this.params.push (m[1]);
			}
	
			this.routeRegex = "^" + route.replace(/##/g, "");
		},
	
		/**
		**	Adds a handler to the route dispatcher. The handler can be removed later using removeHandler and
		**	specifying the same parameters. If unrouted boolean is specified the event to listen to will be
		**	the unrouted event (when the route changes and the route is not activated).
		**
		**	void addHandler (handler: function, unrouted: bool);
		*/
		addHandler: function (handler, unrouted)
		{
			this.addEventListener ((unrouted === true ? "un" : "") + "routed", handler, null);
		},
	
		/**
		**	Removes a handler from the route dispatcher.
		**
		**	void removeHandler (handler: function, unrouted: bool);
		*/
		removeHandler: function (handler, unrouted)
		{
			this.removeEventListener ((unrouted === true ? "un" : "") + "routed", handler, null);
		},
	
		/**
		**	Verifies if the specified route matches the internal route and if so dispatches a "routed"
		**	event with the obtained parameters to all attached handlers.
		**
		**	bool dispatch (route: string);
		*/
		dispatch: function (route)
		{
			var matches = route.match (this.routeRegex);
			if (!matches)
			{
				this.s_args = null;
	
				if (this.active)
					this.dispatchEvent ("unrouted", { route: this });
	
				return this.active = false;
			}
	
			var args = { route: this };
			var str = "";
	
			for (var i = 0; i < this.params.length; i++)
			{
				args[this.params[i]] = matches[i+1];
				str += "_" + matches[i+1];
			}
	
			this.changed = str != this.s_args;
	
			this.dispatchEvent ("routed", args);
			this.s_args = str;
	
			return this.active = true;
		}
	}),

	/**
	**	Map with route objects. The key of the map is the route and the value a handler.
	*/
	routes: { },

	/**
	**	Sorted list of routes. Smaller routes are processed first than larger ones. This array stores
	**	only the keys to the Router.routes map.
	*/
	sortedRoutes: [ ],

	/**
	**	Indicates the number of times the onLocationChanged handler should ignore the hash change event.
	*/
	ignoreHashchangeEvent: 0,

	/**
	**	Current location.
	*/
	location: "",

	/**
	**	Current location as an array of elements (obtained by splitting the location by slash).
	*/
	args: [],

	/**
	**	Initializes the router global instance.
	**
	**	>> void init ();
	*/
	init: function ()
	{
		if (this.alreadyAttached)
			return;

		this.alreadyAttached = true;

		if ('onhashchange' in globalThis)
			globalThis.onhashchange = this.onLocationChanged.bind(this);
	},

	/**
	**	Refreshes the current route by forcing a hashchange event.
	**
	**	>> void refresh ();
	*/
	refresh: function ()
	{
		this.onLocationChanged();
	},

	/**
	**	Changes the current location and optionally prevents a trigger of the hashchange event.
	**
	**	>> void setRoute (string route[, bool silent]);
	*/
	setRoute: function (route, silent)
	{
		var location = _Router.realLocation (route);
		if (location == this.location) return;

		if (silent) this.ignoreHashchangeEvent++;
		globalThis.location.hash = location;
	},

	/**
	**	Adds the specified route to the routing map.
	**
	**	>> void addRoute (string route, function onRoute);
	**	>> void addRoute (string route, function onRoute, function onUnroute);
	*/
	addRoute: function (route, onRoute, onUnroute)
	{
		if (!this.routes[route])
		{
			this.routes[route] = new _Router.Route (route);
			this.sortedRoutes.push (route);

			this.sortedRoutes.sort (function(a, b) {
				return _Router.routes[a].routeRegex.length - _Router.routes[b].routeRegex.length;
			});
		}

		if (onUnroute !== undefined)
		{
			this.routes[route].addHandler (onRoute, false);
			this.routes[route].addHandler (onUnroute, true);
		}
		else
			this.routes[route].addHandler (onRoute, false);
	},

	/**
	**	Adds the specified routes to the routing map. The routes map should contain the route expression
	**	in the key of the map and a handler function in the value.
	**
	**	>> void addRoutes (routes: map);
	*/
	addRoutes: function (routes)
	{
		for (var i in routes)
		{
			if (!this.routes[i])
			{
				this.routes[i] = new _Router.Route (i);
				this.sortedRoutes.push (i);
			}

			this.routes[i].addHandler (routes[i], false);
		}

		this.sortedRoutes.sort (function(a, b) {
			return _Router.routes[a].routeRegex.length - _Router.routes[b].routeRegex.length;
		});
	},

	/**
	**	Removes the specified route from the routing map.
	**
	**	>> void removeRoute (string route, function onRoute);
	**	>> void removeRoute (string route, function onRoute, function onUnroute);
	*/
	removeRoute: function (route, onRoute, onUnroute)
	{
		if (!this.routes[route]) return;

		if (onUnroute !== undefined)
		{
			this.routes[route].removeHandler (onRoute, false);
			this.routes[route].removeHandler (onUnroute, true);
		}
		else
			this.routes[route].removeHandler (onRoute);
	},

	/**
	**	Removes the specified routes from the routing map. The routes map should contain the route
	**	expression in the key of the map and a handler function in the value.
	**
	**	>> void removeRoutes (routes: map);
	*/
	removeRoutes: function (routes)
	{
		for (var i in routes)
		{
			if (!this.routes[i]) continue;

			this.routes[i].removeHandler (routes[i]);
		}
	},

	/**
	**	Given a formatted location and a previous one it will return the correct real location.
	**
	**	string realLocation (cLocation: string, pLocation: string);
	*/
	realLocation: function (cLocation, pLocation)
	{
		if (!pLocation) pLocation = this.location;
		if (!pLocation) pLocation = " ";

		var state = 0, i = 0, j = 0, k;
		var rLocation = "";

		while (state != -1 && i < cLocation.length && j < pLocation.length)
		{
			switch (state)
			{
				case 0:
					if (cLocation.substr(i++, 1) == "*")
					{
						state = 1;
						break;
					}

					if (cLocation.substr(i-1, 1) != pLocation.substr(j++, 1))
					{
						rLocation += cLocation.substr(i-1);
						state = -1;
						break;
					}

					rLocation += pLocation.substr(j-1, 1);
					break;

				case 1:
					if (cLocation.substr(i, 1) == "*")
					{
						state = 3;
						i++;
						break;
					}

					state = 2;
					break;

				case 2:
					k = pLocation.indexOf(cLocation.substr(i, 1), j);
					if (k == -1)
					{
						rLocation += pLocation.substr(j) + cLocation.substr(i);
						state = -1;
						break;
					}

					rLocation += pLocation.substr(j, k-j);

					state = 0;
					j = k;
					break;

				case 3:
					k = pLocation.lastIndexOf(cLocation.substr(i, 1));
					if (k == -1)
					{
						rLocation += cLocation.substr(i);
						state = -1;
						break;
					}

					rLocation += pLocation.substr(j, k-j);

					state = 0;
					j = k;
					break;
			}
		}

		if (state != -1)
			rLocation += cLocation.substr(i);

		return rLocation.trim();
	},

	/**
	**	Event handler for when the location hash changes.
	*/
	onLocationChanged: function ()
	{
		var cLocation = location.hash.substr(1);
		var rLocation = _Router.realLocation (cLocation);

		if (cLocation != rLocation)
		{
			globalThis.location.replace("#" + rLocation);
			return;
		}

		this.location = cLocation;
		this.args = this.location.split ("/");

		if (this.ignoreHashchangeEvent > 0)
		{
			this.ignoreHashchangeEvent--;
			return;
		}

		for (var i = 0; i < this.sortedRoutes.length; i++)
			this.routes[this.sortedRoutes[i]].dispatch (this.location);
	}
};

_Router.init();
