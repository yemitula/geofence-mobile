import { Component, OnInit, Inject } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { NavController, LoadingController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from 'src/app/services/api-service';
import { Ux } from 'src/app/services/ux-service';
import { AppSettings } from 'src/app/services/app-settings';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: 'notifications.html',
  styleUrls: ['notifications.scss']
})
export class Notifications implements OnInit {
  customer: any = {};
  ca_id: string;
  notifications: any[] = [];
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
    console.log('notifications');
    this.loadNotifications();
  }

  async loadNotifications() {
    console.log('loadNotifications');
    this.all = [];
    this.notifications = [];
    let loader = await this.loading.create();
    loader.present();
    this.api.get('notifications')
      .subscribe(
        async (response: any) => {
          console.log('get:notifications:', response);
          if(response) {
            if(response.status == "success") {
              this.all = response.notifications;
              this.notifications = [... this.all];
            } else {
              this.ux.alert(response.message, "Error!", "error");
            }
          } else {
            this.ux.alert(AppSettings.API_EMPTY_RESPONSE_MESSAGE, "Error!", "error");
          }
        }, async error => {
          loader.dismiss();
          console.log('get:notifications error:', error);
          this.ux.alert(AppSettings.API_HTTP_FAIL_MESSAGE, "Error!", "error");
        }, () => {
            console.log('get:notifications finished');
            loader.dismiss();
        }
      );
  }

  filterList(event) {
    console.log('filterList->event', event);
    const query = event.detail.value.toLowerCase();

    // filter our data
    const filtered = this.all.filter(function(obj) {
      return obj.en_message.toLowerCase().indexOf(query) !== -1 || obj.stf_name.toLowerCase().indexOf(query) !== -1 || !query;
    });

    // update the rows
    this.notifications = filtered;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }
  
}
