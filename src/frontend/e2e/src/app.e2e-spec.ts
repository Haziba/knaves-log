import { verify, post, urlEqualTo } from 'jswiremock';

import { AppPage } from './app.po';
import { browser, logging, element, by, protractor } from 'protractor';

import { Wiremock } from "./wiremock";

describe('App', () => {
  let page: AppPage;
  let wiremock: Wiremock;

  beforeEach(() => {
    page = new AppPage();
    wiremock = new Wiremock();

    wiremock.get('/graphql', {
      'Dogs': {
        'Type': 'Dogs',
        'StatsAndUnits': [{
          'Stat': 'Walks (total)',
          'Units': []
        },{
          'Stat': 'Walks',
          'Units': ['mins']
        }],
        'Tags': [
          'rainy',
          'street-walk',
          'Run'
        ]
      },
      'Food': {
        'Type': 'Food',
        'StatsAndUnits': [{
          'Stat': 'Flax',
          'Units': ['tbsp', 'g']
        },{
          'Stat':'Blueberries',
          'Units':[]
        }],
        'Tags': [
          'Workday',
          'Ate out'
        ]
      }
    });

    wiremock.post('/graphql', {}, 200, {});
  });

  afterEach(() => {
    wiremock.stop();
  });

  it('won\'t submit if there\'s no type', () => {
    page.navigateTo();

    expect(page.getSubmitButton().isEnabled()).toEqual(false);

    page.setType('');

    expect(page.getSubmitButton().isEnabled()).toEqual(false);
    expect(page.getValidationErrors()).toEqual(['Type required']);
  });

  describe('a fully populated form', () => {
    const type = 'did some rad stuff';
    const tags = ['wore sunglasses', 'kept doing backflips'];
    const when = new Date(2019, 0, 1);
    const note = 'Just another rad day in my life where I did rad stuff and everyone was super impressed';
    const stats = [{
      name: 'skydives',
      value: 3,
      units: 'dives'
    }, {
      name: 'lives saved',
      value: 40,
      units: 'lives'
    }, {
      name: 'nachos eaten',
      value: 4,
      units: 'kg'
    }];

    beforeEach(() => {
      page.navigateTo();

      page.getToastMessage().click();
      browser.wait(protractor.ExpectedConditions.invisibilityOf(page.getToastMessage()), 5000, 'Toast message taking too long to clear');

      page.setType(type);
      page.setTags(tags);
      page.setWhen(when.getDate() + '-' + when.getMonth() + '-' + when.getFullYear() + '\t00:00');
      page.setNote(note);
      page.setStats(stats);
      page.getSubmitButton().click();
    })

    it('posts successfully', done => {
      browser.wait(protractor.ExpectedConditions.presenceOf(page.getToastMessage()), 5000, 'Toast message taking too long to appear');

      expect(page.getToastMessageList()).toContain('Success');

      browser.waitForAngularEnabled()
        .then(() => {
          const verify = wiremock.verifyPost('/graphql', {
            type: type,
            tags: tags,
            when: when,
            note: note,
            stats: stats
          });
          expect(verify).toEqual(true);
          done();
        });
    });
  });

  it('should recommend type suggestions from the api', () => {
    page.navigateTo();

    expect(page.getTypeSuggestionList()).toEqual(['Dogs', 'Food']);
  });

  it('should recommend appropriate unused stat suggestions from the api', () => {
    page.navigateTo();

    expect(page.getStatNameSuggestionList()).toEqual([]);
    expect(page.getStatUnitsSuggestionList()).toEqual([]);

    page.setType('Food');

    expect(page.getStatNameSuggestionList()).toEqual(['Flax', 'Blueberries']);

    page.setStatName('Flax');
    page.setStatValue('1');

    expect(page.getStatUnitsSuggestionList()).toEqual(['tbsp', 'g']);

    page.setStatUnits('tbsp');
    page.getStatAddButton().click();

    page.setStatName('Flax');
    page.setStatValue('15');

    expect(page.getStatUnitsSuggestionList()).toEqual(['g']);

    page.setStatUnits('g');
    page.getStatAddButton().click();

    const stats = page.getStats();

    expect(page.getStats()).toEqual([{
      name: 'Flax',
      value: '1',
      units: 'tbsp'
    },{
      name: 'Flax',
      value: '15',
      units: 'g'
    }]);

    page.setStatName('Flax');

    expect(page.getStatUnitsSuggestionList()).toEqual([]);

    page.getStatsRemoveButtons().first().click();

    expect(page.getStatUnitsSuggestionList()).toEqual(['g']);
  });

  it('should recommend unused tag suggestions from the api', () => {
    page.navigateTo();

    expect(page.getTagNameSuggestionList()).toEqual([]);

    page.setType('Food');

    expect(page.getTagNameSuggestionList()).toEqual(['Workday', 'Ate out']);

    page.setTagName('Workday');
    page.getTagAddButton().click();

    expect(page.getTagNameSuggestionList()).toEqual(['Ate out']);
  })

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});