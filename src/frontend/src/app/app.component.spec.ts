import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { WriterComponent } from './writer/writer.component';
import { FormsModule } from '@angular/forms';
import { WriterStatsComponent } from './writer-stats/writer-stats.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService, ToastrModule } from 'ngx-toastr';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        WriterComponent,
        WriterStatsComponent
      ],
      providers: [
        ToastrService
      ],
      imports: [
        FormsModule,
        HttpClientModule,
        ToastrModule.forRoot()
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Knave\'s Log');
  });
});
