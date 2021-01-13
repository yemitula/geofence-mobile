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
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-fence-exits-detail',
  templateUrl: 'fence-exits-detail.html',
  styleUrls: ['fence-exits.scss']
})
export class FenceExitsDetail implements OnInit {
  // customer: any = {};
  exit: any[] = [];
  all: any[] = [];
  sub: any;
  staff: any = {};
  query: string;
  id : string;
  clickSub: any;
  appp: any;

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
    public platform:Platform,
    private launchNavigator: LaunchNavigator
  ) {

    // this.customer = this.app.user;
  }

  ngOnInit() {
    // get id from route if set
    this.sub = this.route
        .paramMap
        .subscribe(pmap => {
          this.id = pmap['params']['id'] || null;
          if(this.id) {
            //get exit
            this.loadFenceExit(this.id);
          }
        });
  }

  async loadFenceExit(id) {
    console.log('loadFenceExit');
    let loader = await this.loading.create();
    loader.present();
    this.api.get('exits/' + id)
      .subscribe(
        async (response: any) => {
          console.log('get:exit:', response);
          if (response) {
            if (response.status == "success") {
              this.exit = response.exit;
              // this.exit = [... this.all];
            } else {
              this.ux.alert(response.message, "Error!", "error");
            }
          } else {
            this.ux.alert(AppSettings.API_EMPTY_RESPONSE_MESSAGE, "Error!", "error");
          }
        }, async error => {
          loader.dismiss();
          console.log('get:exit error:', error);
          this.ux.alert(AppSettings.API_HTTP_FAIL_MESSAGE, "Error!", "error");
        }, () => {
          console.log('get:exit finished');
          loader.dismiss();
        }
      );
  }

  async showMap(lat,long) {
    console.log('showMap',lat,long);
    //     this.platform.ready().then(()=>{
    //     this.launchNavigator.navigate([lat, long], {
    //       start: "50.342847, -4.749904"
    //   })
    //   .then(
    //     success => alert('Launched navigator'),
    //     error => alert('Error launching navigator: ' + error)
    //     );
    // });
    //     this.platform.ready().then(()=>{
    // console.log('GOT HERE');
    // this.launchNavigator.navigate("London, UK")
    // .then(
    //       success => alert('Launched navigator'),
    //       error => alert('Error launching navigator: ' + error)
    //       );
    //   });

      // this.launchNavigator.isAppAvailable(this.launchNavigator.APP.GOOGLE_MAPS, 
        // function(isAvailable){
        // let app;
        // if(isAvailable){
            this.appp = this.launchNavigator.APP.GOOGLE_MAPS;
        // }
        // else{
        //     console.warn("Google Maps not available - falling back to user selection");
        //     app = this.launchNavigator.APP.USER_SELECT;
        // }
        this.launchNavigator.navigate([ +lat, +long ], {
            app: this.appp
        });
    // }
    // );
  }

  

}
