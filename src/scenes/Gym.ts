import * as ex from 'excalibur';
import { BigStats } from '../State/stats'
import { GymMachine } from '../actors/Machines'
import { Resources } from '../resources'
import { Citizen } from '../actors/Citizen';
import { GymMenu } from "../UI/GymMenu";
import { Squat, BenchPress, Deadlift, Running, Rowing, PullUps} from "../data/Exercises";



export class Gym extends ex.Scene{
    
    private squatRack!: GymMachine;
    private treadmill!: GymMachine;
    private rowingMachine!: GymMachine;
    private gymMenu!: GymMenu;
    private player!: Citizen;

    override onInitialize(engine: ex.Engine) {
        
        this.player = new Citizen();
    this.player.pos = new ex.Vector(1281, 360);
    this.player.z = 10;
    this.player.scale = new ex.Vector(4, 4);
    this.add(this.player);

        const gymBackground = new ex.Actor({
      x: engine.drawWidth / 2,
      y: engine.drawHeight / 2,
      width: 800,
      height: 500,
    });

    this.add(gymBackground);

    const gymSprite = Resources.Gym.toSprite();
    gymSprite.width = 3100;
    gymSprite.height = 3000;
    gymBackground.graphics.use(gymSprite);

    const wallThickness = 30;

    const topWall = new ex.Actor({
          x: 1200,
          y: 323,
          width: 1200,
          height: wallThickness,
          color: ex.Color.Red,
          opacity: 0.2,
          collisionType: ex.CollisionType.Fixed, //ne se fera pas bouger post-collision
          z: 5
    });

    const bottomWall = new ex.Actor({
          x: 1280,
          y: 1110,
          width: 1550,
          height: wallThickness,
          color: ex.Color.Red,
          opacity: 0.2,
          collisionType: ex.CollisionType.Fixed, //ne se fera pas bouger post-collision
          z: 5
    });

    const leftWall = new ex.Actor({
          x: 823,
          y: 650,
          width: wallThickness,
          height: 1000,
          color: ex.Color.Red,
          opacity: 0.2,
          collisionType: ex.CollisionType.Fixed, //ne se fera pas bouger post-collision
          z: 5,
    });

    const rightWall = new ex.Actor({
          x: 1737,
          y: 650,
          width: wallThickness,
          height: 1000,
          color: ex.Color.Red,
          opacity: 0.2,
          collisionType: ex.CollisionType.Fixed, //ne se fera pas bouger post-collision
          z: 5,
    });

    this.add(topWall);
    this.add(bottomWall);
    this.add(leftWall);
    this.add(rightWall);


this.squatRack = new GymMachine(
        1660,
        355,
        120,
        120,
        "SQUAT RACK",
        [
            Squat,
            BenchPress,
            Deadlift
        ]
    );

    this.treadmill = new GymMachine(
        1280,
        645,
        300,
        250,
        "TAPIS DE COURSE",
        [
            Running
        ]
    );

    this.rowingMachine = new GymMachine(
        1630,
        945,
        170,
        220,
        "RAMEUR",
        [
            Rowing
        ]
    );

    this.add(this.squatRack);
    this.add(this.treadmill);
    this.add(this.rowingMachine);


//Adding a unique Menu/UI in the gym 
    this.gymMenu = new GymMenu(this);

    }

override onPreUpdate(engine: ex.Engine, elapsed: number) {

        const machines = [
            this.squatRack,
            this.treadmill,
            this.rowingMachine
        ];
  
    let machineDetected = false;

        //Verifies each zone
        for (const machine of machines) {
            if (this.isPlayerInside(machine)) {
                this.gymMenu.setMachine(machine);
                machineDetected = true;
                break;
            }
        }


        //No detected machine = Clear

        if (!machineDetected) {

            this.gymMenu.clearMachine();
        }
    }


//Detecting the player

    private isPlayerInside(
        machine: GymMachine
    ): boolean {

        const halfWidth = machine.width / 2;
        const halfHeight = machine.height / 2;


        const playerX = this.player.pos.x;
        const playerY = this.player.pos.y;


        const machineX = machine.pos.x;
        const machineY = machine.pos.y;


        return (
            playerX >= machineX - halfWidth &&
            playerX <= machineX + halfWidth &&
            playerY >= machineY - halfHeight &&
            playerY <= machineY + halfHeight
        );
    }
}