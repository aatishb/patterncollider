# Pattern Collider

- [Credits](https://github.com/aatishb/patterncollider#credits)
- [What Is This?](https://github.com/aatishb/patterncollider#what-is-this)
- [Documentation](https://github.com/aatishb/patterncollider#instructions)
- [Famous Patterns](https://github.com/aatishb/patterncollider#famous-patterns)
- [References](https://github.com/aatishb/patterncollider#references)

## Credits

Pattern Collider is created by [Aatish Bhatia](https://aatishb.com/) in collaboration with [Henry Reich](https://www.minutephysics.com/).

Special thanks to [Arkarup Bannerjee](https://www.arkarup.com/), [Shefali Nayak](https://shefalinayak.com/), [Vijay Ravikumar](https://this-vijay.github.io/), and [Connie Sun](https://www.cartoonconnie.com/) for their helpful feedback & suggestions.

## What Is This?

**Pattern Collider is a tool for creating quasiperiodic tiling patterns.** Every pattern that you create with Pattern Collider has a custom URL that you can bookmark & share. Learn more about how it works by watching the Minute Physics video.

**Quasiperiodic** patterns are a special type of patterns that don't repeat themselves when you slide the pattern in some direction, and where every motif (i.e. cluster of tiles) occurs infinitely often throughout the pattern. The most famous example of a quasiperiodic tiling is the [Penrose Tiling](https://en.wikipedia.org/wiki/Penrose_tiling).

IMAGE

Visually, quasiperiodic patterns often appear highly repetitive, and yet they never exactly repeat themselves. The trick is that they're constructed out of components that do repeat periodically, but whose periods will never perfectly line up with each other (because their ratio is an irrational number).

Pattern Collider uses the multigrid method of creating quasiperiodic patterns discovered by the mathematician Nicolaas Govert de Bruijn. 

Say you have a bunch of intersecting lines. This grid of lines is also a tiling pattern in disguise. Here's how to see this.

IMAGE

At each intersection point, draw an [equilateral polygon](https://en.wikipedia.org/wiki/Equilateral_polygon) centered on each point, whose sides are perpendicular to the lines.

IMAGE

Because of the way these polygons are constructed, you can always slide them together and fit them into a seamless tiling pattern. We say that these tiling and grid patterns are *dual* to each other, because they're secretly the same pattern.

IMAGE

Now, draw 5 sets of equally spaced parallel lines, each set tilted 360/5 = 72 degrees from the previous set. This special grid pattern is called a *pentagrid*.

IMAGE

de Bruijn discovered that the tiling pattern dual to the pentagrid is none other than the famous Penrose tiling!

IMAGE

If you shift each set of lines around, but maintain their spacing and orientation, you can create an infinite family of Penrose-like tilings.

IMAGE

And you can repeat this procedure for more than 5 sets or parallel lines, to create many other quasiperiodic patterns. For example, with 7 sets of parallel lines, each set oriented at multiples of 360/7 degrees, you get a heptagrid.

IMAGE

And the dual tiling pattern is a quasiperidic pattern with 7-fold symmetry.

IMAGE

Pattern Collider uses this method to create quasiperiodic tiling patterns.

## Instructions / Help

### Interaction

Click on a line in the grid to select it & to highlight the corresponding ribbon in the tiling pattern
IMAGE

Click and drag to select parallel lines / ribbons
IMAGE

- Click on a tile to select it & highlight the corresponding intersection point in the grid
- Click and drag to select multiple tiles


### Pattern Settings

**Symmetry**: Selects the amount of rotational symmetry of the pattern. Higher = more sets of parallel lines / ribbons. Patterns with a n fold symmetry contain places where the tiling looks the same if you rotate it by 360/n degrees.

**Pattern**: Controls the offset of each family of lines from the center. When pattern = 0 or 1, the pattern is degenerate because more than 2 lines intersect at a point, and this results in polygons with more than four sides in the tiling patterns. Interesting things happen when pattern = 0.5 or pattern = 1 / symmetry.

- **Rotate**: Rotates the entire pattern about its center. (Note that rotations are around the center of the tiling pattern and not around the center of the viewable patch.)

- **Glide**: Glides the patch sideways along the pattern. You can use glide in combination with rotate to explore the space of the tiling pattern.

- **Disorder**: Smoothly interpolates between the chosen offsets for each family of lines, and a random set of offsets. This allows you to explore a wider set of possible tiling patterns with the given symmetry. 

- **Randomize**: For use with the disorder slider. This button randomizes the offsets, so you jump to a different pattern in the space of possible tiling patterns with the same symmetry.

- **Share Pattern**: Copies the URL of this pattern to the clipboard for easy bookmarking & sharing.

### Size Settings

- **Number of Pieces**: 
- **Zoom**:
- **Show Grid/Tiling**:

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