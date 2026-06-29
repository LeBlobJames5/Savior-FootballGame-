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

  logo.graphics.use(Resources.Logo.toSprite());

  logo.anchor = ex.Vector.Half;

    const playButton = this.createImageButton({
      x: centerX,
      y: centerY * 1.05,
      width: 300,
      height: 90,
      image: Resources.Play,
      onClick: () => {
        engine.goToScene('game');
      }
    });

    const gymButton = this.createImageButton({
      x: centerX,
      y: centerY * 1.25,
      width: 360,
      height: 100,
      image: Resources.SalleDS,
      onClick: () => {
        engine.goToScene('gym');
      }
    });
    
    playButton.anchor = ex.Vector.Half;
    gymButton.anchor = ex.Vector.Half;
    
    this.add(logo);
    this.add(playButton);
    this.add(gymButton);

    engine.on('resize', () => {

      const cx = engine.drawWidth * 0.5;
      const cy = engine.drawHeight * 0.5;

      logo.pos = ex.vec(cx, cy * 0.3);
      playButton.pos = ex.vec(cx, cy * 0.65);
    });
  }

  private createImageButton(options: {
    x: number;
    y: number;
    width: number;
    height: number;
    image: ex.ImageSource;
    onClick: () => void;
  }): ex.Actor {
    const button = new ex.Actor({
      x: options.x,
      y: options.y,
      width: options.width,
      height: options.height,
      anchor: ex.Vector.Half,
      z: 20
    });
   const sprite = options.image.toSprite();
    sprite.width = options.width;
    sprite.height = options.height;

    button.graphics.use(sprite);

    button.on('pointerup', options.onClick);

    return button;
  }
}