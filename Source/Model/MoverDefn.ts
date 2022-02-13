
class MoverDefn
{
	name: string;
	codeChar: string;
	integrityMax: number;
	movePointsPerTurn: number;
	attackRange: number;
	attackDamage: number;
	actionNamesAvailable: string[];
	visual: VisualBase;

	constructor
	(
		name: string,
		codeChar: string,
		integrityMax: number,
		movePointsPerTurn: number,
		attackRange: number,
		attackDamage: number,
		actionNamesAvailable: string[],
		visual: VisualBase
	)
	{
		this.name = name;
		this.codeChar = codeChar;
		this.integrityMax = integrityMax;
		this.movePointsPerTurn = movePointsPerTurn;
		this.attackRange = attackRange;
		this.attackDamage = attackDamage;
		this.actionNamesAvailable = actionNamesAvailable;
		this.visual = visual;
	}

	actionsAvailable(world: WorldExtended): Action[]
	{
		var actionsAll = world.actionsByName;

		var returnValues = this.actionNamesAvailable.map(x => actionsAll.get(x));

		return returnValues;
	}
}
