
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
		var actionMovePerform = (universe: Universe, worldAsWorld: World, direction: Coords) =>
		{
			var world = worldAsWorld as WorldExtended;
			var place = world.placeBattlefield;
			var map = place.map;

			var moverActive = place.moverActive();
			var targetPos = moverActive.targetPos;
			if (targetPos == null)
			{
				var moverOrientation = moverActive.orientation;

				if (moverOrientation.equals(direction) )
				{

					var moverPosNext = moverActive.pos.clone().add
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
					map.sizeInCellsMinusOnes
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
			new Action
			(
				"Attack",
				(universe: Universe, worldAsWorld: World, p: Place, e: Entity) => // perform
				{
					var world = worldAsWorld as WorldExtended;
					var place = world.placeBattlefield;
					var moverActive = place.moverActive();
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
						var moverTarget = place.moverAtPos
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
			new Action
			(
				"Down",
				(universe: Universe, worldAsWorld: World, p: Place, e: Entity) => // perform
				{
					var world = worldAsWorld as WorldExtended;
					actionMovePerform(universe, world, Coords.fromXY(0, 1));
				}
			),
			new Action
			(
				"Left",
				(universe: Universe, worldAsWorld: World, p: Place, e: Entity) => // perform
				{
					var world = worldAsWorld as WorldExtended;
					actionMovePerform(universe, world, Coords.fromXY(-1, 0));
				}
			),
			new Action
			(
				"Right",
				(universe: Universe, worldAsWorld: World, p: Place, e: Entity) => // perform
				{
					var world = worldAsWorld as WorldExtended;
					actionMovePerform(universe, world, Coords.fromXY(1, 0));
				}
			),
			new Action
			(
				"Up",
				(universe: Universe, worldAsWorld: World, p: Place, e: Entity) => // perform
				{
					var world = worldAsWorld as WorldExtended;
					actionMovePerform(universe, world, Coords.fromXY(0, -1));
				}
			),
			new Action
			(
				"Pass",
				(universe: Universe, worldAsWorld: World, p: Place, e: Entity) => // perform
				{
					var world = worldAsWorld as WorldExtended;
					var place = world.placeBattlefield;
					var moverActive = place.moverActive();

					moverActive.movePoints = 0;
				}
			),
		];

		var actionNamesStandard = [ "Attack", "Up", "Down", "Left", "Right", "Pass" ];

		var actionToInputsMappings =
		[
			new ActionToInputsMapping("Attack", [ "f" ], true),

			new ActionToInputsMapping("Up", [ "w" ], true),
			new ActionToInputsMapping("Down", [ "s" ], true),
			new ActionToInputsMapping("Left", [ "a" ], true),
			new ActionToInputsMapping("Right", [ "d" ], true),
 
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

	initialize(universe: Universe): void
	{
		this.placeBattlefield.initialize(universe, this);
	}

	updateForTimerTick(universe: Universe): void
	{
		this.placeBattlefield.updateForTimerTick(universe, this);
	}

	// drawable

	draw(universe: Universe): void
	{
		this.placeBattlefield.draw(universe, this);
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
