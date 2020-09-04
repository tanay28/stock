import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../__services/auth.service";
import { Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd/notification";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.css"],
})
export class RegistrationComponent implements OnInit {
  validateForm!: FormGroup;
  submitted = false;
  errorMsg = "";
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {
    this.errorMsg = "";
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phoneNo: [null, [Validators.required]],
      password: [null, [Validators.required]],
      rePassword: [null, [Validators.required]],
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

    if (this.fvalue.password.value != this.fvalue.rePassword.value) {
      this.errorMsg = "Mismatch Password..!!";
      this.notification.create("error", "Error", this.errorMsg);
      return;
    } else {
      let user = {
        name: this.fvalue.name.value,
        email: this.fvalue.email.value,
        phoneNo: this.fvalue.phoneNo.value,
        password: this.fvalue.password.value,
      };

      this.authService.register(user).subscribe(
        (res) => {
          if (res.status == "success") {
            this.notification.create(
              "success",
              "Congrats..!",
              "The registration successful."
            );
            this.router.navigate([""]);
          } else {
            this.notification.create(
              "success",
              "Congrats..!",
              "Something went wrong..!! Please try again."
            );
          }
        },
        (err) => {}
      );
    }
  }
}
