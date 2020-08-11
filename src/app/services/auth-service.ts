import { Injectable } from '@angular/core';

@Injectable(/* {
  providedIn: 'root'
} */)

export class AuthService {
  user: any;
  isAuthenticated: boolean = false;
  usertype: string;
  constructor(
    
    ) { }

  userLogin(user: any) {
    localStorage.setItem('geofence_mobile_user', JSON.stringify(user));
    this.user = user;
  }

  public get getUser() : any {
    if (this.user = localStorage.getItem('geofence_mobile_user')) {
        return JSON.parse(this.user);
    } else {
      return false;
    }
  }

  public get loggedIn() : boolean {
    if (this.user = localStorage.getItem('geofence_mobile_user')) {  
      const user = JSON.parse(localStorage.getItem('geofence_mobile_user'));
      return user.token !== null;
    } else {
      return false;
    }
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('geofence_mobile_user');
      this.isAuthenticated = false;
      this.user = null;
  }

  setUserType(usertype: string) {
    localStorage.setItem('usertype', usertype);
    this.usertype = usertype;
  }

  public get getUserType() : any {
    if (this.usertype = localStorage.getItem('usertype')) {
        return this.usertype;
    } else {
      return false;
    }
  }

  clearUserType() {
      // remove usertype from local storage to log user out
      localStorage.removeItem('usertype');
      this.usertype = null;
  }
}