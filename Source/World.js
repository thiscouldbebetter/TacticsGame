
class World
{
	constructor(actions, moverDefns, map, factions, movers)
	{
		this.actions = actions;
		this.moverDefns = moverDefns;
		this.map = map;
		this.movers = movers;
		this.factions = factions;

		this.actionsByName = ArrayHelper.addLookupsByName(this.actions);
		this.factionsByName = ArrayHelper.addLookupsByName(this.factions);
		this.moverDefnsByName = ArrayHelper.addLookupsByName(this.moverDefns);

		this.moversToRemove = [];
	}

	static create()
	{
		var actionMovePerform = (universe, world, direction) =>
		{
			var moverActive = world.moverActive();
			var targetPos = moverActive.targetPos;
			if (targetPos == null)
			{
				var moverOrientation = moverActive.orientation;

				if (moverOrientation.equals(direction) == true)
				{
					var moverPosNext = moverActive.pos.clone().add
					(
						direction
					).trimToRangeMax
					(
						world.map.sizeInCellsMinusOnes
					);

					var terrain = world.map.terrainAtPos(moverPosNext);
					var movePointsToTraverse = terrain.movePointsToTraverse;
					if (moverActive.movePoints >= movePointsToTraverse)
					{
						if (world.moverAtPos(moverPosNext) == null)
						{
							moverActive.pos.overwriteWith
							(
								moverPosNext
							);
							moverActive.movePoints -= movePointsToTraverse;
						}
					}
				}

				moverOrientation.overwriteWith
				(
					direction
				);
			}
			else
			{
				var targetPosNext = targetPos.clone().add
				(
					direction
				).trimToRangeMax
				(
					world.map.sizeInCellsMinusOnes
				);

				var targetDisplacementNext = targetPosNext.clone().subtract
				(
					moverActive.pos
				);

				var targetDistanceNext = targetDisplacementNext.magnitude();
				if (targetDistanceNext <= moverActive.defn(world).attackRange)
				{
					targetPos.overwriteWith(targetPosNext)
				}
			}
		};

		var actions =
		[
			new Action2
			(
				"Attack",
				"f", // keyCode
				(universe, world) => // perform
				{
					var moverActive = world.moverActive();
					if (moverActive.movePoints <= 0)
					{
						return; // hack
					}

					if (moverActive.targetPos == null)
					{
						moverActive.targetPos = moverActive.pos.clone().add
						(
							moverActive.orientation
						);
					}
					else
					{
						var moverTarget = world.moverAtPos
						(
							moverActive.targetPos
						);

						if (moverTarget != null)
						{
							moverTarget.integrity -= moverActive.defn(world).attackDamage;
						}

						moverActive.movePoints = 0;

						moverActive.targetPos = null;
					}
				}
			),
			new Action2
			(
				"Down",
				"s", // keyCode
				(universe, world) => // perform
				{
					actionMovePerform(universe, world, new Coords(0, 1));
				}
			),
			new Action2
			(
				"Left",
				"a", // keyCode
				(universe, world) => // perform
				{
					actionMovePerform(universe, world, new Coords(-1, 0));
				}
			),
			new Action2
			(
				"Right",
				"d", // keyCode
				(universe, world) => // perform
				{
					actionMovePerform(universe, world, new Coords(1, 0));
				}
			),
			new Action2
			(
				"Up",
				"w", // keyCode
				(universe, world) => // perform
				{
					actionMovePerform(universe, world, new Coords(0, -1));
				}
			),
			new Action2
			(
				"Pass",
				"p", // keyCode
				(universe, world) => // perform
				{
					var moverActive = world.moverActive();

					moverActive.movePoints = 0;
				}
			),
		];

		var actionNamesStandard = [ "Attack", "Up", "Down", "Left", "Right", "Pass" ];

		var moverDefns =
		[
			new MoverDefn
			(
				"Slugger",
				"A",
				3, // integrityMax
				1, // movePointsPerTurn
				1, // attackRange
				2, // attackDamage
				actionNamesStandard
			),

			new MoverDefn
			(
				"Sniper",
				"B",
				2, // integrityMax
				1, // movePointsPerTurn
				3, // attackRange
				1, // attackDamage
				actionNamesStandard
			),

			new MoverDefn
			(
				"Sprinter",
				"C",
				1, // integrityMax
				3, // movePointsPerTurn
				1, // attackRange
				1, // attackDamage
				actionNamesStandard
			),
		];

		var mapTerrains =
		[
			new MapTerrain("Open", ".", 1, Color.byName("GreenDark")),
			new MapTerrain("Blocked", "x", 100, Color.byName("Gray")),
		];

		var map = new MapOfTerrain
		(
			new Coords(20, 20), // cellSizeInPixels
			new Coords(20, 20), // pos
			mapTerrains,
			// cellsAsStrings
			[
				"........",
				"....x...",
				"....x...",
				"....x...",
				"........",
				"...xxx..",
				"........",
				"........",
			]
		);

		var factions =
		[
			new Faction("Blue", Color.byName("Blue")),
			new Faction("Red", Color.byName("Red")),
		];

		var movers =
		[
			new Mover
			(
				"Slugger", // defnName
				"Blue", // factionName
				new Coords(1, 0), // orientation
				new Coords(1, 1) // pos
			),

			new Mover
			(
				"Sniper", // defnName
				"Blue", // factionName
				new Coords(1, 0), // orientation
				new Coords(3, 1) // pos
			),

			new Mover
			(
				"Sprinter", // defnName
				"Blue", // factionName
				new Coords(1, 0), // orientation
				new Coords(1, 3) // pos
			),

			new Mover
			(
				"Slugger", // defnName
				"Red", // factionName
				new Coords(1, 0), // orientation
				new Coords(5, 3) // pos
			),

			new Mover
			(
				"Sniper", // defnName
				"Red", // factionName
				new Coords(1, 0), // orientation
				new Coords(3, 3) // pos
			),

			new Mover
			(
				"Sprinter", // defnName
				"Red", // factionName
				new Coords(1, 0), // orientation
				new Coords(5, 1) // pos
			),
		];

		var world = new World
		(
			actions,
			moverDefns,
			map,
			factions,
			movers
		);

		return world;
	}

	moverActive()
	{
		var returnValue = null;

		if (this.indexOfMoverActive != null)
		{
			returnValue = this.movers[this.indexOfMoverActive];
		}

		return returnValue;
	}

	moverActiveAdvanceIfNeeded()
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

	moverAtPos(posToCheck)
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

	moversReplenish()
	{
		for (var i = 0; i < this.movers.length; i++)
		{
			var mover = this.movers[i];
			mover.movePoints = mover.defn(this).movePointsPerTurn;
		}
	}

	initialize(universe)
	{
		var world = this;

		for (var i = 0; i < this.movers.length; i++)
		{
			var mover = this.movers[i];
			mover.initialize(universe, world);
		}

		var moverActive = this.moverActiveAdvanceIfNeeded(universe, world);

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
						moverActive.defn(world).actionsAvailable(world),
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
								null, () => world.moverActive().factionName
							)
						),

						ControlLabel.fromPosAndText
						(
							new Coords(5, 15), // pos
							new DataBinding
							(
								null, () => world.moverActive().defnName
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
									var moverActive = world.moverActive();
									var moverDefn = moverActive.defn(world);
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
									var moverActive = world.moverActive();
									var moverDefn = moverActive.defn(world);
									return "Moves:" + moverActive.movePoints + "/" + moverDefn.movePointsPerTurn;
								}
							)
						)

					]
				),
			]
		);

		this.updateForTimerTick(universe);
	}

	updateForTimerTick(universe)
	{
		this.update_Input(universe);

		this.update_MoversIntegrityCheck();

		this.moverActiveAdvanceIfNeeded();

		this.update_VictoryCheck();

		this.draw(universe);
	}

	update_Input(universe)
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
				inputHelper.isMouseClicked = false;
				this.containerMain.mouseClick
				(
					inputHelper.mouseClickPos
				);
			}
			else
			{
				var moverActive = this.moverActive();
				if (moverActive != null)
				{
					var moverActiveDefn = moverActive.defn(this);
					var moverActions = moverActiveDefn.actionsAvailable(this);
					for (var j = 0; j < moverActions.length; j++)
					{
						var moverAction = moverActions[j];
						if (moverAction.key == inputName)
						{
							moverAction.perform(universe, this);
							break;
						}
					}
				}
			}
		}
	}

	update_MoversIntegrityCheck()
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

	update_VictoryCheck()
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

	draw(universe)
	{
		var display = universe.display;
		var world = this;
		display.clear();

		display.drawRectangle
		(
			Coords.Instances().Zeroes, display.sizeInPixels,
			Color.byName("White"), Color.byName("Gray")
		)

		var map = world.map;

		map.draw(display);

		var movers = this.movers;
		for (var i = 0; i < movers.length; i++)
		{
			var mover = movers[i];
			mover.draw
			(
				universe, world,
				display,
				map,
				false // isMoverActive
			);
		}

		var mover = world.moverActive();
		mover.draw
		(
			universe, world,
			display,
			map,
			true // isMoverActive
		);

		var drawLoc = new Disposition(new Coords(0, 0, 0));
		world.containerMain.draw(universe, display, drawLoc);
	}

	toControl()
	{
		return new ControlNone();
	}

	toVenue()
	{
		return new VenueWorld(this);
	}
}

class VenueWorld
{
	constructor(world)
	{
		this.world = world;
	}

	initialize(universe, world)
	{
		this.world.initialize(universe);
	}

	updateForTimerTick(universe, world)
	{
		this.world.updateForTimerTick(universe, world);
	}
}
