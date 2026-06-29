import * as ex from 'excalibur';
import { MainMenu } from './scenes/MenuPrincipal';
import { GameScene } from './scenes/JeuPrincipal';
import { ResourceLoader } from './resources';
import { Gym } from './scenes/Gym'




const game = new ex.Engine({
  displayMode: ex.DisplayMode.FillScreen,
  suppressPlayButton: true
});

game.add('menu', new MainMenu());
game.add('game', new GameScene());
game.add('gym', new Gym());

game.start(ResourceLoader).then(() => {
  game.goToScene('menu');
});