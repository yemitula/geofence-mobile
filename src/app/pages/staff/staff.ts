import { Component, OnInit, Inject } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { NavController, LoadingController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from 'src/app/services/api-service';
import { Ux } from 'src/app/services/ux-service';
import { AppSettings } from 'src/app/services/app-settings';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-staff',
  templateUrl: 'staff.html',
  styleUrls: ['staff.scss']
})
export class Staff implements OnInit {
  customer: any = {};
  staff: any[] = [];
  all: any[] = [];
  sub:any;
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
    this.route.queryParams
      .subscribe(params => {
        console.log("params=",params);
        this.sub=params;
      });
  }
  
  ngOnInit() {
    this.loadStaff();
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

  async loadStaff() {
    console.log('loadStaff');
    this.all = [];
    this.staff = [];
    let loader = await this.loading.create();
    loader.present();
    this.api.get('staff?loc_id='+this.sub.loc_id)
      .subscribe(
        async (response: any) => {
          console.log('get:staff:', response);
          if(response) {
            if(response.status == "success") {
              this.all = response.staff;
              this.staff = [... this.all];
              // create summary for each resource
              // this.staff.forEach((resource, i) => {
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
          console.log('get:staff error:', error);
          this.ux.alert(AppSettings.API_HTTP_FAIL_MESSAGE, "Error!", "error");
        }, () => {
            console.log('get:staff finished');
            loader.dismiss();
        }
      );
  }

  filterList(event) {
    console.log('filterList->event', event);
    const query = event.detail.value.toLowerCase();

    // filter our data
    const filtered = this.all.filter(function(obj) {
      return obj.stf_name.toLowerCase().indexOf(query) !== -1 || obj.stf_email.toLowerCase().indexOf(query) !== -1 || obj.stf_no.toLowerCase().indexOf(query) !== -1 || !query;
    });

    // update the rows
    this.staff = filtered;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }
}
