# TODO

- [x] hover and click on lines
- [x] hover and click on tiles
- [x] randomize colors button
- [x] rescale tiles slider
- [x] select colors
- [x] reset selection button
- [x] keep size constant across symmetry
- [x] fix select bugs for offset 0
	- issue with selecting lines for symmetry 10
- [x] fix stroke bug
- [x] allow orientation based coloring
- [x] click and drag
- [x] group symmetry sum offset vs zoom, rotate
- [x] instead of offset, what about ratio of sum / offset (mod 1) as a slider
- [x] click and drag on fast mouse movement
- [x] selectedLines is getting an empty array pushed to it when you doubleclick on a tile
- [x] clear selection button should appear when needed, more visibly
- [x] p5 is being called on data change before it has finished loading

# export
- [ ] download PNG button
- [ ] download SVG button
- [ ] make shareable

# mobile
- [ ] mobile interaction
- [ ] bigger knobs on sliders

# optimize
- [ ] only draw tiles in viewable area of canvas
- [ ] get rid of interpolation
	- look up dual location of start and stop point
	- find nearest intersection points to a line connecting these points
	- the tiles dual to these intersection points are the ones to select
- [ ] improve efficiency on checking if mouse is in tile
- [ ] color using tile orientation is slow
        - stringify angles when creating prototile

# visual
- [ ] red lines could be sharper
- [ ] better default colors / color palettes
- [ ] random colors should persist on settings change

# optional
- [ ] ribbon mode?
- [ ] sound tab?
- [ ] editable numbers for sliders
- [ ] can clicking be more obvious?
- [ ] improve settings UI
- [ ] check that new sliders reproduce settings of old
	- i.e. prove that they span the same space
