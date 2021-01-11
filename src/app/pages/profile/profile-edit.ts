import { Component, Inject } from '@angular/core';
import { ModalController, LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
// import { AppSettings } from './../../services/app-settings';
import { HomeService } from './../../services/home-service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Api } from 'src/app/services/api-service';
import { Ux } from 'src/app/services/ux-service';
import { AuthService } from 'src/app/services/auth-service';
import { AppComponent } from 'src/app/app.component';
import { Geofence } from '@ionic-native/geofence/ngx';

@Component({
  selector: 'app-profile-edit',
  templateUrl: 'profile-edit.html',
  styleUrls: ['profile.scss'],
  providers: [HomeService, Geofence]
})
export class ProfileEdit {
  changePasswordForm: FormGroup;
  item = {};
  staff:any={};
  id:any;
  locations: any[] = [];

  constructor(
    @Inject(AppComponent) private app: AppComponent,
		private activatedRoute: ActivatedRoute,
    private homeService:HomeService, 
    // private fb: FormBuilder,
    private api: Api,
    private ux: Ux,
    // private auth: AuthService,
    private nav: NavController,
    private loading: LoadingController,
    // private geofence: Geofence
    ) { 
      this.item = this.homeService.getData();
    
    this.changePasswordForm = new FormGroup({
      // id: this.id,
      current: new FormControl(),
      new: new FormControl(),
      retype: new FormControl()
   });
  }

  ngOnInit() {
    // this.loadLocations();
    //     this.staff.title = 'Add';
        const routeSubscription =  this.activatedRoute.params.subscribe(params => {
          console.log("params=",params);
			if (params.id) {
        this.id=params.id;
			}
		});
		// this.subscriptions.push(routeSubscription);
  }

  // get email () {
  //   return this.changePasswordForm.get('email');
  // }
  // get password () {
  //   return this.changePasswordForm.get('password');
  // }

  // async loadLocations() {
  //   // let loader = await this.loading.create();
  //   // loader.present();
  //   this.api.get('/locations')
  //     .subscribe(
  //       async (response: any) => {
  //         console.log('get:/locations response:', response);
  //         if(response) {
  //           if(response.status == "success") {
  //             this.locations = response.locations;
  //             // this.selectCategory(this.cat_id);
  //           } else {
  //             // this.ux.alert(response.message, "Error!", "error");
  //           }
  //         } else {
  //           // this.ux.alert(AppSettings.API_EMPTY_RESPONSE_MESSAGE, "Error!", "error");
  //         }
  //       }, async error => {
  //         // loader.dismiss();
  //         console.log('get:/locations error:', error);
  //         // this.ux.alert(AppSettings.API_HTTP_FAIL_MESSAGE, "Error!", "error");
  //       }, () => {
  //           console.log('get:/locations finished');
  //           // loader.dismiss();
  //       }
  //     );
  // }

  // async loadStaff(id) {
  //   this.api.get('/staff/'+id)
  //     .subscribe(
  //       async (response: any) => {
  //         console.log('get:/staff response:', response);
  //         console.log('staffEditForm:', this.staffEditForm);
  //         if(response) {
  //           if(response.status == "success") {
  //             this.staff = response.staff;
	// 		      	this.staffEditForm.controls.id.setValue(this.staff.stf_id);
	// 		      	this.staffEditForm.controls.name.setValue(this.staff.stf_name);
	// 		      	this.staffEditForm.controls.no.setValue(this.staff.stf_no);
	// 		      	this.staffEditForm.controls.email.setValue(this.staff.stf_email);
	// 		      	this.staffEditForm.controls.password.setValue(this.staff.stf_password);
	// 		      	this.staffEditForm.controls.loc_id.setValue(this.staff.stf_location_id);
  //           } else {
  //             this.ux.alert(response.message, "Error!", "error");
  //           }
  //         } else {
  //           // this.ux.alert(AppSettings.API_EMPTY_RESPONSE_MESSAGE, "Error!", "error");
  //         }
  //       }, async error => {
  //         // loader.dismiss();
  //         // console.log('get:/locations error:', error);
  //         // this.ux.alert(AppSettings.API_HTTP_FAIL_MESSAGE, "Error!", "error");
  //       }, () => {
  //           // console.log('get:/locations finished');
  //           // loader.dismiss();
  //       }
  //     );
  // }

  async changePassword() {
    console.log('changePassword called!:', this.changePasswordForm.value);
    let password = this.changePasswordForm.value;
    if (password.new != password.retype) {
      this.ux.alert('New password does not match. Please retype.', "Error", "warning");
      return false;
    }
      let loader = await this.loading.create({
        message: 'Updating Password...',
      });
      password.user_id= this.id;
      loader.present();
    this.api.post('changePassword', { password: password })
      .subscribe(
        async (response: any) => {
          console.log('post:changePassword response:', response);
          if(response) {
            if(response.status == "success") {
              this.ux.alert("Password Updated successfully", "Success", "success");
              this.nav.pop();
            } else {
              this.ux.alert(response.message, "Error!", "error");
            }
          } else {
            // this.ux.alert(AppSettings.API_EMPTY_RESPONSE_MESSAGE, "Error!", "error");
          }
        }, async error => {
          loader.dismiss();
          console.log('post:changePassword error:', error);
          // this.ux.alert(AppSettings.API_HTTP_FAIL_MESSAGE, "Error!", "error");
        }, () => {
            console.log('post:changePassword finished');
            loader.dismiss();
        }
      );
    
  }

  // private addGeofence() {
  //   //options describing geofence
  //   let fence = {
  //     id: '69ca1b88-6fbe-4e80-a4d4-ff4d3748acdb', //any unique ID
  //     latitude:       37.285951, //center of geofence radius
  //     longitude:      -121.936650,
  //     radius:         100, //radius to edge of geofence in meters
  //     transitionType: 3, //see 'Transition Types' below
  //     notification: { //notification settings
  //         id:             1, //any unique ID
  //         title:          'You crossed a fence', //notification title
  //         text:           'You just arrived to Gliwice city center.', //notification body
  //         openAppOnClick: true //open app when notification is tapped
  //     }
  //   }
  
  //   this.geofence.addOrUpdate(fence).then(
  //      () => console.log('Geofence added'),
  //      (err) => console.log('Geofence failed to add')
  //    );
  // }
}
