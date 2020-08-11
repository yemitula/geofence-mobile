import { Component, OnInit, Inject } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { NavController, LoadingController, NavParams, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from 'src/app/services/api-service';
import { Ux } from 'src/app/services/ux-service';
import { AppSettings } from 'src/app/services/app-settings';
import { ActivatedRoute } from '@angular/router';
import { DeviceLinker } from 'src/app/services/device-linker-service';
import { Geofence } from '@ionic-native/geofence/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';


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
    private geofence: Geofence,
    private geolocation: Geolocation
  ) {
    // initialize the plugin
    geofence.initialize().then(
      // resolved promise does not return a value
      () => console.log('Geofence Plugin Ready'),
      (err) => console.log(err)
    );

    // get current position
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log('current position', resp);
     }).catch((error) => {
       console.log('Error getting location', error);
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
            this.addGeofence(this.linkedStaff);
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

  private addGeofence(staff) {
    //options describing geofence
    let fence = {
      id: `${staff.stf_id}${staff.loc_id}${new Date().getTime()}`, //Unique ID - stf_id + loc_id + time 
      latitude:       parseFloat(staff.loc_lat), //center of geofence radius
      longitude:      parseFloat(staff.loc_long),
      radius:         parseInt(staff.loc_radius), //radius to edge of geofence in meters
      transitionType: 3, //see 'Transition Types' below
      notification: { //notification settings
          id:             1, //any unique ID
          title:          `Leaving Location`, //notification title
          text:           `You are leaving ${staff.loc_name}! Please confirm your exit.`, //notification body
          openAppOnClick: true //open app when notification is tapped
      }
    }
  
    this.geofence.addOrUpdate(fence).then(
       () => console.log('Geofence added'),
       (err) => console.log('Geofence failed to add', err)
     );
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
