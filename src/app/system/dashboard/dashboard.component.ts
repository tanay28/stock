import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  listOfData: any[];
  constructor(private router: Router) {
    if (
      localStorage.getItem("currentUser") == null ||
      localStorage.getItem("currentUser") == undefined
    ) {
      this.router.navigate([""]);
    }
  }

  ngOnInit() {
    this.listOfData = [
      {
        key: "1",
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
      },
      {
        key: "2",
        name: "Jim Green",
        age: 42,
        address: "London No. 1 Lake Park",
      },
      {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
      },
    ];
  }
}
