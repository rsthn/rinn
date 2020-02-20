/*
**	rin/flattenable
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

let Class = require('./class');
let Schema = require('./schema');

/**
**	Flattenable class used to add flattening and unflattening capabilities to any object.
*/

module.exports = Class.extend
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
	**	Returns a flattened contents of the object.
	*/
	flatten: function (context)
	{
		return this.typeSchema.flatten(this, context);
	},

	/**
	**	Unflattens the given object and overrides the local contents.
	*/
	unflatten: function (value, context)
	{
		Object.assign(this, this.typeSchema.unflatten(value, context));
		return this;
	}
});
