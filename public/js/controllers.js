'use strict';

/* Controllers */

/*** Définition des contrôleur de l'application ***/
var answareControllers = angular.module('answareControllers', []);

answareControllers.controller('headerCtrl', function ($scope) {
  $scope.categories = [
    'Arts & littératures',
    'Cultures générale',
    'Sciences',
    'Technologies'
    //'...'
  ];
});

answareControllers.controller('footerCtrl', function ($scope) {
  $scope.license = "MIT";
  $scope.licenseUri = "#";
});

// Contrôleur pour l'affichage de la liste des quiz
answareControllers.controller('quizListCtrl', function($scope, $http, $window, QuizFactory) {

    $scope.error = false;

    $scope.openQuiz = function (quizName) {
      $window.location.href="/#/quiz/" + quizName;
    }

    $scope.loading = QuizFactory.getQuizList();
    $scope.loading.then(
      function (response) {
        $scope.quizList = response;
      },

      function (reason) {
        switch (reason) {
          case 'ServerUnreachable':
            $scope.error = 'Le serveur de données semble indisponible.';
          break;

          default:
            $scope.error = 'Erreur inconnue.';
          break;
        }
  	  });

});

answareControllers.controller('quizTestCtrl', function ($scope, $routeParams, $timeout, $location, QuizFactory) {

  // Initialisation des variables du scope
  var quizName = $routeParams.quizName;

  $scope.debug = false;
  $scope.selected = 0;
  $scope.correctionStep = false;
  $scope.error = false;

  $scope.select = function (newId) {
    $scope.formError = false;

    $scope.pages[$scope.selected] = false;
    $scope.pages[newId] = true;
    $scope.selected = newId;

    if (!$scope.correctionStep && (newId === $scope.nbQuestions)) {
      $scope.correctionStep = true;
      $scope.selected = 0;
      $scope.correction();
    }
  };

  var compareAnswer = function (user, correct) {
    return (Array.isArray(user)) ? user.equals(correct) : (user === correct[0]);
  };

  var stopTimer = function () {
    var timer = document.getElementsByTagName('timer')[0];

    timer.stop();
    $scope.duration = timer.textContent;
  }

  $scope.range = function (max) {
    var results = [];
    for (var i = 0; i < max; i++)
      results.push(i);
    return results;
  };

  $scope.getQuestionButtonClass = function (correct) {
    return "btn btn-" + ((correct) ? 'success' : 'danger');
  };

  $scope.getSuggestClass = function (q, s) {
    if ($scope.correctionStep) {
      if ($scope.corrections !== undefined) {
        return ($scope.corrections[q].answer.indexOf(s) > -1)
          ? 'suggest-correct'
          : (($scope.corrections[q].valid) ? '' : 'suggest-wrong');
      } else {
        return '';
      }
    } else {
      return '';
    }
  };

  $scope.gotoMenu = function () {
    $location.path("/#/quiz");
  }

  $scope.correction = function () {
    QuizFactory.getCorrection(quizName).then(function(response) {
      var corrections = response;
      var nbCorrect = 0;

      corrections.forEach(function (correction, i) {
        correction.valid = compareAnswer($scope.answers[i], correction.answer);
        if (correction.valid) nbCorrect++;
      });

      $scope.corrections = corrections;

      var score = {
        good: nbCorrect,
        total:  $scope.nbQuestions
      };
      score.percent = parseInt(score.good/score.total*100);
      $scope.score = score;

      stopTimer('testTimer');

    }).catch(function() {
      $scope.error = 'Une erreur s\'est produite à la réception des données !';
    });
  };

  $scope.validate = function () {

    if ($scope.answers[$scope.selected] !== -1) {
      $scope.select($scope.selected + 1);
    } else {
      $scope.formError = "Vous devez répondre à cette question !";
    }
  }

  // On récupère les questions du quiz via la fabrique QuizFactory (sans les résultats)
  QuizFactory.getQuiz(quizName).then(function(response) {
    $scope.quiz = response;
    $scope.nbQuestions = $scope.quiz.questions.length;

    $scope.answers = createArray(-1   , $scope.nbQuestions);
    $scope.pages   = createArray(false, $scope.nbQuestions);

  }).catch(function() {
    $scope.error = 'Une erreur s\'est produite à la réception des données !';
  });

  /* Circle progressbar */
  $scope.showCurrent = function(amount){
    $timeout(function(){
        $scope.smoothPercent = parseInt(amount/$scope.nbQuestions*100);
    });
  };

});
/*** Fin de définition des contrôleurs ***/
