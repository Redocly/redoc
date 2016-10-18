import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RedocModule } from './redoc.module';
import { Redoc } from './components/index';

@NgModule({
  imports: [ BrowserModule, RedocModule ],
  bootstrap: [ Redoc ],
  exports: [ Redoc ]
})
export class AppModule {
}
