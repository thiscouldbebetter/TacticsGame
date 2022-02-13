"use strict";
class MoverDefn {
    constructor(name, codeChar, integrityMax, movePointsPerTurn, attackRange, attackDamage, actionNamesAvailable, visual) {
        this.name = name;
        this.codeChar = codeChar;
        this.integrityMax = integrityMax;
        this.movePointsPerTurn = movePointsPerTurn;
        this.attackRange = attackRange;
        this.attackDamage = attackDamage;
        this.actionNamesAvailable = actionNamesAvailable;
        this.visual = visual;
    }
    actionsAvailable(world) {
        var actionsAll = world.actionsByName;
        var returnValues = this.actionNamesAvailable.map(x => actionsAll.get(x));
        return returnValues;
    }
}
