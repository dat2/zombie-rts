//global variables
import BootState from 'States/boot';
import PreloadState from 'States/preload';
import MenuState from 'States/menu';
import PlayState from 'States/play';
import GameOverState from 'States/gameover';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const GAME_NAME = 'zombie rts';


export function start() {
  window.game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, GAME_NAME);
  // Game States
  game.state.add('boot', new BootState());
  game.state.add('preload', new PreloadState());
  game.state.add('menu', new MenuState());
  game.state.add('play', new PlayState());
  game.state.add('gameover', new GameOverState());

  game.state.start('boot');
}