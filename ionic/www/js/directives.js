/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var McbDirectives = angular.module('YafraApp.directives', []);

/**
 * Handle external URLs
 */
McbDirectives.directive("openExternal", ['$window', function ($window) {
	'use strict';

	return {
		restrict: 'E',
		scope: {
			url: "=",
			exit: "&",
			loadStart: "&",
			loadStop: "&",
			loadError: "&"
		},
		transclude: true,
		template: "<button class='btn' ng-click='openUrl()'><span ng-transclude></span></button>",
		controller: function ($scope) {

			var wrappedFunction = function (action) {
				return function () {
					$scope.$apply(function () {
						action();
					});
				};
			};
			var inAppBrowser;
			$scope.openUrl = function () {
				inAppBrowser = $window.open($scope.url, '_system', 'location=yes');
				//console.log("ext url: opened the url in system browser");
				if ($scope.exit instanceof Function) {
					inAppBrowser.addEventListener('exit', wrappedFunction($scope.exit));
				}
				if ($scope.loadStart instanceof Function) {
					inAppBrowser.addEventListener('loadstart', wrappedFunction($scope.loadStart));
				}
				if ($scope.loadStop instanceof Function) {
					inAppBrowser.addEventListener('loadstop', wrappedFunction($scope.loadStop));
				}
				if ($scope.loadError instanceof Function) {
					inAppBrowser.addEventListener('loaderror', wrappedFunction($scope.loadError));
				}
			};
			$scope.$on("$destroy", function () {
				if (inAppBrowser !== null) {

					inAppBrowser.removeEventListener('exit', wrappedFunction($scope.exit));

					if ($scope.exit) {
						inAppBrowser.removeEventListener('exit', wrappedFunction($scope.exit));
					}
					if ($scope.loadStart) {
						inAppBrowser.removeEventListener('loadstart', wrappedFunction($scope.loadStart));
					}
					if ($scope.loadStop) {
						inAppBrowser.removeEventListener('loadstop', wrappedFunction($scope.loadStop));
					}
					if ($scope.loadError) {
						inAppBrowser.removeEventListener('loaderror', wrappedFunction($scope.loadError));
					}
				}

			});
		}
	};
}]);

/**
 * Handle Google Maps API V3+
 */
// - Documentation: https://developers.google.com/maps/documentation/
McbDirectives.directive("appMap", function ($window, $timeout, $rootScope, $filter, SysMsg) {
	'use strict';
	var maps, numberOfMaps, infoWindows, numberOfInfoWins, wrapper;
	var myMarkers, myMarkerListeners;

	// Append a hidden wrapper that will contain unused maps
	wrapper = document.createElement('div');
	wrapper.id = 'googleMapWrapper';
	document.body.appendChild(wrapper);

	// Count the number of maps instantiated
	numberOfMaps = 0;
	numberOfInfoWins = 0;
	// Object used to keep Google Map instances, they are accessible by an auto-incremented id
	maps = {};
	infoWindows = {};

	return {
		restrict: "E",
		replace: true,
		template: '<div id="map_canvas" data-tap-disabled="true" style="width: 95%; height: 85%; margin:10px;"></div>',
		scope: {
			center: "=",        // Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
			markers: "=",       // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: "hello" }]</code>).
			width: "@",         // Map width in pixels.
			height: "@",        // Map height in pixels.
			zoom: "@",          // Zoom level (one is totally zoomed out, 25 is very much zoomed in).
			mapTypeId: "@",     // Type of tile to show on the map (roadmap, satellite, hybrid, terrain).
			panControl: "@",    // Whether to show a pan control on the map.
			zoomControl: "@",   // Whether to show a zoom control on the map.
			scaleControl: "@"   // Whether to show scale control on the map.
		},
		link: function (scope, element, attrs, controller) {
			var map, infowindow;
			var newMarkers;
			var callbackName = 'InitMapCb';
			var mapContainer;

			// callback when google maps is loaded
			$window[callbackName] = function () {
				SysMsg.debug("map: init callback, create map and markers 1st time");
				createMap();
			};

			if (!$window.google || !$window.google.maps) {
				SysMsg.debug("map: map js not available - load now gmap js");
				loadGMaps();
			}
			else {
				SysMsg.debug("map: IS available - create only new map or reuse existing now");
				createMap();
			}
			function loadGMaps() {
				SysMsg.debug("map: start loading js gmaps");
				var script = $window.document.createElement('script');
				script.type = 'text/javascript';
				script.src = 'http://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyC7YQiQf3c_QWXlAvzlYJ8m27jLAIuSuvU&sensor=true&callback=InitMapCb';
				$window.document.body.appendChild(script);
			}

			function createMap() {
				// If there is no unused map available, let's create one
				myMarkerListeners = [];
				myMarkers = [];
				if (wrapper.children.length === 0) {
					SysMsg.debug("map: NO map available - create new map");
					var mapOptions = {
						zoom: 13,
						//center: new google.maps.LatLng(47.55, 7.59),
						center: new google.maps.LatLng(scope.center.lat, scope.center.lon),
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						panControl: false,
						zoomControl: false,
						mapTypeControl: true,
						scaleControl: false,
						streetViewControl: false,
						navigationControl: false,
						disableDefaultUI: false,
						overviewMapControl: false
					};
					numberOfMaps++;
					mapContainer = document.createElement('div');
					mapContainer.dataset.mapId = numberOfMaps;
					mapContainer.dataset.infoId = numberOfInfoWins;
					mapContainer.style.width = '100%';
					mapContainer.style.height = '100%';
					mapContainer.classList.add('map');
					wrapper.appendChild(mapContainer);
					map = maps[numberOfMaps] = new google.maps.Map(mapContainer, mapOptions);
					google.maps.event.addDomListener(mapContainer, 'mousedown', function (e) {
						e.preventDefault();
						return false;
					});
					infowindow = infoWindows[numberOfInfoWins] = new google.maps.InfoWindow();
				}
				// If there is a free map available, let's use it
				else {
					SysMsg.debug("map: already one available - reuse now");
					mapContainer = wrapper.children[0];
					map = maps[mapContainer.dataset.mapId];
					infowindow = infoWindows[mapContainer.dataset.infoId];
				}

				// We move the map from the hidden wrapper to it's destination
				element[0].appendChild(mapContainer);

				// We need to call resize
				google.maps.event.trigger(map, 'resize');

				// If the map gets removed from the DOM, let's rescue it
				element[0].addEventListener('DOMNodeRemovedFromDocument', function () {
					wrapper.appendChild(element[0].children[0]);
				});
			}

			scope.$watch('markers', function () {
				SysMsg.debug("map: watch markers triggered");
				setTimeout(function () {
					updateMarkers();
				}, 1500);
			});

			scope.$watch('center', function () {
				if (map && scope.center) {
					map.setCenter(new google.maps.LatLng(scope.center.lat, scope.center.lon));
				}
			});

			// Info window trigger function 
			function onItemClick(pin, label, datum, url) {
				// Create content
				var myTime = $filter('date')(datum, 'HH:mm');
				var myDate = $filter('date')(datum, 'dd.MM.-HH:mm');
				var contentString = '<div id="content">'+
					'<div id="siteNotice">'+
					'</div>'+
					'<h4 id="firstHeading" class="firstHeading">'+
					label +
					'</h4>'+
					'<div id="bodyContent">'+
					'<p>Zyt: ' +
					myDate +
					'</p>'+
					'</div>'+
					'</div>';

				SysMsg.debug("map: info windows for " + label + " Zyt " + myDate);
				// Replace our Info Window's content and position
				infowindow.setContent(contentString);
				infowindow.setPosition(pin.position);
				infowindow.open(map);
				google.maps.event.addListener(infowindow, 'closeclick', function () {
					SysMsg.debug("map: info windows close listener triggered ");
					infowindow.close();
				});
			}

			function markerCb(marker, member, location) {
				return function () {
					SysMsg.debug("map: marker listener for " + member.name);
					var href = "http://maps.apple.com/?q=" + member.lat + "," + member.lon;
					map.setCenter(location);
					onItemClick(marker, member.name, member.date, href);
				};
			}

			// update map markers to match scope marker collection
			function updateMarkers() {
				SysMsg.debug("map: make markers START");
				if (map && scope.markers) {
					SysMsg.debug("map: scope.markers length " + scope.markers.length);
					if (scope.markers.length < 1) {return;}
					// remove all existing markers first
					deleteMarkers();
					// create new markers
					var markers = scope.markers;
					if (angular.isString(markers)) {markers = scope.$eval(scope.markers);}
					for (var i = 0; i < markers.length; i++) {
						var listener;
						var m = markers[i];
						//SysMsg.debug("map: make marker for " + m.name);
						var loc = new google.maps.LatLng(m.lat, m.lon);
						var mm = new google.maps.Marker({position: loc, map: map, title: m.name});
						listener = google.maps.event.addListener(mm, 'click', markerCb(mm, m, loc));
						myMarkerListeners.push(listener);
						myMarkers.push(mm);
					}
				}
			}

			// Sets the map on all markers in the array. if map is null it will remove markers
			function setAllMap(map) {
				for (var i = 0; i < myMarkers.length; i++) {
					myMarkers[i].setMap(map);
					google.maps.event.removeListener(myMarkerListeners[i]);
				}
			}

			// Removes the markers from the map, but keeps them in the array.
			function clearMarkers() {
				setAllMap(null);
			}

			// Shows any markers currently in the array.
			function showMarkers() {
				setAllMap(map);
			}

			// Deletes all markers in the array by removing references to them.
			function deleteMarkers() {
				clearMarkers();
				myMarkers.length = 0;
				myMarkers = [];
			}

			// convert current location to Google maps location
			function getLocation(loc) {
				if (loc == null) { return new google.maps.LatLng(40, -73);}
				if (angular.isString(loc)) {loc = scope.$eval(loc);}
				return new google.maps.LatLng(loc.lat, loc.lon);
			}

		} // end of link:
	}; // end of return
});
