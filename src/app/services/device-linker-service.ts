import { Injectable } from '@angular/core';

@Injectable(/* {
  providedIn: 'root'
} */)

export class DeviceLinker {
  staff: any;
  isLinked: boolean = false;
  constructor(
    
    ) { }

  public get getLinkedStaff() : any {
    if (this.staff = localStorage.getItem('geofence_linked_staff')) {
      return JSON.parse(this.staff);
    } else {
      return false;
    }
  }

  public get isDeviceLinked() : boolean {
    if (this.staff = localStorage.getItem('geofence_linked_staff')) {  
      const staff = JSON.parse(localStorage.getItem('geofence_linked_staff'));
      return staff.timeLinked !== null;
    } else {
      return false;
    }
  }

  link(staff: any) {
    staff.timeLinked = new Date();
    localStorage.setItem('geofence_linked_staff', JSON.stringify(staff));
    this.staff = staff;
    // TODO - get device ID and update in the database
  }

  unlink() {
      // remove user from local storage to log user out
      localStorage.removeItem('geofence_linked_staff');
      this.isLinked = false;
      this.staff = null;
  }
}