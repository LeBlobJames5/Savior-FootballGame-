import * as ex from 'excalibur';
import { Player } from '../actors/BigMan';
import { BigStats } from '../State/stats'
import { Machines } from '../actors/Machines'
import { Resources } from '../resources'
import { MainMenu } from './MenuPrincipal';



export class Gym extends ex.Scene{
     onInitialize(engine: ex.Engine) {
        const BigManThing = new Player();
        BigManThing.pos= new ex.Vector(1281,360);
        BigManThing.z = 10;

        const gymBackground = new ex.Actor({
      x: engine.drawWidth / 2,
      y: engine.drawHeight / 2,
      width: 800,
      height: 500,
    });

    const gymSprite = Resources.Gym.toSprite();
    gymSprite.width = 3100;
    gymSprite.height = 3000;
    gymBackground.graphics.use(gymSprite);
        
        this.add(BigManThing);
        this.add(gymBackground);
        //this.engine.backgroundColor = ex.Color.fromHex('#85CE64');

        const wallThickness = 30;

        const topWall = new ex.Actor({
          x: 1280,
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
          y: 1115,
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
    }  
}    