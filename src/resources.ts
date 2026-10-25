import * as ex from 'excalibur';
import logoImg from './assets/savior-logo.png';
import playImg from './assets/Play.png';
import gymImg from './assets/Gym.png';
import cityImage from './assets/City.png';
import citizenImg from './assets/Citizen.png';
import cityMusic from './assets/GymCityMusic.mp3';
import MenuImg from './assets/Menu.png';
import gymBackgroundImg from './assets/GymBackground.png'
import StaticBlue from './assets/BlueStatic.png'
import RunBlue from './assets/BlueRun.png'
import StaticRed from './assets/RedStatic.png'
import RunRed from './assets/RedRun.png'
import StadiumBackground from './assets/StadiumBackground.png'
import Ball from './assets/Ball.png'


export const Resources = {
  Logo: new ex.ImageSource(logoImg),
  Play : new ex.ImageSource(playImg),
  Gym : new ex.ImageSource(gymImg),
  City: new ex.ImageSource(cityImage),
  Citizen: new ex.ImageSource(citizenImg),
  GymCityMusic: new ex.Sound(cityMusic),
  MainMenu: new ex.ImageSource(MenuImg),
  gymBackgroundImg: new ex.ImageSource(gymBackgroundImg),
  ImgSB: new ex.ImageSource(StaticBlue),
  ImgRB: new ex.ImageSource(RunBlue),
  ImgSR: new ex.ImageSource(StaticRed),
  ImgRR: new ex.ImageSource(RunRed),
  StadiumBackgroundImg: new ex.ImageSource(StadiumBackground),
  BallImg: new ex.ImageSource(Ball)
};

class PersoLoader extends ex.Loader {
  public override onDraw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}

export const ResourceLoader = new PersoLoader([Resources.Logo, 
  Resources.Gym, 
  Resources.Play,  
  Resources.City, 
  Resources.Citizen, 
  Resources.GymCityMusic, 
  Resources.MainMenu, 
  Resources.gymBackgroundImg, 
  Resources.ImgSB,
  Resources.ImgRB,
  Resources.ImgSR,
  Resources.ImgRR,
  Resources.StadiumBackgroundImg,
  Resources.BallImg
]);