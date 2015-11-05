module.exports = function(app) {

  app.controller('MainCtrl', [
    '$scope',
    'User',
    function($scope, User) {

      $scope.loggedIn = false;
      $scope.$watch(function() {
        return User.isAuthenticated();
      }, function(auth) {
        $scope.loggedIn = auth;
      });
      $scope.logout = function() {
        User.logout(function() {
          $scope.loggedIn = false;
        });
      };

      $scope.nav = false;
      $scope.toggleNav = function() {
        if($scope.nav) {
          $scope.nav = false;
        } else {
          $scope.nav = true;
        }
      }
      $scope.isHome = true;
      $scope.$on('$stateChangeSuccess', function(ev, to) {
        $scope.nav = false;
        if(to.name == 'home')
          $scope.isHome = true;
        else
          $scope.isHome = false;
      });

      $scope.ratio = {
        'questions': 130,
        'replied': 60
      };
    }
  ]);

};
