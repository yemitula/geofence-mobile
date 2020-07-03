import { IService } from './IService';
// import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from './app-settings';
import { LoadingService } from './loading-service';
import { AuthService } from './auth-service';

@Injectable({ providedIn: 'root' })
export class MenuService implements IService {

  constructor(
    // public af: AngularFireDatabase, 
    private auth: AuthService,
    private loadingService: LoadingService) { }

  getId = (): string => 'menu';

  getTitle = (): string => 'UIAppTemplate';

  //* Data Set for main menu
  getAllThemes = (): Array<any> => {
    return [
      // {
      //   'url': 'home',
      //   'title': 'Home',
      //   'icon': 'icon-home',
      //   'component': '',
      // },
      {
        'url': 'staff',
        'title': 'Staff List',
        'icon': 'icon-briefcase',
        'component': '',
      },
      {
        'url': 'locations',
        'title': 'Location List',
        'icon': 'icon-pencil',
        'component': '',
      },
      {
        'url': 'geofence-chart',
        'title': 'Geofence Chart',
        'icon': 'icon-settings',
        'component': '',
      },
      {
        'url': 'profile',
        'title': 'Profile',
        'icon': 'icon-human',
        'component': '',
      },
      {
        'url': 'notifications',
        'title': 'Notifications',
        'icon': 'icon-bell',
        'component': '',
      },
      // {
      //   'url': 'list',
      //   'title': 'List Test',
      //   'icon': 'icon-view-list',
      //   'component': '',
      // },
      {
        'url': '',
        'method': 'logout',
        'title': 'Logout',
        'icon': 'icon-logout',
        'component': '',
      },
    ];
  }

  getAllThemesOld = (): Array<any> => {
    return [
      {
        'url': 'items/listViews',
        'title': 'List Views',
        'theme': 'listViews',
        'icon': 'icon-format-align-justify',
        'listView': true,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/parallax',
        'title': 'Parallax',
        'theme': 'parallax',
        'icon': 'icon-format-line-spacing',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'settings',
        'title': 'RTL + Color Change',
        'theme': 'settings',
        'icon': 'icon-settings',
        'listView': false,
        'component': '',
        'singlePage': true
      },
      {
        'url': 'items/login',
        'title': 'Login Pages',
        'theme': 'login',
        'icon': 'icon-lock-open-outline',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/register',
        'title': 'Register Pages',
        'theme': 'register',
        'icon': 'icon-comment-account',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/forgetPassword',
        'title': 'Forgot Password Pages',
        'theme': 'forgetPassword',
        'icon': 'icon-eye-off',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/newPassword',
        'title': 'Old/New Password Pages',
        'theme': 'newPassword',
        'icon': 'icon-key-variant',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/imageGallery',
        'title': 'Image Gallery',
        'theme': 'imageGallery',
        'icon': 'icon-apps',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/splashScreens',
        'title': 'Splash Screen',
        'theme': 'splashScreens',
        'icon': 'icon-logout',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/checkBoxes',
        'title': 'Check Boxs',
        'theme': 'checkBoxes',
        'icon': 'icon-checkbox-marked',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/searchBars',
        'title': 'Search Bars',
        'theme': 'searchBars',
        'icon': 'icon-magnify',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/textViews',
        'title': 'Typo + small components',
        'theme': 'textViews',
        'icon': 'icon-tumblr',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/wizard',
        'title': 'Wizard / Onboarding',
        'theme': 'wizard',
        'icon': 'icon-cellphone-settings',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/spinner',
        'title': 'Spinner',
        'theme': 'spinner',
        'icon': 'icon-image-filter-tilt-shift',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/tabs',
        'title': 'Tabs',
        'theme': 'tabs',
        'icon': 'icon-view-array',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/maps',
        'title': 'Maps',
        'theme': 'maps',
        'icon': 'icon-google-maps',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/qrcode',
        'title': 'QRCode',
        'theme': 'qrcode',
        'icon': 'icon-qrcode',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/timeline',
        'title': 'Timeline',
        'theme': 'timeline',
        'icon': 'icon-timer',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/radioButton',
        'title': 'Radio Button',
        'theme': 'radioButton',
        'icon': 'icon-radiobox-marked',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/range',
        'title': 'Range',
        'theme': 'range',
        'icon': 'icon-toggle-switch-off',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/form',
        'title': 'Forms',
        'theme': 'form',
        'icon': 'icon-content-paste',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/toggle',
        'title': 'Toggle',
        'theme': 'toggle',
        'icon': 'icon-toggle-switch',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/select',
        'title': 'Select',
        'theme': 'select',
        'icon': 'icon-menu-down',
        'listView': true,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/profile',
        'title': 'Profile',
        'theme': 'profile',
        'icon': 'icon-account-outline',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/comment',
        'title': 'Comments',
        'theme': 'comment',
        'icon': 'icon-comment-outline',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/payment',
        'title': 'Payment',
        'theme': 'payment',
        'icon': 'icon-cash',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/segment',
        'title': 'Segment',
        'theme': 'segment',
        'icon': 'icon-timelapse',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/actionSheet',
        'title': 'Action Sheet',
        'theme': 'actionSheet',
        'icon': 'icon-dots-horizontal',
        'listView': false,
        'component': '',
        'singlePage': false
      },
      {
        'url': 'items/alert',
        'title': 'Alert',
        'theme': 'alert',
        'icon': 'icon-alert',
        'listView': false,
        'component': '',
        'singlePage': false
      }
    ];
  }

  getDataForTheme = (menuItem: any) => {
    return {
      'background': 'assets/imgs/background/16.jpg',
      'image': 'assets/imgs/logo/login-3.png',
      'title': 'Ionic4 UI - Billy Theme'
    };
  }

  getEventsForTheme = (menuItem: any): any => {
    return {};
  }

  prepareParams = (item: any) => {
    return {
      title: item.title,
      data: {},
      events: this.getEventsForTheme(item)
    };
  }

  load(item: any): Observable<any> {
    this.loadingService.show();
    if (AppSettings.IS_FIREBASE_ENABLED) {
      return new Observable(observer => {
        // this.af
        //   .object('menu')
        //   .valueChanges()
        //   .subscribe(snapshot => {
        //     this.loadingService.hide();
        //     observer.next(snapshot);
        //     observer.complete();
        //   }, err => {
        //     this.loadingService.hide();
        //     observer.error([]);
        //     observer.complete();
        //   });
      });
    } else {
      return new Observable(observer => {
        this.loadingService.hide();
        observer.next(this.getDataForTheme(item));
        observer.complete();
      });
    }
  }
}
