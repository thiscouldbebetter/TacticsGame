
class PlaceBattlefield extends Place
{
	map: MapOfTerrain;
	movers: Mover[];

	containerMain: ControlContainer;
	indexOfMoverActive: number;
	moversToRemove: Mover[];

	constructor(map: MapOfTerrain, movers: Mover[])
	{
		super(PlaceBattlefield.name, null, null, []);

		this.map = map;
		this.movers = movers;

		this.moversToRemove = [];
	}

	draw(universe: Universe, world: WorldExtended): void
	{
		var display = universe.display;
		display.clear();

		display.drawRectangle
		(
			Coords.Instances().Zeroes, display.sizeInPixels,
			Color.byName("White"), Color.byName("Gray"),
			null // areColorsReversed
		)

		var map = this.map;

		map.draw(display);

		var movers = this.movers;
		for (var i = 0; i < movers.length; i++)
		{
			var mover = movers[i];
			mover.draw
			(
				universe, world, display, map, false // isMoverActive
			);
		}

		var mover = this.moverActive();
		mover.draw
		(
			universe, world, display, map, true // isMoverActive
		);

		var drawLoc = Disposition.create();
		this.containerMain.draw
		(
			universe, display, drawLoc, null // style
		);
	}

	moverActive(): Mover
	{
		var returnValue = null;

		if (this.indexOfMoverActive != null)
		{
			returnValue = this.movers[this.indexOfMoverActive];
		}

		return returnValue;
	}

	moverActiveAdvanceIfNeeded(world: WorldExtended): Mover
	{
		var moverActive = this.moverActive();

		if (moverActive == null)
		{
			this.moversReplenish(world);
			this.indexOfMoverActive = 0;
			moverActive = this.moverActive();
		}
		else if (moverActive.movePoints <= 0)
		{
			this.indexOfMoverActive++;
			if (this.indexOfMoverActive >= this.movers.length)
			{
				this.moversReplenish(world);
				this.indexOfMoverActive = 0;
			}

			moverActive = this.moverActive();
		}

		return moverActive;
	}

	moverAtPos(posToCheck: Coords): Mover
	{
		var returnValue = null;

		for (var i = 0; i < this.movers.length; i++)
		{
			var mover = this.movers[i];
			if (mover.pos.equals(posToCheck) )
			{
				returnValue = mover;
				break;
			}
		}

		return returnValue;
	}

	moversReplenish(world: WorldExtended): void
	{
		for (var i = 0; i < this.movers.length; i++)
		{
			var mover = this.movers[i];
			mover.movePoints = mover.defn(world).movePointsPerTurn;
		}
	}

	// Place.

	initialize(universe: Universe, world: WorldExtended): void
	{
		var place = this;

		for (var i = 0; i < this.movers.length; i++)
		{
			var mover = this.movers[i];
			mover.initialize(universe, world);
		}

		var moverActive = this.moverActiveAdvanceIfNeeded(world);

		this.containerMain = ControlContainer.from4
		(
			"containerMain",
			Coords.fromXY(200, 10), // pos
			Coords.fromXY(90, 180), // size
			[
				ControlContainer.from4
				(
					"containerActions",
					Coords.fromXY(10, 10), // pos
					Coords.fromXY(70, 90), // size
					// children
					ActionHelper.actionsToControls
					(
						moverActive.defn(world).actionsAvailable(world),
						Coords.fromXY(10, 10), // posFirst
						Coords.fromXY(0, 12) // spacing
					)
				),

				ControlContainer.from4
				(
					"containerSelection",
					Coords.fromXY(10, 110), // pos
					Coords.fromXY(70, 60), // size
					// children
					[
						ControlLabel.fromPosAndText
						(
							Coords.fromXY(5, 5), // pos
							DataBinding.fromGet
							(
								(c: any) => place.moverActive().factionName
							)
						),

						ControlLabel.fromPosAndText
						(
							Coords.fromXY(5, 15), // pos
							DataBinding.fromGet
							(
								(c: any) => place.moverActive().defnName
							)
						),

						ControlLabel.fromPosAndText
						(
							Coords.fromXY(5, 25), // pos
							DataBinding.fromGet
							(
								(c: any) =>
								{
									var moverActive = place.moverActive();
									var moverDefn = moverActive.defn(world);
									return "Health:" + moverActive.integrity + "/" + moverDefn.integrityMax;
								}
							)
						),

						ControlLabel.fromPosAndText
						(
							Coords.fromXY(5, 35), // pos
							DataBinding.fromGet
							(
								(c: any) =>
								{
									var moverActive = place.moverActive();
									var moverDefn = moverActive.defn(world);
									var returnValue =
										"Moves:" + moverActive.movePoints
										+ "/" + moverDefn.movePointsPerTurn;
									return returnValue;
								}
							)
						)

					]
				),
			]
		);

		this.updateForTimerTick(universe, world);
	}

	updateForTimerTick(universe: Universe, world: WorldExtended): void
	{
		this.update_Input(universe, world);

		this.update_MoversIntegrityCheck();

		this.moverActiveAdvanceIfNeeded(world);

		this.update_VictoryCheck();

		this.draw(universe, world);
	}

	update_Input(universe: Universe, world: WorldExtended): void
	{
		var inputHelper = universe.inputHelper;

		var inputsPressed = inputHelper.inputsPressed;
		for (var i = 0; i < inputsPressed.length; i++)
		{
			var inputName = inputsPressed[i].name;
			if (inputName == "MouseMove")
			{
				// Ignore it for now.
			}
			else if (inputName == "MouseClick")
			{
				inputHelper.isMouseClicked(false);
				this.containerMain.mouseClick
				(
					inputHelper.mouseClickPos
				);
			}
			else
			{
				/*
				var mapping = world.actionToInputsMappingsByInputName.get(inputName);
				if (mapping != null)
				{
					var moverActive = this.moverActive();
					if (moverActive != null)
					{
						var moverActionName = mapping.actionName;
						var moverAction = world.actionByName(moverActionName);
						if (moverAction != null)
						{
							moverAction.perform(universe, world, this, null);
						}
					}
				}
				*/
				var moverActive = this.moverActive();
				if (moverActive != null)
				{
					var actionsFromInput = inputHelper.actionsFromInput
					(
						world.actionsByName,
						world.actionToInputsMappingsByInputName
					);
					for (var a = 0; a < actionsFromInput.length; a++)
					{
						var action = actionsFromInput[a];
						action.perform(universe, world, this, null);
					}
				}
			}
		}
	}

	update_MoversIntegrityCheck(): void
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
			ArrayHelper.remove(this.movers, mover);
		}
	}

	update_VictoryCheck(): void
	{
		var factionNamesPresent = [];
		var factionNamesPresentAsMap = new Map<string, string>();

		for (var i = 0; i < this.movers.length; i++)
		{
			var mover = this.movers[i];
			var moverFactionName = mover.factionName;
			if (factionNamesPresentAsMap.has(moverFactionName) == false)
			{
				factionNamesPresentAsMap.set(moverFactionName, moverFactionName);
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
}
