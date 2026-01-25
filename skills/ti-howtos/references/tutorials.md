# Titanium SDK Tutorials

Practical tutorials and guides for building real-world Titanium applications.

## Table of Contents
1. [RESTe - API Integration](#reste-api-integration)
2. [Camera App Tutorial](#camera-app-tutorial)
3. [Geolocation Tutorial](#geolocation-tutorial)
4. [Alloy Controller Chaining](#alloy-controller-chaining)
5. [Build Automation](#build-automation)

---

## RESTe - API Integration

### Overview

**RESTe** by Jason Kneen - A module for consuming web APIs in Titanium.

**Benefits:**
- Eliminates boilerplate HTTP code
- Auto-generates JavaScript API from config
- Supports Backbone.js Models/Collections in Alloy
- Works with any API (not just REST)

### Installation

```bash
npm install reste
```

### Basic Configuration

**alloy.js:**
```javascript
var reste = require("reste");
var api = new reste();

api.config({
    debug: true,                    // Console logging
    errorsAsObjects: true,          // Return errors as objects (1.4.5+)
    autoValidateParams: false,      // Throw error if params missing
    validatesSecureCertificate: false,
    timeout: 4000,
    url: "https://api.example.com/",  // Base URL
    requestHeaders: {
        "X-API-Key": "your-key-here",
        "Content-Type": "application/json"
    },
    methods: [
        {
            name: "getVideos",
            get: "videos"
        },
        {
            name: "getVideoById",
            get: "videos/"
        },
        {
            name: "createVideo",
            post: "videos"
        }
    ],
    onError: function(e, retry) {
        var dialog = Ti.UI.createAlertDialog({
            title: "Connection error",
            message: "Check your network and retry.",
            buttonNames: ['Retry']
        });
        dialog.addEventListener("click", function() {
            retry();
        });
        dialog.show();
    }
});
```

### Usage

**Auto-generated methods:**
```javascript
// Fetch single video
api.getVideoById({
    videoId: "abc123"
}, function(video) {
    Ti.API.info('Got video: ' + video.title);
});

// Create video
api.createVideo({
    body: {
        title: "My Video",
        categoryId: 2
    }
}, function(response) {
    Ti.API.info('Created: ' + response.id);
});
```

### Backbone.js Models/Collections

**Configuration:**
```javascript
api.config({
    // ... other config
    models: [{
        name: "video",
        id: "objectId",              // Primary key field
        read: "getVideo",
        create: "createVideo",
        update: "updateVideo",
        delete: "deleteVideo",
        collections: [{
            name: "videos",
            content: "results",      // Array wrapper in response
            read: "getVideos"
        }]
    }]
});
```

**In Alloy Controller:**
```javascript
// Fetch collection
Alloy.Collections.videos.fetch();

// Or fetch with parameters
Alloy.Collections.videos.fetch({
    data: {category: "sports"}
});
```

**In Alloy View:**
```xml
<TableView dataCollection="videos" onClick="selectVideo">
  <TableViewRow model="{objectId}">
    <Label class="title" text="{title}"/>
    <Label class="subtitle" text="{description}"/>
  </TableViewRow>
</TableView>
```

### Important Notes

- **Don't use `<Model>` or `<Collection>` tags** with RESTe
- RESTe creates models/collections automatically
- Use data-binding like normal Alloy collections
- Great for mocking data during UI development

### Mock Data (On-The-Fly)

```javascript
// Create model without API
var videoModel = api.createModel('video', {
    title: 'Test Video',
    description: 'Mock data'
});

// Create collection
var videoCollection = api.createCollection('videos', [
    {title: 'Video 1'},
    {title: 'Video 2'}
]);
```

### Resources

- **npm:** https://www.npmjs.com/package/reste
- **GitHub:** https://github.com/jasonkneen/reste

---

## Camera App Tutorial

### Basic Camera Access

```javascript
// Show camera
Ti.Media.showCamera({
    success: function(event) {
        var image = event.media;
        if (event.mediaType === Ti.Media.MEDIA_TYPE_PHOTO) {
            // Use the photo
            var imageView = Ti.UI.createImageView({
                image: image,
                width: 300,
                height: 300
            });
            win.add(imageView);
        }
    },
    cancel: function() {
        Ti.API.info('Camera canceled');
    },
    error: function(error) {
        var a = Ti.UI.createAlertDialog({title: 'Camera Error'});
        if (error.code === Ti.Media.NO_CAMERA) {
            a.setMessage('Device does not have camera');
        } else {
            a.setMessage('Unexpected error: ' + error.code);
        }
        a.show();
    },
    saveToPhotoGallery: true,
    allowEditing: true,
    mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
    videoQuality: Ti.Media.QUALITY_HIGH
});
```

### Photo Gallery

```javascript
// Open photo gallery
Ti.Media.openPhotoGallery({
    success: function(event) {
        var image = event.media;
        // Process selected image
    },
    cancel: function() {
        // User canceled
    },
    error: function(error) {
        // Handle error
    },
    mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO]
});
```

### Saving Images

```javascript
// Save to gallery
Ti.Media.saveToPhotoGallery({
    media: myImageBlob,
    success: function() {
        alert('Saved!');
    },
    error: function(e) {
        alert('Error: ' + e.error);
    }
});
```

---

## Geolocation Tutorial

### Basic Location

```javascript
// One-time location
if (Ti.Geolocation.locationServicesEnabled) {
    Ti.Geolocation.getCurrentPosition(function(e) {
        if (!e.error) {
            Ti.API.info('Lat: ' + e.coords.latitude);
            Ti.API.info('Lon: ' + e.coords.longitude);
        }
    });
}
```

### Continuous Tracking

```javascript
// Configure accuracy
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
Ti.Geolocation.distanceFilter = 10;  // Meters

// Track location changes
Ti.Geolocation.addEventListener('location', function(e) {
    if (!e.error) {
        var lat = e.coords.latitude;
        var lon = e.coords.longitude;
        updateMap(lat, lon);
    }
});
```

### Reverse Geocoding

```javascript
// Coordinates to address
Ti.Geolocation.reverseGeocoder(37.389569, -122.050212, function(e) {
    if (e.success) {
        e.places.forEach(function(place) {
            Ti.API.info(place.address);
            Ti.API.info(place.city);
            Ti.API.info(place.country);
        });
    }
});
```

---

## Alloy Controller Chaining

### Pattern Overview

Chain controller methods to pass data between Alloy controllers in a clean, maintainable way.

### Basic Pattern

**Parent Controller:**
```javascript
var childController = Alloy.createController('child', {
    data: someData,
    onAction: function(result) {
        // Handle result from child
        Ti.API.info('Child returned: ' + result);
    }
});

childController.on('customEvent', function(data) {
    // Handle child events
});

childController.open();
```

**Child Controller:**
```javascript
var args = arguments[0] || {};

// Access parent data
var parentData = args.data;

// Call parent callback
function notifyParent(result) {
    if (args.onAction) {
        args.onAction(result);
    }
}

// Trigger parent events
function triggerEvent(data) {
    $.trigger('customEvent', data);
}
```

### Benefits

- **Clean separation** - Controllers remain independent
- **Reusable** - Child works in different contexts
- **Testable** - Can mock parent callbacks
- **Maintainable** - Clear data flow

---

## Build Automation with Fastlane

### Overview

Automate building and deploying Titanium apps with Fastlane.

### Installing Fastlane

```bash
# Using Homebrew (macOS)
brew install fastlane

# Or using Ruby gems
sudo gem install fastlane -NV
```

### Basic Fastfile

**fastlane/Fastfile:**
```ruby
platform :ios do
  desc "Build and deploy to TestFlight"
  lane :beta do
    # Build the app
    sh "ti build -p ios -F"

    # Upload to TestFlight
    upload_to_testflight(
      skip_waiting_for_build_processing: true
    )
  end

  desc "Build for development"
  lane :dev do
    sh "ti build -p ios -T developer"
  end
end

platform :android do
  desc "Build Android APK"
  lane :build do
    sh "ti build -p android -A"
  end

  desc "Deploy to Play Store (Beta)"
  lane :beta do
    # Build
    sh "ti build -p android -F"

    # Upload to Play Store
    upload_to_play_store(
      track: 'beta',
      apk: 'app/build/android/bin/app.apk'
    )
  end
end
```

### Usage

```bash
# iOS Beta
fastlane ios beta

# Android Build
fastlane android build

# Android Beta
fastlane android beta
```

### Advanced Options

**Multiple environments:**
```ruby
lane :staging do
  sh "ti build -p ios -T dist --config ../staging.js"
end

lane :production do
  sh "ti build -p ios -T dist --config ../production.js"
end
```

**Environment-specific configs:**
```javascript
// staging.js
module.exports = {
    apiURL: 'https://staging-api.example.com',
    analyticsEnabled: true
};

// production.js
module.exports = {
    apiURL: 'https://api.example.com',
    analyticsEnabled: true
};
```

---

## Additional Tutorials

### Alloy Boilerplates

See **Titanium_Boilerplates** folder for:
- TypeScript boilerplates
- App templates
- Project scaffolding

### Complete Sample Apps

- **ToDoList** - CommonJS module pattern example
- **Tweetanium** - Namespaced pattern example
- **KitchenSink** - Complete API reference (built with Alloy)

---

## Resources

- **RESTe:** https://github.com/jasonkneen/reste
- **Fastlane:** https://fastlane.tools
- **Alloy Framework:** See alloy-guides skill
- **Sample Apps:** https://github.com/appcelerator-samples
