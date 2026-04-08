# Modules: BLE & Bluetooth API Reference

## Modules.BLE
> Add-on Bluetooth Low Energy module
> Extends Ti.Module
> Platforms: both
> Type: module

### Constants (99)
- **ADVERT_DATA_KEY_IS_\***: ADVERT_DATA_KEY_IS_CONNECTABLE
- **ADVERT_DATA_KEY_LOCAL_\***: ADVERT_DATA_KEY_LOCAL_NAME
- **ADVERT_DATA_KEY_MANUFACTURER_\***: ADVERT_DATA_KEY_MANUFACTURER_DATA
- **ADVERT_DATA_KEY_OVERFLOW_SERVICE_\***: ADVERT_DATA_KEY_OVERFLOW_SERVICE_UUIDS
- **ADVERT_DATA_KEY_SERVICE_\***: ADVERT_DATA_KEY_SERVICE_DATA, ADVERT_DATA_KEY_SERVICE_UUIDS
- **ADVERT_DATA_KEY_SOLICITED_SERVICE_\***: ADVERT_DATA_KEY_SOLICITED_SERVICE_UUIDS
- **ADVERT_DATA_KEY_TX_POWER_\***: ADVERT_DATA_KEY_TX_POWER_LEVEL
- **ATT_\***: ATT_SUCCESS, ATT_FAILURE
- **ATT_ATTRIBUTE_NOT_FOUND_\***: ATT_ATTRIBUTE_NOT_FOUND_ERROR
- **ATT_ATTRIBUTE_NOT_LONG_\***: ATT_ATTRIBUTE_NOT_LONG_ERROR
- **ATT_INSUFFICIENT_AUTHENTICATION_\***: ATT_INSUFFICIENT_AUTHENTICATION_ERROR
- **ATT_INSUFFICIENT_AUTHORIZATION_\***: ATT_INSUFFICIENT_AUTHORIZATION_ERROR
- **ATT_INSUFFICIENT_ENCRYPTION_\***: ATT_INSUFFICIENT_ENCRYPTION_ERROR
- **ATT_INSUFFICIENT_ENCRYPTION_KEY_SIZE_\***: ATT_INSUFFICIENT_ENCRYPTION_KEY_SIZE_ERROR
- **ATT_INSUFFICIENT_RESOURCES_\***: ATT_INSUFFICIENT_RESOURCES_ERROR
- **ATT_INVALID_ATTRIBUTE_VALUE_LENGTH_\***: ATT_INVALID_ATTRIBUTE_VALUE_LENGTH_ERROR
- **ATT_INVALID_HANDLE_\***: ATT_INVALID_HANDLE_ERROR
- **ATT_INVALID_OFFSET_\***: ATT_INVALID_OFFSET_ERROR
- **ATT_INVALID_PDU_\***: ATT_INVALID_PDU_ERROR
- **ATT_PREPARE_QUEUE_FULL_\***: ATT_PREPARE_QUEUE_FULL_ERROR
- **ATT_READ_NOT_PERMITTED_\***: ATT_READ_NOT_PERMITTED_ERROR
- **ATT_REQUEST_NOT_SUPPORTED_\***: ATT_REQUEST_NOT_SUPPORTED_ERROR
- **ATT_UNLIKELY_\***: ATT_UNLIKELY_ERROR
- **ATT_UNSUPPORTED_GROUP_TYPE_\***: ATT_UNSUPPORTED_GROUP_TYPE_ERROR
- **ATT_WRITE_NOT_PERMITTED_\***: ATT_WRITE_NOT_PERMITTED_ERROR
- **AUTHORISATION_STATUS_\***: AUTHORISATION_STATUS_RESTRICTED, AUTHORISATION_STATUS_DENIED
- **AUTHORISATION_STATUS_ALLOWED_\***: AUTHORISATION_STATUS_ALLOWED_ALWAYS
- **AUTHORISATION_STATUS_NOT_\***: AUTHORISATION_STATUS_NOT_DETERMINED
- **BEACON_PROXIMITY_\***: BEACON_PROXIMITY_UNKNOWN, BEACON_PROXIMITY_IMMEDIATE, BEACON_PROXIMITY_NEAR, BEACON_PROXIMITY_FAR
- **CBUUID_CHARACTERISTIC_AGGREGATE_FORMAT_\***: CBUUID_CHARACTERISTIC_AGGREGATE_FORMAT_STRING
- **CBUUID_CHARACTERISTIC_EXTENDED_PROPERTIES_\***: CBUUID_CHARACTERISTIC_EXTENDED_PROPERTIES_STRING
- **CBUUID_CHARACTERISTIC_FORMAT_\***: CBUUID_CHARACTERISTIC_FORMAT_STRING
- **CBUUID_CHARACTERISTIC_USER_DESCRIPTION_\***: CBUUID_CHARACTERISTIC_USER_DESCRIPTION_STRING
- **CBUUID_CLIENT_CHARACTERISTIC_CONFIGURATION_\***: CBUUID_CLIENT_CHARACTERISTIC_CONFIGURATION_STRING
- **CBUUID_L2CAPPSM_CHARACTERISTIC_\***: CBUUID_L2CAPPSM_CHARACTERISTIC_STRING
- **CBUUID_SERVER_CHARACTERISTIC_CONFIGURATION_\***: CBUUID_SERVER_CHARACTERISTIC_CONFIGURATION_STRING
- **CHARACTERISTIC_PERMISSION_\***: CHARACTERISTIC_PERMISSION_READABLE, CHARACTERISTIC_PERMISSION_WRITEABLE
- **CHARACTERISTIC_PERMISSION_READ_\***: CHARACTERISTIC_PERMISSION_READ_ENCRYPTED
- **CHARACTERISTIC_PERMISSION_WRITE_\***: CHARACTERISTIC_PERMISSION_WRITE_ENCRYPTED
- **CHARACTERISTIC_PROPERTIES_\***: CHARACTERISTIC_PROPERTIES_BROADCAST, CHARACTERISTIC_PROPERTIES_READ, CHARACTERISTIC_PROPERTIES_WRITE, CHARACTERISTIC_PROPERTIES_NOTIFY, CHARACTERISTIC_PROPERTIES_INDICATE
- **CHARACTERISTIC_PROPERTIES_AUTHENTICATED_SIGNED_\***: CHARACTERISTIC_PROPERTIES_AUTHENTICATED_SIGNED_WRITES
- **CHARACTERISTIC_PROPERTIES_EXTENDED_\***: CHARACTERISTIC_PROPERTIES_EXTENDED_PROPERTIES
- **CHARACTERISTIC_PROPERTIES_INDICATE_ENCRYPTION_\***: CHARACTERISTIC_PROPERTIES_INDICATE_ENCRYPTION_REQUIRED
- **CHARACTERISTIC_PROPERTIES_NOTIFY_ENCRYPTION_\***: CHARACTERISTIC_PROPERTIES_NOTIFY_ENCRYPTION_REQUIRED
- **CHARACTERISTIC_PROPERTIES_WRITE_WITHOUT_\***: CHARACTERISTIC_PROPERTIES_WRITE_WITHOUT_RESPONSE
- **CHARACTERISTIC_TYPE_WRITE_WITH_\***: CHARACTERISTIC_TYPE_WRITE_WITH_RESPONSE
- **CHARACTERISTIC_TYPE_WRITE_WITHOUT_\***: CHARACTERISTIC_TYPE_WRITE_WITHOUT_RESPONSE
- **CONNECT_PERIPHERAL_OPTIONS_KEY_ENABLE_TRANSPORT_\***: CONNECT_PERIPHERAL_OPTIONS_KEY_ENABLE_TRANSPORT_BRIDGING
- **CONNECT_PERIPHERAL_OPTIONS_KEY_NOTIFY_ON_\***: CONNECT_PERIPHERAL_OPTIONS_KEY_NOTIFY_ON_CONNECTION, CONNECT_PERIPHERAL_OPTIONS_KEY_NOTIFY_ON_DISCONNECTION, CONNECT_PERIPHERAL_OPTIONS_KEY_NOTIFY_ON_NOTIFICATION
- **CONNECT_PERIPHERAL_OPTIONS_KEY_REQUIRES_\***: CONNECT_PERIPHERAL_OPTIONS_KEY_REQUIRES_ANCS
- **CONNECT_PERIPHERAL_OPTIONS_KEY_START_\***: CONNECT_PERIPHERAL_OPTIONS_KEY_START_DELAY
- **CONNECTION_EVENT_TYPE_PEER_\***: CONNECTION_EVENT_TYPE_PEER_DISCONNECTED, CONNECTION_EVENT_TYPE_PEER_CONNECTED
- **CONNECTION_PRIORITY_\***: CONNECTION_PRIORITY_HIGH, CONNECTION_PRIORITY_BALANCED
- **CONNECTION_PRIORITY_LOW_\***: CONNECTION_PRIORITY_LOW_POWER
- **DESCRIPTOR_PERMISSION_\***: DESCRIPTOR_PERMISSION_READ, DESCRIPTOR_PERMISSION_WRITE
- **DESCRIPTOR_PERMISSION_READ_\***: DESCRIPTOR_PERMISSION_READ_ENCRYPTED
- **DESCRIPTOR_PERMISSION_WRITE_\***: DESCRIPTOR_PERMISSION_WRITE_ENCRYPTED
- **DISABLE_NOTIFICATION_\***: DISABLE_NOTIFICATION_VALUE
- **ENABLE_INDICATION_\***: ENABLE_INDICATION_VALUE
- **ENABLE_NOTIFICATION_\***: ENABLE_NOTIFICATION_VALUE
- **LOCATION_MANAGER_AUTHORIZATION_STATUS_\***: LOCATION_MANAGER_AUTHORIZATION_STATUS_DENIED, LOCATION_MANAGER_AUTHORIZATION_STATUS_RESTRICTED
- **LOCATION_MANAGER_AUTHORIZATION_STATUS_AUTHORIZED_\***: LOCATION_MANAGER_AUTHORIZATION_STATUS_AUTHORIZED_ALWAYS
- **LOCATION_MANAGER_AUTHORIZATION_STATUS_AUTHORIZED_WHEN_IN_\***: LOCATION_MANAGER_AUTHORIZATION_STATUS_AUTHORIZED_WHEN_IN_USE
- **LOCATION_MANAGER_AUTHORIZATION_STATUS_NOT_\***: LOCATION_MANAGER_AUTHORIZATION_STATUS_NOT_DETERMINED
- **MANAGER_STATE_\***: MANAGER_STATE_UNKNOWN, MANAGER_STATE_RESETTING, MANAGER_STATE_UNSUPPORTED, MANAGER_STATE_UNAUTHORIZED
- **MANAGER_STATE_POWERED_\***: MANAGER_STATE_POWERED_OFF, MANAGER_STATE_POWERED_ON
- **MANAGER_STATE_TURNING_\***: MANAGER_STATE_TURNING_OFF, MANAGER_STATE_TURNING_ON
- **PERIPHERAL_MANAGER_CONNECTION_LATENCY_\***: PERIPHERAL_MANAGER_CONNECTION_LATENCY_LOW, PERIPHERAL_MANAGER_CONNECTION_LATENCY_MEDIUM, PERIPHERAL_MANAGER_CONNECTION_LATENCY_HIGH
- **PERIPHERAL_STATE_\***: PERIPHERAL_STATE_DISCONNECTED, PERIPHERAL_STATE_CONNECTING, PERIPHERAL_STATE_CONNECTED, PERIPHERAL_STATE_DISCONNECTING
- **REGION_STATE_\***: REGION_STATE_UNKNOWN, REGION_STATE_INSIDE, REGION_STATE_OUTSIDE


### Methods (14)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| initCentralManager(showPowerAlert, restoreIdentifier) | Modules.BLE.CentralManager | both | Initializes the module's central manager. This fu… |
| initPeripheralManager(showPowerAlert, restoreIdentifier) | Modules.BLE.PeripheralManager | both | Initializes the module's peripheral manager objec… |
| createBeaconRegion(uuid, identifier, major, minor) | Modules.BLE.BeaconRegion | ios | create Beacon Region. |
| createDescriptor(value, uuid, permission) | Modules.BLE.Descriptor | both | create descriptor. |
| createMutableCharacteristic(properties, permissions, uuid, descriptors) | Modules.BLE.MutableCharacteristic | both | create mutable characteristic. |
| createBeaconIdentityConstraint(uuid, major, minor) | Modules.BLE.BeaconIdentityConstraint | ios | create a constraint that describes the identity c… |
| createRegionManager(—) | Modules.BLE.RegionManager | ios | create a region manager to scan beacons. |
| disable(—) | Boolean | android | Disables the local Bluetooth adapter. |
| enable(—) | Boolean | android | Enables the local Bluetooth adapter. |
| isEnabled(—) | Boolean | android | Determines if Bluetooth is currently enabled and … |
| isBluetoothAndBluetoothAdminPermissionsGranted(—) | Boolean | android | Determines if bluetooth permissions have been gra… |
| requestPermissions(callback) | Promise<Titanium.Android.RequestPermissionAccessResult> | android | Displays a dialog requesting bluetooth permission… |
| isSupported(—) | Boolean | android | Determines whether Bluetooth Low Energy feature i… |
| isAdvertisingSupported(—) | Boolean | android | Determines whether Bluetooth Low Energy Advertisi… |


---

## Modules.BLE.Beacon
> Represents a beacon that was encountered during region monitoring. You do not create instances of this class directly. They will be delivered via the rangedBeacons event.
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 7/9)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| accuracy | String | ios | Indicates the one sigma horizontal accuracy in me… |
| major | Number | ios | The value identifying a group of beacons. |
| minor | Number | ios | The value identifying a specific beacon within a … |
| proximity | Number | ios | The relative distance to the beacon. |
| rssi | Number | ios | The received signal strength of the beacon, measu… |
| uuid | String | ios | The unique ID of the beacons being targeted. |
| timestamp | Number | ios | The time when this beacon was observed. |




---

## Modules.BLE.BeaconIdentityConstraint
> Represents a beacon that was encountered during region monitoring. You do not create instances of this class directly. They will be delivered via the rangedBeacons event.
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 3/5)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| major | Number | ios | The value identifying a group of beacons. |
| minor | Number | ios | The value identifying a specific beacon within a … |
| uuid | String | ios | The unique ID of the beacons being targeted. |




---

## Modules.BLE.BeaconRegion
> A region used to detect the presence of iBeacon devices.
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 5/7)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| identifier | String | ios | This is a value that you specify and can use to i… |
| major | Number | ios | The value identifying a group of beacons. |
| minor | Number | ios | The value identifying a specific beacon within a … |
| notifyEntryStateOnDisplay | Number | ios | The relative distance to the beacon. A Boolean in… |
| uuid | String | ios | The unique ID of the beacons being targeted. |




---

## Modules.BLE.Central
> represent a remote device acting as central, connected to a local app, which is acting as a peripheral.
> Extends Ti.Proxy
> Platforms: both

### Properties (unique: 2/5)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| maximumUpdateValueLength | Number | ios | The maximum amount of data, in bytes, that can be… |
| address | String | both | The address (UUID) of device acting as a central. |




---

## Modules.BLE.CentralManager
> An object that scans for, discovers, connects to, and manages peripherals.
> Extends Ti.Proxy
> Platforms: both

### Properties (unique: 3/6)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| state | Number | both | State of the module's internal central manager. F… |
| isScanning | Boolean | both | A Boolean value that indicates whether the centra… |
| peripherals | Array<Modules.BLE.Peripheral> | both | All discovered peripherals |


### Methods (10)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| isAccessFineLocationPermissionGranted(—) | Boolean | android | Determines whether the ACCESS_FINE_LOCATION permi… |
| requestAccessFineLocationPermission(—) | void | android | Request for the `ACCESS_FINE_LOCATION`. |
| createPeripheral(address) | Modules.BLE.Peripheral | android | Creates a Modules.BLE.Peripheral class object wit… |
| startScan(services, options) | void | both | Starts scanning for peripherals. |
| stopScan(—) | void | both | Stops scanning for peripherals. |
| retrievePeripheralsWithIdentifiers(UUIDs) | Array<Modules.BLE.Peripheral> | ios | Returns a list of known peripherals by their iden… |
| retrieveConnectedPeripheralsWithServices(UUIDs) | Array<Modules.BLE.Peripheral> | ios | Returns a list of the peripherals connected to th… |
| registerForConnectionEvents(peripherals, services) | void | ios | Calls connectionEventDidOccur event when a connec… |
| cancelPeripheralConnection(peripheral) | void | both | Cancels an active or pending connection to periph… |
| connectPeripheral(peripheral, options) | void | both | Initiates a connection to peripheral. Connection … |

### Events (8)
| Event | Platform | Description |
|-------|----------|-------------|
| didUpdateState | both | A event called when centrel manager state updated |
| willRestoreState | ios | A event called when centrel manager will restore state |
| didDiscoverPeripheral | both | A event called when centrel manager discover peripheral |
| didConnectPeripheral | both | This event is called when a connection initiated by connectPeripheral has succe… |
| didFailToConnectPeripheral | ios | This event is called when a connection initiated by connectPeripheral has faile… |
| didDisconnectPeripheral | both | This event is called when a peripheral disconnected. |
| connectionEventDidOccur | ios | This method is called upon the connection or disconnection of a peripheral that… |
| didUpdateANCSAuthorization | ios | This event is called when the authorization status changes for a peripheral con… |

---

## Modules.BLE.Characteristic
> A characteristic of a remote peripheral’s service.
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 8/10)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| descriptors | Array<Modules.BLE.Descriptor> | ios | A list of the Descriptor* objects that have so fa… |
| isMutable | Boolean | ios | Indicates whether this characteristic is mutable. |
| properties | Number | ios | The properties of the characteristic as a bitfiel… |
| service | Modules.BLE.Service | ios | The service this characteristic belongs to. |
| uuid | String | ios | The Bluetooth-specific UUID of the attribute. |
| value | Ti.Buffer | ios | The value of the characteristic. |
| isNotifying | Boolean | ios | Whether the characteristic is currently notifying… |
| isMutable | Boolean | ios | Indicates whether this characteristic is mutable. |


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| equal(characteristic) | Boolean | ios | tests whether two characteristics are same or not. |


---

## Modules.BLE.DescriptorRequest
> A request that uses the Attribute Protocol (ATT).
> Extends Ti.Proxy
> Platforms: android

### Properties (unique: 5/8)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| central | Modules.BLE.Central | android | The central that originated the request. |
| descriptor | Modules.BLE.Descriptor | android | The descriptor whose value will be read or writte… |
| offset | Number | android | The offset given for the value |
| value | Ti.Buffer | android | The data being read or written. |
| responseNeeded | Boolean | android | If the remote device requires a response. |


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| updateValue(value) | void | android | update the data of value field |


---

## Modules.BLE.L2CAPChannel
> L2Cap allow us to open a side channel, with it we can directly read and write without any framing limitation, packet size limitations. It’s a direct way to talk between our devices and accessories.
> Extends Ti.Proxy
> Platforms: both

### Properties (unique: 2/5)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| peer | Modules.BLE.Peer | ios | The peer connected to the channel |
| psm | Number | both | The PSM of the channel. |


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| write(data) | void | both | write data to channel |
| getReadBufferSize(—) | Number | both | Get the size of the read buffer in bytes. |
| setReadBufferSize(size) | void | both | Sets the size of the read buffer in bytes. |
| close(—) | void | both | closes the l2cap channel |

### Events (3)
| Event | Platform | Description |
|-------|----------|-------------|
| onDataReceived | both | Fired whenever new data recived on channel. |
| onStreamError | both | Fired whenever there is some error in reading or writing. |
| onStreamEndEncountered | ios | Fired whenever the end of the stream has been reached. |

---

## Modules.BLE.MutableCharacteristic
> A characteristic of a local peripheral’s service.
> Extends Ti.Proxy
> Platforms: both

### Properties (unique: 2/5)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| subscribedCentrals | Modules.BLE.Central | both | For notifying characteristics, the set of current… |
| permissions | Number | ios | The permissions of the characteristic value. It i… |




---

## Modules.BLE.Peer
> An object that represents a remote device.
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 1/3)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| identifier | String | ios | The UUID associated with the peer. |




---

## Modules.BLE.Peripheral
> A remote peripheral device.
> Extends Ti.Proxy
> Platforms: both

### Properties (unique: 7/10)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| isConnected | Boolean | both | Whether or not the peripheral is currently connec… |
| name | String | both | The name of the peripheral. |
| services | Array<Modules.BLE.Service> | both | A list of a peripheral’s discovered services. |
| state | Number | ios | The current connection state of the peripheral. P… |
| address | String | both | Once a peripheral has been connected at least onc… |
| canSendWriteWithoutResponse | Boolean | ios | A Boolean value that indicates whether the remote… |
| ancsAuthorized | Boolean | ios | A Boolean value that indicates if the remote devi… |


### Methods (14)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| readRSSI(—) | void | both | Retrieves the current RSSI value for the peripher… |
| requestConnectionPriority(connectionPriority) | void | android | Request the specific connection priority. This me… |
| discoverCharacteristics(services, characteristicUUIDs) | void | both | Discovers the specified characteristic(s) of a se… |
| discoverDescriptorsForCharacteristic(characteristic) | void | both | Discovers the descriptor(s) of a characteristic.T… |
| discoverIncludedServices(services, includedServiceUUIDs) | void | both | Discovers the specified included service(s) of a … |
| discoverServices(serviceUUIDs) | void | both | Discovers available service(s) on the peripheral.… |
| readValueForCharacteristic(characteristic) | void | both | Reads the value of a characteristic.The result of… |
| readValueForDescriptor(descriptor) | void | both | Reads the value of a descriptor. The result of th… |
| subscribeToCharacteristic(characteristic, descriptorUUID="00002902-0000-1000-8000-00805f9b34fb", descriptorValue=ENABLE_NOTIFICATION_VALUE) | void | both | Enables notifications/indications for a character… |
| unsubscribeFromCharacteristic(characteristic, descriptorUUID="00002902-0000-1000-8000-00805f9b34fb", descriptorValue=DISABLE_NOTIFICATION_VALUE) | void | both | Disables notifications/indications for a characte… |
| writeValueForCharacteristic(characteristic, data, characteristicWriteType) | void | both | Writes a value to a characteristic. |
| writeValueForDescriptor(descriptor, data) | void | both | Writes the value of a descriptor. The result of t… |
| maximumWriteValueLength(characteristicWriteType) | void | ios | The maximum amount of data, in bytes, you can sen… |
| openL2CAPChannel(psmIdentifier, encryptionRequired) | void | both | Attempts to open an L2CAP channel to the peripher… |

### Events (14)
| Event | Platform | Description |
|-------|----------|-------------|
| didDiscoverCharacteristics | both | This event returns the result of a call to the discoverCharacteristics method. … |
| didDiscoverDescriptorsForCharacteristics | both | This event returns the result of a call to the discoverDescriptorsForCharacteri… |
| didDiscoverIncludedServices | both | This event returns the result of a call to the discoverIncludedServices method. |
| didDiscoverServices | ios | Discovers the specified services of the peripheral. |
| didModifyServices | ios | This event is fired when the services of the peripheral change. |
| didUpdateName | ios | This event is fired when the name of the peripheral changes. |
| didUpdateNotificationStateForCharacteristics | both | This event returns the result of a call to the subscribeToCharacteristic or uns… |
| didReadRSSI | both | This event returns the result of a call to the readRSSI method. |
| didUpdateValueForCharacteristic | both | This event is fired after a call to the readValueForCharacteristic method, or u… |
| didUpdateValueForDescriptor | both | This event returns the result of a call to the readValueForDescriptor method. |
| didWriteValueForCharacteristic | both | This event returns the result of a call to the writeValueForCharacteristic meth… |
| didWriteValueForDescriptor | both | This event returns the result of a call to the writeValueForDescriptor method. |
| peripheralIsReadyToSendWriteWithoutResponse | ios | Tells the delegate that a peripheral is again ready to send characteristic upda… |
| didOpenChannel | both | This method delivers the result of a previous call to openL2CAPChannel. |

---

## Modules.BLE.PeripheralManager
> An object that manages and advertises peripheral services exposed by this app.
> Extends Ti.Proxy
> Platforms: both

### Properties (unique: 3/6)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| isAdvertising | Boolean | both | Whether or not the the module's internal peripher… |
| peripheralManagerState | Number | both | State of the module's internal peripheral manager… |
| restoredPeripheralManagerIdentifier | String | ios | string the restoration identifier for a periphera… |


### Methods (14)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| addService(characteristics, uuid, primary) | Modules.BLE.Service | both | Publishes a service and any of its associated cha… |
| removeService(service) | void | both | Removes a specified published service from the lo… |
| removeAllServices(—) | void | both | Removes all published services from the local GAT… |
| respondToRequest(request, result) | void | both | Used to respond to request(s) received via the di… |
| respondToDescriptorRequest(descriptorRequest, result) | void | android | Used to respond to request(s) received via the di… |
| publishL2CAPChannel(encryptionRequired) | void | both | Attempts to open an L2CAP channel to the peripher… |
| unpublishL2CAPChannel(PSM) | void | both | The service PSM to be removed from the system. |
| startAdvertising(localName, serviceUUIDs) | void | both | Instructs the module's internal peripheral manage… |
| stopAdvertising(—) | void | both | Instructs the module's internal peripheral manage… |
| startAdvertisingBeaconRegion(measurePower, beaconRegion) | void | ios | Instructs the module's internal peripheral manage… |
| stopAdvertising(—) | void | ios | Instructs the module's internal peripheral manage… |
| updateValue(characteristic, data, centrals) | Boolean | both | Instructs the module's internal peripheral manage… |
| setDesiredConnectionLatency(latency, central) | void | ios | Sets the desired connection latency for an existi… |
| closePeripheral(—) | void | android | This method closes the peripheral. |

### Events (14)
| Event | Platform | Description |
|-------|----------|-------------|
| didUpdateState | both | Fired whenever the state of the module's internal peripheral manager changes. |
| didPublishL2CAPChannel | both | Tells the delegate that the peripheral manager created a listener for incoming … |
| didUnpublishL2CAPChannel | both | Tells the delegate that the peripheral manager removed a published service from… |
| didOpenL2CAPChannel | both | Tells the delegate that the peripheral manager opened an L2CAP channel. |
| willRestoreState | ios | Tells the delegate that the peripheral manager opened an L2CAP channel. |
| didStartAdvertising | both | This event returns the result of a startAdvertising call. If advertisement coul… |
| didAddService | both | This event returns the result of a addService call. If service could not be add… |
| didSubscribeToCharacteristic | both | This event is fired when a central configures a characteristic to notify or ind… |
| didUnsubscribeFromCharacteristic | both | This event is fired when a central removes notifications/indications from a cha… |
| didReceiveReadRequest | both | This event is fired when the module's internal peripheral manager receives a re… |
| didReceiveWriteRequests | both | This event is fired when the module's internal peripheral manager receives a wr… |
| didReceiveDescriptorReadRequest | android | This event is fired when the module's internal peripheral manager receives a re… |
| didReceiveDescriptorWriteRequests | android | This event is fired when the module's internal peripheral manager receives a wr… |
| readyToUpdateSubscribers | ios | This event is fired when the module's internal peripheral manager receives a wr… |

---

## Modules.BLE.RegionManager
> An object that manages and scan beacons.
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 8/10)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| locationManagerAuthorizationStatus | Number | ios | Returns the current authorization status of the c… |
| maximumRegionMonitoringDistance | Number | ios | The maximum region size, in terms of a distance f… |
| monitoredRegions | Array<Modules.BLE.BeaconRegion> | ios | Retrieve a set of objects for the regions that ar… |
| rangedRegions | Array<Modules.BLE.BeaconRegion> | ios | Retrieve a set of objects representing the region… |
| rangedBeaconConstraints | Array<Modules.BLE.BeaconIdentityConstraint> | ios | Retrieve a set of beacon constraints for which th… |
| locationServicesEnabled | Boolean | ios | Determines whether the user has location services… |
| isRangingAvailable | Boolean | ios | Determines whether the device supports ranging. |
| isMonitoringAvailable | Boolean | ios | Determines whether the device supports monitoring… |


### Methods (9)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| requestAlwaysAuthorization(—) | void | ios | When locationManagerAuthorizationStatus == LOCATI… |
| requestWhenInUseAuthorization(—) | void | ios | When locationManagerAuthorizationStatus == LOCATI… |
| requestRegionState(beaconRegion) | void | ios | Asynchronously retrieve the cached state of the s… |
| startRangingBeaconsInRegion(beaconRegion) | void | ios | Start calculating ranges for beacons in the speci… |
| stopRangingBeaconsInRegion(beaconRegion) | void | ios | Stop calculating ranges for the specified region. |
| startRangingBeaconsSatisfyingIdentityConstraint(identityConstraint) | void | ios | Start calculating ranges for beacons in the speci… |
| stopRangingBeaconsSatisfyingIdentityConstraint(identityConstraint) | void | ios | Stop an earlier beacon ranging request. See start… |
| startRegionMonitoring(beaconRegion) | void | ios | Start monitoring the specified region. |
| stopRegionMonitoring(beaconRegion) | void | ios | Stop monitoring the specified region. |

### Events (11)
| Event | Platform | Description |
|-------|----------|-------------|
| didEnterRegion | ios | Invoked when the user enters a monitored region. |
| didExitRegion | ios | Invoked when the user exits a monitored region |
| didRangeBeacons | ios | Invoked when a new set of beacons are available in the specified region |
| didRange | ios | Invoked when a new set of beacons are available in the specified Beacon Identit… |
| didFailRanging | ios | Invoked when an error has occurred ranging beacons in a region. |
| didFail | ios | Invoked when an any error has occurred. |
| rangingBeaconsDidFail | ios | Invoked when an error has occurred ranging beacons in a region. |
| didDetermineState | ios | Invoked when there's a state transition for a monitored region or in response t… |
| didStartMonitoring | ios | Invoked when a monitoring for a region started successfully. |
| monitoringDidFail | ios | Invoked when an error has occurred monitoring beacons in a region. |
| didChangeAuthorization | ios | Invoked when the authorization status changes for this application. |

---

## Modules.BLE.Request
> A request that uses the Attribute Protocol (ATT).
> Extends Ti.Proxy
> Platforms: both

### Properties (unique: 5/8)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| central | Modules.BLE.Central | both | The central that originated the request. |
| characteristic | Modules.BLE.Characteristic | both | The characteristic whose value will be read or wr… |
| offset | Number | both | The zero-based index of the first byte for the re… |
| value | Ti.Buffer | both | The data being read or written. |
| responseNeeded | Boolean | android | If the remote device requires a response. |


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| updateValue(value) | void | both | update the data of value field |


---

## Modules.BLE.Service
> A collection of data and associated behaviors that accomplish a function or feature of a device.
> Extends Ti.Proxy
> Platforms: both

### Properties (unique: 5/8)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| characteristics | Array<Modules.BLE.Characteristic> | both | A list of characteristics discovered in this serv… |
| includedServices | Array<Modules.BLE.Service> | both | A list of included services discovered in this se… |
| isPrimary | Boolean | both | A Boolean value that indicates whether the type o… |
| peripheral | Modules.BLE.Peripheral | ios | The peripheral to which this service belongs. |
| uuid | String | both | The Bluetooth-specific UUID of the attribute. |




---

## Modules.Bluetooth
> Allows a Titanium application to use Bluetooth service.
> Extends Ti.Module
> Platforms: android
> Type: module

### Properties (unique: 4/18)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| address | String | android | The hardware address of the local Bluetooth adapt… |
| name | String | android | Friendly name of the local Bluetooth adapter. |
| scanMode | Number | android | The current Bluetooth scan mode of the local Blue… |
| state | Number | android | The current state of the local Bluetooth adapter. |

### Constants (11)
- **DEVICE_TYPE_\***: DEVICE_TYPE_CLASSIC, DEVICE_TYPE_DUAL, DEVICE_TYPE_LE, DEVICE_TYPE_UNKNOWN
- **SCAN_MODE_\***: SCAN_MODE_CONNECTABLE, SCAN_MODE_NONE
- **SCAN_MODE_CONNECTABLE_\***: SCAN_MODE_CONNECTABLE_DISCOVERABLE
- **STATE_\***: STATE_OFF, STATE_ON
- **STATE_TURNING_\***: STATE_TURNING_OFF, STATE_TURNING_ON


### Methods (17)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| cancelDiscovery(—) | Boolean | android | Cancels the current device discovery process. |
| checkBluetoothAddress(address) | Boolean | android | Validates a Bluetooth address, such as "00:43:A8:… |
| createServerSocket(params) | Modules.Bluetooth.BluetoothServerSocket | android | Creates an object of [BluetoothServerSocket](Modu… |
| disable(—) | Boolean | android | Disables the local Bluetooth adapter. |
| enable(—) | Boolean | android | Enables the local Bluetooth adapter. |
| ensureDiscoverable(interval) | void | android | Make the local device discoverable to other devic… |
| getName(—) | String | android | Gets the friendly Bluetooth name of the local Blu… |
| getPairedDevices(—) | PairedDevicesType | android | This method is use to get the devices that are pa… |
| getRemoteDevice(address) | Modules.Bluetooth.BluetoothDevice | android | Get a [BluetoothDevice](Modules.Bluetooth.Bluetoo… |
| isDiscovering(—) | Boolean | android | Determines whether the local Bluetooth adapter is… |
| isEnabled(—) | Boolean | android | Determines if Bluetooth is currently enabled and … |
| isRequiredPermissionsGranted(—) | Boolean | android | Determines whether the required permissions are g… |
| isSupported(—) | Boolean | android | Determines whether Bluetooth is supported on the … |
| requestAccessFinePermission(callback) | Promise<Titanium.Android.RequestPermissionAccessResult> | android | Displays a dialog requesting location permission … |
| requestPermissions(callback) | Promise<Titanium.Android.RequestPermissionAccessResult> | android | Displays a dialog requesting all permissions need… |
| setName(name) | void | android | Sets the friendly Bluetooth name of the local Blu… |
| startDiscovery(—) | Boolean | android | Starts the remote device discovery process. |

### Events (4)
| Event | Platform | Description |
|-------|----------|-------------|
| deviceFound | android | Fired when the local Bluetooth adapter discovers a device. |
| discoveryFinished | android | Fired when the local Bluetooth adapter finished discovery. |
| discoveryStarted | android | Fired when the local Bluetooth adapter started discovery. |
| stateChanged | android | Fired when the state of the local Bluetooth adapter changes. |

---

## Modules.Bluetooth.BluetoothDevice
> Represents a remote bluetooth device.
> Extends Ti.Proxy
> Platforms: android

### Properties (unique: 4/7)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| address | String | android | Address of the remote Bluetooth device. |
| name | String | android | Name of the remote Bluetooth device. |
| type | Number | android | Type of the remote Bluetooth device. |
| uUIDs | Array<String> | android | The supported UUIDs of the remote device. |


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| fetchUUIDs(—) | Boolean | android | Perform a service discovery on the remote device … |
| createSocket(uuid, secure) | Modules.Bluetooth.BluetoothSocket | android | Creates an RFCOMM Bluetooth socket. |

### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| fetchedUUIDs | android | Fired when the UUIDs of the remote device are received using SDP. |

---

## Modules.Bluetooth.BluetoothServerSocket
> A listening Bluetooth socket.
> Extends Ti.Proxy
> Platforms: android


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| close(—) | void | android | Closes the server socket. |
| isAccepting(—) | Boolean | android | Determines whether the server socket is currently… |
| startAccept(keepListening) | void | android | Inform the server socket to start accepting incom… |
| stopAccept(—) | void | android | Inform the server socket to stop accepting incomi… |

### Events (2)
| Event | Platform | Description |
|-------|----------|-------------|
| connectionReceived | android | Fired when the server socket receives an incoming connection. |
| error | android | Fired when a socket operation fails. |

---

## Modules.Bluetooth.BluetoothSocket
> A connected or connecting Bluetooth socket.
> Extends Ti.Proxy
> Platforms: android

### Properties (unique: 1/4)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| readBufferSize | Number | android | The size of the read buffer in bytes. By default,… |


### Methods (9)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| connect(—) | void | android | Starts the connection to the remote device. |
| isConnected(—) | Boolean | android | Determines whether there is an active connection … |
| isConnecting(—) | Boolean | android | Determines whether there is an ongoing connection… |
| cancelConnect(—) | void | android | Drops the ongoing connection attempt if in progre… |
| close(—) | void | android | Closes the socket. |
| getReadBufferSize(—) | Number | android | Get the size of the read buffer in bytes. |
| getRemoteDevice(—) | Modules.Bluetooth.BluetoothDevice | android | Get the remote device this socket is associated w… |
| setReadBufferSize(newReadBufferSize) | void | android | Sets the size of the read buffer in bytes. |
| write(buffer) | void | android | Sends an array of bytes over the socket. |

### Events (4)
| Event | Platform | Description |
|-------|----------|-------------|
| connected | android | Fired when the connection through the socket is established. |
| disconnected | android | Fired when connection to the socket is lost. |
| error | android | Fired when an operation fails. |
| receivedData | android | Fired when data is received on this socket. |

---

