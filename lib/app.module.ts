import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RedocModule } from './redoc.module';
import { Redoc } from './components/index';

@NgModule({
  imports: [ BrowserModule, BrowserAnimationsModule, RedocModule ],
  bootstrap: [ Redoc ],
  exports: [ Redoc ]
})
export class AppModule {
}
