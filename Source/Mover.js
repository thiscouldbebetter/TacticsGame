
class Mover
{
	constructor(defnName, factionName, orientation, pos)
	{
		this.defnName = defnName;
		this.factionName = factionName;
		this.orientation = orientation;
		this.pos = pos;
	}

	defn(world)
	{
		return world.moverDefnsByName.get(this.defnName);
	}

	faction(world)
	{
		return world.factionsByName.get(this.factionName);
	}

	name()
	{
		return this.factionName + " " + this.defnName;
	}

	initialize(universe, world)
	{
		var defn = this.defn(world);
		this.integrity = defn.integrityMax;
		this.movePoints = defn.movePointsPerTurn;
	}

	// drawable

	draw(universe, world, display, map, isMoverActive)
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
			colorStroke
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

		display.drawLine(drawPos, drawPos2, colorStroke);

		drawPos.subtract(mapCellSizeInPixelsHalf);

		display.drawText
		(
			" " + moverDefn.codeChar,
			null, // fontHeight
			drawPos, colorStroke
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
					drawPos, radius / 2, colorStroke, Color.byName("Red")
				);
			}
		}
	}
}
