import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SystemComponent } from "./system.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { UploadComponent } from "./upload/upload.component";

const routes: Routes = [
  {
    path: "",
    component: SystemComponent,
    children: [
      { path: "dashboard", component: DashboardComponent },
      { path: "upload", component: UploadComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule {}
