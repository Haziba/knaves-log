import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriterTagsComponent } from './writer-tags.component';
import { FormsModule } from '@angular/forms';

describe('WriterTagsComponent', () => {
  let component: WriterTagsComponent;
  let fixture: ComponentFixture<WriterTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WriterTagsComponent 
      ],
      imports: [
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriterTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
