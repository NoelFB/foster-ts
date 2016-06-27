class FosterIO
{

	private static fs:any = null;
	private static path:any = null;

	public static read(path:string, callback:(string)=>void):void
	{
		if (Engine.client == Client.Desktop)
		{
			if (FosterIO.fs == null)
			{
				FosterIO.fs = require("fs");
				FosterIO.path = require("path");
			}

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
}