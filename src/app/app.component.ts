import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  navLinks: any[];
  activeLinkIndex = -1;
  constructor(
    private translate: TranslateService,
    private titleService: Title,
    private router: Router
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang("en");

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use("en");

    // Set application title
    this.setTitle("Addo & Labs");
    this.navLinks = [
      {
        label: "Addos Reporting Status",
        link: "./facilities",
        index: 0,
      },
      {
        label: "SMS Automation",
        link: "./performancesms",
        index: 1,
      },
    ];
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
  ngOnInit(): void {
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(
        this.navLinks.find((tab) => tab.link === "." + this.router.url)
      );
    });
  }
}
