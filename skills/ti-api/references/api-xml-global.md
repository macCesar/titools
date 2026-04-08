# Ti.XML & Global API Reference

## Ti.XML
> The top level XML module.  The XML module is used for parsing and processing XML-based content.
> Extends Ti.Module
> Platforms: both
> Type: module

The API for this module is based on the W3C DOM specification.

Android and iOS implement the [DOM Level 2](https://www.w3.org/TR/DOM-Level-2-Core/core.html) specification
with some non-standard extensions, which are documented in the appropriate places.

Both iOS and Android lack DTD support.


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| parseString(xml) | Ti.XML.Document | both | Parses an XML string into a <Titanium.XML.Document> object. |
| serializeToString(node) | String | both | Serializes a [Node](Titanium.XML.Node) object into a string. |


---

## Ti.XML.Attr
> Represents an attribute of an [Element](Titanium.XML.Element).
> Extends Ti.XML.Node
> Platforms: both

Implements the [DOM Level 2 API](https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-637646024) on
Android and iOS.

### Properties (unique: 4/35)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| name | String | — | both | Attribute name |
| ownerElement | Ti.XML.Element | — | both | The <Titanium.XML.Element> to which the attribute belongs. |
| specified | Boolean | — | both | True if this attribute was explicitly given a value in the instance document, f… |
| value | String | — | both | The attribute value as a string. |




---

## Ti.XML.CDATASection
> Used to include blocks of literal text containing characters that would otherwise need to be escaped.
> Extends Ti.XML.Text
> Platforms: both

Implements the [DOM Level 2 API](https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-667469212) on
Android and iOS with some non-standard extensions.




---

## Ti.XML.CharacterData
> An interface extending <Titanium.XML.Node> with a set of attributes and methods for accessing character data in the DOM. Implements the [DOM Level 2 API](https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-FF21A306) on Android and iOS. For reasons of compatibility with the JavaScript engine, text is represented by UTF-8 instead of UTF-16 on Android and iOS.
> Extends Ti.XML.Node
> Platforms: both

### Properties (unique: 2/33)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| data | String | — | both | The character data of the node that implements this interface. Throws an except… |
| length | Number | — | both | The number of characters that are available through data and the substringData … |


### Methods (5)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| appendData(arg) | void | both | Append the string to the end of the character data of the node. Upon success, d… |
| deleteData(offset, count) | void | both | Remove a range of characters from the node. Upon success, data and length refle… |
| insertData(offset, arg) | void | both | Insert a string at the specified offset. Throws an exception if this node is re… |
| replaceData(offset, count, arg) | void | both | Replace the characters starting at the specified offset with the specified stri… |
| substringData(offset, count) | String | both | Extracts a range of data from the node. Throws an exception if offset is negati… |


---

## Ti.XML.Comment
> Represents the contents of an XML comment.
> Extends Ti.XML.CharacterData
> Platforms: both

Implements the [DOM Level 2 API](https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-1728279322) on
Android and iOS with some non-standard extensions.




---

## Ti.XML.DOMImplementation
> The <Titanium.XML.DOMImplementation> interface provides a number of methods for performing operations that are independent of any particular instance of the document object model.Implements the [DOM Level 2 API](https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-102161490) on Android and iOS.
> Extends Ti.Proxy
> Platforms: both


### Methods (3)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| createDocument(namespaceURI, qualifiedName, doctype) | Ti.XML.Document | both | Creates an <Titanium.XML.Document> object of the specified type with its docume… |
| createDocumentType(qualifiedName, publicId, systemId) | Ti.XML.DocumentType | both | Creates an empty <Titanium.XML.DocumentType> node. Entity declarations and nota… |
| hasFeature(feature, version) | Boolean | both | Test if the <Titanium.XML.DOMImplementation> implements a specific feature. |


---

## Ti.XML.Document
> The DOM Document returned from <Titanium.XML.parseString>.
> Extends Ti.XML.Node
> Platforms: both

Implements the [DOM Level 2 API](https://www.w3.org/TR/DOM-Level-2-Core/core.html#i-Document) on
Android and iOS.

As of version 3.1, Android does not truly support DTDs.  A document with a DTD can be
parsed, however it is not validated, its default attributes are not be automatically
added into the DOM tree, and so on.

This has been reported as [Android Issue #7395](http://code.google.com/p/android/issues/detail?id=7395).

### Properties (unique: 3/34)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| doctype | Ti.XML.DocumentType | — | both | An interface to the list of entities that are defined for the document, such as… |
| documentElement | Ti.XML.Element | — | both | Root element of this document. |
| implementation | Ti.XML.DOMImplementation | — | both | [DOMImplementation](Titanium.XML.DOMImplementation) object associated with this… |


### Methods (14)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| createAttribute(name) | Ti.XML.Attr | both | Creates an attribute with the given name. |
| createAttributeNS(namespaceURI, name) | Ti.XML.Attr | both | Creates an attribute with the given name and namespace. |
| createCDATASection(data) | Ti.XML.CDATASection | both | Creates and returns a [CDATASection](Titanium.XML.CDATASection). |
| createComment(data) | Ti.XML.Comment | both | Creates a [Comment](Titanium.XML.Comment) with the supplied string data. |
| createDocumentFragment(—) | Ti.XML.DocumentFragment | both | Creates an empty [DocumentFragment](Titanium.XML.DocumentFragment). |
| createElement(tagName) | Ti.XML.Element | both | Creates an element with the given tag name. |
| createElementNS(namespaceURI, name) | Ti.XML.Element | both | Create a new element with the given namespace and name. |
| createEntityReference(name) | Ti.XML.EntityReference | both | Creates an [EntityReference](Titanium.XML.EntityReference) with the given name. |
| createProcessingInstruction(target, data) | Ti.XML.ProcessingInstruction | both | Creates a processing instruction for inserting into the DOM tree. |
| createTextNode(data) | Ti.XML.Text | both | Creates a text node. |
| getElementById(elementId) | Ti.XML.Element | both | Returns an [Element](Titanium.XML.Element) that has an ID attribute with the gi… |
| getElementsByTagName(tagname) | Ti.XML.NodeList | both | Returns a node list of elements in the document which have the given tag. |
| getElementsByTagNameNS(namespaceURI, localname) | Ti.XML.NodeList | both | Returns a node list of elements in the document which belong to the given names… |
| importNode(importedNode, deep) | Ti.XML.Node | both | Imports a node from another document to this document, without altering or remo… |


---

## Ti.XML.DocumentFragment
> A lightweight document object used as a container for a group of nodes.
> Extends Ti.XML.Node
> Platforms: both

When a `DocumentFragment` is inserted into a DOM tree, children of the `DocumentFragment` are
added, not the `DocumentFragment` itself.

Implements the [DOM Level 2 API](https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-B63ED1A3) on
Android and iOS with some non-standard extensions.




---

## Ti.XML.DocumentType
> Each <Titanium.XML.Document> has a `doctype` attribute whose value is either 'null' or a <Titanium.XML.DocumentType> object.
> Extends Ti.XML.Node
> Platforms: both

This provides an interface to the list of entities that are defined for the document. Implements the
[DOM Level 2 API](https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-412266927) on Android and iOS.

As of version 3.1, Android still does not truly support DTDs.  A document with a DTD can be
parsed, however it is not validated, none of its default attributes will automatically be put
into the tree, etc.  [Google is aware of the issue](http://code.google.com/p/android/issues/detail?id=7395).

### Properties (unique: 6/37)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| entities | Ti.XML.NamedNodeMap | — | both | A <Titanium.XML.NamedNodeMap> containing the general entities, both external an… |
| internalSubset | String | — | both | The internal subset as a string. |
| name | String | — | both | The name of DTD; i.e., the name immediately following the `DOCTYPE` keyword. |
| notations | Ti.XML.NamedNodeMap | — | both | A <Titanium.XML.NamedNodeMap> containing the notations declared in the DTD. Dup… |
| publicId | String | — | both | The public identifier of the external subset. |
| systemId | String | — | both | The system identifier of the external subset. |




---

## Ti.XML.Element
> Represents an element in a DOM document, a <Titanium.XML.Node> defined by a start-tag and end-tag (or an empty tag). Elements may have [attributes](Titanium.XML.Attr) associated with them. Implements the [DOM Level 2 API](https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-745549614) on Android and iOS with some non-standard extensions.
> Extends Ti.XML.Node
> Platforms: both

### Properties (unique: 3/32)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| textContent | String | — | both | Content (value) of all text nodes within this node. |
| text | String | — | both | Content (value) of all text nodes within this node. |
| tagName | String | — | both | The name of the element, as defined by its tag. |


### Methods (15)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| getAttribute(name) | String | both | Retrieves an attribute value by name, returning it as a string. |
| setAttribute(name, value) | void | both | Adds a new attribute. Any attribute with the same name is replaced. Throws an e… |
| removeAttribute(name) | void | both | Removes an attribute by name. If the attribute has a default value, it is immed… |
| getAttributeNode(name) | Ti.XML.Attr | both | Retrieves an attribute value by name, returning it as a <Titanium.XML.Attr> obj… |
| setAttributeNode(newAttr) | Ti.XML.Attr | both | Adds a new attribute. Any attribute with the same `nodeName` as the argument is… |
| removeAttributeNode(oldAttr) | void | both | Removes the specified attribute node. If the removed attribute has a default va… |
| getElementsByTagName(name) | Ti.XML.NodeList | both | Retrieves a <Titanium.XML.NodeList> of all descendant elements with a given tag… |
| getAttributeNS(namespaceURI, localName) | String | both | Retrieves an attribute value by local name and namespace URI, returning it as a… |
| setAttributeNS(namespaceURI, qualifiedName, value) | void | both | Adds a new attribute. Any attribute with the same local name and namespace URI … |
| removeAttributeNS(namespaceURI, localName) | void | both | Removes an attribute by local name and namespace URI. If the attribute has a de… |
| getAttributeNodeNS(namespaceURI, localName) | Ti.XML.Attr | both | Retrieves an attribute value by local name and namespace URI, returning it as a… |
| setAttributeNodeNS(newAttr) | Ti.XML.Attr | both | Adds a new attribute. Any attribute with the same local name and namespace URI … |
| getElementsByTagNameNS(namespaceURI, localName) | Ti.XML.NodeList | both | Retrieves a <Titanium.XML.NodeList> of all descendant elements with a given loc… |
| hasAttribute(name) | Boolean | both | Determines whether or not an attribute with the given name is available in the … |
| hasAttributeNS(namespaceURI, localName) | Boolean | both | Determines whether or not an attribute with the given name is available in the … |


---

## Ti.XML.Entity
> This interface represents an entity, either parsed or unparsed, in an XML document. Note that this models the entity itself not the entity declaration. The nodeName attribute that is inherited from Node contains the name of the entity. An Entity node does not have any parent. Implements the [DOM Level 2 API](https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-527DCFF2) on Android and iOS.
> Extends Ti.XML.Node
> Platforms: both

### Properties (unique: 3/34)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| notationName | String | — | both | For unparsed entities, the name of the notation for the entity. For parsed enti… |
| publicId | String | — | both | The public identifier associated with the entity, if specified. If the public i… |
| systemId | String | — | both | The system identifier associated with the entity, if specified. If the system i… |




---

## Ti.XML.EntityReference
> Represents an XML entity reference.
> Extends Ti.XML.Node
> Platforms: both

Implements the [DOM Level 2 API](https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-11C98490)
on Android and iOS.




---

## Ti.XML.NamedNodeMap
> A key-value paired map that maps String objects to <Titanium.XML.Node> objects. Implements the [DOM Level 2 API](https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-1780488922) on Android and iOS.
> Extends Ti.Proxy
> Platforms: both

### Properties (unique: 1/4)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| length | Number | — | both | The number of nodes in the map. The valid range of child node indices is 0-`len… |


### Methods (7)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| getNamedItem(name) | Ti.XML.Node | both | Retrieves a node specified by name. |
| setNamedItem(node) | Ti.XML.Node | both | Adds a node using its `nodeName` attribute. If a node with that name is already… |
| removeNamedItem(name) | Ti.XML.Node | both | Removes a node from the map specified by name. When this map contains attribute… |
| item(index) | Ti.XML.Node | both | Retrieves the node at the specified index of the map. Note that NamedNodeMaps a… |
| getNamedItemNS(namespaceURI, localName) | Ti.XML.Node | both | Retrieves a node specified by name and namespace. Returns `null` if no matching… |
| setNamedItemNS(node) | Ti.XML.Node | both | Adds a node using its `namespaceURI` and `localName` attributes. If a node with… |
| removeNamedItemNS(namespaceURI, localName) | Ti.XML.Node | both | Removes a node from the map specified by local name and namespace URI. When thi… |


---

## Ti.XML.Node
> A single node in the [Document](Titanium.XML.Document) tree.
> Extends Ti.Proxy
> Platforms: both

Implements the [DOM Level 2 API](https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-1950641247)
on Android and iOS.

Note that on iOS, only [Element](Titanium.XML.Element) nodes are mutable. This means
that the methods `appendChild`, `insertBefore`, `removeChild`, and
`replaceChild` only work on `Element` objects. If one of these methods is called on
another type of node, it throws an exception.

### Properties (unique: 16/31)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| nodeName | String | — | both | Name of this node. |
| nodeValue | String | — | both | Content (value) of this node. |
| textContent | String | — | ios | Content (value) of all text nodes within this node. |
| text | String | — | ios | Content (value) of all text nodes within this node. |
| nodeType | Number | — | both | This node's type. One of `ELEMENT_NODE`, `ATTRIBUTE_NODE`, `TEXT_NODE`, `CDATA_… |
| parentNode | Ti.XML.Node | — | both | This node's parent node. |
| childNodes | Ti.XML.NodeList | — | both | A <Titanium.XML.NodeList> of this node's children. |
| firstChild | Ti.XML.Node | — | both | This node's first child. |
| lastChild | Ti.XML.Node | — | both | This node's last child. |
| previousSibling | Ti.XML.Node | — | both | This node's previous sibling. |
| nextSibling | Ti.XML.Node | — | both | This node's next sibling. |
| attributes | Ti.XML.NamedNodeMap | — | both | A map of this node's attributes. |
| ownerDocument | Ti.XML.Document | — | both | This node's owning document. |
| namespaceURI | String | — | both | Namespace URI of this node. |
| prefix | String | — | both | Namespace prefix of this node. |
| localName | String | — | both | Local part of the qualified name of this node. |

### Constants (12)
- **ATTRIBUTE_\***: ATTRIBUTE_NODE
- **CDATA_SECTION_\***: CDATA_SECTION_NODE
- **COMMENT_\***: COMMENT_NODE
- **DOCUMENT_\***: DOCUMENT_NODE
- **DOCUMENT_FRAGMENT_\***: DOCUMENT_FRAGMENT_NODE
- **DOCUMENT_TYPE_\***: DOCUMENT_TYPE_NODE
- **ELEMENT_\***: ELEMENT_NODE
- **ENTITY_\***: ENTITY_NODE
- **ENTITY_REFERENCE_\***: ENTITY_REFERENCE_NODE
- **NOTATION_\***: NOTATION_NODE
- **PROCESSING_INSTRUCTION_\***: PROCESSING_INSTRUCTION_NODE
- **TEXT_\***: TEXT_NODE


### Methods (9)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| appendChild(newChild) | Ti.XML.Node | both | Appends the node `newChild` as a child of this node. |
| cloneNode(deep) | Ti.XML.Node | both | Returns a duplicate of this node. |
| hasAttributes(—) | Boolean | both | Returns `true` if this node has attributes. |
| hasChildNodes(—) | Boolean | both | Returns `true` if this node has child nodes. |
| insertBefore(newChild, refChild) | Ti.XML.Node | both | Inserts the node `newChild` before the node `refChild`. |
| isSupported(feature, version) | Boolean | both | Tests whether the DOM implementation supports a specific feature. |
| normalize(—) | void | android | Normalizes text and attribute nodes in this node's child hierarchy. |
| removeChild(oldChild) | Ti.XML.Node | both | Removes a child node from this node. |
| replaceChild(newChild, oldChild) | Ti.XML.Node | both | Replaces the node `oldChild` with the node `newChild`. |


---

## Ti.XML.NodeList
> A list of <Titanium.XML.Node> objects. Implements the [DOM Level 2 API](https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-536297177) on Android and iOS.
> Extends Ti.Proxy
> Platforms: both

### Properties (unique: 1/4)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| length | Number | — | both | The length of the node list. |


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| item(index) | Ti.XML.Node | both | Returns the <Titanium.XML.Node> object at the specified index. |


---

## Ti.XML.Notation
> Represents a notation declared in the DTD.  Implements the [DOM Level 2 API](https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-5431D1B9) on Android and iOS.
> Extends Ti.Proxy
> Platforms: both

### Properties (unique: 2/5)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| publicId | String | — | both | The public identifier of this notation. If the public identifier was not specif… |
| systemId | String | — | both | The system identifier of this notation. If the system identifier was not specif… |




---

## Ti.XML.ProcessingInstruction
> A way to keep processor-specific information in the text of the document. Implements the [DOM Level 2 API](https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-1004215813) on Android and iOS.
> Extends Ti.Proxy
> Platforms: both

### Properties (unique: 2/5)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| data | String | — | both | Retrieve the content of this processing instruction. This from the first non wh… |
| target | String | — | both | Retrieve the target of this processing instruction. XML defines this as being t… |




---

## Ti.XML.Text
> Represents the textual content of an <Titanium.XML.Element> or <Titanium.XML.Attr> Implements the [DOM Level 2 API](https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-1312295772) on Android and iOS.
> Extends Ti.XML.CharacterData
> Platforms: both

### Properties (unique: 1/33)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| textContent | String | — | both | Content (value) of all text nodes within this node. |


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| splitText(offset) | Ti.XML.Text | both | Breaks this node into two nodes at the specified by offset, and returns a new n… |


---

## Global
> The APIs that reside in the global scope, which may be called without a namespace prefix.
> Extends Object
> Platforms: both
> Type: module

Titanium provides a number of global built-in objects, detailed below.

### String Utilities

Titanium includes several extra utility functions for formatting text, attached to the
global [String](Global.String) object.

### console

Titanium provides [console](Global.Console) support familiar to many JavaScript developers
for logging at the toplevel, in addition to the [Titanium](Titanium.API) logging facilities.

### Timers

Titanium has built-in support for one-off and repeating timers:

*(See full overview in titanium-docs)*

### Properties (unique: 4/16)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| console | Global.Console | — | both | Console logging facilities. |
| global | Global | — | both | Reference to the global object itself. |
| Buffer | buffer.Buffer | — | both | a global reference to the [Buffer](buffer.Buffer) class. |
| process | process | — | both | Reference to the global `process` object. |

### Constants (12)
- **DIST_\***: DIST_ADHOC, DIST_STORE
- **ENV_\***: ENV_DEV, ENV_DEVELOPMENT, ENV_PROD, ENV_PRODUCTION, ENV_TEST
- **OS_\***: OS_ANDROID, OS_IOS
- **OS_VERSION_\***: OS_VERSION_MAJOR, OS_VERSION_MINOR, OS_VERSION_PATCH


### Methods (9)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| alert(message) | void | both | Displays a pop-up alert dialog with the passed in `message`. |
| clearInterval(timerId) | void | both | Cancels an interval timer. |
| clearTimeout(timerId) | void | both | Cancels a one-time timer. |
| decodeURIComponent(encodedURI) | String | both | Replaces each escape sequence in the specified string, created using the `encod… |
| encodeURIComponent(string) | String | both | Replaces each special character in the specified string with the equivalent URI… |
| L(key, hint) | String | both | An alias for [Titanium.Locale.getString](Titanium.Locale.getString). |
| require(moduleId) | any | both | Loads either a native Titanium module or a CommonJS module. |
| setInterval(function, delay) | Number | both | Executes a function repeatedly with a fixed time delay between each call to tha… |
| setTimeout(function, delay) | Number | both | Executes code or a function after a delay. |


### Related Types

#### buffer.Buffer
> The `Buffer` class is a global type for dealing with binary data directly. It can be constructed in a variety of ways.

| Property | Type | Description |
|----------|------|-------------|
| buffer | ArrayBuffer | The underlying `ArrayBuffer` object based on which this `Buffer` object is crea… |
| byteOffset | Number | The `byteOffset` of the `Buffer`s underlying `ArrayBuffer` object. |
| length | Number | Returns the number of bytes in buf. |

#### process
> A Node.js-compatible implementation of the core `process` module

| Property | Type | Description |
|----------|------|-------------|
| arch | String | Returns the operating system CPU architecture for which the binary was compiled… |
| argv | Array<String> | The `process.argv` property returns an array containing the command-line argume… |
| argv0 | String | The `process.argv0` property stores a read-only copy of the original value of `… |
| channel | Object | Always `undefined` in Titanium. |
| config | Object | Always `{}` in Titanium. |
| connected | Boolean | Always `false` in Titanium. |
| debugPort | Number | The port used by the debugger when enabled. |
| env | Object | This is an object whose keys are environment variable names and whose values ar… |
| execArgv | Array<String> | Always `[]` in Titanium. |
| execPath | String | Always `''` in Titanium. |
| exitCode | Number | Unused in Titanium. |
| noDeprecation | Boolean | The `process.noDeprecation` property indicates whether the `--no-deprecation` f… |
| pid | Number | The `process.pid` property returns the PID of the process. Always returns `0` i… |
| platform | String | Equivalent to <Titanium.Platform.osname> |
| ppid | Number | The `process.ppid` property returns the PID of the parent of the current proces… |
| stderr | Object | The `process.stderr` property returns a stream connected to `stderr`. |
| stdout | Object | The `process.stdout` property returns a stream connected to `stdout`. |
| title | String | Equivalent to <Titanium.App.name> |
| throwDeprecation | Boolean | The initial value of `process.throwDeprecation` indicates whether the `--throw-… |
| traceDeprecation | Boolean | The `process.traceDeprecation` property indicates whether the `--trace-deprecat… |
| version | String | Equivalent to <Titanium.version> |
| versions | Object | An object containing version information for included dependencies |

---

## Global.Console
> Console logging facilities.
> Extends Object
> Platforms: both
> Type: module

The toplevel `console` support is intended to supplement <Titanium.API>
and make it easier for developers to port existing JavaScript code
(especially CommonJS modules) to Titanium.

Note that `console` does not currently implement the complete
[Console](https://developer.mozilla.org/de/docs/Web/API/Console) specification.
See the following supported methods for details and submit a pull request to add more!


### Methods (15)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| log(message) | void | both | Log a message at the `info` level. |
| info(message) | void | both | Log a message at the `info` level. |
| warn(message) | void | both | Log a message at the `warn` level. |
| error(message) | void | both | Log a message at the `error` level. |
| debug(message) | void | both | Log a message at the `debug` level. |
| time(label) | void | both | Start a timer to track duration of an operation. |
| timeEnd(label) | void | both | Stop a timer that was previously started. |
| timeLog(label, data) | void | both | Log duration taken so far for an operation. |
| trace(message) | void | both | Log a message at the `trace` level. |
| count(label) | void | both | Maintains an internal counter specific to `label` and outputs to stdout the num… |
| countReset(label) | void | both | Resets the internal counter specific to `label`. |
| assert(value, message) | void | both | A simple assertion test that verifies whether value is truthy. If it is not, As… |
| group(label) | void | both | Increases indentation of subsequent lines by spaces for `groupIndentation` leng… |
| groupCollapsed(label) | void | both | Alias for `group()` |
| groupEnd(—) | void | both | Decreases indentation of subsequent lines by spaces for `groupIndentation` leng… |


---

## Global.Intl
> Namespace providing JavaScript's standard internationalization APIs.
> Extends Object
> Platforms: both
> Type: module

Provides support for localized number formatting, date/time formatting,
and language sensitive string comparisons.

For more detail, see the MDN website about
[Intl](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl).


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| getCanonicalLocales(locales) | Array<String> | both | Gets canonical locale identifiers matching given BCP 47 locale identifiers. |


---

## Global.Intl.Collator
> Immutable object used to perform language sensitive string comparisons.
> Extends Object
> Platforms: both
> Type: module

A collator is used to perform a localized string compare or sort using a given language locale.

For more detail, see the MDN website about
[Intl.Collator](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator).

### Properties (unique: 1/1)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| constructor | Global.Intl.Collator | — | both | Creates a new `Intl.Collator` object with the given locale and comparison optio… |


### Methods (3)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| compare(string1, string2) | Number | both | Determines the sort order of the given strings or if they match. |
| resolvedOptions(—) | CollatorOptions | both | Gets the object's collation options. |
| supportedLocalesOf(locales) | Array<String> | both | Static method indicating what locales are supported by collators from the given… |


### Related Types

#### CollatorOptions
> Options to be passed into the <Global.Intl.Collator.constructor> method.

| Property | Type | Description |
|----------|------|-------------|
| localeMatcher | String | The locale matching algorithm to use. |
| usage | String | Indicates if the comparison is for sorting or searching when matching strings. |
| sensitivity | String | Indicates how characters should be compared. |
| ignorePunctuation | Boolean | Indicates if punctuation characters should be ignored during the compare. |
| numeric | Boolean | Indicates if numbers in string should be compared as integers. |
| caseFirst | String | Indicates if upper case or lower case characters should sort first. |

---

## Global.Intl.DateTimeFormat
> Immutable object used to generate localized date and time formatted strings.
> Extends Object
> Platforms: both
> Type: module

A `DateTimeFormat` object is used to format a `Date` object to a localized date and/or time string.
This will respect the system's current language setting when outputting a full month or weekday name.
It will also respect the current locale's date component ordering such as Month/Day/Year,
Day/Month/Year, and Year/Month/Day.

For more detail, see the MDN website about
[Intl.DateTimeFormat](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat).

### Properties (unique: 1/1)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| constructor | Global.Intl.DateTimeFormat | — | both | Creates a new `Intl.DateTimeFormat` object with the given locale and formatting… |


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| format(date) | String | both | Formats the given date object to a localized date and/or time string. |
| formatToParts(date) | Array<DateTimeFormattedPart> | both | Formats given date to an array of components describing what the formatted stri… |
| resolvedOptions(—) | DateTimeFormatOptions | both | Gets the object's formatting options. |
| supportedLocalesOf(locales) | Array<String> | both | Static method indicating what locales are supported by `DateTimeFormat` from th… |


### Related Types

#### DateTimeFormatOptions
> Options to be passed into the <Global.Intl.DateTimeFormat.constructor> method.

| Property | Type | Description |
|----------|------|-------------|
| dateStyle | String | Specifies the locale's built-in month, day, and year formatting styles. |
| timeStyle | String | Specifies the locale's built-in hour, minute, and second formatting styles. |
| fractionalSecondDigits | Number | Number of millisecond digits to show. Valid values are 0-3. |
| dayPeriod | String | Indicates how the AM/PM time component should be shown. |
| timeZone | String | The time zone the `Date` object's value should be converted to when formatted. |
| hour12 | Boolean | Indicates if formatter should output to either 12-hour or 24-hour time. |
| hourCycle | String | Indicates how the hour should be formatted. |
| localeMatcher | String | The locale matching algorithm to use. |
| formatMatcher | String | The format matching algorithm to use. |
| weekday | String | Indicates how a weekday name should be shown. |
| era | String | Indicates how the era name, such as AD or BC, should be shown. |
| year | String | Indicates how the year should be formatted. |
| month | String | Indicates how the month should be formatted. |
| day | String | Indicates how the numeric day should be formatted. |
| hour | String | Indicates how the hour should be formatted. |
| minute | String | Indicates how minutes should be formatted. |
| second | String | Indicates how seconds should be formatted. |
| timeZoneName | String | Indicates how the time zone should be shown. |

---

## Global.Intl.NumberFormat
> Immutable object used to convert numbers to localized numeric strings.
> Extends Object
> Platforms: both
> Type: module

A `NumberFormat` object is used to convert a `Number` value to a localized numeric string.
It provides various formatting options controlling the number of integer and fractional digits
to be displayed. It can also output currency values, percentage based values, and
scientific notation.

For more detail, see the MDN website about
[Intl.NumberFormat](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).

### Properties (unique: 1/1)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| constructor | Global.Intl.NumberFormat | — | both | Creates a new `Intl.NumberFormat` object with the given locale and formatting o… |


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| format(value) | String | both | Formats the given number to a localized numeric string. |
| formatToParts(value) | Array<NumberFormattedPart> | both | Formats given number to an array of components describing what the formatted st… |
| resolvedOptions(—) | NumberFormatOptions | both | Gets the object's formatting options. |
| supportedLocalesOf(locales) | Array<String> | both | Static method indicating what locales are supported by `NumberFormat` from the … |


### Related Types

#### NumberFormatOptions
> Options to be passed into the <Global.Intl.NumberFormat.constructor> method.

| Property | Type | Description |
|----------|------|-------------|
| style | String | Specifies the format style such as decimal, currency, or percentage. |
| localeMatcher | String | The locale matching algorithm to use. |
| currency | String | Set to the ISO 4217 currency code to use when formatting with the currency styl… |
| currencyDisplay | String | Indicates how the currency symbol or name should be shown. |
| useGrouping | Boolean | Indicates if grouping separators should be displayed. |
| minimumIntegerDigits | Number | Applies leading zeros to the integer portion of the formatted number. |
| minimumFractionDigits | Number | Applies trailing zeros in fractional portion of the formatted number. |
| maximumFractionDigits | Number | Max number of fractional digits to be shown. Will round at this max digit. |
| maximumSignificantDigits | Number | Max number of significant digits to be shown. Will round at this max digit. |
| notation | String | Indicates if number should be formatted to scientific or engineering notation. |

---

## Global.String
> The JavaScript built-in String type.
> Extends Object
> Platforms: both
> Type: module

This module contains Titanium-only extensions for formatting data into locale-specific strings. 
The target locale is configured by the user in the device's system Settings.


### Methods (5)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| format(formatString, value) | String | both | Formats a string using `printf`-style substitution. |
| formatCurrency(value) | String | both | Formats a number into the currency format, including currency symbol, of the lo… |
| formatDate(date, format) | String | both | Formats a date into the date format of the locale configured for the system. |
| formatDecimal(value, locale, pattern) | String | both | Formats a number into the decimal format, including decimal symbol, of the loca… |
| formatTime(date, format) | String | both | Formats a date into the time format of the locale configured for the system. |


---

