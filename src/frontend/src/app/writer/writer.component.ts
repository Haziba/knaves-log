import { Component, OnInit } from '@angular/core';

import { Write } from '../write';
import { HttpClient } from '@angular/common/http';

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

  submitting = false

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('https://mexw1gj4n5.execute-api.eu-west-1.amazonaws.com/Prod/graphql')
      .subscribe(data => {
        this.autoComplete.types = Object.keys(data);
        this.eventAutoCompletes = data;
      });
  }

  onSubmit(writeForm) { 
    this.submitting = true;
    writeForm.form.disable();

    this.http.post('https://mexw1gj4n5.execute-api.eu-west-1.amazonaws.com/Prod/graphql', this.write)
      .subscribe(() => {
        this.submitting = false;
        writeForm.form.enable();
      });
  }

  updateType(){
    console.log("Update type! - ", this.eventAutoCompletes[this.write.type]);
    this.autoComplete.stats = this.eventAutoCompletes[this.write.type].Stats;
    this.autoComplete.tags = this.eventAutoCompletes[this.write.type].Tags;
  }

  addStat() {
    this.write.stats[this.newStat.stat] = this.newStat.value;
    this.newStat = {
      stat: '',
      value: 0
    };
    console.log(this.write.stats);
  }

  removeStat(stat){
    console.log(stat);
    delete this.write.stats[stat.key];
  }

  addTag(){
    this.write.tags.push(this.newTag);
    this.newTag = '';
  }

  removeTag(tag){
    this.write.tags.splice(this.write.tags.indexOf(tag), 1);
  }
}
