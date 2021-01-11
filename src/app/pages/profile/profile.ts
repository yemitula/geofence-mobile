import { Component, OnInit, Inject } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

export interface Coords {
  lat: number,
  lng: number
}

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.html',
  styleUrls: ['profile.scss']
})
export class Profile implements OnInit {
  user: any = {};
  clickSub: any;

  constructor(
    @Inject(AppComponent) private app: AppComponent
  ) {
    this.user = this.app.user;
    console.log("user=",this.user);
  }

  ngOnInit() {  }

  unsub() {
    this.clickSub.unsubscribe();
  }
 
}
