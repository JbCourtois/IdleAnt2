import { FullUnit } from "../full-unit";
import { Game } from "../game";
import { Price } from "../price";
import { UnitGroup } from "../unit-group";

export class MalusKiller extends UnitGroup {
  foodMalusKiller: FullUnit;
  woodMalusKiller: FullUnit;
  crystalMalusKiller: FullUnit;
  scienceMalusKiller: FullUnit;

  private readonly price = new Decimal(500);

  constructor(game: Game) {
    super("Army", game);
  }
  declareStuff(): void {
    this.foodMalusKiller = new FullUnit("F");
    this.woodMalusKiller = new FullUnit("W");
    this.crystalMalusKiller = new FullUnit("C");
    this.scienceMalusKiller = new FullUnit("S");

    this.addUnits([
      this.foodMalusKiller,
      this.woodMalusKiller,
      this.crystalMalusKiller,
      this.scienceMalusKiller
    ]);
  }
  setRelations(): void {
    //  Production
    this.game.worldMalus.foodMalus1.addProducer(
      this.foodMalusKiller,
      new Decimal(-0.1)
    );
    this.game.worldMalus.woodMalus1.addProducer(
      this.woodMalusKiller,
      new Decimal(-0.1)
    );
    this.game.worldMalus.crystalMalus1.addProducer(
      this.crystalMalusKiller,
      new Decimal(-0.1)
    );
    this.game.worldMalus.scienceMalus1.addProducer(
      this.scienceMalusKiller,
      new Decimal(-0.1)
    );

    //  Buy actions
    this.foodMalusKiller.generateBuyAction([
      new Price(this.game.materials.food, this.price, 1.1)
    ]);
    this.woodMalusKiller.generateBuyAction([
      new Price(this.game.materials.food, this.price, 1.1)
    ]);
    this.crystalMalusKiller.generateBuyAction([
      new Price(this.game.materials.food, this.price, 1.1)
    ]);
    this.scienceMalusKiller.generateBuyAction([
      new Price(this.game.materials.food, this.price, 1.1)
    ]);

    //  Team and Twin
    this.list.forEach(u => {
      if (u instanceof FullUnit) {
        u.generateTeamAction(this.game.genTeamPrice(new Decimal(5e3)));
        u.generateTwinAction(this.game.genTwinPrice(new Decimal(1e4)));
      }
    });
  }
}
