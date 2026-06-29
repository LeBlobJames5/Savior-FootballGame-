import * as ex from 'excalibur';

type MachineOptions = {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  sprite: ex.Sprite;
};

export class Machines extends ex.Actor {
  public machineName: string;

  constructor(options: MachineOptions) {
    super({
      x: options.x,
      y: options.y,
      width: options.width,
      height: options.height,
      collisionType: ex.CollisionType.Fixed
    });

    this.machineName = options.name;

    options.sprite.width = options.width;
    options.sprite.height = options.height;
    this.graphics.use(options.sprite);
  }
}