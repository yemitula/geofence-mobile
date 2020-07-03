import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpService {

  constructor(private http: HttpClient) { }

  sendData(email: string) {
    let url = 'https://facebook.us14.list-manage.com/subscribe/post-json?u=2c0f7baa8dc004a62ff3922e3&id=456928d791&EMAIL='
    + encodeURI(email) + '&b_2c0f7baa8dc004a62ff3922e3_456928d791';
    return this.http.get(url);
  }
}