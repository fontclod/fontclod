Events
======
Fontclod.on('event[ event]', cb)
Fontclod.emit('event', arguments)
copy
paste
change
zoom
load
save
beforesave
unload
beforeunload
draw
beforedraw
glyphadd
glyphremove
pointadd
pointremove
pointclick
pointmove
pointselect

guideadd
guideremove
guideclick
guidemove
guideselect

handledelete
handleclick
handlemove
handleselect


Widgets
=======

Fontclod.add('widget', options)

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

Fontclod.add('menu', options)


Options:

* title
* items - an array of item hashes


Points
======
Fontclod.add('point', {
        x: 0,
        y: 0,
        contour: 0
});

Fontclod.get('contours', {
});

Fontclod.add('point type', {
        name: '',

        handles: {
                left: true,
                right: true
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