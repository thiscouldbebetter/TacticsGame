 
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
 
		this.inputHelper = new InputHelper();
		this.inputHelper.initialize();
 
		this.world.initialize();
	}
 
	Globals.prototype.update = function()
	{
		this.world.update();
	}
}
