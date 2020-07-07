import { Component, Inject } from '@angular/core';
import { ModalController, LoadingController, NavController } from '@ionic/angular';
// import { AppSettings } from './../../services/app-settings';
import { HomeService } from './../../services/home-service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Api } from 'src/app/services/api-service';
import { Ux } from 'src/app/services/ux-service';
import { AuthService } from 'src/app/services/auth-service';
import { AppComponent } from 'src/app/app.component';
import { Geofence } from '@ionic-native/geofence/ngx';

@Component({
  selector: 'app-configure-device',
  templateUrl: 'configure-device.page.html',
  styleUrls: ['configure-device.page.scss'],
  providers: [HomeService, Geofence]
})
export class ConfigureDevicePage {
  configureDeviceForm: FormGroup;
  item = {};
  // email:string='';
  // password:string='';
  // business_types:string[] = ['Software Development', 'Graphic Design', 'Arts', 'Music', 'Digital Marketing', 'Furniture & Fittings'];
  
  constructor(
    @Inject(AppComponent) private app: AppComponent,
    private homeService:HomeService, 
    private fb: FormBuilder,
    private api: Api,
    private ux: Ux,
    private auth: AuthService,
    private nav: NavController,
    private loading: LoadingController,
    private geofence: Geofence
    ) { 
      this.item = this.homeService.getData();
    
    this.configureDeviceForm = new FormGroup({
      name: new FormControl(),
      no: new FormControl(),
      email: new FormControl(),
      password: new FormControl(),
      loc_name: new FormControl(),
      loc_long: new FormControl(),
      loc_lat: new FormControl(),
      loc_address: new FormControl(),
      loc_radius: new FormControl()
   });

    // initialize the plugin
    geofence.initialize().then(
      // resolved promise does not return a value
      () => console.log('Geofence Plugin Ready'),
      (err) => console.log(err)
    )
  }

  ngOnInit() {
  }

  get email () {
    return this.configureDeviceForm.get('email');
  }
  get password () {
    return this.configureDeviceForm.get('password');
  }

  async configureDevice() {
    console.log('configureDevice called! configureDeviceForm:', this.configureDeviceForm.value);
    let staff = this.configureDeviceForm.value;
    let loader = await this.loading.create({
      message: 'Configuring your Device...',
    });
    loader.present();
    this.api.post('staff', { staff: staff })
      .subscribe(
        async (response: any) => {
          console.log('post:configureDevice response:', response);
          if(response) {
            if(response.status == "success") {
              this.ux.alert("Device configured successfully", "Success", "success");
              // signup verified?
              // let {user} = response;
                // this.auth.userLogin(user);
                // this.app.showSidebar = true;
                // this.app.setUser(user);
                // this.nav.navigateRoot(['/success']);
            } else {
              this.ux.alert(response.message, "Error!", "error");
            }
          } else {
            // this.ux.alert(AppSettings.API_EMPTY_RESPONSE_MESSAGE, "Error!", "error");
          }
        }, async error => {
          loader.dismiss();
          console.log('post:configureDevice error:', error);
          // this.ux.alert(AppSettings.API_HTTP_FAIL_MESSAGE, "Error!", "error");
        }, () => {
            console.log('post:configureDevice finished');
            loader.dismiss();
        }
      );
  }

  addGeofence() {
    //options describing geofence
    let fence = {
      id: '69ca1b88-6fbe-4e80-a4d4-ff4d3748acdb', //any unique ID
      latitude:       37.285951, //center of geofence radius
      longitude:      -121.936650,
      radius:         100, //radius to edge of geofence in meters
      transitionType: 3, //see 'Transition Types' below
      notification: { //notification settings
          id:             1, //any unique ID
          title:          'You crossed a fence', //notification title
          text:           'You just arrived to Gliwice city center.', //notification body
          openAppOnClick: true //open app when notification is tapped
      }
    }
  
    this.geofence.addOrUpdate(fence).then(
       () => console.log('Geofence added'),
       (err) => console.log('Geofence failed to add')
     );
  }
}
