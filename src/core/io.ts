import {Client, Engine} from "./engine";
import * as Fs from "fs";
import * as Path from "path";

/**
 * Handles File IO stuff and the differences between Browser / Desktop mode
 */
export class IO
{

	private static fs:typeof Fs = null;
	private static path:typeof Path = null;

	/**
	 * Called internally by Engine
	 */
	public static init():void
	{
		if (IO.fs == null && Engine.client === Client.Electron)
		{
			IO.fs = require("fs");
			IO.path = require("path");
		}
	}

	/**
	 * Reads the contents of a file, using fs.readFile if in Electron, or http request otherwise
	 * @param path Path to file
	 * @param callback Callback with the contents of the file
	 */
	public static read(path:string, callback:(str:string) => void):void
	{
		if (Engine.client === Client.Electron)
		{
			IO.fs.readFile(IO.path.join(__dirname, path), "utf8", (err:any, data:any) =>
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

	/**
	 * Combines parts of a path into a single string
	 * @param paths the paths to join
	 */
	public static join(...paths:string[]):string
	{
		if (paths.length <= 0)
			return ".";

		if (Engine.client === Client.Electron)
		{
			let result = paths[0];
			for (let i = 1; i < paths.length; i ++)
				result = IO.path.join(result, paths[i]);
			return result;
		}
		else
		{
			const result:string[] = [];
			for (const part of paths)
			{
				const sub = part.split("/");
				for (const s of sub)
					result.push(s);
			}

			return result.length > 0 ? result.join("/") :".";
		}
	}

	/**
	 * Returns the file extension of the given path
	 * @param path 
	 */
	public static extension(path:string):string
	{
		let ext = "";
		const parts = (/(?:\.([^.]+))?$/).exec(path);
		if (parts.length > 1)
			ext = parts[1];
		return ext;
	}
}
