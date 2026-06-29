import * as ex from 'excalibur';
import { BigStats } from '../Estado/stats';
export class Player extends ex.Actor{
  public speed = 150 * BigStats.Speed;
  constructor() {
    super({
      x: 50,
      y: 200,
      width: 40,
      height: 40,
      color: ex.Color.Blue,
      anchor: ex.Vector.Half,
      collisionType: ex.CollisionType.Active,
    }); 
  }
  
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
    if (
      engine.input.keyboard.isHeld(ex.Keys.D)
    ) {
      this.moveRight(delta);
    }
    if (
      engine.input.keyboard.isHeld(ex.Keys.A)
    ) {
      this.moveLeft(delta);
    }
    if (
      engine.input.keyboard.isHeld(ex.Keys.W)
    ) {
      this.moveUpward(delta);
    }
    if (
      engine.input.keyboard.isHeld(ex.Keys.S)
    ) {
      this.moveDownward(delta);
    }
  }
}