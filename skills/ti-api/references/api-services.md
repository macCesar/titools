# Ti.Geolocation, Ti.Contacts, Ti.Calendar & Ti.WatchSession API Reference

## Ti.Calendar
> The Calendar module provides an API for accessing the native calendar functionality.
> Extends Ti.Module
> Platforms: both
> Type: module

This module supports retrieving information about existing events and creating new events.
Modifying or deleting existing events and creating recurring events are only supported on iOS.

### Android
On Android, calendar permissions must be explicitly configured in `tiapp.xml` in order to access the
calendar and you have to use [requestCalendarPermissions](Titanium.Calendar.requestCalendarPermissions)
to request runtime permissions.

``` xml

### Properties (unique: 6/72)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| calendarAuthorization | Number | — | ios | Returns an authorization constant indicating if the application has access to t… |
| allAlerts | Array<Titanium.Calendar.Alert> | — | android | All alerts in selected calendars. |
| allCalendars | Array<Titanium.Calendar.Calendar> | — | both | All calendars known to the native calendar app. |
| allEditableCalendars | Array<Titanium.Calendar.Calendar> | — | ios | All calendars known to the native calendar app that can add, edit, and delete i… |
| selectableCalendars | Array<Titanium.Calendar.Calendar> | — | android | All calendars selected within the native calendar app, which may be a subset of… |
| defaultCalendar | Ti.Calendar.Calendar | — | both | Calendar that events are added to by default, as specified by user settings. |

### Constants (63)
- **ATTENDEE_ROLE_\***: ATTENDEE_ROLE_UNKNOWN, ATTENDEE_ROLE_OPTIONAL, ATTENDEE_ROLE_REQUIRED, ATTENDEE_ROLE_CHAIR
- **ATTENDEE_ROLE_NON_\***: ATTENDEE_ROLE_NON_PARTICIPANT
- **ATTENDEE_STATUS_\***: ATTENDEE_STATUS_UNKNOWN, ATTENDEE_STATUS_PENDING, ATTENDEE_STATUS_ACCEPTED, ATTENDEE_STATUS_DECLINED, ATTENDEE_STATUS_TENTATIVE, ATTENDEE_STATUS_INVITED, ATTENDEE_STATUS_NONE, ATTENDEE_STATUS_DELEGATED
- **ATTENDEE_STATUS_IN_\***: ATTENDEE_STATUS_IN_PROCESS
- **ATTENDEE_TYPE_\***: ATTENDEE_TYPE_UNKNOWN, ATTENDEE_TYPE_PERSON, ATTENDEE_TYPE_ROOM, ATTENDEE_TYPE_RESOURCE, ATTENDEE_TYPE_NONE, ATTENDEE_TYPE_REQUIRED, ATTENDEE_TYPE_GROUP
- **AUTHORIZATION_\***: AUTHORIZATION_AUTHORIZED, AUTHORIZATION_DENIED, AUTHORIZATION_RESTRICTED, AUTHORIZATION_UNKNOWN
- **AVAILABILITY_\***: AVAILABILITY_NOTSUPPORTED, AVAILABILITY_BUSY, AVAILABILITY_FREE, AVAILABILITY_TENTATIVE, AVAILABILITY_UNAVAILABLE
- **METHOD_\***: METHOD_ALERT, METHOD_DEFAULT, METHOD_EMAIL, METHOD_SMS
- **RECURRENCEFREQUENCY_\***: RECURRENCEFREQUENCY_DAILY, RECURRENCEFREQUENCY_WEEKLY, RECURRENCEFREQUENCY_MONTHLY, RECURRENCEFREQUENCY_YEARLY
- **RELATIONSHIP_\***: RELATIONSHIP_ATTENDEE, RELATIONSHIP_NONE, RELATIONSHIP_ORGANIZER, RELATIONSHIP_PERFORMER, RELATIONSHIP_SPEAKER, RELATIONSHIP_UNKNOWN
- **SOURCE_TYPE_\***: SOURCE_TYPE_LOCAL, SOURCE_TYPE_EXCHANGE, SOURCE_TYPE_CALDAV, SOURCE_TYPE_MOBILEME, SOURCE_TYPE_SUBSCRIBED, SOURCE_TYPE_BIRTHDAYS
- **SPAN_\***: SPAN_THISEVENT, SPAN_FUTUREEVENTS
- **STATE_\***: STATE_DISMISSED, STATE_FIRED, STATE_SCHEDULED
- **STATUS_\***: STATUS_NONE, STATUS_CANCELED, STATUS_CONFIRMED, STATUS_TENTATIVE
- **VISIBILITY_\***: VISIBILITY_CONFIDENTIAL, VISIBILITY_DEFAULT, VISIBILITY_PRIVATE, VISIBILITY_PUBLIC


### Methods (3)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| getCalendarById(id) | Ti.Calendar.Calendar | both | Gets the calendar with the specified identifier. |
| hasCalendarPermissions(—) | Boolean | both | Returns `true` if the app has calendar access. |
| requestCalendarPermissions(callback) | Promise<EventsAuthorizationResponse> | both | Requests for calendar access. |

### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| change | ios | Fired when the database backing the EventKit module is modified. |

---

## Ti.Calendar.Alert
> An object that represents a single alert for an event in an calendar.
> Extends Ti.Proxy
> Platforms: both

### Properties (unique: 9/12)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| absoluteDate | Date | — | ios | The absolute date for the alarm. |
| relativeOffset | Number | — | ios | The offset from the start of an event, at which the alarm fires. |
| alarmTime | Date | — | android | Date/time at which this alert alarm is set to trigger. |
| begin | Date | — | android | Start date/time for the corresponding event. |
| end | Date | — | android | End date/time for the corresponding event. |
| eventId | Number | — | both | Identifier of the event for which this alert is set. |
| id | String | — | android | Identifier of this alert. |
| minutes | Number | — | android | Reminder notice period in minutes, that determines how long prior to the event … |
| state | Number | — | android | The current state of the alert. |




---

## Ti.Calendar.Attendee
> An object that represents a single attendee of an event.
> Extends Ti.Proxy
> Platforms: ios

The API supports retrieving information about the attendee of an event.

### Properties (unique: 6/8)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| isOrganizer | Boolean | — | ios | Indicates whether this attendee is the event organizer. |
| name | String | — | ios | The attendee name. |
| email | String | — | ios | The attendee email. |
| role | Number | — | ios | The role of the attendee. |
| type | Number | — | ios | The type of the attendee. |
| status | Number | — | ios | The status of the attendee. |




---

## Ti.Calendar.Calendar
> An object that represents a single calendar.
> Extends Ti.Proxy
> Platforms: both

### Properties (unique: 7/10)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| hidden | Boolean | — | both | Indicates whether this calendar can be edited or deleted. |
| id | String | — | both | Identifier of this calendar. |
| name | String | — | both | Display name of this calendar. |
| selected | Boolean | — | android | Indicates whether the calendar is selected. |
| sourceTitle | String | — | ios | Displays the source title. |
| sourceType | Number | — | ios | Displays the source type. |
| sourceIdentifier | String | — | ios | Displays the source identifier. |


### Methods (9)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| createEvent(properties) | Ti.Calendar.Event | both | Creates an event in this calendar. |
| createEvents(propertiesArray) | Array<Titanium.Calendar.Event> | android | Creates multiple events at once in this calendar. |
| getEventById(id) | Ti.Calendar.Event | both | Gets the event with the specified identifier. |
| getEventsById(ids) | Array<Titanium.Calendar.Event> | android | Gets multiple events with their specified identifier(s). |
| deleteEvents(ids) | Number | android | Deletes multiple events with their specified identifier(s). |
| getEventsBetweenDates(date1, date2) | Array<Titanium.Calendar.Event> | both | Gets events that occur between two dates. |
| getEventsInDate(year, month, day) | Array<Titanium.Calendar.Event> | both | Gets events that occur on a specified date. |
| getEventsInMonth(year, month) | Array<Titanium.Calendar.Event> | both | Gets events that occur during a specified month. |
| getEventsInYear(year) | Array<Titanium.Calendar.Event> | both | Gets all events that occur during a specified year. |


---

## Ti.Calendar.Event
> An object that represents a single event in a calendar.
> Extends Ti.Proxy
> Platforms: both

The API supports retrieving information about existing events and creating new events.
On iOS, existing events can be modified or deleted. On Android, only recurrence rules
can be modified.

See <Titanium.Calendar> for examples of retrieving event information and creating events.

### Properties (unique: 18/21)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| alerts | Array<Titanium.Calendar.Alert> | — | both | Alarms associated with the calendar item, as an array of <Titanium.Calendar.Ale… |
| allDay | Boolean | false | both | Indicates whether this event is all day. |
| begin | Date | — | both | Start date/time of this event. |
| notes | String | — | ios | Notes for this event. |
| description | String | — | android | Description of this event. |
| end | Date | — | both | End date/time of this event. |
| extendedProperties | Dictionary | — | android | Extended properties of this event. |
| hasAlarm | Boolean | — | both | Indicates whether an alarm is scheduled for this event. |
| id | String | — | both | Identifier of this event. |
| location | String | — | both | Location of this event. |
| reminders | Array<Titanium.Calendar.Reminder> | — | android | Existing reminders for this event. |
| status | Number | — | both | Status of this event. |
| availability | Number | — | ios | Availability of this event. |
| isDetached | Boolean | — | ios | Boolean value that indicates whether an event is a detached instance of a repea… |
| title | String | — | both | Title of this event. |
| recurrenceRules | Array<Titanium.Calendar.RecurrenceRule> | — | both | The recurrence rules for the calendar item. |
| visibility | Number | — | android | Visibility of this event. |
| attendees | Array<Titanium.Calendar.Attendee> | — | ios | The list of event attendees. This list will be empty if the event has no attend… |


### Methods (10)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| createAlert(data) | Ti.Calendar.Alert | both | Creates an alert for this event. |
| createReminder(data) | Ti.Calendar.Reminder | android | Creates a reminder for this event. |
| getExtendedProperty(name) | String | android | Gets the value of the specified extended property. |
| setExtendedProperty(name, value) | void | android | Sets the value of the specified extended property. |
| createRecurrenceRule(data) | Ti.Calendar.RecurrenceRule | both | Creates an recurrence pattern for a recurring event. All of the properties for … |
| save(span) | Boolean | both | Saves changes to an event permanently. |
| remove(span) | Boolean | both | Removes an event from the calendar. |
| refresh(—) | Boolean | ios | Updates the event's data with the current information in the Calendar database. |
| addRecurrenceRule(rule) | void | ios | Adds a recurrence rule to the recurrence rule array. |
| removeRecurrenceRule(rule) | void | ios | Removes a recurrence rule to the recurrence rule array. |


### Related Types

#### Dictionary
> Plain JavaScript object.

---

## Ti.Calendar.RecurrenceRule
> An object that is used to describe the recurrence pattern for a recurring event.
> Extends Ti.Proxy
> Platforms: both

On Android there is no option to have multiple recurrence rules set for the same event.
Android always uses only the first element in the array passed to [recurrenceRules](Titanium.Calendar.Event.recurrenceRules).

In case of having [daysOfTheWeek](Titanium.Calendar.RecurrenceRule.daysOfTheWeek) and [daysOfTheMonth](Titanium.Calendar.RecurrenceRule.daysOfTheWeek)
for an event with a recurrence rule of type [RECURRENCEFREQUENCY_MONTHLY](Titanium.Calendar.RECURRENCEFREQUENCY_MONTHLY) only
[daysOfTheWeek] will be used.

### Properties (unique: 10/13)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| calendarID | String | — | both | Identifier for the recurrence rule's calendar. |
| frequency | Number | — | both | Frequency of the recurrence rule. |
| interval | Number | 1 | both | The interval between instances of this recurrence. For example, a weekly recurr… |
| daysOfTheWeek | Array<daysOfTheWeekDictionary> | — | both | The days of the week that the event occurs, as an array of objects `daysOfWeek`… |
| daysOfTheMonth | Array<Number> | — | both | The days of the month that the event occurs, as an array of number objects. Val… |
| monthsOfTheYear | Array<Number> | — | both | The months of the year that the event occurs, as an array of Number objects. Va… |
| weeksOfTheYear | Array<Number> | — | both | The weeks of the year that the event occurs, as an array of number objects. Val… |
| daysOfTheYear | Array<Number> | — | both | The days of the year that the event occurs, as an array of number objects. Valu… |
| setPositions | Array<Number> | — | ios | An array of ordinal numbers that filters which recurrences to include in the re… |
| end | recurrenceEndDictionary | — | both | End of a recurrence rule. |




### Related Types

#### recurrenceEndDictionary
> Dictionary containing either `endDate` or `occurrenceCount` property.

| Property | Type | Description |
|----------|------|-------------|
| endDate | Date | End date of the recurrence end, or undefined if the recurrence end is count-bas… |
| occurrenceCount | Number | Occurrence count of the recurrence end, or 0 if the recurrence end is date-base… |

---

## Ti.Calendar.Reminder
> An object that represents a single reminder for an event in a calendar.
> Extends Ti.Proxy
> Platforms: android

Reminders should be created using the <Titanium.Calendar.Event.createReminder> method 
rather than directly.

See <Titanium.Calendar> for examples of retrieving reminder information and creating 
reminders for events.

### Properties (unique: 3/6)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| id | String | — | android | Identifier of this reminder. |
| method | Number | — | android | Method by which this reminder will be delivered. |
| minutes | Number | — | android | Reminder notice period in minutes, that determines how long prior to the event … |




---

## Ti.Contacts
> The top-level Contacts module, used for accessing and modifying the system contacts address book.
> Extends Ti.Module
> Platforms: both
> Type: module

See examples for more information.

### iOS Platform Notes

On iOS, the contacts database may be modified by an external application, causing any `Person` or
`Group` objects you've retrieved to be out of sync with the database. The IDs of these objects are
not guaranteed to remain the same, so updating an object when it is out of sync may have
unpredictable results.

To avoid this, listen for the [reload](Titanium.Contacts.reload) event. When you receive a
`reload` event, you should assume that any existing `Person` or `Group` objects are invalid and
reload them from the `Contacts` module before modifying them.

See the examples for a sample use of the `reload` event.


*(See full overview in titanium-docs)*

### Properties (unique: 2/12)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| includeNote | Boolean | true | ios | A boolean value that indicates whether to fetch the notes stored in contacts or… |
| contactsAuthorization | Number | — | both | Returns an authorization constant indicating if the application has access to t… |

### Constants (7)
- **AUTHORIZATION_\***: AUTHORIZATION_AUTHORIZED, AUTHORIZATION_DENIED, AUTHORIZATION_UNKNOWN
- **CONTACTS_KIND_\***: CONTACTS_KIND_ORGANIZATION, CONTACTS_KIND_PERSON
- **CONTACTS_SORT_FIRST_\***: CONTACTS_SORT_FIRST_NAME
- **CONTACTS_SORT_LAST_\***: CONTACTS_SORT_LAST_NAME


### Methods (13)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| createGroup(parameters) | Ti.Contacts.Group | ios | Creates and returns an instance of <Titanium.Contacts.Group>. |
| createPerson(parameters) | Ti.Contacts.Person | both | Creates and returns an instance of <Titanium.Contacts.Person>, and commits all … |
| getAllGroups(—) | Array<Titanium.Contacts.Group> | ios | Gets all groups. |
| getAllPeople(limit) | Array<Titanium.Contacts.Person> | both | Gets all people, unless a limit is specified. |
| getGroupByIdentifier(id) | Ti.Contacts.Group | ios | Gets the group with the specified identifier. |
| getPeopleWithName(name) | Array<Titanium.Contacts.Person> | both | Gets people with a `firstName`, `middleName` or `lastName` field, or a combinat… |
| getPersonByIdentifier(id) | Ti.Contacts.Person | both | Gets the person with the specified identifier. |
| removeGroup(group) | void | ios | Removes a group from the address book. |
| removePerson(person) | void | both | Removes a contact from the address book. |
| save(contacts) | void | both | Commits all pending changes to the underlying contacts database. |
| showContacts(params) | void | both | Displays a picker that allows a person to be selected. |
| hasContactsPermissions(—) | Boolean | both | Returns `true` if the app has contacts access. |
| requestContactsPermissions(callback) | Promise<ContactsAuthorizationResponse> | both | Requests for contacts access. |

### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| reload | ios | Fired when the database backing the contacts module is modified externally. |

### Related Types

#### showContactsParams
> Dictionary of options for the <Titanium.Contacts.showContacts> method.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | Determines whether to animate the show/hide of the contacts picker (iPhone, iPa… |
| fields | Array<String> | Field names to show when selecting properties. By default, shows all available. |
| cancel | Callback<Object> | Function to call when selection is canceled. |
| selectedPerson | Callback<Object> | Function to call when a person is selected. Must not be used with `selectedProp… |
| selectedProperty | Callback<Object> | Function to call when a property is selected. Must not be used with `selectedPe… |

---

## Ti.Contacts.Group
> An object which represents a group in the system contacts address book.
> Extends Ti.Proxy
> Platforms: ios

See examples in <Titanium.Contacts> for more information.

These APIs are unavailable on macOS if the app is built on a version of Xcode < 12.

### Properties (unique: 2/4)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| name | String | — | ios | Name of this group. |
| identifier | String | — | ios | Identifier of the group. |


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| add(person) | void | ios | Adds a person to this group. |
| members(—) | Array<Titanium.Contacts.Person> | ios | Gets people that are members of this group. |
| remove(person) | void | ios | Removes a person from this group. For >= iOS 9, it is not required to call <Tit… |
| sortedMembers(sortBy) | Array<Titanium.Contacts.Person> | ios | Gets people that are members of this group, sorted in the specified order. |


---

## Ti.Contacts.Person
> An object that represents a contact record for a person or organization in the system contacts  address book.
> Extends Ti.Proxy
> Platforms: both

A person object is created using <Titanium.Contacts.createPerson>.

The following two kinds of properties exist for this object:

* single value - contains either a `string` or `number` type value, an array of `string` type 
values, or `null` if unset.
* multi-value - contains a dictionary with typical keys of `home`, `work` and/or `other`. Each 
key contains either a `string` type value, an array of `string` type values, or a dictionary 
containing key/value pairs with `string` type values.

### Adding and Modifying Properties

Support for adding and modifying properties is currently supported on iOS and Android.

### Keys as Address Book UI Labels

*(See full overview in titanium-docs)*

### Properties (unique: 29/32)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| address | Dictionary | — | both | Addresses for the person. Multi-value. Read-only on Android. |
| birthday | String | — | both | Date of birth of the person. Single value. |
| alternateBirthday | Dictionary | — | ios | Alternate birthday of the person. Single Dictionary. |
| date | Dictionary | — | both | Dates associated with the person. Multi-value. |
| department | String | — | both | Department of the person. Single value. |
| email | Dictionary | — | both | Email addresses for the person. Multi-value. Read-only on Android. |
| firstName | String | — | both | First name of the person. Single value. |
| firstPhonetic | String | — | both | Phonetic first name of the person. Single value. |
| fullName | String | — | both | Localized full name of the person. Single value. Read-only on Android. |
| id | Number | — | android | Record identifier of the person. Single value. |
| identifier | String | — | ios | Identifier of the person. |
| image | Ti.Blob | — | both | Image for the person. Single value. Read-only for >= iOS 9 |
| instantMessage | Dictionary | — | both | Instant messenger information of the person. Multi-value. |
| socialProfile | Dictionary | — | ios | Social profile information of the person. Multi-value. |
| jobTitle | String | — | both | Job title of the person. Single value. |
| kind | Number | — | both | Determines the type of information the person record contains; either person or… |
| lastName | String | — | both | Last name of the person. Single value. |
| lastPhonetic | String | — | both | Phonetic last name of the person. Single value. |
| middleName | String | — | both | Middle name of the person. Single value. |
| middlePhonetic | String | — | both | Phonetic middle name of the person. Single value. |
| nickname | String | — | both | Nickname of the person. Single value. |
| note | String | — | both | Notes for the person. Single value. |
| organization | String | — | both | Organization to which the person belongs. Single value. |
| phone | Dictionary | — | both | Phone numbers for the person. Multi-value. Read-only on Android. |
| prefix | String | — | both | Prefix for the person. Single value. |
| recordId | Number | — | ios | Record identifier of the person. Single value. Deprecated since iOS 9. |
| relatedNames | Dictionary | — | both | Names of people to which the person is related. Multi-value. |
| suffix | String | — | both | Suffix for the person. Single value. |
| url | Dictionary | — | both | URLs of webpages associated with the person. Multi-value. |




### Related Types

#### Dictionary
> Plain JavaScript object.

---

## Ti.Geolocation
> The top level Geolocation module. The Geolocation module is used for accessing device location based information.
> Extends Ti.Module
> Platforms: both
> Type: module

This module combines two sets of features:

*   Location services. Determining the location of the device.

*   Geocoding and reverse geocoding. Converting geographic  coordinates into
    addresses, and converting addresses into geographic  coordinates.

Using location services can have a significant impact on a device's battery life,
so it's important to use them in the most efficient manner possible. Power consumption
is strongly influenced by the accuracy and frequency of location updates required by
your application.

The location services systems of the underlying platforms are very different, so there
are significant implementation differences between the platforms.


*(See full overview in titanium-docs)*

### Properties (unique: 15/46)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| accuracy | Number | — | both | Specifies the requested accuracy for location updates. |
| distanceFilter | Number | 0 | ios | The minimum change of position (in meters) before a 'location' event is fired. |
| hasCompass | Boolean | — | both | Indicates whether the current device supports a compass. |
| headingFilter | Number | 0 (No limit on heading updates) | both | Minimum heading change (in degrees) before a `heading` event is fired. |
| headingTime | Number | 250 | android | Interval in milliseconds before a `heading` event is fired. |
| locationServicesAuthorization | Number | — | ios | Returns an authorization constant indicating if the application has access to l… |
| locationServicesEnabled | Boolean | — | both | Indicates if the user has enabled or disabled location services for the device … |
| showCalibration | Boolean | true | ios | Determines whether the compass calibration UI is shown if needed. |
| showBackgroundLocationIndicator | Boolean | false | ios | Specifies that an indicator be shown when the app makes use of continuous backg… |
| trackSignificantLocationChange | Boolean | false | ios | Indicates if the location changes should be updated only when a significant cha… |
| allowsBackgroundLocationUpdates | Boolean | false | ios | Determines if the app can do background location updates. |
| activityType | Number | <Titanium.Geolocation.ACTIVITYTYPE_OTHER> | ios | The type of user activity to be associated with the location updates. |
| locationAccuracyAuthorization | Number | <Titanium.Geolocation.ACCURACY_AUTHORIZATION_REDUCED> | ios | A value that indicates the level of location accuracy the app has permission to… |
| pauseLocationUpdateAutomatically | Boolean | false | ios | Indicates whether the location updates may be paused. |
| lastGeolocation | String | — | both | JSON representation of the last geolocation received. |

### Constants (28)
- **ACCURACY_\***: ACCURACY_BEST, ACCURACY_KILOMETER, ACCURACY_HIGH, ACCURACY_LOW, ACCURACY_REDUCED
- **ACCURACY_AUTHORIZATION_\***: ACCURACY_AUTHORIZATION_FULL, ACCURACY_AUTHORIZATION_REDUCED
- **ACCURACY_BEST_FOR_\***: ACCURACY_BEST_FOR_NAVIGATION
- **ACCURACY_HUNDRED_\***: ACCURACY_HUNDRED_METERS
- **ACCURACY_NEAREST_TEN_\***: ACCURACY_NEAREST_TEN_METERS
- **ACCURACY_THREE_\***: ACCURACY_THREE_KILOMETERS
- **ACTIVITYTYPE_\***: ACTIVITYTYPE_OTHER, ACTIVITYTYPE_FITNESS
- **ACTIVITYTYPE_AUTOMOTIVE_\***: ACTIVITYTYPE_AUTOMOTIVE_NAVIGATION
- **ACTIVITYTYPE_OTHER_\***: ACTIVITYTYPE_OTHER_NAVIGATION
- **AUTHORIZATION_\***: AUTHORIZATION_AUTHORIZED, AUTHORIZATION_DENIED, AUTHORIZATION_RESTRICTED, AUTHORIZATION_UNKNOWN, AUTHORIZATION_ALWAYS
- **AUTHORIZATION_WHEN_IN_\***: AUTHORIZATION_WHEN_IN_USE
- **ERROR_\***: ERROR_DENIED, ERROR_NETWORK
- **ERROR_HEADING_\***: ERROR_HEADING_FAILURE
- **ERROR_LOCATION_\***: ERROR_LOCATION_UNKNOWN
- **ERROR_REGION_MONITORING_\***: ERROR_REGION_MONITORING_DELAYED, ERROR_REGION_MONITORING_DENIED, ERROR_REGION_MONITORING_FAILURE


### Methods (7)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| forwardGeocoder(address, callback) | Promise<ForwardGeocodeResponse> | both | Resolves an address to a location. |
| getCurrentHeading(callback) | Promise<HeadingResponse> | both | Retrieves the current compass heading. |
| getCurrentPosition(callback) | Promise<LocationResults> | both | Retrieves the last known location from the device. |
| hasLocationPermissions(authorizationType) | Boolean | both | Returns `true` if the app has location access. |
| requestLocationPermissions(authorizationType, callback) | Promise<LocationAuthorizationResponse> | both | Requests for location access. |
| requestTemporaryFullAccuracyAuthorization(purposeKey, callback) | void | ios | Requests the user's permission to temporarily use location services with full a… |
| reverseGeocoder(latitude, longitude, callback) | Promise<ReverseGeocodeResponse> | both | Tries to resolve a location to an address. |

### Events (6)
| Event | Platform | Description |
|-------|----------|-------------|
| calibration | ios | Fired when the device detects interface and requires calibration. |
| heading | both | Fired when an heading update is received. |
| location | both | Fired when a location update is received. |
| locationupdatepaused | ios | Fired when location updates are paused by the OS. |
| locationupdateresumed | ios | Fired when location manager is resumed by the OS. |
| authorization | ios | Fired when changes are made to the authorization status for location services. |

### Related Types

#### HeadingData
> Simple object holding compass heading data.

| Property | Type | Description |
|----------|------|-------------|
| accuracy | Number | Accuracy of the compass heading, in platform-specific units. |
| magneticHeading | Number | Declination in degrees from magnetic North. |
| trueHeading | Number | Declination in degrees from true North. |
| timestamp | Number | Timestamp for the heading data, in milliseconds. |
| x | Number | Raw geomagnetic data for the X axis. |
| y | Number | Raw geomagnetic data for the Y axis. |
| z | Number | Raw geomagnetic data for the Z axis. |

#### LocationCoordinates
> Simple object holding the data for a location update.

| Property | Type | Description |
|----------|------|-------------|
| latitude | Number | Latitude of the location update, in decimal degrees. |
| longitude | Number | Longitude of the location update, in decimal degrees. |
| altitude | Number | Altitude of the location update, in meters. |
| accuracy | Number | Accuracy of the location update, in meters. |
| altitudeAccuracy | Number | Vertical accuracy of the location update, in meters. |
| heading | Number | Compass heading, in degrees. May be unknown if device is not moving. On iOS, a … |
| speed | Number | Current speed in meters/second. On iOS, a negative value indicates that the hea… |
| timestamp | Number | Timestamp for this location update, in milliseconds. |
| floor | LocationCoordinatesFloor | The floor of the building on which the user is located. |

#### LocationProviderDict
> Simple object describing a location provider.

| Property | Type | Description |
|----------|------|-------------|
| accuracy | Number | Accuracy of the location provider, either fine (1) or coarse (2). |
| name | String | Name of the location provider. |
| power | Number | Power consumption for this provider, either low (1), medium (2), or high (3). |

---

## Ti.Geolocation.Android
> Module for Android-specific geolocation functionality.
> Extends Ti.Module
> Platforms: android
> Type: module

This module is used for manually configuring geolocation settings on Android. 

Manual configuration is recommended for applications that have more demanding 
geolocation needs (for example, driving directions). However, for basic geolocation
information, *simple mode* geolocation may be sufficient. For information on simple 
mode, see <Titanium.Geolocation>.

Manual configuration involves managing *providers* and *rules*:

*   *Location providers*, such as GPS, provide location updates.

*   *Location rules* filter the results returned by location providers. 

Configuring geolocation manually involves three steps:


*(See full overview in titanium-docs)*

### Properties (unique: 1/7)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| manualMode | Boolean | false | android | Set to `true` to enable manual configuration of location updates through this m… |

### Constants (3)
- **PROVIDER_\***: PROVIDER_GPS, PROVIDER_NETWORK, PROVIDER_PASSIVE


### Methods (6)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| addLocationProvider(provider) | void | android | Adds and enables the specified location provider, possibly replacing an existin… |
| removeLocationProvider(provider) | void | android | Disables and removes the specified location provider. |
| addLocationRule(rule) | void | android | Adds and enables the specified location rule. |
| removeLocationRule(rule) | void | android | Disables and removes the specified location rule. |
| createLocationProvider(parameters) | Ti.Geolocation.Android.LocationProvider | android | Creates and returns an instance of <Titanium.Geolocation.Android.LocationProvid… |
| createLocationRule(parameters) | Ti.Geolocation.Android.LocationRule | android | Creates and returns an instance of <Titanium.Geolocation.Android.LocationRule>. |


---

## Ti.Geolocation.Android.LocationProvider
> Represents a source of location information, such as GPS.
> Extends Ti.Proxy
> Platforms: android

See <Titanium.Geolocation.Android> for details on using `LocationProviders` to 
manually configure location updates.

### Properties (unique: 3/6)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| name | String | — | android | Type of location provider: [PROVIDER_GPS](Titanium.Geolocation.Android.PROVIDER… |
| minUpdateTime | Number | — | android | Limits the frequency of location updates to no more than one per `minUpdateTime… |
| minUpdateDistance | Number | — | android | Don't send a location update unless the location has changed at least `minUpdat… |




---

## Ti.Geolocation.Android.LocationRule
> A location rule to filter the results returned by location providers.
> Extends Ti.Proxy
> Platforms: android

All of the properties are optional.

See <Titanium.Geolocation.Android> for details on using `LocationProviders` to 
manually configure location updates.

### Properties (unique: 4/7)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| name | String | — | android | If specified, this rule only applies to updates generated by the specified prov… |
| accuracy | Number | — | android | Minimum accuracy required for a location update. |
| minAge | Number | — | android | Controls the frequency of location updates. |
| maxAge | Number | — | android | Controls the freshness of location updates. Do not forward an update unless it … |




---

## Ti.WatchSession
> Used to enable data and file transfers between a watchOS and iOS application.
> Extends Ti.Module
> Platforms: ios
> Type: module

WatchSession enables data and file transfers between a WatchKit application and a Titanium application
using the iOS Watch Connectivity framework introduced in iOS 9 and watchOS 2.

### Properties (unique: 10/15)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| activationState | Number | — | ios | Returns the current activation state of the watch. |
| hasContentPending | Boolean | — | ios | Returns `true` if there is more content for the session to deliver. |
| remainingComplicationUserInfoTransfers | Number | 0 | ios | The number of calls remaining to `transferCurrentComplication` before the syste… |
| isSupported | Boolean | — | ios | Returns `true` if the device supports watch connectivity. |
| isPaired | Boolean | — | ios | Returns `true` if the device is paired with a watch. |
| isWatchAppInstalled | Boolean | — | ios | Returns `true` if the accompanying watch app is installed. |
| isComplicationEnabled | Boolean | — | ios | Returns `true` if complication is enabled on the installed watch app. |
| isReachable | Boolean | — | ios | Returns `true` if the watch is currently reachable. |
| isActivated | Boolean | — | ios | Returns `true` if the watch is currently activated. |
| recentApplicationContext | Dictionary | — | ios | The most recent application context sent to the watch app. |

### Constants (3)
- **ACTIVATION_STATE_\***: ACTIVATION_STATE_INACTIVE, ACTIVATION_STATE_ACTIVATED
- **ACTIVATION_STATE_NOT_\***: ACTIVATION_STATE_NOT_ACTIVATED


### Methods (9)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| activateSession(—) | void | ios | Activates the watch session |
| sendMessage(message, reply) | void | ios | Sends a message to the Apple Watch. |
| updateApplicationContext(params) | void | ios | Sends an app context update to the Apple Watch. |
| transferUserInfo(params) | void | ios | Transfers an user info to the Apple Watch. |
| transferFile(params) | void | ios | Transfers a file to the Apple Watch. |
| transferCurrentComplication(params) | void | ios | Transfers complication data to the watch application. |
| cancelAllUserInfoTransfers(—) | void | ios | Cancels all incomplete user info and complication transfers to the Apple Watch. |
| cancelAllFileTransfers(—) | void | ios | Cancels all incomplete file transfers to the Apple Watch. |
| cancelAllTransfers(—) | void | ios | Cancels all incomplete transfers to the Apple Watch. |

### Events (11)
| Event | Platform | Description |
|-------|----------|-------------|
| receivemessage | ios | App received message from Apple Watch in foreground. Will be called on startup … |
| receiveapplicationcontext | ios | App received app context from Apple Watch. Will be called on startup if an appl… |
| receiveuserinfo | ios | App received user info from Apple Watch in background. Will be called on startu… |
| receivefile | ios | App received file from Apple Watch in background. |
| watchstatechanged | ios | The watch state has changed. |
| reachabilitychanged | ios | The watch reachability state has changed. |
| finishuserinfotransfer | ios | Fired when the application completed user info transfer to the watch app. |
| finishfiletransfer | ios | App completed file transfer to watch app. |
| inactive | ios | Called when the session can no longer be used to modify or add any new transfer… |
| deactivate | ios | Called when all events for the previously selected watch has occurred. The sess… |
| activationCompleted | ios | Called when the session has completed activation. If session state is <Titanium… |

### Related Types

#### Dictionary
> Plain JavaScript object.

---

