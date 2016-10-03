/// <reference path="./../component.ts"/>
/// <reference path="./../util/vector.ts"/>

class GamepadManager
{
	public static defaultDeadzone:number = 0.3;
	private static controllers:ControllerInput[] = [];

	static init():void
	{
		window.addEventListener("gamepadconnected", GamepadManager.onAddController, false);
		window.addEventListener("gamepaddisconnected", GamepadManager.onRemoveController, false);
	}

	static onAddController(event:any):void
	{
		for (var i = 0; i < GamepadManager.controllers.length; i++)
		{
			if (GamepadManager.controllers[i].gamepad == event.gamepad)
				return; // We already have this controller, must be a reconnect.
		}
		if (event.gamepad.id.includes("Unknown Gamepad"))
			return; // On some platforms each x360 controller was showing up twice and only one of them was queryable. -_-
		GamepadManager.controllers.push(new ControllerInput(event.gamepad));
	}

	private static onRemoveController(event:any):void
	{
		console.log("A gamepad was disconnected, please reconnect.")
	}

	public static getController(index:number):ControllerInput
	{
		return GamepadManager.controllers[index];
	}

	public static numControllers():number
	{
		return GamepadManager.controllers.length;
	}

	public static setRemoveControllerBehavior(handler:any):void
	{
		// let the dev decide how to act when controllers are removed.
		GamepadManager.onRemoveController = handler;
	}
}

class ControllerInput extends Component
{
	public gamepad:Gamepad;
	private deadzone:number;

	// actual state of the gamepad
	private leftStick:Vector = new Vector();
	private rightStick:Vector = new Vector();

	private buttons:ButtonState[] = [];

	constructor(pad:Gamepad, deadzone:number = GamepadManager.defaultDeadzone)
	{
		super();
		this.gamepad = pad;
		this.deadzone = deadzone;
		for (var i : number = 0; i < pad.buttons.length; i++)
			this.buttons.push(new ButtonState());
	}

	public update():void
	{
		var gamepad = this.queryGamepad();
		this.leftStick.x = gamepad.axes[0];
		this.leftStick.y = gamepad.axes[1];
		this.rightStick.x = gamepad.axes[2];
		this.rightStick.y = gamepad.axes[3];
		for (var i : number = 0; i < this.buttons.length; i++)
			this.buttons[i].update(gamepad.buttons[i].pressed);
	}

	public getButton(index:number):ButtonState
	{
		return this.buttons[index];
	}

	public getLeftStick():Vector
	{
		if (this.leftStick.length > this.deadzone)
			return this.leftStick.clone();
		return Vector.zero;
	}

	public getRightStick():Vector
	{
		if (this.rightStick.length > this.deadzone)
			return this.rightStick.clone();
		return Vector.zero;
	}

	public getRawLeftStick():Vector
	{
		return this.leftStick.clone();
	}

	public getRawRightStick():Vector
	{
		return this.rightStick.clone();
	}

	private queryGamepad():Gamepad
	{
		return navigator.getGamepads()[this.gamepad.index];
	}
}

class ButtonState
{
	private _last:boolean;
	private _next:boolean;

	constructor()
	{
		this._last = false;
		this._next = false;
	}

	public update(val:boolean):void
	{
		this._last = this._next;
		this._next = val;
	}

	public down():boolean
	{
		return this._next;
	}

	public pressed():boolean
	{
		return this._next && !this._last;
	}

	public released():boolean
	{
		return this._last && !this._next;
	}
}
