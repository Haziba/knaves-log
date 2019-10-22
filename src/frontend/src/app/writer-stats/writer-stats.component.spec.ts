import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriterStatsComponent } from './writer-stats.component';

describe('WriterStatsComponent', () => {
  let component: WriterStatsComponent;
  let fixture: ComponentFixture<WriterStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriterStatsComponent ]
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
