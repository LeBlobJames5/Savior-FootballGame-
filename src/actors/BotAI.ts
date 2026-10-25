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
      //DL put pressure on the ball carrier
      case 'DL':
        this.updateDL(player, ballCarrier, elapsed);
        break;
      //LBs first defend their zone, then react to the ball carrier
      case 'LB':
        this.updateLB(player, ballCarrier, elapsed);
        break;
      //CBs follow their assigned receiver if available
      case 'CB': 
        this.updateCB( player, ballCarrier, elapsed, assignedReceiver ); 
        break;
      //Safeties cover a deeper zone before stepping in
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
    //Calculates the vector from the player to their target
    const direction = target.sub(player.pos);
    
    //Stop movement if the player is close enough
    if (direction.magnitude <= stopDistance) {
      return;
    }
    // Normalizes the direction and then calculates the movement based on the velocity and elapsed time to maintain a consistent velocity
    const movement = direction  
      .normalize()
      .scale(speed * elapsed / 1000);

    player.pos = player.pos.add(movement);
  }

  //DL put pressure on RB. Behavior depends on distance
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
     // If the ball carrier is far away, the defender moves toward him
     if (distanceToQB > 170) {

      this.moveTowards(
        player, 
        ballCarrier.pos, 
        85, 
        elapsed,
        35
      );

    } else {
    //If close enough, defender comes back to pressing position
      this.moveTowards(
        player,
        target,
        80,
        elapsed,
        10
      );
    }
  }
  //LBs repositione themselves in their zones, then pursue the ball carrier as he approaches 
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
  //CB follows a receiver if he has one. If not, comes back to starting position
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
  //Safeties cover deep and step in if RB approaches
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
  //Distributes offensive behaviors based on the position
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
  //WR moves to the right and returns to original vertical line if movement takes him away from it.
  private static updateWR(
    player: FootballPlayer,
    elapsed: number
  ) {

    //WRs move to the right
    const speed = 110;

    player.pos.x += speed * elapsed / 1000;

    const TargetY = player.homePosition.y;

    const yDifference = TargetY - player.pos.y;

    if (Math.abs(yDifference) > 5) {

      player.pos.y += Math.sign(yDifference) * 30 * elapsed / 1000;
  }
}
  //Bring RB close to QB 
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
  //Move OLs slightly to the right and corrects vertical position
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