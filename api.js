/*
**	rin/api
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

let base64 = require('base-64');

if (!('fetch' in globalThis))
	var fetch = require('node-fetch');

/**
**	API interface utility functions.
*/

module.exports =
{
	/**
	**	Target URL for all the API requests.
	*/
	apiUrl: "/api",

	/**
	**	Indicates if all request data will be packed into a _req64 parameter instead of individual fields.
	*/
	useReq64: false,

	/**
	**	Number of retries to execute each API call before giving up and invoking error handlers.
	*/
	retries: 1,

	/**
	**	Level of the current request. Used to detect nested requests.
	*/
	_requestLevel: 0,

	/**
	**	Indicates if all API calls should be bundled in a request package. Activated by calling the packageBegin() function and finished with packageEnd().
	*/
	_requestPackage: 0,

	/**
	**	When in package-mode, this contains the package data to be sent upon a call to packageEnd().
	*/
	_packageData: [],

	/**
	**	Overridable filter that processes the response from the server and returns true if it was successful.
	*/
	responseFilter: function (res, req)
	{
		if (res.response == 408 && globalThis.location)
		{
			globalThis.location.reload();
			return false;
		}

		return true;
	},

	/**
	**	Sets the API functions to package-mode and bundles requests together.
	*/
	packageBegin: function ()
	{
		this._requestPackage++;
	},

	/**
	**	Sends a single API request with the currently constructed package and finishes package-mode.
	*/
	packageEnd: function ()
	{
		if (!this._requestPackage)
			return;

		if (--this._requestPackage)
			return;

		this.packageSend();
	},

	/**
	**	Sends a single API request with the currently constructed package and maintains package-mode.
	*/
	packageSend: function ()
	{
		if (!this._packageData.length)
			return;

		let _packageData = this._packageData;
		this._packageData = [];

		var rpkg = "";

		for (var i = 0; i < _packageData.length; i++)
		{
			rpkg += "r"+i+","+base64.encode(this.encodeParams(_packageData[i][2]))+";";
		}

		this._showProgress();

		this.post(
			{ rpkg: rpkg },

			(res, req) =>
			{
				for (let i = 0; i < _packageData.length; i++)
				{
					try
					{
						var response = res["r"+i];
						if (!response)
						{
							if (_packageData[i][1] != null) _packageData[i][1] (_packageData[i][2]);
							continue;
						}

						if (_packageData[i][0] != null)
						{
							if (this.responseFilter (response, _packageData[i][2]))
							{
								_packageData[i][0] (response, _packageData[i][2]);
							}
						}
					}
					catch (e) {
					}
				}
			},

			(req) =>
			{
				for (let i = 0; i < _packageData.length; i++)
				{
					if (_packageData[i][1] != null) _packageData[i][1] (_packageData[i][2]);
				}
			}
		);
	},

	/**
	**	Adds CSS class 'busy' to the HTML root element, works only if running inside a browser.
	*/
	_showProgress: function ()
	{
		if ('document' in globalThis) {
			this._requestLevel++;
			if (this._requestLevel > 0) globalThis.document.documentElement.classList.add('busy');
		}
	},

	/**
	**	Removes the 'busy' CSS class from the HTML element.
	*/
	_hideProgress: function ()
	{
		if ('document' in globalThis) {
			this._requestLevel--;
			if (!this._requestLevel) globalThis.document.documentElement.classList.remove('busy');
		}
	},

	/**
	**	Returns a parameter string for a GET request given an object with fields.
	*/
	encodeParams: function (obj)
	{
		let s = [];

		for (let i in obj)
			s.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));

		return s.join('&');
	},

	/**
	**	Executes an API call to the URL stored in apiUrl.
	*/
	apiCall: function (params, success, failure, type, retries)
	{
		let url = this.apiUrl;

		if (type != 'GET' && type != 'POST')
			type = 'auto';

		if (this._requestPackage)
		{
			this._packageData.push([success, failure, params]);
			return;
		}

		this._showProgress();

		let request = params;
		params = this.encodeParams(params);

		if (type == 'auto' && !this.useReq64 /*&& !(params instanceof FormData)*/)
		{
			type = params.length < 960 ? 'GET' : type;
		}

		if (retries === undefined)
			retries = this.retries;

		if (type == 'auto') type = 'POST';

		if (this.useReq64 /* && !(params instanceof FormData) */)
			params = "_req64=" + base64.encode(params);

		(type == 'GET' ? fetch(url + '?_=' + Date.now() + '&' + params) : fetch(url, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, method: 'POST', body: params }))
		.then(result => result.json())
		.then(result =>
		{
			this._hideProgress();
			if (!success) return

			if (this.responseFilter(result, request))
				success(result, request);
		})
		.catch(err =>
		{
			this._hideProgress();

			if (retries == 0) {
				if (failure) failure(request);
			} else {
				this.apiCall (request, success, failure, type, retries-1);
			}
		});
	},

	/**
	**	Executes a POST API call.
	*/
	post: function (params, success, failure)
	{
		return this.apiCall(params, success, failure, 'POST');
	},

	/**
	**	Executes a GET API call.
	*/
	get: function (params, success, failure)
	{
		return this.apiCall(params, success, failure, 'GET');
	},

	/**
	**	Executes an automatic API call, returns a promise.
	*/
	fetch: function (params)
	{
		return new Promise((resolve, reject) => {
			this.apiCall(params, resolve, reject);
		});
	}
};
