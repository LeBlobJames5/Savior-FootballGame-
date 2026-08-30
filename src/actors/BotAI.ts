import * as ex from 'excalibur';
import { FootballPlayer } from './Bot';

export class FootballAI {

  // ==========================================
  // IA DÉFENSIVE
  // ==========================================

  static updateDefense(
    player: FootballPlayer,
    ballCarrier: FootballPlayer,
    elapsed: number
  ) {

    switch (player.role) {

      case 'DL':
        this.updateDL(player, ballCarrier, elapsed);
        break;

      case 'LB':
        this.updateLB(player, ballCarrier, elapsed);
        break;

      case 'CB':
        this.updateCB(player, ballCarrier, elapsed);
        break;

      case 'S':
        this.updateSafety(player, ballCarrier, elapsed);
        break;

    }

  }


  // ==========================================
  // DEFENSIVE LINE
  // ==========================================

  private static updateDL(
    player: FootballPlayer,
    ballCarrier: FootballPlayer,
    elapsed: number
  ) {

    // Pour l'instant les DL se dirigent vers le QB
    // pour simuler la pression.

    const direction = ballCarrier.pos
      .sub(player.pos);

    if (direction.magnitude > 35) {

      player.pos = player.pos.add(
        direction.normalize().scale(
          100 * elapsed / 1000
        )
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

    const direction = ballCarrier.pos
      .sub(player.pos);

    if (direction.magnitude > 35) {

      player.pos = player.pos.add(
        direction.normalize().scale(
          120 * elapsed / 1000
        )
      );

    }

  }


  // ==========================================
  // CORNERBACK
  // ==========================================

  private static updateCB(
    player: FootballPlayer,
    ballCarrier: FootballPlayer,
    elapsed: number
  ) {

    // Pour l'instant, les CB restent relativement
    // proches de leur position.

    const direction = ballCarrier.pos
      .sub(player.pos);

    if (direction.magnitude > 150) {

      player.pos = player.pos.add(
        direction.normalize().scale(
          80 * elapsed / 1000
        )
      );

    }

  }


  // ==========================================
  // SAFETY
  // ==========================================

  private static updateSafety(
    player: FootballPlayer,
    ballCarrier: FootballPlayer,
    elapsed: number
  ) {

    const direction = ballCarrier.pos
      .sub(player.pos);

    // Les safeties restent loin du porteur
    // mais peuvent intervenir s'il avance.

    if (direction.magnitude > 200) {

      player.pos = player.pos.add(
        direction.normalize().scale(
          70 * elapsed / 1000
        )
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

    player.pos.x += 120 * elapsed / 1000;

  }


  // ==========================================
  // RUNNING BACK
  // ==========================================

  private static updateRB(
    player: FootballPlayer,
    quarterback: FootballPlayer,
    elapsed: number
  ) {

    // Le RB suit le QB horizontalement.

    const targetX = quarterback.pos.x - 60;

    if (player.pos.x < targetX) {

      player.pos.x +=
        100 * elapsed / 1000;

    }

  }


  // ==========================================
  // OFFENSIVE LINE
  // ==========================================

  private static updateOL(
    player: FootballPlayer,
    elapsed: number
  ) {

    // Pour l'instant, l'O-Line avance légèrement
    // avec le jeu.

    player.pos.x +=
      20 * elapsed / 1000;

  }

}