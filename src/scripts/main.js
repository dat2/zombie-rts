//global variables
import BootState from 'States/boot';
import PreloadState from 'States/preload';
import MenuState from 'States/menu';
import PlayState from 'States/play';
import GameOverState from 'States/gameover';

const { name, window: { width, height } } = require('../package');

export function start() {
  window.game = new Phaser.Game(width, height, name);
  // Game States
  game.state.add('boot', new BootState());
  game.state.add('preload', new PreloadState());
  game.state.add('menu', new MenuState());
  game.state.add('play', new PlayState());
  game.state.add('gameover', new GameOverState());

  game.state.start('boot');
}