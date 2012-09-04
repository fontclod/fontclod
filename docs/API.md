Events
======
```js
Fontclod.on('event[ event]', cb)
```
```js
Fontclod.emit('event', arguments)
```

Fontclod
--------
* copy
* paste
* change
* zoom
* load
* unload
* beforeunload
* save
* beforesave
* draw
* beforedraw

Glyphs
------
* glyphadd
* glyphremove

Points
------
* pointadd
* pointremove
* pointclick
* pointmove
* pointselect

Guides
------
* guideadd
* guideremove
* guideclick
* guidemove
* guideselect

Handles
-------
* handledelete
* handleclick
* handlemove
* handleselect


Widgets
=======
```js
Fontclod.add('widget', options)
```

Options:

* title
* elements
* visible: 'always' | 'optional'
* defaultPosition: 'left' | 'bottom' | 'right'
* dimensions:
        * width
        * height

Menus
=====
```js
Fontclod.add('menu', options)
```

Options:

* title
* items - an array of item hashes


Points
======
```js
Fontclod.add('point', {
        x: 0,
        y: 0,
        contour: 0
});
```
```js
Fontclod.get('contours', {
});
```
```js
Fontclod.add('point type', {
        name: '',

        handles: {
                left: true, // true, false, -1; -1 mirrors the opposing handle
                right: -1
        },

        // ctx: canvas context, data: point data, points: points on this curve
        /*
                data: {
                        index: 0 // index in the connected points
                }
        */
        draw: function(ctx, data, points) {
        }
});
```