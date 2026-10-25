import * as ex from 'excalibur';
import { Resources } from '../resources';

export type FootballRole =
  | 'LT'
  | 'LG'
  | 'C'
  | 'RG'
  | 'RT'
  | 'QB'
  | 'RB'
  | 'WR'
  | 'DL'
  | 'LB'
  | 'CB'
  | 'S';

export class FootballPlayer extends ex.Actor {
  role: FootballRole;
  homePosition: ex.Vector;

  //Statistics
  speed: number = 85;
  endurance: number = 30;
  strength: number = 30;

  //AI injuries
  injured: boolean = false;
  //Less speed if injured
  injurySpeedMultiplier: number = 0.45;

  //Sprite: Static or Movement
  private readonly idleSprite: ex.Sprite;
  private readonly runningSprite: ex.Sprite;

  private lastPosition: ex.Vector;
  private showingRun = false;

  constructor(
    x: number,
    y: number,
    role: FootballRole,
    color: ex.Color
  ) {
    super({
      x,
      y,
      width: 30,
      height: 30,
      anchor: ex.Vector.Half,
      collisionType: ex.CollisionType.PreventCollision
    });

    this.role = role;
    this.homePosition = new ex.Vector(x, y);
    this.lastPosition = new ex.Vector(x, y);

    //Determines if bot is Blue
    const isBlue =
      role === 'LT' ||
      role === 'LG' ||
      role === 'C' ||
      role === 'RG' ||
      role === 'RT' ||
      role === 'QB' ||
      role === 'RB' ||
      role === 'WR';

    //Selects static Sprite according to team
    const idleSource = isBlue
      ? Resources.ImgSB
      : Resources.ImgSR;

    //Selects run Sprite according to team
    const runSource = isBlue
      ? Resources.ImgRB
      : Resources.ImgRR;

    this.idleSprite = idleSource.toSprite();
    this.runningSprite = runSource.toSprite();

    //Static player visual size
    this.idleSprite.width = 31;
    this.idleSprite.height = 40;

    //Running player visual size
    this.runningSprite.width = 34;
    this.runningSprite.height = 40;

    this.graphics.use(this.idleSprite);
  }

  override update(engine: ex.Engine, delta: number): void {
    super.update(engine, delta);

    //Detect AI movements
    const moved =
      this.pos.distance(this.lastPosition) > 0.15;

    if (moved !== this.showingRun) {
      this.showingRun = moved;

      this.graphics.use(
        moved ? this.runningSprite : this.idleSprite
      );
    }

    this.lastPosition = this.pos.clone();
  }

  getCurrentSpeed(): number {
    if (this.injured) {
      return this.speed * this.injurySpeedMultiplier;
    }

    return this.speed;
  }

  injure(): void {
    if (this.injured) {
      return;
    }

    this.injured = true;

    console.log('⚠️ LE JOUEUR EST BLESSÉ !');
  }
}