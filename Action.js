 
// classes
 
function Action(name, keyCode, perform)
{
	this.name = name;
	this.keyCode = keyCode;
	this.perform = perform;
}

{
	Action.prototype.toControl = function()
	{
		var returnValue = new ControlButton
		(
			"button" + this.name, // name
			this.name + " (" + this.keyCode + ")", // text
			new Coords(50, 12), // size
			new Coords(), // pos
			this.perform.bind(this)
		);
 
		return returnValue;
	}
}
