var ionicnlchatdemo = angular.module('ionicnlchatdemo', ['ionic', 'firebase']);

ionicnlchatdemo.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
	// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
	// for form inputs)
	if(window.cordova && window.cordova.plugins.Keyboard) {
	  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
	}
	if(window.StatusBar) {
	  StatusBar.styleDefault();
	}
  });
})

// All the routing (from intropage to chatpage)
ionicnlchatdemo.config(function($stateProvider, $urlRouterProvider) {
	// Routing
	$stateProvider.state('index', {
		url: '/index',
		views: {
			'app-view': {
				templateUrl: 'templates/index.html',
				controller: 'loginController'
			}
		}
	})
	.state('chatpage', {
		url: '/chatpage/:userName',
		views: {
			'app-view': {
				templateUrl: 'templates/chat.html',
				controller: 'chatController'
			}
		}
	});

	$urlRouterProvider.otherwise('/index');
});


ionicnlchatdemo.controller('loginController', ['$scope', '$state', '$ionicPopup', function($scope, $state, $ionicPopup) {
	// Create the scope.data
	$scope.data = {};

	// When the 'chat' button is clicked, check if username is not empty
	$scope.startChat = function() {
		if($scope.data.userName != '' && $scope.data.userName !== undefined) {
			$state.go('chatpage', {userName: $scope.data.userName})
		}
		else {
			var alertPopup = $ionicPopup.alert({
     			title: 'Geen naam ingevuld',
     			template: 'Voer alsjeblieft een naam in!'
   			});
		}
	}
}]);

ionicnlchatdemo.controller('chatController', ['$scope', '$state', '$stateParams', '$firebaseArray', '$ionicScrollDelegate',  function($scope, $state, $stateParams, $firebaseArray, $ionicScrollDelegate) {
    
	$scope.userName = $stateParams.userName;

    var ref = new Firebase('https://ionicnl-chat-demo.firebaseio.com/messages');
    $scope.messages = $firebaseArray(ref);
 	
 	// Watch the updates. When a new message is posted, scroll to bottom
    $scope.messages.$watch(function() {
        $ionicScrollDelegate.scrollBottom(true);
    });

    // Function to send the message
    $scope.sendMessage = function () {
    	var timestamp = new Date();
    	timestamp = timestamp.getTime();
    	
    	$scope.messages.$add({
        'user': $scope.userName,
        'message' : $scope.data.chatMessage,
        'timestamp' : timestamp
      });

    	// Empty the message bar after sending the message
    	$scope.data.chatMessage = '';
    }   
}]);