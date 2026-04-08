# Modules: NFC API Reference

## Modules.Nfc
> A cross-platform Near-Field-Communication (NFC) module for iOS and Android.  Download the latest release via [Github](https://github.com/appcelerator-modules/ti.nfc/releases).
> Extends Ti.Module
> Platforms: both
> Type: module

This module provides access to Near Field Communication (NFC) functionality, 
allowing applications to read and write (Android-only) NFC tags. 
A "tag" may actually be another device that appears as a tag.

### NFC Resources

- **Android**
  - [Near Field Communication](http://developer.android.com/guide/topics/connectivity/nfc/index.html)
  - [android.nfc](http://developer.android.com/reference/android/nfc/package-summary.html)
- **iOS**
  - [CoreNFC](https://developer.apple.com/documentation/corenfc)
  - [Introduction to CoreNFC at WWDC17](https://developer.apple.com/videos/play/wwdc2017/718/)
  - [Native example](https://github.com/hansemannn/iOS11-NFC-Example)

### Requirements

*(See full overview in titanium-docs)*

### Constants (61)
- **ACTION_NDEF_\***: ACTION_NDEF_DISCOVERED
- **ACTION_TAG_\***: ACTION_TAG_DISCOVERED
- **ACTION_TECH_\***: ACTION_TECH_DISCOVERED
- **COMMAND_CONFIGURATION_ERROR_INVALID_\***: COMMAND_CONFIGURATION_ERROR_INVALID_PARAMETERS
- **ENCODING_\***: ENCODING_UTF8, ENCODING_UTF16
- **ERROR_SECURITY_\***: ERROR_SECURITY_VIOLATION
- **ERROR_UNSUPPORTED_\***: ERROR_UNSUPPORTED_FEATURE
- **INVALIDATION_ERROR_FIRST_NDEF_TAG_\***: INVALIDATION_ERROR_FIRST_NDEF_TAG_READ
- **INVALIDATION_ERROR_SESSION_\***: INVALIDATION_ERROR_SESSION_TIMEOUT
- **INVALIDATION_ERROR_SESSION_TERMINATED_\***: INVALIDATION_ERROR_SESSION_TERMINATED_UNEXPECTEDLY
- **INVALIDATION_ERROR_SYSTEM_IS_\***: INVALIDATION_ERROR_SYSTEM_IS_BUSY
- **INVALIDATION_ERROR_USER_\***: INVALIDATION_ERROR_USER_CANCELED
- **MIFARE_BLOCK_\***: MIFARE_BLOCK_SIZE
- **MIFARE_SIZE_\***: MIFARE_SIZE_1K, MIFARE_SIZE_2K, MIFARE_SIZE_4K, MIFARE_SIZE_MINI
- **MIFARE_TAG_TYPE_\***: MIFARE_TAG_TYPE_CLASSIC, MIFARE_TAG_TYPE_PLUS, MIFARE_TAG_TYPE_PRO, MIFARE_TAG_TYPE_UNKNOWN
- **MIFARE_ULTRALIGHT_PAGE_\***: MIFARE_ULTRALIGHT_PAGE_SIZE
- **MIFARE_ULTRALIGHT_TYPE_\***: MIFARE_ULTRALIGHT_TYPE_ULTRALIGHT, MIFARE_ULTRALIGHT_TYPE_UNKNOWN
- **MIFARE_ULTRALIGHT_TYPE_ULTRALIGHT_\***: MIFARE_ULTRALIGHT_TYPE_ULTRALIGHT_C
- **RECOMMENDED_ACTION_\***: RECOMMENDED_ACTION_UNKNOWN
- **RECOMMENDED_ACTION_DO_\***: RECOMMENDED_ACTION_DO_ACTION
- **RECOMMENDED_ACTION_OPEN_FOR_\***: RECOMMENDED_ACTION_OPEN_FOR_EDITING
- **RECOMMENDED_ACTION_SAVE_FOR_\***: RECOMMENDED_ACTION_SAVE_FOR_LATER
- **RTD_\***: RTD_TEXT, RTD_URI
- **RTD_ALTERNATIVE_\***: RTD_ALTERNATIVE_CARRIER
- **RTD_HANDOVER_\***: RTD_HANDOVER_CARRIER, RTD_HANDOVER_REQUEST, RTD_HANDOVER_SELECT
- **RTD_SMART_\***: RTD_SMART_POSTER
- **TAG_TYPE_MIFARE_\***: TAG_TYPE_MIFARE_CLASSIC
- **TAG_TYPE_NFC_FORUM_TYPE_\***: TAG_TYPE_NFC_FORUM_TYPE_1, TAG_TYPE_NFC_FORUM_TYPE_2, TAG_TYPE_NFC_FORUM_TYPE_3, TAG_TYPE_NFC_FORUM_TYPE_4
- **TECH_\***: TECH_ISODEP, TECH_NDEF, TECH_NDEFFORMATABLE, TECH_NFCA, TECH_NFCB, TECH_NFCF, TECH_NFCV
- **TECH_MIFARE_\***: TECH_MIFARE_CLASSIC, TECH_MIFARE_ULTRALIGHT
- **TNF_\***: TNF_EMPTY, TNF_UNCHANGED, TNF_UNKNOWN
- **TNF_ABSOLUTE_\***: TNF_ABSOLUTE_URI
- **TNF_EXTERNAL_\***: TNF_EXTERNAL_TYPE
- **TNF_MIME_\***: TNF_MIME_MEDIA
- **TNF_WELL_\***: TNF_WELL_KNOWN
- **TRANSCEIVE_ERROR_RETRY_\***: TRANSCEIVE_ERROR_RETRY_EXCEEDED
- **TRANSCEIVE_ERROR_TAG_CONNECTION_\***: TRANSCEIVE_ERROR_TAG_CONNECTION_LOST
- **TRANSCEIVE_ERROR_TAG_RESPONSE_\***: TRANSCEIVE_ERROR_TAG_RESPONSE_ERROR


### Methods (22)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| createNativeTagTechnology(parameters) | Modules.Nfc.NativeTagTechnology | ios | Creates and returns an instance of <Modules.Nfc.NativeTagTechnology>. |
| createNdefMessage(parameters) | Modules.Nfc.NdefMessage | both | Creates and returns an instance of <Modules.Nfc.NdefMessage>. |
| createNdefRecordApplication(parameters) | Modules.Nfc.NdefRecordApplication | android | Creates and returns an instance of <Modules.Nfc.NdefRecordApplication>. |
| createNdefRecordEmpty(parameters) | Modules.Nfc.NdefRecordEmpty | android | Creates and returns an instance of <Modules.Nfc.NdefRecordEmpty>. |
| createNdefRecordExternal(parameters) | Modules.Nfc.NdefRecordExternal | android | Creates and returns an instance of <Modules.Nfc.NdefRecordExternal>. |
| createNdefRecordMedia(parameters) | Modules.Nfc.NdefRecordMedia | android | Creates and returns an instance of <Modules.Nfc.NdefRecordMedia>. |
| createNdefRecordSmartPoster(parameters) | Modules.Nfc.NdefRecordSmartPoster | android | Creates and returns an instance of <Modules.Nfc.NdefRecordSmartPoster>. |
| createNdefRecordText(parameters) | Modules.Nfc.NdefRecordText | android | Creates and returns an instance of <Modules.Nfc.NdefRecordText>. |
| createNdefRecordUnknown(parameters) | Modules.Nfc.NdefRecordUnknown | android | Creates and returns an instance of <Modules.Nfc.NdefRecordUnknown>. |
| createNdefRecordUri(parameters) | Modules.Nfc.NdefRecordUri | android | Creates and returns an instance of <Modules.Nfc.NdefRecordUri>. |
| createNfcAdapter(parameters) | Modules.Nfc.NfcAdapter | both | Creates and returns an instance of <Modules.Nfc.NfcAdapter>. |
| createNfcForegroundDispatchFilter(parameters) | Modules.Nfc.NfcForegroundDispatchFilter | android | Creates and returns an instance of <Modules.Nfc.NfcForegroundDispatchFilter>. |
| createMifareTagTechnology(parameters) | Modules.Nfc.MifareTagTechnology | ios | Creates and returns an instance of <Modules.Nfc.MifareTagTechnology>. |
| createTagTechnologyIsoDep(parameters) | Modules.Nfc.TagTechnologyIsoDep | android | Creates and returns an instance of <Modules.Nfc.TagTechnologyIsoDep>. |
| createTagTechnologyMifareClassic(parameters) | Modules.Nfc.TagTechnologyMifareClassic | android | Creates and returns an instance of <Modules.Nfc.TagTechnologyMifareClassic>. |
| createTagTechnologyMifareUltralight(parameters) | Modules.Nfc.TagTechnologyMifareUltralight | android | Creates and returns an instance of <Modules.Nfc.TagTechnologyMifareUltralight>. |
| createTagTechnologyNdefFormatable(parameters) | Modules.Nfc.TagTechnologyNdefFormatable | android | Creates and returns an instance of <Modules.Nfc.TagTechnologyNdefFormatable>. |
| createTagTechnologyNdef(parameters) | Modules.Nfc.TagTechnologyNdef | android | Creates and returns an instance of <Modules.Nfc.TagTechnologyNdef>. |
| createTagTechnologyNfcA(parameters) | Modules.Nfc.TagTechnologyNfcA | android | Creates and returns an instance of <Modules.Nfc.TagTechnologyNfcA>. |
| createTagTechnologyNfcB(parameters) | Modules.Nfc.TagTechnologyNfcB | android | Creates and returns an instance of <Modules.Nfc.TagTechnologyNfcB>. |
| createTagTechnologyNfcF(parameters) | Modules.Nfc.TagTechnologyNfcF | android | Creates and returns an instance of <Modules.Nfc.TagTechnologyNfcF>. |
| createTagTechnologyNfcV(parameters) | Modules.Nfc.TagTechnologyNfcV | android | Creates and returns an instance of <Modules.Nfc.TagTechnologyNfcV>. |


---

## Modules.Nfc.MifareTagTechnology
> Provides access to MIFARE Ultralight properties and I/O operations on a <Modules.Nfc.NfcTag>.
> Extends Modules.Nfc.NativeTagTechnology
> Platforms: ios

Use the <Modules.Nfc.createTagTechnologyMifareUltralight> method to create this tag technology.
See also:
[Mifare Ultralight](https://developer.apple.com/documentation/corenfc/nfcmifaretag?language=objc)


### Methods (5)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| mifareFamily(—) | void | ios | The MIFARE product family identifier for the tag. |
| identifier(—) | void | ios | The unique hardware identifier of the tag. |
| historicalBytes(—) | void | ios | The historical bytes extracted from an Answer To Select response. |
| sendMiFareCommand(data, errorCode, errorDomain, errorDescription) | void | ios | Sends a native MIFARE command to the tag. |
| sendMiFareISO7816Command(data, sw1, sw2, apdu, errorCode, errorDomain, errorDescription) | void | ios | Sends a native MIFARE command to the tag along with other parameter. |


---

## Modules.Nfc.NativeTagTechnology
> Native Tag Technology class will have the common methods.
> Extends Ti.Proxy
> Platforms: ios

Common methods get called for all the native tags so that we can save the redundancy of the code.


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| connect(—) | void | ios | calls the connected to tag method for NFC Tag reader session. |
| isConnected(—) | Boolean | ios | if session is connected to any tag or not |


---

## Modules.Nfc.NdefMessage
> Represents an immutable NDEF message.
> Extends Ti.Proxy
> Platforms: both

Use the <Modules.Nfc.createNdefMessage> method to create an NDEF message.

See also:
[NdefMessage](http://developer.android.com/reference/android/nfc/NdefMessage.html)

### Properties (unique: 1/3)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| records | Array<Modules.Nfc.NdefRecord> | — | both | NDEF records inside this NDEF message. |


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| toByte(—) | Ti.Blob | android | Return the NDEF message as raw bytes. |


---

## Modules.Nfc.NdefRecord
> Represents an immutable NDEF record.
> Extends Ti.Proxy
> Platforms: both

**Android**:
The NDEF record is the base type for more type-specific NDEF records. You will generally
work with the type-specific NDEF records (e.g. NdefRecordText, NdefRecordUri, etc.) which have
more applicable properties for each type of record.

Use one of the <Modules.Nfc.createNdefRecordApplication>, <Modules.Nfc.createNdefRecordEmpty>,

### Properties (unique: 6/8)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| payload | Ti.Blob | — | both | The variable length payload for the record. |
| recordType | String | — | android | The record type. |
| id | String | — | both | The variable length ID. |
| tnf | Number | — | both | The 3-bit TNF. |
| type | String | — | both | The variable length Type field. |
| hashCode | Number | — | android | The integer hash code for this object. |


### Methods (5)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| getRecordType(—) | String | android | Returns the record type. |
| getId(—) | String | both | Returns the variable length ID. |
| getTnf(—) | Number | both | Returns the 3-bit TNF. |
| getType(—) | String | both | Returns the variable length Type field. |
| getHashCode(—) | Number | android | Returns the integer hash code for this object. |


---

## Modules.Nfc.NdefRecordApplication
> Represents an immutable NDEF record indicating the package that should be used to handle the entire NDEF message.
> Extends Modules.Nfc.NdefRecord
> Platforms: android

This record type was introduced in Android 4.0 (API level 14).

See also:
[createApplicationRecord](http://developer.android.com/reference/android/nfc/NdefRecord.html#createApplicationRecord(java.lang.String))

### Properties (unique: 1/9)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| packageName | String | — | android | Application package name. |




---

## Modules.Nfc.NdefRecordEmpty
> Represents an immutable NDEF record that is empty.
> Extends Modules.Nfc.NdefRecord
> Platforms: android




---

## Modules.Nfc.NdefRecordExternal
> Represents an immutable NDEF record containing external (application-specific) data.
> Extends Modules.Nfc.NdefRecord
> Platforms: android

See also:
[createExternal](http://developer.android.com/reference/android/nfc/NdefRecord.html#createExternal(java.lang.String,%20java.lang.String,%20byte[]))

### Properties (unique: 2/10)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| domain | String | — | android | Domain name of issuing organization. |
| domainType | String | — | android | Domain-specific type of data. |




---

## Modules.Nfc.NdefRecordMedia
> Represents an immutable NDEF record containing MIME data.
> Extends Modules.Nfc.NdefRecord
> Platforms: android

See also:
[createMime](http://developer.android.com/reference/android/nfc/NdefRecord.html#createMime(java.lang.String,%20byte[]))

### Properties (unique: 1/9)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| mimeType | String | — | android | A valid MIME type. |




---

## Modules.Nfc.NdefRecordSmartPoster
> Represents an immutable NDEF record containing a Smart Poster message.
> Extends Modules.Nfc.NdefRecord
> Platforms: android

### Properties (unique: 4/12)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| title | String | — | android | Title for the Smart Poster. |
| uri | String | — | android | Uri for the external resource. |
| action | Number | — | android | Recommended action. |
| mimeType | String | — | android | A valid MIME type for the external resource. |




---

## Modules.Nfc.NdefRecordText
> Represents an immutable NDEF record containing text.
> Extends Modules.Nfc.NdefRecord
> Platforms: android

### Properties (unique: 3/11)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| text | String | — | android | Text. |
| languageCode | String | — | android | Language code. Defaults to current locale. |
| encoding | String | — | android | Encoding format. Default is ENCODING_UTF8 ("UTF-8"); |




---

## Modules.Nfc.NdefRecordUnknown
> Represents an immutable NDEF record containing an unknown data format.
> Extends Modules.Nfc.NdefRecord
> Platforms: android




---

## Modules.Nfc.NdefRecordUri
> Represents an immutable NDEF record containing a URI.
> Extends Modules.Nfc.NdefRecord
> Platforms: android

See also:
[createUri](http://developer.android.com/reference/android/nfc/NdefRecord.html#createUri(java.lang.String))

### Properties (unique: 1/9)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| uri | String | — | android | URI or URL. |




---

## Modules.Nfc.NfcAdapter
> Represents the local NFC adapter.
> Extends Ti.Proxy
> Platforms: both

The NFC adapter gives you access to the features of the NFC device. The NFC adapter proxy is always
associated with the activity that was the current activity when it was created. The NFC Adapter must
be created after the activity has been opened. You can use the window `open` event to know when the
activity has been opened.

Use the <Modules.Nfc.createNfcAdapter> method to create an NFC adapter.

See also:
[NfcAdapter](http://developer.android.com/reference/android/nfc/NfcAdapter.html)

### Properties (unique: 8/11)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| invalidateAfterFirstRead | Boolean | — | ios | Session will automatically invalidate after the first NDEF tag is read successf… |
| onPushComplete | Callback | — | android | Callback function to execute on successful Android Beam operation. |
| onPushMessage | Callback | — | android | Callback function used to dynamically generated NDEF messsages to send using An… |
| onBeamPushUris | Callback | — | android | Callback function used to dynamically generate one or more Uris to send using A… |
| onNdefDiscovered | Callback<NdefDiscovered> | — | both | Callback function to execute when a tag with NDEF payload is discovered. |
| onNdefInvalidated | Callback<NdefInvalidated> | — | ios | Callback function to execute when a session was invalidated (either errored by … |
| onTagDiscovered | Callback<NdefDiscovered> | — | android | Callback function to execute when a tag is discovered. |
| onTechDiscovered | Callback<NdefDiscovered> | — | android | Callback function to execute when a tag is discovered and activities are regist… |


### Methods (11)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| isEnabled(—) | Boolean | android | Return true if this NFC Adapter has any features enabled. |
| isNdefPushEnabled(—) | Boolean | android | Return true if the NDEF Push (Android Beam) feature is enabled. |
| onNewIntent(intent) | void | android | Processes a new intent received by an application. |
| disableForegroundDispatch(—) | void | android | Disable foreground dispatch to the current activity. |
| disableForegroundNdefPush(—) | void | android | Disable NDEF message push over P2P. |
| enableForegroundDispatch(dispatchFilter) | void | android | Enable foreground dispatch to the current activity. |
| disableReader(—) | void | android | Disable reader mode in the current activity. |
| enableReader(Callback) | void | android | Enable reader mode in the current activity. |
| enableForegroundNdefPush(message) | void | android | Enable NDEF message push over P2P. |
| setNdefPushMessage(message) | void | android | Set a static <Modules.Nfc.NdefMessage> to send using Android Beam. |
| setBeamPushUris(Uris) | void | android | Set one or more Uris to send using Android Beam. |


---

## Modules.Nfc.NfcForegroundDispatchFilter
> A filter specifying intent, intent filters and technology lists used to match dispatch intents.
> Extends Ti.Proxy
> Platforms: android

The <Modules.Nfc.NfcAdapter.enableForegroundDispatch> method is used to give priority to the foreground activity when dispatching
a discovered tag to an application. This proxy is used to specify the intent, intent filters, and technology
lists used to filter the dispatched intents. This proxy automatically creates the required pending intent and
will create an intent for the current activity if one is not provided.

Use the <Modules.Nfc.createNfcForegroundDispatchFilter> method to create a foreground dispatch filter.

See also:
[enableForegroundDispatch](http://developer.android.com/reference/android/nfc/NfcAdapter.html#enableForegroundDispatch(android.app.Activity,%20android.app.PendingIntent,%20android.content.IntentFilter[],%20java.lang.String[][]))

### Properties (unique: 3/5)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| intent | Ti.Android.Intent | — | android | The intent to start the dispatch when matched. |
| intentFilters | Array<NfcIntentFilter> | — | android | The intent filters to override dispatching for, or null to always dispatch. |
| techLists | Array<Array<String>> | — | android | The tech lists used to perform matching for dispatching the ACTION_TECH_DISCOVE… |




---

## Modules.Nfc.NfcNDEFTag
> An interface for interacting with an NDEF tag.
> Extends Ti.Proxy
> Platforms: ios

It provide the interface for NFC Data Exchange Format (NDEF) tag.


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| available(—) | Number | ios | A value that determines whether the NDEF tag is available in the current reader… |


---

## Modules.Nfc.NfcNDEFTagTechnology
> Provides access to NDEF tag and I/O operations on a <Modules.Nfc.NfcNDEFTag>
> Extends Ti.Proxy
> Platforms: ios

Use the <Modules.Nfc.createTagTechNdef> method to create this NDEF tag technology.


### Methods (5)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| connect(—) | void | ios | Call to connect NfcNDEFTag from session NFCNDEFReaderSession, connection succes… |
| queryNDEFStatus(—) | void | ios | Asks the reader session for the NDEF support status of the tag. Success/Failure… |
| readNDEF(—) | void | ios | Retrieves an NDEF message from the tag. Success/Failure result in a didReadNDEF… |
| writeNDEF(—) | void | ios | Saves an NDEF message to a writable tag. Success/Failure result in a didWirteND… |
| writeLock(—) | void | ios | Changes the NDEF tag status to read-only, preventing future write operations. S… |

### Events (5)
| Event | Platform | Description |
|-------|----------|-------------|
| didConnectTag | ios | A event called when NFCNDEFReaderSession try to connect with NDEF tag |
| didQueryNDEFStatus | ios | Asks the reader session for the NDEF support status of the tag. |
| didReadNDEFMessage | ios | Retrieves an NDEF message from the tag. |
| didWirteNDEFMessage | ios | Saves an NDEF message to a writable tag. |
| didWriteLock | ios | Changes the NDEF tag status to read-only, preventing future write operations. |

---

## Modules.Nfc.NfcTag
> Represents an NFC tag that has been discovered
> Extends Ti.Proxy
> Platforms: both

See also:
[Tag](http://developer.android.com/reference/android/nfc/Tag.html)

### Properties (unique: 2/5)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| id | String | — | both | Tag identifier (if it has one) |
| techList | Array<String> | — | both | Technologies available in this tag, as fully qualified class names. |


### Methods (3)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| getId(—) | String | both | Returns the tag identifier (if it has one) |
| getTechList(—) | Array<String> | both | Returns the technologies available in this tag, as fully qualified class names. |
| available(—) | Number | ios | Returns if the tag is available in current session |


---

## Modules.Nfc.TagTechnology
> Represents an interface to a specific tag technology.
> Extends Ti.Proxy
> Platforms: android

NFC tags are based on a number of independently developed technologies and offer a wide range of
capabilities. The TagTechnology proxies provide access to these different technologies and capabilities.
The TagTechnology proxy is the base type for more type-specific tag technologies. You will
work with the type-specific tag technology proxies which provide capabilities for each tag technology.

Use one of the <Modules.Nfc.createTagTechnologyIsoDep>, <Modules.Nfc.createTagTechnologyMifareClassic>,

### Properties (unique: 1/3)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| tag | Modules.Nfc.NfcTag | — | android | The tag technology that has been discovered. |


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| isValid(—) | Boolean | android | Return true if this tag technology was successfully obtained. |
| close(—) | void | android | Disable I/O operations to the tag and release resources. |
| connect(—) | void | android | Enable I/O operations to the tag. |
| isConnected(—) | Boolean | android | Returns true if connect has completed, and close has not been called, and the t… |


---

## Modules.Nfc.TagTechnologyIsoDep
> Provides access to ISO-DEP (ISO 14443-4) properties and I/O operations on a <Modules.Nfc.NfcTag>.
> Extends Modules.Nfc.TagTechnology
> Platforms: android

Use the <Modules.Nfc.createTagTechnologyIsoDep> method to create this tag technology.

See also:
[IsoDep](http://developer.android.com/reference/android/nfc/tech/IsoDep.html)


### Methods (7)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| getHiLayerResponse(—) | Ti.Buffer | android | Return the higher layer response bytes for NfcB tags. |
| getHistoricalBytes(—) | Ti.Buffer | android | Return the ISO-DEP historical bytes for NfcA tags. |
| getMaxTransceiveLength(—) | Number | android | Return the maximum number of bytes that can be sent with `transceive`. |
| getTimeout(—) | Number | android | Get the current timeout for `transceive` in milliseconds. |
| isExtendedLengthApduSupported(—) | Boolean | android | Whether the NFC adapter on this device supports extended length APDUs. |
| setTimeout(timeout) | void | android | Set the timeout of `transceive` in milliseconds. |
| transceive(data) | Ti.Buffer | android | Send raw ISO-DEP data to the tag and receive the response. |


---

## Modules.Nfc.TagTechnologyMifareClassic
> Provides access to MIFARE Classic properties and I/O operations on a <Modules.Nfc.NfcTag>.
> Extends Modules.Nfc.TagTechnology
> Platforms: android

Use the <Modules.Nfc.createTagTechnologyMifareClassic> method to create this tag technology.

See also:
[MifareClassic](http://developer.android.com/reference/android/nfc/tech/MifareClassic.html)

### Constants (3)
- **KEY_\***: KEY_DEFAULT
- **KEY_MIFARE_APPLICATION_\***: KEY_MIFARE_APPLICATION_DIRECTORY
- **KEY_NFC_\***: KEY_NFC_FORUM


### Methods (19)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| authenticateSectorWithKeyA(sectorIndex, key) | Boolean | android | Authenticate a sector with key A. |
| authenticateSectorWithKeyB(sectorIndex, key) | Boolean | android | Authenticate a sector with key B. |
| blockToSector(blockIndex) | Number | android | Return the sector that contains a given block. |
| decrement(blockIndex, value) | void | android | Decrement a value block, storing the result in the temporary block on the tag. |
| getBlockCount(—) | Number | android | Return the total number of MIFARE Classic blocks. |
| getBlockCountInSector(sectorIndex) | Number | android | Return the number of blocks in the given sector. |
| getMaxTransceiveLength(—) | Number | android | Return the maximum number of bytes that can be sent with `transceive`. |
| getSectorCount(—) | Number | android | Return the number of MIFARE Classic sectors. |
| getSize(—) | Number | android | Return the size of the tag in bytes. |
| getTimeout(—) | Number | android | Get the current `transceive` timeout in milliseconds. |
| getType(—) | Number | android | Return the type of this MIFARE Classic compatible tag. |
| increment(blockIndex, value) | void | android | Increment a value block, storing the result in the temporary block on the tag. |
| readBlock(blockIndex) | Ti.Buffer | android | Read 16-byte block. |
| restore(blockIndex) | void | android | Copy from a value block to the temporary block. |
| sectorToBlock(sectorIndex) | Number | android | Return the first block of a given sector. |
| setTimeout(timeout) | void | android | Set the `transceive` timeout in milliseconds. |
| transceive(data) | Ti.Buffer | android | Send raw NfcA data to the tag and receive the response. |
| transfer(blockIndex) | void | android | Copy from the temporary block to a value block. |
| writeBlock(blockIndex, data) | void | android | Write 16-byte block. |


---

## Modules.Nfc.TagTechnologyMifareUltralight
> Provides access to MIFARE Ultralight properties and I/O operations on a <Modules.Nfc.NfcTag>.
> Extends Modules.Nfc.TagTechnology
> Platforms: android

Use the <Modules.Nfc.createTagTechnologyMifareUltralight> method to create this tag technology.

See also:
[MifareUltralight](http://developer.android.com/reference/android/nfc/tech/MifareUltralight.html)


### Methods (7)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| getMaxTransceiveLength(—) | Number | android | Return the maximum number of bytes that can be sent with `transceive`. |
| getTimeout(—) | Number | android | Get the current `transceive` timeout in milliseconds. |
| getType(—) | Number | android | Return the MIFARE Ultralight type of the tag. |
| readPages(pageOffset) | Ti.Buffer | android | Read 4 pages (16 bytes). |
| setTimeout(timeout) | void | android | Set the `transceive` timeout in milliseconds. |
| transceive(data) | Ti.Buffer | android | Send raw NfcA data to the tag and receive the response. |
| writePage(pageOffset, data) | void | android | Write 1 page (4 bytes). |


---

## Modules.Nfc.TagTechnologyNdef
> Provides access to NDEF content and operations on a <Modules.Nfc.NfcTag>.
> Extends Modules.Nfc.TagTechnology
> Platforms: android

Use the <Modules.Nfc.createTagTechnologyNdef> method to create this tag technology.

See also:
[Ndef](http://developer.android.com/reference/android/nfc/tech/Ndef.html)


### Methods (8)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| canMakeReadOnly(—) | Boolean | android | Indicates whether a tag can be made read-only with `makeReadOnly`. |
| getCachedNdefMessage(—) | Modules.Nfc.NdefMessage | android | Get the <Modules.Nfc.NdefMessage> that was read from the tag at discovery time. |
| getMaxSize(—) | Number | android | Get the maximum NDEF message size in bytes. |
| getNdefMessage(—) | Modules.Nfc.NdefMessage | android | Read the current <Modules.Nfc.NdefMessage> on this tag. |
| getType(—) | String | android | Get the NDEF tag type. |
| isWritable(—) | Boolean | android | Determine if the tag is writable. |
| makeReadOnly(—) | Boolean | android | Make a tag read-only. |
| writeNdefMessage(message) | void | android | Overwrite the <Modules.Nfc.NdefMessage> on this tag. |


---

## Modules.Nfc.TagTechnologyNdefFormatable
> Provide access to NDEF format operations on a <Modules.Nfc.NfcTag>.
> Extends Modules.Nfc.TagTechnology
> Platforms: android

Use the <Modules.Nfc.createTagTechnologyNdefFormatable> method to create this tag technology.

See also:
[NdefFormatable](http://developer.android.com/reference/android/nfc/tech/NdefFormatable.html)


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| format(message) | void | android | Format a tag as NDEF, and write a <Modules.Nfc.NdefMessage>. |
| formatReadOnly(message) | void | android | Formats a tag as NDEF, write a <Modules.Nfc.NdefMessage>, and make read-only. |


---

## Modules.Nfc.TagTechnologyNfcA
> Provides access to NFC-A (ISO 14443-3A) properties and I/O operations on a <Modules.Nfc.NfcTag>.
> Extends Modules.Nfc.TagTechnology
> Platforms: android

Use the <Modules.Nfc.createTagTechnologyNfcA> method to create this tag technology.

See also:
[NfcA](http://developer.android.com/reference/android/nfc/tech/NfcA.html)


### Methods (6)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| getAtqa(—) | Ti.Buffer | android | Return the ATQA/SENS_RES bytes from tag discovery. |
| getMaxTransceiveLength(—) | Number | android | Return the maximum number of bytes that can be sent with `transceive`. |
| getSak(—) | Number | android | Return the SAK/SEL_RES bytes from tag discovery. |
| getTimeout(—) | Number | android | Get the current `transceive` timeout in milliseconds. |
| setTimeout(timeout) | void | android | Set the timeout of `transceive` in milliseconds. |
| transceive(data) | Ti.Buffer | android | Send raw NFC-A commands to the tag and receive the response. |


---

## Modules.Nfc.TagTechnologyNfcB
> Provides access to NFC-B (ISO 14443-3B) properties and I/O operations on a <Modules.Nfc.NfcTag>.
> Extends Modules.Nfc.TagTechnology
> Platforms: android

Use the <Modules.Nfc.createTagTechnologyNfcB> method to create this tag technology.

See also:
[NfcB](http://developer.android.com/reference/android/nfc/tech/NfcB.html)


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| getApplicationData(—) | Ti.Buffer | android | Return the Application Data bytes from ATQB/SENSB_RES at tag discovery. |
| getMaxTransceiveLength(—) | Number | android | Return the maximum number of bytes that can be sent with `transceive`. |
| getProtocolInfo(—) | Ti.Buffer | android | Return the Protocol Info bytes from ATQB/SENSB_RES at tag discovery. |
| transceive(data) | Ti.Buffer | android | Send raw NFC-B commands to the tag and receive the response. |


---

## Modules.Nfc.TagTechnologyNfcF
> Provides access to NFC-F (JIS 6319-4) properties and I/O operations on a <Modules.Nfc.NfcTag>.
> Extends Modules.Nfc.TagTechnology
> Platforms: android

Use the <Modules.Nfc.createTagTechnologyNfcF> method to create this tag technology.

See also:
[NfcF](http://developer.android.com/reference/android/nfc/tech/NfcF.html)


### Methods (6)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| getManufacturer(—) | Ti.Buffer | android | Return the Manufacturer bytes from tag discovery. |
| getMaxTransceiveLength(—) | Number | android | Return the maximum number of bytes that can be sent with `transceive`. |
| getSystemCode(—) | Ti.Buffer | android | Return the System Code bytes from tag discovery. |
| getTimeout(—) | Number | android | Get the current `transceive` timeout in milliseconds. |
| setTimeout(timeout) | void | android | Set the timeout of `transceive` in milliseconds. |
| transceive(data) | Ti.Buffer | android | Send raw NFC-F commands to the tag and receive the response. |


---

## Modules.Nfc.TagTechnologyNfcV
> Provides access to NFC-V (ISO 15693) properties and I/O operations on a <Modules.Nfc.NfcTag>.
> Extends Modules.Nfc.TagTechnology
> Platforms: android

Use the <Modules.Nfc.createTagTechnologyNfcV> method to create this tag technology.

See also:
[NfcV](http://developer.android.com/reference/android/nfc/tech/NfcV.html)


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| getDsfId(—) | Number | android | Return the DSF ID bytes from tag discovery. |
| getMaxTransceiveLength(—) | Number | android | Return the maximum number of bytes that can be sent with `transceive`. |
| getResponseFlags(—) | Number | android | Return the Response Flag bytes from tag discovery. |
| transceive(data) | Ti.Buffer | android | Send raw NFC-V commands to the tag and receive the response. |


---

