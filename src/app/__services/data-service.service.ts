import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { JsonPipe } from "@angular/common";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DataServiceService {
  constructor(private httpClient: HttpClient) {}

  saveData(sData, iData): any {
    let body = {
      sDatas: JSON.stringify(sData),
      iDatas: JSON.stringify(iData),
    };
    return this.httpClient
      .post<any>(`${environment.apiUrl}/v1/upload`, body)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
