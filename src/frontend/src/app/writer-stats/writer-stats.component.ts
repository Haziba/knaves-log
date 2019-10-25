import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Stat, StatAndUnits } from '../write';

@Component({
  selector: 'app-writer-stats',
  templateUrl: './writer-stats.component.html',
  styleUrls: ['./writer-stats.component.css']
})
export class WriterStatsComponent implements OnInit {
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

  @Input() autoComplete = {
    stats: [],
    units: []
  };

  @Output('onAddStat') onAddStat: EventEmitter<any> = new EventEmitter<any>();

  newStat: Stat = new Stat();

  constructor() { }

  ngOnInit() {
  }

  addStat(){
    this.onAddStat.emit({ newStat: this.newStat });

    this.newStat = new Stat();
  }

  removeStat(stat){

  }

  updateStatSuggestions(){
    let statAndUnits = this.statsAndUnits.find(x => x.Stat == this.newStat.name);

    if(statAndUnits == null){
      this.autoComplete.units = [];
      return;
    }

    let usedUnits = this.stats.map(writeStat => writeStat.units);

    this.autoComplete.units = statAndUnits.Units.filter(units => usedUnits.indexOf(units) < 0);
  }

}
