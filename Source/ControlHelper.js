
function ControlHelper()
{
	// static class
}

{
	ControlHelper.toControlsMany = function
	(
		controllables, posOfFirst, spacing
	)
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
	};
}
