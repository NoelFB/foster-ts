/// <reference path="./../../component.ts"/>
class ParticleSystem extends Component
{
	public template:ParticleTemplate;
	private particles:Particle[] = [];
	private static cache:Particle[] = [];

	// temp values used during rendering so we aren't creating new ones every frame
	private static color:Color = new Color();
	private static origin:Vector = new Vector(0.5, 0.5);
	private static scale:Vector = new Vector(0, 0);

	constructor(template:ParticleTemplate)
	{
		super();
		this.template = template;
	}

	public update():void
	{
		let dt = Engine.delta;
		for (let i = this.particles.length - 1; i >= 0; i --)
		{
			let p = this.particles[i];
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
		if (Engine.graphics.pixel == null)
			throw "Particle System requires Engine.graphis.pixel to be set";

		let pos = this.scenePosition;
		let t = this.template;
		for (let i = 0; i < this.particles.length; i ++)
		{
			let p = this.particles[i];
			let lerp = p.percent;

			let x = pos.x + p.x;
			let y = pos.y + p.y;
			let scaleX = p.scaleFromX + (p.scaleToX - p.scaleFromX) * t.scaleXEaser(lerp);
			let scaleY = p.scaleFromY + (p.scaleToY - p.scaleFromY) * t.scaleYEaser(lerp);
			let rotation = p.rotationFrom + (p.rotationTo - p.rotationFrom) * t.rotationEaser(lerp);
			let color = Color.lerp(p.colorFrom, p.colorTo, t.colorEaser(lerp), ParticleSystem.color);

			Engine.graphics.texture(Engine.graphics.pixel, x, y, null, color, ParticleSystem.origin, ParticleSystem.scale.set(scaleX, scaleY), rotation);
		}
	}

	public burst(x:number, y:number, rangeX?:number, rangeY?:number, count?:number)
	{
		let t = this.template;

		if (rangeX == undefined || rangeX == null)
			rangeX = 0;
		if (rangeY == undefined || rangeY == null)
			rangeY = 0;

		for (let i = 0; i < count || 1; i ++)
		{
			let duration = t.durationBase + Calc.range(t.durationRange);
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

			// spawn particle
			p.percent 		= 0;
			p.duration 		= duration;
			p.x 			= x + Calc.range(rangeX);
			p.y 			= y + Calc.range(rangeY);
			p.colorFrom 	= Calc.choose(t.colorsFrom);
			p.colorTo 		= Calc.choose(t.colorsTo);
			p.speedX 		= t.speedBaseX + Calc.range(t.speedRangeX);
			p.speedY 		= t.speedBaseY + Calc.range(t.speedRangeY);
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

			// addd
			this.particles.push(p);	
		}
	}

}