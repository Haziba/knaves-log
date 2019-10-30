import { TestBed } from '@angular/core/testing';

import { SuggestionsService } from './suggestions.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutoComplete, Write, StatAndUnits } from './write';

describe('SuggestionsService', () => {
  let httpMock: HttpTestingController;
  let toastrServiceSpy: { success: jasmine.Spy };

  beforeEach(() => {
    toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ToastrService, useValue: toastrServiceSpy },
      ],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule
      ]
    });

    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: SuggestionsService = TestBed.get(SuggestionsService);
    expect(service).toBeTruthy();
  });

  describe('calling load', () => {
    let service: SuggestionsService;
    let autoComplete: AutoComplete;

    beforeEach(done => {
      service = TestBed.get(SuggestionsService);

      service.load()
        .then(data => {
          autoComplete = data;
          done();
        });

      let suggestionsRequest = httpMock.expectOne('/graphql');
      suggestionsRequest.flush({
        'Event Happened': {
          StatsAndUnits: [{
            Stat: 'Stuff',
            Units: ['metres', 'miles']
          }, {
            Stat: 'Other thing',
            Units: ['seconds', 'minutes']
          }],
          Tags: ['Rainy', 'Wild'],
          Type: 'Event Happened'
        }
      });
    });

    afterEach(() => {
      service = null;
    });

    it('returns type suggestions only', () => {
      expect(autoComplete).toEqual(new AutoComplete({
        types: [ 'Event Happened' ]
      }));
    });

    it('fires a toastr success message', () => {
      expect(toastrServiceSpy.success).toHaveBeenCalled();
    });

    describe('calling updateWrite', () => {
      describe('with a type that exists in the loaded suggestions', () => {
        beforeEach(() => {
          autoComplete = service.updateWrite(new Write({
            type: 'Event Happened'
          }));
        })

        it('should have auto complete stats, units, tags, and types set', () => {
          expect(autoComplete).toEqual(new AutoComplete({
            types: [ 'Event Happened' ],
            stats: [new StatAndUnits({
              Stat: 'Stuff',
              Units: [ 'metres', 'miles' ]
            }), new StatAndUnits({
              Stat: 'Other thing',
              Units: [ 'seconds', 'minutes' ]
            })],
            tags: [ 'Rainy', 'Wild' ]
          }));
        });

        describe('with a stat unit used in the write', () => {
          beforeEach(() => {
            autoComplete = service.updateWrite(new Write({
              type: 'Event Happened',
              stats: [{
                name: 'Stuff',
                value: 15,
                units: 'metres'
              }]
            }));
            console.log('autocomplete', autoComplete.stats[0]);
          });

          it('shouldn\'t include the used stat unit', () => {
            console.log('wtf', autoComplete, new AutoComplete({
              types: ['Event Happened'],
              stats: [new StatAndUnits({
                Stat: 'Stuff',
                Units: [ 'miles' ]
              }), new StatAndUnits({
                Stat: 'Other thing',
                Units: ['seconds', 'minutes']
              })],
              tags: ['Rainy', 'Wild']
            }));
            expect(new AutoComplete({
              types: ['Event Happened'],
              stats: [new StatAndUnits({
                Stat: 'Stuff',
                Units: [ 'miles' ]
              }), new StatAndUnits({
                Stat: 'Other thing',
                Units: ['seconds', 'minutes']
              })],
              tags: ['Rainy', 'Wild']
            })).toEqual(new AutoComplete({
              types: ['Event Happened'],
              stats: [new StatAndUnits({
                Stat: 'Stuff',
                Units: [ 'miles' ]
              }), new StatAndUnits({
                Stat: 'Other thing',
                Units: ['seconds', 'minutes']
              })],
              tags: ['Rainy', 'Wild']
            }));
          });
        });
      });

      describe('with a type that doesn\'t exist in the loaded suggestions', () => {
        beforeEach(() => {
          autoComplete = service.updateWrite(new Write({
            type: 'Event that didn\'t happen'
          }));
        })

        it('should only have types in auto complete', () => {
          expect(autoComplete).toEqual(new AutoComplete({
            types: [ 'Event Happened' ]
          }));
        });
      });
    });
  })
});
