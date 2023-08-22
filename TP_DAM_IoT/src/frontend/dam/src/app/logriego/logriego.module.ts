import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LogriegoPageRoutingModule } from './logriego-routing.module';
import { LogriegoPage } from './logriego.page';
import { AperturaPipe } from '../pipes/apertura.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogriegoPageRoutingModule
  ],
  declarations: [LogriegoPage, AperturaPipe,]
})
export class LogriegoPageModule {}
