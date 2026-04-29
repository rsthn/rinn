import { Template } from '../src/main.js';

let pass = 0, fail = 0;

function ev(tpl, data=null) { return Template.eval(tpl, data, 'arg'); }
function evText(tpl, data=null) { return Template.eval(tpl, data, 'text'); }

function check(label, actual, expected) {
    const a = JSON.stringify(actual);
    const e = JSON.stringify(expected);
    const ok = a === e;
    if (ok) { pass++; console.log(`OK   ${label} -> ${a}`); }
    else    { fail++; console.log(`FAIL ${label}\n     got:      ${a}\n     expected: ${e}`); }
}

// Type and Conversion (arg mode preserves types)
check('typeof [global]',  ev('[typeof [global]]'), 'object');
check('[null]',           ev('[null]'), null);
check('[true]',           ev('[true]'), true);
check('[false]',          ev('[false]'), false);
check('[len hello]',      ev('[len hello]'), 5);
check('[int "3.7"]',      ev('[int "3.7"]'), 3);
check('[str 42]',         ev('[str 42]'), '42');
check('[float "3.14"]',   ev('[float "3.14"]'), 3.14);
check('[chr 65]',         ev('[chr 65]'), 'A');
check('[ord A]',          ev('[ord A]'), 65);
check('[typeof [# 1 2]]', ev('[typeof [# 1 2]]'), 'array');

// Logic and Comparison
check('[not [false]]',    ev('[not [false]]'), true);
check('[neg 5]',          ev('[neg 5]'), -5);
check('[abs -5]',         ev('[abs -5]'), 5);
check('[and t t f]',      ev('[and [true] [true] [false]]'), false);
check('[or f f t]',       ev('[or [false] [false] [true]]'), true);
check('[eq 1 1]',         ev('[eq 1 1]'), true);
check('[ne 1 2]',         ev('[ne 1 2]'), true);
check('[lt 1 2]',         ev('[lt 1 2]'), true);
check('[le 2 2]',         ev('[le 2 2]'), true);
check('[gt 3 2]',         ev('[gt 3 2]'), true);
check('[ge 3 3]',         ev('[ge 3 3]'), true);
check('[isnull [null]]',  ev('[isnull [null]]'), true);
check('[isnotnull 1]',    ev('[isnotnull 1]'), true);
check('[iszero 0]',       ev('[iszero 0]'), true);

// Arithmetic
check('[+ 1 2 3]',        ev('[+ 1 2 3]'), 6);
check('[- 10 3 2]',       ev('[- 10 3 2]'), 5);
check('[* 2 3 4]',        ev('[* 2 3 4]'), 24);
check('[/ 24 2 3]',       ev('[/ 24 2 3]'), 4);
check('[mod 10 3]',       ev('[mod 10 3]'), 1);
check('[pow 2 8]',        ev('[pow 2 8]'), 256);

// Strings and arrays
check('trim',             ev('[trim "  hi  "]'), 'hi');
check('upper',            ev('[upper hello]'), 'HELLO');
check('lower',            ev('[lower HELLO]'), 'hello');
check('substr 0 3',       ev('[substr 0 3 hello]'), 'hel');
check('substr -3',        ev('[substr -3 hello]'), 'llo');
check('replace',          ev('[replace foo bar foobaz]'), 'barbaz');
check('nl2br',            ev('[nl2br "a\nb"]'), 'a<br/>b');
check('join',             ev('[join ", " [# 1 2 3]]'), '1, 2, 3');
check('split',            ev('[split , "a,b,c"]'), ['a', 'b', 'c']);
check('keys',             ev('[keys [& :a 1 :b 2]]'), ['a', 'b']);
check('values',           ev('[values [& :a 1 :b 2]]'), ['1', '2']);
check('% li',             ev('[% li hello]'), '<li>hello</li>');
check('%% a',             ev('[%% a href "/" "click"]'), '<a href="/">click</a>');
check('dump',             ev('[dump [# 1 2]]'), '["1","2"]');

// Variables (use text mode since `set` returns ''.
check('set/get',          evText('[set x 5][x]'), '5');
check('unset isnull',     evText('[set x 5][unset x][isnull [x]]'), 'true');

// Control flow
check('if/elif/else',     ev('[if [eq [n] 1] one elif [eq [n] 2] two else many]', { n: 2 }), 'two');
check('? ternary',        ev('[? [eq 1 1] yes no]'), 'yes');
check('?? coalesce',      ev('[?? "" fallback]'), 'fallback');
check('switch',           ev('[switch [n] 1 one 2 two default many]', { n: 3 }), 'many');
check('each html',        evText('<ul>[each i [items] "<li>[i]</li>"]</ul>', { items: ['a','b'] }), '<ul><li>a</li><li>b</li></ul>');
check('foreach',          ev('[foreach i [items] [echo [i]]]', { items: ['x','y'] }), null);
check('map',              ev('[map i [# 1 2 3] [* [i] [i]]]'), [1, 4, 9]);
check('filter',           ev('[filter i [# 1 2 3 4] [gt [i] 2]]'), ['3', '4']);
check('repeat',           ev('[repeat i from 1 to 3 [i]]'), [1, 2, 3]);
check('loop break',       evText('[set n 0][loop [set n [+ [n] 1]][if [ge [n] 3] [break]]][n]'), '3');

// Collections and Calls
check('# list',           ev('[# a b c]'), ['a', 'b', 'c']);
check('& dict',           ev('[& :name Ada :role admin]'), { name: 'Ada', role: 'admin' });
check('contains',         ev('[contains [m] a b]', { m: { a: 1, b: 2 } }), true);
check('has',              ev('[has a [& :a 1]]'), true);
check('expand',           ev('[expand "Hi {name}!" [& :name World]]'), 'Hi World!');
check('call',             ev('[call obj.greet World]', { obj: { greet: (who) => 'Hello ' + who } }), 'Hello World');
check('echo',             ev('[echo debug [n]]', { n: 7 }), '');

// Other examples in the README (use default text mode)
check('Hello World',      Template.eval('Hello [name]!', { name: 'World' }), 'Hello World!');
check('upper rinn',       Template.eval('[upper [name]]', { name: 'rinn' }), 'RINN');
check('shopping list',    Template.eval('<ul>[each i [items] "<li>[i.name] ([i.qty])</li>"]</ul>', {
    items: [
        { name: 'Apples',  qty: 3 },
        { name: 'Bananas', qty: 5 },
        { name: 'Cherries', qty: 12 }
    ]
}), '<ul><li>Apples (3)</li><li>Bananas (5)</li><li>Cherries (12)</li></ul>');

const renderList = Template.compile('<ul>[each i [items] "<li>[i]</li>"]</ul>');
check('compile',          renderList({ items: ['one', 'two', 'three'] }), '<ul><li>one</li><li>two</li><li>three</li></ul>');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
