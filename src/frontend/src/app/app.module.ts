import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { WriterComponent } from './writer/writer.component';
import { WriterStatsComponent } from './writer-stats/writer-stats.component';
import { BaseUrlInterceptor } from './interceptors/base-url.interceptor';
import { WriterTagsComponent } from './writer-tags/writer-tags.component';

@NgModule({
  declarations: [
    AppComponent,
    WriterComponent,
    WriterStatsComponent,
    WriterTagsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
