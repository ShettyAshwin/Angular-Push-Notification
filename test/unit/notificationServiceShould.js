'use strict';
(function () {
    describe('Cytology ', function() {
        var mockNotificationService, rootScope, mockNotificationObject;


        beforeEach(module('myApp'));

        describe('Notification Service', function() {

            beforeEach(inject(function (notificationService, $rootScope) {
                mockNotificationService = notificationService;
                rootScope = $rootScope;

                mockNotificationObject = {
                    read: true,
                    closed: false,
                    topic : {name:"mockNotification", title: "mockTitle"},
                    text: "mock-notification-message",
                    callBackDelegate : function(){
                        return "mock-callback";
                    }
                };

            }));

            it('is defined', function() {
                expect(mockNotificationService).toBeDefined();
            });

            it('allow to send notification', function() {
                mockNotificationService.sendNotification("test message", {name:"PatientNotification", title: "Patient Changed"}, function(){

                });

                mockNotificationService.sendNotification("test message1", {name:"PatientNotification1", title: "Patient Changed"}, function(){

                });

                expect(mockNotificationService.notifications.ReturnObjectList().length).toEqual(2);
            });


            it('returns the notification list', function() {
                mockNotificationService.sendNotification("test message3", {name:"PatientNotification3", title: "Patient Changed"}, function(){

                });

                expect(mockNotificationService.getNotifications().getValue('PatientNotification3').text).toEqual('test message3');
            });

            it('should update topic with same name', function() {
                mockNotificationService.sendNotification("test message3", {name:"PatientNotification3", title: "Patient Changed"}, function(){

                });

                expect(mockNotificationService.getNotifications().getValue('PatientNotification3').text).toEqual('test message3');

                mockNotificationService.sendNotification("test message3-changed", {name:"PatientNotification3", title: "Patient Changed"}, function(){

                });

                expect(mockNotificationService.getNotifications().getValue('PatientNotification3').text).toEqual('test message3-changed');
            });

            it('should return the notification object with keyname', function() {

                mockNotificationService.sendNotification(mockNotificationObject.text, mockNotificationObject.topic, mockNotificationObject.callBackDelegate);

                expect(mockNotificationService.readNotification(mockNotificationObject.topic.name).text).toBe(mockNotificationObject.text);

                expect(mockNotificationService.readNotification('not-exists')).toEqual(undefined);

            });

            it('sendNotificationAll should clear not notification and call the callback delegate', function() {

                mockNotificationService.sendNotification(mockNotificationObject.text, mockNotificationObject.topic, mockNotificationObject.callBackDelegate);

                expect(mockNotificationService.notifications.ReturnObjectList().length).toEqual(1);

                //this should clear all notifications
                mockNotificationService.sendNotificationAll();

                expect(mockNotificationService.notifications.ReturnObjectList().length).toEqual(0);

            });

        });
    });
})();