import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Write, AutoComplete, Stat } from './write';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuggestionsService {
  private eventAutoCompletes = {}

  private autoComplete: AutoComplete = new AutoComplete();

  updateSuggestions: BehaviorSubject<AutoComplete> = new BehaviorSubject<AutoComplete>(this.autoComplete);

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  load(): Promise<AutoComplete> {
    return new Promise(resolve => {
      this.http.get('/graphql')
        .subscribe(data => {
          this.eventAutoCompletes = data;

          this.autoComplete.types = Object.keys(this.eventAutoCompletes);
          this.updateSuggestions.next(this.autoComplete);

          this.toastr.success('Suggestions loaded!');

          resolve(this.autoComplete);
        });
    });
  }

  updateWrite(write: Write): AutoComplete {
    let eventAutoComplete = this.eventAutoCompletes[write.type];

    if(eventAutoComplete == null){
      this.autoComplete.stats = [];
      this.autoComplete.tags = [];
      return this.autoComplete;
    }

    this.autoComplete.stats = eventAutoComplete.StatsAndUnits;

    this.autoComplete.tags = eventAutoComplete.Tags
      .filter(tag => !write.tags.includes(tag));

    return this.autoComplete;
  }
}
