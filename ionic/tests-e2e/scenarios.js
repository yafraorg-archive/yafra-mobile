'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('Yafra Mobile App', function() {

    browser.get('index.html');

    it('should automatically redirect to /yafra/home when location hash/fragment is empty', function() {
        expect(browser.getLocationAbsUrl()).toMatch("/yafra/home");
        });

    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('YAFRA');
        });

    it('should change to git issues', function () {
        element(by.css('.yafragitmenu')).click();
        expect(browser.getCurrentUrl()).toMatch("/yafra/git");
        });

    describe('git issue page', function() {

        beforeEach(function() {
            browser.get('index.html#/yafra/git');
            });

        it('should change to git issues', function () {
            expect(browser.getCurrentUrl()).toMatch("/yafra/git");
            });

        it('should have a title', function() {
            expect(browser.getTitle()).toEqual('Git Issues');
            });

    });


});

