import * as ex from 'excalibur';
import logoImg from './assets/savior-logo.png';
import playImg from './assets/Play.png';
import SalleDSImg from './assets/SalleDS.png';
import gymImg from './assets/Gym.png';

export const Resources = {
  Logo: new ex.ImageSource(logoImg),
  Play : new ex.ImageSource(playImg),
  SalleDS : new ex.ImageSource(SalleDSImg),
  Gym : new ex.ImageSource(gymImg),
};

class PersoLoader extends ex.Loader {
  public override onDraw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}

export const ResourceLoader = new PersoLoader([Resources.Logo, Resources.Gym, Resources.Play, Resources.SalleDS]);