
class ActionHelper
{
	static actionToControl(action: Action): ControlBase
	{
		var returnValue = ControlButton.from8
		(
			"button" + action.name, // name
			Coords.create(), // pos
			Coords.fromXY(50, 12), // size
			action.name,
			10, // fontHeight
			true, // hasBorder
			DataBinding.fromTrue(), // isEnabled
			action.perform.bind(this)
		);

		return returnValue;
	}

	static actionsToControls
	(
		actions: Action[], posOfFirst: Coords, spacing: Coords
	): ControlBase[]
	{
		var returnValues = [];

		for (var i = 0; i < actions.length; i++)
		{
			var action = actions[i];

			var control = ActionHelper.actionToControl(action);

			control.pos.overwriteWith
			(
				spacing
			).multiplyScalar
			(
				i
			).add
			(
				posOfFirst
			);

			returnValues.push(control);
		}

		return returnValues;
	}

}
