import { Component, OnInit } from '@angular/core';

import { Write, Stat } from '../write';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-writer',
  templateUrl: './writer.component.html',
  styleUrls: ['./writer.component.css']
})
export class WriterComponent implements OnInit {

  write: Write = {
    type: '',
    when: new Date(),
    tags: [],
    note: '',
    stats: []
  }

  newStat: Stat = {
    name: '',
    value: 0,
    units: ''
  }

  newTag = ''

  eventAutoCompletes = {}

  autoComplete = {
    types: [],
    statNames: [],
    statUnits: [],
    tags: []
  }

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
    ) { }

  ngOnInit() {
    this.http.get('https://mexw1gj4n5.execute-api.eu-west-1.amazonaws.com/Prod/graphql')
      .subscribe(data => {
        this.autoComplete.types = Object.keys(data);
        this.eventAutoCompletes = data;
      });
  }

  onSubmit(writeForm) { 
    writeForm.form.disable();

    this.http.post('https://mexw1gj4n5.execute-api.eu-west-1.amazonaws.com/Prod/graphql', this.write, { observe: 'response' })
      .subscribe(resp => {
        this.write = {
          type: '',
          when: new Date(),
          tags: [],
          note: '',
          stats: []
        }
        this.updateSuggestions();

        writeForm.form.enable();
        this.toastr.success('Success');
      }, error => {
        writeForm.form.enable();
        this.toastr.error('Failure');
      });
  }

  updateSuggestions(){
    let eventAutoComplete = this.eventAutoCompletes[this.write.type];

    if(eventAutoComplete == null){
      this.autoComplete.statNames = [];
      this.autoComplete.tags = [];
      return;
    }

    let allStats = Object.keys(eventAutoComplete.StatsAndUnits);
    this.autoComplete.statNames = allStats.filter(stat => {
      let allUnits = eventAutoComplete.StatsAndUnits[stat];

      if(allUnits.length == 0)
        return true;

      let unusedUnits = allUnits.filter(units => !this.write.stats.find(stat => stat.units == units));
      return unusedUnits.length > 0;
    });
    
    this.autoComplete.statUnits = eventAutoComplete.StatsAndUnits[this.newStat.name];

    this.autoComplete.tags = eventAutoComplete.Tags
      .filter(tag => this.write.tags.includes(tag));
  }

  updateStatSuggestions(){
    let statsAndUnits = this.eventAutoCompletes[this.write.type].StatsAndUnits[this.newStat.name];

    if(statsAndUnits == null){
      this.autoComplete.statUnits = [];
      return;
    }

    let writeStats = this.write.stats.filter(stat => stat.name == this.newStat.name);
    
    if(writeStats.length == 0){
      this.autoComplete.statUnits = statsAndUnits;
      return;
    }

    let usedUnits = writeStats.map(writeStat => writeStat.units);

    this.autoComplete.statUnits = statsAndUnits.filter(units => usedUnits.indexOf(units) < 0);
  }

  addStat() {
    this.write.stats.push(this.newStat);
    this.newStat = {
      name: '',
      value: 0,
      units: ''
    };

    this.updateSuggestions();
    this.updateStatSuggestions();
  }

  removeStat(stat){
    delete this.write.stats[stat.key];

    this.updateSuggestions();
  }

  addTag(){
    this.write.tags.push(this.newTag);
    this.newTag = '';

    this.updateSuggestions();
  }

  removeTag(tag){
    this.write.tags.splice(this.write.tags.indexOf(tag), 1);

    this.updateSuggestions();
  }
}
