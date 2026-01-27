# Scrolling Views

## Table of Contents

- [Scrolling Views](#scrolling-views)
  - [Table of Contents](#table-of-contents)
  - [1. ScrollView vs ScrollableView](#1-scrollview-vs-scrollableview)
  - [2. ScrollView](#2-scrollview)
    - [Creating a ScrollView](#creating-a-scrollview)
    - [ScrollView Events](#scrollview-events)
    - [Android ScrollView Direction](#android-scrollview-direction)
  - [3. ScrollableView](#3-scrollableview)
    - [Creating a ScrollableView](#creating-a-scrollableview)
    - [ScrollableView Events](#scrollableview-events)
    - [Image Gallery](#image-gallery)
    - [Onboarding Wizard](#onboarding-wizard)
    - [Long Form Content](#long-form-content)
    - [Scrollable Form](#scrollable-form)
    - [ScrollableView](#scrollableview)
  - [8. Detecting Scroll Position](#8-detecting-scroll-position)
  - [Best Practices](#best-practices)

---

## 1. ScrollView vs ScrollableView

| Feature          | ScrollView                     | ScrollableView                   |
| ---------------- | ------------------------------ | -------------------------------- |
| Purpose          | Scrollable area of content     | Paging through multiple views    |
| Scroll Direction | Vertical and/or horizontal     | Horizontal only                  |
| Content Size     | `contentHeight`/`contentWidth` | Full-screen views                |
| User Interaction | Drag to scroll                 | Swipe to snap between pages      |
| Use Case         | Long content, forms, images    | Image gallery, onboarding wizard |

## 2. ScrollView

### Creating a ScrollView

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
### ScrollView Events

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
### Android ScrollView Direction

Android ScrollView can be vertical OR horizontal, not both:

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

### Creating a ScrollableView

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
### ScrollableView Events

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
### Image Gallery

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

### Onboarding Wizard

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

### Long Form Content

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

### Scrollable Form

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

## 8. Detecting Scroll Position

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

## Best Practices

1. **Use ScrollableView** for paginated content (galleries, wizards)
2. **Use ScrollView** for continuous scrolling content (long forms, articles)
3. **Specify dimensions** explicitly on Android when possible
4. **Consider performance** with large datasets
5. **Test on real devices** - simulator behavior may differ
6. **Use paging controls** for ScrollableView to improve UX
