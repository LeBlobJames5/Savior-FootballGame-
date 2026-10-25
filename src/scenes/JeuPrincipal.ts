import * as ex from 'excalibur';
import { FootballPlayer, FootballRole } from '../actors/Bot';
import { BigStats } from '../State/stats';
import { MatchResults } from '../UI/MatchResults';
import { Resources } from '../resources'

type PlayPhase =
  | 'pre-snap'
  | 'handoff'
  | 'running'
  | 'dead'
  | 'finished';

export class GameScene extends ex.Scene {
  private qb!: FootballPlayer;
  private rb!: FootballPlayer;
  private ball!: ex.Actor;

  private bluePlayers: FootballPlayer[] = [];
  private redPlayers: FootballPlayer[] = [];

  private phase: PlayPhase = 'pre-snap';
  private phaseTime = 0;

  private matchStarted = false;
  private matchOver = false;
  private matchElapsed = 0;
  private readonly matchDuration = 60;

  private score = 0;
  private touchdowns = 0;
  private plays = 0;
  private tacklesSuffered = 0;
  private tacklesMade = 0;
  private injuriesSuffered = 0;
  private injuriesCaused = 0;
  private totalYards = 0;
  private longestRun = 0;

  private playStartX = 0;
  private nextPlaySpot = 500;
  private tackled = false;

  private readonly fieldWidth = 1200;
  private readonly fieldHeight = 700;
  private readonly touchdownX = 1150;

  private gap = 2;
  private gapOffsets = [0, 0, 0, 0, 0];

  // Réaction individuelle de la défense après la remise du ballon.
  private defenseReactionDelays = new Map<FootballPlayer, number>();

  // Les DL peuvent gagner un duel puis poursuivre le RB pendant un court moment.
  private shedTimers = new Map<FootballPlayer, number>();
  private shedAttemptTimers = new Map<FootballPlayer, number>();

  private nextPlayLabel!: ex.Label;
  private summaryLabel!: ex.Label;
  private timerElement!: ex.ScreenElement;
  private resultElements: ex.ScreenElement[] = [];
  private resultsShown = false;
  private gameEngine!: ex.Engine;

  onInitialize(engine: ex.Engine): void {
    this.gameEngine = engine;

      //Stadium Sprite
        const StadiumBackG = new ex.Actor({
            x: engine.drawWidth / 4.5,
            y: engine.drawHeight / 3.5,
        })

        this.add(StadiumBackG);

        const StadiumSprite = Resources.StadiumBackgroundImg.toSprite();
            StadiumSprite.width = 2900;
            StadiumSprite.height = 1900;
            StadiumBackG.graphics.use(StadiumSprite);

    this.createField();

    // OFFENSE : 11 joueurs
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

    for (const p of bluePositions) {
      const player = new FootballPlayer(
        p.x,
        p.y,
        p.role,
        ex.Color.Blue
      );

      this.add(player);
      this.bluePlayers.push(player);

      if (p.role === 'QB') this.qb = player;
      if (p.role === 'RB') this.rb = player;
    }

    // DEFENSE : 11 joueurs
    const redPositions: {
      x: number;
      y: number;
      role: FootballRole;
    }[] = [
      { x: 600, y: 290, role: 'DL' },
      { x: 600, y: 330, role: 'DL' },
      { x: 600, y: 370, role: 'DL' },
      { x: 600, y: 410, role: 'DL' },

      { x: 670, y: 300, role: 'LB' },
      { x: 670, y: 350, role: 'LB' },
      { x: 670, y: 400, role: 'LB' },

      { x: 700, y: 180, role: 'CB' },
      { x: 700, y: 520, role: 'CB' },

      { x: 800, y: 280, role: 'S' },
      { x: 800, y: 420, role: 'S' }
    ];

    for (const p of redPositions) {
      const player = new FootballPlayer(
        p.x,
        p.y,
        p.role,
        ex.Color.Red
      );

      this.add(player);
      this.redPlayers.push(player);

      // Les défenseurs ne réagissent pas tous à la même milliseconde.
      const index = this.redPlayers.length - 1;
      const baseDelay = p.role === 'DL' ? 0.18 : 0.28;
      this.defenseReactionDelays.set(
        player,
        baseDelay + (index % 5) * 0.075
      );
      this.shedTimers.set(player, 0);
      this.shedAttemptTimers.set(player, 0.25 + Math.random() * 0.45);
    }

    // BALLON
    this.ball = new ex.Actor({
      x: this.qb.pos.x + 12,
      y: this.qb.pos.y,
      width: 12,
      height: 8,
      collisionType: ex.CollisionType.PreventCollision
    });

    this.ball.graphics.use(
      new ex.Circle({
        radius: 6,
        color: ex.Color.fromHex('#713F22')
      })
    );

    this.add(this.ball);

    // MESSAGE NEXT PLAY
    this.nextPlayLabel = new ex.Label({
      text: '',
      pos: new ex.Vector(0, 0),
      font: new ex.Font({
        size: 24,
        family: 'Arial'
      }),
      color: ex.Color.White
    });

    this.add(this.nextPlayLabel);
    this.nextPlayLabel.graphics.opacity = 0;

    // BILAN FINAL
    this.summaryLabel = new ex.Label({
      text: '',
      pos: new ex.Vector(0, 0),
      font: new ex.Font({
        size: 20,
        family: 'Arial'
      }),
      color: ex.Color.White
    });

    this.add(this.summaryLabel);
    this.summaryLabel.graphics.opacity = 0;

    // Chronomètre fixé à l'écran : il reste visible malgré le suivi de la caméra.
    this.timerElement = new ex.ScreenElement({
      x: 18,
      y: 16,
      z: 100
    });
    this.timerElement.anchor = ex.Vector.Zero;
    this.timerElement.graphics.use(
      new ex.Text({
        text: 'TEMPS : 1:00',
        font: new ex.Font({
          size: 24,
          family: 'Arial',
          color: ex.Color.White
        })
      })
    );
    this.add(this.timerElement);

    this.chooseNewGap();
    this.positionBall();

    // CAMÉRA : suivre le running back sans dépasser le terrain
    this.camera.zoom = 1.5;

    this.camera.strategy.lockToActor(this.rb);

  }

  // --------------------------------------------------
  // TERRAIN
  // --------------------------------------------------

  private createField(): void {
    const field = new ex.Actor({
      x: 0,
      y: 0,
      width: this.fieldWidth,
      height: this.fieldHeight,
      anchor: ex.Vector.Zero,
      collisionType: ex.CollisionType.PreventCollision
    });

    field.graphics.use(
      new ex.Rectangle({
        width: this.fieldWidth,
        height: this.fieldHeight,
        color: ex.Color.fromHex('#287A38')
      })
    );

    this.add(field);

    for (let x = 100; x < this.fieldWidth; x += 100) {
      const line = new ex.Actor({
        x,
        y: 0,
        width: 2,
        height: this.fieldHeight,
        anchor: ex.Vector.Zero,
        collisionType: ex.CollisionType.PreventCollision
      });

      line.graphics.use(
        new ex.Rectangle({
          width: 2,
          height: this.fieldHeight,
          color: ex.Color.White,
          opacity: 0.35
        })
      );

      this.add(line);
    }
  }

  // --------------------------------------------------
  // BOUCLE PRINCIPALE
  // --------------------------------------------------

  onPreUpdate(engine: ex.Engine, elapsed: number): void {
    const dt = elapsed / 1000;

    if (this.matchOver || this.phase === 'finished') {
      if (engine.input.keyboard.wasPressed(ex.Keys.Enter)) {
        engine.goToScene('city');
      }
      return;
    }

    this.phaseTime += dt;

    // Le chronomètre continue entre les actions.
    if (this.matchStarted) {
      this.matchElapsed += dt;

      if (this.matchElapsed >= this.matchDuration) {
        this.matchElapsed = this.matchDuration;
        this.updateTimerDisplay();
        this.finishMatch();
        return;
      }
      this.updateTimerDisplay();
    }

    // Affiche le temps complet avant le premier snap.
    if (!this.matchStarted) {
      this.updateTimerDisplay();
    }

    // AVANT LE SNAP
    if (this.phase === 'pre-snap') {
      this.positionBall();

      if (engine.input.keyboard.wasPressed(ex.Keys.Space)) {
        this.startPlay();
      }

      return;
    }

    // APRÈS UN PLAQUAGE OU UN TOUCHDOWN
    if (this.phase === 'dead') {
      this.positionBall();

      if (engine.input.keyboard.wasPressed(ex.Keys.Space)) {
        this.resetPlay();
      }

      return;
    }

    // HANDOFF QB -> RB
    if (this.phase === 'handoff') {
      this.positionBall();

      if (this.phaseTime >= 0.45) {
        this.phase = 'running';
        this.phaseTime = 0;
      }

      return;
    }

    // ACTION EN COURS
    if (this.phase === 'running') {
      this.controlRunningBack(engine, dt);

      this.updateOffensiveLine(dt);
      this.updateWideReceivers(dt);
      this.updateDefensiveLine(dt);
      this.updateLinebackers(dt);
      this.updateDefensiveBacks(dt);

      this.clampPlayers();
      this.positionBall();
      this.checkTackle();
    }
  }

  // --------------------------------------------------
  // SNAP ET HANDOFF
  // --------------------------------------------------

  private startPlay(): void {
    if (this.matchOver) return;

    this.matchStarted = true;
    this.phase = 'handoff';
    this.phaseTime = 0;
    this.playStartX = this.rb.pos.x;
    this.plays++;
    this.tackled = false;

    this.chooseNewGap();
  }

  private positionBall(): void {
    if (this.phase === 'pre-snap') {
      this.ball.pos = new ex.Vector(
        this.qb.pos.x + 12,
        this.qb.pos.y
      );
      return;
    }

    if (this.phase === 'handoff') {
      const progress = Math.min(1, this.phaseTime / 0.45);

      this.ball.pos = new ex.Vector(
        this.qb.pos.x * (1 - progress) +
          this.rb.pos.x * progress,
        this.qb.pos.y * (1 - progress) +
          this.rb.pos.y * progress
      );
      return;
    }

    this.ball.pos = new ex.Vector(
      this.rb.pos.x + 13,
      this.rb.pos.y
    );
  }

  // --------------------------------------------------
  // CHOIX DU GAP
  // --------------------------------------------------

  private chooseNewGap(): void {
    this.gap = Math.floor(Math.random() * 5);

    for (let i = 0; i < 5; i++) {
      this.gapOffsets[i] = (Math.random() - 0.5) * 24;
    }
  }

  // --------------------------------------------------
  // CONTRÔLE DU RUNNING BACK
  // --------------------------------------------------

  private controlRunningBack(
    engine: ex.Engine,
    dt: number
  ): void {
    let dx = 0;
    let dy = 0;

    if (
      engine.input.keyboard.isHeld(ex.Keys.Z) ||
      engine.input.keyboard.isHeld(ex.Keys.W)
    ) {
      dy -= 1;
    }

    if (engine.input.keyboard.isHeld(ex.Keys.S)) {
      dy += 1;
    }

    if (
      engine.input.keyboard.isHeld(ex.Keys.Q) ||
      engine.input.keyboard.isHeld(ex.Keys.A)
    ) {
      dx -= 1;
    }

    if (engine.input.keyboard.isHeld(ex.Keys.D)) {
      dx += 1;
    }

    if (dx === 0 && dy === 0) return;

    const direction = new ex.Vector(dx, dy).normalize();

    // Stats de salle : faibles au niveau de base.
    const trainedSpeed = Math.max(
      0,
      Math.min(100, BigStats.Speed ?? 0)
    );

    const speed = 65 + trainedSpeed * 1.2;

    // Respecte aussi un éventuel malus de blessure
    // défini dans FootballPlayer.getCurrentSpeed().
    const playerSpeed = this.rb.getCurrentSpeed();

    const actualSpeed =
      trainedSpeed === 0
        ? Math.min(speed, playerSpeed)
        : Math.min(speed, playerSpeed);

    this.rb.pos = this.rb.pos.add(
      direction.scale(actualSpeed * dt)
    );
  }

  // --------------------------------------------------
  // OFFENSIVE LINE
  // --------------------------------------------------

  private updateOffensiveLine(dt: number): void {
    const linemen = this.bluePlayers.filter(p =>
      ['LT', 'LG', 'C', 'RG', 'RT'].indexOf(p.role) !== -1
    );

    const defensiveLinemen = this.redPlayers.filter(
      p => p.role === 'DL'
    );

    linemen.forEach((lineman, index) => {
      const preferred =
        defensiveLinemen[index % defensiveLinemen.length];

      const gapCenter = 310 + this.gap * 20;

      const target = new ex.Vector(
        Math.min(this.rb.pos.x + 45, 570),
        gapCenter +
          this.gapOffsets[index] +
          (index - 2) * 18
      );

      const nearest = this.nearestPlayer(
        lineman.pos,
        defensiveLinemen
      );

      const blockerTarget =
        nearest && nearest.pos.distance(lineman.pos) < 95
          ? new ex.Vector(
              nearest.pos.x - 23,
              nearest.pos.y + (index - 2) * 9
            )
          : target;

      this.moveToward(lineman, blockerTarget, 95, dt);

    });

    if (this.phase === 'running') {
      this.moveToward(
        this.qb,
        new ex.Vector(
          this.rb.pos.x - 35,
          this.rb.pos.y
        ),
        65,
        dt
      );
    }
  }

  // --------------------------------------------------
  // RECEVEURS
  // --------------------------------------------------

  private updateWideReceivers(dt: number): void {
    const receivers = this.bluePlayers.filter(
      p => p.role === 'WR'
    );

    receivers.forEach((wr, index) => {
      const vertical = index % 2 === 0 ? -1 : 1;

      const target = new ex.Vector(
        Math.min(850, wr.homePosition.x + 240),
        wr.homePosition.y + vertical * 45
      );

      this.moveToward(wr, target, 105, dt);
    });
  }

  // --------------------------------------------------
  // DEFENSIVE LINE
  // --------------------------------------------------

  private updateDefensiveLine(dt: number): void {
    const dline = this.redPlayers.filter(p => p.role === 'DL');
    const blockers = this.bluePlayers.filter(p =>
      ['LT', 'LG', 'C', 'RG', 'RT'].indexOf(p.role) !== -1
    );

    for (const defender of dline) {
      const reactionDelay = this.defenseReactionDelays.get(defender) ?? 0.25;
      let shedTime = Math.max(0, (this.shedTimers.get(defender) ?? 0) - dt);
      let attemptTime = Math.max(0, (this.shedAttemptTimers.get(defender) ?? 0) - dt);
      this.shedTimers.set(defender, shedTime);
      this.shedAttemptTimers.set(defender, attemptTime);

      const blocker = this.nearestPlayer(defender.pos, blockers);
      const blockDistance = blocker ? defender.pos.distance(blocker.pos) : Infinity;

      // Après un court délai, un DL cherche lui aussi à rejoindre le porteur.
      // S'il est encore bloqué, il doit gagner son duel avant de poursuivre.
      if (this.phaseTime >= reactionDelay && shedTime > 0) {
        this.moveToward(defender, this.chaseTarget(defender), this.defenderSpeed(defender, 124), dt);
        continue;
      }

      if (this.phaseTime >= reactionDelay && (!blocker || blockDistance > 58)) {
        this.moveToward(defender, this.chaseTarget(defender), this.defenderSpeed(defender, 120), dt);
        continue;
      }

      if (blocker && blockDistance < 62) {
        // Le défenseur engage le bloqueur au lieu de traverser son sprite.
        const side = defender.pos.y < blocker.pos.y ? -1 : 1;
        const engagementTarget = new ex.Vector(
          blocker.pos.x + 19,
          blocker.pos.y + side * 17
        );

        if (blockDistance > 31) {
          this.moveToward(defender, engagementTarget, this.defenderSpeed(defender, 78), dt);
        } else {
          // Tentative périodique de désengagement : la force aide, sans garantir la réussite.
          if (attemptTime <= 0) {
            const strength = Math.max(0, defender.strength ?? 30);
            const successChance = Math.max(0.12, Math.min(0.48, 0.16 + strength * 0.004));
            if (Math.random() < successChance) {
              shedTime = 0.85 + Math.random() * 0.65;
              this.shedTimers.set(defender, shedTime);
              this.moveToward(defender, this.chaseTarget(defender), this.defenderSpeed(defender, 124), dt);
            }
            // Réessaie régulièrement : les duels ne sont pas résolus chaque frame.
            attemptTime = 0.55 + Math.random() * 0.55;
            this.shedAttemptTimers.set(defender, attemptTime);
          }
        }
      } else if (this.phaseTime < reactionDelay) {
        // Avant la réaction, conserve une position de départ crédible.
        this.moveToward(
          defender,
          new ex.Vector(defender.homePosition.x - 12, defender.homePosition.y),
          72,
          dt
        );
      }
    }
  }

  // --------------------------------------------------
  // LINEBACKERS
  // --------------------------------------------------

  private updateLinebackers(dt: number): void {
    const lbs = this.redPlayers.filter(p => p.role === 'LB');
    const receivers = this.bluePlayers.filter(p => p.role === 'WR');

    lbs.forEach((lb, index) => {
      const reactionDelay = this.defenseReactionDelays.get(lb) ?? 0.35;

      if (this.phaseTime >= reactionDelay) {
        // Les LB ferment des angles différents au lieu de courir tous en ligne droite.
        this.moveToward(lb, this.chaseTarget(lb), this.defenderSpeed(lb, 116), dt);
        return;
      }

      const zoneY = 300 + index * 50;
      const target = new ex.Vector(
        Math.min(this.rb.pos.x + 65, 650),
        this.rb.pos.y * 0.65 + zoneY * 0.35
      );
      const receiver = this.nearestPlayer(lb.pos, receivers);

      if (receiver && receiver.pos.distance(lb.pos) < 115 && receiver.pos.x > 500) {
        this.moveToward(lb, receiver.pos, this.defenderSpeed(lb, 88), dt);
      } else {
        this.moveToward(lb, target, this.defenderSpeed(lb, 98), dt);
      }
    });
  }

  // --------------------------------------------------
  // CORNERBACKS ET SAFETIES
  // --------------------------------------------------

  private updateDefensiveBacks(dt: number): void {
    const receivers = this.bluePlayers.filter(p => p.role === 'WR');
    const corners = this.redPlayers.filter(p => p.role === 'CB');
    const safeties = this.redPlayers.filter(p => p.role === 'S');

    corners.forEach((cb, index) => {
      const reactionDelay = this.defenseReactionDelays.get(cb) ?? 0.4;
      if (this.phaseTime >= reactionDelay) {
        this.moveToward(cb, this.chaseTarget(cb), this.defenderSpeed(cb, 118), dt);
        return;
      }

      const receiver = receivers[index === 0 ? 0 : receivers.length - 1];
      if (receiver) {
        this.moveToward(
          cb,
          new ex.Vector(receiver.pos.x + 18, receiver.pos.y),
          this.defenderSpeed(cb, 105),
          dt
        );
      }
    });

    safeties.forEach((safety, index) => {
      const reactionDelay = this.defenseReactionDelays.get(safety) ?? 0.45;
      if (this.phaseTime >= reactionDelay) {
        this.moveToward(safety, this.chaseTarget(safety), this.defenderSpeed(safety, 122), dt);
        return;
      }

      const receiver = this.nearestPlayer(safety.pos, receivers);
      if (receiver && receiver.pos.x > 620) {
        this.moveToward(
          safety,
          new ex.Vector(receiver.pos.x + 25, receiver.pos.y),
          this.defenderSpeed(safety, 100),
          dt
        );
      } else {
        this.moveToward(
          safety,
          new ex.Vector(Math.max(680, this.rb.pos.x + 140), index === 0 ? 270 : 430),
          this.defenderSpeed(safety, 85),
          dt
        );
      }
    });
  }

  // Point de convergence légèrement décalé pour que les défenseurs attaquent
  // depuis plusieurs angles et ne s'empilent pas exactement au même endroit.
  private chaseTarget(defender: FootballPlayer): ex.Vector {
    const index = this.redPlayers.indexOf(defender);
    const offsets = [-18, 14, -8, 22, 0, -24, 10, 18, -12, 26, -2];
    const yOffset = offsets[index % offsets.length] ?? 0;
    const leadX = this.rb.pos.x + 12;
    const leadY = this.rb.pos.y + yOffset * 0.45;
    return new ex.Vector(leadX, leadY);
  }

  private defenderSpeed(defender: FootballPlayer, baseSpeed: number): number {
    const playerSpeed = typeof defender.getCurrentSpeed === 'function'
      ? defender.getCurrentSpeed()
      : (defender.speed ?? baseSpeed);
    // La vitesse de base des défenseurs reste équilibrée autour de la valeur IA.
    const ratio = Math.max(0.65, Math.min(1.2, playerSpeed / 150));
    return baseSpeed * ratio;
  }

  // --------------------------------------------------
  // OUTILS DE DÉPLACEMENT
  // --------------------------------------------------

  private moveToward(
    player: FootballPlayer,
    target: ex.Vector,
    speed: number,
    dt: number
  ): void {
    const delta = target.sub(player.pos);
    const distance = delta.magnitude;

    if (distance < 2) return;

    const step = Math.min(distance, speed * dt);

    player.pos = player.pos.add(
      delta.normalize().scale(step)
    );
  }

  private nearestPlayer(
    position: ex.Vector,
    players: FootballPlayer[]
  ): FootballPlayer | undefined {
    let nearest: FootballPlayer | undefined;
    let minDistance = Infinity;

    for (const player of players) {
      const distance = position.distance(player.pos);

      if (distance < minDistance) {
        minDistance = distance;
        nearest = player;
      }
    }

    return nearest;
  }

  private clampPlayers(): void {
    for (const player of [
      ...this.bluePlayers,
      ...this.redPlayers
    ]) {
      player.pos.x = Math.max(
        10,
        Math.min(this.fieldWidth - 10, player.pos.x)
      );

      player.pos.y = Math.max(
        10,
        Math.min(this.fieldHeight - 10, player.pos.y)
      );
    }
  }

  // --------------------------------------------------
  // PLAQUAGES ET TOUCHDOWNS
  // --------------------------------------------------

  private checkTackle(): void {
    if (
      this.phase !== 'running' ||
      this.tackled ||
      this.matchOver
    ) {
      return;
    }

    // TOUCHDOWN
    if (this.rb.pos.x >= this.touchdownX) {
      const yards = Math.max(
        0,
        this.rb.pos.x - this.playStartX
      );

      this.touchdowns++;
      this.score += 6;
      this.totalYards += yards;
      this.longestRun = Math.max(
        this.longestRun,
        yards
      );

      this.nextPlaySpot = 500;
      this.endPlay('TOUCHDOWN! +6 POINTS');
      return;
    }

    // PLAQUAGE PAR UN DÉFENSEUR
    for (const defender of this.redPlayers) {
      if (defender.pos.distance(this.rb.pos) < 23) {
        this.tacklesSuffered++;

        const yards = Math.max(
          0,
          this.rb.pos.x - this.playStartX
        );

        this.totalYards += yards;
        this.longestRun = Math.max(
          this.longestRun,
          yards
        );

        const strength = Math.max(
          0,
          BigStats.Strength ?? 0
        );

        const endurance = Math.max(
          0,
          BigStats.Endurance ?? 0
        );

        // Niveau de base : risque très élevé.
        const injuryChance = Math.max(
          0.15,
          Math.min(
            0.80,
            0.80 - strength * 0.003 - endurance * 0.004
          )
        );

        if (Math.random() < injuryChance) {
          this.rb.injure();
          this.injuriesSuffered++;
        }

        this.nextPlaySpot = this.rb.pos.x;
        this.endPlay('TACKLED!');
        return;
      }
    }

    // SORTIE DU TERRAIN
    if (
      this.rb.pos.x <= 0 ||
      this.rb.pos.y <= 0 ||
      this.rb.pos.y >= this.fieldHeight
    ) {
      this.nextPlaySpot = this.rb.pos.x;
      this.endPlay('OUT OF BOUNDS!');
    }
  }

  private endPlay(message: string): void {
    if (this.matchOver) return;

    this.tackled = true;
    this.phase = 'dead';
    this.phaseTime = 0;

    this.positionBall();

    this.nextPlayLabel.pos = new ex.Vector(
      this.rb.pos.x - 450,
      this.rb.pos.y - 55
    );

    this.nextPlayLabel.text =
      `${message}\nPROCHAIN PLAY — ESPACE`;

    this.nextPlayLabel.graphics.opacity = 1;
  }

  // --------------------------------------------------
  // PRÉPARER LE JEU SUIVANT
  // --------------------------------------------------

  private resetPlay(): void {
    if (this.matchOver) return;

    const los = Math.max(
      150,
      Math.min(this.fieldWidth - 150, this.nextPlaySpot)
    );

    const lineY = [270, 310, 350, 390, 430];

    const linemen = this.bluePlayers.filter(p =>
      ['LT', 'LG', 'C', 'RG', 'RT'].indexOf(p.role) !== -1
    );

    linemen.forEach((player, i) => {
      player.pos = new ex.Vector(los, lineY[i]);
    });

    this.qb.pos = new ex.Vector(los - 60, 350);
    this.rb.pos = new ex.Vector(los - 120, 350);

    const receivers = this.bluePlayers.filter(
      p => p.role === 'WR'
    );

    const receiverY = [150, 220, 480, 550];

    receivers.forEach((player, i) => {
      player.pos = new ex.Vector(los, receiverY[i]);
    });

    const dline = this.redPlayers.filter(
      p => p.role === 'DL'
    );

    dline.forEach((player, i) => {
      player.pos = new ex.Vector(
        los + 100,
        290 + i * 40
      );
    });

    const lbs = this.redPlayers.filter(
      p => p.role === 'LB'
    );

    lbs.forEach((player, i) => {
      player.pos = new ex.Vector(
        los + 170,
        300 + i * 50
      );
    });

    const corners = this.redPlayers.filter(
      p => p.role === 'CB'
    );

    corners.forEach((player, i) => {
      player.pos = new ex.Vector(
        los + 200,
        i === 0 ? 180 : 520
      );
    });

    const safeties = this.redPlayers.filter(
      p => p.role === 'S'
    );

    safeties.forEach((player, i) => {
      player.pos = new ex.Vector(
        Math.min(los + 300, this.fieldWidth - 20),
        i === 0 ? 280 : 420
      );
    });

    this.phase = 'pre-snap';
    this.phaseTime = 0;
    this.tackled = false;

    for (const defender of this.redPlayers) {
      this.shedTimers.set(defender, 0);
      this.shedAttemptTimers.set(defender, 0.25 + Math.random() * 0.45);
    }

    this.chooseNewGap();

    this.nextPlayLabel.graphics.opacity = 0;
    this.positionBall();
  }

  // --------------------------------------------------
  // FIN DU MATCH ET RÉCAPITULATIF
  // --------------------------------------------------

  private updateTimerDisplay(): void {
    const remaining = Math.max(
      0,
      Math.ceil(this.matchDuration - this.matchElapsed)
    );
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    const secondsText = seconds < 10 ? '0' + seconds : seconds.toString();

    this.timerElement.graphics.use(
      new ex.Text({
        text: `TEMPS : ${minutes}:${secondsText}`,
        font: new ex.Font({
          size: 24,
          family: 'Arial',
          color: remaining <= 10 ? ex.Color.Yellow : ex.Color.White
        })
      })
    );
  }

  private finishMatch(): void {
    if (this.matchOver) return;

    this.matchOver = true;
    this.phase = 'finished';
    this.nextPlayLabel.graphics.opacity = 0;
    this.summaryLabel.graphics.opacity = 0;

    if (this.resultsShown) return;
    this.resultsShown = true;

    const strength = BigStats.Strength ?? 0;
    const speed = BigStats.Speed ?? 0;
    const endurance = BigStats.Endurance ?? 0;
    const secondsValue = Math.floor(this.matchElapsed % 60);
    const minutes = Math.floor(this.matchElapsed / 60);
    const seconds = secondsValue < 10
      ? '0' + secondsValue
      : secondsValue.toString();

    const resultText =
      `FIN DU MATCH\n\n` +
      `Temps joué : ${minutes}:${seconds}\n` +
      `Score : ${this.score}\n` +
      `Touchdowns : ${this.touchdowns}\n` +
      `Actions jouées : ${this.plays}\n` +
      `Plaquages subis : ${this.tacklesSuffered}\n` +
      `Blessures subies : ${this.injuriesSuffered}\n` +
      `Blessures causées : ${this.injuriesCaused}\n` +
      `Yards gagnés : ${Math.round(this.totalYards)}\n` +
      `Meilleure course : ${Math.round(this.longestRun)}\n\n` +
      `STATISTIQUES DU JOUEUR\n` +
      `Force : ${strength}\n` +
      `Vitesse : ${speed}\n` +
      `Endurance : ${endurance}`;

    this.resultElements = MatchResults(
      this,
      this.gameEngine,
      resultText,
      () => this.gameEngine.goToScene('city')
    );
  }
}