import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../__services/auth.service";
import { Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { first } from "rxjs/operators";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  submitted = false;
  errorMsg = "";
  authData: any;
  currentUser;
  returnUrl;
  isSpinning = false;
  status: string = "";
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {
    this.isSpinning = false;
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true],
    });
  }
  afterClose(): void {
    console.log("close");
  }
  get fvalue() {
    return this.validateForm.controls;
  }
  submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    this.submitted = true;
    if (this.validateForm.invalid) {
      this.errorMsg = "All fields are required..!!";
      return;
    }
    this.isSpinning = true;
    this.authService
      .login(this.fvalue.userName.value, this.fvalue.password.value)
      .pipe(first())
      .subscribe(
        async (data) => {
          console.log("data", data);
          this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
          const token = localStorage.getItem("token");
          this.isSpinning = false;
          this.returnUrl = "/system/dashboard";
          this.router.navigate([this.returnUrl]);
        },
        (err) => {
          this.isSpinning = false;
          if (err.status == "403") {
            this.notification.create(
              "error",
              "Wrong Credential",
              "Invalid Password..!!!"
            );
          } else if (err.status == "400") {
            this.notification.create(
              "error",
              "Wrong Credential",
              "Invalid Email..!!!"
            );
          }
        }
      );
  }
}
