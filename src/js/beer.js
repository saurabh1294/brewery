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

beerContainerApp.filter('minLength', function() {
	return function(input, len, pad) {
		input = input.toString();
		if (input.length >= len) return input;
		else {
			pad = (pad || 0).toString();
			return new Array(1 + len - input.length).join(pad) + input;
		}
	};
});

beerContainerApp.filter('searchFor', function() {

	// All filters must return a function. The first parameter
	// is the data that is to be filtered, and the second is an
	// argument that may be passed with a colon (searchFor:searchString)


});

angular.module('beerContainerDemo').controller('ContainerCtrl', ['$scope', '$q', '$http', '$filter', '$interval', 'beerContainerService', 
function($scope, $q, $http, $filter, $interval, beerContainerService) {

	// make web service call here and fetch all data including page numbers
	$interval(function() {
		beerContainerService.getContainerTemperatures().then(function(response) {
			//console.log("HERE", response);

			plotGraph(response);
		});
	}, 1000);



	function plotGraph(response) {

		var data = response;
		var svg = d3.select("svg"),
			margin = {
				top: 20,
				right: 20,
				bottom: 30,
				left: 40
			},
			width = +svg.attr("width") - margin.left - margin.right,
			height = +svg.attr("height") - margin.top - margin.bottom;

		var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
			y = d3.scaleLinear().rangeRound([height, 0]);

		svg.selectAll("*").remove();
		var g = svg.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


		x.domain(data.map(function(d) {
			return d.containerNumber;
		}));
		y.domain([0, d3.max(data, function(d) {
			return 15; //d.temperature;
		})]);

		g.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

		g.append("g")
			.attr("class", "axis axis--y")
			.call(d3.axisLeft(y).tickFormat(d3.format("%s,C")))
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", "0.71em")
			.attr("text-anchor", "end")
			.text("temperature");

		g.selectAll(".bar")
			.data(data)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) {
				return x(d.containerNumber);
			})
			.attr("y", function(d) {
				return y(d.temperature);
			})
			.attr("width", x.bandwidth())
			.attr("height", function(d) {
				return height - y(d.temperature);
			});

	}
}])