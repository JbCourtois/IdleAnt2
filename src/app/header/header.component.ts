import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { Router } from "@angular/router";
import { MainService } from "../main.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  @Input() lab = false;
  @Input() labBadge = false;

  @Input() travel = false;
  @Input() travelBadge = false;

  @Input() prestige = false;

  sub: any;
  headerClass = "header-6";
  timeModal = false;

  constructor(
    private router: Router,
    public ms: MainService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.sub = this.ms.options.headerEmitter.subscribe(() => {
      this.reloadHeader();
      this.cd.markForCheck();
    });
    this.reloadHeader();
    this.cd.markForCheck();
  }
  reloadHeader() {
    this.headerClass = "header-" + this.ms.options.header;
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  navigateLast() {
    this.router.navigateByUrl(this.ms.game.lastUnitUrl);
  }
  openTimeModal() {
    this.ms.game.actHour.reload();
    this.ms.game.actMin.reload();
    this.timeModal = true;
  }
}
