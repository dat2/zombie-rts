//global variables
import BootState from 'States/BootState';
import PreloadState from 'States/PreloadState';
import MenuState from 'States/MenuState';
import PlayState from 'States/PlayState';
import GameOverState from 'States/GameOverState';

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