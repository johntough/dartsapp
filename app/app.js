(function() {
  var app = angular.module('dartsApp', ['ui.bootstrap', 'dialogs.main', 'ngAnimate', 'toastr']);

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

  app.service('playerService', ['$http', function($http) {
      var playerservice = this;
      playerservice.players = [];

      playerservice.getPlayers = function() {
          return playerservice.players;
      },      

      playerservice.setPlayers = function(players) {
          playerservice.players = players;
      }
  }]);

  app.service('fixtureService', ['$http', function($http) {
      var fixtureservice = this;
      fixtureservice.fixtures = [];

      fixtureservice.getFixtures = function() {
          return fixtureservice.fixtures;
      },      

      fixtureservice.setFixtures = function(fixtures) {
          var formattedFixtures = [];

          for (var fixture in fixtures) {
              if (fixtures.hasOwnProperty(fixture)) {
                  fixtures[fixture].weekDateFormatted = Date.parse(fixtures[fixture].weekDate);
                  formattedFixtures.push(fixtures[fixture]);
              }
          }
          fixtureservice.fixtures = formattedFixtures;
      }
  }]);

  app.service('resultService', function() {
      var resultservice = this;
      resultservice.results = [];

      resultservice.getResults = function() {
          return resultservice.results;
      },      

      resultservice.setResults = function(results) {
          var formattedResults = [];

          for (var result in results) {
              if (results.hasOwnProperty(result)) {
                  results[result].weekDateFormatted = Date.parse(results[result].weekDate);
                  formattedResults.push(results[result]);
              }
          }
          resultservice.results = formattedResults;
      }
  });

  app.service('highFinishService', function() {
      var highfinishservice = this;
      highfinishservice.finishes = [];

      highfinishservice.getFinishes = function() {
          return highfinishservice.finishes;
      },

      highfinishservice.setFinishes = function(finishes) {
          highfinishservice.finishes = finishes;
      }
  });

  app.service('bestLegService', function() {
      var bestlegservice = this;
      bestlegservice.legs = [];

      bestlegservice.getLegs = function() {
          return bestlegservice.legs;
      },

      bestlegservice.setLegs = function(legs) {
          bestlegservice.legs = legs;
      }
  });

  app.service('player180Service', function() {
      var player180service = this;
      player180service.player180s = [];

      player180service.get180s = function() {
          return player180service.player180s;
      },

      player180service.set180s = function(player180s) {
          player180service.player180s = player180s;
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
  
  app.controller('PlayerController', ['$scope', '$http', 'loginService', 'groupService', 'playerService', 'dialogs', 'toastr', 'toastrConfig',
  function($scope, $http, loginService, groupService, playerService, dialogs, toastr, toastrConfig) {
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

    playerCtrl.showAddForm = function() {
        var dialog = dialogs.create('/addplayersdialog.html', 'AddPlayerController', {}, {size:'lg', keyboard: true, backdrop: true, windowClass: 'my-class'});
        dialog.result.then(function() {
            // refresh controllers internal state for players
            $http.get(baseUrl + '/players').success(function(data) {
                playerService.setPlayers(data.players);
                toastrConfig.positionClass = 'toast-bottom-right';
                toastrConfig.timeOut = 2000;
                toastr.success('Player added!');
            });
        },function() {
            // do nothing as user did not add week
        });
    }
  }]);

  app.controller('WeekController', ['$scope', '$http', 'loginService', 'weekService', 'dialogs', 'toastr', 'toastrConfig', function($scope, $http, loginService, weekService, dialogs, toastr, toastrConfig) {
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
    
    weekCtrl.showAddForm = function() {
        var dialog = dialogs.create('/addweeksdialog.html', 'AddWeekController', {}, {size:'lg', keyboard: true, backdrop: true, windowClass: 'my-class'});
        dialog.result.then(function() {
            // refresh controllers internal state for weeks
            $http.get(baseUrl + '/weeks').success(function(data) {
                weekService.setWeeks(data.weeks);
                toastrConfig.positionClass = 'toast-bottom-right';
                toastrConfig.timeOut = 2000;
                toastr.success('Week added!');
            });
        },function() {
            // do nothing as user did not add week
        });
    }
  }]);
  
  app.controller('GroupController', ['$scope', '$http', 'loginService', 'groupService', 'dialogs', 'toastr', 'toastrConfig', function($scope, $http, loginService, groupService, dialogs, toastr, toastrConfig) {
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
    
    groupCtrl.showAddForm = function() {
        var dialog = dialogs.create('/addgroupsdialog.html', 'AddGroupController', {}, {size:'lg', keyboard: true, backdrop: true, windowClass: 'my-class'});
        dialog.result.then(function() {
            // refresh controllers internal state for groups
            $http.get(baseUrl + '/groups').success(function(data) {
                groupService.setGroups(data.groups);
                toastrConfig.positionClass = 'toast-bottom-right';
                toastrConfig.timeOut = 2000;
                toastr.success('Group added!');
            });
        },function() {
            // do nothing as user did not add week
        });
    }
  }]);
  
  app.controller('VenueController', ['$scope', '$http', 'venueService', 'loginService', 'dialogs', 'toastr', 'toastrConfig', function($scope, $http, venueService, loginService, dialogs, toastr, toastrConfig) {
    var venueCtrl = this;

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

    venueCtrl.showAddForm = function() {
        var dialog = dialogs.create('/addvenuesdialog.html', 'AddVenueController', {}, {size:'lg', keyboard: true, backdrop: true, windowClass: 'my-class'});
        dialog.result.then(function() {
            // refresh controllers internal state for venues
            $http.get(baseUrl + '/venues').success(function(data) {
                venueService.setVenues(data.venues);
                toastrConfig.positionClass = 'toast-bottom-right';
                toastrConfig.timeOut = 2000;
                toastr.success('Board added!');
            });
        },function() {
            // do nothing as user did not add venue
        });
    }
  }]);

  app.controller('AddWeekController', ['$scope', '$http', '$modalInstance', 'data', 'weekService', 'dialogs', function($scope, $http, $modalInstance, data, weekService, dialogs) {
    var addWeekCtrl = this;
    $scope.week = {name : '', date: ''};

    $scope.cancel = function() {
      $modalInstance.dismiss('canceled');  
    };
  
    $scope.save = function() {
      // converting the date into a readable string
      $scope.week.date = $scope.week.date.toLocaleDateString(
          'en-UK',
          { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
      );
      addWeekCtrl.addWeek($scope.week.name, $scope.week.date);
      $modalInstance.close();
    };

    $scope.openDatePicker = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.datePickerOpened = true;
    };

    addWeekCtrl.addWeek = function(weekname, weekdate) {
        isDuplicateWeekAttempt = false;

        for (var week in weekService.getWeeks()) {
            if (weekService.getWeeks().hasOwnProperty(week)) {
                // if there's a match then alert the user the week already exists
                if (weekService.getWeeks()[week].name === weekname) {
                    isDuplicateWeekAttempt = true;
                    dialogs.error('Oops...', 'It looks like you tried to enter a week that already exists in the system.');
                }
            }
        }
        
        if (!isDuplicateWeekAttempt) {
            $http.post(baseUrl + '/week/' + weekname + '/' + weekdate).success(function(data) {
                // do nothing
            });
        }
    }
  }]);

  app.controller('AddGroupController', ['$scope', '$http', '$modalInstance', 'data', 'groupService', 'dialogs', function($scope, $http, $modalInstance, data, groupService, dialogs) {
    var addGroupCtrl = this;
    $scope.group = {name : ''};

    $scope.cancel = function() {
      $modalInstance.dismiss('canceled');  
    };
  
    $scope.save = function() {
      addGroupCtrl.addGroup($scope.group.name);
      $modalInstance.close();
    };

    addGroupCtrl.addGroup = function(groupname) {
        isDuplicateGroupAttempt = false;

        for (var group in groupService.getGroups()) {
            if (groupService.getGroups().hasOwnProperty(group)) {
                // if there's a match then alert the user the group already exists
                if (groupService.getGroups()[group].name === groupname) {
                    isDuplicateGroupAttempt = true;
                    dialogs.error('Oops...', 'It looks like you tried to enter a group that already exists in the system.');
                }
            }
        }
        
        if (!isDuplicateGroupAttempt) {
            $http.post(baseUrl + '/group/' + groupname).success(function(data) {
                // do nothing
            });
        }
    }
  }]);

  app.controller('AddVenueController', ['$scope', '$http', '$modalInstance', 'data', 'venueService', 'dialogs', function($scope, $http, $modalInstance, data, venueService, dialogs) {
    var addVenueCtrl = this;
    $scope.venue = {name : ''};

    $scope.cancel = function() {
      $modalInstance.dismiss('canceled');  
    };
  
    $scope.save = function() {
      addVenueCtrl.addVenue($scope.venue.name);
      $modalInstance.close();
    };

    addVenueCtrl.addVenue = function(venuename) {
        isDuplicateVenueAttempt = false;

        for (var venue in venueService.getVenues()) {
            if (venueService.getVenues().hasOwnProperty(venue)) {
                // if there's a match then alert the user the group already exists
                if (venueService.getVenues()[venue].name === venuename) {
                    isDuplicateVenueAttempt = true;
                    dialogs.error('Oops...', 'It looks like you tried to enter a board that already exists in the system.');
                }
            }
        }
        
        if (!isDuplicateVenueAttempt) {
            $http.post(baseUrl + '/venue/' + venuename).success(function(data) {
                // do nothing
            });
        }
    }
  }]);

  app.controller('AddPlayerController', ['$scope', '$http', '$modalInstance', 'data', 'groupService', 'playerService', 'dialogs', function($scope, $http, $modalInstance, data, groupService, playerService, dialogs) {
    var addPlayerCtrl = this;
    $scope.player = {forename: '', surname: '', group: '', email: '', phonenumber: ''};

    $scope.getGroups = function() {
        return groupService.getGroups();
    },

    $scope.cancel = function() {
      $modalInstance.dismiss('canceled');  
    };
  
    $scope.save = function() {
        var email = ($scope.player.email) ? $scope.player.email : 'unknown';
        var phone = ($scope.player.phonenumber) ? $scope.player.phonenumber : 'unknown';

        addPlayerCtrl.addPlayer($scope.player.forename, $scope.player.surname, $scope.player.group, email, phone);
        $modalInstance.close();
    };

    addPlayerCtrl.addPlayer = function(forename, surname, group, email, phone) {
        isDuplicateplayerAttempt = false;

        for (var player in playerService.getPlayers()) {
            if (playerService.getPlayers().hasOwnProperty(player)) {
                // if there's a match then alert the user the player already exists
                if (playerService.getPlayers()[player].forename.toLowerCase() === forename.toLowerCase()
                   && playerService.getPlayers()[player].surname.toLowerCase() === surname.toLowerCase()
                ) {
                    isDuplicateplayerAttempt = true;
                    dialogs.error('Oops...', 'It looks like you tried to enter a player that already exists in the system.');
                }
            }
        }
        
        if (!isDuplicateplayerAttempt) {
            $http.post(baseUrl + '/player/' + forename + '/' + surname + '/' + phone + '/' + email + '/' + group.id).success(function(data) {
                // do nothing
            });
        }
    }
  }]);

  app.controller('AddFixtureController', ['$scope', '$http', '$modalInstance', 'data', 'groupService', 'playerService', 'venueService', 'weekService', 'fixtureService', 'dialogs',
  function($scope, $http, $modalInstance, data, groupService, playerService, venueService, weekService, fixtureService, dialogs) {

    var addFixtureCtrl = this;
    $scope.players = [];
    $scope.fixture = {week: '', group: '', orderofplay: '', playerone: '', playertwo: '', marker1: '', markertwo: ''};

    $scope.getGroups = function() {
        return groupService.getGroups();
    },

    $scope.getWeeks = function() {
        return weekService.getWeeks();
    },

    $scope.getVenues = function() {
        return venueService.getVenues();
    },

    $scope.groupSelected = function(groupId) {
        $http.get(baseUrl + '/players/group/' + groupId).success(function(data) {
            $scope.players = data.players;
        });
    },

    $scope.cancel = function() {
      $modalInstance.dismiss('canceled');  
    };
  
    $scope.save = function() {

        addFixtureCtrl.addFixture(
            $scope.fixture.week,
            $scope.fixture.group,
            $scope.fixture.venue,
            $scope.fixture.orderofplay,
            $scope.fixture.player1,
            $scope.fixture.player2,
            $scope.fixture.marker1,
            $scope.fixture.marker2
        );
        $modalInstance.close();
    };

    addFixtureCtrl.addFixture = function(week, group, venue, orderOfPlay, player1, player2, marker1, marker2) {

        var isDuplicatePlayerAttempt = false;
        var isPlayerAlsoMarkerAttempt = false;
        var isDuplicateFixtureAttempt = false;

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

        if (!isDuplicatePlayerAttempt && !isPlayerAlsoMarkerAttempt) {

            for (var fixture in fixtureService.getFixtures()) {
                if (fixtureService.getFixtures().hasOwnProperty(fixture)) {
                    // if there's a match then alert the user the fixture already exists
                    if (fixtureService.getFixtures()[fixture].weekNumber.toLowerCase() === week.name.toLowerCase()
                       && fixtureService.getFixtures()[fixture].orderOfPlay.toString().toLowerCase() === orderOfPlay.toString().toLowerCase()
                       && fixtureService.getFixtures()[fixture].group.toLowerCase() === group.name.toLowerCase()
                       && fixtureService.getFixtures()[fixture].venue.toLowerCase() === venue.name.toLowerCase()
                       && fixtureService.getFixtures()[fixture].playerOne.toLowerCase() === (player1.forename + ' ' + player1.surname).toLowerCase()
                       && fixtureService.getFixtures()[fixture].playerTwo.toLowerCase() === (player2.forename + ' ' + player2.surname).toLowerCase()
                       && fixtureService.getFixtures()[fixture].markerOne.toLowerCase() === (marker1.forename + ' ' + marker1.surname).toLowerCase()
                       && fixtureService.getFixtures()[fixture].markerTwo.toLowerCase() === (marker2.forename + ' ' + marker2.surname).toLowerCase()
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
                        // do nothing
                    });
                });            
            }
        }
    }
  }]);

  app.controller('CompleteFixtureController', ['$scope', '$http', '$modalInstance', 'data', 'dialogs', 'fixtureService', 'resultService', 'player180Service', 'highFinishService', 'bestLegService',
  function($scope, $http, $modalInstance, data, dialogs, fixtureService, resultService, player180Service, highFinishService, bestLegService) {

    var completeFixtureCtrl = this;
    $scope.player1Achievements = false;
    $scope.player2Achievements = false;

    $scope.player1HighFinishes = '';
    $scope.player2HighFinishes = '';
    $scope.player1BestLegs = '';
    $scope.player2BestLegs = '';
    $scope.result = {player1LegsWon: '', player2LegsWon: ''};

    $scope.player1 = data.fixture.playerOne;
    $scope.player2 = data.fixture.playerTwo;
    $scope.date = data.fixture.weekNumber + ' ( ' +data.fixture.weekDate + ' )';

    $scope.validCheckouts = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117,
        118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139,
        140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 160, 161, 164,
        167, 170
    ];

    $scope.isValidLeg = function(value) {
        var isValid = true;
        if (!Number.isInteger(value) || value === '' || value < 9 || value > 18) {
            isValid = false;
        }
        return isValid;
    },

    $scope.isValidCheckout = function(value) {
        var isValid = true;

        if (!Number.isInteger(value)) {
            isValid = false;
        }
              
        return isValid;
    },

    $scope.addPlayer1Finish = function() {
        if ($scope.isValidCheckout($scope.player1Checkout)) {
            if ($scope.player1HighFinishes === '') {
                $scope.player1HighFinishes = '' + $scope.player1Checkout  + '';
                $scope.player1Checkout = '';
            } else {
                $scope.player1HighFinishes = $scope.player1HighFinishes + ', ' + $scope.player1Checkout;
                $scope.player1Checkout = '';
            }
        }
    },

    $scope.addPlayer2Finish = function() {
        if ($scope.isValidCheckout($scope.player2Checkout)) {
            if ($scope.player2HighFinishes === '') {
                $scope.player2HighFinishes = '' + $scope.player2Checkout + '';
                $scope.player2Checkout = '';
            } else {
                $scope.player2HighFinishes = $scope.player2HighFinishes + ', ' + $scope.player2Checkout;
                $scope.player2Checkout = '';
            }
        }
    },

    $scope.removePlayer1Finish = function() {
        if ($scope.player1HighFinishes !== '') {
            if ($scope.player1HighFinishes.indexOf(',') !== -1) {
                $scope.player1HighFinishes = $scope.player1HighFinishes.substring(0, $scope.player1HighFinishes.length - 5);
            } else {
                $scope.player1HighFinishes = '';
            }
        }
    },

    $scope.removePlayer2Finish = function() {
        if ($scope.player2HighFinishes !== '') {
            if ($scope.player2HighFinishes.indexOf(',') !== -1) {
                $scope.player2HighFinishes = $scope.player2HighFinishes.substring(0, $scope.player2HighFinishes.length - 5);
            } else {
                $scope.player2HighFinishes = '';
            }
        }
    },

    $scope.addPlayer1Leg = function() {
        if ($scope.isValidLeg($scope.player1BestLeg)) {
            if ($scope.player1BestLegs === '') {
                $scope.player1BestLegs = '' + $scope.player1BestLeg + '';
                $scope.player1BestLeg = '';
            } else {
                if ($scope.player1BestLeg === 9) {
                    $scope.player1BestLegs = $scope.player1BestLegs + ',  9';
                    $scope.player1BestLeg = '';
                } else {
                    $scope.player1BestLegs = $scope.player1BestLegs + ', ' + $scope.player1BestLeg;
                    $scope.player1BestLeg = '';
                }

            }
        }
    },

    $scope.addPlayer2Leg = function() {
        if ($scope.isValidLeg($scope.player2BestLeg)) {
            if ($scope.player2BestLegs === '') {
                $scope.player2BestLegs = '' + $scope.player2BestLeg + '';
                $scope.player2BestLeg = '';
            } else {
                if ($scope.player2BestLeg === 9) {
                    $scope.player2BestLegs = $scope.player2BestLegs + ',  9';
                    $scope.player2BestLeg = '';
                } else {
                    $scope.player2BestLegs = $scope.player2BestLegs + ', ' + $scope.player2BestLeg;
                    $scope.player2BestLeg = '';
                }
            }
        }
    },

    $scope.removePlayer1Leg = function() {
        if ($scope.player1BestLegs !== '') {
            if ($scope.player1BestLegs.indexOf(',') !== -1) {
                $scope.player1BestLegs = $scope.player1BestLegs.substring(0, $scope.player1BestLegs.length - 4);
            } else {
                $scope.player1BestLegs = '';
            }
        }
    },

    $scope.removePlayer2Leg = function() {
        if ($scope.player2BestLegs !== '') {
            if ($scope.player2BestLegs.indexOf(',') !== -1) {
                $scope.player2BestLegs = $scope.player2BestLegs.substring(0, $scope.player2BestLegs.length - 4);
            } else {
                $scope.player2BestLegs = '';
            }
        }
    },

    $scope.cancel = function() {
      $modalInstance.dismiss('canceled');  
    };
  
    $scope.save = function() {

        completeFixtureCtrl.addResult();
        $modalInstance.close();
    };

    completeFixtureCtrl.addResult = function() {
        var anyPlayer1180s = ($scope.player1180s && $scope.player1180s > 0) ? true : false;
        var anyPlayer2180s = ($scope.player2180s && $scope.player2180s > 0) ? true : false;

        var anyPlayer1HighFinishes = ($scope.player1HighFinishes !== '') ? true : false;
        var anyPlayer2HighFinishes = ($scope.player2HighFinishes !== '') ? true : false;

        var anyPlayer1BestLegs = ($scope.player1BestLegs !== '') ? true : false;
        var anyPlayer2BestLegs = ($scope.player2BestLegs !== '') ? true : false;

        $http.post(baseUrl + '/result/' + data.fixture.id + '/' + $scope.player1LegsWon + '/' + $scope.player2LegsWon).success(function(data) {
            $http.get(baseUrl + '/results').success(function(data) {
                resultService.setResults(data.results);
            });
        });

        if (anyPlayer1180s) {
            $http.post(baseUrl + '/180/' + $scope.player1180s + '/' + data.fixture.id + '/' + data.fixture.playerOneId).success(function(data) {
                $http.get(baseUrl + '/180s').success(function(data) {
                    player180Service.set180s(data.player180s);
                });
            });
        }
        if (anyPlayer2180s) {
            $http.post(baseUrl + '/180/' + $scope.player2180s + '/' + data.fixture.id + '/' + data.fixture.playerTwoId).success(function(data) {
                $http.get(baseUrl + '/180s').success(function(data) {
                    player180Service.set180s(data.player180s);
                });
            });
        }
        if (anyPlayer1HighFinishes) {
            var highFinishArray = $scope.player1HighFinishes.split(',');

            for (var highFinish in highFinishArray) {
                if (highFinishArray.hasOwnProperty(highFinish)) {
                    $http.post(baseUrl + '/highfinish/' + highFinishArray[highFinish] + '/' + data.fixture.id + '/' + data.fixture.playerOneId).success(function(data) {
                        // do nothing
                    });
                }
            }
            $http.get(baseUrl + '/highfinishes').success(function(data) {
                highFinishService.setFinishes(data.highfinishes);
            });
        }
        if (anyPlayer2HighFinishes) {
            var highFinishArray = $scope.player2HighFinishes.split(',');

            for (var highFinish in highFinishArray) {
                if (highFinishArray.hasOwnProperty(highFinish)) {
                    $http.post(baseUrl + '/highfinish/' + highFinishArray[highFinish] + '/' + data.fixture.id + '/' + data.fixture.playerTwoId).success(function(data) {
                        // do nothing
                    });
                }
            }
            $http.get(baseUrl + '/highfinishes').success(function(data) {
                highFinishService.setFinishes(data.highfinishes);
            });
        }
        if (anyPlayer1BestLegs) {
            var bestLegArray = $scope.player1BestLegs.split(',');

            for (var bestLeg in bestLegArray) {
                if (bestLegArray.hasOwnProperty(bestLeg)) {
                    $http.post(baseUrl + '/bestleg/' + bestLegArray[bestLeg] + '/' + data.fixture.id + '/' + data.fixture.playerOneId).success(function(data) {
                        // do nothing
                    });
                }
            }
            $http.get(baseUrl + '/bestlegs').success(function(data) {
                bestLegService.setLegs(data.bestlegs);
            });
        }
        if (anyPlayer2BestLegs) {
            var bestLegArray = $scope.player2BestLegs.split(',');

            for (var bestLeg in bestLegArray) {
                if (bestLegArray.hasOwnProperty(bestLeg)) {
                    $http.post(baseUrl + '/bestleg/' + bestLegArray[bestLeg] + '/' + data.fixture.id + '/' + data.fixture.playerTwoId).success(function(data) {
                        // do nothing
                    });
                }
            }
            $http.get(baseUrl + '/bestlegs').success(function(data) {
                bestLegService.setLegs(data.bestlegs);
            });
        }
    }
  }]);

  app.controller('FixtureController', ['$scope', '$http', 'loginService', 'fixtureService', 'groupService', 'weekService', 'dialogs', 'toastr', 'toastrConfig',
  function($scope, $http, loginService, fixtureService, groupService, weekService, dialogs, toastr, toastrConfig) {
    var fixtureCtrl = this;

    fixtureCtrl.showPrivilegedData = function() {
        return loginService.isAuthorised();
    },

    fixtureCtrl.getFixtures = function() {
        return fixtureService.getFixtures();
    },

    fixtureCtrl.getGroups = function() {
        return groupService.getGroups();
    },

    fixtureCtrl.getWeeks = function() {
        return weekService.getWeeks();
    },

    $http.get(baseUrl + '/fixtures').success(function(data) {
        fixtureService.setFixtures(data.fixtures);
    });

    fixtureCtrl.filter = function() {        
        if (!$scope.weekfilter | $scope.weekfilter === 'all') {
            if (!$scope.groupfilter | $scope.groupfilter === 'all') {
                $http.get(baseUrl + '/fixtures/').success(function(data) {
                    fixtureService.setFixtures(data.fixtures);
                });
            } else {
                $http.get(baseUrl + '/fixtures/group/' + $scope.groupfilter).success(function(data) {
                    fixtureService.setFixtures(data.fixtures);
                });
            }
        } else {
            if (!$scope.groupfilter | $scope.groupfilter === 'all') {
                $http.get(baseUrl + '/fixtures/week/' + $scope.weekfilter).success(function(data) {
                    fixtureService.setFixtures(data.fixtures);
                });
            } else {
                $http.get(baseUrl + '/fixtures/week/' + $scope.weekfilter + '/group/' + $scope.groupfilter).success(function(data) {
                    fixtureService.setFixtures(data.fixtures);
                });
            }
        }
    },

    fixtureCtrl.showAddForm = function() {
        var dialog = dialogs.create('/addfixturesdialog.html', 'AddFixtureController', {}, {size:'lg', keyboard: true, backdrop: true, windowClass: 'my-class'});
        dialog.result.then(function() {
            // refresh service internal state for fixtures
            $http.get(baseUrl + '/fixtures').success(function(data) {
                fixtureService.setFixtures(data.fixtures);
                toastrConfig.positionClass = 'toast-bottom-right';
                toastrConfig.timeOut = 2000;
                toastr.success('Fixture added!');
            });
        },function() {
            // do nothing as user did not add venue
        });
    },

    fixtureCtrl.completeFixture = function(fixture) {
        var dialog = dialogs.create('/completefixturesdialog.html', 'CompleteFixtureController', {fixture}, {size:'lg', keyboard: true, backdrop: true, windowClass: 'my-class'});
        dialog.result.then(function() {
            // refresh service internal state for fixtures after updating the fixture complete flag
            $http.put(baseUrl + '/fixture/complete/' + fixture.id).success(function(data) {
                $http.get(baseUrl + '/fixtures').success(function(data) {
                    fixtureService.setFixtures(data.fixtures);
                    toastrConfig.positionClass = 'toast-bottom-right';
                    toastrConfig.timeOut = 2000;
                    toastr.success('Result added!');
                });
            });
        },function() {
            // do nothing as user did not add venue
        });
    }
  }]);

  app.controller('ResultController', ['$scope', '$http', 'loginService', 'dialogs', 'resultService', function($scope, $http, loginService, dialogs, resultService) {
    var resultCtrl = this;

    resultCtrl.showPrivilegedData = function() {
        return loginService.isAuthorised();
    },

    resultCtrl.getResults = function() {
        return resultService.getResults();
    },

    resultCtrl.getClass = function(player, result) {
        var win = '{ success : true }';
        var draw = '{ warning : true }';
        var cellClass = '';

        if (result.playerOneLegsWon === result.playerTwoLegsWon) {
            cellClass = draw;
        } else if (player === '1') {
            if (result.playerOneLegsWon > result.playerTwoLegsWon) {
                cellClass = win;
            }
        } else if (player === '2') {
            if (result.playerTwoLegsWon > result.playerOneLegsWon) {
                cellClass = win;
            }
        }
        return cellClass;
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
                    resultService.setResults(data.results);
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
                resultService.setResults(data.results);
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
        resultService.setResults(data.results);
    });
  }]);

  app.controller('AchievementController', ['$scope', '$http', 'loginService', 'dialogs', 'player180Service', 'bestLegService', 'highFinishService',
  function($scope, $http, loginService, dialogs, player180Service, bestLegService, highFinishService) {
    var achievementCtrl = this;
    achievementCtrl.tab = 'player180s';

    achievementCtrl.showPrivilegedData = function() {
        return loginService.isAuthorised();
    },

    achievementCtrl.get180s = function() {
        return player180Service.get180s();
    },

    achievementCtrl.getHighFinishes = function() {
        return highFinishService.getFinishes();
    },

    achievementCtrl.getBestLegs = function() {
        return bestLegService.getLegs();
    },

    achievementCtrl.isSet = function(checkTab) {
        return achievementCtrl.tab === checkTab;
    };

    achievementCtrl.setTab = function(setTab) {
        achievementCtrl.tab = setTab;
    };

    achievementCtrl.isMost180s = function(numberOf180s) {
        var isMost180s = true;

        for (var player180 in player180Service.get180s()) {
            if (player180Service.get180s().hasOwnProperty(player180)) {
                var currentNoOf180s = player180Service.get180s()[player180].noOf180s;
                if (currentNoOf180s > numberOf180s) {
                    isMost180s = false;
                }
            }
        }
        return isMost180s;
    };

    achievementCtrl.isBestLeg = function(numberOfDarts) {
        var isBestLeg = true;

        for (var bestleg in bestLegService.getLegs()) {
            if (bestLegService.getLegs().hasOwnProperty(bestleg)) {
                var currentNumberOfDarts = bestLegService.getLegs()[bestleg].numberOfDarts;
                if (currentNumberOfDarts < numberOfDarts) {
                    isBestLeg = false;
                }
            }
        }
        return isBestLeg;
    };

    achievementCtrl.isHighestFinish = function(checkout) {
        var isHighestFinish = true;

        for (var highfinish in highFinishService.getFinishes()) {
            if (highFinishService.getFinishes().hasOwnProperty(highfinish)) {
                var currentHighFinish = highFinishService.getFinishes()[highfinish].checkout;
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
        player180Service.set180s(data.player180s);
    });
    $http.get(baseUrl + '/highfinishes').success(function(data) {
        highFinishService.setFinishes(data.highfinishes);
    });
    $http.get(baseUrl + '/bestlegs').success(function(data) {
        bestLegService.setLegs(data.bestlegs);
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