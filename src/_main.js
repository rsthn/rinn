
import _Rinn from './alpha.js';
import _Class from './class.js';
import _Event from './event.js';
import _EventDispatcher from './event-dispatcher.js';
import _Model from './model.js';
import _ModelList from './model-list.js';
import _Schema from './schema.js';
import _Flattenable from './flattenable.js';
import _Collection from './collection.js';
import _Template from './template.js';

export const Rinn = _Rinn;
export const Class = _Class;
export const Event = _Event;
export const EventDispatcher = _EventDispatcher;
export const Model = _Model;
export const ModelList = _ModelList;
export const Schema = _Schema;
export const Flattenable = _Flattenable;
export const Collection = _Collection;
export const Template = _Template;

global.rinn =
{
	Rinn: Rinn,
	Class: Class,
	Event: Event,
	EventDispatcher: EventDispatcher,
	Model: Model,
	ModelList: ModelList,
	Schema: Schema,
	Flattenable: Flattenable,
	Collection: Collection,
	Template: Template,
};
