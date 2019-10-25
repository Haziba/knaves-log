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

    wiremock.get("/graphql", {
      "Dogs": {
        "Type": "Dogs",
        "StatsAndUnits": [{
          "Stat": "Walks (total)",
          "Units": []
        },{
          "Stat": "Walks (time) (mins)",
          "Units": []
        }],
        "Tags": [
          "rainy",
          "street-walk",
          "Run"
        ]
      },
      "Food": {
        "Type": "Food",
        "StatsAndUnits": [{
          "Stat": "Flax",
          "Units": []
        },{
          "Stat":"Blueberries",
          "Units":[]
        },{
          "Stat":"Sugar",
          "Units": []
        },{
          "Stat": "Salt",
          "Units":[]
        }],
        "Tags": [
          "Workday"
        ]
      }
    });

    wiremock.post("/graphql", {}, 200, {});
  });

  afterEach(() => {
    wiremock.stop();
  });

  it('should hit graphql', done => {
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

    page.navigateTo();

    page.getToastMessage().click();
    browser.wait(protractor.ExpectedConditions.invisibilityOf(page.getToastMessage()), 5000, 'Toast message taking too long to clear');

    page.setType(type);
    page.setTags(tags);
    page.setWhen(when.getDate() + '-' + when.getMonth() + '-' + when.getFullYear() + '\t00:00');
    page.setNote(note);
    page.setStats(stats);
    page.getSubmitButton().click();

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

  it('should give type suggestions from the api', () => {
    page.navigateTo();

    expect(page.getTypeSuggestionList()).toEqual(['Dogs', 'Food']);
  })

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});