import * as ex from 'excalibur';
import { Player } from '../actors/BigMan';
import { BigStats } from '../Karakteristics/stats'
import { Machines } from '../actors/Machines'
import { Resources } from '../resources'



export class Gym extends ex.Scene{
     onInitialize(engine: ex.Engine) {
        const BigManThing = new Player();
        BigManThing.pos= new ex.Vector(1950,970);
        BigManThing.z = 10;

        const gymBackground = new ex.Actor({
      x: engine.drawWidth / 2,
      y: engine.drawHeight / 2,
      width: 800,
      height: 500
    });

    const gymSprite = Resources.Gym.toSprite();
    gymSprite.width = 1700;
    gymSprite.height = 1200;
    gymBackground.graphics.use(gymSprite);
        
        this.add(BigManThing);
        this.add(gymBackground);

        const wallThickness = 30;

        const topWall = new ex.Actor({
          x: 1280,
          y: 280,
          width: 1200,
          height: wallThickness,
          color: ex.Color.Red,
          opacity: 0.2,
          collisionType: ex.CollisionType.Fixed,
          z: 5
        });

        const bottomWall = new ex.Actor({
          x: 1280,
          y: 1155,
          width: 1550,
          height: wallThickness,
          color: ex.Color.Red,
          opacity: 0.2,
          collisionType: ex.CollisionType.Fixed,
          z: 5
        });

        const leftWall = new ex.Actor({
          x: 605,
          y: 650,
          width: wallThickness,
          height: 1000,
          color: ex.Color.Red,
          opacity: 0.2,
          collisionType: ex.CollisionType.Fixed,
          z: 5,
          rotation: Math.PI / 16,
        });

        const rightWall = new ex.Actor({
          x: 1955,
          y: 650,
          width: wallThickness,
          height: 1000,
          color: ex.Color.Red,
          opacity: 0.2,
          collisionType: ex.CollisionType.Fixed,
          z: 5,
          rotation: Math.PI / -16,
        });

        this.add(topWall);
        this.add(bottomWall);
        this.add(leftWall);
        this.add(rightWall);
    }  
}    