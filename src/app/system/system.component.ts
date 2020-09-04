import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
@Component({
  selector: "app-system",
  templateUrl: "./system.component.html",
  styleUrls: ["./system.component.css"],
})
export class SystemComponent implements OnInit {
  isCollapsed = false;
  constructor(private router: Router) {
    if (
      localStorage.getItem("currentUser") == null ||
      localStorage.getItem("currentUser") == undefined
    ) {
      this.router.navigate([""]);
    }
  }

  ngOnInit() {}

  logout() {
    localStorage.clear();
    this.router.navigate([""]);
  }
}
