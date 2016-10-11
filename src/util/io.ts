/**
 * Handles File IO stuff and the differences between Browser / Desktop mode
 */
class FosterIO
{

	private static fs:any = null;
	private static path:any = null;

	public static init():void
	{
		if (FosterIO.fs == null && Engine.client == Client.Desktop)
		{
			FosterIO.fs = require("fs");
			FosterIO.path = require("path");
		}
	}

	public static read(path:string, callback:(string)=>void):void
	{
		if (Engine.client == Client.Desktop)
		{
			FosterIO.fs.readFile(FosterIO.path.join(__dirname, path), 'utf8', function (err, data)
			{
				if (err) 
					throw err;
				callback(data);
			});
		}
		else
		{
			let httpRequest = new XMLHttpRequest();
			httpRequest.onreadystatechange = (e) =>
			{
				if (httpRequest.readyState === XMLHttpRequest.DONE)
				{
					if (httpRequest.status === 200)
						callback(httpRequest.responseText);
					else
						throw "Unable to read file " + path;
				}
			};
			httpRequest.open('GET', path);
			httpRequest.send();
		}
	}

	public static join(...paths:string[]):string
	{
		if (paths.length <= 0)
			return ".";

		if (Engine.client == Client.Desktop)
		{
			let result = paths[0];
			for (let i = 1; i < paths.length; i ++)
				result = FosterIO.path.join(result, paths[i]);
			return result;
		}
		else
		{
			let result:string[] = [];
			for (let i = 0; i < paths.length; i ++)
			{
				let sub = paths[i].split("/");
				for (let j = 0; j < sub.length; j ++)
					result.push(sub[j]);
			}
			
			return result.length > 0 ? result.join("/") : ".";
		}
	}
}