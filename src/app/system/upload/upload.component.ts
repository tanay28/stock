import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxCsvParser } from "ngx-csv-parser";
import { NgxCSVParserError } from "ngx-csv-parser";
import { DatePipe } from "@angular/common";
import { DataServiceService } from "../../__services/data-service.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Subscription } from "rxjs";

interface DataItem {
  stockname: string;
  high: number;
  Low: number;
  open: number;
  close: number;
}

@Component({
  selector: "app-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.css"],
})
export class UploadComponent implements OnInit {
  @ViewChild("fileImportInput", { static: false }) fileImportInput: any;
  csvRecords: any = [];
  header = true;
  showData = false;
  isSpinning;
  searchValue = "";
  visible = false;
  dataInfo = [];
  constructor(
    private router: Router,
    private msg: NzMessageService,
    private ngxCsvParser: NgxCsvParser,
    private datepipe: DatePipe,
    private dataService: DataServiceService,
    private notification: NzNotificationService
  ) {
    if (
      localStorage.getItem("currentUser") == null ||
      localStorage.getItem("currentUser") == undefined
    ) {
      this.router.navigate([""]);
    }
  }

  ngOnInit() {
    this.showData = false;
    this.isSpinning = false;
    this.csvRecords = [];
    this.dataInfo = [];
  }

  fileChangeListener($event: any): void {
    // Select the files from the event

    this.isSpinning = true;
    const files = $event.srcElement.files;
    console.log("files", files[0].name);
    this.dataInfo = [];
    this.csvRecords = [];
    // Parse the file you want to select for the operation along with the configuration
    for (let j = 0; j < files.length; j++) {
      let name = files[j].name.split("-");
      let todt = name[10].split(".");
      var today = new Date();
      var currdate =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();

      let info = {
        stock: name[2],
        from: name[6] + "-" + name[5] + "-" + name[4],
        to: todt[0] + "-" + name[9] + "-" + name[8],
        createdAt: currdate,
        filename: name,
      };
      this.dataInfo.push(info);
      let handleSub: Subscription;
      handleSub = this.ngxCsvParser
        .parse(files[j], { header: this.header, delimiter: "," })
        .pipe()
        .subscribe(
          (result: Array<any>) => {
            this.isSpinning = false;
            let dt = this.datepipe.transform(
              Date.parse(result[0][0]),
              "yyyy-MM-dd"
            );
            for (let i = 0; i < result.length; i++) {
              let dt = this.datepipe.transform(
                Date.parse(result[i][0]),
                "yyyy-MM-dd"
              );
              var regex = /[+-]?\d+(?:\.\d+)?/g;
              var match;
              while ((match = regex.exec(result[i][2]))) {
                result[i][2] = match[0];
              }
              var match;
              while ((match = regex.exec(result[i][3]))) {
                result[i][3] = match[0];
              }
              var match;
              while ((match = regex.exec(result[i][4]))) {
                result[i][4] = match[0];
              }
              var match;
              while ((match = regex.exec(result[i][7]))) {
                result[i][7] = match[0];
              }

              let obj = {
                timestamp: dt,
                open: result[i][2],
                high: result[i][3],
                low: result[i][4],
                close: result[i][7],
                stockname: name[2].trimEnd(),
              };
              this.csvRecords.push(obj);
            }
          },
          (error: NgxCSVParserError) => {
            this.isSpinning = false;
            this.showData = false;
            console.log("Error", error);
          }
        );
    }
  }

  uploadData() {
    if (this.csvRecords.length == 0) {
      this.notification.create(
        "error",
        "Upload Message",
        "Please select a file first..!!!"
      );
      return;
    }
    this.isSpinning = true;
    this.dataService.saveData(this.csvRecords, this.dataInfo).subscribe(
      (res) => {
        if (res.status == "success") {
          this.fileImportInput.nativeElement.value = "";
          this.notification.create(
            "success",
            "Upload Message",
            "Data inserted successfully."
          );
          this.isSpinning = false;
          this.showData = true;
        }
      },
      (err) => {
        this.showData = false;
        this.isSpinning = false;
        if (err.status == "500") {
          console.log(err.error.err.sqlMessage);

          let msg = "";
          if (err.hasOwnProperty("error")) {
            let ms = err.error.err.sqlMessage.split(";");
            msg = ms[0];
          } else {
            msg = err.statusText;
          }
          this.notification.create("error", "Upload Message", msg);
        }
      }
    );
  }
}
