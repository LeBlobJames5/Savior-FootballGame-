import * as ex from 'excalibur';
import { FootballPlayer, FootballRole } from '../actors/Bot';
import { FootballAI } from '../actors/BotAI';

export class GameScene extends ex.Scene {

  private player!: FootballPlayer;
  private ball!: ex.Actor;

  private bluePlayers: FootballPlayer[] = [];
  private redPlayers: FootballPlayer[] = [];

  onInitialize(engine: ex.Engine) {

    // ==========================================
    // TERRAIN
    // ==========================================

    const fieldWidth = 1200;
    const fieldHeight = 700;

    const background = new ex.Actor({
      x: 0,
      y: 0,
      width: fieldWidth,
      height: fieldHeight,
      anchor: ex.Vector.Zero
    });

    background.graphics.use(
      new ex.Rectangle({
        width: fieldWidth,
        height: fieldHeight,
        color: ex.Color.Green
      })
    );

    this.add(background);


    // ==========================================
    // LIGNES DU TERRAIN
    // ==========================================

    // Lignes verticales tous les 100 pixels

    for (let x = 100; x < fieldWidth; x += 100) {

      const line = new ex.Actor({
        x: x,
        y: 0,
        width: 3,
        height: fieldHeight,
        anchor: ex.Vector.Zero
      });

      line.graphics.use(
        new ex.Rectangle({
          width: 3,
          height: fieldHeight,
          color: ex.Color.White,
          opacity: 0.5
        })
      );

      this.add(line);
    }


//Offesive Players Positions

    const bluePositions: {
  x: number;
  y: number;
  role: FootballRole;
}[] = [

  { x: 500, y: 270, role: 'LT' },
  { x: 500, y: 310, role: 'LG' },
  { x: 500, y: 350, role: 'C' },
  { x: 500, y: 390, role: 'RG' },
  { x: 500, y: 430, role: 'RT' },

  { x: 440, y: 350, role: 'QB' },

  { x: 380, y: 350, role: 'RB' },

  { x: 500, y: 150, role: 'WR' },
  { x: 500, y: 220, role: 'WR' },
  { x: 500, y: 480, role: 'WR' },
  { x: 500, y: 550, role: 'WR' }
];


    bluePositions.forEach((position) => {

  const player = new FootballPlayer(
    position.x,
    position.y,
    position.role,
    ex.Color.Blue
  );

  this.add(player);

  this.bluePlayers.push(player);

  if (position.role === 'QB') {
    this.player = player;
  }

});


    // ==========================================
    // BALLON
    // ==========================================

    this.ball = new ex.Actor({
      x: this.player.pos.x + 20,
      y: this.player.pos.y,
      width: 12,
      height: 8
    });

    this.ball.graphics.use(
      new ex.Circle({
        radius: 6,
        color: ex.Color.Brown
      })
    );

    this.add(this.ball);


   
    //Defensive Players Positions
   

    const redPositions: {
  x: number;
  y: number;
  role: FootballRole;
}[] = [

      // Defensive Line
  { x: 600, y: 290, role: 'DL' },
  { x: 600, y: 330, role: 'DL' },
  { x: 600, y: 370, role: 'DL' },
  { x: 600, y: 410, role: 'DL' },

  // Linebackers
  { x: 670, y: 300, role: 'LB' },
  { x: 670, y: 350, role: 'LB' },
  { x: 670, y: 400, role: 'LB' },

  // Cornerbacks
  { x: 700, y: 180, role: 'CB' },
  { x: 700, y: 520, role: 'CB' },

  // Safeties
  { x: 800, y: 280, role: 'S' },
  { x: 800, y: 420, role: 'S' }
];


    redPositions.forEach((position) => {

  const player = new FootballPlayer(
    position.x,
    position.y,
    position.role,
    ex.Color.Red
  );

  this.add(player);

  this.redPlayers.push(player);

});


    // ==========================================
    // CAMÉRA
    // ==========================================

    this.camera.strategy.lockToActor(this.player);

  }


  // ==========================================
  // UPDATE
  // ==========================================

  onPreUpdate(engine: ex.Engine, elapsed: number) {

  // ========================================
  // DÉPLACEMENT DU QB
  // ========================================

  const speed = 200;

  let direction = ex.Vector.Zero;

  if (
    engine.input.keyboard.isHeld(ex.Keys.Z) ||
    engine.input.keyboard.isHeld(ex.Keys.W)
  ) {
    direction.y -= 1;
  }

  if (engine.input.keyboard.isHeld(ex.Keys.S)) {
    direction.y += 1;
  }

  if (
    engine.input.keyboard.isHeld(ex.Keys.Q) ||
    engine.input.keyboard.isHeld(ex.Keys.A)
  ) {
    direction.x -= 1;
  }

  if (engine.input.keyboard.isHeld(ex.Keys.D)) {
    direction.x += 1;
  }

  // Évite d'aller plus vite en diagonale
  if (direction.magnitude > 0) {

    direction = direction.normalize();

    this.player.pos = this.player.pos.add(
      direction.scale(speed * elapsed / 1000)
    );

  }


  // ========================================
  // BALLON
  // ========================================

  this.ball.pos.x = this.player.pos.x + 20;
  this.ball.pos.y = this.player.pos.y;

// ========================================
// IA DE L'ATTAQUE
// ========================================

this.bluePlayers.forEach((blue) => {

  // Le QB est contrôlé manuellement
  if (blue.role === 'QB') {
    return;
  }

  FootballAI.updateOffense(
    blue,
    this.player,
    elapsed
  );

});
 // ========================================
// IA DE LA DÉFENSE
// ========================================

this.redPlayers.forEach((red) => {

  FootballAI.updateDefense(
    red,
    this.player,
    elapsed
  );

});


  // ========================================
  // PLAQUAGE
  // ========================================

  for (const red of this.redPlayers) {

    const distance =
      red.pos.distance(this.player.pos);

    if (distance < 25) {

      console.log("PLAQUAGE !");

      // Replacer le QB
      this.player.pos = new ex.Vector(440, 350);

      // Positions initiales des défenseurs
      const positions = [
        { x: 600, y: 290 },
        { x: 600, y: 330 },
        { x: 600, y: 370 },
        { x: 600, y: 410 },

        { x: 670, y: 300 },
        { x: 670, y: 350 },
        { x: 670, y: 400 },

        { x: 700, y: 180 },
        { x: 700, y: 520 },

        { x: 800, y: 280 },
        { x: 800, y: 420 }
      ];

      this.redPlayers.forEach((redDefender, index) => {

        redDefender.pos = new ex.Vector(
          positions[index].x,
          positions[index].y
        );

      });

            break;
            }

        }
    } 
}
