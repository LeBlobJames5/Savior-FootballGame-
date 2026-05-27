import * as ex from 'excalibur';
import logoImg from './assets/savior-logo.png';

export const Resources = {
  Logo: new ex.ImageSource(logoImg)
};

export const ResourceLoader = new ex.Loader([Resources.Logo]);
console.log("logoImg =", logoImg);