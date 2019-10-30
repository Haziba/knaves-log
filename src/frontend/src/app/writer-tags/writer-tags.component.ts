import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-writer-tags',
  templateUrl: './writer-tags.component.html',
  styleUrls: ['./writer-tags.component.css']
})
export class WriterTagsComponent {

  @Input() tags: string[] = [];
  @Input() autoComplete: string[] = [];

  @Output('onAddTag') onAddTag: EventEmitter<any> = new EventEmitter<any>();
  @Output('onRemoveTag') onRemoveTag: EventEmitter<any> = new EventEmitter<any>();

  newTag: string = '';

  constructor() { }

  addTag(){
    this.onAddTag.emit({ newTag: this.newTag });

    this.newTag = '';
  }

  removeTag(tag){
    this.onRemoveTag.emit({ tag: tag });
  }
}
