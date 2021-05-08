
class MapTerrain
{
	name: string;
	codeChar: string;
	movePointsToTraverse: number;
	color: Color;

	constructor
	(
		name: string,
		codeChar: string,
		movePointsToTraverse: number,
		color: Color
	)
	{
		this.name = name;
		this.codeChar = codeChar;
		this.movePointsToTraverse = movePointsToTraverse;
		this.color = color;
	}
}
