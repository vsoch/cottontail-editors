/**
 * created by maya on 17.9.2015.
 */

'use strict';

angular.module('registryApp.common')
	.controller('LicensePickerCtrl', ['$scope', 'lodash', 'Licenses', '$q', function ($scope, _, Licenses, $q) {
		$scope.licenses = Licenses.getLicenses();
		var list = [];
		for (var key in $scope.licenses) {
			if ($scope.licenses.hasOwnProperty(key)) {
				var license = $scope.licenses[key];
				license.id = key;
				list.push(license);
			}
		}

		function filterFunction (list, input) {
			var regex = new RegExp(input.toLowerCase().split('').join('.*'));

			return _(list).filter(function (license) {
				var nameScore = license.name.toLowerCase().search(regex);
				var idScore = license.id.toLowerCase().search(regex);

				if (nameScore !== -1 || idScore !== -1) {
					license.score = nameScore !== -1 ? nameScore : idScore;
					return license;
				}
			}).sortBy('score').value().slice(0, 6);
		}

		$scope.filterResults = function(input) {
			var deferred = $q.defer();

			deferred.resolve(filterFunction(list, input));

			return deferred.promise;
		}
	}])

	.directive('licensePicker', ['$templateCache', function($templateCache) {
		return {
			restrict: 'E',
			scope: {
				ngModel: '='
			},
			template: $templateCache.get('views/partials/license-picker.html'),
			controller: 'LicensePickerCtrl'
		};
	}]);