
class ControlHelper
{
	static toControlsMany
	(
		controllables: Controllable[], posOfFirst: Coords, spacing: Coords
	): ControlBase[]
	{
		var returnValues = [];

		for (var i = 0; i < controllables.length; i++)
		{
			var controllable = controllables[i];

			var control = controllable.toControl();

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
