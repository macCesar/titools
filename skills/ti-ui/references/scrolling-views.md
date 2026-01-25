# Scrolling Views

## 1. ScrollView vs ScrollableView

| Feature | ScrollView | ScrollableView |
|---------|-----------|----------------|
| Purpose | Scrollable area of content | Paging through multiple views |
| Scroll Direction | Vertical and/or horizontal | Horizontal only |
| Content Size | `contentHeight`/`contentWidth` | Full-screen views |
| User Interaction | Drag to scroll | Swipe to snap between pages |
| Use Case | Long content, forms, images | Image gallery, onboarding wizard |

## 2. ScrollView

### Creating a ScrollView

```javascript
var scrollView = Ti.UI.createScrollView({
  width: 300,
  height: 200,
  contentWidth: Ti.UI.SIZE,   // Auto-fit to content
  contentHeight: Ti.UI.SIZE,  // Auto-fit to content
  backgroundColor: 'white'
});

// Add content
var content = Ti.UI.createView({
  width: 500,
  height: 500,
  backgroundColor: 'blue'
});

scrollView.add(content);
win.add(scrollView);
```

### ScrollView Properties

| Property | Description | Platform |
|----------|-------------|----------|
| `contentWidth` | Width of scrollable content | Both |
| `contentHeight` | Height of scrollable content | Both |
| `showHorizontalScrollIndicator` | Show horizontal scrollbar | Both |
| `showVerticalScrollIndicator` | Show vertical scrollbar | Both |
| `horizontalBounce` | Bounce effect at horizontal end | iOS |
| `verticalBounce` | Bounce effect at vertical end | iOS |
| `scrollType` | "vertical" or "horizontal" (Android only) | Android |
| `canCancelEvents` | ScrollView handles events (iOS default) | iOS |
| `zoomScale` | Current zoom level (0-1) | Both |
| `minZoomScale` | Minimum zoom level | Both |
| `maxZoomScale` | | Both |

### ScrollView Events

```javascript
scrollView.addEventListener('scroll', function(e) {
  Ti.API.info('Scrolling...');
  Ti.API.info('Content offset: x=' + e.contentOffset.x + ' y=' + e.contentOffset.y);
});

scrollView.addEventListener('dragEnd', function(e) {
  Ti.API.info('Drag ended');
  e.source.setContentOffset({ x: 0, y: 0 }, { animated: true });
});

scrollView.addEventListener('scrollEnd', function(e) {
  Ti.API.info('Scroll completely ended');
  e.source.setContentOffset({ x: 0, y: 0 }, { animated: true });
});
```

### ScrollView Methods

```javascript
// Scroll to position
scrollView.scrollTo(100, 200);

// Scroll to bottom
scrollView.scrollToBottom();

// Scroll to top
scrollView.scrollToTop();
```

### Android ScrollView Direction

Android ScrollView can be vertical OR horizontal, not both:

```javascript
// Explicit horizontal scroll
var scrollView = Ti.UI.createScrollView({
  width: 300,
  height: 200,
  scrollType: 'horizontal',  // Android: horizontal only
  contentWidth: 600,  // Must be larger than width
  contentHeight: 200  // Same as height = no vertical scroll
});
```

If `scrollType` not specified:
- `width` == `contentWidth` → defaults to "vertical"
- `height` == `contentHeight` → defaults to "horizontal"
- Otherwise → warning: "Scroll direction could not be determined"

## 3. ScrollableView

### Creating a ScrollableView

```javascript
var view1 = Ti.UI.createView({ backgroundColor: '#123' });
var view2 = Ti.UI.createView({ backgroundColor: '#234' });
var view3 = Ti.UI.createView({ backgroundColor: '#345' });

var scrollableView = Ti.UI.createScrollableView({
  views: [view1, view2, view3],
  showPagingControl: true,
  pagingControlHeight: 30,
  pagingControlColor: 'blue'
});

win.add(scrollableView);
```

### ScrollableView Properties

| Property | Description |
|----------|-------------|
| `views` | Array of views to display |
| `showPagingControl` | Show dots indicator (default: false) |
| `pagingControlColor` | Background color of paging control area |
| `pagingControlHeight` | Height of paging control area |
| `pagingControlTimeout` | Auto-hide paging control after N ms |
| `currentPage` | Current page index (0-based) |
| `cacheSize` | Number of views to pre-render (iOS only) |

### ScrollableView Methods

```javascript
// Scroll to specific view (by index or reference)
scrollableView.scrollToView(1);  // Second page

// Add view
scrollableView.addView(view4);

// Remove view
scrollableView.removeView(view1);
```

### ScrollableView Events

```javascript
scrollableView.addEventListener('scroll', function(e) {
  Ti.API.info('Current page: ' + e.currentPage);
  Ti.API.info('Views: ' + e.view);  // View object reference
});

scrollableView.addEventListener('dragEnd', function(e) {
  Ti.API.info('Drag ended, settled on page: ' + e.currentPage);
});
```

## 4. Platform Differences

### ScrollView

**iOS**:
- Supports bidirectional scrolling (vertical AND horizontal)
- Bounce effect (can be disabled)
- Pinch-to-zoom supported

**Android**:
- Unidirectional scrolling (vertical OR horizontal)
- No bounce effect
- `scrollType` required when dimensions ambiguous

### ScrollableView

**iOS**:
- `cacheSize` property for performance tuning
- Smoother page transitions

**Android**:
- Basic paging functionality
- May experience performance issues with many complex views

## 5. Common Use Cases

### Image Gallery

```javascript
var images = [];
for (var i = 1; i <= 10; i++) {
  images.push(Ti.UI.createImageView({
    image: 'image' + i + '.jpg',
    width: Ti.UI.FILL,
    height: Ti.UI.FILL
  }));
}

var gallery = Ti.UI.createScrollableView({
  views: images,
  showPagingControl: true
});
```

### Onboarding Wizard

```javascript
var page1 = createOnboardingPage('Welcome', 'Get started with our app');
var page2 = createOnboardingPage('Features', 'Learn about key features');
var page3 = createOnboardingPage('Get Started', 'Create your account');

var onboarding = Ti.UI.createScrollableView({
  views: [page1, page2, page3],
  showPagingControl: true
});

var nextButton = Ti.UI.createButton({
  title: 'Next',
  bottom: 20
});
nextButton.addEventListener('click', function() {
  var current = onboarding.currentPage;
  if (current < 2) {
    onboarding.scrollToView(current + 1);
  } else {
    onboarding.close();
    showMainApp();
  }
});
```

### Long Form Content

```javascript
var scrollView = Ti.UI.createScrollView({
  width: Ti.UI.FILL,
  height: Ti.UI.FILL,
  contentHeight: Ti.UI.SIZE,
  layout: 'vertical'
});

// Add many components
for (var i = 0; i < 50; i++) {
  scrollView.add(Ti.UI.createLabel({
    text: 'Item ' + i,
    top: 10,
    height: 40
  }));
}
```

### Scrollable Form

```javascript
var formScrollView = Ti.UI.createScrollView({
  layout: 'vertical',
  height: Ti.UI.FILL
});

var nameField = Ti.UI.createTextField({
  hintText: 'Name',
  top: 10, height: 40
});

var emailField = Ti.UI.createTextField({
  hintText: 'Email',
  top: 10, height: 40
});

var submitButton = Ti.UI.createButton({
  title: 'Submit',
  top: 10
});

formScrollView.add(nameField);
formScrollView.add(emailField);
formScrollView.add(submitButton);
```

## 6. Performance Considerations

### ScrollView Performance

**DO**:
- Use `contentWidth`/`contentHeight: Ti.UI.SIZE` for auto-sizing
- Keep content reasonably sized
- Use `canCancelEvents: true` for better touch handling

**DON'T**:
- Add WebViews inside ScrollView (poor performance)
- Make content extremely large (memory issues)
- Add too many nested views

### ScrollableView Performance

**DO**:
- Pre-define views array when creating
- Use simple views for pages
- Keep `cacheSize` reasonable (iOS)

**DON'T**:
- Dynamically add/remove many views
- Use complex layouts per page
- Include heavy content per page

## 7. Scrolling to Position

### ScrollView

```javascript
// Scroll to specific point
scrollView.setContentOffset({
  x: 50,
  y: 100
}, { animated: true });

// Scroll programmatically
scrollView.scrollTo(50, 100);
```

### ScrollableView

```javascript
// Move to page 2
scrollableView.scrollToView(1);

// Move to last page
scrollableView.scrollToView(scrollableView.views.length - 1);

// Get current page
var current = scrollableView.currentPage;
```

## 8. Detecting Scroll Position

```javascript
scrollView.addEventListener('scroll', function(e) {
  var x = e.contentOffset.x;
  var y = e.contentOffset.y;

  // Detect near bottom
  var maxScroll = scrollView.contentHeight - scrollView.height;
  if (y > maxScroll - 50) {
    loadMoreContent();
  }
});
```

## Best Practices

1. **Use ScrollableView** for paginated content (galleries, wizards)
2. **Use ScrollView** for continuous scrolling content (long forms, articles)
3. **Specify dimensions** explicitly on Android when possible
4. **Consider performance** with large datasets
5. **Test on real devices** - simulator behavior may differ
6. **Use paging controls** for ScrollableView to improve UX
