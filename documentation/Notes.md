ViewController implements EventEmitter

FormView
 .addField
 .removeField
 .getData
 .validate
 .on('submit'); // the view bubbles events up to the formviewcontroller

TableView
 .view = instance of TableView


Event Emitters:

ViewEventEmitter extends 
 HtmlEventEmitter extends
  PropagatingEventEmitter extends
   EventEmitter

Events:

PropagatingEvent
 HtmlDocumentEvent
 HtmlNodeEvent
  HtmlElementEvent
   ViewEvent
    // all events
    http://www.w3schools.com/jsref/dom_obj_event.asp
    KeyboardEvent

 
Very useful events:
http://api.jquerymobile.com/1.3/category/events/




HtmlDocumentEvent
 load
 ready

ClipboardEvent identifiers:
 clipboard.copy
 clipboard.cut
 clipboard.paste

CompositionEvent identifiers:
 composition.start
 composition.end
 composition.update 

KeyboardEvent identifiers:
 keyboard.key.[keyIdentifier].down
 keyboard.key.[keyIdentifier].press
 keyboard.key.[keyIdentifier].up

 keyboard.key.enter.up
 keyboard.key.enter.down+keyboard.key.shift.down
 keyboard.key.shift.down+mouse.button.1.click.down

KeyboardEvent properties:
otherPressedKeys - an array of other keys pressed
boolean altKey
number charCode
boolean ctrlKey
boolean getModifierState(key)
string key
number keyCode
string locale
number location
boolean metaKey
boolean repeat
boolean shiftKey
number which

FocusEvent
 focus
 blur

FormEvent
 change
 input
 submit

MouseEvent - just use click not tap. tap events cause clicks anyway
Press is a good one for both tap and click
I need to reconcile this with touch events
Should I converge mouse events and touch events?
Maybe I should keep them separate as they are entirely different things
Compare Mouse Events to Touch Events to see if there is overlap
 https://api.jquery.com/category/events/mouse-events/
 click
 contextMenu -> this is a right click? can this be activated without mouse? if so, this is just an HtmlNodeEvent or HtmlElementEvent
 doubleClick
 onDrag
 onDragEnd
 onDragEnter
 onDragExit
 onDragLeave
 onDragOver
 onDragStart
 onDrop
 onMouseDown
 onMouseEnter - does not propagate?
 onMouseLeave - does not propagate?
 onMouseMove
 onMouseOut
 onMouseOver
 onMouseUp
 wheel

wheel data
number deltaMode
number deltaX
number deltaY
number deltaZ

boolean altKey
number button
number buttons
number clientX
number clientY
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
number pageX
number pageY
DOMEventTarget relatedTarget
number screenX
number screenY
boolean shiftKey
string data

SelectionEvent
 select

TouchEvent
 This is pretty amazing
 http://hammerjs.github.io/
 touch.cancel
 touch.end
 touch.move
 touch.start

ViewEvent
 scroll

number detail
DOMAbstractView view

MediaEvent
 media.abort
 media.canPlay
 media.canPlayThrough
nAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend onTimeUpdate onVolumeChange onWaiting

ImageEvent
 load
 error



HtmlNodeEvent

HtmlDocumentEvent - WindowEvent

Possible event properties:

boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
DOMEventTarget target
number timeStamp
string type




currentTarget - The current DOM element within the event bubbling phase.
data - optional data
delegateTarget - where the event was attached
isDefaultPrevented - whether or not preventDefault() has been called
isImmediatePropagationStopped - Returns whether event.stopImmediatePropagation() was ever called on this event object.
event.isPropagationStopped() - Returns whether event.stopPropagation() was ever called on this event object.
event.metaKey - Indicates whether the META key was pressed when the event fired.
event.namespace - The namespace specified when the event was triggered.


event.pageX - The mouse position relative to the left edge of the document.
event.pageY - The mouse position relative to the top edge of the document.
event.preventDefault() - If this method is called, the default action of the event will not be triggered.
event.relatedTarget - The other DOM element involved in the event, if any.
event.result - The last value returned by an event handler that was triggered by this event, unless the value was undefined.
event.stopImmediatePropagation() - Keeps the rest of the handlers from being executed and prevents the event from bubbling up the DOM tree.
event.stopPropagation() - Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event.
event.target - The DOM element that initiated the event.
event.timeStamp - The difference in milliseconds between the time the browser created the event and January 1, 1970.
event.type - Describes the nature of the event.
event.which - For key or mouse events, this property indicates the specific key or button that was pressed.


 domNodeEvent
 
 targetHtmlNode
 relatedTargetHtmlNode
 pageX
 pageY
 which
 metaKey
 altKey
 bubbles
 button
 buttons, cancelable, char, charCode, clientX, clientY, ctrlKey, currentTarget, data, detail, eventPhase, key, keyCode, metaKey, offsetX, offsetY, originalTarget, pageX, pageY, relatedTarget, screenX, screenY, shiftKey, target, toElement, view, which


KeyboardEvent


Tasks:
benchmark and optimize eventemitters
benchmark and optimize mounting htmldocument to the dom



















