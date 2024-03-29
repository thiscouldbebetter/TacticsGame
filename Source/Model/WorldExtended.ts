
class WorldExtended extends World
{
	actions: Action[];
	actionToInputsMappings: ActionToInputsMapping[];
	moverDefns: MoverDefn[];
	factions: Faction[];
	placeBattlefield: PlaceBattlefield;

	actionsByName: Map<string, Action>;
	actionToInputsMappingsByInputName: Map<string, ActionToInputsMapping>;
	factionsByName: Map<string, Faction>;
	moverDefnsByName: Map<string, MoverDefn>;

	constructor
	(
		actions: Action[],
		actionToInputsMappings: ActionToInputsMapping[],
		moverDefns: MoverDefn[],
		factions: Faction[],
		placeBattlefield: PlaceBattlefield
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
		this.actionToInputsMappings = actionToInputsMappings;
		this.moverDefns = moverDefns;
		this.factions = factions;
		this.placeBattlefield = placeBattlefield;

		this.actionsByName = ArrayHelper.addLookupsByName(this.actions);
		this.actionToInputsMappingsByInputName = ArrayHelper.addLookups
		(
			this.actionToInputsMappings,
			(x: ActionToInputsMapping) => x.inputNames[0]
		);
		this.factionsByName = ArrayHelper.addLookupsByName(this.factions);
		this.moverDefnsByName = ArrayHelper.addLookupsByName(this.moverDefns);
	}

	static create(): WorldExtended
	{
		var actionMovePerform = (uwpe: UniverseWorldPlaceEntities, direction: Coords) =>
		{
			var world = uwpe.world as WorldExtended;
			var place = world.placeBattlefield;
			var map = place.map;

			var moverActive = place.moverActive();
			var moverActiveLoc = moverActive.locatable().loc;
			var moverPos = moverActiveLoc.pos;

			var targetPos = moverActive.targetPos;
			if (targetPos == null)
			{
				var moverForward = moverActiveLoc.orientation.forward;

				if (moverForward.equals(direction) )
				{
					var moverPosNext = moverPos.clone().add
					(
						direction
					).trimToRangeMax
					(
						map.sizeInCellsMinusOnes
					);

					var terrain = map.terrainAtPos(moverPosNext);
					var movePointsToTraverse = terrain.movePointsToTraverse;
					if (moverActive.movePoints >= movePointsToTraverse)
					{
						if (place.moverAtPos(moverPosNext) == null)
						{
							moverPos.overwriteWith
							(
								moverPosNext
							);
							moverActive.movePoints -= movePointsToTraverse;
						}
					}
				}

				moverForward.overwriteWith
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
					map.sizeInCellsMinusOnes
				);

				var targetDisplacementNext = targetPosNext.clone().subtract
				(
					moverPos
				);

				var targetDistanceNext = targetDisplacementNext.magnitude();
				if (targetDistanceNext <= moverActive.defn(world).attackRange)
				{
					targetPos.overwriteWith(targetPosNext)
				}
			}
		};

		var directions = Direction.Instances();

		var actions =
		[
			new Action
			(
				"Attack",
				(uwpe: UniverseWorldPlaceEntities) => // perform
				{
					var world = uwpe.world as WorldExtended;
					var place = world.placeBattlefield;
					var moverActive = place.moverActive();
					if (moverActive.movePoints <= 0)
					{
						return; // hack
					}

					var moverLoc = moverActive.locatable().loc;
					var moverPos = moverLoc.pos;

					if (moverActive.targetPos == null)
					{
						moverActive.targetPos = moverPos.clone().add
						(
							moverLoc.orientation.forward
						);
					}
					else
					{
						var moverTarget = place.moverAtPos
						(
							moverActive.targetPos
						);

						if (moverTarget != null)
						{
							moverTarget.killable().integritySubtract
							(
								moverActive.defn(world).attackDamage
							);
						}

						moverActive.movePoints = 0;

						moverActive.targetPos = null;
					}
				}
			),
			new Action
			(
				"South",
				(uwpe: UniverseWorldPlaceEntities) => // perform
				{
					actionMovePerform(uwpe, directions.South);
				}
			),
			new Action
			(
				"West",
				(uwpe: UniverseWorldPlaceEntities) => // perform
				{
					actionMovePerform(uwpe, directions.West);
				}
			),
			new Action
			(
				"East",
				(uwpe: UniverseWorldPlaceEntities) => // perform
				{
					actionMovePerform(uwpe, directions.East);
				}
			),
			new Action
			(
				"North",
				(uwpe: UniverseWorldPlaceEntities) => // perform
				{
					actionMovePerform(uwpe, directions.North);
				}
			),
			new Action
			(
				"Pass",
				(uwpe: UniverseWorldPlaceEntities) => // perform
				{
					var world = uwpe.world as WorldExtended;
					var place = world.placeBattlefield;
					var moverActive = place.moverActive();

					moverActive.movePoints = 0;
				}
			),
		];

		var actionNamesStandard = [ "Attack", "North", "South", "West", "East", "Pass" ];

		var actionToInputsMappings =
		[
			new ActionToInputsMapping("Attack", [ "f" ], true),

			new ActionToInputsMapping("North", [ "w" ], true),
			new ActionToInputsMapping("South", [ "s" ], true),
			new ActionToInputsMapping("West", [ "a" ], true),
			new ActionToInputsMapping("East", [ "d" ], true),
 
			new ActionToInputsMapping("Pass", [ "p" ], true),
		];

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
				actionNamesStandard,
				new VisualImageFromLibrary("Movers_Pawn-Gray")
			),

			new MoverDefn
			(
				"Sniper",
				"B",
				2, // integrityMax
				1, // movePointsPerTurn
				3, // attackRange
				1, // attackDamage
				actionNamesStandard,
				new VisualImageFromLibrary("Movers_Pawn-Gray")
			),

			new MoverDefn
			(
				"Sprinter",
				"C",
				1, // integrityMax
				3, // movePointsPerTurn
				1, // attackRange
				1, // attackDamage
				actionNamesStandard,
				new VisualImageFromLibrary("Movers_Pawn-Gray")
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
				Coords.fromXY(1, 1), // pos
				Coords.fromXY(1, 0) // orientation
			),

			new Mover
			(
				"Sniper", // defnName
				"Blue", // factionName
				Coords.fromXY(3, 1), // pos
				Coords.fromXY(1, 0) // orientation
			),

			new Mover
			(
				"Sprinter", // defnName
				"Blue", // factionName
				Coords.fromXY(1, 3), // pos
				Coords.fromXY(1, 0) // orientation
			),

			new Mover
			(
				"Slugger", // defnName
				"Red", // factionName
				Coords.fromXY(5, 3), // pos
				Coords.fromXY(1, 0) // orientation
			),

			new Mover
			(
				"Sniper", // defnName
				"Red", // factionName
				Coords.fromXY(3, 3), // pos
				Coords.fromXY(1, 0), // orientation
			),

			new Mover
			(
				"Sprinter", // defnName
				"Red", // factionName
				Coords.fromXY(5, 1), // pos
				Coords.fromXY(1, 0) // orientation
			),
		];

		var placeBattlefield = new PlaceBattlefield(map, movers);

		var world = new WorldExtended
		(
			actions,
			actionToInputsMappings,
			moverDefns,
			factions,
			placeBattlefield
		);

		return world;
	}

	actionByName(actionName: string): Action
	{
		return this.actionsByName.get(actionName);
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		uwpe.worldSet(this);
		this.placeBattlefield.initialize(uwpe);
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		uwpe.worldSet(this);
		this.placeBattlefield.updateForTimerTick(uwpe);
	}

	// drawable

	draw(universe: Universe): void
	{
		this.placeBattlefield.draw(universe, this, universe.display);
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
