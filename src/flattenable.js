/*
**	rinn/flattenable.js
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

/**
**	Class used to add flattening and unflattening capabilities to any object. A "flat" object is an object composed
**	only of native types, that is: `null,` `boolean`, `integer`, `number`, `array` or `object`.
*/

export default Class.extend
({
	/**
	**	Name of the class.
	*/
	className: "Flattenable",

	/**
	**	Type schema used to flatten/unflatten the contents of this class. See Schema class for more information.
	*/
	typeSchema: null,

	/**
	**	Returns the flattened contents of the object.
	*/
	flatten: function (context)
	{
		return this.typeSchema.flatten(this, context);
	},

	/**
	**	Unflattens the given object and overrides the local contents.
	*/
	unflatten: async function (value, context)
	{
		Object.assign(this, await this.typeSchema.unflatten(value, context));
		await this.onUnflattened();
		return this;
	},

	/*
	**	Executed when the unflatten() method is called on the object.
	*/
	onUnflattened: async function ()
	{
	}
});
