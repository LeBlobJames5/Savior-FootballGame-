import * as ex from 'excalibur';
import { MainMenu } from './scenes/MenuPrincipal';
import { GameScene } from './scenes/JeuPrincipal';
import { ResourceLoader } from './resources';
import { Gym } from './scenes/Gym'
import { City } from './scenes/City';




const game = new ex.Engine({
  displayMode: ex.DisplayMode.FillScreen,
  suppressPlayButton: true,
  viewport: { width: 200, height: 200},
  resolution: { width: 3000, height: 3000 }
});

game.add('menu', new MainMenu());
game.add('game', new GameScene());
game.add('gym', new Gym());
game.add('city', new City());

game.start(ResourceLoader).then(() => {
  game.goToScene('menu');
});