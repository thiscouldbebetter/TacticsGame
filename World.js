 
function World(actions, moverDefns, map, factions, movers)
{
	this.actions = actions;
	this.moverDefns = moverDefns;
	this.map = map;
	this.movers = movers;
	this.factions = factions;
 
	this.actions.addLookups("name");
	this.factions.addLookups("name");
	this.moverDefns.addLookups("name");
 
	this.moversToRemove = [];
}
{
	World.prototype.moverActive = function()
	{
		var returnValue = null;
 
		if (this.indexOfMoverActive != null)
		{
			returnValue = this.movers[this.indexOfMoverActive];
		}
 
		return returnValue;
	}
 
	World.prototype.moverActiveAdvanceIfNeeded = function()
	{
		var moverActive = this.moverActive();
 
		if (moverActive == null)
		{		   
			this.moversReplenish();
			this.indexOfMoverActive = 0;
			moverActive = this.moverActive();
		}
		else if (moverActive.movePoints <= 0)
		{
			this.indexOfMoverActive++;
			if (this.indexOfMoverActive >= this.movers.length)
			{
				this.moversReplenish();
				this.indexOfMoverActive = 0;
			}
 
			moverActive = this.moverActive();
		}
 
		return moverActive;
	}
 
	World.prototype.moverAtPos = function(posToCheck)
	{
		var returnValue = null;
 
		for (var i = 0; i < this.movers.length; i++)
		{
			var mover = this.movers[i];
			if (mover.pos.equals(posToCheck) == true)
			{
				returnValue = mover;
				break;
			}
		}
 
		return returnValue;
	}
 
	World.prototype.moversReplenish = function()
	{
		for (var i = 0; i < this.movers.length; i++)
		{
			var mover = this.movers[i];
			mover.movePoints = mover.defn().movePointsPerTurn;
		}
	}
 
	World.prototype.initialize = function()
	{
		for (var i = 0; i < this.movers.length; i++)
		{
			var mover = this.movers[i];
			mover.initialize();
		}
 
		var moverActive = this.moverActiveAdvanceIfNeeded();
 
		this.containerMain = new ControlContainer
		(
			"containerMain",
			new Coords(90, 180), // size
			new Coords(200, 10), // pos
			[
				new ControlContainer
				(
					"containerActions",
					new Coords(70, 90), // size
					new Coords(10, 10), // pos
					// children
					Control.toControlsMany
					(
						moverActive.defn().actionsAvailable(),
						new Coords(10, 10), // posFirst
						new Coords(0, 12) // spacing
					)
				),
				
				new ControlContainer
				(
					"containerSelection",
					new Coords(70, 60), // size
					new Coords(10, 110), // pos
					// children
					[
						new ControlLabelDynamic
						(
							"labelFaction", // name
							new Coords(5, 5), // pos
							function textFunction() 
							{ 
								return Globals.Instance.world.moverActive().factionName
							}
						),
						
						new ControlLabelDynamic
						(
							"labelDefnName", // name
							new Coords(5, 15), // pos
							function textFunction() 
							{ 
								return Globals.Instance.world.moverActive().defnName
							}
						),
						
						new ControlLabelDynamic
						(
							"labelIntegrity", // name
							new Coords(5, 25), // pos
							function textFunction() 
							{ 
								var moverActive = Globals.Instance.world.moverActive();
								var moverDefn = moverActive.defn();
								return "Health:" + moverActive.integrity + "/" + moverDefn.integrityMax;
							}
						),
						
						new ControlLabelDynamic
						(
							"labelIntegrity", // name
							new Coords(5, 35), // pos
							function textFunction() 
							{ 
								var moverActive = Globals.Instance.world.moverActive();
								var moverDefn = moverActive.defn();
								return "Moves:" + moverActive.movePoints + "/" + moverDefn.movePointsPerTurn;
							}
						)
						
					]
				),
			]
		);
		
		this.update();
	}
 
	World.prototype.update = function()
	{
		this.update_Input();
 
		this.update_MoversIntegrityCheck();
 
		this.moverActiveAdvanceIfNeeded();
 
		this.update_VictoryCheck();
 
		this.draw(Globals.Instance.display);
	}
 
	World.prototype.update_Input = function()
	{
		var inputHelper = Globals.Instance.inputHelper;
		if (inputHelper.isMouseClicked == true)
		{
			inputHelper.isMouseClicked = false;
			this.containerMain.mouseClick
			(
				inputHelper.mousePos
			);
		}
		else if (inputHelper.keyCodePressed != null)
		{
			var moverActive = this.moverActive();
			if (moverActive != null)
			{
				var keyCodePressed = inputHelper.keyCodePressed;
				var moverActions = moverActive.defn().actionsAvailable();
				for (var i = 0; i < moverActions.length; i++)
				{
					var moverAction = moverActions[i];
					if (moverAction.keyCode == keyCodePressed)
					{
						moverAction.perform();
						break;
					}
				}
			}
		}
	}
 
	World.prototype.update_MoversIntegrityCheck = function()
	{
		this.moversToRemove.length = 0;
 
		for (var i = 0; i < this.movers.length; i++)
		{
			var mover = this.movers[i];
			if (mover.integrity <= 0)
			{
				this.moversToRemove.push(mover);
			}
		}
 
		for (var i = 0; i < this.moversToRemove.length; i++)
		{
			var mover = this.moversToRemove[i];
			this.movers.remove(mover);
		}
	}
 
	World.prototype.update_VictoryCheck = function()
	{
		var factionNamesPresent = [];
 
		for (var i = 0; i < this.movers.length; i++)
		{
			var mover = this.movers[i];
			var moverFactionName = mover.factionName;
			if (factionNamesPresent[moverFactionName] == null)
			{
				factionNamesPresent[moverFactionName] = moverFactionName;
				factionNamesPresent.push(moverFactionName);
 
				if (factionNamesPresent.length > 1)
				{
					break;
				}
			}		   
		}
 
		if (factionNamesPresent.length < 2)
		{
			var factionNameVictorious = factionNamesPresent[0];
			alert("The " +  factionNameVictorious + " team wins!");
		}
	}
	
	// drawable
	
	World.prototype.draw = function(display)
	{
		var world = this;
		display.clear();
 
		var map = world.map;
 
		map.draw(display);
		
		var movers = this.movers;
		for (var i = 0; i < movers.length; i++)
		{
			var mover = movers[i];
			mover.draw
			(
				display, 
				map, 
				false // isMoverActive
			);
		}   
 
		var mover = world.moverActive();
		mover.draw
		(
			display, 
			map, 
			true // isMoverActive
		);
 
		world.containerMain.draw(display, display._zeroes);
	}
}
