import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WriterComponent } from './writer/writer.component';

const routes: Routes = [
  { path: 'writer', component: WriterComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
