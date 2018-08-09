 
function ControlLabel(name, pos, text)
{
	this.name = name;
	this.pos = pos;	
	this.text = text;
}

{
	ControlLabel.prototype.containsPos = function(posToCheck)
	{
		return Control.doesControlContainPos(this, posToCheck);
	}
 
	ControlLabel.prototype.draw = function(display)
	{ 
		display.drawTextAtPos
		(
			this.text,
			this.posAbsolute()
		);
	}
 
	ControlLabel.prototype.posAbsolute = function()
	{
		return Control.controlPosAbsolute(this);
	}
}
