import { Injectable } from "@angular/core";
import { Game } from "./model/game";
import { OptionsService } from "./options.service";
import * as LZString from "lz-string";
import { ToastrService } from "ngx-toastr";

const GAME_VERSION = 0;

@Injectable({
  providedIn: "root"
})
export class MainService {
  game: Game;
  last: number;
  constructor(public options: OptionsService, private toastr: ToastrService) {
    this.game = new Game();
    this.last = Date.now();
    setInterval(this.update.bind(this), 200);
  }
  public update() {
    const now = Date.now();
    const diff = now - this.last;

    this.game.update(diff);
    this.game.postUpdate();
    this.last = now;
  }

  getSave(): string {
    try {
      const save: any = {};
      save.m = this.game.getSave();
      save.o = this.options.getSave();
      save.time = this.last;
      save.ver = GAME_VERSION;
      return LZString.compressToBase64(JSON.stringify(save));
    } catch (ex) {
      this.toastr.error(
        ex && ex.message ? ex.message : "unknow error",
        "Save Error"
      );
    }
  }
  save(autosave = false) {
    try {
      const save = this.getSave();
      if (!!save) {
        localStorage.setItem("save", save);
        if (!autosave || this.options.autosaveNotification)
          this.toastr.success("", "Game Saved");
      } else this.toastr.error("Unknow error 1", "Save Error");
    } catch (ex) {
      this.toastr.error(
        ex && ex.message ? ex.message : "unknow error",
        "Save Error"
      );
    }
  }
  import(raw: string, first = false): boolean {
    try {
      if (!raw) {
        if (!first)
          setTimeout(() => this.toastr.error("No save foud", "Not Loaded"), 0);
        return false;
      }
      const json = LZString.decompressFromBase64(raw);
      const data = JSON.parse(json);
      if (!data.m) {
        setTimeout(
          () => this.toastr.error("Save is not valid", "Not Loaded"),
          0
        );
        return false;
      }
      // this.model = null;
      // this.model = new Model(
      //   this.toastr,
      //   this.achievementsEmitter,
      //   this.buyNodeEmitter,
      //   this.prestigeEmitter
      // );
      if (!!data.o) this.options.restore(data.o);
      // this.setTheme();
      this.last = data.time;
      this.game.restore(data.m);
      setTimeout(() => this.toastr.success("", "Game Loaded"), 0);
    } catch (ex) {
      setTimeout(
        () =>
          this.toastr.error(
            ex && ex.message ? ex.message : "unknow error",
            "Load Error"
          ),
        0
      );
    }
  }
  load(first = false) {
    try {
      this.import(localStorage.getItem("save"), first);
    } catch (ex) {
      setTimeout(
        () =>
          this.toastr.error(
            ex && ex.message ? ex.message : "unknow error",
            "Load Error"
          ),
        0
      );
    }
  }
  clear() {
    localStorage.removeItem("save");
    window.location.reload();
  }
}