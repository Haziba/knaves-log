import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriterStatsComponent } from './writer-stats.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('WriterStatsComponent', () => {
  let component: WriterStatsComponent;
  let fixture: ComponentFixture<WriterStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriterStatsComponent ],
      providers: [ ToastrService ],
      imports: [ FormsModule, HttpClientModule, ToastrModule.forRoot() ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriterStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
