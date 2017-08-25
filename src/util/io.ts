import {Engine, Client} from "../engine";

/**
 * Handles File IO stuff and the differences between Browser / Desktop mode
 */
export class FosterIO
{

	private static fs:any = null;
	private static path:any = null;

	public static init():void
	{
		if (FosterIO.fs === null && Engine.client === Client.Desktop)
		{
			FosterIO.fs = require("fs");
			FosterIO.path = require("path");
		}
	}

	public static read(path:string, callback:(data:string)=>void):void
	{
		if (Engine.client === Client.Desktop)
		{
			FosterIO.fs.readFile(FosterIO.path.join(__dirname, path), "utf8", function (err: any, data: string)
			{
				if (err)
					throw err;
				callback(data);
			});
		}
		else
		{
			const httpRequest = new XMLHttpRequest();
			httpRequest.onreadystatechange = (e) =>
			{
				if (httpRequest.readyState === XMLHttpRequest.DONE)
				{
					if (httpRequest.status === 200)
						callback(httpRequest.responseText);
					else
						throw new Error("Unable to read file " + path);
				}
			};
			httpRequest.open("GET", path);
			httpRequest.send();
		}
	}

	public static join(...paths:string[]):string
	{
		if (paths.length <= 0)
			return ".";

		if (Engine.client === Client.Desktop)
		{
			let result = paths[0];
			for (let i = 1; i < paths.length; i ++)
				result = FosterIO.path.join(result, paths[i]);
			return result;
		}
		else
		{
			const result:string[] = [];
			for (const path of paths)
			{
				const sub = path.split("/");
				for (const subPath of sub)
					result.push(subPath);
			}

			return result.length > 0 ? result.join("/") : ".";
		}
	}

	public static extension(path:string):string
	{
		let ext = "";
		const parts = (/(?:\.([^.]+))?$/).exec(path);
		if (parts.length > 1)
			ext = parts[1];
		return ext;
	}
}