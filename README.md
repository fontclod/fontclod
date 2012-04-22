Fontclod
========

Fontclod is a font editor for the web. Visit [the website][1] for a live example.

[1]: http://fontclod.com/

Usage
-----

Since Fontclod is in alpha, a lot of what is here may be changing soon. 
But here is a rundown of current basic usage:

### Load & Save

To save a file, on the menu click on <kbd>File > Save</kbd>. 
You will then be presented with a textbox full of code. 
Copy this code into a plain text editor like TextEdit, Notepad, or Gedit. 
Save this with any name you desire, optionally appending ".clod" to the end.

Loading is much the reverse. Click <kbd>File > Load</kbd>, and paste 
the code into the box that appears.

### Add or Remove Glyphs

Adding glyphs is done pressing the <kbd>+</kbd> at the bottom of the glyph 
list on the right, and choosing a name for the glyph. To remove a glyph, 
select the glyph, and press the <kbd>-</kbd> button at the bottom of the glyph list.

You can change a glyph's name by double clicking its name in the list.

### Selecting and Moving Points

Click on a point to select it. Holding <kbd>shift</kbd> allows you to select more points. 
You can select handles or points. Click and drag part of your selection to move it. 
You can nudge your selection with your arrow keys, and holding down <kbd>shift</kbd> 
will nudge ten units instead of one. Right now there is no box selection implemented.

### Placing and Removing Points

To place points, at present, hold <kbd>Ctrl</kbd> and click on the canvas. 
To close a contour, select one of its end points, hold <kbd>Ctrl</kbd> and click 
on the other end point. Add a handle by pulling on the red or blue circle 
surrounding a point. Remove points or handles by selecting them and pressing 
<kbd>backspace</kbd>.

### Undo, Redo

Undo and redo are available from the <kbd>Edit</kbd> menu or by pressing 
<samp><kbd>ctrl</kbd> + <kbd>z</kbd></samp>, or 
<samp><kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>z</kbd></samp>, respectively.

### Scrolling

To move around the viewport, press <kbd>space</kbd> and move your mouse 
around the screen.


Things we're working on
-----------------------

* Multiple tools
* Box Select
* Zoom
* More things
