/*module.exports = function (config)
{     config.set({
    basePath: '../',
    frameworks: ['jasmine'],
    files: [
        'app/lib/angular/angular.js',
        'app/lib/angular/angular-*.js',
        'test/lib/angular/angular-mocks.js',
        'app/js/*.js',
        'test/unit/*.js'
       ] ,
    autoWatch: true,
    browsers: ['Chrome'],
    junitReporter: {
        outputFile: 'test_out/unit.xml',
        suite: 'unit'
    }
   })
}
                 */

basePath= '../';

files= [
    ANGULAR_SCENARIO,
    ANGULAR_SCENARIO_ADAPTER,
    JASMINE,
    JASMINE_ADAPTER,
    'app/lib/angular/angular.js',
    'app/lib/angular/angular-*.js',
    'test/lib/angular/angular-mocks.js',
    'app/js/*.js',
    'test/unit/*.js'
];

frameworks= ['jasmine'];


autoWatch= true;

browsers= ['Chrome'];

plugins = [
    'karma-junit-reporter',
    'karma-chrome-launcher',
    'karma-firefox-launcher',
    'karma-jasmine'
];
exclude = [
    'app/lib/angular/angular-loader.js',
    'app/lib/angular/*.min.js',
    'app/lib/angular/angular-scenario.js'
];

    junitReporter= {
    outputFile: 'test_out/unit.xml',
        suite: 'unit'
};