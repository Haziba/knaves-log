import { TestBed } from '@angular/core/testing';

import { SuggestionsService } from './suggestions.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrService, ToastrModule } from 'ngx-toastr';

describe('SuggestionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ToastrService
    ],
    imports: [ 
      HttpClientModule,
      ToastrModule.forRoot()
    ]
  }));

  it('should be created', () => {
    const service: SuggestionsService = TestBed.get(SuggestionsService);
    expect(service).toBeTruthy();
  });
});
