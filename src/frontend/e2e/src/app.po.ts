import { browser, by, element } from 'protractor';

export class AppPage {
  getStats() {
    return new Promise(resolve => {
      const statNames = element.all(by.css('[name=stat\\.name]')).getText() as Promise<string>;
      const statValues = element.all(by.css('[name=stat\\.value]')).getText() as Promise<string>;
      const statUnits = element.all(by.css('[name=stat\\.units]')).getText() as Promise<string>;
      Promise.all([statNames, statValues, statUnits])
        .then(([names, values, units]) => {
          const stats = [];

          for (let i = 0; i < names.length; i++) {
            stats.push({
              name: names[i],
              value: values[i],
              units: units[i]
            })
          }

          resolve(stats);
        });
    });
  }

  getStatsRemoveButtons() {
    return element.all(by.css('button[name=stat\\.remove]'));
  }

  getTagAddButton() {
    return element(by.css('button[name=newTag\\.add]'));
  }

  setTagName(tagName: string) {
    element(by.css('input[name=newTag\\.tag]')).sendKeys(tagName);
  }

  setStats(stats: { name: string; value: number; units: string; }[]) {
    const newStatName = element(by.css('input[name=newStat\\.name]'));
    const newStatValue = element(by.css('input[name=newStat\\.value]'));
    const newStatUnits = element(by.css('input[name=newStat\\.units]'));
    const addNewStat = element(by.css('button[name=newStat\\.add]'));

    stats.forEach(stat => {
      newStatName.sendKeys(stat.name);
      newStatValue.sendKeys(stat.value);
      newStatUnits.sendKeys(stat.units);
      addNewStat.click();
    });
  }

  setStatName(name: string) {
    element(by.css('input[name=newStat\\.name]')).sendKeys(name);
    element(by.css('body')).click();
  }

  setStatValue(value: string){
    element(by.css('input[name=newStat\\.value]')).sendKeys(value);
  }

  setStatUnits(units: string){
    element(by.css('input[name=newStat\\.units]')).sendKeys(units);
  }

  setNote(note: string) {
    element(by.css('input[name=write\\.note]')).sendKeys(note);
  }

  setTags(tags: string[]) {
    const newTagTag = element(by.css('input[name=newTag\\.tag]'));
    const addNewTag = element(by.css('button[name=newTag\\.add]'));

    tags.forEach(tag => {
      newTagTag.sendKeys(tag);
      addNewTag.click();
    })
  }

  setType(type: string) {
    element(by.css('input[name=write\\.type]')).sendKeys(type);
    element(by.css('body')).click();
  }

  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('h1')).getText() as Promise<string>;
  }

  setWhen(when: string) {
    const $when = element(by.css('input[name=write\\.when]'));
    $when.clear();
    $when.sendKeys(when);
  }

  getSubmitButton(){
    return element(by.css('button[type=submit]'));
  }

  getToastMessage(){
    return element(by.css('.toast-message'));
  }

  getToastMessageList(){
    return element.all(by.css('.toast-message')).getText() as Promise<string>;
  }

  getTypeSuggestionList(){
    return element.all(by.css('#types > option')).getAttribute('value') as Promise<string>;
  }

  getStatNameSuggestionList(){
    return element.all(by.css('#statNames > option')).getAttribute('value') as Promise<string>;
  }

  getStatUnitsSuggestionList(){
    return element.all(by.css('#statUnits > option')).getAttribute('value') as Promise<string>;
  }

  getStatAddButton(){
    return element.all(by.css('button[name=newStat\\.add]'));
  }

  getTagNameSuggestionList(){
    return element.all(by.css('#tags > option')).getAttribute('value') as Promise<string>;
  }
}
