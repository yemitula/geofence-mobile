import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'configure',
    loadChildren: () => import('./pages/configure-device/configure-device.module').then(m => m.ConfigureDevicePageModule)
  },
  {
    path: 'locations',
    loadChildren: () => import('./pages/locations/locations.module').then( m => m.LocationsPageModule)
  },
  {
    path: 'staff',
    loadChildren: () => import('./pages/staff/staff.module').then( m => m.StaffPageModule)
  },
  {
    path: 'geofence-chart',
    loadChildren: () => import('./pages/geofence-chart/geofence-chart.module').then( m => m.GeofenceChartPageModule)
  },
  {
    path: 'fence-exits',
    loadChildren: () => import('./pages/fence-exits/fence-exits.module').then( m => m.FenceExitsPageModule)
  },
  {
    path: 'movements',
    loadChildren: () => import('./pages/movements/movements.module').then( m => m.MovementsPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
