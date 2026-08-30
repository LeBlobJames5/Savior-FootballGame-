import * as ex from 'excalibur';

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

  constructor(
    x: number,
    y: number,
    role: FootballRole,
    color: ex.Color
  ) {

    super({
      x: x,
      y: y,
      width: 30,
      height: 30
    });

    this.role = role;

    this.graphics.use(
      new ex.Rectangle({
        width: 30,
        height: 30,
        color: color
      })
    );
  }
}