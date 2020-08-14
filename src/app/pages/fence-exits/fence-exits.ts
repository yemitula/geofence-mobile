import { Component, OnInit, Inject } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { NavController, LoadingController, NavParams, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from 'src/app/services/api-service';
import { Ux } from 'src/app/services/ux-service';
import { AppSettings } from 'src/app/services/app-settings';
import { ActivatedRoute } from '@angular/router';
import { DeviceLinker } from 'src/app/services/device-linker-service';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocalNotifications, ILocalNotificationActionType } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-fence-exits',
  templateUrl: 'fence-exits.html',
  styleUrls: ['fence-exits.scss']
})
export class FenceExits implements OnInit {
  customer: any = {};
  exits: any[] = [];
  all: any[] = [];
  sub: any;
  staff: any = {};
  query: string;
  clickSub: any;

  constructor(
    @Inject(AppComponent) private app: AppComponent,
    private nav: NavController,
    private fb: FormBuilder,
    private loading: LoadingController,
    private api: Api,
    private ux: Ux,
    private route: ActivatedRoute,
    private geolocation: Geolocation,
    private localNotifications: LocalNotifications
  ) {

    this.customer = this.app.user;
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log("params=", params);
        this.sub = params;
        // if a staff is set, get the staff
        if (this.sub.stf_id) {
          this.getStaff();
        }
      });
    
    // load the staff 
    this.loadFenceExits();
  }

  unsub() {
    this.clickSub.unsubscribe();
  }

  showTestNotification() {
    this.clickSub = this.localNotifications.on('click').subscribe(data => {
      console.log("data from notification", data);
      this.ux.alert("Notification clicked!");
      this.unsub();
    });
    // Schedule a single notification
    this.localNotifications.schedule({
      id: 1,
      title: 'Testing Notification',
      text: 'Please tap to enter anything you like',
      foreground: true,
      launch: true,
      vibrate: true,
      // sticky: true,
      data: { secret: 'X121212121' }
    });
  }

  async loadFenceExits() {
    console.log('loadFenceExits');
    let loader = await this.loading.create();
    loader.present();
    this.api.get('exits?stf_id=' + this.sub.stf_id || '')
      .subscribe(
        async (response: any) => {
          console.log('get:exits:', response);
          if (response) {
            if (response.status == "success") {
              this.all = response.exits;
              this.exits = [... this.all];
            } else {
              this.ux.alert(response.message, "Error!", "error");
            }
          } else {
            this.ux.alert(AppSettings.API_EMPTY_RESPONSE_MESSAGE, "Error!", "error");
          }
        }, async error => {
          loader.dismiss();
          console.log('get:exits error:', error);
          this.ux.alert(AppSettings.API_HTTP_FAIL_MESSAGE, "Error!", "error");
        }, () => {
          console.log('get:exits finished');
          loader.dismiss();
        }
      );
  }

  async getStaff() {
    console.log('getStaff->stf_id', this.sub.stf_id);
    this.all = [];
    this.exits = [];
    let loader = await this.loading.create();
    loader.present();
    this.api.get('staff/' + this.sub.stf_id)
      .subscribe(
        async (response: any) => {
          console.log('get:staff:', response);
          if (response) {
            if (response.status == "success") {
              this.staff = response.staff;
            } else {
              this.ux.alert(response.message, "Error!", "error");
            }
          } else {
            this.ux.alert(AppSettings.API_EMPTY_RESPONSE_MESSAGE, "Error!", "error");
          }
        }, async error => {
          loader.dismiss();
          console.log('get:staff error:', error);
          this.ux.alert(AppSettings.API_HTTP_FAIL_MESSAGE, "Error!", "error");
        }, () => {
          console.log('get:staff finished');
          loader.dismiss();
        }
      );
  }

  filterList(event) {
    console.log('filterList->event', event);
    const query = event.detail.value.toLowerCase();

    // filter our data
    const filtered = this.all.filter(function (obj) {
      return obj.stf_name.toLowerCase().indexOf(query) !== -1 || obj.loc_address.toLowerCase().indexOf(query) !== -1 || !query;
    });

    // update the rows
    this.exits = filtered;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }
}
