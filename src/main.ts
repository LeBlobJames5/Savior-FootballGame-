import * as ex from 'excalibur';
import { MainMenu } from './scenes/MenuPrincipal';
import { GameScene } from './scenes/JeuPrincipal';
import { ResourceLoader } from './resources';

const game = new ex.Engine({
  displayMode: ex.DisplayMode.FillScreen
});

game.add('menu', new MainMenu());
game.add('game', new GameScene());

game.start(ResourceLoader).then(() => {
  console.log("LOADED OK");
  game.goToScene('menu');
});