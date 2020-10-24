
class MapOfTerrain
{
	constructor(cellSizeInPixels, pos, terrains, cellsAsStrings)
	{
		this.cellSizeInPixels = cellSizeInPixels;
		this.pos = pos;
		this.terrains = terrains;
		this.cellsAsStrings = cellsAsStrings;

		this.cellSizeInPixelsHalf = this.cellSizeInPixels.clone().divideScalar(2);

		this.terrains.addLookups(x => x.codeChar);

		this.sizeInCells = new Coords
		(
			this.cellsAsStrings[0].length,
			this.cellsAsStrings.length
		);

		this.sizeInCellsMinusOnes = this.sizeInCells.clone().subtract
		(
			new Coords(1, 1)
		);

		// Helper variables.

		this._cellPos = new Coords();
		this._drawPos = new Coords();
		this._drawPos2 = new Coords();
	}

	terrainAtPos(cellPos)
	{
		var terrainChar = this.cellsAsStrings[cellPos.y][cellPos.x];
		var terrain = this.terrains[terrainChar];
		return terrain;
	}

	// drawable

	draw(display)
	{
		var map = this;
		var sizeInCells = map.sizeInCells;
		var mapCellSizeInPixels = map.cellSizeInPixels;
		var cellPos = this._cellPos;
		var drawPos = this._drawPos;

		for (var y = 0; y < sizeInCells.y; y++)
		{
			cellPos.y = y;

			for (var x = 0; x < sizeInCells.x; x++)
			{
				cellPos.x = x;

				var cellTerrain = map.terrainAtPos
				(
					cellPos
				);

				drawPos.overwriteWith
				(
					cellPos
				).multiply
				(
					mapCellSizeInPixels
				).add
				(
					map.pos
				);

				display.drawRectangle
				(
					drawPos,
					mapCellSizeInPixels,
					cellTerrain.color, // fill
					"Gray" // border
				);
			}
		}
	}

}
