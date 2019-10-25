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

  newTag = ''

  eventAutoCompletes = {}

  autoComplete = {
    types: [],
    tags: [],
    stats: []
  }

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
    ) { }

  ngOnInit() {
    this.http.get('/graphql')
      .subscribe(data => {
        this.autoComplete.types = Object.keys(data);
        this.eventAutoCompletes = data;

        this.toastr.success('Cool beans');
      });
  }

  onSubmit(writeForm) { 
    writeForm.form.disable();

    this.http.post('/graphql', this.write, { observe: 'response' })
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
      this.autoComplete.stats = [];
      this.autoComplete.tags = [];
      return;
    }

    this.autoComplete.stats = eventAutoComplete.StatsAndUnits;

    this.autoComplete.tags = eventAutoComplete.Tags
      .filter(tag => this.write.tags.includes(tag));
  }

  addStat(event) {
    this.write.stats.push(event.newStat);

    this.updateSuggestions();
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
