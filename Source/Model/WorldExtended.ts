
class WorldExtended extends World
{
	actions: Action2[];
	moverDefns: MoverDefn[];
	map: MapOfTerrain;
	factions: Faction[];
	movers: Mover[];

	actionsByName: Map<string, Action2>;
	containerMain: ControlContainer;
	factionsByName: Map<string, Faction>;
	indexOfMoverActive: number;
	moverDefnsByName: Map<string, MoverDefn>;
	moversToRemove: Mover[];

	constructor
	(
		actions: Action2[],
		moverDefns: MoverDefn[],
		map: MapOfTerrain,
		factions: Faction[],
		movers: Mover[]
	)
	{
		super
		(
			"World",
			DateTime.now(),
			null, // defn
			[] // places
		);

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

	static create(): WorldExtended
	{
		var actionMovePerform = (universe: Universe, worldAsWorld: World, direction: Coords) =>
		{
			var world = worldAsWorld as WorldExtended;

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
				(universe: Universe, world: WorldExtended) => // perform
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
				(universe: Universe, world: WorldExtended) => // perform
				{
					actionMovePerform(universe, world, Coords.fromXY(0, 1));
				}
			),
			new Action2
			(
				"Left",
				"a", // keyCode
				(universe: Universe, world: WorldExtended) => // perform
				{
					actionMovePerform(universe, world, Coords.fromXY(-1, 0));
				}
			),
			new Action2
			(
				"Right",
				"d", // keyCode
				(universe: Universe, world: WorldExtended) => // perform
				{
					actionMovePerform(universe, world, Coords.fromXY(1, 0));
				}
			),
			new Action2
			(
				"Up",
				"w", // keyCode
				(universe: Universe, world: WorldExtended) => // perform
				{
					actionMovePerform(universe, world, Coords.fromXY(0, -1));
				}
			),
			new Action2
			(
				"Pass",
				"p", // keyCode
				(universe: Universe, world: WorldExtended) => // perform
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
			Coords.fromXY(20, 20), // cellSizeInPixels
			Coords.fromXY(20, 20), // pos
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
				Coords.fromXY(1, 0), // orientation
				Coords.fromXY(1, 1) // pos
			),

			new Mover
			(
				"Sniper", // defnName
				"Blue", // factionName
				Coords.fromXY(1, 0), // orientation
				Coords.fromXY(3, 1) // pos
			),

			new Mover
			(
				"Sprinter", // defnName
				"Blue", // factionName
				Coords.fromXY(1, 0), // orientation
				Coords.fromXY(1, 3) // pos
			),

			new Mover
			(
				"Slugger", // defnName
				"Red", // factionName
				Coords.fromXY(1, 0), // orientation
				Coords.fromXY(5, 3) // pos
			),

			new Mover
			(
				"Sniper", // defnName
				"Red", // factionName
				Coords.fromXY(1, 0), // orientation
				Coords.fromXY(3, 3) // pos
			),

			new Mover
			(
				"Sprinter", // defnName
				"Red", // factionName
				Coords.fromXY(1, 0), // orientation
				Coords.fromXY(5, 1) // pos
			),
		];

		var world = new WorldExtended
		(
			actions,
			moverDefns,
			map,
			factions,
			movers
		);

		return world;
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

	moverActiveAdvanceIfNeeded(): Mover
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

	moverAtPos(posToCheck: Coords): Mover
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

	moversReplenish(): void
	{
		for (var i = 0; i < this.movers.length; i++)
		{
			var mover = this.movers[i];
			mover.movePoints = mover.defn(this).movePointsPerTurn;
		}
	}

	initialize(universe: Universe): void
	{
		var world = this;

		for (var i = 0; i < this.movers.length; i++)
		{
			var mover = this.movers[i];
			mover.initialize(universe, world);
		}

		var moverActive = this.moverActiveAdvanceIfNeeded();

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
					ControlHelper.toControlsMany
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
								(c: any) => world.moverActive().factionName
							)
						),

						ControlLabel.fromPosAndText
						(
							Coords.fromXY(5, 15), // pos
							DataBinding.fromGet
							(
								(c: any) => world.moverActive().defnName
							)
						),

						ControlLabel.fromPosAndText
						(
							Coords.fromXY(5, 25), // pos
							DataBinding.fromGet
							(
								(c: any) =>
								{
									var moverActive = world.moverActive();
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

	updateForTimerTick(universe: Universe): void
	{
		this.update_Input(universe);

		this.update_MoversIntegrityCheck();

		this.moverActiveAdvanceIfNeeded();

		this.update_VictoryCheck();

		this.draw(universe);
	}

	update_Input(universe: Universe): void
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

	// drawable

	draw(universe: Universe): void
	{
		var display = universe.display;
		var world = this;
		display.clear();

		display.drawRectangle
		(
			Coords.Instances().Zeroes, display.sizeInPixels,
			Color.byName("White"), Color.byName("Gray"),
			null // areColorsReversed
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

		var drawLoc = Disposition.create();
		world.containerMain.draw
		(
			universe, display, drawLoc, null // style
		);
	}

	toControl(): ControlBase
	{
		return new ControlNone();
	}

	toVenue(): VenueWorld
	{
		return new VenueWorld(this);
	}
}
