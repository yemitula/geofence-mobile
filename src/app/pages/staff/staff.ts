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
import { Device } from '@ionic-native/device/ngx';

export interface Coords {
  lat: number,
  lng: number
}

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
  position: Coords;
  center: Coords = {
    lat: 6.6473,
    lng: 3.3594
  };
  deviceId: string;
  logIntervalId: any;
  fenceExit: any;

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
    private localNotifications: LocalNotifications,
    private device: Device
  ) {

    this.customer = this.app.user;
    this.route.queryParams
      .subscribe(params => {
        console.log("params=", params);
        this.sub = params;
      });
    
      this.deviceId = this.device.uuid;
      console.log('Device ID:', this.deviceId);
  }

  ngOnInit() {
    
  }
 
  ionViewWillEnter() {

    // get current location
    this.setCurrentPosition();
    // if a loc is set, get the location
    if (this.sub.loc_id) {
      this.getLocation();
    }
    // load the staff list
    this.loadStaff();
  }

  setCurrentPosition() {
    console.log("Staff -> setCurrentPosition");
    // get current position
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
      console.log('current position', resp);
      this.position = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      // get the linked staff 
      this.linkedStaff = this.deviceLinker.getLinkedStaff;
      console.log("linkedStaff in staff", this.linkedStaff);
      // if staff is linked
      if(this.deviceLinker.isDeviceLinked) {
        this.initBgGeolocation();
      }
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  initBgGeolocation() {
    console.log("initBgGeolocation -> initBgGeolocation");
    
    // background geolocation
    this.backgroundGeolocation.configure(config)
      .then(() => {
        this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
          console.log('current position from background geolocation', location);
          if (location.latitude && location.longitude) {
            let newPosition = {
              lat: location.latitude,
              lng: location.longitude
            };
            // have we recorded a position at all?
            if (this.position && this.position.lat && this.position.lng) {
              let newPositionWithinFence = this.pointWithinFence(newPosition, this.center, +this.linkedStaff.loc_radius);
              let oldPositionWithinFence = this.pointWithinFence(this.position, this.center, +this.linkedStaff.loc_radius);
              if (newPositionWithinFence) {
                console.log("position within fence");
                // was previous position outside the fence?
                if (!oldPositionWithinFence) {
                  // Entering fence
                  // Alert that staff is back in the fence and carry out necessary actions
                  // this.ux.alert("You have ENTERED the fence!");
                  this.stopLocationLogging();
                } else {
                  this.ux.toast(`You are within the fence - ${this.distanceFromCenter(newPosition, this.center)}km from center`);
                }
              } else {
                console.log("position OUTSIDE fence!!!");
                // was previous position within fence?
                if (oldPositionWithinFence) {
                  // Exiting fence
                  // Alert that staff is leaving the fence and carry out necessary actions
                  // this.ux.alert("You have EXITED the fence!");
                  this.promptForExit();
                } else {
                  this.ux.toast("You are NOT within the fence");
                }
              }
            }
            // store the new position
            this.position = newPosition;
          }
        });
      });

    // start recording location
    this.backgroundGeolocation.start();
  }

  async promptForExit() {
    const alert = await this.alertCtrl.create({
      header: 'Exiting the fence? Please provide safecode!',
      inputs: [
        {
          name: 'safeCode',
          type: 'password',
          placeholder: '******'
        }
      ],
      buttons: [
        {
          text: 'Submit',
          handler: (data) => {
            console.log('Submit clicked with data:', data);
            if (data.safeCode) {
              this.handleSafeCode(data.safeCode);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async handleSafeCode(safeCode) {
    console.log("handleSafeCode -> safeCode", safeCode);
    // check if the safeCode is correct
    if(safeCode) {
      // create exit object
      let fenceExit = {
        fex_staff_id: this.linkedStaff.stf_id,
        fex_location_id: this.linkedStaff.loc_id,
        fex_lat: this.linkedStaff.loc_lat,
        fex_long: this.linkedStaff.loc_long,
        fex_code_expected: this.linkedStaff.stf_safety_code,
        fex_code_supplied: safeCode,
        fex_is_safe: safeCode === this.linkedStaff.stf_safety_code ? 1 : 0
      };
      // create the exit object in the api
      let loader = await this.loading.create();
      loader.present();
      let endpoint = `exits`;
      this.api.post(endpoint, { fence_exit: fenceExit })
        .subscribe(
          async (response: any) => {
            loader.dismiss();
            console.log("post " + endpoint, response);
            if (response.status == 'success') {
              this.fenceExit = { fex_id: response.fex_id, ...fenceExit };
              console.log("fenceExit after post:", this.fenceExit);
              // show success toast
              this.ux.toast(response.message);
              // set log interval
              this.setLocationLog(fenceExit.fex_is_safe);
            } else {
              // show error
              this.ux.toast(response.message);
            }
          },
          error => {
            loader.dismiss();
            console.log("Server Error:", error);
          }
        );
    }
  }

  setLocationLog(isSafe) {
    let logInterval = 60000;
    if(isSafe === 1) {
      logInterval = 900000;
    }
    // start logging the location 
    this.logIntervalId = setInterval(() => {
      this.logExitLocation();
    }, logInterval);
  }

  stopLocationLogging() {
    console.log("stopLocationLogging");
    // stop logging
    clearInterval(this.logIntervalId);
    // get the current position
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
      console.log('current position', resp);
      let movement = {
        mov_exit_id: this.fenceExit.fex_id,
        mov_lat: resp.coords.latitude,
        mov_long: resp.coords.longitude
      }
      // silently post the location on api
      let endpoint = `movements?stop=yes`;
      this.api.post(endpoint, { movement: movement })
        .subscribe(
          async (response: any) => {
            console.log("post " + endpoint, response);
          },
          error => {
            console.log("Server Error:", error);
          }
        );
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  async logExitLocation() {
    console.log("logExitLocation -> logExitLocation");
    // get current location
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
      console.log('current position', resp);
      let movement = {
        mov_exit_id: this.fenceExit.fex_id,
        mov_lat: resp.coords.latitude,
        mov_long: resp.coords.longitude
      }
      // silently post the location on api
      let endpoint = `movements`;
      this.api.post(endpoint, { movement: movement })
        .subscribe(
          async (response: any) => {
            console.log("post " + endpoint, response);
          },
          error => {
            console.log("Server Error:", error);
          }
        );
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    
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
    console.log("pointWithinFence -> checkPoint, centerPoint, radius", checkPoint, centerPoint, radius);
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= radius;
  }

  distanceFromCenter(checkPoint, centerPoint) {
    console.log("distanceFromCenter -> checkPoint, centerPoint, radius", checkPoint, centerPoint);
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return (Math.sqrt(dx * dx + dy * dy)).toFixed(2);
  }

  async loadStaff() {
    console.log('loadStaff -> loc_id', this.sub.loc_id);
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
              // set center of fence
              this.center = {
                lat: +this.location.loc_lat,
                lng: +this.location.loc_long
              };
              // this.initBgGeolocation();
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

  async onDelete(id: string) {
    console.log('onDelete called with id:', id);
    if (confirm("Are you sure you want to delete this Staff?")) {
      this.api.delete('/staff/' + id)
        .subscribe(
          async (response: any) => {
            console.log("delete department:", response);
            if (response.status == 'success') {
              // remove from list
              this.loadStaff();
              // show success toast
              this.ux.alert(response.message, "Success!", "success");
            } else {
              // show error
              this.ux.alert(response.message, "Error!", "error");
            }
          },
          error => {
            console.log("Server Error:", error);
          }
        );
    }
  }

  async updateStaff(staff) {
    console.log("updateStaff -> staff", staff);
    let endpoint = `/staff/${staff.stf_id}`;
    this.api.put(endpoint, { staff: staff })
      .subscribe(
        async (response: any) => {
          console.log("put staff:", response);
          if (response.status == 'success') {
            // show success toast
            this.ux.toast(response.message);
          } else {
            // show error
            this.ux.alert(response.message, "Error!", "error");
          }
        },
        error => {
          console.log("Server Error:", error);
        }
      );
  }

  async link(staff) {
    console.log("Staff -> link -> staff", staff);

    if(this.pointWithinFence(this.position, this.center, +staff.loc_radius)) {
      // point is within fence, proceed
      const alert = await this.alertCtrl.create({
        header: 'Confirm Linking',
        message: `Are you sure you want to Link ${staff.stf_name} to this device? This device will START tracking this staff's location.`,
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
              this.initBgGeolocation();
              // success
              this.ux.toast(`${staff.stf_name} successfully LINKED to this Device!`);
              // update staff with device id
              staff.stf_device_id = this.deviceId;
              this.updateStaff(staff);
            }
          }
        ]
      });
  
      await alert.present();
    } else {
      // point not within fence
      this.ux.alert("You must be at this Location to link this device!");
      return false;
    }

    
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
            this.backgroundGeolocation.stop();
            // success
            this.ux.toast(`${staff.stf_name} successfully UNLINKED from this Device!`);
            // update staff with device id
            staff.stf_device_id = '';
            this.updateStaff(staff);
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
