# FOSTER.TS
###### A simple WebGL + TypeScript 2D Game framework with a Scene -> Entity -> Component model.

★ **still very work in progress** ★

and has frequent, breaking changes. currently not worrying about backwards compatability with updates.

#### Goals
 - Lightweight framework to be easily used for GameJam games
 - Foster should run in the browser and in electron without any changes on the game-side
 - ES6 all the way. Not my goal to be backwards / ES5 compatible as this is to be primarily used in Electron
 - Scene -> Entity -> Component structure
 - Frame-based animation, with atlas loading (Aseprite, Texture Packer, etc)
 - AABB Collision system, with simple Physics component to handle motion 
 
#### Todo
 - Implement Audio stuff
 - Comment everything (and generate Docs somehow?)
 - Maybe put it in  `Foster Namespace`? I find it really annoying to type "`new Foster.Entity`" and etc, all the time though
 
#### Builds
 - [foster.js](bin/foster.js) : compiled JS file
 - [foster.d.ts](bin/foster.d.ts) : typescript definition file to reference from your game (ex. `/// <reference path="foster.d.ts"/>`)

#### Sample Games
 - [sample_game](sample_game) - [online demo](http://noelfb.com/foster/sample_game/)

#### [API Documentation](api.md) (incomplete)
#### [MIT License](license.md)
