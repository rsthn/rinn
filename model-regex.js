/*
**	rin/model-regex
**
**	Copyright (c) 2013-2020, RedStar Technologies, All rights reserved.
**	https://www.redstar-technologies.com/
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

/**
**	Common regular expressions for pattern validation.
*/

module.exports =
{
	email: /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)+$/i,
	url: /^[\w-]+:\/\/[\w-]+(\.\w+)+.*$/,
	urlNoProt: /^[\w-]+(\.\w+)+.*$/,
	name: /^[-A-Za-z0-9_.]+$/,
	uname: /^['\pL\pN ]+$/,
	text: /^[^&<>{}]*$/,
	utext: /^([\r\n\pL\pN\pS &!@#$%*\[\]()_+=;',.\/?:"~-]+)$/
};
