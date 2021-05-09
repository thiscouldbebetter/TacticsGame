
class MoverDefn
{
	name: string;
	codeChar: string;
	integrityMax: number;
	movePointsPerTurn: number;
	attackRange: number;
	attackDamage: number;
	actionNamesAvailable: string[];

	constructor
	(
		name: string,
		codeChar: string,
		integrityMax: number,
		movePointsPerTurn: number,
		attackRange: number,
		attackDamage: number,
		actionNamesAvailable: string[]
	)
	{
		this.name = name;
		this.codeChar = codeChar;
		this.integrityMax = integrityMax;
		this.movePointsPerTurn = movePointsPerTurn;
		this.attackRange = attackRange;
		this.attackDamage = attackDamage;
		this.actionNamesAvailable = actionNamesAvailable;
	}

	actionsAvailable(world: WorldExtended): Action[]
	{
		var actionsAll = world.actionsByName;

		var returnValues = this.actionNamesAvailable.map(x => actionsAll.get(x));

		return returnValues;
	}
}
