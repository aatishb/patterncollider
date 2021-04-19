# Pattern Collider

- [Credits](https://github.com/aatishb/patterncollider#credits)
- [What Is This?](https://github.com/aatishb/patterncollider#what-is-this)
- [How It Works](https://github.com/aatishb/patterncollider#how-it-works)
- [Instructions](https://github.com/aatishb/patterncollider#instructions)
	- [Interaction](https://github.com/aatishb/patterncollider#interaction)
	- [Pattern](https://github.com/aatishb/patterncollider#pattern-settings)
	- [Size](https://github.com/aatishb/patterncollider#size)
	- [Color](https://github.com/aatishb/patterncollider#color)	
- [Famous Patterns](https://github.com/aatishb/patterncollider#famous-patterns)
- [References](https://github.com/aatishb/patterncollider#references)

## Credits

Pattern Collider is created by [Aatish Bhatia](https://aatishb.com/) in collaboration with [Henry Reich](https://www.minutephysics.com/).

Special thanks to [Arkarup Banerjee](https://www.arkarup.com/), [Shefali Nayak](https://shefalinayak.com/), [Vijay Ravikumar](https://this-vijay.github.io/), and [Connie Sun](https://www.cartoonconnie.com/) for their helpful feedback & suggestions.

## What Is This?

Pattern Collider is a tool for creating quasiperiodic tiling patterns. You can think of it like a microscope for exploring a mathematical space of pattern. Every pattern that you create with Pattern Collider has a custom URL that you can bookmark & share. Learn more about how it works by watching the Minute Physics video.

Quasiperiodic patterns are patterns that don't repeat themselves when you slide in any direction, and where every motif (i.e. every cluster of tiles) occurs infinitely often throughout the pattern. The most famous example of a quasiperiodic tiling is the [Penrose Tiling](https://en.wikipedia.org/wiki/Penrose_tiling). Quasiperiodic patterns can be found in [medieval Islamic Art](https://link.springer.com/article/10.1007/s12210-020-00969-9), and they also occur in nature in the form of [quasicrystals](https://en.wikipedia.org/wiki/Quasicrystal).

<img src="https://user-images.githubusercontent.com/1878638/115279244-73d9bf00-a114-11eb-9105-1cad80515a5e.png" width="330">

Visually, quasiperiodic patterns often appear highly repetitive, and yet the entire pattern never exactly repeats itself. The trick is that they're constructed out of components that *do* repeat periodically, but whose periods never line up with each other (because their ratio is an irrational number).

## How It Works

Pattern Collider uses the multigrid method of creating quasiperiodic patterns discovered by the mathematician Nicolaas Govert de Bruijn. 

Say you have a bunch of intersecting lines. This collection of lines is also a tiling pattern in disguise! Here's how to see this.

Draw an [equilateral polygon](https://en.wikipedia.org/wiki/Equilateral_polygon) centered on each intersection point, whose sides are perpendicular to the lines.

Because of the way these shapes are constructed, you can always slide them together and fit them into a seamless tiling pattern. We say that this tiling pattern and grid of lines are *dual* to each other, because they're secretly the same pattern.

Now, draw 5 sets of equally spaced parallel lines, each set tilted 360/5 = 72 degrees from the previous set. This special grid of lines is called a *pentagrid*.

<img src="https://user-images.githubusercontent.com/1878638/115280557-12b2eb00-a116-11eb-902b-cc6d9d21b8cd.png" width="330">

de Bruijn discovered that if you start from this pentagrid and follow his procedure for creating a tiling pattern, you end up with the well-known Penrose tiling.

<img src="https://user-images.githubusercontent.com/1878638/115281016-8e149c80-a116-11eb-8567-c2a3520e9b16.png" width="660">

If you shift these lines around, but maintain their spacing and orientation, you can create an infinite family of Penrose-like tilings.

<img src="https://user-images.githubusercontent.com/1878638/115281491-1135f280-a117-11eb-92af-9adf13fe47ae.gif" width="660">

You can repeat this procedure for different numbers of parallel line sets, to create many other quasiperiodic patterns. Pattern Collider uses this method to create quasiperiodic tiling patterns.

## Instructions

### Interaction

Click the save icon 💾 on the top right of the pattern to save the image 

Click on a line in the grid to select it & to highlight the corresponding ribbon in the tiling pattern

IMAGE

Click and drag to select parallel lines / ribbons

IMAGE

Click on a tile to select it & highlight the corresponding intersection point in the grid

IMAGE

Click and drag to select multiple tiles

IMAGE

### Pattern Settings

**Symmetry**: Controls the rotational symmetry of the pattern. Higher = more sets of parallel lines / ribbons. The pattern will be quasiperiodic for all symmetry values except 3, 4, and 6. Patterns with a N-fold symmetry contain points where the tiling looks the same if you rotate it by 360/N degrees.

**Pattern**: Controls the offset of each family of lines from the center of the grid. When pattern = 0 or 1, more than 2 lines intersect at a point, and this results in polygons with more than four sides in the tiling patterns. Interesting things happen when pattern = 0.5 or when pattern = 1 / symmetry.

**Rotate**: Rotates the pattern about its center. (Rotations are about the center of the tiling pattern, not around the center of the viewable patch. When glide = 0 these are the same.)

**Glide**: Glides the patch sideways along the pattern. You can use glide in combination with rotate to explore the space of the tiling pattern.

**Disorder**: Smoothly interpolates the offsets for each family of lines to a random set of offsets. This nudges the grid lines about, allowing you to explore a wider set of tiling patterns than with the pattern slider alone.

**Randomize**: Randomizes the offsets, so you jump to a different pattern in the space of allowed tiling patterns. This is enabled when disorder > 0.

**Share Pattern**: Copies the URL of this pattern to the clipboard for easy bookmarking & sharing.

### Size Settings

**Number of Pieces**: Sets the radius of the circular patch of tiles. Larger = more pieces, smaller = fewer pieces.

**Zoom**: Zooms in or out of the pattern.

**Show Grid/Tiling**: Shows or hides the grid or tiling pattern.

### Color Settings

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

## Famous Patterns

## References
