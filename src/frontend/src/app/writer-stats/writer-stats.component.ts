import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Stat, StatAndUnits } from '../write';
import { SuggestionsService } from '../suggestions.service';

@Component({
  selector: 'app-writer-stats',
  templateUrl: './writer-stats.component.html',
  styleUrls: ['./writer-stats.component.css']
})
export class WriterStatsComponent {
  private _statsAndUnits: StatAndUnits[];

  @Input() stats: Stat[] = [];

  @Input()
  set statsAndUnits(statAndUnits: StatAndUnits[]) {
    this.autoComplete.stats = statAndUnits.map(x => x.Stat);
    this._statsAndUnits = statAndUnits;
    this.newStat = new Stat();
  };
  get statsAndUnits(): StatAndUnits[] {
    return this._statsAndUnits;
  }

  private autoComplete = {
    stats: [],
    units: []
  };

  @Output('onAddStat') onAddStat: EventEmitter<any> = new EventEmitter<any>();
  @Output('onRemoveStat') onRemoveStat: EventEmitter<any> = new EventEmitter<any>();

  newStat: Stat = new Stat();

  constructor(
    private suggestionsService: SuggestionsService
  ) { }

  addStat(){
    this.onAddStat.emit({ newStat: this.newStat });

    this.newStat = new Stat();

    this.updateStatSuggestions();
  }

  removeStat(stat){
    this.onRemoveStat.emit({ stat: stat });

    this.updateStatSuggestions();
  }

  updateStatSuggestions(){
    let statAndUnits = this.statsAndUnits.find(x => x.Stat == this.newStat.name);

    if(statAndUnits == null){
      this.autoComplete.units = [];
      return;
    }

    this.autoComplete.units = statAndUnits.Units;
  }
}
