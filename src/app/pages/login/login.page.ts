import { Component, Inject } from '@angular/core';
import { ModalController, LoadingController, NavController } from '@ionic/angular';
import { AppSettings } from './../../services/app-settings';
import { HomeService } from './../../services/home-service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Api } from 'src/app/services/api-service';
import { Ux } from 'src/app/services/ux-service';
import { AuthService } from 'src/app/services/auth-service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  providers: [HomeService]
})
export class LoginPage {
  loginForm: FormGroup;
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
    ) { 
      this.item = this.homeService.getData();
    
    this.loginForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
   });
  }

  ngOnInit() {
    // this.app.showSidebar = false;
    // this.loginForm = this.fb.group({
    //   email: [
    //     '', [Validators.required, Validators.email]
    //   ],
    //   password: [
    //     '', [Validators.required, Validators.minLength(6)]
    //   ]
    // });
  }

  
  get email () {
    return this.loginForm.get('email');
  }
  get password () {
    return this.loginForm.get('password');
  }


  async login() {
    console.log('login called! loginForm:', this.loginForm.value);
    let {email, password} = this.loginForm.value;
    let loader = await this.loading.create({
      message: 'Checking your credentials...',
    });
    loader.present();
    this.api.post('auth/user/login', { email: email, password: password })
      .subscribe(
        async (response: any) => {
          console.log('post:auth/user/login response:', response);
          if(response) {
            if(response.status == "success") {
              // signup verified?
              let {user} = response;
              this.auth.userLogin(user);
              // this.app.showSidebar = true;
              this.app.setUser(user);
              this.nav.navigateRoot(['/locations']);
              this.ux.toast("Login successful");
            } else {
              this.ux.alert(response.message, "Error!", "error");
            }
          } else {
            this.ux.alert(AppSettings.API_EMPTY_RESPONSE_MESSAGE, "Error!", "error");
          }
        }, async error => {
          loader.dismiss();
          console.log('post:auth/user/login error:', error);
          this.ux.alert(AppSettings.API_HTTP_FAIL_MESSAGE, "Error!", "error");
        }, () => {
            console.log('post:auth/user/login finished');
            loader.dismiss();
        }
      );
  }
}
