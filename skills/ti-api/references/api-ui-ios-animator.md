# Ti.UI.iOS Animator & Physics API Reference

## Ti.UI.iOS.AnchorAttachmentBehavior
> Dynamic behavior to support connections between an anchor point and an item.
> Extends Ti.Proxy
> Platforms: ios

An anchor attachment behavior creates a dynamic connection between an anchor point and an item.
To define an anchor attachment behavior:

  1. Use the <Titanium.UI.iOS.createAnchorAttachmentBehavior> method to create a behavior.
  2. Set the [anchor](Titanium.UI.iOS.AnchorAttachmentBehavior.anchor) and
     [item](Titanium.UI.iOS.AnchorAttachmentBehavior.item) properties.
  3. Add the behavior to the [Animator object](Titanium.UI.iOS.Animator).

To create a dynamic connection between two items, use <Titanium.UI.iOS.ViewAttachmentBehavior>.

### Properties (unique: 6/8)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| anchor | Point | (0,0) | ios | Anchor point for the attachment behavior relative to the animator's coordinate … |
| damping | Number | 0 | ios | Amount of damping to apply to the attachment behavior. |
| distance | Number | 0 | ios | Distance, in points, between the two attachment points. |
| frequency | Number | 0 | ios | Frequency of oscillation for the behavior. |
| item | Ti.UI.View | — | ios | Item to connect to use the attachment behavior. |
| offset | Point | (0,0) | ios | Offset from the center point of the item for the attachment. |




### Related Types

#### Point
> A pair of coordinates used to describe the location of a <Titanium.UI.View>.

| Property | Type | Description |
|----------|------|-------------|
| x | Number \| String | The x-axis coordinate of this point. |
| y | Number \| String | The y-axis coordinate of this point. |

---

## Ti.UI.iOS.Animator
> Provides support for the built-in iOS dynamic animations
> Extends Ti.Proxy
> Platforms: ios

The animator provides physics-related capabilities and animations using the iOS physics engine.
Each animator is independent of other animators you create.  An animator is comprised of
behaviors and items. Behaviors define the rules of the animation, while items are the
view objects to be animated. An item in the animator can be given
multiple behaviors as long as those behaviors belong to the same animator.

To use these dynamic animations, first create the items to animate, then:

**1.** Create an animator using the <Titanium.UI.iOS.createAnimator> method. 

**2.** Set the [referenceView](Titanium.UI.iOS.Animator.referenceView) property to establish the
   coordinate system for the animations.

**3.** Create and add items to one or more of the following behaviors:


*(See full overview in titanium-docs)*

### Properties (unique: 3/5)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| behaviors | Array<Titanium.Proxy> | — | ios | Behaviors associated with this animator. |
| referenceView | Ti.UI.View | — | ios | Titanium View object to initialize as the reference view for the animator. |
| running | Boolean | — | ios | Returns `true` if the animator is running else `false`. |


### Methods (6)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| addBehavior(behavior) | void | ios | Adds a dynamic behavior to the animator. |
| removeAllBehaviors(—) | void | ios | Removes all behaviors from this animator. |
| removeBehavior(behavior) | void | ios | Removes the specified behavior from the animator. |
| startAnimator(—) | void | ios | Starts the animation behaviors. |
| stopAnimator(—) | void | ios | Stops the animation behaviors. |
| updateItemUsingCurrentState(item) | void | ios | Updates the animator's state information with the current state of the specifie… |

### Events (2)
| Event | Platform | Description |
|-------|----------|-------------|
| pause | ios | Fired when the animator paused its animations. |
| resume | ios | Fired when the animator resumes its animations. |

---

## Ti.UI.iOS.CollisionBehavior
> Dynamic behavior to support collisions between items and boundaries.
> Extends Ti.Proxy
> Platforms: ios

A collision behavior specifies the behavior when items collide with each other and boundaries.
To define a collision behavior:

  1. Use the <Titanium.UI.iOS.createCollisionBehavior> method to create and define the behavior.
  2. Use the [addItem](Titanium.UI.iOS.CollisionBehavior.addItem) method to add items to the behavior.
  3. Use the [addBoundary](Titanium.UI.iOS.CollisionBehavior.addBoundary) method to add custom
     boundaries for the item to collide with. By default, the behavior uses the Animator
     object's reference view as the boundary.
  4. Add the behavior to an [Animator object](Titanium.UI.iOS.Animator).

### Properties (unique: 5/7)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| boundaryIdentifiers | Array<BoundaryIdentifier> | — | ios | Boundary identfiers added to this behavior. |
| collisionMode | Number | <Titanium.UI.iOS.COLLISION_MODE_ALL> | ios | Specifies the collision behavior. |
| items | Array<Titanium.UI.View> | — | ios | Items added to this behavior. |
| referenceInsets | Padding | All insets are zero. | ios | Insets to apply when using the animator's reference view as the boundary. |
| treatReferenceAsBoundary | Boolean | true | ios | Use the animator's reference view as the boundary. |


### Methods (5)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| addBoundary(boundary) | void | ios | Adds a boundary to this behavior. |
| addItem(item) | void | ios | Adds an item to this behavior. |
| removeAllBoundaries(—) | void | ios | Removes all boundaries from this behavior. |
| removeBoundary(boundary) | void | ios | Removes the specified boundary from this behavior. |
| removeItem(item) | void | ios | Removes the specified item from this behavior. |

### Events (2)
| Event | Platform | Description |
|-------|----------|-------------|
| boundarycollision | ios | Fired when an item collides with a boundary. |
| itemcollision | ios | Fired when two items collide. |

### Related Types

#### BoundaryIdentifier
> Dictionary to specify a boundary identifier for <Titanium.UI.iOS.CollisionBehavior.addBoundary>.

| Property | Type | Description |
|----------|------|-------------|
| identifier | String | Arbitrary identifier for the boundary |
| point1 | Point | Start point for the boundary |
| point2 | Point | End point for the boundary |

#### Padding
> Dictionary object of parameters for the padding/insets applied to all kinds of views.

| Property | Type | Description |
|----------|------|-------------|
| left | Number | Left padding/inset |
| right | Number | Right padding/inset |
| top | Number | Top padding/inset |
| bottom | Number | Bottom padding/inset |

#### Point
> A pair of coordinates used to describe the location of a <Titanium.UI.View>.

| Property | Type | Description |
|----------|------|-------------|
| x | Number \| String | The x-axis coordinate of this point. |
| y | Number \| String | The y-axis coordinate of this point. |

---

## Ti.UI.iOS.DynamicItemBehavior
> Base dynamic configuration for an item.
> Extends Ti.Proxy
> Platforms: ios

A dynamic item behavior configures the physics attributes for one or more items. These
attributes, such as density and resistance, affects the behavior of the object when other behaviors,
such as push forces or collisions, are applied to it.  To define a dynamic behavior for an item:

  1. Use the <Titanium.UI.iOS.createDynamicItemBehavior> method to create and define the behavior.
  2. Use the [addItem](Titanium.UI.iOS.DynamicItemBehavior.addItem) method to add items to the behavior.
  3. Add the behavior to an [Animator object](Titanium.UI.iOS.Animator).

### Properties (unique: 7/9)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| allowsRotation | Boolean | true | ios | Specifies if this item can rotate. |
| angularResistance | Number | 0 | ios | Specifies the angular resistance of this item. |
| density | Number | 1 | ios | Specifies the relative mass density of this item. |
| elasticity | Number | 0 | ios | Specifies the elasticity applied to collisions for this item. |
| friction | Number | 0 | ios | Specifies the linear resistance of the item when it slides against another item. |
| items | Array<Titanium.UI.View> | — | ios | Items added to this behavior. |
| resistance | Number | 0 | ios | Specifies the linear resistance of this item which reduces linear velocity over… |


### Methods (6)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| addAngularVelocityForItem(item, velocity) | void | ios | Adds a specified angular velocity for the item. |
| addItem(item) | void | ios | Adds an item to this behavior. |
| addLinearVelocityForItem(item, velocity) | void | ios | Adds a specified linear velocity for the item. |
| angularVelocityForItem(item) | Number | ios | Returns the angular velocity of the item. |
| linearVelocityForItem(item) | Point | ios | Returns the linear velocity of the item. |
| removeItem(item) | void | ios | Removes the specified item from this behavior. |


### Related Types

#### Point
> A pair of coordinates used to describe the location of a <Titanium.UI.View>.

| Property | Type | Description |
|----------|------|-------------|
| x | Number \| String | The x-axis coordinate of this point. |
| y | Number \| String | The y-axis coordinate of this point. |

---

## Ti.UI.iOS.GravityBehavior
> Gravitational force to apply to an item.
> Extends Ti.Proxy
> Platforms: ios

A gravity behavior configures the gravity vector of one or more items. To define a gravity
behavior:

  1. Use the <Titanium.UI.iOS.createGravityBehavior> method to create and define the behavior.
  2. To define a gravity vector, either set the
     [angle](Titanium.UI.iOS.GravityBehavior.angle) and
     [magnitude](Titanium.UI.iOS.GravityBehavior.magnitude) properties, or set the
     [gravityDirection](Titanium.UI.iOS.GravityBehavior.gravityDirection) property.
  3. Use the [addItem](Titanium.UI.iOS.GravityBehavior.addItem) method to add items to the behavior.
  4. Add the behavior to an [Animator object](Titanium.UI.iOS.Animator).

You can only define one gravity behavior per animator.

### Properties (unique: 4/6)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| angle | Number | 0 | ios | Specifies the angle of the gravity vector in radians. |
| gravityDirection | Point | (0, 0) | ios | Specifies the direction of the gravity vector as an x, y pair. |
| items | Array<Titanium.UI.View> | — | ios | Items added to this behavior. |
| magnitude | Number | 0 | ios | Specifies the magnitude of the gravity vector. |


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| addItem(item) | void | ios | Adds an item to this behavior. |
| removeItem(item) | void | ios | Removes the specified item from this behavior. |


### Related Types

#### Point
> A pair of coordinates used to describe the location of a <Titanium.UI.View>.

| Property | Type | Description |
|----------|------|-------------|
| x | Number \| String | The x-axis coordinate of this point. |
| y | Number \| String | The y-axis coordinate of this point. |

---

## Ti.UI.iOS.PushBehavior
> Continuous or instantaneous force to apply to an item.
> Extends Ti.Proxy
> Platforms: ios

A push behavior configures the continuous or instaneous force to apply to one or more items. To
define a push behavior:

  1. Use the <Titanium.UI.iOS.createPushBehavior> method to create and define the behavior.
  2. To define a force vector, either set the
     [angle](Titanium.UI.iOS.PushBehavior.angle) and
     [magnitude](Titanium.UI.iOS.PushBehavior.magnitude) properties, or set the
     [pushDirection](Titanium.UI.iOS.PushBehavior.pushDirection) property.
  3. Use the [addItem](Titanium.UI.iOS.PushBehavior.addItem) method to add items to the behavior.
  4. Add the behavior to an [Animator object](Titanium.UI.iOS.Animator).

### Properties (unique: 6/8)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| active | Boolean | true | ios | State of the push behavior's force. |
| angle | Number | 0 | ios | Specifies the angle of the force vector in radians. |
| items | Array<Titanium.UI.View> | — | ios | Items added to this behavior. |
| magnitude | Number | 0 | ios | Specifies the magnitude of the force vector. |
| pushDirection | Point | (0,0) | ios | Specifies the direction of the force vector as an x, y pair. |
| pushMode | Number | <Titanium.UI.iOS.PUSH_MODE_CONTINUOUS> | ios | Specifies the push mode. |


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| addItem(item) | void | ios | Adds an item to this behavior. |
| removeItem(item) | void | ios | Removes the specified item from this behavior. |


### Related Types

#### Point
> A pair of coordinates used to describe the location of a <Titanium.UI.View>.

| Property | Type | Description |
|----------|------|-------------|
| x | Number \| String | The x-axis coordinate of this point. |
| y | Number \| String | The y-axis coordinate of this point. |

---

## Ti.UI.iOS.SnapBehavior
> Dynamic behavior defining an item's movement to a specific point.
> Extends Ti.Proxy
> Platforms: ios

A snap behavior specifies how an item moves towards a specified point with a spring-like
effect, ending with an oscillation.

  1. Use the <Titanium.UI.iOS.createSnapBehavior> method to create the behavior.
  2. Set the [item](Titanium.UI.iOS.SnapBehavior.item) and
     [snapPoint](Titanium.UI.iOS.SnapBehavior.snapPoint) properties.
  3. Add the behavior to an [Animator object](Titanium.UI.iOS.Animator).

### Properties (unique: 3/5)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| damping | Number | 0.5 | ios | Specifies the amount of oscillation during the conclusion of the snap. |
| item | Ti.UI.View | — | ios | Item to add to this behavior. |
| snapPoint | Point | (0,0) | ios | Specifies the point to snap to. |




### Related Types

#### Point
> A pair of coordinates used to describe the location of a <Titanium.UI.View>.

| Property | Type | Description |
|----------|------|-------------|
| x | Number \| String | The x-axis coordinate of this point. |
| y | Number \| String | The y-axis coordinate of this point. |

---

## Ti.UI.iOS.ViewAttachmentBehavior
> Dynamic behavior to support connections between two items.
> Extends Ti.Proxy
> Platforms: ios

A view attachment behavior creates a dynamic connection between two items. To define a view
attachment behavior:

  1. Use the <Titanium.UI.iOS.createViewAttachmentBehavior> method to create and define a behavior.
  2. Set the [anchorItem](Titanium.UI.iOS.ViewAttachmentBehavior.anchorItem) and
     [item](Titanium.UI.iOS.ViewAttachmentBehavior.item) properties.
  3. Add the behavior to the [Animator object](Titanium.UI.iOS.Animator).

To create a dynamic connection between an item and anchor point, use <Titanium.UI.iOS.AnchorAttachmentBehavior>.

### Properties (unique: 7/9)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| anchorItem | Ti.UI.View | — | ios | Item to use as the anchor in this behavior. |
| anchorOffset | Point | (0,0) | ios | Offset from the center point of the anchor item for the attachment. |
| damping | Number | 0 | ios | Amount of damping to apply to the attachment behavior. |
| distance | Number | 0 | ios | Distance, in points, between the two attachment points. |
| frequency | Number | 0 | ios | Frequency of oscillation for the behavior. |
| item | Ti.UI.View | — | ios | Item to connect to use the attachment behavior. |
| itemOffset | Point | (0,0) | ios | Offset from the center point of the item for the attachment. |




### Related Types

#### Point
> A pair of coordinates used to describe the location of a <Titanium.UI.View>.

| Property | Type | Description |
|----------|------|-------------|
| x | Number \| String | The x-axis coordinate of this point. |
| y | Number \| String | The y-axis coordinate of this point. |

---

