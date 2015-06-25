(function() {
  var app = angular.module('dartsApp', ['ui.bootstrap', 'dialogs.main']);

  var baseUrl = !(document.location.port) ?
      'http://' + document.location.hostname :
      'http://' + document.location.hostname + ':' + document.location.port;

  app.service('loginService', ['dialogs', function(dialogs) {
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
              dialogs.error('Error', 'Login attempt unsuccessful.');
          }
      };

      loginservice.logout = function() {        
          isAuthorised = false;
      };
  }]);

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
  
  app.controller('PlayerController', ['$scope', '$http', 'loginService', 'groupService', 'playerService', 'dialogs', 
  function($scope, $http, loginService, groupService, playerService, dialogs) {
    var playerCtrl = this;

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

    // gets the template to ng-include for a table row / item
    playerCtrl.getTemplate = function (player) {
        if ($scope.selected && player.id === $scope.selected.id) { 
            return 'player-edit';
        } else {
            return 'player-display';
        }
    };

    playerCtrl.deleteRecord  = function(id) {

        var dialog = dialogs.confirm('Please Confirm', 'Are you sure you want to delete the player?');
        dialog.result.then(function(btn) {
            $http.delete(baseUrl + '/player/' + id).success(function(data) {
                // refresh controllers internal state for players
                $http.get(baseUrl + '/players').success(function(data) {
                    playerService.setPlayers(data.players);
                });
            });
        }, function(btn){
            // do nothing - user chose not to delete the player
        });
    },

    playerCtrl.saveChanges = function (id, forename, surname, email, phone) {

        $http.put(baseUrl + '/player/' + id + '/' + forename + '/' + surname + '/' + email + '/' + phone).success(function(data) {
            // refresh controllers internal state for players
            $http.get(baseUrl + '/players').success(function(data) {
                playerService.setPlayers(data.players);
            });
        });
        playerCtrl.cancelChanges();
    };

    playerCtrl.edit = function (player) {
        $scope.selected = angular.copy(player);
    };

    playerCtrl.cancelChanges = function () {
        $scope.selected = {};
    };

    $http.get(baseUrl + '/players').success(function(data) {
        playerService.setPlayers(data.players);
    });

    $scope.addPlayer = function() {
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
                    dialogs.error('Oops...', 'It looks like you tried to enter a player that already exists in the system.');
                }
            }
        }
        
        if (!isDuplicateplayerAttempt) {
            if (group && group.id) {
                $http.post(baseUrl + '/player/' + forename + '/' + surname + '/' + phone + '/' + email + '/' + group.id).success(function(data) {
                    // refresh controllers internal state for players
                    $http.get(baseUrl + '/players').success(function(data) {
                        playerService.setPlayers(data.players);
                        $scope.forename = '';
                        $scope.surname = '';
                        $scope.email = '';
                        $scope.phonenumber = '';
                    });
                });
            } else {
                dialogs.notify('Doh!','Remember to select a group.');
            }
        }
    }
  }]);

  app.controller('WeekController', ['$scope', '$http', 'loginService', 'weekService', 'dialogs', function($scope, $http, loginService, weekService, dialogs) {
    var weekCtrl = this;
    var isDuplicateWeekAttempt = false;

    weekCtrl.showPrivilegedData = function() {
        return loginService.isAuthorised();
    },

    weekCtrl.getWeeks = function() {
        return weekService.getWeeks();
    },

    $http.get(baseUrl + '/weeks').success(function(data) {
        weekService.setWeeks(data.weeks);
    });

        // gets the template to ng-include for a table row / item
    weekCtrl.getTemplate = function (week) {
        if ($scope.selected && week.id === $scope.selected.id) { 
            return 'week-edit';
        } else {
            return 'week-display';
        }
    };

    weekCtrl.deleteRecord  = function(id) {

        var dialog = dialogs.confirm('Please Confirm', 'Are you sure you want to delete the week?');
        dialog.result.then(function(btn) {
            $http.delete(baseUrl + '/week/' + id).success(function(data) {
                // refresh controllers internal state for weeks
                $http.get(baseUrl + '/weeks').success(function(data) {
                    weekService.setWeeks(data.weeks);
                });
            });
        }, function(btn){
            // do nothing - user chose not to delete the week
        });
    },

    weekCtrl.saveChanges = function (id, name) {
        $http.put(baseUrl + '/week/' + id + '/' + name).success(function(data) {
            // refresh controllers internal state for weeks
            $http.get(baseUrl + '/weeks').success(function(data) {
                weekService.setWeeks(data.weeks);
            });
        });
        weekCtrl.cancelChanges();
    };

    weekCtrl.edit = function (week) {
        $scope.selected = angular.copy(week);
    };

    weekCtrl.cancelChanges = function () {
        $scope.selected = {};
    };
    
    $scope.addWeek = function() {
        isDuplicateWeekAttempt = false;

        for (var week in weekService.getWeeks()) {
            if (weekService.getWeeks().hasOwnProperty(week)) {
                // if there's a match then alert the user the week already exists
                if (weekService.getWeeks()[week].name === $scope.weekname) {
                    isDuplicateWeekAttempt = true;
                    $scope.weekname = '';
                    dialogs.error('Oops...', 'It looks like you tried to enter a week that already exists in the system.');
                }
            }
        }
        
        if (!isDuplicateWeekAttempt) {
            $http.post(baseUrl + '/week/' + $scope.weekname).success(function(data) {
                $scope.weekname = '';
                isDuplicateWeekAttempt = false;
                // refresh controllers internal state for weeks
                $http.get(baseUrl + '/weeks').success(function(data) {
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

    groupCtrl.showPrivilegedData = function() {
        return loginService.isAuthorised();
    },

    // gets the template to ng-include for a table row / item
    groupCtrl.getTemplate = function (group) {
        if ($scope.selected && group.id === $scope.selected.id) { 
            return 'group-edit';
        } else {
            return 'group-display';
        }
    };

    groupCtrl.deleteRecord  = function(id) {

        var dialog = dialogs.confirm('Please Confirm', 'Are you sure you want to delete the group?');
        dialog.result.then(function(btn) {
            $http.delete(baseUrl + '/group/' + id).success(function(data) {
                // refresh controllers internal state for groups
                $http.get(baseUrl + '/groups').success(function(data) {
                    groupService.setGroups(data.groups);
                });
            });
        }, function(btn){
            // do nothing - user chose not to delete the group
        });
    },

    groupCtrl.saveChanges = function (id, name) {
        $http.put(baseUrl + '/group/' + id + '/' + name).success(function(data) {
            // refresh controllers internal state for groups
            $http.get(baseUrl + '/groups').success(function(data) {
                groupService.setGroups(data.groups);
            });
        });
        groupCtrl.cancelChanges();
    };

    groupCtrl.edit = function (group) {
        $scope.selected = angular.copy(group);
    };

    groupCtrl.cancelChanges = function () {
        $scope.selected = {};
    };

    $http.get(baseUrl + '/groups').success(function(data) {
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
                    dialogs.error('Oops...', 'It looks like you tried to enter a group that already exists in the system.');
                }
            }
        }
        
        if (!isDuplicateGroupAttempt) {
            $http.post(baseUrl + '/group/' + $scope.groupname).success(function(data) {
                $scope.groupname = '';
                isDuplicateGroupAttempt = false;
                // refresh controllers internal state for groups
                $http.get(baseUrl + '/groups').success(function(data) {
                    groupService.setGroups(data.groups);
                });
            });
        }
    }
  }]);
  
  app.controller('VenueController', ['$scope', '$http', 'venueService', 'loginService', 'dialogs', function($scope, $http, venueService, loginService, dialogs) {
    var venueCtrl = this;
    var isDuplicateVenueAttempt = false;

    venueCtrl.showPrivilegedData = function() {
        return loginService.isAuthorised();
    },

    venueCtrl.getVenues = function() {
        return venueService.getVenues();
    },

    // gets the template to ng-include for a table row / item
    venueCtrl.getTemplate = function (venue) {
        if ($scope.selected && venue.id === $scope.selected.id) { 
            return 'venue-edit';
        } else {
            return 'venue-display';
        }
    };

    venueCtrl.deleteRecord  = function(id) {

        var dialog = dialogs.confirm('Please Confirm', 'Are you sure you want to delete the board?');
        dialog.result.then(function(btn) {
            $http.delete(baseUrl + '/venue/' + id).success(function(data) {
                // refresh controllers internal state for venues
                $http.get(baseUrl + '/venues').success(function(data) {
                    venueService.setVenues(data.venues);
                });
            });
        }, function(btn){
            // do nothing - user chose not to delete the group
        });
    },

    venueCtrl.saveChanges = function (id, name) {
        $http.put(baseUrl + '/venue/' + id + '/' + name).success(function(data) {
            // refresh controllers internal state for venues
            $http.get(baseUrl + '/venues').success(function(data) {
                venueService.setVenues(data.venues);
            });
        });
        venueCtrl.cancelChanges();
    };

    venueCtrl.edit = function (group) {
        $scope.selected = angular.copy(group);
    };

    venueCtrl.cancelChanges = function () {
        $scope.selected = {};
    };

    $http.get(baseUrl + '/venues').success(function(data) {
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
                    dialogs.error('Oops...', 'It looks like you tried to enter a board that already exists in the system.');
                }
            }
        }
        
        if (!isDuplicateVenueAttempt) {
            $http.post(baseUrl + '/venue/' + $scope.venuename).success(function(data) {
                $scope.venuename = '';
                isDuplicateVenueAttempt = false;
                // refresh controllers internal state for venues
                $http.get(baseUrl + '/venues').success(function(data) {
                    venueService.setVenues(data.venues);
                });
            });
        }
    }
  }]);
  
  app.controller('FixtureController', ['$scope', '$http', 'loginService', 'weekService', 'groupService', 'venueService', 'playerService', 'dialogs',
  function($scope, $http, loginService, weekService, groupService, venueService, playerService, dialogs) {
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

    $http.get(baseUrl + '/fixtures').success(function(data) {
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
            dialogs.notify('Doh!','You need to ensure all fields are complete.');
        }

        if (player1 && player2 && player1 === player2) {
            isDuplicatePlayerAttempt = true;
            dialogs.notify('Doh!','Players can\'t play themselves.');
        }

        if ((player1 && player2 && marker1 && marker2) && 
        (player1 === marker1 || player1 === marker2 || player2 === marker1 || player2 === marker2)
        ) {
            isPlayerAlsoMarkerAttempt = true;
            dialogs.notify('Doh!','You don\'t expect a player to mark their own game do you?');
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
                        dialogs.error('Oops...', 'It looks like you tried to enter a fixture that already exists in the system.');
                    }
                }
            }

            if (!isDuplicateFixtureAttempt) {
                $http.post(baseUrl + '/fixture/' + week.id + '/' + orderOfPlay + '/' + venue.id + '/' + group.id + '/' + player1.id + '/' + player2.id + '/' + marker1.id + '/' + marker2.id).success(function(data) {
                    // refresh controllers internal state for fixtures
                    $http.get(baseUrl + '/fixtures').success(function(data) {
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

  app.controller('ResultController', ['$scope', '$http', 'loginService', 'dialogs', function($scope, $http, loginService, dialogs) {
    var resultCtrl = this;
    resultCtrl.results = [];

    resultCtrl.showPrivilegedData = function() {
        return loginService.isAuthorised();
    },

    // gets the template to ng-include for a table row / item
    resultCtrl.getTemplate = function (venue) {
        if ($scope.selected && venue.id === $scope.selected.id) { 
            return 'result-edit';
        } else {
            return 'result-display';
        }
    };

    resultCtrl.deleteRecord  = function(id) {

        var dialog = dialogs.confirm('Please Confirm', 'Are you sure you want to delete the result?');
        dialog.result.then(function(btn) {
            $http.delete(baseUrl + '/result/' + id).success(function(data) {
                // refresh controllers internal state for results
                $http.get(baseUrl + '/results').success(function(data) {
                    resultCtrl.results = data.results;
                });
            });
        }, function(btn){
            // do nothing - user chose not to delete the result
        });
    },

    resultCtrl.saveChanges = function (id, p1legs, p2legs) {
        $http.put(baseUrl + '/result/' + id + '/' + p1legs + '/' + p2legs).success(function(data) {
            // refresh controllers internal state for results
            $http.get(baseUrl + '/results').success(function(data) {
                resultCtrl.results = data.results;
            });
        });
        resultCtrl.cancelChanges();
    };

    resultCtrl.edit = function (result) {
        $scope.selected = angular.copy(result);
    };

    resultCtrl.cancelChanges = function () {
        $scope.selected = {};
    };

    $http.get(baseUrl + '/results').success(function(data) {
        resultCtrl.results = data.results;
    });
  }]);

  app.controller('AchievementController', ['$scope', '$http', 'loginService', 'dialogs', function($scope, $http, loginService, dialogs) {
    var achievementCtrl = this;
    achievementCtrl.player180s = [];
    achievementCtrl.highfinishes = [];
    achievementCtrl.bestlegs = [];
    achievementCtrl.tab = 'player180s';

    achievementCtrl.showPrivilegedData = function() {
        return loginService.isAuthorised();
    },

    achievementCtrl.isSet = function(checkTab) {
        return achievementCtrl.tab === checkTab;
    };

    achievementCtrl.setTab = function(setTab) {
        achievementCtrl.tab = setTab;
    };

    achievementCtrl.isBestLeg = function(numberOfDarts) {
        var isBestLeg = true;

        for (var bestleg in achievementCtrl.bestlegs) {
            if (achievementCtrl.bestlegs.hasOwnProperty(bestleg)) {
                var currentNumberOfDarts = achievementCtrl.bestlegs[bestleg].numberOfDarts;
                if (currentNumberOfDarts < numberOfDarts) {
                    isBestLeg = false;
                }
            }
        }
        return isBestLeg;
    };

    achievementCtrl.isHighestFinish = function(checkout) {
        var isHighestFinish = true;

        for (var highfinish in achievementCtrl.highfinishes) {
            if (achievementCtrl.highfinishes.hasOwnProperty(highfinish)) {
                var currentHighFinish = achievementCtrl.highfinishes[highfinish].checkout;
                if (currentHighFinish > checkout) {
                    isHighestFinish = false;
                }
            }
        }
        return isHighestFinish;
    };

    // gets the template to ng-include for a table row / item
    achievementCtrl.getTemplate = function (venue) {
        if ($scope.selected && venue.id === $scope.selected.id) { 
            return 'achievement-edit';
        } else {
            return 'achievement-display';
        }
    };

    $http.get(baseUrl + '/180s').success(function(data) {
        achievementCtrl.player180s = data.player180s;
    });
    $http.get(baseUrl + '/highfinishes').success(function(data) {
        achievementCtrl.highfinishes = data.highfinishes;
    });
    $http.get(baseUrl + '/bestlegs').success(function(data) {
        achievementCtrl.bestlegs = data.bestlegs;
    });
  }]);

  app.controller('LoginController', ['$scope', 'loginService', function($scope, loginService) {
    var loginCtrl = this;
    
    loginCtrl.isAuthorised = function() {
        return loginService.isAuthorised();
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

  app.directive('resultsList', function() {
    return {
      restrict: 'E',
      templateUrl: 'results.html'
    };
  });

  app.directive('achievementsList', function() {
    return {
      restrict: 'E',
      templateUrl: 'achievements.html'
    };
  });
})();