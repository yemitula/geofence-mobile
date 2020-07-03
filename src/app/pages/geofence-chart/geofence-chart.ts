import { Component, OnInit, Inject } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { NavController, LoadingController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from 'src/app/services/api-service';
import { Ux } from 'src/app/services/ux-service';
import { AppSettings } from 'src/app/services/app-settings';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-geofence-chart',
  templateUrl: 'geofence-chart.html',
  styleUrls: ['geofence-chart.scss'],
})
export class GeofenceChart implements OnInit {
  customer: any = {};
  cat_id: string;
  geofences: any[] = [];
  query: string;

  constructor(
    @Inject(AppComponent) private app: AppComponent,
    private nav: NavController,
    private fb: FormBuilder,
    private loading: LoadingController,
    private api: Api,
    private ux: Ux,
    private route: ActivatedRoute,
  ) {
    this.customer = this.app.user;
  }
  
  ngOnInit() {
    this.loadGeofence();
    // this.loadPopular();
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // 

  // stripHTML(html){
  //   let doc = new DOMParser().parseFromString(html, 'text/html');
  //   return doc.body.textContent || "";
  // }

  async loadGeofence() {
    console.log('loadGeofence');
    this.geofences = [];
    let loader = await this.loading.create();
    loader.present();
    this.api.get('geofences')
      .subscribe(
        async (response: any) => {
          console.log('get:geofences:', response);
          if(response) {
            if(response.status == "success") {
              this.geofences = response.geofences;
              // create summary for each resource
              // this.geoFences.forEach((resource, i) => {
              //   this.resources[i].rsc_summary = this.stripHTML(resource.rsc_content).substring(0,70);
              // })
            } else {
              this.ux.alert(response.message, "Error!", "error");
            }
          } else {
            this.ux.alert(AppSettings.API_EMPTY_RESPONSE_MESSAGE, "Error!", "error");
          }
        }, async error => {
          loader.dismiss();
          console.log('get:geofences error:', error);
          this.ux.alert(AppSettings.API_HTTP_FAIL_MESSAGE, "Error!", "error");
        }, () => {
            console.log('get:geofences finished');
            loader.dismiss();
        }
      );
  }

}
