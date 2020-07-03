import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
// import { ToastOptions } from '@ionic/core';

/*
  Class to handle user interactions like simple alerts and toasts
*/
@Injectable()
export class Ux {

  constructor(
      private alertCtrl: AlertController,
      private toastCtrl: ToastController,
  ) {
    console.log('Hello UX Provider');
  }

  async alert(
      message: string, 
      title: string = 'Alert!', 
      cssClass: string = 'success', 
      buttonLabel: string = 'OK'
      ) {
    const alert = await this.alertCtrl.create({
        header: title,
        message: message,
        cssClass: cssClass,
        buttons: [buttonLabel],
    });
    await alert.present();
  }
  
  async toast(
      message: string,
      duration: number = 3000,
  ) {
    const toast = await this.toastCtrl.create({
        // showCloseButton: false,
        message: message,
        duration: duration,
        position: 'top',
    });

    toast.present();
  }

}
