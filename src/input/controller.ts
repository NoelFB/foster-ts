import {Component} from "../component";
import {Vector} from "../util/vector";

export class GamepadManager
{
	public static defaultDeadzone:number = 0.3;
	private static controllers:ControllerInput[] = [];

	static init():void
	{
		window.addEventListener("gamepadconnected", GamepadManager.onAddController, false);
		window.addEventListener("gamepaddisconnected", GamepadManager.onRemoveController, false);
	}

	static update()
	{
		for (const controller of GamepadManager.controllers)
			controller.update();
	}

	static onAddController(event:GamepadEvent):void
	{
		for (const controller of GamepadManager.controllers)
			if (controller.gamepad === event.gamepad)
				return; // We already have this controller, must be a reconnect.
		if (event.gamepad.id.includes("Unknown Gamepad"))
			return; // On some platforms each x360 controller was showing up twice and only one of them was queryable. -_-

		GamepadManager.controllers[event.gamepad.index] = new ControllerInput(event.gamepad);
	}

	private static onRemoveController(event:any):void
	{
		delete this.controllers[event.gamepad.index];
	}

	public static getController(index:number):ControllerInput
	{
		const controller = GamepadManager.controllers[index];
		if (controller)
			return controller;
		for (const c of navigator.getGamepads())
		{
			if (c && c.index === index)
			{
				const newcontroller = GamepadManager.controllers[index] = new ControllerInput(c);
				return newcontroller;
			}
		}
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

class ControllerInput
{
	public gamepad:Gamepad;
	private deadzone:number;

	// actual state of the gamepad
	private leftStick:Vector = new Vector();
	private rightStick:Vector = new Vector();

	private buttons:ButtonState[] = [];

	constructor(pad:Gamepad, deadzone:number = GamepadManager.defaultDeadzone)
	{
		this.gamepad = pad;
		this.deadzone = deadzone;
		for (var i : number = 0; i < pad.buttons.length; i++)
			this.buttons.push(new ButtonState());
	}

	public update():void
	{
		const gamepad = this.gamepad = this.queryGamepad();
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

export class ButtonState
{
	_last:boolean;
	_next:boolean;

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
