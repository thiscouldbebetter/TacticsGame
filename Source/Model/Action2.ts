
class Action2
{
	name: string;
	key: string;
	perform: (u: Universe, w: WorldExtended) => void;

	constructor
	(
		name: string,
		key: string,
		perform: (u: Universe, w: WorldExtended) => void
	)
	{
		this.name = name;
		this.key = key;
		this.perform = perform;
	}

	toControl(): ControlBase
	{
		var returnValue = ControlButton.from8
		(
			"button" + this.name, // name
			Coords.create(), // pos
			Coords.fromXY(50, 12), // size
			this.name + " (" + this.key + ")", // text
			10, true, true, // fontHeight, hasBorder, isEnabled
			this.perform.bind(this)
		);

		return returnValue;
	}
}
