# foster
###### A WebGL + TypeScript 2D Game framework with a Scene -> Entity -> Component model.

★ **still very work in progress** ★ and has frequent, breaking changes. Not worrying about backwards compatability with updates. Use at own risk.

#### Goals
 - Lightweight framework to be easily used for GameJam games
 - Foster should run in the Browser and in Electron without any changes on the game-side
 - ES6 all the way. No interest in being ES5 / backwards compatible.
 - Scene -> Entity -> Component structure
 - Frame-based animation, with atlas loading (Aseprite, Texture Packer, etc)
 - AABB Collision system, with simple Physics component to handle motion
 
#### Todo
 - BlendModes (additive, multiply, subtract, etc)
 - Comment everything (and generate Docs somehow?)
 - Add lots of helper / usability methods (ex. Audio fade in/out, built in screen transitions, more atlas loaders, etc)
 
#### Use it yourself
 - `npm install foster-engine`
 - or clone the repo and use the source typescript yourself

#### JS Builds
 - [foster.js](build/foster.js) : compiled UMD JS file
 - [foster.module.js](build/foster.module.js) : compiled module JS file

#### [MIT License](license.md)
