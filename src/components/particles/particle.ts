import {Color} from "../../util/color";

export class Particle
{
	public x:number;
	public y:number;
	public percent:number;
	public duration:number;

	public colorFrom:Color;
	public colorTo:Color;
	public scaleFromX:number;
	public scaleToX:number;
	public scaleFromY:number;
	public scaleToY:number;
	public rotationFrom:number;
	public rotationTo:number;
	public alphaFrom:number;
	public alphaTo:number;

	public speedX:number;
	public speedY:number;
	public accelX:number;
	public accelY:number;
	public frictionX:number;
	public frictionY:number;
}
