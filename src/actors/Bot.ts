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

  // Statistiques
  speed: number = 150;
  endurance: number = 30;
  strength: number = 30;

  // Blessures
  injured: boolean = false;
  injurySpeedMultiplier: number = 0.45;

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

    // Choisir les sprites selon l'équipe.
    const isBlue =
      role === 'LT' ||
      role === 'LG' ||
      role === 'C' ||
      role === 'RG' ||
      role === 'RT' ||
      role === 'QB' ||
      role === 'RB' ||
      role === 'WR';

    const idleSource = isBlue
      ? Resources.ImgSB
      : Resources.ImgSR;

    const runSource = isBlue
      ? Resources.ImgRB
      : Resources.ImgRR;

    this.idleSprite = idleSource.toSprite();
    this.runningSprite = runSource.toSprite();

    // Dimensions visuelles indépendantes de la hitbox.
    this.idleSprite.width = 31;
    this.idleSprite.height = 40;

    this.runningSprite.width = 34;
    this.runningSprite.height = 40;

    this.graphics.use(this.idleSprite);
  }

  override update(engine: ex.Engine, delta: number): void {
    super.update(engine, delta);

    // Détecter les déplacements effectués par l'IA.
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