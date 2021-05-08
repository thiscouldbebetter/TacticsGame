
class Mover
{
	defnName: string;
	factionName: string;
	orientation: Coords;
	pos: Coords;

	integrity: number;
	movePoints: number;
	targetPos: Coords;

	constructor
	(
		defnName: string,
		factionName: string,
		orientation: Coords,
		pos: Coords
	)
	{
		this.defnName = defnName;
		this.factionName = factionName;
		this.orientation = orientation;
		this.pos = pos;
	}

	defn(world: WorldExtended): MoverDefn
	{
		return world.moverDefnsByName.get(this.defnName);
	}

	faction(world: WorldExtended): Faction
	{
		return world.factionsByName.get(this.factionName);
	}

	name(): string
	{
		return this.factionName + " " + this.defnName;
	}

	initialize(universe: Universe, world: WorldExtended): void
	{
		var defn = this.defn(world);
		this.integrity = defn.integrityMax;
		this.movePoints = defn.movePointsPerTurn;
	}

	// drawable

	draw
	(
		universe: Universe, world: WorldExtended, display: Display, 
		map: MapOfTerrain, isMoverActive: boolean
	): void
	{
		var mover = this;
		var moverDefn = mover.defn(world);

		var mapCellSizeInPixels = map.cellSizeInPixels;
		var mapCellSizeInPixelsHalf = map.cellSizeInPixelsHalf;

		var drawPos = map._drawPos;
		var drawPos2 = map._drawPos2;

		drawPos.overwriteWith
		(
			mover.pos
		).multiply
		(
			mapCellSizeInPixels
		).add
		(
			map.pos
		).add
		(
			mapCellSizeInPixelsHalf
		);

		var radius = mapCellSizeInPixelsHalf.x;

		var colorHighlight = Color.byName("White");
		var colorStroke = (isMoverActive ? colorHighlight : display.colorFore);

		display.drawCircle
		(
			drawPos,
			radius,
			mover.faction(world).color,
			colorStroke,
			1 // borderThickness
		);

		drawPos2.overwriteWith
		(
			mover.orientation
		).multiplyScalar
		(
			radius
		).add
		(
			drawPos
		);

		display.drawLine(drawPos, drawPos2, colorStroke, 1);

		drawPos.subtract(mapCellSizeInPixelsHalf);

		display.drawText
		(
			" " + moverDefn.codeChar,
			null, // fontHeight
			drawPos,
			colorStroke,
			null, null, null, null // ?
		);

		if (isMoverActive)
		{
			if (this.targetPos != null)
			{
				drawPos.overwriteWith
				(
					this.targetPos
				).multiply
				(
					mapCellSizeInPixels
				).add
				(
					map.pos
				).add
				(
					mapCellSizeInPixelsHalf
				);

				display.drawCircle
				(
					drawPos, radius / 2, colorStroke, Color.byName("Red"),
					1 // borderThickness
				);
			}
		}
	}
}
