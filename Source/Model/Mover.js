"use strict";
class Mover extends Entity {
    constructor(defnName, factionName, pos, forward) {
        super(Mover.name + "_" + defnName + "_" + factionName, [
            Drawable.fromVisual(null),
            new Locatable(Disposition.from2(pos, Orientation.fromForward(forward))),
            Killable.default()
        ]);
        this.defnName = defnName;
        this.factionName = factionName;
    }
    defn(world) {
        return world.moverDefnsByName.get(this.defnName);
    }
    faction(world) {
        return world.factionsByName.get(this.factionName);
    }
    nameFull() {
        return this.factionName + " " + this.defnName;
    }
    initialize(uwpe) {
        var world = uwpe.world;
        var place = uwpe.place;
        var map = place.map;
        var defn = this.defn(uwpe.world);
        var mapCellSizeInPixels = map.cellSizeInPixels;
        var offsetForVisuals = Coords.fromXY(0, mapCellSizeInPixels.y / 2);
        var tileSizeInPixels = Coords.fromXY(32, 96);
        var imageSizeInTiles = Coords.fromXY(4, 1);
        var imageSizeInPixels = imageSizeInTiles.clone().multiply(tileSizeInPixels);
        var scaleFactor = mapCellSizeInPixels.x / tileSizeInPixels.x;
        var scaledSize = tileSizeInPixels.clone().multiplyScalar(scaleFactor);
        var moverVisuals = VisualImageScaledPartial.manyFromVisualImageAndSizes(defn.visual, imageSizeInPixels, imageSizeInTiles, scaledSize).map(x => VisualOffset.fromOffsetAndChild(offsetForVisuals, x));
        var moverVisualBody = VisualDirectional.fromVisuals(moverVisuals[0], // visualForNoDirection
        moverVisuals);
        var faction = this.faction(world);
        var factionColor = faction.color;
        var moverVisualText = VisualText.fromTextHeightAndColor(defn.name, 10, factionColor);
        var highlightDimension = 5;
        var moverVisualHighlight = new VisualHidable((uwpe) => {
            var place = uwpe.place;
            var moverBeingDrawn = uwpe.entity;
            var moverActive = place.moverActive();
            var isMoverBeingDrawnActive = (moverBeingDrawn == moverActive);
            return isMoverBeingDrawnActive;
        }, VisualOffset.fromOffsetAndChild(Coords.fromXY(0, 0 - scaledSize.y * .4), new VisualPolygon(new Path([
            Coords.fromXY(-1, 0).multiplyScalar(highlightDimension),
            Coords.fromXY(1, 0).multiplyScalar(highlightDimension),
            Coords.fromXY(0, 1).multiplyScalar(highlightDimension),
        ]), Color.byName("White"), // colorFill
        Color.byName("Black"), false // shouldUseEntityOrientation
        )));
        var moverVisual = new VisualGroup([
            moverVisualBody,
            moverVisualText,
            moverVisualHighlight
        ]);
        var mapPosPlusCellSizeHalf = map.pos.clone().add(map.cellSizeInPixelsHalf);
        var drawable = this.drawable();
        drawable.visual = new VisualTransformEntityPos(new Transform_Multiple([
            new Transform_Scale(mapCellSizeInPixels),
            new Transform_Translate(mapPosPlusCellSizeHalf)
        ]), moverVisual);
        var killable = this.killable();
        killable.integrityMax = defn.integrityMax;
        killable.integritySetToMax();
        this.movePoints = defn.movePointsPerTurn;
        return this;
    }
    // drawable
    draw(universe, world, display, map, isMoverActive) {
        var drawable = this.drawable();
        var visual = drawable.visual;
        var uwpe = new UniverseWorldPlaceEntities(universe, world, world.placeBattlefield, this, null);
        visual.draw(uwpe, universe.display);
    }
}
