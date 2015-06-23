(function() {
  var app = angular.module('dartsApp', ['ui.bootstrap', 'dialogs.main']);

  app.service('loginService', function() {
      var loginservice = this;
      var isAuthorised = false;
      var invalidAttempt = false;

      loginservice.isAuthorised = function() {
          return isAuthorised;
      },

      loginservice.isInvalidAttempt = function() {
          return invalidAttempt;
      },

      loginservice.login = function(username, password) {
          if (username === 'admin' && password === 'admin') {
              isAuthorised = true;                
              invalidAttempt = false;
          } else {
              invalidAttempt = true;
          }
      };

      loginservice.logout = function() {        
          isAuthorised = false;
      };
  });

  app.service('groupService', function() {
      var groupservice = this;
      groupservice.groups = [];

      groupservice.getGroups = function() {
          return groupservice.groups;
      },

      groupservice.setGroups = function(groups) {
          groupservice.groups = groups;
      }
  });

  app.service('weekService', function() {
      var weekservice = this;
      weekservice.weeks = [];

      weekservice.getWeeks = function() {
          return weekservice.weeks;
      },

      weekservice.setWeeks = function(weeks) {
          weekservice.weeks = weeks;
      }
  });

  app.service('venueService', function() {
      var venueservice = this;
      venueservice.venues = [];

      venueservice.getVenues = function() {
          return venueservice.venues;
      },

      venueservice.setVenues = function(venues) {
          venueservice.venues = venues;
      }
  });

  app.service('playerService', function() {
      var playerservice = this;
      playerservice.players = [];

      playerservice.getPlayers = function() {
          return playerservice.players;
      },

      playerservice.setPlayers = function(players) {
          playerservice.players = players;
      }
  });
  
  app.controller('NavigationController', ['loginService', function(loginService) {
    var navigationCtrl = this;
    navigationCtrl.tab = 'home';

    navigationCtrl.isSet = function(checkTab) {
        return navigationCtrl.tab === checkTab;
    };

    navigationCtrl.setTab = function(setTab) {
        navigationCtrl.tab = setTab;
    };

    navigationCtrl.showPrivilegedData = function() {
      return loginService.isAuthorised();
    }
  }]);
  
  app.controller('PlayerController', ['$scope', '$http', 'loginService', 'groupService', 'playerService', 
  function($scope, $http, loginService, groupService, playerService) {
    var playerCtrl = this;

    var isGroupSelectedAttempt = false;
    var isDuplicateplayerAttempt = false;

    playerCtrl.getPlayers = function() {
        return playerService.getPlayers();
    },

    playerCtrl.showPrivilegedData = function() {
        return loginService.isAuthorised();
    },

    playerCtrl.getGroups = function() {
        return groupService.getGroups();
    },

    playerCtrl.isDuplicatePlayerAttempt = function() {
        return isDuplicateplayerAttempt;
    },

    playerCtrl.isGroupSelectedAttempt = function() {
        return isGroupSelectedAttempt;
    },

    $http.get('http://localhost:3000/players').success(function(data) {
        playerService.setPlayers(data.players);
    });

    $scope.addPlayer = function() {
        isGroupSelectedAttempt = false;
        isDuplicateplayerAttempt = false;
        var forename = $scope.forename;
        var surname = $scope.surname;
        var group = $scope.playergroup;
        var email = ($scope.email) ? $scope.email : 'unknown';
        var phone = ($scope.phonenumber) ? $scope.phonenumber : 'unknown';

        for (var player in playerService.getPlayers()) {
            if (playerService.getPlayers().hasOwnProperty(player)) {
                // if there's a match then alert the user the group already exists                
                if (playerService.getPlayers()[player].forename.toLowerCase() === forename.toLowerCase()
                   && playerService.getPlayers()[player].surname.toLowerCase() === surname.toLowerCase()
                ) {
                    isDuplicateplayerAttempt = true;
                    $scope.forename = '';
                    $scope.surname = '';
                    $scope.email = '';
                    $scope.phonenumber = '';
                }
            }
        }
        
        if (!isDuplicateplayerAttempt) {
            if (group && group.id) {
                $http.post('http://localhost:3000/player/' + forename + '/' + surname + '/' + phone + '/' + email + '/' + group.id).success(function(data) {
                    // refresh controllers internal state for players
                    $http.get('http://localhost:3000/players').success(function(data) {
                        playerService.setPlayers(data.players);
                        $scope.forename = '';
                        $scope.surname = '';
                        $scope.email = '';
                        $scope.phonenumber = '';
                    });
                });
            } else {
                isGroupSelectedAttempt = true;
            }
        }
    }
  }]);

  app.controller('WeekController', ['$scope', '$http', 'loginService', 'weekService', function($scope, $http, loginService, weekService) {
    var weekCtrl = this;
    var isDuplicateWeekAttempt = false;

    weekCtrl.showPrivilegedData = function() {
        return loginService.isAuthorised();
    },

    weekCtrl.isDuplicateWeekAttempt = function() {
        return isDuplicateWeekAttempt;
    },

    weekCtrl.getWeeks = function() {
        return weekService.getWeeks();
    },

    $http.get('http://localhost:3000/weeks').success(function(data) {
        weekService.setWeeks(data.weeks);
    });
    
    $scope.addWeek = function() {
        isDuplicateWeekAttempt = false;

        for (var week in weekService.getWeeks()) {
            if (weekService.getWeeks().hasOwnProperty(week)) {
                // if there's a match then alert the user the week already exists
                if (weekService.getWeeks()[week].name === $scope.weekname) {
                    isDuplicateWeekAttempt = true;
                    $scope.weekname = '';
                }
            }
        }
        
        if (!isDuplicateWeekAttempt) {
            $http.post('http://localhost:3000/week/' + $scope.weekname).success(function(data) {
                $scope.weekname = '';
                isDuplicateWeekAttempt = false;
                // refresh controllers internal state for weeks
                $http.get('http://localhost:3000/weeks').success(function(data) {
                    weekService.setWeeks(data.weeks);
                });
            });
        }
    }
  }]);
  
  app.controller('GroupController', ['$scope', '$http', 'loginService', 'groupService', 'dialogs', function($scope, $http, loginService, groupService, dialogs) {
    var groupCtrl = this

    var isDuplicateGroupAttempt = false;

    groupCtrl.getGroups = function() {
        return groupService.groups;
    },

    groupCtrl.isDuplicateGroupAttempt = function() {
        return isDuplicateGroupAttempt;
    },

    groupCtrl.showPrivilegedData = function() {
        return loginService.isAuthorised();
    },

    groupCtrl.editGroup  = function() {
        console.log('Edit');
    },

    groupCtrl.deleteGroup  = function() {

        var dialog = dialogs.confirm('Please Confirm', 'Are you sure you want to delete the group?');
        dialog.result.then(function(btn) {
            console.log('Group Deleted');
            // TODO: add call to server delete API
        }, function(btn){
            // do nothing - user chose not to delete the group
        });
    },

    $http.get('http://localhost:3000/groups').success(function(data) {
        groupService.setGroups(data.groups);
    });
    
    $scope.addGroup = function() {
        isDuplicateGroupAttempt = false;

        for (var group in groupService.getGroups()) {
            if (groupService.getGroups().hasOwnProperty(group)) {
                // if there's a match then alert the user the group already exists
                if (groupService.getGroups()[group].name === $scope.groupname) {
                    isDuplicateGroupAttempt = true;
                    $scope.groupname = '';
                }
            }
        }
        
        if (!isDuplicateGroupAttempt) {
            $http.post('http://localhost:3000/group/' + $scope.groupname).success(function(data) {
                $scope.groupname = '';
                isDuplicateGroupAttempt = false;
                // refresh controllers internal state for groups
                $http.get('http://localhost:3000/groups').success(function(data) {
                    groupService.setGroups(data.groups);
                });
            });
        }
    }
  }]);
  
  app.controller('VenueController', ['$scope', '$http', 'venueService', function($scope, $http, venueService) {
    var venueCtrl = this;
    var isDuplicateVenueAttempt = false;
    
    venueCtrl.isDuplicateVenueAttempt = function() {
        return isDuplicateVenueAttempt;
    },

    venueCtrl.getVenues = function() {
        return venueService.getVenues();
    },

    $http.get('http://localhost:3000/venues').success(function(data) {
        venueService.setVenues(data.venues);
    });
    
    $scope.addVenue = function() {
        isDuplicateVenueAttempt = false;

        for (var venue in venueService.getVenues()) {
            if (venueService.getVenues().hasOwnProperty(venue)) {
                // if there's a match then alert the user the group already exists
                if (venueService.getVenues()[venue].name === $scope.venuename) {
                    isDuplicateVenueAttempt = true;
                    $scope.venuename = '';
                }
            }
        }
        
        if (!isDuplicateVenueAttempt) {
            $http.post('http://localhost:3000/venue/' + $scope.venuename).success(function(data) {
                $scope.venuename = '';
                isDuplicateVenueAttempt = false;
                // refresh controllers internal state for venues
                $http.get('http://localhost:3000/venues').success(function(data) {
                    venueService.setVenues(data.venues);
                });
            });
        }
    }
  }]);
  
  app.controller('FixtureController', ['$scope', '$http', 'loginService', 'weekService', 'groupService', 'venueService', 'playerService', 
  function($scope, $http, loginService, weekService, groupService, venueService, playerService) {
    var fixtureCtrl = this;
    fixtureCtrl.fixtures = [];
    var isIncompleteFormAttempt = false;
    var isDuplicatePlayerAttempt = false;
    var isPlayerAlsoMarkerAttempt = false;
    var isDuplicateFixtureAttempt = false;

    fixtureCtrl.showPrivilegedData = function() {
        return loginService.isAuthorised();
    },

    fixtureCtrl.getWeeks = function() {
        return weekService.getWeeks();
    },

    fixtureCtrl.getGroups = function() {
        return groupService.getGroups();
    },

    fixtureCtrl.getVenues = function() {
        return venueService.getVenues();
    },

    fixtureCtrl.getPlayers = function() {
        return playerService.getPlayers();
    },

    fixtureCtrl.isIncompleteFormAttempt = function() {
        return isIncompleteFormAttempt;
    },

    fixtureCtrl.isDuplicatePlayerAttempt = function() {
        return isDuplicatePlayerAttempt;
    },

    fixtureCtrl.isPlayerAlsoMarkerAttempt = function() {
        return isPlayerAlsoMarkerAttempt;
    },

    fixtureCtrl.isDuplicateFixtureAttempt = function() {
        return isDuplicateFixtureAttempt;
    },

    $http.get('http://localhost:3000/fixtures').success(function(data) {
        fixtureCtrl.fixtures = data.fixtures;
    });

    $scope.addFixture = function() {
        isIncompleteFormAttempt = false;
        isDuplicatePlayerAttempt = false;
        isPlayerAlsoMarkerAttempt = false;
        isDuplicateFixtureAttempt = false;
        var week = $scope.week;
        var group = $scope.group;
        var orderOfPlay = $scope.orderofplay;
        var venue = $scope.venue;
        var player1 = $scope.playerone;
        var player2 = $scope.playertwo;
        var marker1 = $scope.markerone;
        var marker2 = $scope.markertwo;

        if (!(week && group && venue && player1 && player2 && marker1 && marker2)) {
            isIncompleteFormAttempt = true;
        }

        if (player1 && player2 && player1 === player2) {
            isDuplicatePlayerAttempt = true;
        }

        if ((player1 && player2 && marker1 && marker2) && 
        (player1 === marker1 || player1 === marker2 || player2 === marker1 || player2 === marker2)
        ) {
            isPlayerAlsoMarkerAttempt = true;
        }

        if (!isIncompleteFormAttempt && !isDuplicatePlayerAttempt && !isPlayerAlsoMarkerAttempt) {

            for (var fixture in fixtureCtrl.fixtures) {
                if (fixtureCtrl.fixtures.hasOwnProperty(fixture)) {
                    // if there's a match then alert the user the fixture already exists
                    if (fixtureCtrl.fixtures[fixture].weekNumber.toLowerCase() === week.name.toLowerCase()
                       && fixtureCtrl.fixtures[fixture].orderOfPlay.toString().toLowerCase() === orderOfPlay.toLowerCase()
                       && fixtureCtrl.fixtures[fixture].group.toLowerCase() === group.name.toLowerCase()
                       && fixtureCtrl.fixtures[fixture].venue.toLowerCase() === venue.name.toLowerCase()
                       && fixtureCtrl.fixtures[fixture].playerOne.toLowerCase() === (player1.forename + ' ' + player1.surname).toLowerCase()
                       && fixtureCtrl.fixtures[fixture].playerTwo.toLowerCase() === (player2.forename + ' ' + player2.surname).toLowerCase()
                       && fixtureCtrl.fixtures[fixture].markerOne.toLowerCase() === (marker1.forename + ' ' + marker1.surname).toLowerCase()
                       && fixtureCtrl.fixtures[fixture].markerTwo.toLowerCase() === (marker2.forename + ' ' + marker2.surname).toLowerCase()
                    ) {
                        isDuplicateFixtureAttempt = true;
                    }
                }
            }

            if (!isDuplicateFixtureAttempt) {
                $http.post('http://localhost:3000/fixture/' + week.id + '/' + orderOfPlay + '/' + venue.id + '/' + group.id + '/' + player1.id + '/' + player2.id + '/' + marker1.id + '/' + marker2.id).success(function(data) {
                    // refresh controllers internal state for fixtures
                    $http.get('http://localhost:3000/fixtures').success(function(data) {
                        fixtureCtrl.fixtures = data.fixtures;
                        $scope.week = '';
                        $scope.group = '';
                        $scope.orderofplay = '';
                        $scope.venue = '';
                        $scope.playerone = '';
                        $scope.playertwo = '';
                        $scope.markerone = '';
                        $scope.markertwo = '';
                    });
                });            
            }
        }
    }
  }]);
  
  app.controller('LoginController', ['$scope', 'loginService', function($scope, loginService) {
    var loginCtrl = this;
    
    loginCtrl.isAuthorised = function() {
        return loginService.isAuthorised();
    },

    loginCtrl.isInvalidAttempt = function() {
        return loginService.isInvalidAttempt();
    },

    $scope.login = function() {
        loginService.login($scope.username, $scope.password);
        $scope.username = '';
        $scope.password = '';
    },

    $scope.logout = function() {
        loginService.logout();
    }
  }]);
  
  app.directive('playersList', function() {
    return {
      restrict: 'E',
      templateUrl: 'players.html'
    };
  });
  
  app.directive('loginForm', function() {
    return {
      restrict: 'E',
      templateUrl: 'login.html'
    };
  });

  app.directive('groupsList', function() {
    return {
      restrict: 'E',
      templateUrl: 'groups.html'
    };
  });
  
  app.directive('venuesList', function() {
    return {
      restrict: 'E',
      templateUrl: 'venues.html'
    };
  });
  
  app.directive('weeksList', function() {
    return {
      restrict: 'E',
      templateUrl: 'weeks.html'
    };
  });
  
  app.directive('fixturesList', function() {
    return {
      restrict: 'E',
      templateUrl: 'fixtures.html'
    };
  });
})();