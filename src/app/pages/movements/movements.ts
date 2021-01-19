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
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';

@Component({
  selector: 'app-movements',
  templateUrl: 'movements.html',
  styleUrls: ['movements.scss']
})
export class Movements implements OnInit {
  customer: any = {};
  movements: any[] = [];
  all: any[] = [];
  sub: any;
  // exit: any = {};
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
    private localNotifications: LocalNotifications,
    private launchNavigator: LaunchNavigator
  ) {

    this.customer = this.app.user;
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log("params=", params);
        this.sub = params;
        // if a staff is set, get the staff
        // if (this.sub.stf_id) {
          // this.getStaff();
        // }
      });
    
    // load the staff 
    this.loadMovements();
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

  async loadMovements() {
    console.log('loadMovements');
    let loader = await this.loading.create();
    loader.present();
    this.api.get('movements?fex_id=' + this.sub.fex_id || '')
      .subscribe(
        async (response: any) => {
          console.log('get:movements:', response);
          if (response) {
            if (response.status == "success") {
              this.all = response.movements;
              this.movements = [... this.all];
            } else {
              this.ux.alert(response.message, "Error!", "error");
            }
          } else {
            this.ux.alert(AppSettings.API_EMPTY_RESPONSE_MESSAGE, "Error!", "error");
          }
        }, async error => {
          loader.dismiss();
          console.log('get:movements error:', error);
          this.ux.alert(AppSettings.API_HTTP_FAIL_MESSAGE, "Error!", "error");
        }, () => {
          console.log('get:movements finished');
          loader.dismiss();
        }
      );
  }

  // async getStaff() {
  //   console.log('getStaff->stf_id', this.sub.stf_id);
  //   this.all = [];
  //   this.movements = [];
  //   let loader = await this.loading.create();
  //   loader.present();
  //   this.api.get('staff/' + this.sub.stf_id)
  //     .subscribe(
  //       async (response: any) => {
  //         console.log('get:staff:', response);
  //         if (response) {
  //           if (response.status == "success") {
  //             this.exit = response.exit;
  //           } else {
  //             this.ux.alert(response.message, "Error!", "error");
  //           }
  //         } else {
  //           this.ux.alert(AppSettings.API_EMPTY_RESPONSE_MESSAGE, "Error!", "error");
  //         }
  //       }, async error => {
  //         loader.dismiss();
  //         console.log('get:staff error:', error);
  //         this.ux.alert(AppSettings.API_HTTP_FAIL_MESSAGE, "Error!", "error");
  //       }, () => {
  //         console.log('get:staff finished');
  //         loader.dismiss();
  //       }
  //     );
  // }

  filterList(event) {
    console.log('filterList->event', event);
    const query = event.detail.value.toLowerCase();

    // filter our data
    const filtered = this.all.filter(function (obj) {
      return obj.stf_name.toLowerCase().indexOf(query) !== -1 || obj.mov_lat.toLowerCase().indexOf(query) !== -1 || obj.mov_lat.toLowerCase().indexOf(query) !== -1 || !query;
    });

    // update the rows
    this.movements = filtered;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

  async showMap(lat, long) {
    console.log('showMap', lat, long);
    
    this.launchNavigator.navigate([+lat, +long], {
      app: this.launchNavigator.APP.GOOGLE_MAPS
    });
  }
}
