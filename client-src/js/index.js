window.$ = window.jQuery = require('jquery');
window.angular = require('angular');
window._ = require('underscore');
window.moment = require('moment');
require('moment/locale/pt-br.js');
moment.locale('pt-br');

window.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

require('angular-ui-router');
require('angular-resource');
require('ng-dialog');

/* -- Loopback generated service -- */
require('./service.js');
/* -------------------------------- */

var app = angular.module('update', [
  'update.service',
  'ngDialog',
  'ui.router'
]);
app.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  '$httpProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    $locationProvider.hashPrefix('!');

    $stateProvider
    .state('home', {
      url: '/',
      controller: 'HomeCtrl',
      templateUrl: '/views/home.html'
    })
    .state('explore', {
      url: '/explore/',
      templateUrl: '/views/pages/explore.html'
    })

    /*
    * Trailing slash rule
    */
    $urlRouterProvider.rule(function($injector, $location) {
      var path = $location.path(),
      search = $location.search(),
      params;

      // check to see if the path already ends in '/'
      if (path[path.length - 1] === '/') {
        return;
      }

      // If there was no search string / query params, return with a `/`
      if (Object.keys(search).length === 0) {
        return path + '/';
      }

      // Otherwise build the search string and return a `/?` prefix
      params = [];
      angular.forEach(search, function(v, k){
        params.push(k + '=' + v);
      });

      return path + '/?' + params.join('&');
    });
  }
])
.run([
  '$rootScope',
  '$location',
  '$window',
  'ngDialog',
  function($rootScope, $location, $window, ngDialog) {
    /*
    * Analytics
    */
    $rootScope.$on('$stateChangeSuccess', function(ev, toState, toParams, fromState, fromParams) {

      if($window._gaq && fromState.name) {
        $window._gaq.push(['_trackPageview', $location.path()]);
      }
      if(fromState.name) {
        ngDialog.closeAll();
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
    });
  }
]);

require('./controllers.js')(app);
require('./directives.js')(app);

angular.element(document).ready(function() {
  angular.bootstrap(document, ['update']);
});
