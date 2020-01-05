
function World(actions, moverDefns, map, factions, movers)
{
	this.actions = actions;
	this.moverDefns = moverDefns;
	this.map = map;
	this.movers = movers;
	this.factions = factions;

	this.actions.addLookupsByName();
	this.factions.addLookupsByName();
	this.moverDefns.addLookupsByName();

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
	};

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
	};

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
	};

	World.prototype.moversReplenish = function()
	{
		for (var i = 0; i < this.movers.length; i++)
		{
			var mover = this.movers[i];
			mover.movePoints = mover.defn().movePointsPerTurn;
		}
	};

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
			new Coords(200, 10), // pos
			new Coords(90, 180), // size
			[
				new ControlContainer
				(
					"containerActions",
					new Coords(10, 10), // pos
					new Coords(70, 90), // size
					// children
					ControlHelper.toControlsMany
					(
						moverActive.defn().actionsAvailable(),
						new Coords(10, 10), // posFirst
						new Coords(0, 12) // spacing
					)
				),

				new ControlContainer
				(
					"containerSelection",
					new Coords(10, 110), // pos
					new Coords(70, 60), // size
					// children
					[
						ControlLabel.fromPosAndText
						(
							new Coords(5, 5), // pos
							new DataBinding
							(
								null, () => Globals.Instance.world.moverActive().factionName
							)
						),

						ControlLabel.fromPosAndText
						(
							new Coords(5, 15), // pos
							new DataBinding
							(
								null, () => Globals.Instance.world.moverActive().defnName
							)
						),

						ControlLabel.fromPosAndText
						(
							new Coords(5, 25), // pos
							new DataBinding
							(
								null,
								function get()
								{
									var moverActive = Globals.Instance.world.moverActive();
									var moverDefn = moverActive.defn();
									return "Health:" + moverActive.integrity + "/" + moverDefn.integrityMax;
								}
							)
						),

						ControlLabel.fromPosAndText
						(
							new Coords(5, 35), // pos
							new DataBinding
							(
								null,
								function get()
								{
									var moverActive = Globals.Instance.world.moverActive();
									var moverDefn = moverActive.defn();
									return "Moves:" + moverActive.movePoints + "/" + moverDefn.movePointsPerTurn;
								}
							)
						)

					]
				),
			]
		);

		this.update();
	};

	World.prototype.update = function()
	{
		this.update_Input();

		this.update_MoversIntegrityCheck();

		this.moverActiveAdvanceIfNeeded();

		this.update_VictoryCheck();

		this.draw(Globals.Instance.universe);
	};

	World.prototype.update_Input = function()
	{
		var inputHelper = Globals.Instance.inputHelper;

		var inputsPressed = inputHelper.inputsPressed;
		for (var i = 0; i < inputsPressed.length; i++)
		{
			var inputName = inputsPressed[i].name;
			if (inputName == "MouseClick")
			{
				inputHelper.isMouseClicked = false;
				this.containerMain.mouseClick
				(
					inputHelper.mousePos
				);
			}
			else
			{
				var moverActive = this.moverActive();
				if (moverActive != null)
				{
					var moverActions = moverActive.defn().actionsAvailable();
					for (var i = 0; i < moverActions.length; i++)
					{
						var moverAction = moverActions[i];
						if (moverAction.key == inputName)
						{
							moverAction.perform();
							break;
						}
					}
				}
			}
		}
	};

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
	};

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
	};

	// drawable

	World.prototype.draw = function(universe)
	{
		var display = universe.display;
		var world = this;
		display.clear();

		display.drawRectangle(Coords.Instances().Zeroes, display.sizeInPixels, "White", "Gray")

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

		var drawLoc = new Location(new Coords(0, 0, 0));
		world.containerMain.draw(universe, display, drawLoc);
	};
}
