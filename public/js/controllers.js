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

    $scope.serviceError = false;

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
            $scope.serviceError = 'Le serveur de données semble indisponible.';
          break;

          default:
            $scope.serviceError = 'Erreur inconnue.';
          break;
        }
  	  });

});

answareControllers.controller('quizTestCtrl', function ($scope, $routeParams, $timeout, $location, QuizFactory) {

  $scope._debug_ = false;

  // Initialisation des variables du scope
  var quizName = $routeParams.quizName;

  $scope.selected = 0;
  $scope.isCorrection = false;
  $scope.serviceError = false;

  $scope.range = Utils.createRange;

  $scope.selectQuestion = function (questionId) {
    $scope.userInputError = false;

    $scope.pages[$scope.selected] = false;
    $scope.pages[$scope.selected = questionId] = true;

    if (!$scope.isCorrection && (questionId === $scope.quiz.nbQuestions())) {
      $scope.isCorrection = true;
      $scope.selected = 0;
      $scope.showCorrection();
    }
  };

  var stopTimer = function () {
      var timer = document.getElementsByTagName('timer')[0];

      timer.stop();
      $scope.duration = timer.textContent;
  }

  $scope.getQuestionButtonClass = function (correct) {
      return "btn btn-" + ((correct) ? 'success' : 'danger');
  };

  $scope.getAnswerClass = function (qId, sId) {
      if (!$scope.isCorrection) return "";

      let currentQuestion = $scope.quiz.getQuestion(qId);

      switch (currentQuestion.getType()) {
          case "single":
              if (Utils.arrayContains(currentQuestion.getCorrectAnswers(), sId))
                  return "suggest-correct";

              if ((!currentQuestion.isValid())
                    && (Utils.arrayContains($scope.answers[qId], sId)))
                  return "suggest-wrong";

          break;

          case "multiple":
              let correct = Utils.arrayContains(currentQuestion.getCorrectAnswers(), sId);
              let given = Utils.arrayContains($scope.answers[qId], sId);

              if (given && correct) return "suggest-correct";
              if (!correct && given) return "suggest-wrong";
              if (correct && !given) return "suggest-missing";

          break;
      }

      return "";
  };

  $scope.gotoMenu = function () {
      $location.path("/#/quiz");
  };

  $scope.showCorrection = function () {

    QuizFactory.getCorrection(quizName).then(function(response) {
      $scope.quiz.applyCorrection(response);
      $scope.quiz.validateCorrection($scope.answers);

      $scope.score = $scope.quiz.getScore();

      stopTimer('testTimer');

    }).catch(function() {
      $scope.serviceError = 'Une erreur s\'est produite à la réception des données !';
    });
  };

  $scope.validate = function () {

    if ($scope.answers[$scope.selected] !== -1)
        $scope.selectQuestion($scope.selected + 1);
     else
        $scope.userInputError = "Vous devez répondre à cette question !";
  }

  // On récupère les questions du quiz via la fabrique QuizFactory (sans les résultats)
  QuizFactory.getQuiz(quizName).then(function(response) {

    $scope.quiz = new Quiz(response);
    $scope.answers = Utils.createArray(-1   , $scope.quiz.nbQuestions());
    $scope.pages   = Utils.createArray(false, $scope.quiz.nbQuestions());

  }).catch(function() {
    $scope.serviceError = 'Une erreur s\'est produite à la réception des données !';
  });

  /* Circle progressbar */
  $scope.showCurrent = function(amount){
    $timeout(function(){
        if ($scope.quiz)
            $scope.smoothPercent = parseInt(amount/$scope.quiz.nbQuestions()*100);
    });
  };

});
/*** Fin de définition des contrôleurs ***/
