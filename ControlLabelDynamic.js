
function ControlLabelDynamic(name, pos, textFunction)
{
	this.name = name;
	this.pos = pos;
	this.textFunction = textFunction;
}

{
	ControlLabelDynamic.prototype.containsPos = function(posToCheck)
	{
		return Control.doesControlContainPos(this, posToCheck);
	}
 
	ControlLabelDynamic.prototype.draw = function(display)
	{ 
		display.drawTextAtPos
		(
			this.text(),
			this.posAbsolute()
		);
	}
 
	ControlLabelDynamic.prototype.posAbsolute = function()
	{
		return Control.controlPosAbsolute(this);
	}
	
	ControlLabelDynamic.prototype.text = function()
	{
		return this.textFunction();
	}
}
