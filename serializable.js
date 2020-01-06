/*
**	rin/serializable
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
**	Serializable class used to allow serialization and deserialization of any object.
*/

module.exports = Class.extend
({
	/**
	**	Name of the class.
	*/
	className: "Serializable",

	/**
	**	Initializes the object with the specified options. If the options map is a string it will be first deserialized prior to initialization.
	*/
	__ctor: function (opts, isflat)
	{
		if (Rin.typeOf(opts) == "string")
		{
			opts = Rin.deserialize(opts);
			isflat = true;
		}

		if (isflat === true)
			opts = this.unflatten(opts);

		this.init (opts ? opts : { });
	},

	/**
	**	Initializes the object with the specified options.
	*/
	init: function (opts)
	{
		if (opts) Rin.override (this, opts);
	},

	/**
	**	Returns a string representing the flattened object.
	*/
	serialize: function ()
	{
		return Rin.serialize(this.flatten());
	},

	/**
	**	Returns a flattened version of the object.
	*/
	flatten: function ()
	{
		return { };
	},

	/**
	**	Unflattens the given object to be later fed to the init() function.
	*/
	unflatten: function (o)
	{
		// Override in derived class if required.
		return o;
	}
});
