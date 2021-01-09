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

}
