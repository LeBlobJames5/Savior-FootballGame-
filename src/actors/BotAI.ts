import * as ex from 'excalibur';
import { FootballPlayer } from './Bot';

export class FootballAI {

//Defenders AI

  static updateDefense(
    player: FootballPlayer,
    ballCarrier: FootballPlayer,
    elapsed: number,
    assignedReceiver?: FootballPlayer
  ) {

    switch (player.role) {

      case 'DL':
        this.updateDL(player, ballCarrier, elapsed);
        break;

      case 'LB':
        this.updateLB(player, ballCarrier, elapsed);
        break;

      case 'CB': 
        this.updateCB( player, ballCarrier, elapsed, assignedReceiver ); 
        break;
      
      
      case 'S': 
        this.updateSafety(player, ballCarrier, elapsed); 
        break;

    }

  }

  private static moveTowards(
    player: FootballPlayer, 
    target: ex.Vector, 
    speed: number, 
    elapsed: number,
    stopDistance: number = 5
  ) {




    const direction = target.sub(player.pos);

    if (direction.magnitude <= stopDistance) {
      return;
    }

    const movement = direction  
      .normalize()
      .scale(speed * elapsed / 1000);

    player.pos = player.pos.add(movement);
  }

  // ==========================================
  // DEFENSIVE LINE
  // ==========================================

  private static updateDL(
    player: FootballPlayer,
    ballCarrier: FootballPlayer,
    elapsed: number
  ) {


    const target = new ex.Vector(
      player.homePosition.x - 80, 
      player.homePosition.y
    );

    const distanceToQB =
     player.pos.distance(ballCarrier.pos);

    if (distanceToQB > 170) {

      this.moveTowards(
        player, 
        ballCarrier.pos, 
        85, 
        elapsed,
        35
      );

    } else {

      this.moveTowards(
        player,
        target,
        80,
        elapsed,
        10
      );
    }
  }

  // ==========================================
  // LINEBACKER
  // ==========================================

  private static updateLB(
    player: FootballPlayer,
    ballCarrier: FootballPlayer,
    elapsed: number
  ) {

    const targetX = ballCarrier.pos.x + 100;

    const target = new ex.Vector(
      targetX,
      player.homePosition.y
    );

    if (Math.abs(player.pos.x - targetX) > 20) {

      this.moveTowards(
        player,
        target,
        55,
        elapsed,
        15
      );
    }

    const distanceToQB = player.pos.distance(ballCarrier.pos);

    if (distanceToQB < 110) {

      this.moveTowards(
        player,
        ballCarrier.pos, 
        110,
        elapsed,
        30
      );
    }
  }

  // ==========================================
  // CORNERBACK
  // ==========================================

  private static updateCB(
    player: FootballPlayer,
    ballCarrier: FootballPlayer,
    elapsed: number,
    receiver?: FootballPlayer
  ) {

  if (receiver) {
    const target = new ex.Vector(
      receiver.pos.x + 25, 
      receiver.pos.y
    );

    this.moveTowards(
      player,
      target,
      95,
      elapsed,
      15
    );

    const disanceToQB = player.pos.distance(ballCarrier.pos);

    if (disanceToQB < 70) {

      this.moveTowards(
        player,
        ballCarrier.pos,
        100,
        elapsed,
        25
      );
    }

  } else {

    const target = new ex.Vector(
      player.homePosition.x, 
      player.homePosition.y
    );

    this.moveTowards(
      player,
      target,
      60,
      elapsed,
      10
    );
  }
}



  // SAFETY
  // ==========================================

  private static updateSafety(
    player: FootballPlayer,
    ballCarrier: FootballPlayer,
    elapsed: number
  ) {

    const target = new ex.Vector(
      ballCarrier.pos.x + 250,
      player.homePosition.y
    );

    this.moveTowards(
      player,
      target,
      50,
      elapsed,
      30
    );

    const distanceToQB = player.pos.distance(ballCarrier.pos);

    if (distanceToQB < 130) {

      this.moveTowards(
        player,
        ballCarrier.pos,
        100,
        elapsed,
        30
      );
    }
}

  // ==========================================
  // IA OFFENSIVE
  // ==========================================

  static updateOffense(
    player: FootballPlayer,
    quarterback: FootballPlayer,
    elapsed: number
  ) {

    switch (player.role) {

      case 'WR':
        this.updateWR(player, elapsed);
        break;

      case 'RB':
        this.updateRB(player, quarterback, elapsed);
        break;

      case 'LT':
      case 'LG':
      case 'C':
      case 'RG':
      case 'RT':
        this.updateOL(player, elapsed);
        break;

    }

  }


  // ==========================================
  // WIDE RECEIVER
  // ==========================================

  private static updateWR(
    player: FootballPlayer,
    elapsed: number
  ) {

    // Les WR avancent vers la droite.
    const speed = 110;

    player.pos.x += speed * elapsed / 1000;

    const TargetY = player.homePosition.y;

    const yDifference = TargetY - player.pos.y;

    if (Math.abs(yDifference) > 5) {

      player.pos.y += Math.sign(yDifference) * 30 * elapsed / 1000;
  }
}


  // ==========================================
  // RUNNING BACK
  // ==========================================

  private static updateRB(
    player: FootballPlayer,
    quarterback: FootballPlayer,
    elapsed: number
  ) {

    const target = new ex.Vector(
      quarterback.pos.x + 70,
      quarterback.pos.y
    )

    this.moveTowards(
      player,
      target, 
      120,
      elapsed,
      5
    );
  }



  // ==========================================
  // OFFENSIVE LINE
  // ==========================================

  private static updateOL(
    player: FootballPlayer,
    elapsed: number
  ) {

    player.pos.x += 25 * elapsed / 1000;

    const targetY = player.homePosition.y;

    const differenceY = targetY - player.pos.y;

    if (Math.abs(differenceY) > 3) {

      player.pos.y += Math.sign(differenceY) * 20 * elapsed / 1000;
    }

  }

}