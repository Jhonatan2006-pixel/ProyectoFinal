import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular/lazy';

import { LoginPage } from './login.page';
import { LivenessComponent } from '../../components/liveness/liveness.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    LivenessComponent,
    RouterModule.forChild([{ path: '', component: LoginPage }]),
  ],
  declarations: [LoginPage],
})
export class LoginPageModule {}
