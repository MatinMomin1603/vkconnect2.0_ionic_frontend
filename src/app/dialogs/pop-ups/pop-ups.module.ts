import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopUpsPageRoutingModule } from './pop-ups-routing.module';

import { PopUpsPage } from './pop-ups.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopUpsPageRoutingModule
  ],
  declarations: [PopUpsPage]
})
export class PopUpsPageModule {}
