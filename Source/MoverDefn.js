
function MoverDefn
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

{
	MoverDefn.prototype.actionsAvailable = function()
	{
		var returnValues = [];

		var actionsAll = Globals.Instance.world.actions;

		for (var i = 0; i < this.actionNamesAvailable.length; i++)
		{
			var actionName = this.actionNamesAvailable[i];
			var action = actionsAll[actionName];
			returnValues.push(action);
		}

		return returnValues;
	};
}
