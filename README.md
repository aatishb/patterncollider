# Pattern Collider

- [Credits](https://github.com/aatishb/patterncollider#credits)
- [What Is This?](https://github.com/aatishb/patterncollider#what-is-this)
- [Documentation](https://github.com/aatishb/patterncollider#documentation)
- [Famous Patterns](https://github.com/aatishb/patterncollider#famous-patterns)
- [References](https://github.com/aatishb/patterncollider#references)

## Credits

Pattern Collider is created by [Aatish Bhatia](https://aatishb.com/) in collaboration with [Henry Reich](https://www.minutephysics.com/).

Special thanks to [Arkarup Bannerjee](https://www.arkarup.com/), [Shefali Nayak](https://shefalinayak.com/), [Vijay Ravikumar](https://this-vijay.github.io/), and [Connie Sun](https://www.cartoonconnie.com/) for their helpful feedback & suggestions.

## What Is This?

**Pattern Collider is a tool for creating quasiperiodic tiling patterns.** Every pattern that you create with Pattern Collider has a custom URL that you can bookmark & share. Learn more about how it works by watching the Minute Physics video.

Patterns are **periodic** if they repeat themselves with a fixed period when you slide the pattern in some direction.

**Quasiperiodic** patterns are a special type of patterns that are 1) not periodic and 2) where every motif (i.e. cluster of tiles) occurs infinitely often throughout the pattern. The most famous example of a quasiperiodic tiling is the [Penrose Tiling](https://en.wikipedia.org/wiki/Penrose_tiling).


Visually, these patterns seem to exhibit a balance between order and disorder, i.e. they appear to repeat themselves when you view a small patch, but as you expand your view you discover that the pattern doesn't repeat itself. The trick to quasiperiodic patterns is that they're constructed out of components that repeat themselves periodically, but whose periods never line up with each other (because their ratio is an irrational number).

IMAGE

Pattern Collider is based on the multigrid method of creating quasiperiodic patterns discovered by the mathematician Nicolaas Govert de Bruijn. 

Here's the basic idea: say you have a bunch of lines that intersect.

IMAGE

At each intersection point, draw an [equilateral polygon](https://en.wikipedia.org/wiki/Equilateral_polygon) centered on each point, whose sides are perpendicular to the lines.

IMAGE

Because of the way these polygons are constructed, you can always slide them together to fit into a seamless tiling pattern. This is the basic idea behind how all these tiling patterns are created. We say that this tiling pattern and this grid pattern are *dual* to each other, because they're secretly the same pattern.

IMAGE

Now, draw 5 sets of equally spaced parallel lines, each set tilted 360/5 = 72 degrees from the previous set. This special grid pattern is called a *pentagrid*.

IMAGE

de Bruijn discovered that the tiling pattern dual to the pentagrid is none other than the famous Penrose tiling!

IMAGE

If you shift each set of lines around, but maintain their spacing and orientation, you can create an infinite family of Penrose-like tilings.

IMAGE

And you can repeat this procedure for more than 5 sets or parallel lines! For example, with 7 sets of parallel lines, each set oriented at multiples of 360/7 degrees, you get a heptagrid.

IMAGE

And the dual tiling pattern is a quasiperidic pattern with 7-fold symmetry. 

IMAGE

Pattern Collider uses this method to create many different quasiperiodic tiling patterns.

## Documentation

### Pattern Settings

- **Symmetry**: 
- **Pattern**: 
- **Rotate**: 
- **Glide**: 
- **Disorder**: 
- **Randomize**: 
- **Share Pattern**: 

### Size Settings

- **Number of Pieces**: 
- **Zoom**:
- **Show Grid/Tiling**:

### Color

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