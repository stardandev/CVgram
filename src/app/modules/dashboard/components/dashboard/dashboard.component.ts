import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd, NavigationStart, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {

  showUserControls: boolean = true;
  constructor(
    private router: Router,
    private route:ActivatedRoute
  ) { }

  ngOnInit() {
    let url = window.location.href;
    this.determineControlsVisiblity(url);
    this.router.events.subscribe(res => {
      if (res instanceof NavigationEnd) {
        this.determineControlsVisiblity(res.url);
      }
    })
  }

  determineControlsVisiblity(url) {
    if (
      url.includes('email-operations') ||
      url.includes('cover-letter-operations') ||
      url.includes('resume-operations') ||
      url.includes('design-template')  ||
      url.includes('cover-letter-design')
    ) {
      this.showUserControls = false;
    } else {
      this.showUserControls = true;
    }
  }


  navigateToDashboard() {
    switch (this.router.url) {
        case '/dashboard/cover-letter-operations':
          this.router.navigate(['/dashboard/cover-letter'])
        break;
        case '/dashboard/email-operations':
          this.router.navigate(['/dashboard/email-letter'])
        break;
        case '/dashboard/resume-operations':
          this.router.navigate(['/dashboard/cv'])
        break;
        default:
          this.router.navigate(['/dashboard/cv'])
        break;
    }
  }

}
