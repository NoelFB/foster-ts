import {Component, Engine} from "./../../core";
import {Calc, Camera, Color, Vector} from "./../../util";
import {Particle} from "./particle";
import {ParticleTemplate} from "./particleTemplate";

export class ParticleSystem extends Component
{
	public template:ParticleTemplate;
	public renderRelativeToEntity:boolean = false;
	private particles:Particle[] = [];
	private static cache:Particle[] = [];

	// temp values used during rendering so we aren't creating new ones every frame
	private static color:Color = new Color();
	private static origin:Vector = new Vector(0.5, 0.5);
	private static scale:Vector = new Vector(0, 0);

	constructor(template:string)
	{
		super();
		this.template = ParticleTemplate.templates[template];
	}

	public update():void
	{
		const dt = Engine.delta;
		for (let i = this.particles.length - 1; i >= 0; i --)
		{
			const p = this.particles[i];
			if (p.percent >= 1)
			{
				this.particles.splice(i, 1);
				ParticleSystem.cache.push(p);
				continue;
			}

			p.percent = Math.min(1, p.percent + dt / p.duration);
			p.x += p.speedX * dt;
			p.y += p.speedY * dt;
			p.speedX += p.accelX * dt;
			p.speedY += p.accelY * dt;
			p.speedX = Calc.approach(p.speedX, 0, p.frictionX * dt);
			p.speedY = Calc.approach(p.speedY, 0, p.frictionY * dt);
		}
	}

	public render(camera:Camera):void
	{
		let tex = this.template.texture;
		if (tex == null)
			tex = Engine.graphics.pixel;
		if (tex == null)
			throw new Error("Particle requires a Texture");

		let pos = this.position;
		if (this.renderRelativeToEntity)
			pos = this.scenePosition;

		const t = this.template;
		for (const p of this.particles)
		{
			const lerp = p.percent;
			const x = pos.x + p.x;
			const y = pos.y + p.y;
			const scaleX = p.scaleFromX + (p.scaleToX - p.scaleFromX) * t.scaleXEaser(lerp);
			const scaleY = p.scaleFromY + (p.scaleToY - p.scaleFromY) * t.scaleYEaser(lerp);
			const rotation = p.rotationFrom + (p.rotationTo - p.rotationFrom) * t.rotationEaser(lerp);
			const alpha = p.alphaFrom + (p.alphaTo - p.alphaFrom) * t.alphaEaser(lerp);
			const color = ParticleSystem.color.lerp(p.colorFrom, p.colorTo, t.colorEaser(lerp)).mult(alpha);

			Engine.graphics.texture(tex, x, y, null, color, ParticleSystem.origin, ParticleSystem.scale.set(scaleX, scaleY), rotation);
		}
	}

	public burst(x:number, y:number, direction:number, rangeX?:number, rangeY?:number, count?:number)
	{
		const t = this.template;

		if (rangeX === undefined || rangeX == null)
			rangeX = 0;
		if (rangeY === undefined || rangeY == null)
			rangeY = 0;
		if (count === undefined)
			count = 1;

		for (let i = 0; i < count; i ++)
		{
			const duration = t.durationBase + Calc.range(t.durationRange);
			if (duration <= 0)
				continue;

			// get particle
			let p:Particle = null;
			if (ParticleSystem.cache.length > 0)
			{
				p = ParticleSystem.cache[0];
				ParticleSystem.cache.splice(0, 1);
			}
			else
				p = new Particle();

			const speed = t.speedBase + Calc.range(t.speedRange);

			// spawn particle
			p.percent 		= 0;
			p.duration 		= duration;
			p.x 			= x + Calc.range(rangeX);
			p.y 			= y + Calc.range(rangeY);
			p.colorFrom 	= Calc.choose(t.colorsFrom);
			p.colorTo 		= Calc.choose(t.colorsTo);
			p.speedX 		= Math.cos(direction) * speed;
			p.speedY 		= -Math.sin(direction) * speed;
			p.accelX 		= t.accelBaseX + Calc.range(t.accelRangeX);
			p.accelY 		= t.accelBaseY + Calc.range(t.accelRangeY);
			p.frictionX 	= t.frictionBaseX + Calc.range(t.frictionRangeX);
			p.frictionY 	= t.frictionBaseY + Calc.range(t.frictionRangeY);
			p.scaleFromX 	= t.scaleFromBaseX + Calc.range(t.scaleFromRangeX);
			p.scaleFromY 	= t.scaleFromBaseY + Calc.range(t.scaleFromRangeY);
			p.scaleToX 		= t.scaleToBaseX + Calc.range(t.scaleToRangeX);
			p.scaleToY		= t.scaleToBaseY + Calc.range(t.scaleToRangeY);
			p.rotationFrom 	= t.rotationFromBase + Calc.range(t.rotationFromRange);
			p.rotationTo 	= t.rotationToBase + Calc.range(t.rotationToRange);
			p.alphaFrom 	= t.alphaFromBase + Calc.range(t.alphaFromRange);
			p.alphaTo 	= t.alphaToBase + Calc.range(t.alphaToRange);

			// addd
			this.particles.push(p);
		}
	}

}
