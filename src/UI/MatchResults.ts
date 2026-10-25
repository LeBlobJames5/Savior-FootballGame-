import * as ex from 'excalibur';

export function MatchResults(
  scene: ex.Scene,
  engine: ex.Engine,
  text: string,
  onContinue: () => void
): ex.ScreenElement[] {
  const w = engine.screen.resolution.width;
  const h = engine.screen.resolution.height;
  const fontSize = Math.min(48, Math.floor(h / 36));

  const makeText = (
    str: string,
    x: number,
    y: number,
    size: number
  ): ex.ScreenElement => {
    const el = new ex.ScreenElement({ x, y, z: 1002 });
    el.anchor = ex.Vector.Zero;
    el.graphics.use(
      new ex.Text({
        text: str,
        font: new ex.Font({
          size,
          family: 'Arial',
          color: ex.Color.White
        })
      })
    );
    return el;
  };

  //Dark background
  const backdrop = new ex.ScreenElement({ x: 0, y: 0, z: 1000 });
  backdrop.anchor = ex.Vector.Zero;
  backdrop.graphics.use(
    new ex.Rectangle({
      width: w,
      height: h,
      color: ex.Color.fromRGB(0, 0, 0, 0.8)
    })
  );

  const results = makeText(text, Math.max(24, w / 2 - 360), h * 0.04, fontSize);

  const btnW = Math.min(420, w - 40);
  const btnH = 56;
  const btnX = w / 2 - btnW / 2;
  const btnY = h * 0.86;

  const button = new ex.ScreenElement({ x: btnX, y: btnY, z: 1001 });
  button.anchor = ex.Vector.Zero;
  button.graphics.use(
    new ex.Rectangle({
      width: btnW,
      height: btnH,
      color: ex.Color.fromHex('#2E7D32')
    })
  );
  button.pointer.useGraphicsBounds = true;
  button.on('pointerup', onContinue);

  const buttonLabel = makeText(
    'RETOURNER EN VILLE (Entrée)',
    btnX + 18,
    btnY + 17,
    20
  );

  const elements = [backdrop, results, button, buttonLabel];
  elements.forEach(e => scene.add(e));
  return elements;
}