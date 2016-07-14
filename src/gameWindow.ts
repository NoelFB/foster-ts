class GameWindow
{
	
	private static browserWindow:Electron.BrowserWindow;
	private static titleName:string;
	private static screen:Electron.Screen;
	
	constructor()
	{
		if (Engine.client == Client.Desktop)
		{
			var remote = require("electron").remote;
			GameWindow.browserWindow = remote.getCurrentWindow();
			GameWindow.screen = remote.screen;
		}
	}
	
	public static get title():string 
	{
		return GameWindow.titleName;
	}
	
	public static set title(val:string) 
	{
		GameWindow.titleName = val;
		if (Engine.client == Client.Desktop)
			GameWindow.browserWindow.setTitle(val); 
		else
			document.title = val;
	}
	
	public static get fullscreen():boolean 
	{
		return Engine.client == Client.Desktop && GameWindow.browserWindow.isFullScreen(); 
	}
	
	public static set fullscreen(val:boolean) 
	{ 
		if (Engine.client == Client.Desktop)
			GameWindow.browserWindow.setFullScreen(val);
		else
			console.warn("Can only set Fullscreen in Client.Desktop mode");
	}
	
	public static get screenLeft():number
	{
		if (Engine.client == Client.Desktop)
			return GameWindow.browserWindow.getPosition()[0];
		else
			return Engine.graphics.canvas.getBoundingClientRect().left;
	}
	
	public static get screenTop():number
	{
		if (Engine.client == Client.Desktop)
			return GameWindow.browserWindow.getPosition()[1];
		else
			return Engine.graphics.canvas.getBoundingClientRect().top;
	}
	
	public static get screenWidth():number 
	{
		if (Engine.client == Client.Desktop)
			return GameWindow.browserWindow.getContentSize()[0];
		else
			return Engine.graphics.canvas.getBoundingClientRect().width;
	}
	
	public static get screenHeight():number 
	{
		if (Engine.client == Client.Desktop)
			return GameWindow.browserWindow.getContentSize()[1]; 
		else
			return Engine.graphics.canvas.getBoundingClientRect().height;
	}
	
	public static resize(width:number, height:number):void
	{
		if (Engine.client == Client.Desktop)
			GameWindow.browserWindow.setContentSize(width, height);
	}
	
	public static center():void
	{
		if (Engine.client == Client.Desktop)
			GameWindow.browserWindow.center();
	}
	
	public static toggleDevTools() 
	{ 
		if (Engine.client == Client.Desktop)
			(GameWindow.browserWindow as any).toggleDevTools(); 
	}
	
	public static get screenMouse():Vector
	{
		if (Engine.client == Client.Desktop)
		{
			var pos = GameWindow.screen.getCursorScreenPoint();
			return new Vector(pos.x, pos.y);	
		}
		return Mouse.absolute;
	}
}