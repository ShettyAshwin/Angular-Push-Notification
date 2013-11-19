'use strict';
(function () {
    describe('myApp ', function() {
        var mockNotificationService, fakeScope, fakeRootScope, mockNotificationObject, timeout, dialog;

        beforeEach(module('myApp'));

        describe('Notification controller', function() {

            beforeEach(inject(function (notificationService, $rootScope, $timeout, $modal, $controller) {
                mockNotificationService = notificationService;
                fakeRootScope = $rootScope.$new();
                //fakeScope = $scope.$new();
                timeout = $timeout;
                dialog = $modal;

                mockNotificationObject = {
                    read: true,
                    closed: false,
                    topic : {name:"mockNotification", title: "mockTitle"},
                    text: "mock-notification-message",
                    callBackDelegate : function(){
                        return "mock-callback";
                    }
                };

               fakeRootScope.timeout = function (callback, interval) {
                   var flag;

                   runs(function() {
                       flag = false;

                       setTimeout(function() {
                           flag = true;
                       }, interval);
                   });

                   waitsFor(function() {
                       return true;
                   }, "Timer elapsed", interval);

                   runs(function () {
                       //console.log("fake-timer-called");
                       callback();
                   });

               };

                fakeRootScope.fakeDialog = {
                    response: 'fake-response',
                    dialog: function(parameters) {
                        return this;
                    },
                    open: function(modelOptions) {
                        return this;
                    },
                    then: function(callBack){
                        callBack(this.response);
                    }
                };

                $controller('notificationController',
                    {
                        $scope: fakeRootScope,
                        $timeout : fakeRootScope.timeout,
                        notifierService: mockNotificationService,
                        $modal: fakeRootScope.fakeDialog,
                        $rootScope : fakeRootScope
                    });
            }));

            it('initial notification count = 0', function() {
                expect(fakeRootScope.Notification.Count).toEqual(0);
            });

            it('notification icon should be hidden initially', function() {
                expect(fakeRootScope.Notification.NotificationWindowVisible).toEqual(false);
            });

            it('check notification count > 1', function() {
                mockNotificationService.sendNotification(mockNotificationObject.text, mockNotificationObject.topic, mockNotificationObject.callBackDelegate);
                expect(fakeRootScope.Notification.Count).toEqual(1);
            });

            it('notification icon should be visible', function() {
                mockNotificationService.sendNotification(mockNotificationObject.text, mockNotificationObject.topic, mockNotificationObject.callBackDelegate);
                expect(fakeRootScope.Notification.NotificationWindowVisible).toEqual(true);
            });

            it('should get notification update from notifier service', function() {
                //send notification
                mockNotificationService.sendNotification(mockNotificationObject.text, mockNotificationObject.topic, mockNotificationObject.callBackDelegate);
                //send update
                mockNotificationObject.text = "modified text";
                mockNotificationObject.topic.title = "modified title";
                mockNotificationService.sendNotification(mockNotificationObject.text, mockNotificationObject.topic, mockNotificationObject.callBackDelegate);

                //notification count should remain 1, since it was an update
                expect(fakeRootScope.Notification.Count).toEqual(1);

                //simulate user closing the notification alert
               fakeRootScope.onCloseNotificationClose(mockNotificationObject.topic.name);

                //send another update
                mockNotificationService.sendNotification(mockNotificationObject.text, mockNotificationObject.topic, mockNotificationObject.callBackDelegate);

                //notification count should remain 1, since it was an update
                expect(fakeRootScope.Notification.Count).toEqual(1);

            });

            it('should remove notification on removal from notification service', function() {
                // no notification exists
                expect(fakeRootScope.Notification.Count).toEqual(0);
                //add one notification
                mockNotificationService.sendNotification(mockNotificationObject.text, mockNotificationObject.topic, mockNotificationObject.callBackDelegate);
                fakeRootScope.onCloseNotificationClose('mock-topic');
                expect(fakeRootScope.Notification.Count).toEqual(1);

                //remove all notification
                mockNotificationService.sendNotificationAll();
                expect(fakeRootScope.Notification.Count).toEqual(0);

            });

            it('should clear alert on removal from notification service', function() {

                mockNotificationService.sendNotification(mockNotificationObject.text, mockNotificationObject.topic, mockNotificationObject.callBackDelegate);
                expect(fakeRootScope.Notification.Count).toEqual(1);

                //clear notification alert
                fakeRootScope.onCloseNotificationClose(mockNotificationObject.topic.name);
                // clear notification from service
                mockNotificationService.sendNotificationAll();
                expect(fakeRootScope.Notification.Count).toEqual(0);

            });

            it('should open notification dialog', function() {

                spyOn(fakeRootScope.fakeDialog, "open").andCallThrough();

                // simulate notification icon click
                fakeRootScope.onNotifyIconClick();

                expect(fakeRootScope.fakeDialog.open).toHaveBeenCalled();
            });


        });
    });
})();