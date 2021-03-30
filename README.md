# TODO

priority: 🍅🍊🍋🍏

# export
- [ ] download PNG button 🍋
- [ ] download SVG button 🍋
- [ ] make shareable 🍋

# mobile / ui
- [x] mobile interaction 🍊
- [x] bigger knobs on sliders 🍊
- [x] don't scroll on canvas interaction 🍊
- [ ] smoother radius slider
- [ ] deselect and drag is glitchy

# optimize
- [ ] improve efficiency on checking if mouse is in tile

# visual
- [ ] fix resizing glitches on page load
- [ ] red lines could be sharper
- [ ] better default colors / color palettes 🍏
- [ ] use full color range 🍏
- [ ] color selection 🍏

# optional
- [ ] ribbon mode?
- [ ] sound tab?
- [ ] editable numbers for sliders
- [ ] can clicking be more obvious?
- [ ] improve settings UI
- [ ] check that new sliders reproduce settings of old
	- i.e. prove that they span the same space

# done

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
- [x] random colors should persist on settings change
- [x] only draw tiles in viewable area of canvas
- [x] color using tile orientation is slow
