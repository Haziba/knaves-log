import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriterComponent } from './writer.component';
import { FormsModule } from '@angular/forms';
import { WriterStatsComponent } from '../writer-stats/writer-stats.component';
import { SuggestionsService } from '../suggestions.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { AutoComplete, StatAndUnits } from '../write';

let suggestionsServiceSpy: { load: jasmine.Spy };

describe('WriterComponent', () => {
  let component: WriterComponent;
  let suggestionsServiceSpy: { load: jasmine.Spy };
  let fixture: ComponentFixture<WriterComponent>;

  beforeEach(async(() => {
    suggestionsServiceSpy = jasmine.createSpyObj('SuggestionsService', ['load']);
    suggestionsServiceSpy.load.and.returnValue(new Promise<AutoComplete>(resolve => {
      resolve({
        types: [ 'Cool thing', 'Rad happening' ],
        tags: [ 'Rainy', 'Damp', 'Wet', 'Dry af' ],
        stats: [{
          Stat: 'Skipping rope',
          Units: [ 'Ropes jumped', 'Time (seconds)' ]
        }]
      })
    }))

    TestBed.configureTestingModule({
      declarations: [ WriterComponent, WriterStatsComponent ],
      providers: [ { provide: SuggestionsService, useValue: suggestionsServiceSpy }, ToastrService ],
      imports: [ FormsModule, HttpClientModule, ToastrModule.forRoot() ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
