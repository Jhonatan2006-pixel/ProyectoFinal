import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular/lazy';

import { BienvenidaPage } from './bienvenida.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: BienvenidaPage }]),
  ],
  declarations: [BienvenidaPage],
})
export class BienvenidaPageModule {}
