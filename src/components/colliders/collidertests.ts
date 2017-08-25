import {Collider} from "./collider";
import {Hitbox} from "./hitbox";
import {Hitgrid} from "./hitgrid";

export function registerDefaultOverlapTests()
{

	function overlap_hitbox_hitbox(a:Hitbox, b:Hitbox):boolean
	{
		return a.sceneRight > b.sceneLeft
			&& a.sceneBottom > b.sceneTop
			&& a.sceneLeft < b.sceneRight
			&& a.sceneTop < b.sceneBottom;
	}

	function overlap_hitbox_grid(a:Hitbox, b:Hitgrid):boolean
	{
		const gridX = b.sceneX;
		const gridY = b.sceneY;

		const left = Math.floor((a.sceneLeft - gridX) / b.tileWidth);
		const top = Math.floor((a.sceneTop - gridY) / b.tileHeight);
		const right = Math.ceil((a.sceneRight - gridX) / b.tileWidth);
		const bottom = Math.ceil((a.sceneBottom - gridY) / b.tileHeight);

		for (let x = left; x < right; x++)
			for (let y = top; y < bottom; y++)
				if (b.has(x, y))
					return true;

		return false;
	}

	Collider.registerOverlapTest(Hitbox, Hitbox, overlap_hitbox_hitbox);
	Collider.registerOverlapTest(Hitbox, Hitgrid, overlap_hitbox_grid);
}
