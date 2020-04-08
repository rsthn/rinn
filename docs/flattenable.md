# Flattenable

Class used to add flattening and unflattening capabilities to any object. A "flat" object is an object composed only of native types, that is: `null,` `boolean`, `integer`, `number`, `array` or `object`.



<br/>

## Attributes

### `typeSchema`: [*Schema*](./schema.md)

Type schema used to flatten/unflatten the contents of this class. See [*Schema*](./schema.md) class for more information.



<br/>

## Methods

### `flatten` (context: *object*) &rarr; *object*
Returns the flattened contents of the object.

<br/>

### `unflatten`: async (value: *object*, context: *object*)
Unflattens the given object and overrides the local contents.

<br/>

### `onUnflattened`: async function ()
Executed when the unflatten() method is called on the object.
