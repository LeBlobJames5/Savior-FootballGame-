import * as ex from 'excalibur';
import { Resources } from '../resources';
import { MusicManager } from '../Music/MusicManager';

export class MainMenu extends ex.Scene {
  private background!: ex.Actor;
  private logo!: ex.Actor;
  private subtitle!: ex.Label;
  private playButton!: ex.Actor;
  private panel!: ex.Actor;

  private panelTitle!: ex.Label;
  private panelLine1!: ex.Label;
  private panelLine2!: ex.Label;
  private panelLine3!: ex.Label;
  private panelLine4!: ex.Label;

  onInitialize(engine: ex.Engine): void {
    MusicManager.play(Resources.GymCityMusic);

    this.background = new ex.Actor({
      x: 0,
      y: 0,
      anchor: ex.Vector.Zero,
      z: -100,
    });

    this.background.graphics.use(
      Resources.MainMenu.toSprite()
    );

    this.logo = new ex.Actor({
      x: 0,
      y: 0,
      anchor: ex.Vector.Half,
      z: 10
    });

    this.logo.graphics.use(Resources.Logo.toSprite());

    this.subtitle = new ex.Label({
      text: 'ENTRAÎNEMENT. PROGRESSION. DOMINATION.',
      pos: ex.vec(0, 0),
      font: new ex.Font({
        family: 'Arial',
        size: 48,
        color: ex.Color.White,
        bold: true,
        textAlign: ex.TextAlign.Center
      }),
      z: 11
    });

    this.subtitle.anchor = ex.Vector.Zero;

    this.playButton = this.createImageButton({
      x: 0,
      y: 0,
      width: 430,
      height: 290,
      image: Resources.Play,
      onClick: () => engine.goToScene('city')
    });

    this.panel = new ex.Actor({
      x: 0,
      y: 0,
      anchor: ex.Vector.Half,
      z: 20
    });

    this.panel.graphics.use(
      new ex.Rectangle({
        width: 900,
        height: 174,
        color: ex.Color.fromRGB(8, 25, 38, 0.96)
      })
    );

    //Titles and lines separated
    this.panelTitle = this.createLabel(
      'COMMENT JOUER',
      24,
      ex.Color.fromRGB(64, 224, 208)
    );

    this.panelLine1 = this.createLabel(
      'ENTRAÎNE-TOI • AMÉLIORE TES STATS • GAGNE TES MATCHS',
      24,
      ex.Color.White
    );

    this.panelLine2 = this.createLabel(
      'Les entraînements consomment de l’énergie.',
      24,
      ex.Color.White
    );

    this.panelLine3 = this.createLabel(
      'Repose-toi chez toi pour récupérer.',
      24,
      ex.Color.White
    );

    this.panelLine4 = this.createLabel(
      'Attention : les matchs peuvent te blesser !',
      24,
      ex.Color.White
    );

    this.add(this.background);
    this.add(this.logo);
    this.add(this.subtitle);
    this.add(this.playButton);
    this.add(this.panel);

    this.add(this.panelTitle);
    this.add(this.panelLine1);
    this.add(this.panelLine2);
    this.add(this.panelLine3);
    this.add(this.panelLine4);

    //Responsive disposition
    const layout = () => {
      const w = engine.drawWidth;
      const h = engine.drawHeight;
      const cx = w / 2;

      const backgroundSprite = Resources.MainMenu.toSprite();

      const scaleX = w / backgroundSprite.width;
      const scaleY = h / backgroundSprite.height;

      const scale = Math.max(scaleX, scaleY);

      backgroundSprite.scale = ex.vec(scale, scale);

      this.background.graphics.use(backgroundSprite);
      this.background.pos = ex.vec(cx, h / 2);
      this.background.anchor = ex.Vector.Half;

      const logoSprite = Resources.Logo.toSprite();
      const logoScale = Math.min(1, (w * 0.64) / logoSprite.width);

      logoSprite.scale = ex.vec(logoScale, logoScale);
      this.logo.graphics.use(logoSprite);
      this.logo.pos = ex.vec(cx, h * 0.37);

      this.subtitle.pos = ex.vec(cx, h * 0.34);
      this.playButton.pos = ex.vec(cx, h * 0.60);

      const panelWidth = Math.max(280,Math.min(1000, w - 48));
      const panelY = h * 0.78;

      this.panel.pos = ex.vec(cx, panelY);

      this.panel.graphics.use(
        new ex.Rectangle({
          width: panelWidth,
          height: 190,
          color: ex.Color.fromRGB(8, 25, 38, 0.96)
        })
      );

      this.panelTitle.pos = ex.vec(cx, panelY - 55);
      this.panelLine1.pos = ex.vec(cx, panelY - 15);
      this.panelLine2.pos = ex.vec(cx, panelY + 12);
      this.panelLine3.pos = ex.vec(cx, panelY + 35);
      this.panelLine4.pos = ex.vec(cx, panelY + 58);

      const textSize = w < 700 ? 12 : 16;
      const titleSize = w < 700 ? 16 : 20;

      this.panelTitle.font = new ex.Font({
        family: 'Arial',
        size: titleSize,
        color: ex.Color.fromRGB(64, 224, 208),
        textAlign: ex.TextAlign.Center
      });

      this.panelLine1.font = new ex.Font({
        family: 'Arial',
        size: w < 900 ? 12 : 16,
        color: ex.Color.White,
        textAlign: ex.TextAlign.Center
      });

      for (const label of [
        this.panelLine2,
        this.panelLine3,
        this.panelLine4
      ]) {
        label.font = new ex.Font({
          family: 'Arial',
          size: textSize,
          color: ex.Color.White,
          textAlign: ex.TextAlign.Center
        });
      }
    };

    layout();
    engine.on('resize', layout);
  }

  private createLabel(
    text: string,
    size: number,
    color: ex.Color
  ): ex.Label {
    const label = new ex.Label({
      text,
      pos: ex.vec(0, 0),
      font: new ex.Font({
        family: 'Arial',
        size,
        color,
        textAlign: ex.TextAlign.Center
      }),
      z: 22
    });

    label.anchor = ex.Vector.Zero;

    return label;
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
      z: 15
    });

    const sprite = options.image.toSprite();

    const scale = Math.min(
      options.width / sprite.width,
      options.height / sprite.height
    );

    sprite.scale = ex.vec(scale, scale);

    button.graphics.use(sprite);
    button.on('pointerup', options.onClick);

    return button;
  }
}