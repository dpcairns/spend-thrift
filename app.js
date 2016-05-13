var spendthrift = angular.module('spendthrift', ['ui.router', 'ngAnimate', 'angular-loading-bar']);

spendthrift.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  	.state('home', {
    url: "",
    templateUrl: "/partials/home.html",
    })
})
.directive('compareTwo', function(){
  return {
      restrict: 'E',
      scope: {
          title: '@',
             },
      templateUrl: '/partials/compareTwo.html',
      controller: function compareTwoCtrl($scope) {
        $scope.$on('cityFound', function (event, args) {
              if (!$scope.twoCities) { $scope.twoCities = [] }
              if($scope.twoCities.length<1){
                $scope.twoCities.push(args.thisCity)
              }
              else
              {
                  if (args.whichOne==="left"){
                    $scope.twoCities[0] = args.thisCity
                  }
                  else{
                    $scope.twoCities[1] = args.thisCity
                  }
            }
              console.table($scope.twoCities)

            if ($scope.twoCities.length===2){
                        if($scope.twoCities[0].Meals > $scope.twoCities[1].Meals){
                          $scope.city1 = $scope.twoCities[0]
                          $scope.city2 = $scope.twoCities[1]
                        }
                        else{
                          $scope.city1 = $scope.twoCities[1]
                          $scope.city2 = $scope.twoCities[0]
                        }
          var allMonthsCity1 = [$scope.city1.Jan, $scope.city1.Feb,
                      $scope.city1.Mar, $scope.city1.Apr,
                      $scope.city1.May, $scope.city1.Jun,
                      $scope.city1.Jul, $scope.city1.Aug,
                      $scope.city1.Sep, $scope.city1.Oct,
                      $scope.city1.Nov, $scope.city1.Dec]


                var city1Sum = allMonthsCity1.reduce(function(last, thisOne){
                    return parseInt(last) + parseInt(thisOne)
                  })

                $scope.city1LodgingAverage = (city1Sum / 12)


            var allMonthsCity2 = [$scope.city2.Jan, $scope.city2.Feb,
                  $scope.city2.Mar, $scope.city2.Apr,
                  $scope.city2.May, $scope.city2.Jun,
                  $scope.city2.Jul, $scope.city2.Aug,
                  $scope.city2.Sep, $scope.city2.Oct,
                  $scope.city2.Nov, $scope.city2.Dec]

            var city2Sum = allMonthsCity2.reduce(function(last, thisOne){
                return parseInt(last) + parseInt(thisOne)
              })
              $scope.city2LodgingAverage = (city2Sum / 12)

              if($scope.city2LodgingAverage > $scope.city1LodgingAverage){
                $scope.city1Lodging = $scope.twoCities[1]
                $scope.city2Lodging = $scope.twoCities[0]
                $scope.higherLodgingRate = $scope.city2LodgingAverage
                $scope.lowerLodgingRate = $scope.city1LodgingAverage

              }
              else{
                $scope.city1Lodging = $scope.twoCities[0]
                $scope.city2Lodging = $scope.twoCities[1]
                $scope.higherLodgingRate = $scope.city1LodgingAverage
                $scope.lowerLodgingRate = $scope.city2LodgingAverage
              }
          }

  });
          },


        link: function($scope, element, attributes){


            }
        }
      })
.directive('cityData', function () {
    return {
        restrict: 'E',
        scope: {
            title: '@',
            whichOne: '@'
               },
        templateUrl: '/partials/cityData.html',
        controller: function CityDataCtrl($scope, $http) {
          $scope.findCity = function(cityInput, stateInput){
            $http.post(
'https://inventory.data.gov/api/action/datastore_search?resource_id=996f733b-7f9c-4011-a1a0-9768f67c1623&filters={"State":"' + stateInput + '","City":"' + cityInput + '" }'
).then(function successCallback(response){
  console.warn($scope)
  if(!response.data.result.records[0]) {$scope.APIError = true; $scope.citySuccess = false}
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
            console.log($scope.whichOne)
            $scope.$emit('cityFound', {thisCity: city, whichOne: $scope.whichOne});
            };

          })
        }
          function errorCallback(response){
            $scope.citySuccess = false
            $scope.APIError = true
          }
        }, //Embed a custom controller in the directive
        link: function ($scope, element, attrs) {

        } //DOM manipulation
      }
  })
