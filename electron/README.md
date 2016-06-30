# Electron App Template
A basic template that can be copied to set up Electron (v1.2.5). The `sample_game` uses this.

 - `index.html` - Simple HTML page that launches the game (and requires `foster.js` and `game.js`)
 - `app.js` - Electron App. This is what Electron loads up, and in turn, opens the `index.html`
 - `package.json` - Electron package.json. Directs Electron to start `app.js`

Using this template, what you need to do:
 - Drop in your compiled game as `game.js`
 - Drop in `foster.js`
 - Drop in any assets your game requires

For an example, check out the compiled sample game in [sample_game/bin/](https://github.com/Drazzke/foster/tree/master/sample_game/bin)
