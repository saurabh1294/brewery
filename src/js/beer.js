var beerContainerApp = angular.module('beerContainerDemo', []);

beerContainerApp.service('beerContainerService', ['$http', '$q', function($http, $q) {
	this.getContainerTemperatures = function() {
		var data = {};
		return $http({
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			},
			url: "http://localhost:8000/getData"
		}).then(function mySuccess(response) {
			data = response;
			console.log(data);
			return $q.resolve(response.data);
		}, function myError(response) {
			data = response;
			console.log(response.statusText, "ERROR");
			return $q.resolve(response.data);
		});

	}
}]);



angular.module('beerContainerDemo').controller('ContainerCtrl', ['$scope', '$q', '$http', '$filter', '$interval', 'beerContainerService', 
function($scope, $q, $http, $filter, $interval, beerContainerService) {
	
	$scope.containerTemps = ['4°C - 6°C', '5°C - 6°C', '4°C - 7°C', '6°C - 8°C', '3°C - 5°C'];

	// make web service call here and fetch all data including page numbers
	$interval(function() {
		beerContainerService.getContainerTemperatures().then(function(response) {
			//console.log("HERE", response);
			$scope.containers = response;
		});
	}, 1000);

	$scope.checkTemperature = function(temperature, index) {
		var temps = this.containerTemps[index].match(/\d+/g);
		console.log(temps , "TEMPS", temperature);
		if (temperature < parseInt(temps[0]) || temperature > parseInt(temps[1])) {
			return true;	// temperature warning condition
			// we can set notifications here to send SMS or email notifications
		}
		
		return false;
	}

}])