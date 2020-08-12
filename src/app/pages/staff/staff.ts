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


const config: BackgroundGeolocationConfig = {
  desiredAccuracy: 0,
  stationaryRadius: 20,
  distanceFilter: 10,
  debug: true,
  interval: 2000,
  startOnBoot: true,
  stopOnTerminate: false
};

@Component({
  selector: 'app-staff',
  templateUrl: 'staff.html',
  styleUrls: ['staff.scss']
})
export class Staff implements OnInit {
  customer: any = {};
  staff: any[] = [];
  all: any[] = [];
  sub: any;
  location: any = {};
  linkedStaff: any = {};
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
    private deviceLinker: DeviceLinker,
    private alertCtrl: AlertController,
    private backgroundGeolocation: BackgroundGeolocation,
    private geolocation: Geolocation,
    private localNotifications: LocalNotifications
  ) {

    this.backgroundGeolocation.configure(config)
      .then(() => {

        this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
          console.log('current postition from background geolocation', location);
          if (location.latitude && location.longitude) {
            let center = {
              lat: 6.6473,
              lng: 3.3594
            };
            let point = {
              lat: location.latitude,
              lng: location.longitude
            };
            if (this.pointWithinFence(point, center, 1)) {
              console.log("location within circle");
            } else {
              console.log("location OUTSIDE circle!!!")
            }
          }
        });

      });

    // start recording location
    this.backgroundGeolocation.start();

    // get current position
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log('current position', resp);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    //  watch location
    let watch = this.geolocation.watchPosition({
      enableHighAccuracy: true
    });
    watch.subscribe((data) => {
      // console.log('watch location changed:', data);
      if (data.coords) {
        let center = {
          lat: 6.6473,
          lng: 3.3594
        };
        let point = {
          lat: data.coords.latitude,
          lng: data.coords.longitude
        };
        // console.log("within circle:", this.pointWithinFence(point, center, 1));
      } else {
        console.log('no coords!');
      }
    });

    this.customer = this.app.user;
    this.route.queryParams
      .subscribe(params => {
        console.log("params=", params);
        this.sub = params;
      });
  }

  ngOnInit() {
    // if a loc is set, get the location
    if (this.sub.loc_id) {
      this.getLocation();
    }
    // load the staff 
    this.loadStaff();
    // get the linked staff 
    this.linkedStaff = this.deviceLinker.getLinkedStaff;
    console.log("linkedStaff in staff", this.linkedStaff);
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

  // check if a point is within a circular fence, radius is in km
  // https://stackoverflow.com/questions/24680247/check-if-a-latitude-and-longitude-is-within-a-circle-google-maps
  pointWithinFence(checkPoint, centerPoint, radius) {
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= radius;
  }

  async loadStaff() {
    console.log('loadStaff');
    let loader = await this.loading.create();
    loader.present();
    this.api.get('staff?loc_id=' + this.sub.loc_id || '')
      .subscribe(
        async (response: any) => {
          console.log('get:staff:', response);
          if (response) {
            if (response.status == "success") {
              this.all = response.staff;
              this.staff = [... this.all];
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

  async getLocation() {
    console.log('getLocation->loc_id', this.sub.loc_id);
    this.all = [];
    this.staff = [];
    let loader = await this.loading.create();
    loader.present();
    this.api.get('locations/' + this.sub.loc_id)
      .subscribe(
        async (response: any) => {
          console.log('get:locations:', response);
          if (response) {
            if (response.status == "success") {
              this.location = response.location;
            } else {
              this.ux.alert(response.message, "Error!", "error");
            }
          } else {
            this.ux.alert(AppSettings.API_EMPTY_RESPONSE_MESSAGE, "Error!", "error");
          }
        }, async error => {
          loader.dismiss();
          console.log('get:locations error:', error);
          this.ux.alert(AppSettings.API_HTTP_FAIL_MESSAGE, "Error!", "error");
        }, () => {
          console.log('get:locations finished');
          loader.dismiss();
        }
      );
  }

  async link(staff) {
    console.log("Staff -> link -> staff", staff);

    const alert = await this.alertCtrl.create({
      header: 'Confirm Linking',
      message: `Are you sure you want to Link ${staff.stf_name} to this device? This device will START watching this staff's geofence.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sure!',
          handler: () => {
            console.log('Confirm Okay');
            // link staff to this device
            this.deviceLinker.link(staff);
            this.linkedStaff = this.deviceLinker.getLinkedStaff;
            // TODO - start watching geofence for staff
            // success
            this.ux.toast(`${staff.stf_name} successfully LINKED to this Device!`);
          }
        }
      ]
    });

    await alert.present();
  }

  async unlink(staff) {
    console.log("Staff -> unlink -> staff", staff);

    const alert = await this.alertCtrl.create({
      header: 'Confirm Unlink',
      message: `Are you sure you want to Un-Link ${staff.stf_name} from this device? This device will STOP watching this staff's geofence.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sure!',
          handler: () => {
            console.log('Confirm Okay');
            // link staff to this device
            this.deviceLinker.unlink();
            this.linkedStaff = this.deviceLinker.getLinkedStaff;
            // TODO - stop watching geofence
            // success
            this.ux.toast(`${staff.stf_name} successfully UNLINKED from this Device!`);
          }
        }
      ]
    });

    await alert.present();
  }

  filterList(event) {
    console.log('filterList->event', event);
    const query = event.detail.value.toLowerCase();

    // filter our data
    const filtered = this.all.filter(function (obj) {
      return obj.stf_name.toLowerCase().indexOf(query) !== -1 || obj.stf_email.toLowerCase().indexOf(query) !== -1 || obj.stf_no.toLowerCase().indexOf(query) !== -1 || !query;
    });

    // update the rows
    this.staff = filtered;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }
}
