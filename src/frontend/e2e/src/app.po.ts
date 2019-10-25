import { browser, by, element } from 'protractor';

export class AppPage {
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
}
