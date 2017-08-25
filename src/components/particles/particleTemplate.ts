import {Texture} from "../../assets/textures/texture";
import {Color} from "../../util/color";
import {Ease} from "../../util/ease";

export class ParticleTemplate
{
	public static templates:{[name:string]:ParticleTemplate;} = {};

	public name:string;
	public texture:Texture = null;
	public speedBase:number = 0;
	public speedRange:number = 0;

	public accelBaseX:number = 0;
	public accelRangeX:number = 0;
	public accelBaseY:number = 0;
	public accelRangeY:number = 0;

	public frictionBaseX:number = 0;
	public frictionRangeX:number = 0;
	public frictionBaseY:number = 0;
	public frictionRangeY:number = 0;

	public colorsFrom:Color[] = [Color.white];
	public colorsTo:Color[] = [Color.white];
	public colorEaser:(t:number)=>number = Ease.linear;

	public alphaFromBase:number = 1;
	public alphaFromRange:number = 0;
	public alphaToBase:number = 1;
	public alphaToRange:number = 0;
	public alphaEaser:(t:number)=>number = Ease.linear;

	public rotationFromBase:number = 0;
	public rotationFromRange:number = 0;
	public rotationToBase:number = 0;
	public rotationToRange:number = 0;
	public rotationEaser:(t:number)=>number = Ease.linear;

	public scaleFromBaseX:number = 1;
	public scaleFromRangeX:number = 0;
	public scaleToBaseX:number = 1;
	public scaleToRangeX:number = 0;
	public scaleXEaser:(t:number)=>number = Ease.linear;

	public scaleFromBaseY:number = 1;
	public scaleFromRangeY:number = 0;
	public scaleToBaseY:number = 1;
	public scaleToRangeY:number = 0;
	public scaleYEaser:(t:number)=>number = Ease.linear;

	public durationBase:number = 1;
	public durationRange:number = 1;

	constructor(name:string)
	{
		this.name = name;
		ParticleTemplate.templates[name] = this;
	}

	public tex(texture:Texture):ParticleTemplate
	{
		this.texture = texture;
		return this;
	}

	public speed(Base:number, Range?:number):ParticleTemplate
	{
		this.speedBase = Base;
		this.speedRange = Range || 0;
		return this;
	}

	public accelX(Base:number, Range?:number):ParticleTemplate
	{
		this.accelBaseX = Base;
		this.accelRangeX = Range || 0;
		return this;
	}

	public accelY(Base:number, Range?:number):ParticleTemplate
	{
		this.accelBaseY = Base;
		this.accelRangeY = Range || 0;
		return this;
	}

	public frictionX(Base:number, Range?:number):ParticleTemplate
	{
		this.frictionBaseX = Base;
		this.frictionRangeX = Range || 0;
		return this;
	}

	public frictionY(Base:number, Range?:number):ParticleTemplate
	{
		this.frictionBaseY = Base;
		this.frictionRangeY = Range || 0;
		return this;
	}

	public colors(from:Color[], to?:Color[]):ParticleTemplate
	{
		this.colorsFrom = from;
		this.colorsTo = to || from;
		return this;
	}

	public colorEase(easer:(t:number)=>number):ParticleTemplate
	{
		this.colorEaser = easer;
		return this;
	}

	public alpha(Base:number, Range?:number):ParticleTemplate
	{
		this.alphaFrom(Base, Range);
		this.alphaTo(Base, Range);
		return this;
	}

	public alphaFrom(Base:number, Range?:number):ParticleTemplate
	{
		this.alphaFromBase = Base;
		this.alphaFromRange = Range || 0;
		return this;
	}

	public alphaTo(Base:number, Range?:number):ParticleTemplate
	{
		this.alphaToBase = Base;
		this.alphaToRange = Range || 0;
		return this;
	}

	public alphaEase(easer:(t:number)=>number):ParticleTemplate
	{
		this.alphaEaser = easer;
		return this;
	}

	public rotation(Base:number, Range?:number):ParticleTemplate
	{
		this.rotationFrom(Base, Range);
		this.rotationTo(Base, Range);
		return this;
	}

	public rotationFrom(Base:number, Range?:number):ParticleTemplate
	{
		this.rotationFromBase = Base;
		this.rotationFromRange = Range || 0;
		return this;
	}

	public rotationTo(Base:number, Range?:number):ParticleTemplate
	{
		this.rotationToBase = Base;
		this.rotationToRange = Range || 0;
		return this;
	}

	public rotationEase(easer:(t:number)=>number):ParticleTemplate
	{
		this.rotationEaser = easer;
		return this;
	}

	public scale(Base:number, Range?:number):ParticleTemplate
	{
		this.scaleFrom(Base, Range);
		this.scaleTo(Base, Range);
		return this;
	}

	public scaleFrom(Base:number, Range?:number):ParticleTemplate
	{
		this.scaleFromX(Base, Range);
		this.scaleFromY(Base, Range);
		return this;
	}

	public scaleTo(Base:number, Range?:number):ParticleTemplate
	{
		this.scaleToX(Base, Range);
		this.scaleToY(Base, Range);
		return this;
	}

	public scaleEase(easer:(t:number)=>number):ParticleTemplate
	{
		this.scaleXEaser = easer;
		this.scaleYEaser = easer;
		return this;
	}

	public scaleX(Base:number, Range?:number):ParticleTemplate
	{
		this.scaleFromX(Base, Range);
		this.scaleToX(Base, Range);
		return this;
	}

	public scaleFromX(Base:number, Range?:number):ParticleTemplate
	{
		this.scaleFromBaseX = Base;
		this.scaleFromRangeX = Range || 0;
		return this;
	}

	public scaleToX(Base:number, Range?:number):ParticleTemplate
	{
		this.scaleToBaseX = Base;
		this.scaleToRangeX = Range || 0;
		return this;
	}

	public scaleY(Base:number, Range?:number):ParticleTemplate
	{
		this.scaleFromY(Base, Range);
		this.scaleToY(Base, Range);
		return this;
	}

	public scaleXEase(easer:(t:number)=>number):ParticleTemplate
	{
		this.scaleXEaser = easer;
		return this;
	}

	public scaleFromY(Base:number, Range?:number):ParticleTemplate
	{
		this.scaleFromBaseY = Base;
		this.scaleFromRangeY = Range || 0;
		return this;
	}

	public scaleToY(Base:number, Range?:number):ParticleTemplate
	{
		this.scaleToBaseY = Base;
		this.scaleToRangeY = Range || 0;
		return this;
	}

	public scaleYEase(easer:(t:number)=>number):ParticleTemplate
	{
		this.scaleYEaser = easer;
		return this;
	}

	public duration(Base:number, Range?:number):ParticleTemplate
	{
		this.durationBase = Base;
		this.durationRange = Range || 0;
		return this;
	}
}
