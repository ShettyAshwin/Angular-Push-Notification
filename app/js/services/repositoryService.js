'use strict';
(function () {
  var services = angular.module('myApp.repositoryService', ['myApp.messageBrokerService']);
  services.factory('repositoryService', ['$rootScope', '$q', '$http', 'messageBrokerService',
    function ($rootScope, $q, $http, messageBroker) {
      $rootScope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
          if (fn && (typeof(fn) === 'function')) {
            fn();
          }
        } else {
          this.$apply(fn);
        }
      };

      var site = {
        cases: {},
        case: {},
        patient: {},
        quality: {},
        configureCaseFor: function (barcode) {
          site.case = site.cases.child(barcode);
          site.patient = site.case.child('patient');
        }
      };

      return {
        configureCases: function (url) {
        },

        getCaseFor: function (barcode) {

          var url = angular.getAppSection('Service').Case  + barcode ;

          var future = $http({ cache: false, url: 'data/cases.js', method: 'GET'});

          return future.then(function (response) {
            return response.data;
          });
        },

        getQuality: function () {
          var future = $q.defer();
          site.quality.once('value', function (snapshot) {
            $rootScope.safeApply(function () {
              future.resolve(snapshot.val());
            });
          });
          return future.promise;
        },

        parse: function (barcode) {
          return barcode.substr(0, 9);
        },

        whenPatientChanged: function (callback) {
            messageBroker.Subscribe(angular.getAppSection('PubSubTopic').Patient, function (message) {

                $rootScope.safeApply(function () {
                    if (callback) {
                        callback(JSON.parse(message.body));
                    }
                });

            });

        }
      };
    }]);
})();