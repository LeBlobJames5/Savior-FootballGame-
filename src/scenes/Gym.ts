import * as ex from 'excalibur';
import { BigStats } from '../State/stats'
import { GymMachine } from '../actors/Machines'
import { Resources } from '../resources'
import { Citizen } from '../actors/Citizen';
import { GymMenu } from "../UI/GymMenu";
import { Squat, BenchPress, OverheadPress, BarbellRow, PullUps, TrapBarDeadlift, TrapBarCarry, Running, Sprint, IntervalRunning, Rowing, SledPush, SledDrag, StepUp, BoxJump, DepthJump, Elliptical} from "../data/Exercises";
import { MusicManager } from '../Music/MusicManager';


export class Gym extends ex.Scene{
    //Scene new properties
    private squatRack!: GymMachine;
    private treadmill!: GymMachine;
    private rowingMachine!: GymMachine;
    private sled! : GymMachine;
    private plyoBox! : GymMachine;
    private trapBar! : GymMachine;
    private eBike! : GymMachine;
    private gymMenu! : GymMenu;
    private player!: Citizen;

    private statsPanel!: ex.Actor;
    private strengthLabel!: ex.Label;
    private speedLabel!: ex.Label;
    private enduranceLabel!: ex.Label;
    private energyLabel!: ex.Label;

    override onInitialize(engine: ex.Engine) {

    MusicManager.play(Resources.GymCityMusic);
     
    this.player = new Citizen();
    this.player.z = 5;
    this.player.scale = new ex.Vector(4, 4);
    this.add(this.player);
    this.gymMenu = new GymMenu(this);

    this.player.on("collisionstart", (evt) => {

    const other = evt.other;

    if (other instanceof GymMachine) {
        this.gymMenu.setMachine(other);
    }
});

this.player.on("collisionend", (evt) => {

    const other = evt.other;

    if (other instanceof GymMachine) {
        this.gymMenu.clearMachine();
    }

});
        
        //Meadow Sprite
    const gymMeadow = new ex.Actor({
        x: 1280,
        y: 720,
        width: 800,
        height: 500,
    })

    this.add(gymMeadow);

    const meadowSprite = Resources.gymBackgroundImg.toSprite();
        meadowSprite.width = 3100;
        meadowSprite.height = 3000;
        gymMeadow.graphics.use(meadowSprite);

        //Gym Sprite
    const gymBackground = new ex.Actor({
        x: 1280,
        y: 720,
        width: 800,
        height: 500,
    });

    this.add(gymBackground);

    const gymSprite = Resources.Gym.toSprite();
        gymSprite.width = 3100;
        gymSprite.height = 3000;
        gymBackground.graphics.use(gymSprite);


    const cityTrigger = new ex.Actor({
          x: 1280,
          y: 280,
          width: 80,
          height: 80,
          collisionType: ex.CollisionType.Fixed
        });
    
        cityTrigger.graphics.use(
        new ex.Rectangle({
        width: 80,
        height: 80,
        color: ex.Color.Green,
        opacity: 0.5,
            })
        );

          this.add(cityTrigger)

        this.on('postupdate', () => {

      const distance = this.player.pos.distance(cityTrigger.pos);

      if (distance < 70) {

        engine.goToScene('city');

      }

    });


    
    const wallThickness = 30;

    const topWallLeft = new ex.Actor({
        x: 648,
        y: 398,
        width: 1200,
        height: wallThickness,
        color: ex.Color.Red,
        opacity: 0.5,
        collisionType: ex.CollisionType.Fixed, //ne se fera pas bouger post-collision
        z: 5
    });

    const topWallRight = new ex.Actor({
        x: 1915,
        y: 398,
        width: 1200,
        height: wallThickness,
        color: ex.Color.Red,
        opacity: 0.5,
        collisionType: ex.CollisionType.Fixed, //ne se fera pas bouger post-collision
        z: 5
    });

    const bottomWall = new ex.Actor({
        x: 1280,
        y: 1185,
        width: 1550,
        height: wallThickness,
        color: ex.Color.Red,
        opacity: 0.5,
        collisionType: ex.CollisionType.Fixed, //ne se fera pas bouger post-collision
        z: 5
    });

    const leftWall = new ex.Actor({
        x: 823,
        y: 725,
        width: wallThickness,
        height: 1000,
        color: ex.Color.Red,
        opacity: 0.5,
        collisionType: ex.CollisionType.Fixed, //ne se fera pas bouger post-collision
        z: 5,
    });

    const rightWall = new ex.Actor({
        x: 1737,
        y: 725,
        width: wallThickness,
        height: 1000,
        color: ex.Color.Red,
        opacity: 0.5,
        collisionType: ex.CollisionType.Fixed, //ne se fera pas bouger post-collision
        z: 5,
    });

    this.add(topWallRight);
    this.add(topWallLeft);
    this.add(bottomWall);
    this.add(leftWall);
    this.add(rightWall);


this.squatRack = new GymMachine(
        1660,
        435,
        120,
        120,
        "SQUAT RACK",
    [
            Squat,
            BenchPress,
            OverheadPress,
            BarbellRow,
            PullUps
    ]
    );

    this.treadmill = new GymMachine(
        1280,
        715,
        300,
        250,
        "TAPIS DE COURSE",
    [
            Running,
            Sprint,
            IntervalRunning
    ]
    );

    this.rowingMachine = new GymMachine(
        1630,
        1045,
        170,
        220,
        "RAMEUR",
    [
            Rowing,
    ]
    );

    this.sled = new GymMachine(
        950,
        865,
        150,
        560,
        "Sled",
    [
        SledPush,
        SledDrag
    ]
    );

    this.plyoBox = new GymMachine(
        1021,
        430,
        100,
        100,
        "Plyo Box",
    [
        BoxJump,
        StepUp,
        DepthJump
    ]
    );

    this.trapBar = new GymMachine(
        1280,
        1090,
        275,
        145,
        "Trap Bar",
    [
        TrapBarDeadlift,
        TrapBarCarry
    ]
    );

    this.eBike = new GymMachine(
        1670,
        735,
        200,
        265,
        "Vélo elliptique",
    [
        Elliptical,
    ]
    );

    this.add(this.squatRack);
    this.add(this.treadmill);
    this.add(this.rowingMachine);
    this.add(this.sled);
    this.add(this.plyoBox);
    this.add(this.trapBar);
    this.add(this.eBike);
    
    }



//Override onPreUpdate to check if the player is in the detection zone of any machine
override onPreUpdate(engine: ex.Engine, elapsed: number) {

    const machines = [
        this.squatRack,
        this.treadmill,
        this.rowingMachine,
        this.sled,
        this.plyoBox,
        this.trapBar,
        this.eBike
    ];

    const detectionPadding = 80;

    let closestMachine: GymMachine | null = null;
    let closestDistance = Infinity;

    for (const machine of machines) {

        //Center position of the machine
        const machineX = machine.pos.x;
        const machineY = machine.pos.y;

        //Detection zone dimensions
        const detectionWidth =
            machine.width + detectionPadding * 2;

        const detectionHeight =
            machine.height + detectionPadding * 2;

        //Detection zone boundaries
        const left =
            machineX - detectionWidth / 2;

        const right =
            machineX + detectionWidth / 2;

        const top =
            machineY - detectionHeight / 2;

        const bottom =
            machineY + detectionHeight / 2;


        //Player's position
        const playerX = this.player.pos.x;
        const playerY = this.player.pos.y;


        //Is the player inside the detection zone of the machine?
        const inside =
            playerX >= left &&
            playerX <= right &&
            playerY >= top &&
            playerY <= bottom;


        if (inside) {

            const distance =
                this.player.pos.distance(machine.pos);

            if (distance < closestDistance) {

                closestMachine = machine;
                closestDistance = distance;
            }
        }
    }


    //A machine is detected, set it in the gym menu, otherwise clear the gym menu
    if (closestMachine) {

        this.gymMenu.setMachine(closestMachine);

    } else {

        this.gymMenu.clearMachine();
    }
}

override onActivate() {
        this.player.pos = new ex.Vector(1280, 385);
    }
}
