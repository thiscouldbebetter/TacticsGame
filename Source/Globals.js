
function Globals()
{
	// do nothing
}

{
	// instance

	Globals.Instance = new Globals();

	Globals.prototype.initialize = function(display, world)
	{
		this.world = world;

		this.display = display;
		this.display.initialize();
		document.getElementById("divMain").appendChild(this.display.canvas);

		var universe = {};
		universe.controlBuilder = new ControlBuilder([ ControlStyle.Instances().Default ]);
		universe.display = display;
		universe.platformHelper = new PlatformHelper();
		universe.platformHelper.initialize(universe);
		this.inputHelper = new InputHelper();
		this.inputHelper.initialize(universe);
		Globals.Instance.universe = universe;

		var onkeydownOriginal = document.body.onkeydown;
		document.body.onkeydown = function(e)
		{
			onkeydownOriginal(e);
			Globals.Instance.update();
		}

		this.world.initialize();
	};

	Globals.prototype.update = function()
	{
		this.world.update();
	};
}
