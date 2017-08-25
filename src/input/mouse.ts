import {Engine} from "../engine";
import {Vector} from "../util/vector";

export class Mouse
{
	private static _left:boolean;
	private static _leftWas:boolean;
	private static _leftNext:boolean;
	private static _right:boolean;
	private static _rightWas:boolean;
	private static _rightNext:boolean;
	private static _position:Vector;
	private static _positionNext:Vector;

	public static get x():number { return this._position.x; }
	public static get y():number  { return this._position.y; }
	public static get position():Vector { return new Vector(this._position.x, this._position.y); }
	public static absolute:Vector = new Vector(0, 0);

	public static get left():boolean { return this._left; }
	public static get leftPressed():boolean { return this._left && !this._leftWas; }
	public static get leftReleased():boolean { return !this._left && this._leftWas; }
	public static get right():boolean { return this._right; }
	public static get rightPressed():boolean { return this._right && !this._rightWas; }
	public static get rightReleased():boolean { return !this._right && this._rightWas; }

	public static init():void
	{
		Mouse._position = new Vector(0,0);
		Mouse._positionNext = new Vector(0,0);

		Engine.root.addEventListener("mousemove", function(e)
		{
			Mouse.absolute = new Vector(e.pageX, e.pageY);
			Mouse.setNextMouseTo(e.pageX, e.pageY);
		});

		Engine.root.addEventListener("mousedown", function(e)
		{
			if (e.button === 0)
				Mouse._leftNext = true;
			else
				Mouse._rightNext = true;
		});

		Engine.root.addEventListener("mouseup", function(e)
		{
			if (e.button === 0)
				Mouse._leftNext = false;
			else
				Mouse._rightNext = false;
		});
	}

	public static update():void
	{
		this._leftWas = this._left;
		this._left = this._leftNext;
		this._rightWas = this._right;
		this._right = this._rightNext;

		/*
		// TODO: SOLVE THIS?
		// this doesn't work because the GameWindow.screenLeft/Top include the Window border
		// if there's a way to get the inner Left/Top then this would be super good as the mouse would
		// update even when out of the window bounds

		// alternatively could measure the difference when the mouse moves, and then use that ... but ugh that's gross

		if (Engine.client === Client.Desktop)
		{
			var screenMouse = GameWindow.screenMouse;
			screenMouse.x -= GameWindow.screenLeft;
			screenMouse.y -= GameWindow.screenTop;
			Mouse.setNextMouseTo(screenMouse.x, screenMouse.y);
		}
		*/

		this._position = this._positionNext;
	}

	public percent():Vector
	{
		return new Vector();
	}

	private static setNextMouseTo(pageX:number, pageY:number)
	{
		const screen = Engine.graphics.canvas.getBoundingClientRect();
		const scaled = Engine.graphics.getOutputBounds();
		const scale = new Vector(scaled.width / Engine.width, scaled.height / Engine.height);

		// mouse position in the gameplay view
		Mouse._positionNext = new Vector(
			(pageX - screen.left - scaled.left) / scale.x, 
			(pageY - screen.top - scaled.top) / scale.y
		);
	}
}
