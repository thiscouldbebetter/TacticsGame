"use strict";
class MapOfTerrain {
    constructor(cellSizeInPixels, pos, terrains, cellsAsStrings) {
        this.cellSizeInPixels = cellSizeInPixels;
        this.pos = pos;
        this.terrains = terrains;
        this.cellsAsStrings = cellsAsStrings;
        this.cellSizeInPixelsHalf = this.cellSizeInPixels.clone().half();
        this.terrainsByCode =
            ArrayHelper.addLookups(this.terrains, x => x.codeChar);
        this.sizeInCells = Coords.fromXY(this.cellsAsStrings[0].length, this.cellsAsStrings.length);
        this.sizeInCellsMinusOnes = this.sizeInCells.clone().subtract(Coords.fromXY(1, 1));
        // Helper variables.
        this._cellPos = Coords.create();
        this._drawPos = Coords.create();
        this._drawPos2 = Coords.create();
    }
    terrainAtPos(cellPos) {
        var terrainChar = this.cellsAsStrings[cellPos.y][cellPos.x];
        var terrain = this.terrainsByCode.get(terrainChar);
        return terrain;
    }
    // drawable
    draw(display) {
        var map = this;
        var sizeInCells = map.sizeInCells;
        var mapCellSizeInPixels = map.cellSizeInPixels;
        var cellPos = this._cellPos;
        var drawPos = this._drawPos;
        for (var y = 0; y < sizeInCells.y; y++) {
            cellPos.y = y;
            for (var x = 0; x < sizeInCells.x; x++) {
                cellPos.x = x;
                var cellTerrain = map.terrainAtPos(cellPos);
                drawPos.overwriteWith(cellPos).multiply(mapCellSizeInPixels).add(map.pos);
                display.drawRectangle(drawPos, mapCellSizeInPixels, cellTerrain.color, // fill
                Color.byName("Gray") // border
                );
            }
        }
    }
}
