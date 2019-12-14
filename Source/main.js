function main()
{
	var actionMovePerform = function(direction)
	{
		var world = Globals.Instance.world;
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
			if (targetDistanceNext <= moverActive.defn().attackRange)
			{
				targetPos.overwriteWith(targetPosNext)
			}
		}
	}
 
	var actions = 
	[
		new Action
		(
			"Attack",
			"F", // keyCode
			function perform()
			{
				var world = Globals.Instance.world;
				var moverActive = world.moverActive();
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
						moverTarget.integrity -= moverActive.defn().attackDamage;
					}
	 
					moverActive.movePoints = 0;
					
					moverActive.targetPos = null;
				}
			}
		),		
		new Action
		(
			"Down",
			"S", // keyCode
			function perform()
			{
				actionMovePerform(new Coords(0, 1));
			}
		),
		new Action
		(
			"Left",
			"A", // keyCode
			function perform()
			{
				actionMovePerform(new Coords(-1, 0));
			}
		),
		new Action
		(
			"Right",
			"D", // keyCode
			function perform()
			{
				actionMovePerform(new Coords(1, 0));
			}
		),
		new Action
		(
			"Up",
			"W", // keyCode
			function perform()
			{
				actionMovePerform(new Coords(0, -1));
			}
		),
		new Action
		(
			"Pass",
			"P", // keyCode
			function perform()
			{
				var world = Globals.Instance.world;
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
		new MapTerrain("Open", ".", 1, "White"),
		new MapTerrain("Blocked", "x", 100, "Gray"),
	];
 
	var map = new Map
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
		new Faction("Green", "Green"),
		new Faction("Red", "Red"),
	];
 
	var world = new World
	(
		actions,
		moverDefns,
		map,
		factions,
		// movers
		[
			new Mover
			(
				"Slugger", // defnName
				"Green", // faction
				new Coords(1, 0), // orientation
				new Coords(1, 1) // pos
			),
 
			new Mover
			(
				"Sniper", // defnName
				"Red", // faction
				new Coords(1, 0), // orientation
				new Coords(3, 1) // pos
			),
			
			new Mover
			(
				"Sprinter", // defnName
				"Red", // faction
				new Coords(1, 0), // orientation
				new Coords(1, 3) // pos
			),
			 
			new Mover
			(
				"Sniper", // defnName
				"Green", // faction
				new Coords(1, 0), // orientation
				new Coords(3, 3) // pos
			),
 
			new Mover
			(
				"Slugger", // defnName
				"Red", // faction
				new Coords(1, 0), // orientation
				new Coords(5, 3) // pos
			),
			
			new Mover
			(
				"Sprinter", // defnName
				"Green", // faction
				new Coords(1, 0), // orientation
				new Coords(5, 1) // pos
			),			
		]
	);
 
	Globals.Instance.initialize
	(
		new Display(new Coords(300, 200)),
		world
	);
}
