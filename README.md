# Pattern Collider

- [Credits](https://github.com/aatishb/patterncollider#credits)
- [About](https://github.com/aatishb/patterncollider#what-is-this)
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

Special thanks to [Arkarup Bannerjee](https://www.arkarup.com/), [Shefali Nayak](https://shefalinayak.com/), [Vijay Ravikumar](https://this-vijay.github.io/), and [Connie Sun](https://www.cartoonconnie.com/) for their helpful feedback & suggestions.

## What Is This?

**Pattern Collider is a tool for creating quasiperiodic tiling patterns.** You can think of it like a microscope that lets you explore the space of a mathematical pattern. Every pattern that you create with Pattern Collider has a custom URL that you can bookmark & share. Learn more about how it works by watching the Minute Physics video.

**Quasiperiodic** patterns are a special type of patterns that don't repeat themselves when you slide the pattern in some direction, and where every motif (i.e. cluster of tiles) occurs infinitely often throughout the pattern. The most famous example of a quasiperiodic tiling is the [Penrose Tiling](https://en.wikipedia.org/wiki/Penrose_tiling). Quasiperiodic patterns can be found in [medieval Islamic Art](https://link.springer.com/article/10.1007/s12210-020-00969-9), and they also occur in nature in the form of [quasicrystals](https://en.wikipedia.org/wiki/Quasicrystal).

IMAGE

Visually, quasiperiodic patterns often appear highly repetitive, and yet the entire pattern never exactly repeats itself. The trick is that they're constructed out of components that *do* repeat periodically, but whose periods will never perfectly line up with each other (because their ratio is an irrational number).

## How It Works

Pattern Collider uses the multigrid method of creating quasiperiodic patterns discovered by the mathematician Nicolaas Govert de Bruijn. 

Say you have a bunch of intersecting lines. This collection of lines is also a tiling pattern in disguise! Here's how to see this.

IMAGE

Draw an [equilateral polygon](https://en.wikipedia.org/wiki/Equilateral_polygon) centered on each intersection point, whose sides are perpendicular to the lines.

IMAGE

Because of the way these shapes are constructed, you can always slide them together and fit them into a seamless tiling pattern. We say that this tiling pattern and grid of lines are *dual* to each other, because they're secretly the same pattern.

IMAGE

Now, draw 5 sets of equally spaced parallel lines, each set tilted 360/5 = 72 degrees from the previous set. This special grid of lines is called a *pentagrid*.

IMAGE

de Bruijn discovered that if you start from this pentagrid and follow his procedure for creating a tiling pattern, you end up with the well-known Penrose tiling.

IMAGE

If you shift these lines around, but maintain their spacing and orientation, you can create an infinite family of Penrose-like tilings.

IMAGE

You can repeat this procedure for more than different numbers of parallel line sets, to create many other quasiperiodic patterns. Pattern Collider uses this method to create quasiperiodic tiling patterns.

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

**Symmetry**: Selects the amount of rotational symmetry of the pattern. Higher = more sets of parallel lines / ribbons. Patterns with a n fold symmetry contain places where the tiling looks the same if you rotate it by 360/n degrees.

**Pattern**: Controls the offset of each family of lines from the center of the grid. When pattern = 0 or 1, more than 2 lines intersect at a point, and this results in polygons with more than four sides in the tiling patterns. Interesting things happen when pattern = 0.5 or pattern = 1 / symmetry.

**Rotate**: Rotates the pattern about its center. (When used in combination with glide, rotations are about the center of the tiling pattern, not around the center of the viewable patch.)

**Glide**: Glides the patch sideways along the pattern. You can use glide in combination with rotate to explore the space of the tiling pattern.

**Disorder**: Smoothly interpolates between the chosen offsets for each family of lines, and a random set of offsets. This allows you to explore a wider set of possible tiling patterns with the given symmetry. 

**Randomize**: For use with the disorder slider. This button randomizes the offsets, so you jump to a different pattern in the space of possible tiling patterns with the same symmetry.

**Share Pattern**: Copies the URL of this pattern to the clipboard for easy bookmarking & sharing.

### Size Settings

**Number of Pieces**: Sets the radius of the patch of tiles. Larger = more pieces, smaller = fewer pieces.

**Zoom**: Zooms into or out of the pattern

**Show Grid/Tiling**: 

### Color Settings

- **Change Color Palette**:
- **Reverse Colors**:
- **Color Using Tile Orientation**:
- **Color Tiles**: 
- **Intersections**: 
- **Edges**: 
- **Edge Brightness**: 
- **Hue**: 
- **Hue Range**: 
- **Contrast**: 
- **Saturation**: 
- **Tiles**: 

## Famous Patterns

## References