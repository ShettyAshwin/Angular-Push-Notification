'use strict';

(function () {

    var services = angular.module('myApp.messageBrokerService',[]);

      services.factory('messageBrokerService', ['$rootScope', '$q', function ($rootScope, $q) {
          /*        var HeartBeat = new Worker("js/CustomTimer.js");
           HeartBeat.postMessage({MessageType:'RegisterTimer'});           */

          var SubscribDetail = (function () { return { SubcribObj: null, SubcribCallback: null } });

          var SubLst = angular.GetNewDictionaryInstance();
          var PendingSubLst = angular.GetNewDictionaryInstance();

          var MessageBroker = {
              Server: angular.getAppSection('StompConfiguration').Server,
              Port: angular.getAppSection('StompConfiguration').Port,
              Protocol: angular.getAppSection('StompConfiguration').Protocol,
              UserName: angular.getAppSection('StompConfiguration').UserName,
              Password: angular.getAppSection('StompConfiguration').Password,
              Client: null,
              Debug: null,
              ConnectionState: 'Offline',
              onError: function (frame) {
                  if (MessageBroker.Debug != null) {
                      MessageBroker.Debug("Connection Error: " + (frame.headers != undefined ? frame.headers.message : frame));
                  }
                  if (frame.toString().indexOf('Lost connection to') != -1)
                  {
                      MessageBroker.ConnectionState = 'Offline';
                      MessageBroker.Client = null;
                      while (SubLst.Count() > 0) {
                          var Requst = SubLst.ReturnFirstObject();
                          PendingSubLst.Add(Requst, SubLst.getValue(Requst).SubcribCallback);
                          SubLst.Remove(Requst);
                      }
                      if (PendingSubLst.Count() > 0)
                      {
                          MessageBroker.GetClientInstance();
                      }
                  }
              },
              GetClientInstance: function () {

                  if (Stomp == null) {
                      alert('Stomp object is not available. Please check the reference to Stomp.Js');
                      return null;
                  }

                  if (MessageBroker.Client == null) {
                      MessageBroker.Client = Stomp.client(MessageBroker.Protocol + '://' + MessageBroker.Server + ':' + MessageBroker.Port);
                      if (MessageBroker.Debug != null) {
                          MessageBroker.Client.debug = MessageBroker.Debug;
                      }
                  }

                  if (MessageBroker.Client.connected == false) {
                      if (MessageBroker.ConnectionState != 'Connecting') {
                          MessageBroker.ConnectionState = 'Connecting';
                          // alert('Register Success');
                          MessageBroker.Client.connect(MessageBroker.UserName, MessageBroker.Password, MessageBroker.RegisterPendingSubscribtion, MessageBroker.onError);
                      };
                  }


              },
              GetSubcribDetail: function (callBackReference, SubcribReference) {
                  var SubDetail = new SubscribDetail();
                  SubDetail.SubcribCallback = callBackReference;
                  SubDetail.SubcribObj = SubcribReference;
                  return SubDetail;
              },
              RegisterPendingSubscribtion: function (frame) {

                  MessageBroker.ConnectionState = 'Online';
                  while (PendingSubLst.Count() > 0) {
                      var Requst = PendingSubLst.ReturnFirstObject();
                      var Callback = PendingSubLst.getValue(Requst);
                      SubLst.Add(Requst, MessageBroker.GetSubcribDetail(Callback, MessageBroker.Client.subscribe(Requst, Callback)));
                      PendingSubLst.Remove(Requst);
                  }
              },
              Publish: function (topicName, message) {
                  if (MessageBroker.ConnectionState == 'Online') {
                      MessageBroker.Client.send(topicName, {}, message);
                  } else {
                      throw {
                          name: "Stomp Error",
                          level: "",
                          message: "Connection not established yet!. please try after sometime. Check the connection status property.",
                          htmlMessage: "<p>Connection not established yet!. please try after sometime. Check the connection status property.</p>",
                          toString: function () { return this.name + ": " + this.message }
                      };
                  }
              },
              Subscribe: function (topicName, callbackFunction) {
                  if (MessageBroker.ConnectionState != 'Online') {
                      MessageBroker.GetClientInstance();
                      PendingSubLst.Add(topicName, callbackFunction);
                  }
                  else {
                      SubLst.Add(topicName, MessageBroker.GetSubcribDetail(callbackFunction, MessageBroker.Client.subscribe(topicName, callbackFunction)));
                  }
              },
              UnSubscribe: function (topicName, callBackFunction) {
                  var subid = SubLst.getValue(topicName).SubcribObj;
                  MessageBroker.Client.unsubscribe(subid);
                  SubLst.Remove(topicName);
                  if (SubLst.Count() < 1) {
                      if (MessageBroker.Client.connected == true) {
                          MessageBroker.Client.disconnect(callBackFunction);
                          MessageBroker.Client = null;
                          MessageBroker.ConnectionState = 'Offline';
                      }
                  }
              }
          };


          MessageBroker.Debug = function (str) {
              var elem = document.getElementById('DebugWindow');
              elem.innerHTML += ("<p >" + str + "</p><br>");
              elem.scrollTop = elem.scrollHeight;
          };

          return MessageBroker;

      }]);
})();



