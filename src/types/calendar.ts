
// id

// A unique string identifier of the event
// resourceIds

// An array of resource IDs that the event is associated with
// allDay

// true or false. Determines if the event is shown in the all-day slot

// start

// JavaScript Date object holding the event’s start time
// end

// JavaScript Date object holding the event’s end time
// title

// Content The text appearing on the event. See Content

// editable

// true, false or undefined. The value overriding the editable setting for this specific event

// startEditable

// true, false or undefined. The value overriding the eventStartEditable setting for this specific event

// durationEditable

// true, false or undefined. The value overriding the eventDurationEditable setting for this specific event

// display

// The rendering type of the event. Can be 'auto' or 'background'

// In addition, in your callback functions, you may get the 'ghost', 'preview' and 'pointer' for this property, which are internal values and are used, for example, to display events during drag-and-drop operations

// backgroundColor

// The eventBackgroundColor override for this specific event

// textColor

// The eventTextColor override for this specific event

// extendedProps

// A plain object holding miscellaneous properties specified during parsing in the explicitly given extendedProps field

//create type based off of above
export type CalendarEvent = {
  id?: string;
  // resourceId: Number;
  resourceIds?: string[];
  allDay?: boolean;
  start: Date | string;
  end: Date | string;
  title: string;
  editable?: boolean;
  startEditable?: boolean;
  durationEditable?: boolean;
  display?: string;
  backgroundColor?: string;
  textColor?: string;
  extendedProps?: any;
  tags?: string[];
};