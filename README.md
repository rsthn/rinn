<br/>

<p align="center">
	<img src="https://img.shields.io/npm/v/rinn?label=version&color=%2300a020&style=flat-square"/>
	<img src="https://img.shields.io/npm/dt/rinn?color=%23a000a0&style=flat-square"/>
	<img src="https://img.shields.io/bundlephobia/min/rinn/latest?color=%2300a0b0&style=flat-square"/>
</p>

<br/>

# Rinn Library

This library provides functionality for classes, models, collections, events, and serialization (with strict schemas) that might not be ground-breaking but are certainly lightweight and pretty useful.

<br/>

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Template](#template)
	- [Template Syntax](#template-syntax)
	- [Template API](#template-api)
	- [Built-in Expression Functions](#built-in-expression-functions)
- [Model](#model)
	- [Defining a Model](#defining-a-model)
	- [Model API](#model-api)
	- [Events](#events)
	- [Constraints](#constraints)

<br/>

## Installation

Use your favorite package manager, or just download the standalone files from the `dist` folder and include it in your `index.html` file.

```sh
pnpm add rinn
```

<br/>

## Getting Started

Documentation can be found in the [`docs`](./docs) folder in this repository. Check out the [`namespace`](./docs/main.md) which holds all available members.

<br/>

## Template

```js
import { Template } from 'rinn';
```

The `Template` module is a small templating engine. Templates are first parsed into a "parts" structure and then expanded against a data object. By default the open/close symbols are square brackets (`[` and `]`), but `parseTemplate` accepts custom delimiters.

### Template Syntax

| Form                           | Example                          | Description                                                                                                                  |
| ------------------------------ | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| HTML-escaped output            | `[data.value]`                   | Looks up `data.value` and HTML-escapes it.                                                                                   |
| Raw output                     | `[!data.value]`                  | Looks up the value without escaping (useful for emitting raw HTML).                                                          |
| Double-quoted escaped output   | `[$data.value]`                  | Escapes HTML and surrounds the result with double quotes.                                                                    |
| Immediate reparse              | `[<...]`, `[@...]`, `"..."`, `'...'` | Reparses the contents as if `parseTemplate` was called again. The `@` form trims and merges lines. Pick the form by content: `[<...]` for HTML bodies (its bracket delimiters let `"`/`'` survive intact in attributes), `'...'`/`"..."` for plain strings, `[@...]` for multi-line strings that should be trimmed/joined. |
| Immediate output (literal)     | `[:...]`                         | Outputs the contents verbatim. Wraps the content in delimiters when the first character is not `<`, `[` or space.            |
| Filtered/function output       | `[functionName arg1 arg2 ...]`   | Calls a registered expression function. Arguments may themselves be templates and are nested freely.                         |

Common control-flow examples:

```js
Template.eval('Hello [name]!', { name: 'World' });
// "Hello World!"

Template.eval('[upper [name]]', { name: 'rinn' });
// "RINN"

Template.eval('[if [eq [n] 1] "one" elif [eq [n] 2] "two" else "many"]', { n: 2 });
// "two"
```

#### Picking the right reparse form

Bare tokens in template body, function args, and `[if]`/`[?]` arms are passed as literal strings — no need to wrap them when there are no spaces:

```js
Template.eval('[eq [x] hello]', { x: 'hello' });           // true
Template.eval('[if [open] is-open]', { open: true });      // "is-open"
Template.eval('[if [eq [n] 1] page else pages]', { n: 2 }); // "pages"
Template.eval('[? [eq [tone] danger] is-danger is-primary]', { tone: 'danger' }); // "is-danger"
```

Use a quoted form (`"..."` / `'...'`) or `[@...]` only when the string contains spaces or substitutions:

```js
Template.eval('[if [ne [name] ""] "Hello [name]!"]', { name: 'Ada' });
// "Hello Ada!"
```

Reserve `[<...]` for **HTML** bodies, where its bracket delimiters keep `"` and `'` literal so attribute quoting works:

```js
const tpl = '[each item [items] [<li class="row" data-id=[$item.id]>[item.name]</li>]]';
```

Don't use `[<...]` for plain strings (`[<is-open]`, `[<page]`, `[<]`) — those would be `is-open`, `page`, `""`. Don't use `\"`/`\'` inside any reparse form; Rinn has no backslash escapes, so the literal backslash will appear in the output.

Building an HTML list with `each`:

```js
const tpl = '<ul>[each i [items] "<li>[i.name] ([i.qty])</li>"]</ul>';

Template.eval(tpl, {
	items: [
		{ name: 'Apples',  qty: 3 },
		{ name: 'Bananas', qty: 5 },
		{ name: 'Cherries', qty: 12 }
	]
});
// <ul><li>Apples (3)</li><li>Bananas (5)</li><li>Cherries (12)</li></ul>
```

The loop variable also exposes `i#` (the key/index) and `i##` (the always-numeric index), so you can render an ordered list with explicit numbering or alternate row classes:

```js
const rows = '<table>[each row [users] "<tr class=\'r-[row##]\'><td>[row##]</td><td>[row.name]</td></tr>"]</table>';

Template.eval(rows, {
	users: [{ name: 'Ada' }, { name: 'Linus' }, { name: 'Grace' }]
});
// <table><tr class='r-0'><td>0</td><td>Ada</td></tr>...</table>
```

Set `Template.strict = true` to throw when an expression function is referenced but not registered.

### Template API

#### `parse` (template: *string*) &rarr; *array*

Parses a template using the default `[` / `]` delimiters and returns the compiled parts structure consumed by `expand`.

#### `parseTemplate` (template: *string*, sym_open: *char*, sym_close: *char*, is_tpl: *bool* = `false`) &rarr; *array*

Parses a template using custom open/close characters. Use this when the default brackets clash with the surrounding text.

#### `clean` (parts: *array*) &rarr; *array*

Removes all static parts from a parsed template, leaving only dynamic ones. Mutates and returns the same array.

#### `expand` (parts: *array*, data: *object*, ret: *string* = `'text'`, mode: *string* = `'base-string'`) &rarr; *string|array*

Expands a previously parsed template against `data`. The `ret` parameter selects the return shape:

- `'text'` &mdash; concatenated string output (default).
- `'obj'` &mdash; an array with the raw expanded values, preserving non-string types.
- `'arg'` &mdash; the single expanded argument (when only one), otherwise the joined string. Used internally to pass arguments into expression functions.
- `'last'` &mdash; only the last produced value.
- `'void'` &mdash; expand for side effects only and return `null`.

#### `compile` (template: *string*) &rarr; *function*

Parses the template once and returns a function `(data, mode) => string` that can be called repeatedly with different data.

```js
const renderList = Template.compile('<ul>[each i [items] "<li>[i]</li>"]</ul>');
renderList({ items: ['one', 'two', 'three'] });
// "<ul><li>one</li><li>two</li><li>three</li></ul>"
```

#### `eval` (template: *string*, data: *object* = `null`, mode: *string* = `'text'`) &rarr; *any*

Convenience helper that parses and immediately expands a template.

#### `value` (parts: *string|array*, data: *object* = `null`) &rarr; *any*

If `parts` is already a string it is returned as-is; otherwise it is expanded with `ret = 'arg'`. Useful inside custom expression functions.

#### `register` (name: *string*, fn: *function*) &rarr; *void*

Registers a new expression function. The signature depends on the name:

- Names that **do not** start with `_` receive `(args, parts, data)`, where `args` is the list of pre-expanded arguments (`args[0]` is the function name).
- Names that **start with** `_` receive only `(parts, data)` and must expand each argument manually with `Template.expand` or `Template.value`. This is needed for control-flow constructs (`_if`, `_each`, `_set`, `_repeat`, ...) that decide whether and how to evaluate their arguments.

```js
Template.register('shout', (args) => args[1].toString().toUpperCase() + '!');
Template.eval('[shout hi]'); // "HI!"
```

#### `call` (name: *string*, args: *array*, data: *object* = `null`) &rarr; *any*

Invokes a registered expression function directly from JavaScript code, without going through the parser.

#### `getNamedValues` (parts: *array*, data: *object*, i: *int* = `1`, expanded: *bool* = `true`) &rarr; *object*

Builds a map from a parts array of the form `name: value` (or `:name value`). Used by the `&` and `&&` builtins; also handy from custom functions.

### Built-in Expression Functions

> **Note:** the *Result* columns below show the raw return value, i.e. what `Template.eval(template, data, 'arg')` produces. In default `'text'` mode the value is coerced to a string and concatenated with surrounding parts. Also keep in mind that bare tokens inside a template (e.g. `0`, `3.7`) are parsed as identifiers and reach functions as **strings**; use quoted forms (`"3.7"`) or coercion functions (`[int ...]`, `[false]`) to obtain typed values.

#### Type and Conversion

| Function | Example | Result |
| -------- | ------- | ------ |
| `global` | `[typeof [global]]` | `"object"` (returns `globalThis`) |
| `null`   | `[null]` | `null` |
| `true`   | `[true]` | `true` |
| `false`  | `[false]` | `false` |
| `len`    | `[len hello]` | `5` |
| `int`    | `[int "3.7"]` | `3` |
| `str`    | `[str 42]` | `"42"` |
| `float`  | `[float "3.14"]` | `3.14` |
| `chr`    | `[chr 65]` | `"A"` |
| `ord`    | `[ord A]` | `65` |
| `typeof` | `[typeof [# 1 2]]` | `"array"` |

#### Logic and Comparison

The `?`-suffixed forms (`eq?`, `ne?`, ...) are aliases meant for predicate-style reading.

| Function | Example | Result |
| -------- | ------- | ------ |
| `not`        | `[not [false]]` | `true` |
| `neg`        | `[neg 5]` | `-5` |
| `abs`        | `[abs -5]` | `5` |
| `and`        | `[and [true] [true] [false]]` | `false` |
| `or`         | `[or [false] [false] [true]]` | `true` |
| `eq` / `eq?` | `[eq 1 1]` | `true` |
| `ne` / `ne?` | `[ne 1 2]` | `true` |
| `lt` / `lt?` | `[lt 1 2]` | `true` |
| `le` / `le?` | `[le 2 2]` | `true` |
| `gt` / `gt?` | `[gt 3 2]` | `true` |
| `ge` / `ge?` | `[ge 3 3]` | `true` |
| `isnull` / `null?`       | `[isnull [null]]` | `true` |
| `isnotnull` / `notnull?` | `[isnotnull 1]` | `true` |
| `iszero` / `zero?`       | `[iszero 0]` | `true` (input is coerced via `parseInt`) |

#### Arithmetic

All arithmetic functions are variadic and reduce left-to-right.

| Function | Example | Result |
| -------- | ------- | ------ |
| `+` / `sum` | `[+ 1 2 3]` | `6` |
| `-` / `sub` | `[- 10 3 2]` | `5` |
| `*` / `mul` | `[* 2 3 4]` | `24` |
| `/` / `div` | `[/ 24 2 3]` | `4` |
| `mod`       | `[mod 10 3]` | `1` |
| `pow`       | `[pow 2 8]` | `256` |

#### Strings and Arrays

| Function | Example | Result |
| -------- | ------- | ------ |
| `trim`    | `[trim "  hi  "]` | `"hi"` |
| `upper`   | `[upper hello]` | `"HELLO"` |
| `lower`   | `[lower HELLO]` | `"hello"` |
| `substr`  | `[substr 0 3 hello]` | `"hel"` |
| `substr`  | `[substr -3 hello]` | `"llo"` |
| `replace` | `[replace foo bar foobaz]` | `"barbaz"` |
| `nl2br`   | `[nl2br "a\nb"]` | `"a<br/>b"` |
| `join`    | `[join ", " [# 1 2 3]]` | `"1, 2, 3"` |
| `split`   | `[split , "a,b,c"]` | `["a","b","c"]` |
| `keys`    | `[keys [& :a 1 :b 2]]` | `["a","b"]` |
| `values`  | `[values [& :a 1 :b 2]]` | `[1,2]` |
| `%`       | `[% li hello]` | `"<li>hello</li>"` |
| `%%`      | `[%% a href "/" "click"]` | `"<a href=\"/\">click</a>"` |
| `dump`    | `[dump [# 1 2]]` | `'["1","2"]'` (list elements are strings — see note above) |

#### Variables

| Function | Example | Result |
| -------- | ------- | ------ |
| `set`   | `[set x 5][x]` | `"5"` |
| `unset` | `[set x 5][unset x][isnull [x]]` | `"true"` |

#### Control Flow

```js
// if / elif / else
Template.eval('[if [eq [n] 1] one elif [eq [n] 2] two else many]', { n: 2 });
// "two"

// ? ternary
Template.eval('[? [eq 1 1] yes no]'); // "yes"

// ?? null-coalescing (returns first non-empty value)
Template.eval('[?? "" fallback]'); // "fallback"

// switch
Template.eval('[switch [n] 1 one 2 two default many]', { n: 3 }); // "many"

// each — iterates and concatenates output
Template.eval('<ul>[each i [items] "<li>[i]</li>"]</ul>', { items: ['a', 'b'] });
// "<ul><li>a</li><li>b</li></ul>"

// foreach — like each but produces no output (use for side effects)
Template.eval('[foreach i [items] [echo [i]]]', { items: ['a', 'b'] });
// logs "a" and "b" to the console; returns null

// map — transform an array/map into a new one. Use 'arg' mode to keep the array.
Template.eval('[map i [# 1 2 3] [* [i] [i]]]', null, 'arg'); // [1, 4, 9]

// filter — keep entries where the template evaluates truthy
Template.eval('[filter i [# 1 2 3 4] [gt [i] 2]]', null, 'arg'); // ["3", "4"]

// repeat — repeat and collect outputs into an array
Template.eval('[repeat i from 1 to 3 [i]]', null, 'arg'); // [1, 2, 3]

// loop / break / continue
Template.eval('[set n 0][loop [set n [+ [n] 1]][if [ge [n] 3] [break]]][n]');
// "3"
```

> The `for` builtin (variant of `repeat` that doesn't collect output) is currently broken in the source; use `foreach` or `repeat` instead.

#### Collections and Calls

```js
// # — build a list (arguments expanded; values arrive as strings)
Template.eval('[# a b c]', null, 'arg'); // ["a", "b", "c"]

// ## — list of unexpanded parts (rarely used directly; preserves templates)
// Useful when you want to defer evaluation of arguments.

// & — build an object/map (arguments expanded)
Template.eval('[& :name Ada :role admin]', null, 'arg'); // { name: "Ada", role: "admin" }

// && — same, but values are kept as unexpanded parts.

// contains — does the map contain ALL listed keys?
Template.eval('[contains [m] a b]', { m: { a: 1, b: 2 } }, 'arg'); // true

// has — does the map contain a single key?
Template.eval('[has a [& :a 1]]', null, 'arg'); // true

// expand — re-expand a string template using {curly} delimiters
Template.eval('[expand "Hi {name}!" [& :name World]]'); // "Hi World!"

// call — invoke a JS function from data (varargs)
Template.eval('[call obj.greet World]', {
	obj: { greet: (who) => 'Hello ' + who }
}); // "Hello World"

// echo — write to the console (returns "")
Template.eval('[echo debug [n]]', { n: 7 }); // logs "debug 7"
```

See the source of `Template.functions` in `src/template.js` for the exact signature of each.

<br/>

## Model

The `Model` class (`src/model.js`) is a high-integrity data object built on top of `EventDispatcher`. It stores properties, dispatches change events and &mdash; optionally &mdash; validates each write against per-field constraints.

### Defining a Model

```js
import Rinn from 'rinn';

const User = Rinn.Model.extend({
	className: 'User',

	defaults: {
		name: '',
		age: 0,
		tags: []
	},

	constraints: {
		name: { type: 'string', required: true, minlen: 1, maxlen: 64 },
		age:  { type: 'int', minval: 0, maxval: 150 },
		tags: { type: 'array' }
	}
});

const u = new User({ name: 'Ada', age: 36 });
u.set('age', 37);
u.get('name'); // "Ada"
```

`defaults` may be either a plain object or a function returning one (for dynamic defaults per instance). `constraints` is a map of `{ propertyName: { constraintName: value, ... } }`.

### Model API

#### `__ctor` (data: *object*, defaults: *object*, constraints: *object*)

Initializes the instance. `defaults` and `constraints` override the prototype-level definitions for this instance only.

#### `reset` (defaults: *object*, nsilent: *bool* = `true`) &rarr; *Model*

Resets the data to the default state. If `defaults` is a function it is invoked to produce a fresh map. Pass `false` to suppress events.

#### `init` () / `ready` () &rarr; *void*

Override-points called before and after initial property assignment. Both are no-ops by default.

#### `silent` (value: *bool*) &rarr; *Model*

Increments/decrements a silent-mode counter. While silent, no events are dispatched.

#### `set` (name: *string*, value: *any*, force: *bool* = `false`) &rarr; *Model*
#### `set` (data: *object*, force: *bool* = `false`) &rarr; *Model*

Writes one property or a batch of properties. By default unchanged values are skipped; pass `force = true` to dispatch events anyway. Triggers `propertyChanging`, `propertyChanged.<name>`, `propertyChanged` and a final `modelChanged` once the outermost `set` returns.

#### `has` (name: *string*) &rarr; *bool*

Returns whether `name` exists on the model.

#### `get` () &rarr; *object*
#### `get` (true) &rarr; *object*
#### `get` (name: *string*, def?: *any*) &rarr; *any*

`get()` returns the raw data map. `get(true)` returns the *flattened* map (constraint-aware, see `flatten`). `get(name)` returns one property; if `def` is supplied it is used when the property is `undefined`.

#### `getInt` / `getFloat` / `getBool` (name: *string*, def?: *any*) &rarr; *number|bool*

Typed accessors. `getBool` recognises `"true"`/`"false"` strings as well as numbers.

#### `getReference` (name: *string*) &rarr; *{ get, set }*

Returns a tiny object with `get()`/`set(value)` bound to one property &mdash; convenient for two-way binding.

#### `constraint` (field: *string*, constraint: *string*, value: *any*) &rarr; *Model*
#### `constraint` (field: *string*, constraint: *object*) &rarr; *Model*
#### `constraint` (constraints: *object*) &rarr; *Model*
#### `constraint` (field: *string*) &rarr; *object*

Reads or mutates the constraint map. When mutating, the prototype-level constraints are cloned on first write so other instances are unaffected.

#### `flatten` (safe: *bool* = `false`) &rarr; *object*

Returns a compact copy containing only properties that are present in `defaults` (or `constraints`). Nested models and arrays of models are flattened recursively. Returns `{}` if the model is non-compliant. With `safe = true` a `class` field is added with the original `classPath`.

#### `remove` (name: *string|array*, nsilent: *bool* = `true`) &rarr; *void*

Deletes one or more properties and dispatches `propertyRemoved`.

#### `update` (fields?: *string|array|true*, direct: *bool* = `false`) &rarr; *Model*

Re-fires change events for the given properties (or for all of them when no argument is provided). Useful after mutating an object/array property in place. Pass `true` to force `modelChanged` even when no fields actually changed.

#### `validate` (fields?: *string|array*) &rarr; *Model*

Re-runs the configured constraints over the given fields (or over the whole data when omitted) by calling `_set` again, which can normalise/coerce values and emit `constraintError` events.

#### `isCompliant` () &rarr; *bool*

Returns `true` if every property currently passes its constraints.

#### `observe` / `unobserve` (property: *string*, handler: *function*, context?: *object*) &rarr; *void*

Attach/detach a handler to `propertyChanged.<property>`.

#### `watch` / `unwatch` (property: *string*, handler?: *function*) &rarr; *void*

A higher-level form of `observe` that calls `handler(value, args, evt)` with the new value first. The property name may include an event namespace prefix `<namespace>:<property>`.

#### `trigger` (name: *string*, value: *any* = `null`) &rarr; *Model*

Force-sets a property and emits change events even when the new value is identical to the old one.

#### `toString` () &rarr; *string*

Serialises the flattened model via `Rinn.serialize`.

### Events

Models emit the following events (handlers are `(evt, args)` from `EventDispatcher`):

| Event | Args | When |
| ----- | ---- | ---- |
| `propertyChanging` | `{ name, old, value, level }` | Just before a property is written. Returning `false` from a handler aborts the subsequent `propertyChanged` events for that write. |
| `propertyChanged.<name>` | `{ name, old, value, level }` | After the named property is written. |
| `propertyChanged` | `{ name, old, value, level }` | After any property is written. |
| `modelChanged` | `{ fields }` | Once all nested `set` calls finish, listing the changed fields. |
| `propertyRemoved` | `{ fields }` | After `remove`. |
| `constraintError` | `{ constraint, message, name, value }` | When a constraint throws while writing. The original value is preserved. |

### Constraints

Constraints (`src/model-constraints.js`) are evaluated in declaration order. Each handler receives `(model, ctval, name, value)` and may return a normalised value or throw &mdash; throwing `"stop"` ends the chain successfully, throwing `"ignore"` keeps the previous value, and any other throw fires a `constraintError`.

| Constraint | Purpose |
| ---------- | ------- |
| `type` | Validates and coerces to `int`, `float`, `string`, `bit`, `array` or `bool`. Throws on failure. |
| `cast` | Same as `type`, but throws `"ignore"` on failure so the previous value is retained. |
| `model` | The value must be (or be coerced into) an instance of the given `Model` subclass. |
| `cls` | The value must be (or be coerced into) an instance of the given class. |
| `arrayof` | Each array element must be of the given class (use after `type: 'array'`). |
| `arraynull` | When `false`, no array element may be `null`. Use `{ value, remove: true }` to drop nulls instead of failing. |
| `arraycompliant` | Each array element (if a `Model`) must `isCompliant()`. Same `{ value, remove }` shape as above. |
| `required` | Value must be present and non-empty. With a falsy `ctval` a missing value just stops further validation. |
| `minlen` / `maxlen` | Bounds on the string length of the value. |
| `minval` / `maxval` | Numeric bounds on the value. |
| `mincount` / `maxcount` | Bounds on the length of an array value. |
| `pattern` | Regex check against a named regex from `Model.Regex`. |
| `inset` | Value must be one of an array of options or a `|`-separated string. |
| `upper` / `lower` | Coerces the value to upper/lower case when the constraint value is truthy. |

`ctval` may also be a reference string: `#prop` reads another property from the model, `@field` reads a field from the model object itself, and any other string is `eval`'d. This is handled by the internal `_getref` helper and is recognised by `model`, `cls` and `arrayof`.
