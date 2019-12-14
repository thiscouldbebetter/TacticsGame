 
function ControlButton(name, text, size, pos, click)
{
	this.name = name;
	this.text = text;
	this.size = size;
	this.pos = pos;
	this.click = click;
}

{
	ControlButton.prototype.containsPos = function(posToCheck)
	{
		return Control.doesControlContainPos(this, posToCheck);
	}
 
	ControlButton.prototype.draw = function(display)
	{
		var posAbsolute = this.posAbsolute();
 
		display.drawRectangle
		(
			posAbsolute, 
			this.size, 
			display.colorFore,
			display.colorBack
		);
 
		display.drawTextAtPos
		(
			this.text,
			posAbsolute
		);
	}
 
	ControlButton.prototype.mouseClick = function(mouseClickPosAbsolute)
	{
		if (this.containsPos(mouseClickPosAbsolute) == true)
		{
			this.click();
		}
	}
 
	ControlButton.prototype.posAbsolute = function()
	{
		return Control.controlPosAbsolute(this);
	}
}
