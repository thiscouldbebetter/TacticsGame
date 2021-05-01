
class MoverDefn
{
	constructor
	(
		name,
		codeChar,
		integrityMax,
		movePointsPerTurn,
		attackRange,
		attackDamage,
		actionNamesAvailable
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

	actionsAvailable(world)
	{
		var returnValues = [];

		var actionsAll = world.actionsByName;

		for (var i = 0; i < this.actionNamesAvailable.length; i++)
		{
			var actionName = this.actionNamesAvailable[i];
			var action = actionsAll.get(actionName);
			returnValues.push(action);
		}

		return returnValues;
	}
}
