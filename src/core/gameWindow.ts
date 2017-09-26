import {Client, Engine} from "./engine";
import {Mouse} from "./../input";
import {Vector} from "./../util";

/**
 * Handels the Game Window and the differences between Browser / Desktop mode
 */
export class GameWindow
{

	private static browserWindow:Electron.BrowserWindow;
	private static titleName:string;
	private static screen:Electron.Screen;

	constructor()
	{
		if (Engine.client === Client.Electron)
		{
			const remote = require("electron").remote;
			GameWindow.browserWindow = remote.getCurrentWindow();
			GameWindow.screen = remote.screen;
		}
	}

	/**
	 * Gets or Sets the Window Title
	 */
	public static get title():string
	{
		return GameWindow.titleName;
	}
	public static set title(val:string)
	{
		GameWindow.titleName = val;
		if (Engine.client === Client.Electron)
			GameWindow.browserWindow.setTitle(val);
		else
			document.title = val;
	}

	/**
	 * Toggles Fullscreen Mode if running on the Desktop
	 */
	public static get fullscreen():boolean
	{
		return Engine.client === Client.Electron && GameWindow.browserWindow.isFullScreen();
	}
	public static set fullscreen(val:boolean)
	{
		if (Engine.client === Client.Electron)
			GameWindow.browserWindow.setFullScreen(val);
		else
			console.warn("Can only set Fullscreen in Client.Desktop mode");
	}

	/**
	 * Returns the left position of the screen
	 */
	public static get screenLeft():number
	{
		if (Engine.client === Client.Electron)
			return GameWindow.browserWindow.getPosition()[0];
		else
			return Engine.graphics.canvas.getBoundingClientRect().left;
	}

	/**
	 * Returns the Top position of the screen
	 */
	public static get screenTop():number
	{
		if (Engine.client === Client.Electron)
			return GameWindow.browserWindow.getPosition()[1];
		else
			return Engine.graphics.canvas.getBoundingClientRect().top;
	}

	/**
	 * Returns the Width of the screen
	 */
	public static get screenWidth():number
	{
		if (Engine.client === Client.Electron)
			return GameWindow.browserWindow.getContentSize()[0];
		else
			return Engine.graphics.canvas.getBoundingClientRect().width;
	}

	/**
	 * Returns the Height of the screen
	 */
	public static get screenHeight():number
	{
		if (Engine.client === Client.Electron)
			return GameWindow.browserWindow.getContentSize()[1];
		else
			return Engine.graphics.canvas.getBoundingClientRect().height;
	}

	/**
	 * Resizes the Window if running in Desktop mode
	 */
	public static resize(width:number, height:number):void
	{
		if (Engine.client === Client.Electron)
			GameWindow.browserWindow.setContentSize(width, height);
	}

	/**
	 * Centers the Window if running in Desktop mode
	 */
	public static center():void
	{
		if (Engine.client === Client.Electron)
			GameWindow.browserWindow.center();
	}

	/**
	 * Toggles Developer tools if running in Desktop mode
	 */
	public static toggleDevTools()
	{
		if (Engine.client === Client.Electron)
			(GameWindow.browserWindow as any).toggleDevTools();
	}

	/**
	 * Gets the absolute mouse position in the screen
	 */
	public static get screenMouse():Vector
	{
		if (Engine.client === Client.Electron)
		{
			const pos = GameWindow.screen.getCursorScreenPoint();
			return new Vector(pos.x, pos.y);
		}
		return Mouse.absolute;
	}
}
