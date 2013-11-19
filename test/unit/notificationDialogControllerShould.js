'use strict';
(function () {
    describe('Notify dialog controller,', function () {
        var fakeRootScope, mockNotificationService, mockDialog, mockNotificationObject, fakeDialog;
        beforeEach(module('myApp'));

        beforeEach(inject(function ($rootScope, notificationService, $controller, $modal) {
            fakeRootScope = $rootScope.$new();
            mockNotificationService = notificationService;
            fakeDialog = $modal;

            fakeRootScope.mockDialog = {
                close: function (arg){},
                dismiss: function (arg) {}
            };

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

            //need to initialize notifyController since it raises a syn broadcast which is handled by dialogcontroller,
            $controller('notificationController',
                {
                    $scope: fakeRootScope,
                    $timeout : fakeRootScope.timeout,
                    notifierService: mockNotificationService,
                    $modal: fakeDialog,
                    $rootScope : fakeRootScope
                });

            $controller('notificationDialogController',
                {$scope: fakeRootScope, notifierService: mockNotificationService, $modalInstance: fakeRootScope.mockDialog});
        }));

        it('initial notification count is 0', function () {

            expect(fakeRootScope.notifyData.length).toEqual(0);
        });

        it('dialog should update on new notification even when it is open', function () {
            // no notification initially
            expect(fakeRootScope.notifyData.length).toEqual(0);

            //notification added
            mockNotificationService.sendNotification(mockNotificationObject.text, mockNotificationObject.topic, mockNotificationObject.callBackDelegate);

            //expect count to equal 1
            expect(fakeRootScope.notifyData.length).toEqual(1);

        });

        it('on acceptAll should clear all notifications', function () {
            //notification added
            mockNotificationService.sendNotification(mockNotificationObject.text, mockNotificationObject.topic, mockNotificationObject.callBackDelegate);

            //expect count to equal 1
            expect(fakeRootScope.notifyData.length).toEqual(1);

            fakeRootScope.onAcceptAllClicked();

            expect(fakeRootScope.notifyData.length).toEqual(0);

        });

        it('on accept should clear 1 notifications', function () {
            //2 notification added
            mockNotificationService.sendNotification(mockNotificationObject.text, mockNotificationObject.topic, mockNotificationObject.callBackDelegate);
            mockNotificationService.sendNotification(mockNotificationObject.text, {name:"mockNotification1", title: "mockTitle1"}, mockNotificationObject.callBackDelegate);
            //expect count to equal 2
            expect(fakeRootScope.notifyData.length).toEqual(2);

            //remove one notification
            fakeRootScope.acceptClicked(mockNotificationService.readNotification(mockNotificationObject.topic.name));

            //expect count = 1
            expect(fakeRootScope.notifyData.length).toEqual(1);

            //remove 2nd notification
            fakeRootScope.acceptClicked(mockNotificationService.readNotification('mockNotification1'));

            //expect count = 0
            expect(fakeRootScope.notifyData.length).toEqual(0);

        });

        it('should close dialog when cancel clicked', function () {
            spyOn(fakeRootScope.mockDialog, "dismiss").andCallThrough();

            //fake cancel clicked
            fakeRootScope.onCancelClicked();

            expect(fakeRootScope.mockDialog.dismiss).toHaveBeenCalled();
        });

    });
})();
