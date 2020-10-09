# 'Wandering Triangles' Background Animation

A script for overlaying a canvas (ideally one set to stand behind the body of a page) with falling geometric triangles that 'wander' in a downwards direction.

Inspired by some of the artwork for Deus Ex Human Revolution, and later Mankind Divided, which features triangular patterns in gold.

Below is a sample of how it looks and how it should be used (its just the one file plus script to configure it). The sample page has a control which allows the animation colours to be altered, or the wandering to be 'paused' which can be useful for, by example, editor pages where it might serve as a distraction. The directional 'bias', the controls the overall flow direction of the triangles can also be changed.

[Sample html file](https://chrispritchard.github.io/Wandering-Triangles/sample.html)

Aside from colours, direction and whether or not the animation is enabled, there are more settings that can be seen in that 'baseSettings' function of [wandering-triangles.js](./wandering-triangles.js), at the top of the file.

## Updated version v2.0

The current master version is the 'updated' version. Aside from performance improvements and more finer control, it also follows a more immutable, functional structure compared to the prior version. It is also in pure JS (I've moved away from the JS development world and can't really be stuffed installing nodejs and a typescript transpiler anymore).

The previous version is still available under the v1.0 release.

## License

Use as you will. I've switched from the unlicense to MIT, just because the latter is more commonly understood, but I don't really care. If you do use it, feel free to throw me a star on the repo or a mention somewhere, if you like.