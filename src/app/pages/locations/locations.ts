import { Component, OnInit, Inject } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { NavController, LoadingController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from 'src/app/services/api-service';
import { Ux } from 'src/app/services/ux-service';
import { AppSettings } from 'src/app/services/app-settings';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-locations',
  templateUrl: 'locations.html',
  styleUrls: ['locations.scss']
})
export class Locations implements OnInit {
  customer: any = {};
  ca_id: string;
  locations: any[] = [];
  all: any[] = [];
  // popular_resources: any[] = [];
  // categories: any[] = [];
  // category: any = {};
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
    console.log('locations');
    this.loadLocations();
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

  async loadLocations() {
    console.log('loadLocations');
    this.all = [];
    this.locations = [];
    let loader = await this.loading.create();
    loader.present();
    this.api.get('locations')
      .subscribe(
        async (response: any) => {
          console.log('get:locations:', response);
          if(response) {
            if(response.status == "success") {
              this.all = response.locations;
              this.locations = [... this.all];
              // create summary for each location
              // this.locations.forEach((location, i) => {
              //   this.locations[i].rsc_summary = this.stripHTML(location.rsc_content).substring(0,70);
              // })
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

  filterList(event) {
    console.log('filterList->event', event);
    const query = event.detail.value.toLowerCase();

    // filter our data
    const filtered = this.all.filter(function(obj) {
      return obj.loc_name.toLowerCase().indexOf(query) !== -1 || obj.loc_address.toLowerCase().indexOf(query) !== -1 || !query;
    });

    // update the rows
    this.locations = filtered;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }
}
