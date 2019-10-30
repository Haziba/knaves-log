import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Write, AutoComplete, Stat, StatAndUnits } from './write';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuggestionsService {
  private eventAutoCompletes = {}

  private autoComplete: AutoComplete = new AutoComplete();

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

    this.autoComplete.stats = eventAutoComplete.StatsAndUnits
      .map(statAndUnits => {
        const stats = (write.stats.filter(stat => stat.name == statAndUnits.Stat));
        let units = statAndUnits.Units;

        if (stats.length > 0){
          const usedUnits = stats.map(stat => stat.units);
          units = statAndUnits.Units.filter(units => {
            return usedUnits.indexOf(units) < 0;
          })
        }

        return new StatAndUnits({
          Stat: statAndUnits.Stat,
          Units: units
        });
      });

    this.autoComplete.tags = eventAutoComplete.Tags
      .filter(tag => !write.tags.includes(tag));

    return this.autoComplete;
  }
}
