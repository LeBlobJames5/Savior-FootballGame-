import * as ex from 'excalibur';
import { BigStats } from '../State/stats';
import { Resources } from '../resources';


const citizenSpriteSheet = ex.SpriteSheet.fromImageSource({
    image: Resources.Citizen,
    grid: {
        rows: 3,
        columns: 4,
        spriteWidth: 16,
        spriteHeight: 17.3
    }
});

const walkDown = ex.Animation.fromSpriteSheet(
    citizenSpriteSheet,
    [0, 4, 8],
    150
);

const walkRight = ex.Animation.fromSpriteSheet(
    citizenSpriteSheet,
    [1, 5, 9],
    150
);


const walkLeft = ex.Animation.fromSpriteSheet(
    citizenSpriteSheet,
    [3, 7, 11],
    150
);

const walkUp = ex.Animation.fromSpriteSheet(
    citizenSpriteSheet,
    [2, 6, 10],
    150
);




export class Citizen extends ex.Actor{
  public speed = 100;
  constructor() {
    super({
      x: 50,
      y: 200,
      width: 12,
      height: 12,
      color: ex.Color.Blue,
      anchor: ex.Vector.Half,
      collisionType: ex.CollisionType.Active,
    }); 
  
this.graphics.use(walkDown);

}
  //mouvements du joueur
  
  private moveUpward(delta: number) {
    const seconds = delta / 1000;
    this.pos.y -= this.speed * seconds;
  }

  private moveRight(delta: number) {
    const seconds = delta / 1000;
    this.pos.x += this.speed * seconds;
  }

  private moveDownward(delta: number) {
    const seconds = delta / 1000;
    this.pos.y += this.speed * seconds;
  }

  private moveLeft(delta: number) {
    const seconds = delta / 1000;
    this.pos.x -= this.speed * seconds;
  }

   public update(engine: ex.Engine, delta: number): void {
    super.update(engine, delta);

     let moving = false;

    if (
      engine.input.keyboard.isHeld(ex.Keys.D)
    ) {
      this.moveRight(delta)
      this.graphics.use(walkRight);
      moving = true;
    }
    if (
      engine.input.keyboard.isHeld(ex.Keys.A)
    ) {
      this.moveLeft(delta);
      this.graphics.use(walkLeft);
      moving = true;
    }
    if (
      engine.input.keyboard.isHeld(ex.Keys.W)
    ) {
      this.moveUpward(delta);
      this.graphics.use(walkUp);
      moving = true;
    }
    if (
      engine.input.keyboard.isHeld(ex.Keys.S)
    ) {
      this.moveDownward(delta);
      this.graphics.use(walkDown);
      moving = true;
    }
    if (!moving) {
        this.graphics.use(citizenSpriteSheet.getSprite(0, 0));
    }
  }
}