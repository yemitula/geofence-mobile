import { Component, Inject } from '@angular/core';
import { ModalController, LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
// import { AppSettings } from './../../services/app-settings';
import { HomeService } from '../../services/home-service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Api } from 'src/app/services/api-service';
import { Ux } from 'src/app/services/ux-service';
import { AuthService } from 'src/app/services/auth-service';
import { AppComponent } from 'src/app/app.component';
import { Geofence } from '@ionic-native/geofence/ngx';

@Component({
  selector: 'app-locations-edit',
  templateUrl: 'locations-edit.html',
  styleUrls: ['locations.scss'],
  providers: [HomeService, Geofence]
})
export class LocationsEdit {
  locationEditForm: FormGroup;
  item = {};
  location:any={};
  id:any;
  // locations: any[] = [];

  constructor(
    @Inject(AppComponent) private app: AppComponent,
		private activatedRoute: ActivatedRoute,
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
    
    this.locationEditForm = new FormGroup({
      loc_id: new FormControl(),
      loc_name: new FormControl(),
      loc_address: new FormControl(),
      loc_radius: new FormControl(),
      loc_lat: new FormControl(),
      loc_long: new FormControl()
   });
  }

  ngOnInit() {
    // this.loadLocations();
        this.location.title = 'Add';
        const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			this.id = params.id;
			if (this.id) {
        this.loadLocation(this.id);
        this.location.title = 'Edit';
        console.log('title=',this.location);
			}
		});
		// this.subscriptions.push(routeSubscription);
  }

  // get email () {
  //   return this.locationEditForm.get('email');
  // }
  // get password () {
  //   return this.locationEditForm.get('password');
  // }

  async loadLocation(id) {
    this.api.get('/locations/'+id)
      .subscribe(
        async (response: any) => {
          console.log('get:/locations response:', response);
          console.log('locationEditForm:', this.locationEditForm);
          if(response) {
            if(response.status == "success") {
              this.location = response.location;
			      	this.locationEditForm.controls.loc_id.setValue(this.location.loc_id);
			      	this.locationEditForm.controls.loc_name.setValue(this.location.loc_name);
			      	this.locationEditForm.controls.loc_address.setValue(this.location.loc_address);
			      	this.locationEditForm.controls.loc_radius.setValue(this.location.loc_radius);
			      	this.locationEditForm.controls.loc_lat.setValue(this.location.loc_lat);
              this.locationEditForm.controls.loc_long.setValue(this.location.loc_long);
            } else {
              this.ux.alert(response.message, "Error!", "error");
            }
          } else {
            // this.ux.alert(AppSettings.API_EMPTY_RESPONSE_MESSAGE, "Error!", "error");
          }
        }, async error => {
          // loader.dismiss();
          // console.log('get:/locations error:', error);
          // this.ux.alert(AppSettings.API_HTTP_FAIL_MESSAGE, "Error!", "error");
        }, () => {
            // console.log('get:/locations finished');
            // loader.dismiss();
        }
      );
  }

  async locationEdit() {
    console.log('locationEditForm:', this.locationEditForm);
    console.log('locationEdit called!:', this.locationEditForm.value);
    let location = this.locationEditForm.value;
    if(this.id){
      let loader = await this.loading.create({
        message: 'Updating Location...',
      });
      loader.present();
      // location.loc_id=this.id;
      this.api.put('locations', { location: location })
      .subscribe(
        async (response: any) => {
          console.log('put:locationEdit response:', response);
          if(response) {
            if(response.status == "success") {
              this.ux.alert("Location Updated successfully", "Success", "success");
              // this.nav.pop();
            } else {
              this.ux.alert(response.message, "Error!", "error");
            }
          } else {
            // this.ux.alert(AppSettings.API_EMPTY_RESPONSE_MESSAGE, "Error!", "error");
          }
        }, async error => {
          loader.dismiss();
          console.log('put:locationEdit error:', error);
          // this.ux.alert(AppSettings.API_HTTP_FAIL_MESSAGE, "Error!", "error");
        }, () => {
            console.log('put:locationEdit finished');
            loader.dismiss();
        }
      );
    }else{
      let loader = await this.loading.create({
        message: 'Adding Location...',
      });
      loader.present();
    this.api.post('locations', { location: location })
      .subscribe(
        async (response: any) => {
          console.log('post:locationEdit response:', response);
          if(response) {
            if(response.status == "success") {
              this.ux.alert("Location Added successfully", "Success", "success");
              this.nav.pop();
            } else {
              this.ux.alert(response.message, "Error!", "error");
            }
          } else {
            // this.ux.alert(AppSettings.API_EMPTY_RESPONSE_MESSAGE, "Error!", "error");
          }
        }, async error => {
          loader.dismiss();
          console.log('post:locationEdit error:', error);
          // this.ux.alert(AppSettings.API_HTTP_FAIL_MESSAGE, "Error!", "error");
        }, () => {
            console.log('post:locationEdit finished');
            loader.dismiss();
        }
      );
    }
  }
}
