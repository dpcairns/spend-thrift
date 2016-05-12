var spendthrift = angular.module('spendthrift', ['ui.router', 'ngAnimate']);

spendthrift.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  	.state('home', {
    url: "",
    templateUrl: "/partials/home.html",
    })
})
.directive('cityData', function () {
    return {
        restrict: 'E',
        scope: {
            title: '@',
               },
        templateUrl: '/partials/cityData.html',
        controller: function CityDataCtrl($scope, $http) {
          $scope.findCity = function(cityInput, stateInput){
            $http.post(
'https://inventory.data.gov/api/action/datastore_search?resource_id=996f733b-7f9c-4011-a1a0-9768f67c1623&filters={"FiscalYear":"2014","State":"' + stateInput + '","City":"' + cityInput + '" }'
).then(function successCallback(response){
  if(!response.data.result.records[0]) {$scope.APIError = true}
  else{
            $scope.APIError = false
            $scope.citySuccess = true
            let city = response.data.result.records[0]
            $scope.city = response.data.result.filters.City
            $scope.state = city.State
            $scope.meals = city.Meals
            $scope.priceByMonth = [
              city.Jan, city.Feb,
              city.Mar, city.Apr,
              city.May, city.Jun,
              city.Jul, city.Aug,
              city.Sep, city.Oct,
              city.Nov, city.Dec
            ]

          }
        })
          function errorCallback(response){
            $scope.citySuccess = false
            $scope.APIError = true
          }
        }

          }, //Embed a custom controller in the directive
        link: function ($scope, element, attrs) { } //DOM manipulation
    }
  })
