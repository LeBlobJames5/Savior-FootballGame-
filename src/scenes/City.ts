import * as ex from 'excalibur';
import { Citizen } from '../actors/Citizen';
import { Resources } from '../resources';

export class City extends ex.Scene {

// Initialize the scene
  onInitialize(engine: ex.Engine) {

// Create a city actor
    const city = new ex.Actor({
      x: 0,
      y: 0,
      anchor: ex.Vector.Zero
    });

    city.graphics.use(Resources.City.toSprite());

    this.add(city);

// Create a citizen actor
    const citizen = new Citizen();
citizen.pos = new ex.Vector(100, 100);

this.add(citizen);

// Create a match trigger actor
const matchTrigger = new ex.Actor({
      x: 1116.5,
      y: 584,
      width: 25,
      height: 48,
      collisionType: ex.CollisionType.Fixed
    });

    matchTrigger.graphics.use(
    new ex.Rectangle({
    width: 25,
    height: 48,
    color: ex.Color.Blue,
    opacity: 0.5
  })

);

this.add(matchTrigger);

// Check for collision between the citizen and the match trigger
this.on('postupdate', () => {

      const distance = citizen.pos.distance(matchTrigger.pos);

      if (distance < 25) {

        engine.goToScene('game');

      }

    });

    // Lock the camera to the citizen actor
this.camera.strategy.lockToActor(citizen);


this.camera.zoom = 3.0;


this.camera.strategy.limitCameraBounds(
    new ex.BoundingBox(0, 0, Resources.City.width, Resources.City.height)
  );
  

}
}
