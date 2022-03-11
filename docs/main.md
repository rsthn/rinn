# Rinn Namespace

Contains all the classes and definitions of the library, can accessed using the global 'Rinn' or 'rinn' object if you're using the browser version, or by importing it as follows from node:

```js
const Rinn = require('rinn');
```

<br/>

## Classes

- [Class](./class.md)
- [Event](./event.md)
- [EventDispatcher](./eventdispatcher.md)
- [Model](./model.md)
- [Model.List](./model-list.md)
- [Schema](./schema.md)
- [Flattenable](./flattenable.md)
- [Collection](./collection.md)
- [Template](./template.md)



<br/>

## Methods

### `invokeLater` (fn: *function*) &rarr; *void*

Invokes the specified function 'fn' 10ms later.



<br/>

### `typeOf` (o: *any*) &rarr; *string*

Returns the type of an element 'o', properly detects 'array' and 'null'. The return string is always in lowercase.



<br/>

### `isArrayOrObject` (o: *any*) &rarr; *bool*

Returns a boolean indicating if the type of the element is an array or an object.



<br/>

### `clone` (element: *any*) &rarr; *any*

Creates a clone (deep copy) of the specified element. The element can be an array, an object or a primitive type.



<br/>

### `merge` (elems: *object|array...*) &rarr; *object|array*

Merges all given elements into the first one, object fields are cloned.



<br/>

### `override` (output: *object*, objs: *object...*) &rarr; *object*

Assigns all fields from the specified objects into the first one, and returns the first object.



<br/>

### `partialCompare` (full: *object*, partial: *object*) &rarr; *bool*

Compares two objects and returns `true` if all properties in "partial" find a match in "full".



<br/>

### `arrayFind` (arr: *array*, o: *object*, getObject: *bool* = `false`) &rarr; *int|object*

Performs a partial search for an object (o) in the specified array and returns its index or `false` if the object was not found. When `getObject` is set to `true` the object will be returned instead of an index, or `null` if not found.



<br/>

### `indexOf` (container: *array*, value: *any*) &rarr; *int*
### `indexOf` (container: *object*, value: *any*) &rarr; *string*

Traverses the given object (or array) attempting to find the index (or key) that does an identical match with the specified value, if not found returns -1, otherwise the index (or key) where the value was found.



<br/>

### `escape` (str: *string*) &rarr; *string*

Escapes a string using HTML entities.



<br/> 

### `ensureTypeOf` (m: *constructor*, o: *object*) &rarr; *object*

Verifies if the specified object is of class `m`, if not it will create a new instance of `m` passing `o` as parameter.



<br/>

### `serialize` (o: *object*) &rarr; *string*

Serializes an object and returns its JSON string representation.



<br/>

### `deserialize` (s: *string*) &rarr; *any*

Deserializes a string in JSON format and returns the result.
