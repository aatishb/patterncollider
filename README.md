# Pattern Collider

- [Credits](https://github.com/aatishb/patterncollider#credits)
- [What Is This?](https://github.com/aatishb/patterncollider#what-is-this)
- [How It Works](https://github.com/aatishb/patterncollider#how-it-works)
- [Instructions](https://github.com/aatishb/patterncollider#instructions)
	- [Interaction](https://github.com/aatishb/patterncollider#interaction)
	- [Pattern](https://github.com/aatishb/patterncollider#pattern-settings)
	- [Size](https://github.com/aatishb/patterncollider#size)
	- [Color](https://github.com/aatishb/patterncollider#color)	
- [References](https://github.com/aatishb/patterncollider#references)

## Credits

Pattern Collider is created by [Aatish Bhatia](https://aatishb.com/) in collaboration with [Henry Reich](https://www.minutephysics.com/).

Special thanks to [Arkarup Banerjee](https://www.arkarup.com/), [Shefali Nayak](https://shefalinayak.com/), [Vijay Ravikumar](https://this-vijay.github.io/), and [Connie Sun](https://www.cartoonconnie.com/) for their helpful feedback & suggestions.

## What Is This?

Pattern Collider is a tool for creating quasiperiodic tiling patterns. It's like a mathematical microscope that you can use to explore intricate & unusual patterns. Every pattern that you create with Pattern Collider has a custom URL that you can bookmark & share. Learn more about how it works by watching the Minute Physics video.

VIDEO SCREENSHOT

### What are Quasiperiodic Patterns?

Quasiperiodic patterns are patterns that don't repeat themselves when you slide in any direction, and where every motif (i.e. every cluster of tiles) occurs infinitely often throughout the pattern. The most famous example of a quasiperiodic tiling is the [Penrose Tiling](https://en.wikipedia.org/wiki/Penrose_tiling). Quasiperiodic patterns can be found in [medieval Islamic Art](https://link.springer.com/article/10.1007/s12210-020-00969-9), and they also occur in nature in the form of [quasicrystals](https://en.wikipedia.org/wiki/Quasicrystal).

<img src="https://user-images.githubusercontent.com/1878638/115279244-73d9bf00-a114-11eb-9105-1cad80515a5e.png" width="330">

Visually, quasiperiodic patterns contain many repeating motifs, and yet the entire pattern never exactly repeats itself. The trick is that they're constructed out of components that *do* repeat periodically, but whose periods never coincide with each other (because their ratio is an irrational number).

### Some "Famous" Tiling Patterns

Here are a few previously discovered tiling patterns that you can recreate with Pattern Collider:

- [5-fold Penrose Tiling](https://aatishb.com/patterncollider/) ([reference](https://tilings.math.uni-bielefeld.de/substitution/penrose-rhomb/))
- [6-fold Stepped Plane](https://aatishb.com/patterncollider/?symmetry=6&disorder=1&randomSeed=0.42&radius=76&zoom=2.4&orientationColoring=true) (click randomize to generate variations) ([reference](https://www.sciencedirect.com/science/article/pii/S0012365X10004516))
- [7-fold Socolar Tiling](https://aatishb.com/patterncollider/?symmetry=7&radius=88&zoom=2.13&stroke=44) ([reference](https://tilings.math.uni-bielefeld.de/substitution/socolars-7-fold/))
- [8-fold Ammann-Beenker Tiling](https://aatishb.com/patterncollider/?symmetry=8&pattern=0.5&radius=140&zoom=2&stroke=255&showStroke=true&hue=250&hueRange=173&contrast=30&reverseColors=true) ([reference](https://tilings.math.uni-bielefeld.de/substitution/ammann-beenker/))
- [12-fold Socolar Tiling](https://aatishb.com/patterncollider/?symmetry=12&pattern=0&glide=2&radius=150&zoom=2&rotate=15) ([reference](https://tilings.math.uni-bielefeld.de/substitution/socolar/))

## How It Works

Pattern Collider uses the [multigrid method](https://new.math.uiuc.edu/oldnew/quasicrystals/papers/debruijnPenrose.pdf) of creating quasiperiodic patterns discovered by the mathematician [de Bruijn](https://en.wikipedia.org/wiki/Nicolaas_Govert_de_Bruijn). 

Start with a bunch of intersecting lines. It turns out that this collection of lines is a tiling pattern in disguise! Here's how to see this. First, find the points where the lines intersect.

<img src="https://user-images.githubusercontent.com/1878638/115302783-c88b3300-a130-11eb-8ae6-67ca68248d6d.png" width="440">

Then, centered on each intersection point, draw [equilateral polygons](https://en.wikipedia.org/wiki/Equilateral_polygon) whose sides are perpendicular to the lines.

<img src="https://user-images.githubusercontent.com/1878638/115302852-e193e400-a130-11eb-98a5-3f0cc0f77de7.png" width="440">

Because of the way these shapes are constructed, you can slide them together into a seamless tiling pattern.

![lines to tiles](https://user-images.githubusercontent.com/1878638/115302925-f4a6b400-a130-11eb-8395-37d8a158a115.gif)

This tiling pattern and grid of lines are *dual* to each other, i.e. they're secretly the same pattern.

![grid tiles dual](https://user-images.githubusercontent.com/1878638/115303473-ad6cf300-a131-11eb-9072-2de824874768.png)

Now that we know how to go between lines and tiles, draw 5 sets of equally spaced parallel lines, each set tilted 360/5 = 72 degrees from the previous set. This particular grid of lines is known as a *pentagrid*.

<img src="https://user-images.githubusercontent.com/1878638/115280557-12b2eb00-a116-11eb-902b-cc6d9d21b8cd.png" width="330">

de Bruijn discovered that if you start from this pentagrid and follow his procedure for creating a dual tiling pattern, you end up with the well-known Penrose tiling.

<img src="https://user-images.githubusercontent.com/1878638/115281016-8e149c80-a116-11eb-8567-c2a3520e9b16.png" width="660">

If you shift these lines around, but maintain their spacing and orientation, you can create an infinite family of Penrose-like tilings.

<img src="https://user-images.githubusercontent.com/1878638/115281491-1135f280-a117-11eb-92af-9adf13fe47ae.gif" width="660">

You can repeat this procedure for different numbers of parallel line sets, to create many other quasiperiodic patterns. Pattern Collider uses this method to create quasiperiodic tiling patterns.

## Instructions

## Interaction

- Click the save icon 💾 on the top right of the pattern to save the image 

- Click on a line in the grid to select it & to highlight the corresponding ribbon in the tiling pattern. Click and drag to select parallel lines / ribbons.
<img src="https://user-images.githubusercontent.com/1878638/115282491-455de300-a118-11eb-889c-cfcc6e41fc1e.gif" width="660">

- Click on a tile to select it & highlight the corresponding intersection point in the grid. Click and drag to select multiple tiles.
<img src="https://user-images.githubusercontent.com/1878638/115282669-76d6ae80-a118-11eb-92b9-38065b701d4d.gif" width="660">

- The clear selection button clears all selections, and the reset button resets all changes & returns to the default tiling pattern.

## Pattern Settings

**Symmetry**: Controls the rotational symmetry of the pattern. Higher = more sets of parallel lines / ribbons. The pattern will be quasiperiodic for all symmetry values except 3, 4, and 6. Patterns with a N-fold symmetry contain points where the tiling looks the same if you rotate it by 360/N degrees.

**Pattern**: Controls the offset of each family of lines from the center of the grid. When pattern = 0 or 1, more than 2 lines intersect at a point, and this results in polygons with more than four sides in the tiling patterns. Interesting things happen when pattern = 0.5 or when pattern = 1 / symmetry.

**Rotate**: Rotates the pattern about its center. (Rotations are about the center of the tiling pattern, not around the center of the viewable patch. When glide = 0 these are the same.)

**Glide**: Glides the patch sideways along the pattern. You can use glide in combination with rotate to explore the space of the tiling pattern.

**Disorder**: Smoothly interpolates the offsets for each family of lines to a random set of offsets. This nudges the grid lines about, allowing you to explore a wider set of tiling patterns than with the pattern slider alone.

**Randomize**: Randomizes the offsets, so you jump to a different pattern in the space of allowed tiling patterns. This is enabled when disorder > 0.

**Share Pattern**: Copies the URL of this pattern to the clipboard for easy bookmarking & sharing.

## Size Settings

**Number of Pieces**: Sets the radius of the circular patch of tiles. Larger = more pieces, smaller = fewer pieces.

**Zoom**: Zooms in or out of the pattern.

**Show Grid/Tiling**: Shows or hides the grid or tiling pattern.

## Color Settings

**Change Color Palette**: Generates a new color palette for the tiles.

**Reverse Colors**: Reverses the order of colors in the color palette.

**Color Using Tile Orientation**: Colors the tiles based on its orientation instead of its area. This is particularly helpful for visualizing 3 and 6 fold symmetry.

**Color Tiles**: Toggles whether to fill in the color of tiles.

**Intersections**: Toggles whether to identify the intersection points in the grid.

**Edges**: Toggles whether to outline the edges of the tiles.

**Edge Brightness**: Sets the brightness of the edges.

**Hue**: Sets the average hue of the pattern.

**Hue Range**: Sets the hue range of the pattern. Goes from negative to positive. Setting this to zero will color the pattern in shades of a single hue.

**Saturation**: Controls the saturation of the pattern. Zero = grayscale.

**Contrast**: Controls the contrast of the pattern, i.e. the darkness to brightness range. Higher contrast makes the patterns more easily visible but de-emphasizes the hue.

**Tiles**: Shows one of each type of tile being displayed.

## References
