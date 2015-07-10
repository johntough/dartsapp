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

  app.service('tableService', ['$http', function($http) {
      var tableservice = this;
      tableservice.tables = [];

      tableservice.getTables = function() {
          return tableservice.tables;
      },

      tableservice.setTables = function(results) {
          var formattedResults = [];
          var groups = [];
          var players = [];
          var playersSimpleArray = [];

          var indexOf = function(item) {
              if (typeof Array.prototype.indexOf === 'function') {
                  indexOf = Array.prototype.indexOf;
              } else {
                  indexOf = function(item) {
                      var i = -1, index = -1;
        
                      for(i = 0; i < this.length; i++) {
                          if(this[i] === item) {
                              index = i;
                              break;
                          }
                      }
                      return index;
                  };
              }
              return indexOf.call(this, item);
          };

          // build up group array
          for (var result in results) {
              if (results.hasOwnProperty(result)) {
                  if (indexOf.call(groups, results[result].group) === -1) {
                    groups.push(results[result].group);
                  }
              }
          }

          // build up player array
          for (var result in results) {
              if (results.hasOwnProperty(result)) {
                  // check for player one
                  if (indexOf.call(playersSimpleArray, results[result].playerOne) === -1) {
                     playersSimpleArray.push(results[result].playerOne);
                     players.push({ player: results[result].playerOne, group: results[result].group });
                  } 
                  // check for player two
                  if (indexOf.call(playersSimpleArray, results[result].playerTwo) === -1) {
                     playersSimpleArray.push(results[result].playerTwo);
                     players.push({ player: results[result].playerTwo, group: results[result].group });
                  }
              }
          }

          // add legs won / lost
          for (var result in results) {
              if (results.hasOwnProperty(result)) {
                  var result = results[result];
                  for (player in players) {
                      if (players.hasOwnProperty(player)) {
                        if (result.playerOne === players[player].player) {
                            // increment legs won
                            (players[player].legsWon === undefined) ? players[player].legsWon = result.playerOneLegsWon : players[player].legsWon = players[player].legsWon + result.playerOneLegsWon;
                            // increment legs lost
                            (players[player].legsLost === undefined) ? players[player].legsLost = result.playerTwoLegsWon : players[player].legsLost = players[player].legsLost + result.playerTwoLegsWon;
                            // increment drawn games
                            if (result.playerOneLegsWon === result.playerTwoLegsWon) {
                                (players[player].drawn === undefined) ? players[player].drawn = 1 : players[player].drawn = players[player].drawn + 1;
                            } // increment won games
                            else if (result.playerOneLegsWon > result.playerTwoLegsWon) {
                                (players[player].won === undefined) ? players[player].won = 1 : players[player].won = players[player].won + 1;
                            } // increment lost games
                            else if (result.playerOneLegsWon < result.playerTwoLegsWon) {
                                (players[player].lost === undefined) ? players[player].lost = 1 : players[player].lost = players[player].lost + 1;
                            }
                        } else if (result.playerTwo === players[player].player) {
                            // increment legs won
                            (players[player].legsWon === undefined) ? players[player].legsWon = result.playerTwoLegsWon  : players[player].legsWon = players[player].legsWon + result.playerTwoLegsWon;
                            // increment legs lost
                            (players[player].legsLost === undefined) ? players[player].legsLost = result.playerOneLegsWon : players[player].legsLost = players[player].legsLost + result.playerOneLegsWon;
                            // increment drawn games
                            if (result.playerOneLegsWon === result.playerTwoLegsWon) {
                                (players[player].drawn === undefined) ? players[player].drawn = 1 : players[player].drawn = players[player].drawn + 1;
                            } // increment won games
                            else if (result.playerTwoLegsWon > result.playerOneLegsWon) {
                                (players[player].won === undefined) ? players[player].won = 1 : players[player].won = players[player].won + 1;
                            } // increment lost games
                            else if (result.playerTwoLegsWon < result.playerOneLegsWon) {
                                (players[player].lost === undefined) ? players[player].lost = 1 : players[player].lost = players[player].lost + 1;
                            }
                        }
                      }
                  }
              }
          }
  
          // checking for additional players missed in results
          var maybeAdditionalPlayers = false;
          $http.get(baseUrl + '/players/names').success(function(data) {
              if (data.count > playersSimpleArray.length) {
                  maybeAdditionalPlayers = data.players;
              }
              // adding in players that have not played and don't show up in results
              if (maybeAdditionalPlayers) {
                  for (maybeAdditionalPlayer in maybeAdditionalPlayers) {
                      if (maybeAdditionalPlayers.hasOwnProperty(maybeAdditionalPlayer)) {
                          if (indexOf.call(playersSimpleArray, maybeAdditionalPlayers[maybeAdditionalPlayer].name) === -1) {
                              players.push({ player: maybeAdditionalPlayers[maybeAdditionalPlayer].name, group: maybeAdditionalPlayers[maybeAdditionalPlayer].group});
                          }
                      }
                  }
              }

              // calculating total games played
              for (player in players) {
                  if (players.hasOwnProperty(player)) {
                      var player = players[player];
                      (player.drawn === undefined) ? player.drawn = 0 : '';
                      (player.won === undefined) ? player.won = 0 : '';
                      (player.lost === undefined) ? player.lost = 0 : '';
                      (player.legsWon === undefined) ? player.legsWon = 0 : '';
                      (player.legsLost === undefined) ? player.legsLost = 0 : '';
  
                      player.played = player.drawn + player.won + player.lost;
                      player.points = (player.drawn) + (player.won * 2);
                  }
              }

              // bundling players up into groups
              for (group in groups) {
                  if (groups.hasOwnProperty(group)) {
                      formattedResults.push({ groupName: groups[group], players: [] });
                      for (player in players) {
                          if (players.hasOwnProperty(player)) {
                              if (players[player].group === groups[group]) {
                                  formattedResults[group].players.push(players[player]);
                              }
                          }
                      }
                  }
             }

              tableservice.tables = formattedResults;
          });
      }
  }]);

  app.service('resultService', ['$http', 'tableService', function($http, tableService) {
      var resultservice = this;
      resultservice.results = [];
      resultservice.tables = [];

      resultservice.getResults = function() {
          return resultservice.results;
      },

      resultservice.setResults = function(results, isFiltered) {
          var formattedResults = [];

          for (var result in results) {
              if (results.hasOwnProperty(result)) {
                  results[result].weekDateFormatted = Date.parse(results[result].weekDate);
                  formattedResults.push(results[result]);
              }
          }
          resultservice.results = formattedResults;

          if (!isFiltered) {
              tableService.setTables(results);
          }
      }
  }]);

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

    $scope.obj = {groupfilter: undefined};
    playerCtrl.showFilters = false;

    playerCtrl.toggleFilters = function() {
        playerCtrl.showFilters = !playerCtrl.showFilters;
    },

    playerCtrl.getGroups = function() {
        return groupService.getGroups();
    },

    playerCtrl.getPlayers = function() {
        return playerService.getPlayers();
    },

    playerCtrl.showPrivilegedData = function() {
        return loginService.isAuthorised();
    },

    playerCtrl.getGroups = function() {
        return groupService.getGroups();
    },

    playerCtrl.filter = function() {
        if ($scope.obj.groupfilter === 'all') {
            $http.get(baseUrl + '/players/').success(function(data) {
                playerService.setPlayers(data.players);
            });
        } else {
            $http.get(baseUrl + '/players/group/' + $scope.obj.groupfilter).success(function(data) {
                playerService.setPlayers(data.players);
            });
        }
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

    playerCtrl.isValidEdit = function() {
        if ($scope.selected.forename && $scope.selected.surname) {
            return true;
        } else {
            return false;
        }
    },

    playerCtrl.saveChanges = function (id, forename, surname, email, phone) {
        if (playerCtrl.isValidEdit()) {
            $http.put(baseUrl + '/player/' + id + '/' + forename + '/' + surname + '/' + email + '/' + phone).success(function(data) {
                // refresh controllers internal state for players
                $http.get(baseUrl + '/players').success(function(data) {
                    playerService.setPlayers(data.players);
                });
            });
            playerCtrl.cancelChanges();
        }
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

  app.controller('NewsController', ['$scope', '$http', 'loginService', 'dialogs', 'toastr', 'toastrConfig', function($scope, $http, loginService, dialogs, toastr, toastrConfig) {
    var newsCtrl = this;
    newsCtrl.newsItems = [];
    newsCtrl.newsItemsLength = 0;

    newsCtrl.setNewsItems = function(newsItems) {
        var formattedNewsItems = [];

        for (var newsItem in newsItems) {
            if (newsItems.hasOwnProperty(newsItem)) {
                newsItems[newsItem].dateFormatted = Date.parse(newsItems[newsItem].date);
                formattedNewsItems.push(newsItems[newsItem]);
            }
        }
        newsCtrl.newsItems = formattedNewsItems;
    },

    newsCtrl.showPrivilegedData = function() {
        return loginService.isAuthorised();
    },

    // gets the template to ng-include for a news item
    newsCtrl.getTemplate = function (newsItem) {
        if ($scope.selected && newsItem.id === $scope.selected.id) {
            return 'news-item-edit';
        } else {
            return 'news-item-display';
        }
    };

    newsCtrl.isValidEdit = function() {
        if ($scope.selected.title && $scope.selected.content) {
            return true;
        } else {
            return false;
        }
    },

    newsCtrl.edit = function(newsItem) {
        $scope.selected = angular.copy(newsItem);
    },

    newsCtrl.cancelChanges = function () {
        $scope.selected = {};
    },

    newsCtrl.saveChanges = function (id, title, content) {
        if (newsCtrl.isValidEdit()) {
            $http.put(baseUrl + '/newsItem/' + id + '/' + title + '/' + content).success(function(data) {
                // refresh controllers internal state for news items
                $http.get(baseUrl + '/news').success(function(data) {
                    newsCtrl.setNewsItems(data.newsItems);
                    newsCtrl.newsItemsLength = data.count;
                });
            });
            newsCtrl.cancelChanges();
        }
    },

    $http.get(baseUrl + '/news').success(function(data) {
        newsCtrl.setNewsItems(data.newsItems);
        newsCtrl.newsItemsLength = data.count;
    });

    newsCtrl.showAddForm = function() {
        var dialog = dialogs.create('/addnewsitemdialog.html', 'AddNewsItemController', {}, {size:'lg', keyboard: true, backdrop: true, windowClass: 'my-class'});
        dialog.result.then(function() {
            // refresh controllers internal state for news items
            $http.get(baseUrl + '/news').success(function(data) {
                newsCtrl.setNewsItems(data.newsItems);
                newsCtrl.newsItemsLength = data.count;
                toastrConfig.positionClass = 'toast-bottom-right';
                toastrConfig.timeOut = 2000;
                toastr.success('News item added!');
            });
        },function() {
            // do nothing as user did not add a news item
        });
    },

    newsCtrl.deleteRecord = function(id) {
        var dialog = dialogs.confirm('Please Confirm', 'Are you sure you want to delete the news item?');
        dialog.result.then(function(btn) {
            $http.delete(baseUrl + '/newsItem/' + id).success(function(data) {
                // refresh controllers internal state for news items
                $http.get(baseUrl + '/news').success(function(data) {
                    newsCtrl.setNewsItems(data.newsItems);
                    newsCtrl.newsItemsLength = data.count;
                });
            });
        }, function(btn){
            // do nothing - user chose not to delete the news item
        });
    }
  }]);

  app.controller('ContactController', ['$scope', '$http', 'loginService', 'dialogs', 'toastr', 'toastrConfig', function($scope, $http, loginService, dialogs, toastr, toastrConfig) {
    var contactCtrl = this;
    contactCtrl.contacts = [];
    contactCtrl.contactsLength = 0;

    contactCtrl.showPrivilegedData = function() {
        return loginService.isAuthorised();
    },

    // gets the template to ng-include for a news item
    contactCtrl.getTemplate = function (contact) {
        if ($scope.selected && contact.id === $scope.selected.id) {
            return 'contact-edit';
        } else {
            return 'contact-display';
        }
    };

    contactCtrl.contactDetailsExist = function() {
        return (contactCtrl.contactsLength > 0) ? true : false;
    },

    contactCtrl.isValidEdit = function() {
        if ($scope.selected.name && $scope.selected.email && $scope.selected.phone) {
            return true;
        } else {
            return false;
        }
    },

    contactCtrl.edit = function(contact) {
        $scope.selected = angular.copy(contact);
    },

    contactCtrl.cancelChanges = function () {
        $scope.selected = {};
    },

    contactCtrl.saveChanges = function (id, name, email, phone) {
        if (contactCtrl.isValidEdit()) {
            $http.put(baseUrl + '/contact/' + id + '/' + name + '/' + email + '/' + phone).success(function(data) {
                // refresh controllers internal state for contact details
                $http.get(baseUrl + '/contacts').success(function(data) {
                    contactCtrl.contacts = data.contacts;
                    contactCtrl.contactsLength = data.count;
                });
            });
            contactCtrl.cancelChanges();
        }
    },

    $http.get(baseUrl + '/contacts').success(function(data) {
        contactCtrl.contacts = data.contacts;
        contactCtrl.contactsLength = data.count;
    });

    contactCtrl.showAddForm = function() {
        var dialog = dialogs.create('/addcontactdetailsdialog.html', 'AddContactDetailsController', {}, {size:'lg', keyboard: true, backdrop: true, windowClass: 'my-class'});
        dialog.result.then(function() {
            // refresh controllers internal state for contact details
            $http.get(baseUrl + '/contacts').success(function(data) {
                contactCtrl.contacts = data.contacts;
                contactCtrl.contactsLength = data.count;
                toastrConfig.positionClass = 'toast-bottom-right';
                toastrConfig.timeOut = 2000;
                toastr.success('Contact added!');
            });
        },function() {
            // do nothing as user did not add contact details
        });
    },

    contactCtrl.deleteRecord = function(id) {
        var dialog = dialogs.confirm('Please Confirm', 'Are you sure you want to delete the contact details?');
        dialog.result.then(function(btn) {
            $http.delete(baseUrl + '/contact/' + id).success(function(data) {
                // refresh controllers internal state for contact details
                $http.get(baseUrl + '/news').success(function(data) {
                    contactCtrl.contacts = data.contacts;
                    contactCtrl.contactsLength = data.count;
                });
            });
        }, function(btn){
            // do nothing - user chose not to delete contact details
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

    weekCtrl.openDatePicker = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        weekCtrl.datePickerOpened = true;
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
    },

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

    weekCtrl.saveChanges = function (id, name, date) {
        if (weekCtrl.isValidEdit()) {
            // converting the date into a readable string
            if (typeof(date) !== 'string') {
                date = date.toLocaleDateString(
                    'en-UK',
                    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
                );
            }
            $http.put(baseUrl + '/week/' + id + '/' + name + '/' + date).success(function(data) {
                // refresh controllers internal state for weeks
                $http.get(baseUrl + '/weeks').success(function(data) {
                    weekService.setWeeks(data.weeks);
                });
            });
            weekCtrl.cancelChanges();
        }
    },

    weekCtrl.isValidEdit = function() {
        if ($scope.selected.name && $scope.selected.date) {
            return true;
        } else {
            return false;
        }
    },

    weekCtrl.edit = function (week) {
        $scope.selected = angular.copy(week);
    },

    weekCtrl.cancelChanges = function () {
        $scope.selected = {};
    },
    
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

    groupCtrl.isValidEdit = function() {
        if ($scope.selected.name) {
            return true;
        } else {
            return false;
        }
    },

    groupCtrl.saveChanges = function (id, name) {
        if (groupCtrl.isValidEdit()) {
            $http.put(baseUrl + '/group/' + id + '/' + name).success(function(data) {
                // refresh controllers internal state for groups
                $http.get(baseUrl + '/groups').success(function(data) {
                    groupService.setGroups(data.groups);
                });
            });
            groupCtrl.cancelChanges();
        }
    },

    groupCtrl.edit = function (group) {
        $scope.selected = angular.copy(group);
    },

    groupCtrl.cancelChanges = function () {
        $scope.selected = {};
    },

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

    venueCtrl.isValidEdit = function() {
        if ($scope.selected.name) {
            return true;
        } else {
            return false;
        }
    },

    venueCtrl.saveChanges = function (id, name) {
        if (venueCtrl.isValidEdit()) {
            $http.put(baseUrl + '/venue/' + id + '/' + name).success(function(data) {
                // refresh controllers internal state for venues
                $http.get(baseUrl + '/venues').success(function(data) {
                    venueService.setVenues(data.venues);
                });
            });
            venueCtrl.cancelChanges();
        }
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

  app.controller('AddNewsItemController', ['$scope', '$http', '$modalInstance', 'data', function($scope, $http, $modalInstance, data) {
    var addNewsItemCtrl = this;
    $scope.newsItem = {title : '', content: ''};

    $scope.cancel = function() {
      $modalInstance.dismiss('canceled');  
    };
  
    $scope.save = function() {
      // converting the date into a readable string
      addNewsItemCtrl.date = new Date().toLocaleDateString(
          'en-UK',
          { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'}
      );
      addNewsItemCtrl.addNewsItem($scope.newsItem.title, addNewsItemCtrl.date, $scope.newsItem.content);
      $modalInstance.close();
    };

    addNewsItemCtrl.addNewsItem = function(title, date, content) {
        
        $http.post(baseUrl + '/newsItem/' + title + '/' + date + '/' + content).success(function(data) {
            // do nothing
        });
    }
  }]);

    app.controller('AddContactDetailsController', ['$scope', '$http', '$modalInstance', 'data', function($scope, $http, $modalInstance, data) {
    var addContactDetailsCtrl = this;

    $scope.cancel = function() {
      $modalInstance.dismiss('canceled');  
    };
  
    $scope.save = function() {
        $http.post(baseUrl + '/contact/' + $scope.contact.name + '/' + $scope.contact.email + '/' + $scope.contact.phone).success(function(data) {
            // do nothing
        });
        $modalInstance.close();
    };
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

    $scope.isValidResult = function() {
        var isValidResult = false;

        // check for win (7 v < 6)
        if (($scope.player1LegsWon === 7 && $scope.player2LegsWon < 6) || ($scope.player2LegsWon === 7 && $scope.player1LegsWon < 6)) {
            isValidResult = true;
        // check for draw (6 v 6)
        } else if ($scope.player1LegsWon === 6 && $scope.player2LegsWon === 6) {
            isValidResult = true;
        }

        return isValidResult;
    },

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
                resultService.setResults(data.results, false);
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

  app.controller('DeleteHighFinishController', ['$scope', '$http', '$modalInstance', 'data', 'highFinishService', 'dialogs',
  function($scope, $http, $modalInstance, data, highFinishService, dialogs) {

    var deleteHighFinishCtrl = this;
    $scope.players = [];
    $scope.highfinishes = [];

    $http.get(baseUrl + '/highfinishes/players').success(function(data) {
        $scope.players = data.players;
    });

    $scope.updateDialog = function(playerId) {
        $http.get(baseUrl + '/highfinishes/player/' + playerId).success(function(data) {
            $scope.highfinishes = [];

            for (var highFinish in data.highfinishes) {
                if (data.highfinishes.hasOwnProperty(highFinish)) {
                    data.highfinishes[highFinish].onRemoveQueue = false;
                    data.highfinishes[highFinish].dateFormatted = Date.parse(data.highfinishes[highFinish].date);
                    $scope.highfinishes.push(data.highfinishes[highFinish]);
                }
            }
        });
    },

    $scope.isRemoveQueueEmpty = function() {
        var isRemoveQueueEmpty = true;

        for (var highFinish in $scope.highfinishes) {
            if ($scope.highfinishes.hasOwnProperty(highFinish)) {
                if ($scope.highfinishes[highFinish].onRemoveQueue) {
                   isRemoveQueueEmpty = false
                   break;
                }
            }
        }

        return isRemoveQueueEmpty;
    },

    $scope.toggleItem = function(highFinish) {
        highFinish.onRemoveQueue = !highFinish.onRemoveQueue;
    },

    $scope.cancel = function() {
      $modalInstance.dismiss('canceled');  
    },

    $scope.applyChanges = function() {
        var removeQueue = [];

        // build queue
        for (var highFinish in $scope.highfinishes) {
            if ($scope.highfinishes.hasOwnProperty(highFinish)) {
                if ($scope.highfinishes[highFinish].onRemoveQueue) {
                    removeQueue.push($scope.highfinishes[highFinish].id);
                }
            }
        }

        for (var item in removeQueue) {
            if (removeQueue.hasOwnProperty(item)) {
                $http.delete(baseUrl + '/highfinish/' + removeQueue[item]).success(function(data) {
                    // refresh controllers internal state for high finishes
                    $http.get(baseUrl + '/highfinishes/duplicatesremoved').success(function(data) {
                        highFinishService.setFinishes(data.highfinishes);
                    });
                });
            }
        }

        $modalInstance.close();
    };
  }]);

  app.controller('AddHighFinishController', ['$scope', '$http', '$modalInstance', 'data', 'highFinishService', 'dialogs',
  function($scope, $http, $modalInstance, data, highFinishService, dialogs) {

    var addHighFinishCtrl = this;
    $scope.players = [];
    $scope.fixtures = [];
    $scope.allowAdd = false;
    $scope.highFinishes = [];

    $scope.validCheckouts = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117,
        118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139,
        140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 160, 161, 164,
        167, 170
    ];

    $http.get(baseUrl + '/players').success(function(data) {
        $scope.players = data.players;
    });

    $scope.isValidCheckout = function(value) {
        var isValid = true;

        if (!Number.isInteger(value)) {
            isValid = false;
        }
              
        return isValid;
    },

    $scope.playerUpdated = function(playerId) {
        $scope.allowAdd = false;

        $http.get(baseUrl + '/fixtures/player/' + playerId + '/completed').success(function(data) {
            $scope.fixtures = [];

            for (var fixture in data.fixtures) {
                if (data.fixtures.hasOwnProperty(fixture)) {
                    $scope.fixtures.push(data.fixtures[fixture]);
                }
            }
        });
    },

    $scope.fixtureSelected = function(id, date, player1, player2) {
        $scope.allowAdd = true;
    },

    $scope.addHighFinish = function() {
        if ($scope.isValidCheckout($scope.checkout)) {
            var finishObject = {
                playerId: $scope.player.id,
                player: $scope.player.forename + " " + $scope.player.surname,
                checkout: $scope.checkout,
                fixtureId: $scope.fixture.id,
                fixture: $scope.fixture.weekName + " ( " + $scope.fixture.date + " )" + " - " + $scope.fixture.player1 + " v " + $scope.fixture.player2
            };

            $scope.highFinishes.push(finishObject);
            $scope.checkout = '';
        }
    },

    $scope.remove = function(highFinishParam) {
        for (var highFinish in $scope.highFinishes) {
            if ($scope.highFinishes.hasOwnProperty(highFinish)) {
                if ($scope.highFinishes[highFinish] === highFinishParam) {
                    $scope.highFinishes.splice(highFinish, 1);
                    break;
                }
            }
        }
    },

    $scope.cancel = function() {
      $modalInstance.dismiss('canceled');  
    },

    $scope.save = function() {
        for (var highFinish in $scope.highFinishes) {
            if ($scope.highFinishes.hasOwnProperty(highFinish)) {
                var currentHighFinish = $scope.highFinishes[highFinish];

                $http.post(baseUrl + '/highfinish/' + currentHighFinish.checkout + '/' + currentHighFinish.fixtureId + '/' + currentHighFinish.playerId).success(function(data) {
                    // refresh controllers internal state for high finishes
                    $http.get(baseUrl + '/highfinishes/duplicatesremoved').success(function(data) {
                        highFinishService.setFinishes(data.highfinishes);
                    });
                });
            }
        }

        $modalInstance.close();
    };
  }]);

  app.controller('EditHighFinishController', ['$scope', '$http', '$modalInstance', 'data', 'highFinishService', 'dialogs',
  function($scope, $http, $modalInstance, data, highFinishService, dialogs) {

    var editHighFinishCtrl = this;
    $scope.players = [];
    $scope.highfinishes = [];

    $scope.validCheckouts = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117,
        118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139,
        140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 160, 161, 164,
        167, 170
    ];

    $scope.isValidEdit = function() {
        var isValid = true;

        if (!Number.isInteger($scope.selected.checkout)) {
            return false;
        }

        for (var highfinish in $scope.highfinishes) {
            if ($scope.highfinishes.hasOwnProperty(highfinish)) {
                // find matching id and check the checkout value has changed
                if (($scope.highfinishes[highfinish].id === $scope.selected.id) &&
                   ($scope.highfinishes[highfinish].originalCheckout === $scope.selected.checkout)
                ) {
                    return false;
                }
            }
        }

        return isValid;
    },

    $http.get(baseUrl + '/highfinishes/players').success(function(data) {
        $scope.players = data.players;
    });

    // gets the template to ng-include for a table row / item
    $scope.getTemplate = function (bestleg) {
        if ($scope.selected && bestleg.id === $scope.selected.id) { 
            return 'highfinish-edit';
        } else {
            return 'highfinish-display';
        }
    };

    $scope.edit = function (highfinish) {
        $scope.selected = angular.copy(highfinish);
    };

    $scope.cancelChanges = function () {
        $scope.selected = {};
    };

    $scope.updateDialog = function(playerId) {
        $http.get(baseUrl + '/highfinishes/player/' + playerId).success(function(data) {
            $scope.highfinishes = [];

            for (var highfinish in data.highfinishes) {
                if (data.highfinishes.hasOwnProperty(highfinish)) {
                    data.highfinishes[highfinish].onEditQueue = false;
                    data.highfinishes[highfinish].dateFormatted = Date.parse(data.highfinishes[highfinish].date);
                    // adding additional property to track original checkout so that model can be updated with new value
                    data.highfinishes[highfinish].originalCheckout = data.highfinishes[highfinish].checkout;
                    $scope.highfinishes.push(data.highfinishes[highfinish]);
                }
            }
        });
    },

    $scope.isEditQueueEmpty = function() {
        var isEditQueueEmpty = true;

        for (var highfinish in $scope.highfinishes) {
            if ($scope.highfinishes.hasOwnProperty(highfinish)) {
                if ($scope.highfinishes[highfinish].onEditQueue) {
                   isEditQueueEmpty = false
                   break;
                }
            }
        }

        return isEditQueueEmpty;
    },

    $scope.saveChanges = function(id, checkout) {
        if ($scope.isValidEdit()) {
            for (var highfinish in $scope.highfinishes) {
                if ($scope.highfinishes.hasOwnProperty(highfinish)) {
                    if ($scope.highfinishes[highfinish].id === id) {
                        $scope.highfinishes[highfinish].onEditQueue = true;
                        $scope.highfinishes[highfinish].checkout = checkout;
                        $scope.selected = {};
                        break;
                    }
                }
            }
        }
    },

    $scope.undo = function(highfinish) {
        highfinish.onEditQueue = false;
        highfinish.checkout = highfinish.originalCheckout;
    },

    $scope.cancel = function() {
      $modalInstance.dismiss('canceled');  
    },

    $scope.applyChanges = function() {
        var editQueue = [];

        // build queue
        for (var highfinish in $scope.highfinishes) {
            if ($scope.highfinishes.hasOwnProperty(highfinish)) {
                if ($scope.highfinishes[highfinish].onEditQueue) {
                    editQueue.push({
                        id: $scope.highfinishes[highfinish].id,
                        checkout: $scope.highfinishes[highfinish].checkout
                    });
                }
            }
        }

        for (var item in editQueue) {
            if (editQueue.hasOwnProperty(item)) {
                $http.put(baseUrl + '/highfinish/' + editQueue[item].id + '/' + editQueue[item].checkout).success(function(data) {
                    // refresh controllers internal state for best legs
                    $http.get(baseUrl + '/highfinishes/duplicatesremoved').success(function(data) {
                        highFinishService.setFinishes(data.highfinishes);
                    });
                });
            }
        }

        $modalInstance.close();
    };
  }]);

  app.controller('DeleteBestLegController', ['$scope', '$http', '$modalInstance', 'data', 'bestLegService', 'dialogs',
  function($scope, $http, $modalInstance, data, bestLegService, dialogs) {

    var deleteBestLegCtrl = this;
    $scope.players = [];
    $scope.bestlegs = [];

    $http.get(baseUrl + '/bestlegs/players').success(function(data) {
        $scope.players = data.players;
    });

    $scope.updateDialog = function(playerId) {
        $http.get(baseUrl + '/bestlegs/player/' + playerId).success(function(data) {
            $scope.bestlegs = [];

            for (var bestleg in data.bestlegs) {
                if (data.bestlegs.hasOwnProperty(bestleg)) {
                    data.bestlegs[bestleg].onRemoveQueue = false;
                    data.bestlegs[bestleg].dateFormatted = Date.parse(data.bestlegs[bestleg].date);
                    $scope.bestlegs.push(data.bestlegs[bestleg]);
                }
            }
        });
    },

    $scope.isRemoveQueueEmpty = function() {
        var isRemoveQueueEmpty = true;

        for (var bestleg in $scope.bestlegs) {
            if ($scope.bestlegs.hasOwnProperty(bestleg)) {
                if ($scope.bestlegs[bestleg].onRemoveQueue) {
                   isRemoveQueueEmpty = false
                   break;
                }
            }
        }

        return isRemoveQueueEmpty;
    },

    $scope.toggleItem = function(bestleg) {
        bestleg.onRemoveQueue = !bestleg.onRemoveQueue;
    },

    $scope.cancel = function() {
      $modalInstance.dismiss('canceled');  
    },

    $scope.applyChanges = function() {
        var removeQueue = [];

        // build queue
        for (var bestleg in $scope.bestlegs) {
            if ($scope.bestlegs.hasOwnProperty(bestleg)) {
                if ($scope.bestlegs[bestleg].onRemoveQueue) {
                    removeQueue.push($scope.bestlegs[bestleg].id);
                }
            }
        }

        for (var item in removeQueue) {
            if (removeQueue.hasOwnProperty(item)) {
                $http.delete(baseUrl + '/bestleg/' + removeQueue[item]).success(function(data) {
                    // refresh controllers internal state for best legs
                    $http.get(baseUrl + '/bestlegs/duplicatesremoved').success(function(data) {
                        bestLegService.setLegs(data.bestlegs);
                    });
                });
            }
        }

        $modalInstance.close();
    };
  }]);

  app.controller('AddBestLegController', ['$scope', '$http', '$modalInstance', 'data', 'bestLegService', 'dialogs',
  function($scope, $http, $modalInstance, data, bestLegService, dialogs) {

    var addBestLegCtrl = this;
    $scope.players = [];
    $scope.fixtures = [];
    $scope.allowAdd = false;
    $scope.bestlegs = [];

    $scope.validNumberOfDarts = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

    $http.get(baseUrl + '/players').success(function(data) {
        $scope.players = data.players;
    });

    $scope.isValidNumberOfDarts = function(value) {
        var isValid = true;

        if (!Number.isInteger(value)) {
            isValid = false;
        }
              
        return isValid;
    },

    $scope.playerUpdated = function(playerId) {
        $scope.allowAdd = false;

        $http.get(baseUrl + '/fixtures/player/' + playerId + '/completed').success(function(data) {
            $scope.fixtures = [];

            for (var fixture in data.fixtures) {
                if (data.fixtures.hasOwnProperty(fixture)) {
                    $scope.fixtures.push(data.fixtures[fixture]);
                }
            }
        });
    },

    $scope.fixtureSelected = function(id, date, player1, player2) {
        $scope.allowAdd = true;
    },

    $scope.addLeg = function() {
        if ($scope.isValidNumberOfDarts($scope.numberOfDarts)) {
            var bestLegObject = {
                playerId: $scope.player.id,
                player: $scope.player.forename + " " + $scope.player.surname,
                numberOfDarts: $scope.numberOfDarts,
                fixtureId: $scope.fixture.id,
                fixture: $scope.fixture.weekName + " ( " + $scope.fixture.date + " )" + " - " + $scope.fixture.player1 + " v " + $scope.fixture.player2
            };

            $scope.bestlegs.push(bestLegObject);
            $scope.numberOfDarts = '';
        }
    },

    $scope.remove = function(bestLegParam) {
        for (var bestleg in $scope.bestlegs) {
            if ($scope.bestlegs.hasOwnProperty(bestleg)) {
                if ($scope.bestlegs[bestleg] === bestLegParam) {
                    $scope.bestlegs.splice(bestleg, 1);
                    break;
                }
            }
        }
    },

    $scope.cancel = function() {
      $modalInstance.dismiss('canceled');  
    },

    $scope.save = function() {
        for (var bestleg in $scope.bestlegs) {
            if ($scope.bestlegs.hasOwnProperty(bestleg)) {
                var currentBestLeg = $scope.bestlegs[bestleg];

                $http.post(baseUrl + '/bestleg/' + currentBestLeg.numberOfDarts + '/' + currentBestLeg.fixtureId + '/' + currentBestLeg.playerId).success(function(data) {
                    // refresh controllers internal state for best legs
                    $http.get(baseUrl + '/bestlegs/duplicatesremoved').success(function(data) {
                        bestLegService.setLegs(data.bestlegs);
                    });
                });
            }
        }

        $modalInstance.close();
    };
  }]);

  app.controller('EditBestLegController', ['$scope', '$http', '$modalInstance', 'data', 'bestLegService', 'dialogs',
  function($scope, $http, $modalInstance, data, bestLegService, dialogs) {

    var editBestLegCtrl = this;
    $scope.players = [];
    $scope.bestlegs = [];

    $scope.validNumberOfDarts = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

    $scope.isValidEdit = function() {
        var isValid = true;

        if (!Number.isInteger($scope.selected.numberOfDarts)) {
            return false;
        }

        for (var bestleg in $scope.bestlegs) {
            if ($scope.bestlegs.hasOwnProperty(bestleg)) {
                // find matching id and check the number of darts value has changed
                if (($scope.bestlegs[bestleg].id === $scope.selected.id) &&
                   ($scope.bestlegs[bestleg].originalNumberOfDarts === $scope.selected.numberOfDarts)
                ) {
                    return false;
                }
            }
        }

        return isValid;
    },

    $http.get(baseUrl + '/bestlegs/players').success(function(data) {
        $scope.players = data.players;
    });

    // gets the template to ng-include for a table row / item
    $scope.getTemplate = function (bestleg) {
        if ($scope.selected && bestleg.id === $scope.selected.id) { 
            return 'bestleg-edit';
        } else {
            return 'bestleg-display';
        }
    };

    $scope.edit = function (bestleg) {
        $scope.selected = angular.copy(bestleg);
    };

    $scope.cancelChanges = function () {
        $scope.selected = {};
    };

    $scope.updateDialog = function(playerId) {
        $http.get(baseUrl + '/bestlegs/player/' + playerId).success(function(data) {
            $scope.bestlegs = [];

            for (var bestleg in data.bestlegs) {
                if (data.bestlegs.hasOwnProperty(bestleg)) {
                    data.bestlegs[bestleg].onEditQueue = false;
                    data.bestlegs[bestleg].dateFormatted = Date.parse(data.bestlegs[bestleg].date);
                    // adding additional property to track original number of darts so that model can be updated with new value
                    data.bestlegs[bestleg].originalNumberOfDarts = data.bestlegs[bestleg].numberOfDarts;
                    $scope.bestlegs.push(data.bestlegs[bestleg]);
                }
            }
        });
    },

    $scope.isEditQueueEmpty = function() {
        var isEditQueueEmpty = true;

        for (var bestleg in $scope.bestlegs) {
            if ($scope.bestlegs.hasOwnProperty(bestleg)) {
                if ($scope.bestlegs[bestleg].onEditQueue) {
                   isEditQueueEmpty = false
                   break;
                }
            }
        }

        return isEditQueueEmpty;
    },

    $scope.saveChanges = function(id, numberOfDarts) {
        if ($scope.isValidEdit()) {
            for (var bestleg in $scope.bestlegs) {
                if ($scope.bestlegs.hasOwnProperty(bestleg)) {
                    if ($scope.bestlegs[bestleg].id === id) {
                        $scope.bestlegs[bestleg].onEditQueue = true;
                        $scope.bestlegs[bestleg].numberOfDarts = numberOfDarts;
                        $scope.selected = {};
                        break;
                    }
                }
            }
        }
    },

    $scope.undo = function(bestleg) {
        bestleg.onEditQueue = false;
        bestleg.numberOfDarts = bestleg.originalNumberOfDarts;
    },

    $scope.cancel = function() {
      $modalInstance.dismiss('canceled');  
    },

    $scope.applyChanges = function() {
        var editQueue = [];

        // build queue
        for (var bestleg in $scope.bestlegs) {
            if ($scope.bestlegs.hasOwnProperty(bestleg)) {
                if ($scope.bestlegs[bestleg].onEditQueue) {
                    editQueue.push({
                        id: $scope.bestlegs[bestleg].id,
                        numberOfDarts: $scope.bestlegs[bestleg].numberOfDarts
                    });
                }
            }
        }

        for (var item in editQueue) {
            if (editQueue.hasOwnProperty(item)) {
                $http.put(baseUrl + '/bestleg/' + editQueue[item].id + '/' + editQueue[item].numberOfDarts).success(function(data) {
                    // refresh controllers internal state for best legs
                    $http.get(baseUrl + '/bestlegs/duplicatesremoved').success(function(data) {
                        bestLegService.setLegs(data.bestlegs);
                    });
                });
            }
        }

        $modalInstance.close();
    };
  }]);

  app.controller('Delete180Controller', ['$scope', '$http', '$modalInstance', 'data', 'player180Service', 'dialogs',
  function($scope, $http, $modalInstance, data, player180Service, dialogs) {

    var delete180Ctrl = this;
    $scope.players = [];
    $scope.numberOf180s = [];

    $http.get(baseUrl + '/180s/players').success(function(data) {
        $scope.players = data.players;
    });

    $scope.updateDialog = function(playerId) {
        $http.get(baseUrl + '/180s/player/' + playerId).success(function(data) {
            $scope.numberOf180s = [];

            for (var numberOf180sItem in data.player180s) {
                if (data.player180s.hasOwnProperty(numberOf180sItem)) {
                    data.player180s[numberOf180sItem].onRemoveQueue = false;
                    data.player180s[numberOf180sItem].dateFormatted = Date.parse(data.player180s[numberOf180sItem].date);
                    $scope.numberOf180s.push(data.player180s[numberOf180sItem]);
                }
            }
        });
    },

    $scope.isRemoveQueueEmpty = function() {
        var isRemoveQueueEmpty = true;

        for (var numberOf180sItem in $scope.numberOf180s) {
            if ($scope.numberOf180s.hasOwnProperty(numberOf180sItem)) {
                if ($scope.numberOf180s[numberOf180sItem].onRemoveQueue) {
                   isRemoveQueueEmpty = false
                   break;
                }
            }
        }

        return isRemoveQueueEmpty;
    },

    $scope.toggleItem = function(numberOf180sItem) {
        numberOf180sItem.onRemoveQueue = !numberOf180sItem.onRemoveQueue;
    },

    $scope.cancel = function() {
      $modalInstance.dismiss('canceled');  
    },

    $scope.applyChanges = function() {
        var removeQueue = [];

        // build queue
        for (var numberOf180sItem in $scope.numberOf180s) {
            if ($scope.numberOf180s.hasOwnProperty(numberOf180sItem)) {
                if ($scope.numberOf180s[numberOf180sItem].onRemoveQueue) {
                    removeQueue.push($scope.numberOf180s[numberOf180sItem].id);
                }
            }
        }

        for (var item in removeQueue) {
            if (removeQueue.hasOwnProperty(item)) {
                $http.delete(baseUrl + '/180/' + removeQueue[item]).success(function(data) {
                    // refresh controllers internal state for 180s
                    $http.get(baseUrl + '/180s').success(function(data) {
                        player180Service.set180s(data.player180s);
                    });
                });
            }
        }

        $modalInstance.close();
    };
  }]);

  app.controller('Add180Controller', ['$scope', '$http', '$modalInstance', 'data', 'player180Service', 'dialogs',
  function($scope, $http, $modalInstance, data, player180Service, dialogs) {

    var add180Ctrl = this;
    $scope.players = [];
    $scope.fixtures = [];
    $scope.allowAdd = false;
    $scope.numberOf180s = [];

    $scope.validNumberOf180s = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    $http.get(baseUrl + '/players').success(function(data) {
        $scope.players = data.players;
    });

    $scope.isValidNumberOf180s = function(value) {
        var isValid = true;

        if (!Number.isInteger(value)) {
            isValid = false;
        }
              
        return isValid;
    },

    $scope.playerUpdated = function(playerId) {
        $scope.allowAdd = false;

        $http.get(baseUrl + '/fixtures/player/' + playerId + '/completed').success(function(data) {
            $scope.fixtures = [];

            for (var fixture in data.fixtures) {
                if (data.fixtures.hasOwnProperty(fixture)) {
                    $scope.fixtures.push(data.fixtures[fixture]);
                }
            }
        });
    },

    $scope.fixtureSelected = function(id, date, player1, player2) {
        $scope.allowAdd = true;
    },

    $scope.addLeg = function() {
        if ($scope.isValidNumberOf180s($scope.numberOf180sItem)) {
            var player180Object = {
                playerId: $scope.player.id,
                player: $scope.player.forename + " " + $scope.player.surname,
                numberOf180s: $scope.numberOf180sItem,
                fixtureId: $scope.fixture.id,
                fixture: $scope.fixture.weekName + " ( " + $scope.fixture.date + " )" + " - " + $scope.fixture.player1 + " v " + $scope.fixture.player2
            };

            $scope.numberOf180s.push(player180Object);
            $scope.numberOf180sItem = '';
        }
    },

    $scope.remove = function(numberOf180sParam) {
        for (var numberOf180sItem in $scope.numberOf180s) {
            if ($scope.numberOf180s.hasOwnProperty(numberOf180sItem)) {
                if ($scope.numberOf180s[numberOf180sItem] === numberOf180sParam) {
                    $scope.numberOf180s.splice(numberOf180sItem, 1);
                    break;
                }
            }
        }
    },

    $scope.cancel = function() {
      $modalInstance.dismiss('canceled');  
    },

    $scope.save = function() {
        for (var numberOf180sItem in $scope.numberOf180s) {
            if ($scope.numberOf180s.hasOwnProperty(numberOf180sItem)) {
                var currentNumberOf180s = $scope.numberOf180s[numberOf180sItem];

                $http.post(baseUrl + '/180/' + currentNumberOf180s.numberOf180s + '/' + currentNumberOf180s.fixtureId + '/' + currentNumberOf180s.playerId).success(function(data) {
                    // refresh controllers internal state for 180s
                    $http.get(baseUrl + '/180s').success(function(data) {
                        player180Service.set180s(data.player180s);
                    });
                });
            }
        }

        $modalInstance.close();
    };
  }]);

  app.controller('Edit180Controller', ['$scope', '$http', '$modalInstance', 'data', 'player180Service', 'dialogs',
  function($scope, $http, $modalInstance, data, player180Service, dialogs) {

    var edit180Ctrl = this;
    $scope.players = [];
    $scope.player180s = [];

    $scope.validNumberOf180s = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    $scope.isValidEdit = function() {
        var isValid = true;

        if (!Number.isInteger($scope.selected.noOf180s)) {
            return false;
        }

        for (var player180 in $scope.player180s) {
            if ($scope.player180s.hasOwnProperty(player180)) {
                // find matching id and check the 180 value has changed
                if (($scope.player180s[player180].id === $scope.selected.id) &&
                   ($scope.player180s[player180].originalNoOf180s === $scope.selected.noOf180s)
                ) {
                    return false;
                }
            }
        }

        return isValid;
    },

    $http.get(baseUrl + '/180s/players').success(function(data) {
        $scope.players = data.players;
    });

    // gets the template to ng-include for a table row / item
    $scope.getTemplate = function (player180) {
        if ($scope.selected && player180.id === $scope.selected.id) { 
            return 'player180-edit';
        } else {
            return 'player180-display';
        }
    };

    $scope.edit = function (player180) {
        $scope.selected = angular.copy(player180);
    };

    $scope.cancelChanges = function () {
        $scope.selected = {};
    };

    $scope.updateDialog = function(playerId) {
        $http.get(baseUrl + '/180s/player/' + playerId).success(function(data) {
            $scope.player180s = [];

            for (var player180 in data.player180s) {
                if (data.player180s.hasOwnProperty(player180)) {
                    data.player180s[player180].onEditQueue = false;
                    data.player180s[player180].dateFormatted = Date.parse(data.player180s[player180].date);
                    // adding additional property to track original 180 value so that model can be updated with new value
                    data.player180s[player180].originalNoOf180s = data.player180s[player180].noOf180s;
                    $scope.player180s.push(data.player180s[player180]);
                }
            }
        });
    },

    $scope.isEditQueueEmpty = function() {
        var isEditQueueEmpty = true;

        for (var player180 in $scope.player180s) {
            if ($scope.player180s.hasOwnProperty(player180)) {
                if ($scope.player180s[player180].onEditQueue) {
                   isEditQueueEmpty = false
                   break;
                }
            }
        }

        return isEditQueueEmpty;
    },

    $scope.saveChanges = function(id, noOf180s) {
        if ($scope.isValidEdit()) {
            for (var player180 in $scope.player180s) {
                if ($scope.player180s.hasOwnProperty(player180)) {
                    if ($scope.player180s[player180].id === id) {
                        $scope.player180s[player180].onEditQueue = true;
                        $scope.player180s[player180].noOf180s = noOf180s;
                        $scope.selected = {};
                        break;
                    }
                }
            }
        }
    },

    $scope.undo = function(player180) {
        player180.onEditQueue = false;
        player180.noOf180s = player180.originalNoOf180s;
    },

    $scope.cancel = function() {
      $modalInstance.dismiss('canceled');  
    },

    $scope.applyChanges = function() {
        var editQueue = [];

        // build queue
        for (var player180 in $scope.player180s) {
            if ($scope.player180s.hasOwnProperty(player180)) {
                if ($scope.player180s[player180].onEditQueue) {
                    editQueue.push({
                        id: $scope.player180s[player180].id,
                        noOf180s: $scope.player180s[player180].noOf180s
                    });
                }
            }
        }

        for (var item in editQueue) {
            if (editQueue.hasOwnProperty(item)) {
                $http.put(baseUrl + '/180/' + editQueue[item].id + '/' + editQueue[item].noOf180s).success(function(data) {
                    // refresh controllers internal state for 180s
                    $http.get(baseUrl + '/180s').success(function(data) {
                        player180Service.set180s(data.player180s);
                    });
                });
            }
        }

        $modalInstance.close();
    };
  }]);

  app.controller('FixtureController', ['$scope', '$http', 'loginService', 'fixtureService', 'groupService', 'playerService', 'weekService', 'venueService', 'dialogs', 'toastr', 'toastrConfig',
  function($scope, $http, loginService, fixtureService, groupService, playerService, weekService, venueService, dialogs, toastr, toastrConfig) {
    var fixtureCtrl = this;

    $scope.obj = {
        weekfilter: undefined,
        groupfilter: undefined,
        playerfilter: undefined
    };
    fixtureCtrl.showFilters = false;

    fixtureCtrl.toggleFilters = function() {
        fixtureCtrl.showFilters = !fixtureCtrl.showFilters;
    },

    fixtureCtrl.showPrivilegedData = function() {
        return loginService.isAuthorised();
    },

    fixtureCtrl.getFixtures = function() {
        return fixtureService.getFixtures();
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

    fixtureCtrl.getWeeks = function() {
        return weekService.getWeeks();
    },

    $http.get(baseUrl + '/fixtures').success(function(data) {
        fixtureService.setFixtures(data.fixtures);
    });

    // gets the template to ng-include for a table row / item
    fixtureCtrl.getTemplate = function (fixture) {
        if ($scope.selected && fixture.id === $scope.selected.id) { 
            return 'fixture-edit';
        } else {
            return 'fixture-display';
        }
    },

    fixtureCtrl.deleteRecord  = function(id) {

        var dialog = dialogs.confirm('Please Confirm', 'Are you sure you want to delete the fixture?');
        dialog.result.then(function(btn) {
            $http.delete(baseUrl + '/fixture/' + id).success(function(data) {
                // refresh controllers internal state for fixtures
                $http.get(baseUrl + '/fixtures').success(function(data) {
                    fixtureService.setFixtures(data.fixtures);
                });
            });
        }, function(btn){
            // do nothing - user chose not to delete the fixture
        });
    },

    fixtureCtrl.saveChanges = function (id, week, order, venue, player1, player2, marker1, marker2) {
        if (fixtureCtrl.isValidEdit()) {
            $http.put(baseUrl + '/fixture/' + id + '/' + week + '/' + order + '/' + venue + '/' + player1 + '/' + player2 + '/' + marker1 + '/' + marker2).success(function(data) {
                // refresh controllers internal state for fixtures
                $http.get(baseUrl + '/fixtures').success(function(data) {
                    fixtureService.setFixtures(data.fixtures);
                });
            });
            fixtureCtrl.cancelChanges();
        }
    },

    fixtureCtrl.isValidEdit = function() {
        if ($scope.selected.player1 === $scope.selected.player2) {
            return false;
        }
        else if ($scope.selected.player1 === $scope.selected.marker1 ||
            $scope.selected.player1 === $scope.selected.marker2 ||
            $scope.selected.player2 === $scope.selected.marker1 ||
            $scope.selected.player2 === $scope.selected.marker2
        ) {
            return false;
        }
        if (Number.isInteger($scope.selected.orderOfPlay)) {
            return true;
        } else {
            return false;
        }
    },

    fixtureCtrl.edit = function (fixture) {
        $scope.selected = angular.copy(fixture);

        $scope.selected.weeks = weekService.getWeeks();
        $scope.selected.venues = venueService.getVenues();

        for (var week in $scope.selected.weeks) {
            if ($scope.selected.weeks.hasOwnProperty(week)) {
                if ($scope.selected.weekId === $scope.selected.weeks[week].id) {
                    $scope.selected.week = $scope.selected.weeks[week];
                    break;
                }
            }
        }

        for (var venue in $scope.selected.venues) {
            if ($scope.selected.venues.hasOwnProperty(venue)) {
                if ($scope.selected.venueId === $scope.selected.venues[venue].id) {
                    $scope.selected.venueObj = $scope.selected.venues[venue];
                    break;
                }
            }
        }

        $http.get(baseUrl + '/players/group/' + $scope.selected.groupId).success(function(data) {
            $scope.selected.players = data.players;

            for (var player in $scope.selected.players) {
                if ($scope.selected.players.hasOwnProperty(player)) {
                    if ($scope.selected.playerOneId === $scope.selected.players[player].id) {
                        $scope.selected.player1 = $scope.selected.players[player];
                    }  
                    else if ($scope.selected.playerTwoId === $scope.selected.players[player].id) {
                        $scope.selected.player2 = $scope.selected.players[player];
                    }
                    else if ($scope.selected.markerOneId === $scope.selected.players[player].id) {
                        $scope.selected.marker1 = $scope.selected.players[player];
                    }
                    else if ($scope.selected.markerTwoId === $scope.selected.players[player].id) {
                        $scope.selected.marker2 = $scope.selected.players[player];
                    }
                }
            }
        });
    },

    fixtureCtrl.cancelChanges = function () {
        $scope.selected = {};
    },

    fixtureCtrl.filter = function() {
        var filterGroups = (!$scope.obj.groupfilter | $scope.obj.groupfilter === 'all') ? false: true;
        var filterWeeks = (!$scope.obj.weekfilter | $scope.obj.weekfilter === 'all') ? false: true;
        var filterPlayers = (!$scope.obj.playerfilter | $scope.obj.playerfilter === 'all') ? false: true;

        // no filters
        if (!filterGroups && !filterWeeks && !filterPlayers) {
            $http.get(baseUrl + '/fixtures/').success(function(data) {
                fixtureService.setFixtures(data.fixtures);
            });
        // by group
        } else if (filterGroups && !filterWeeks && !filterPlayers) {
            $http.get(baseUrl + '/fixtures/group/' + $scope.obj.groupfilter).success(function(data) {
                fixtureService.setFixtures(data.fixtures);
            });
        // by week
        } else if (!filterGroups && filterWeeks && !filterPlayers) {
            $http.get(baseUrl + '/fixtures/week/' + $scope.obj.weekfilter).success(function(data) {
                fixtureService.setFixtures(data.fixtures);
            });
        // by player
        } else if (!filterGroups && !filterWeeks && filterPlayers) {
            $http.get(baseUrl + '/fixtures/player/' + $scope.obj.playerfilter).success(function(data) {
                fixtureService.setFixtures(data.fixtures);
            });
        // by group && week
        } else if (filterGroups && filterWeeks && !filterPlayers) {
            $http.get(baseUrl + '/fixtures/week/' + $scope.obj.weekfilter + '/group/' + $scope.obj.groupfilter).success(function(data) {
                fixtureService.setFixtures(data.fixtures);
            });
        // by group && player
        } else if (filterGroups && !filterWeeks && filterPlayers) {
            $http.get(baseUrl + '/fixtures/group/' + $scope.obj.groupfilter + '/player/' + $scope.obj.playerfilter).success(function(data) {
                fixtureService.setFixtures(data.fixtures);
            });
        // by week && player
        } else if (!filterGroups && filterWeeks && filterPlayers) {
            $http.get(baseUrl + '/fixtures/week/' + $scope.obj.weekfilter + '/player/' + $scope.obj.playerfilter).success(function(data) {
                fixtureService.setFixtures(data.fixtures);
            });
        // by group && week && player
        } else if (filterGroups && filterWeeks && filterPlayers) {
            $http.get(baseUrl + '/fixtures/group/' + $scope.obj.groupfilter + '/week/' + $scope.obj.weekfilter + '/player/' + $scope.obj.playerfilter).success(function(data) {
                fixtureService.setFixtures(data.fixtures);
            });
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
        var dialog = dialogs.create('/completefixturesdialog.html', 'CompleteFixtureController', {fixture: fixture}, {size:'lg', keyboard: true, backdrop: true, windowClass: 'my-class'});
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

  app.controller('ResultController', ['$scope', '$http', 'loginService', 'dialogs', 'resultService', 'weekService', 'groupService', 'playerService',
  function($scope, $http, loginService, dialogs, resultService, weekService, groupService, playerService) {
    var resultCtrl = this;

    $scope.obj = {
        weekfilter: undefined,
        groupfilter: undefined,
        playerfilter: undefined
    };
    resultCtrl.showFilters = false;

    resultCtrl.toggleFilters = function() {
        resultCtrl.showFilters = !resultCtrl.showFilters;
    },

    resultCtrl.showPrivilegedData = function() {
        return loginService.isAuthorised();
    },

    resultCtrl.getResults = function() {
        return resultService.getResults();
    },

    resultCtrl.getWeeks = function() {
        return weekService.getWeeks();
    },

    resultCtrl.getGroups = function() {
        return groupService.getGroups();
    },

    resultCtrl.getPlayers = function() {
        return playerService.getPlayers();
    },

    // gets the template to ng-include for result table row
    resultCtrl.getTemplate = function (result) {
        if ($scope.selected && result.id === $scope.selected.id) {
            return 'result-edit';
        } else {
            return 'result-display';
        }
    };

    resultCtrl.edit = function(result) {
        $scope.selected = angular.copy(result);
    },

    resultCtrl.cancelChanges = function () {
        $scope.selected = {};
    },

    resultCtrl.isValidEdit = function() {
        var isValidEdit = false;

        // check for win (7 v < 6)
        if (($scope.selected.playerOneLegsWon === 7 && $scope.selected.playerTwoLegsWon < 6) ||
           ($scope.selected.playerTwoLegsWon === 7 && $scope.selected.playerOneLegsWon < 6)
        ) {
            isValidEdit = true;
        // check for draw (6 v 6)
        } else if ($scope.selected.playerOneLegsWon === 6 && $scope.selected.playerTwoLegsWon === 6) {
            isValidEdit = true;
        }

        return isValidEdit;
    },

    resultCtrl.saveChanges = function (id, playerOneLegsWon, playerTwoLegsWon) {
        if (resultCtrl.isValidEdit()) {
            $http.put(baseUrl + '/result/' + id + '/' + playerOneLegsWon + '/' + playerTwoLegsWon).success(function(data) {
                // refresh controllers internal state for results
                $http.get(baseUrl + '/results/').success(function(data) {
                    resultService.setResults(data.results, false);
                });
            });
            resultCtrl.cancelChanges();
        }
    },

    resultCtrl.deleteRecord = function(id) {
        var dialog = dialogs.confirm('Please Confirm', 'Are you sure you want to delete the result?');
        dialog.result.then(function(btn) {
            $http.delete(baseUrl + '/result/' + id).success(function(data) {
                // refresh controllers internal state for results
                $http.get(baseUrl + '/results/').success(function(data) {
                    resultService.setResults(data.results, false);
                });
            });
        }, function(btn){
            // do nothing - user chose not to delete the result
        });
    }

    resultCtrl.filter = function() {
        var filterGroups = (!$scope.obj.groupfilter | $scope.obj.groupfilter === 'all') ? false: true;
        var filterWeeks = (!$scope.obj.weekfilter | $scope.obj.weekfilter === 'all') ? false: true;
        var filterPlayers = (!$scope.obj.playerfilter | $scope.obj.playerfilter === 'all') ? false: true;

        // no filters
        if (!filterGroups && !filterWeeks && !filterPlayers) {
            $http.get(baseUrl + '/results/').success(function(data) {
                resultService.setResults(data.results, true);
            });
        // by group
        } else if (filterGroups && !filterWeeks && !filterPlayers) {
            $http.get(baseUrl + '/results/group/' + $scope.obj.groupfilter).success(function(data) {
                resultService.setResults(data.results, true);
            });
        // by week
        } else if (!filterGroups && filterWeeks && !filterPlayers) {
            $http.get(baseUrl + '/results/week/' + $scope.obj.weekfilter).success(function(data) {
                resultService.setResults(data.results, true);
            });
        // by player
        } else if (!filterGroups && !filterWeeks && filterPlayers) {
            $http.get(baseUrl + '/results/player/' + $scope.obj.playerfilter).success(function(data) {
                resultService.setResults(data.results, true);
            });
        // by group && week
        } else if (filterGroups && filterWeeks && !filterPlayers) {
            $http.get(baseUrl + '/results/group/' + $scope.obj.groupfilter + '/week/' + $scope.obj.weekfilter).success(function(data) {
                resultService.setResults(data.results, true);
            });
        // by group && player
        } else if (filterGroups && !filterWeeks && filterPlayers) {
            $http.get(baseUrl + '/results/group/' + $scope.obj.groupfilter + '/player/' + $scope.obj.playerfilter).success(function(data) {
                resultService.setResults(data.results, true);
            });
        // by week && player
        } else if (!filterGroups && filterWeeks && filterPlayers) {
            $http.get(baseUrl + '/results/week/' + $scope.obj.weekfilter + '/player/' + $scope.obj.playerfilter).success(function(data) {
                resultService.setResults(data.results, true);
            });
        // by group && week && player
        } else if (filterGroups && filterWeeks && filterPlayers) {
            $http.get(baseUrl + '/results/group/' + $scope.obj.groupfilter + '/week/' + $scope.obj.weekfilter + '/player/' + $scope.obj.playerfilter).success(function(data) {
                resultService.setResults(data.results, true);
            });
        }
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

    $http.get(baseUrl + '/results').success(function(data) {
        resultService.setResults(data.results, false);
    });
  }]);

  app.controller('TableController', ['$scope', '$http', 'tableService', 'groupService', function($scope, $http, tableService, groupService) {
    var tableCtrl = this;

    $scope.obj = {
        groupfilter: undefined
    };
    tableCtrl.showFilters = false;

    tableCtrl.toggleFilters = function() {
        tableCtrl.showFilters = !tableCtrl.showFilters;
    },

    tableCtrl.getGroups = function() {
        return groupService.getGroups();
    },

    $http.get(baseUrl + '/results').success(function(data) {
        tableService.setTables(data.results);
    });

    tableCtrl.filter = function() {
        if ($scope.obj.tableFilter !== 'all') {
            $http.get(baseUrl + '/results/group/' + $scope.obj.tableFilter).success(function(data) {
                tableService.setTables(data.results);
            });
        } else {
            $http.get(baseUrl + '/results').success(function(data) {
                tableService.setTables(data.results);
            });
        }
    },

    tableCtrl.getTables = function() {
        return tableService.getTables();
    }
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
    },

    achievementCtrl.setTab = function(setTab) {
        achievementCtrl.tab = setTab;
    },

    achievementCtrl.highFinishCheckboxChange = function(isChecked) {
        if (isChecked) {
            $http.get(baseUrl + '/highfinishes').success(function(data) {
                highFinishService.setFinishes(data.highfinishes);
            });
        } else {
            $http.get(baseUrl + '/highfinishes/duplicatesremoved').success(function(data) {
                highFinishService.setFinishes(data.highfinishes);
            });
        }
    },

    achievementCtrl.bestLegCheckboxChange = function(isChecked) {
        if (isChecked) {
            $http.get(baseUrl + '/bestlegs').success(function(data) {
                bestLegService.setLegs(data.bestlegs);
            });
        } else {
            $http.get(baseUrl + '/bestlegs/duplicatesremoved').success(function(data) {
                bestLegService.setLegs(data.bestlegs);
            });
        }
    },

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
    },

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
    },

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
    },

    achievementCtrl.add180s = function() {
        var dialog = dialogs.create('/add180dialog.html', 'Add180Controller', {}, {size:'lg', keyboard: true, backdrop: true, windowClass: 'my-class'});
        dialog.result.then(function() {
            // refresh controllers internal state for 180s
        },function() {
            // do nothing as user did not update 180s
        });
    },

    achievementCtrl.edit180s = function() {
        var dialog = dialogs.create('/edit180dialog.html', 'Edit180Controller', {}, {size:'lg', keyboard: true, backdrop: true, windowClass: 'my-class'});
        dialog.result.then(function() {
            // refresh controllers internal state for 180s
        },function() {
            // do nothing as user did not update 180s
        });
    },

    achievementCtrl.delete180s = function() {
        var dialog = dialogs.create('/delete180dialog.html', 'Delete180Controller', {}, {size:'lg', keyboard: true, backdrop: true, windowClass: 'my-class'});
        dialog.result.then(function() {
            // refresh controllers internal state for high 180s
        },function() {
            // do nothing as user did not delete high 180s
        });
    },

    achievementCtrl.addHighFinish = function() {
        var dialog = dialogs.create('/addhighfinishdialog.html', 'AddHighFinishController', {}, {size:'lg', keyboard: true, backdrop: true, windowClass: 'my-class'});
        dialog.result.then(function() {
            // refresh controllers internal state for high finishes
        },function() {
            // do nothing as user did not update high finish
        });
    },

    achievementCtrl.editHighFinish = function() {
        var dialog = dialogs.create('/edithighfinishdialog.html', 'EditHighFinishController', {}, {size:'lg', keyboard: true, backdrop: true, windowClass: 'my-class'});
        dialog.result.then(function() {
            // refresh controllers internal state for high finishes
        },function() {
            // do nothing as user did not update high finishes
        });
    },

    achievementCtrl.deleteHighFinish = function() {
        var dialog = dialogs.create('/deletehighfinishdialog.html', 'DeleteHighFinishController', {}, {size:'lg', keyboard: true, backdrop: true, windowClass: 'my-class'});
        dialog.result.then(function() {
            // refresh controllers internal state for high finishes
        },function() {
            // do nothing as user did not delete high finish
        });
    },

    achievementCtrl.addBestLeg = function() {
        var dialog = dialogs.create('/addbestlegdialog.html', 'AddBestLegController', {}, {size:'lg', keyboard: true, backdrop: true, windowClass: 'my-class'});
        dialog.result.then(function() {
            // refresh controllers internal state for best legs
        },function() {
            // do nothing as user did not update best legs
        });
    },

    achievementCtrl.editBestLeg = function() {
        var dialog = dialogs.create('/editbestlegdialog.html', 'EditBestLegController', {}, {size:'lg', keyboard: true, backdrop: true, windowClass: 'my-class'});
        dialog.result.then(function() {
            // refresh controllers internal state for best legs
        },function() {
            // do nothing as user did not update best legs
        });
    },

    achievementCtrl.deleteBestLeg = function() {
        var dialog = dialogs.create('/deletebestlegdialog.html', 'DeleteBestLegController', {}, {size:'lg', keyboard: true, backdrop: true, windowClass: 'my-class'});
        dialog.result.then(function() {
            // refresh controllers internal state for best legs
        },function() {
            // do nothing as user did not update best legs
        });
    },

    $http.get(baseUrl + '/180s').success(function(data) {
        player180Service.set180s(data.player180s);
    });
    $http.get(baseUrl + '/highfinishes/duplicatesremoved').success(function(data) {
        highFinishService.setFinishes(data.highfinishes);
    });
    $http.get(baseUrl + '/bestlegs/duplicatesremoved').success(function(data) {
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

  app.directive('tablesList', function() {
    return {
      restrict: 'E',
      templateUrl: 'tables.html'
    };
  });
  
  app.directive('homePage', function() {
    return {
      restrict: 'E',
      templateUrl: 'home.html'
    };
  });
 
  app.directive('newsPage', function() {
    return {
      restrict: 'E',
      templateUrl: 'news.html'
    };
  });
})();