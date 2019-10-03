import { Component, OnInit } from '@angular/core';

import { Write } from '../write';
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
    stats: {}
  }

  newStat = {
    stat: '',
    value: 0
  }

  newTag = ''

  eventAutoCompletes = {}

  autoComplete = {
    types: [],
    stats: [],
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
        writeForm.form.enable();
        this.toastr.error('Success');
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

    this.autoComplete.stats = eventAutoComplete.Stats
      .filter(stat => Object.keys(this.write.stats).includes(stat));
    this.autoComplete.tags = eventAutoComplete.Tags
      .filter(tag => this.write.tags.includes(tag));
  }

  addStat() {
    this.write.stats[this.newStat.stat] = this.newStat.value;
    this.newStat = {
      stat: '',
      value: 0
    };

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
