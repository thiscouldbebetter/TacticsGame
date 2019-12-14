 
function Control()
{
	// static class
}

{
	Control.doesControlContainPos = function(control, posToCheck)
	{
		var posToCheckRelative = posToCheck.clone().subtract
		(
			control.posAbsolute()
		);
 
		var returnValue = posToCheckRelative.isInRangeMax
		(
			control.size
		);
 
		return returnValue;
	}
 
	Control.controlPosAbsolute = function(control)
	{
		var returnValue = (control.parent == null ? new Coords(0, 0) : control.parent.posAbsolute());
		returnValue.add(control.pos);
		return returnValue;
	}
 
	Control.toControlsMany = function
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
	}
}
