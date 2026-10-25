import * as ex from 'excalibur';
import { Citizen } from '../actors/Citizen';
import { Resources } from '../resources';
import { MusicManager } from '../Music/MusicManager';
import { BigStats } from '../State/stats';

export class City extends ex.Scene {
  private citizen!: Citizen;
  private transitionStarted = false;
  private nearHouse = false;
  private houseHint!: ex.Label;

  private matchPosition = new ex.Vector(1116.5, 584);
  private gymPosition = new ex.Vector(320, 125);
  private housePosition = new ex.Vector(600, 145);

  onInitialize(engine: ex.Engine): void {
    MusicManager.play(Resources.GymCityMusic);

    const city = new ex.Actor({
      x: 0,
      y: 0,
      anchor: ex.Vector.Zero,
      collisionType: ex.CollisionType.PreventCollision
    });
    city.graphics.use(Resources.City.toSprite());
    this.add(city);

    this.citizen = new Citizen();
    //this.citizen.pos = new ex.Vector(100, 100);
    this.add(this.citizen);

    this.addMarker('MATCH', this.matchPosition.x - 25, this.matchPosition.y - 15, ex.Color.fromHex('#3B82F6'));
    this.addMarker('GYM', this.gymPosition.x, this.gymPosition.y - 20, ex.Color.fromHex('#EF4444'));
    this.addMarker('MAISON', this.housePosition.x, this.housePosition.y - 45, ex.Color.fromHex('#56B6C2'));

    const matchTrigger = this.createTrigger(this.matchPosition, 34, 45);
    const gymTrigger = this.createTrigger(this.gymPosition, 28, 28);
    const houseTrigger = this.createTrigger(this.housePosition, 10, 10);

    this.add(matchTrigger);
    this.add(gymTrigger);
    this.add(houseTrigger);

    this.houseHint = new ex.Label({
      text: '',
      pos: new ex.Vector(this.housePosition.x, this.housePosition.y + 38),
      font: new ex.Font({ size: 12, family: 'Arial', color: ex.Color.White }),
      z: 50
    });
    this.add(this.houseHint);
    this.houseHint.graphics.opacity = 0;

    this.on('postupdate', () => {
      if (this.transitionStarted) return;

      const matchDistance = this.citizen.pos.distance(matchTrigger.pos);
      const gymDistance = this.citizen.pos.distance(gymTrigger.pos);
      const houseDistance = this.citizen.pos.distance(houseTrigger.pos);

      if (matchDistance < 40) {
        this.transitionStarted = true;
        engine.goToScene('game');
        return;
      }

      if (gymDistance < 25) {
        this.transitionStarted = true;
        engine.goToScene('gym');
        return;
      }

      this.nearHouse = houseDistance < 42;
      this.houseHint.text = this.nearHouse
        ? `Énergie : ${BigStats.Energy}/${BigStats.MaxEnergy}  •  Appuie sur E pour te reposer`
        : '';
      this.houseHint.pos = new ex.Vector(this.housePosition.x - 120, this.housePosition.y + 30);
      this.houseHint.graphics.opacity = this.nearHouse ? 1 : 0;

      if (this.nearHouse && engine.input.keyboard.wasPressed(ex.Keys.E)) {
        const missingEnergy = BigStats.MaxEnergy - BigStats.Energy;
        if (missingEnergy > 0) {
          BigStats.restoreEnergy(missingEnergy);
          this.houseHint.text = `Repos terminé ! Énergie : ${BigStats.Energy}/${BigStats.MaxEnergy}`;
        } else {
          this.houseHint.text = 'Tu es déjà en pleine énergie !';
        }
      }
    });

    this.camera.strategy.lockToActor(this.citizen);
    this.camera.zoom = 1.5;
    this.camera.strategy.limitCameraBounds(
      new ex.BoundingBox(0, 0, Resources.City.width, Resources.City.height)
    );
  }

  private createTrigger(pos: ex.Vector, width: number, height: number): ex.Actor {
    return new ex.Actor({
      pos,
      width,
      height,
      anchor: ex.Vector.Half,
      collisionType: ex.CollisionType.PreventCollision
    });
  }

  private addHousePart(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ): void {
    const part = new ex.Actor({
      x,
      y,
      width,
      height,
      anchor: ex.Vector.Half,
      collisionType: ex.CollisionType.PreventCollision,
      z: 10
    });
    part.graphics.use(
      new ex.Rectangle({
        width,
        height,
        color: ex.Color.fromHex(color)
      })
    );
    this.add(part);
  }

  private addMarker(
    text: string,
    x: number,
    y: number,
    color: ex.Color
  ): void {
    const marker = new ex.Label({
      text,
      pos: new ex.Vector(x, y),
      font: new ex.Font({
        size: 13,
        family: 'Arial',
        color: color
      }),
      z: 40
    });
    marker.anchor = ex.Vector.Half;
    this.add(marker);
  }

  override onActivate(): void {
    this.transitionStarted = false;
    if (this.citizen) {
      this.citizen.pos = new ex.Vector(360, 477);
    }

    const WallCityBottom = new ex.Actor({
        x: 1200,
        y: 888,
        width: 3000,
        height: 15,
        color: ex.Color.Red,
        opacity: 0.5,
        collisionType: ex.CollisionType.Fixed, //ne se fera pas bouger post-collision
        z: 5
    });

     const WallGym1 = new ex.Actor({
        x: 100,
        y: 72,
        width: 415,
        height: 175,
        color: ex.Color.Red,
        opacity: 0.5,
        collisionType: ex.CollisionType.Fixed, //ne se fera pas bouger post-collision
        z: 5
    });

     const WallGym2 = new ex.Actor({
        x: 1083,
        y: 72,
        width: 1500,
        height: 175,
        color: ex.Color.Blue,
        opacity: 0.5,
        collisionType: ex.CollisionType.Fixed, //ne se fera pas bouger post-collision
        z: 5
    });

    const WallCityLeft = new ex.Actor({
      x: -3,
      y: 500,
      width: 100,
      height: 1000,
      color: ex.Color.Red,
      opacity: 0.5,
      collisionType: ex.CollisionType.Fixed,
      z: 5
    });

     const WallCityRight = new ex.Actor({
      x: 1180,
      y: 500,
      width: 100,
      height: 800,
      color: ex.Color.Red,
      opacity: 0.5,
      collisionType: ex.CollisionType.Fixed,
      z: 5
    });

    const WallStadiumTop = new ex.Actor({
      x: 1120,
      y: 310,
      width: 100,
      height: 310,
      color: ex.Color.Green,
      opacity: 0.5,
      collisionType: ex.CollisionType.Fixed,
      z: 5
    });

    const WallStadiumBottom = new ex.Actor({
      x: 1120,
      y: 845,
      width: 100,
      height: 310,
      color: ex.Color.Green,
      opacity: 0.5,
      collisionType: ex.CollisionType.Fixed,
      z: 5,
    });

    const WallHouse11 = new ex.Actor({
      x: 184,
      y: 370,
      width: 110,
      height: 265,
      color: ex.Color.Green,
      opacity: 0.5,
      collisionType: ex.CollisionType.Fixed,
      z: 5,
    });

    const WallHouse12 = new ex.Actor({
      x: 350,
      y: 300,
      width: 225,
      height: 125,
      color: ex.Color.Red,
      opacity: 0.5,
      collisionType: ex.CollisionType.Fixed,
      z: 5,
    });

    const WallHouse2 = new ex.Actor({
      x: 295,
      y: 685,
      width: 335,
      height: 190,
      color: ex.Color.Green,
      opacity: 0.5,
      collisionType: ex.CollisionType.Fixed,
      z: 5,
    });

    const WallHouse3 = new ex.Actor({
      x: 768,
      y: 685,
      width: 448,
      height: 190,
      color: ex.Color.Blue,
      opacity: 0.5,
      collisionType: ex.CollisionType.Fixed,
      z: 5,
    });

    const WallHouse4 = new ex.Actor({
      x: 768,
      y: 375,
      width: 448,
      height: 270,
      color: ex.Color.Black,
      opacity: 0.5,
      collisionType: ex.CollisionType.Fixed,
      z: 5,
    });

    const WallHouseBottom1 = new ex.Actor({
      x: 770,
      y: 870,
      width: 480,
      height: 50,
      color: ex.Color.Gray,
      opacity: 0.5,
      collisionType: ex.CollisionType.Fixed,
      z: 5,
    });

    const WallHouseBottom2 = new ex.Actor({
      x: 295,
      y: 870,
      width: 335,
      height: 140,
      color: ex.Color.Yellow,
      opacity: 0.5,
      collisionType: ex.CollisionType.Fixed,
      z: 5,
    });

    this.add(WallCityBottom);
    this.add(WallGym1);
    this.add(WallGym2);
    this.add(WallCityLeft);
    this.add(WallCityRight);
    this.add(WallStadiumTop);
    this.add(WallStadiumBottom);
    this.add(WallHouse11);
    this.add(WallHouse12);
    this.add(WallHouse2);
    this.add(WallHouse3);
    this.add(WallHouse4);
    this.add(WallHouseBottom1);
    this.add(WallHouseBottom2)





  }
}