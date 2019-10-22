import { Component, OnInit } from '@angular/core';

import { Write, Stat, AutoComplete } from '../write';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { SuggestionsService } from '../suggestions.service';

@Component({
  selector: 'app-writer',
  templateUrl: './writer.component.html',
  styleUrls: ['./writer.component.css']
})
export class WriterComponent implements OnInit {

  write: Write = new Write();

  newTag = ''

  autoComplete: AutoComplete = new AutoComplete();

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private suggestionsService: SuggestionsService
    ) { }

  ngOnInit() {
    this.suggestionsService.updateSuggestions.subscribe(autoComplete => this.autoComplete = autoComplete);
    this.suggestionsService.load()
      .then(autoComplete => this.autoComplete = autoComplete);
  }

  onSubmit(writeForm) { 
    writeForm.form.disable();

    this.http.post('/graphql', this.write, { observe: 'response' })
      .subscribe(resp => {
        this.write = new Write();
        this.updateSuggestions();

        writeForm.form.enable();
        this.toastr.success('Success');
      }, error => {
        writeForm.form.enable();
        this.toastr.error('Failure');
      });
  }

  updateSuggestions(){
    this.autoComplete = this.suggestionsService.updateWrite(this.write);
  }

  addStat(event) {
    this.write.stats.push(event.newStat);

    this.updateSuggestions();
  }

  removeStat(stat : Stat){
    var statToRemove = this.write.stats.find(s => s.name == stat.name && s.units == stat.units);
    this.write.stats.splice(this.write.stats.indexOf(statToRemove), 1);

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
