 
function ControlContainer(name, size, pos, children)
{
	this.name = name;
	this.size = size;
	this.pos = pos;
	this.children = children;
 
	for (var i = 0; i < this.children.length; i++)
	{
		var child = this.children[i];
		child.parent = this;
	}
}

{
	ControlContainer.prototype.containsPos = function(posToCheck)
	{
		return Control.doesControlContainPos(this, posToCheck);
	}
 
	ControlContainer.prototype.draw = function(display)
	{
		display.drawRectangle
		(
			this.posAbsolute(),
			this.size,
			display.colorFore, // border
			display.colorBack // fill
		);
 
		var children = this.children;
		for (var i = 0; i < children.length; i++)
		{
			var child = children[i];
			child.draw(display);
		}
	}
 
	ControlContainer.prototype.mouseClick = function(mouseClickPosAbsolute)
	{
		if (this.containsPos(mouseClickPosAbsolute) == true)
		{
			for (var i = 0; i < this.children.length; i++)
			{
				var child = this.children[i];
				child.mouseClick(mouseClickPosAbsolute);
			}
		}
	}
 
	ControlContainer.prototype.posAbsolute = function()
	{
		return Control.controlPosAbsolute(this);
	}
}
