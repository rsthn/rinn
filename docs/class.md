# Class

Base class used to easily create classes and sub-classes with complex multiple inheritance and support for calls to parent methods.

> **Note:** This was created before ES6 classes were introduced, and has been maintained for backwards compatibility with other libraries relying on this functionality. However if you would like to use ES6 classes, feel free.

<br/>



## Attributes

#### _super: *object*

Contains the methods of each of the super classes. For example, to call method `getValue` of a parent class named `Base` you would use something like:

```js
console.log( myInstance._super.Base.getValue() );
```



<br/>

#### className: *string*

Name of the class, if none specified the class will be considered "final" and will not be inheritable.



<br/>

## Methods

<br/>


### `__ctor` ()

Class constructor, should initialize the state of the instance. Invoked when the `new` keyword is used with the class.

Ensure the parent constructors are called as well when using derived classes, because that is not automatic.



<br/>

### `__dtor` ()

Class destructor, should clear the instance state and release any used resources, invoked when the global `dispose` function is called with the instance as parameter.

Ensure you call the parent destructors when required because that is not automatic.



<br/>

### `isInstanceOf` (className: *string*) &rarr; *bool*
### `isInstanceOf` (classConstructor: *constructor*) &rarr; *bool*
### `isInstanceOf` (classInstance: *object*) &rarr; *bool*

Returns true if the object is an instance of the specified class (verifies inheritance), the `class` parameter can be a class name, a class constructor or a class instance, in any case the appropriate checks will be done.



<br/>

### `inherit` (classConstructor: *constructor*) &rarr; *constructor*
### `inherit` (obj: *object*) &rarr; *constructor*

Extends the class with the specified prototype. The prototype can be a function (class constructor) or an object. Note that the class will be modified (and returned) instead of creating a new class. Must be called at the class-level (**not** instance level). When a class is provided all fields starting with uppercase at the class-level will not be inherited, this is used to create constants on classes without having them to be copied to derived classes.



<br/>

### `extend` (protos: *object|constructor...*) &rarr; *constructor*

Creates a new class with the specified prototypes each of which can be a class constructor or an object.



<br/> 

### `create` (proto: *object|constructor*) &rarr; *object*

Creates a new instance of a class resulting from extending the self class with the specified prototype (or class constructor). Literal equivalent of calling:

```js
return new (this.extend (proto)) ();
```
