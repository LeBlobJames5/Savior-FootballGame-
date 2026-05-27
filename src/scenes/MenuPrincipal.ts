import * as ex from 'excalibur';
import { Resources } from '../resources';
export class MainMenu extends ex.Scene {


  onInitialize(engine: ex.Engine) {

    const centerX = engine.drawWidth * 0.5;
    const centerY = engine.drawHeight * 0.5;

   const logoSprite = Resources.Logo.toSprite();
    logoSprite.width = Resources.Logo.width;
    logoSprite.height = Resources.Logo.height;

const logo = new ex.Actor({
  x: centerX,
  y: centerY * 1.0,
  width: 200,
  height: 200,
  anchor: ex.Vector.Half
});

this.add(logo);

logo.graphics.use(Resources.Logo.toSprite());

    // Centrage
    logo.anchor = ex.Vector.Half;

    // Bouton jouer
    const playButton = new ex.Label({
      text: "Jouer",
      pos: ex.vec(centerX, centerY * 1.10),
      font: new ex.Font({
        size: 36,
        family: 'Arial'
      }),
      color: ex.Color.White,
    });

    playButton.anchor = ex.Vector.Half;

    playButton.on('pointerup', () => {
      engine.goToScene('game');
    });

    // Ajouter à la scène
    this.add(logo);
    this.add(playButton);

    // Responsive resize
    engine.on('resize', () => {

      const cx = engine.drawWidth * 0.5;
      const cy = engine.drawHeight * 0.5;

      logo.pos = ex.vec(cx, cy * 0.3);
      playButton.pos = ex.vec(cx, cy * 0.65);
    });
  }
}