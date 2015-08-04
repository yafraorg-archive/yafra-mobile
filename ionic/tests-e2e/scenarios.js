'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('default page check', function() {

  browser.get('index.html');

  it('should automatically redirect to /yafra/home when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/yafra/home");
  });


  describe('title of first page', function() {

    beforeEach(function() {
      browser.get('index.html#/yafra/home');
    });


    it('should have a title', function() {
      expect(browser.getTitle()).toEqual('YAFRA');
    });

  });

});

describe('git view page check', function() {

    beforeEach(function() {
        browser.get('index.html#/yafra/git');
    });

    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Git Issues');
    });

});