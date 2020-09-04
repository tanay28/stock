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
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false); // {1}
  private roleId = new BehaviorSubject<number>(0);
  currentUser;
  token: any;
  user_role_id;
  isExpired: false;
  constructor(private httpClient: HttpClient) {}

  register(data: any) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/register`, data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  login(username: string, password: string): any {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/authenticate`, {
        username: username,
        password: password,
      })
      .pipe(
        map(async (user) => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            //console.log(user.token)

            const helper = new JwtHelperService();

            const decodedToken = helper.decodeToken(user.token);
            const decodedRefreshedToken = helper.decodeToken(user.refreshtoken);

            //console.log(decodedToken);

            // Other functions
            const expirationDate = helper.getTokenExpirationDate(user.token);
            const isExpired = helper.isTokenExpired(user.token);

            // console.log('expirationDate',expirationDate);
            // console.log('isExpired',isExpired);

            localStorage.setItem("currentUser", JSON.stringify(decodedToken));
            localStorage.setItem("token", user.token);
            localStorage.setItem("refreshtoken", user.refreshtoken);

            this.loggedIn.next(true);

            // store user details and jwt token in local storage to keep user logged in between page refreshes
          }
          return user;
        })
      );
  }
}
