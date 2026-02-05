# Scrolling views

## 1. ScrollView vs ScrollableView

| Feature          | ScrollView                     | ScrollableView                |
| ---------------- | ------------------------------ | ----------------------------- |
| Purpose          | Scrollable area of content     | Paging through multiple views |
| Scroll direction | Vertical and/or horizontal     | Horizontal only               |
| Content size     | `contentHeight`/`contentWidth` | Full-screen views             |
| Interaction      | Drag to scroll                 | Swipe to snap between pages   |
| Use case         | Long content, forms, images    | Image gallery, onboarding     |

## 2. ScrollView

### Create a ScrollView

```javascript
const scrollView = Ti.UI.createScrollView({
  width: 300,
  height: 200,
  contentWidth: Ti.UI.SIZE,   // Auto-fit to content
  contentHeight: Ti.UI.SIZE,  // Auto-fit to content
  backgroundColor: 'white'
});

// Add content
const content = Ti.UI.createView({
  width: 500,
  height: 500,
  backgroundColor: 'blue'
});

scrollView.add(content);
win.add(scrollView);
```
...
### ScrollView properties

| Property                                      | Description                                                         | Platform |
| --------------------------------------------- | ------------------------------------------------------------------- | -------- |
| `contentWidth` / `contentHeight`              | Size of the scrollable content area                                 | All      |
| `scrollType`                                  | `'vertical'` or `'horizontal'` (Android only - see below)           | Android  |
| `showHorizontalScrollIndicator`               | Show/hide horizontal scroll indicator                               | All      |
| `showVerticalScrollIndicator`                 | Show/hide vertical scroll indicator                                 | All      |
| `zoomScale` / `minZoomScale` / `maxZoomScale` | Zoom level (values 0-1)                                             | iOS      |
| `horizontalBounce` / `verticalBounce`         | Enable/disable bounce effect at edges                               | iOS      |
| `canCancelEvents`                             | Allow ScrollView to cancel touch events in children (default: true) | iOS      |
| `scrollable`                                  | Enable/disable scrolling                                            | All      |

### ScrollView events

```javascript
scrollView.addEventListener('scroll', (e) => {
  Ti.API.info('Scrolling...');
  Ti.API.info(`Content offset: x=${e.contentOffset.x} y=${e.contentOffset.y}`);
});

scrollView.addEventListener('dragEnd', (e) => {
  Ti.API.info('Drag ended');
  e.source.setContentOffset({ x: 0, y: 0 }, { animated: true });
});

scrollView.addEventListener('scrollEnd', (e) => {
  Ti.API.info('Scroll completely ended');
  e.source.setContentOffset({ x: 0, y: 0 }, { animated: true });
});
```
...
### Android ScrollView direction

Android ScrollView can be vertical or horizontal, not both. If you do not set `scrollType`, Android auto-detects: if width equals contentWidth it defaults to vertical; if height equals contentHeight it defaults to horizontal. If Titanium cannot determine the direction, it logs a warning.

```javascript
// Explicit horizontal scroll
const scrollView = Ti.UI.createScrollView({
  width: 300,
  height: 200,
  scrollType: 'horizontal',  // Android: horizontal only
  contentWidth: 600,  // Must be larger than width
  contentHeight: 200  // Same as height = no vertical scroll
});
```
...
## 3. ScrollableView

### Create a ScrollableView

```javascript
const view1 = Ti.UI.createView({ backgroundColor: '#123' });
const view2 = Ti.UI.createView({ backgroundColor: '#234' });
const view3 = Ti.UI.createView({ backgroundColor: '#345' });

const scrollableView = Ti.UI.createScrollableView({
  views: [view1, view2, view3],
  showPagingControl: true,
  pagingControlHeight: 30,
  pagingControlColor: 'blue'
});

win.add(scrollableView);
```
...
### ScrollableView events

```javascript
scrollableView.addEventListener('scroll', (e) => {
  Ti.API.info(`Current page: ${e.currentPage}`);
  Ti.API.info(`Views: ${e.view}`);  // View object reference
});

scrollableView.addEventListener('dragEnd', (e) => {
  Ti.API.info(`Drag ended, settled on page: ${e.currentPage}`);
});
```
...
### Image gallery

```javascript
const images = [];
for (let i = 1; i <= 10; i++) {
  images.push(Ti.UI.createImageView({
    image: `image${i}.jpg`,
    width: Ti.UI.FILL,
    height: Ti.UI.FILL
  }));
}

const gallery = Ti.UI.createScrollableView({
  views: images,
  showPagingControl: true
});
```

### Onboarding wizard

```javascript
const page1 = createOnboardingPage('Welcome', 'Get started with our app');
const page2 = createOnboardingPage('Features', 'Learn about key features');
const page3 = createOnboardingPage('Get Started', 'Create your account');

const onboarding = Ti.UI.createScrollableView({
  views: [page1, page2, page3],
  showPagingControl: true
});

const nextButton = Ti.UI.createButton({
  title: 'Next',
  bottom: 20
});
nextButton.addEventListener('click', () => {
  const current = onboarding.currentPage;
  if (current < 2) {
    onboarding.scrollToView(current + 1);
  } else {
    onboarding.close();
    showMainApp();
  }
});
```

### Long-form content

```javascript
const scrollView = Ti.UI.createScrollView({
  width: Ti.UI.FILL,
  height: Ti.UI.FILL,
  contentHeight: Ti.UI.SIZE,
  layout: 'vertical'
});

// Add many components
for (let i = 0; i < 50; i++) {
  scrollView.add(Ti.UI.createLabel({
    text: `Item ${i}`,
    top: 10,
    height: 40
  }));
}
```

### Scrollable form

```javascript
const formScrollView = Ti.UI.createScrollView({
  layout: 'vertical',
  height: Ti.UI.FILL
});

const nameField = Ti.UI.createTextField({
  hintText: 'Name',
  top: 10, height: 40
});

const emailField = Ti.UI.createTextField({
  hintText: 'Email',
  top: 10, height: 40
});

const submitButton = Ti.UI.createButton({
  title: 'Submit',
  top: 10
});

formScrollView.add(nameField);
formScrollView.add(emailField);
formScrollView.add(submitButton);
```
...
### ScrollableView

```javascript
// Move to page 2
scrollableView.scrollToView(1);

// Move to last page
scrollableView.scrollToView(scrollableView.views.length - 1);

// Get current page
const current = scrollableView.currentPage;
```

## 8. Detecting scroll position

```javascript
scrollView.addEventListener('scroll', (e) => {
  const { x, y } = e.contentOffset;

  // Detect near bottom
  const maxScroll = scrollView.contentHeight - scrollView.height;
  if (y > maxScroll - 50) {
    loadMoreContent();
  }
});
```

## Best practices

1. Use ScrollableView for paginated content (galleries, wizards)
2. Use ScrollView for continuous scrolling content (long forms, articles)
3. Specify dimensions explicitly on Android when possible
4. Consider performance with large datasets
5. Test on real devices; simulator behavior may differ
6. Use paging controls for ScrollableView to improve UX
