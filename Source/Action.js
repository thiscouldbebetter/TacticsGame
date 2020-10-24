
class Action2
{
	constructor(name, key, perform)
	{
		this.name = name;
		this.key = key;
		this.perform = perform;
	}

	toControl()
	{
		var returnValue = new ControlButton
		(
			"button" + this.name, // name
			new Coords(), // pos
			new Coords(50, 12), // size
			this.name + " (" + this.key + ")", // text
			10, true, true, // fontHeight, hasBorder, isEnabled
			this.perform.bind(this)
		);

		return returnValue;
	}
}
