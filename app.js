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
                          $scope.higherMealRateCity = $scope.twoCities[0]
                          $scope.lowerMealRateCity = $scope.twoCities[1]
                        }
                        else{
                          $scope.higherMealRateCity = $scope.twoCities[1]
                          $scope.lowerMealRateCity = $scope.twoCities[0]
                        }
          var allMonthshigherMealRateCity = [$scope.higherMealRateCity.Jan, $scope.higherMealRateCity.Feb,
                      $scope.higherMealRateCity.Mar, $scope.higherMealRateCity.Apr,
                      $scope.higherMealRateCity.May, $scope.higherMealRateCity.Jun,
                      $scope.higherMealRateCity.Jul, $scope.higherMealRateCity.Aug,
                      $scope.higherMealRateCity.Sep, $scope.higherMealRateCity.Oct,
                      $scope.higherMealRateCity.Nov, $scope.higherMealRateCity.Dec]


                var higherMealRateCitySum = allMonthshigherMealRateCity.reduce(function(last, thisOne){
                    return parseInt(last) + parseInt(thisOne)
                  })

                var higherMealRateCityLodgingAverage = (higherMealRateCitySum / 12)


            var allMonthslowerMealRateCity = [$scope.lowerMealRateCity.Jan, $scope.lowerMealRateCity.Feb,
                  $scope.lowerMealRateCity.Mar, $scope.lowerMealRateCity.Apr,
                  $scope.lowerMealRateCity.May, $scope.lowerMealRateCity.Jun,
                  $scope.lowerMealRateCity.Jul, $scope.lowerMealRateCity.Aug,
                  $scope.lowerMealRateCity.Sep, $scope.lowerMealRateCity.Oct,
                  $scope.lowerMealRateCity.Nov, $scope.lowerMealRateCity.Dec]

            var lowerMealRateCitySum = allMonthslowerMealRateCity.reduce(function(last, thisOne){
                return parseInt(last) + parseInt(thisOne)
              })
              var lowerMealRateCityLodgingAverage = (lowerMealRateCitySum / 12)

              if(lowerMealRateCityLodgingAverage > higherMealRateCityLodgingAverage){
                $scope.higherLodgingCity = $scope.lowerMealRateCity
                $scope.lowerLodgingCity = $scope.higherMealRateCity
                $scope.higherLodgingRate = $scope.lowerMealRateCityLodgingAverage
                $scope.lowerLodgingRate = $scope.higherMealRateCityLodgingAverage

              }
              else{
                $scope.higherLodgingCity = $scope.higherMealRateCity
                $scope.lowerLodgingCity = $scope.lowerMealRateCity
                $scope.higherLodgingRate = higherMealRateCityLodgingAverage
                $scope.lowerLodgingRate = lowerMealRateCityLodgingAverage
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
