import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { SystemRoutingModule } from "./system-routing.module";
import { SystemComponent } from "./system.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { NZ_I18N, en_US } from "ng-zorro-antd";
import en from "@angular/common/locales/en";
import { registerLocaleData } from "@angular/common";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzSpinModule } from "ng-zorro-antd/spin";
import { NzTableModule } from "ng-zorro-antd/table";
import { DemoNgZorroAntdModule } from "./ng-zorro-antd.module";
import { UploadComponent } from "./upload/upload.component";
import { NgxCsvParserModule } from "ngx-csv-parser";
import { DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
registerLocaleData(en);

@NgModule({
  declarations: [SystemComponent, DashboardComponent, UploadComponent],
  imports: [
    CommonModule,
    SystemRoutingModule,
    NgZorroAntdModule,
    NzButtonModule,
    NzDropDownModule,
    NzSpinModule,
    NzTableModule,
    DemoNgZorroAntdModule,
    NgxCsvParserModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, DatePipe],
})
export class SystemModule {}
