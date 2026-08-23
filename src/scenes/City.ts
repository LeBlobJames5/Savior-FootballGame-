import * as ex from 'excalibur';
import { Citizen } from '../actors/Citizen';
import { Resources } from '../resources';

export class City extends ex.Scene {

  onInitialize(engine: ex.Engine) {

    const city = new ex.Actor({
      x: 0,
      y: 0,
      anchor: ex.Vector.Zero
    });

    city.graphics.use(Resources.City.toSprite());

    this.add(city);


    const citizen = new Citizen();
citizen.pos = new ex.Vector(100, 100);

this.add(citizen);


this.camera.strategy.lockToActor(citizen);


this.camera.zoom = 2.0;


this.camera.strategy.limitCameraBounds(
    new ex.BoundingBox(0, 0, Resources.City.width, Resources.City.height)
  );
  

}
}
