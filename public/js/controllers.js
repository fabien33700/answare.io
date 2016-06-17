'use strict';

/* Controllers */

/*** App controllers definition ***/
var answareControllers = angular.module('answareControllers', []);

/**
 * headerCtrl : The header controller.
 * @controller
 * @view partials/header.html
 */
answareControllers.controller('headerCtrl', function ($scope) {
    $scope.categories = [
      'Arts & littératures',
      'Cultures générale',
      'Sciences',
      'Technologies'
      //'...'
    ];
});

/**
 * footerCtrl : The footer controller.
 * @controller
 * @view partials/footer.html
 */
answareControllers.controller('footerCtrl', function ($scope) {
  $scope.license = "MIT";
  $scope.licenseUri = "#";
});

/**
 * quizListCtrl : The controller that shows the list of all the quizzes.
 * @controller
 * @view views/quiz-list.html
 */
answareControllers.controller('quizListCtrl', function($scope, $http, $window, QuizFactory) {

    // The error message to show to the user
    $scope.serviceError = false;

    /**
     * Go to the selected quiz.
     * @param quizName The name of the quiz
     */
    $scope.openQuiz = function (quizName) {
      $window.location.href="/#/quiz/" + quizName;
    }

    // Define the quiz retrieving promise for the loading indicator.
    $scope.loading = QuizFactory.getQuizList();
    $scope.loading.then(
      function (response) {
        // The array of quizzes is delivered to the view.
        $scope.quizList = response;
      },

      // Show to the user a sanitized error message
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

/**
 * quizTestCtrl : The controller that starts the quiz test for the user
 * @controller
 * @view views/quiz-test.html
 */
answareControllers.controller('quizTestCtrl', function ($scope, $routeParams, $timeout, $location, QuizFactory) {

  /**
   * Debug mode
   * true -> shows all the object as JSON on the bottom of the page.
   * false -> normal behaviour
   */
  $scope._debug_ = false;

  // Get the quiz name by parsing the request url /quiz/<quiz-name>
  var quizName = $routeParams.quizName;

  /*** Variables initialization ***/

  $scope.selected = 0;            // The index of the current question
  $scope.isCorrection = false;    // Indicates whether the controller is at correction step
  $scope.serviceError = false;    // The service error message to show to the user

  // Map to the controller a function to make numeric range
  $scope.range = Utils.createRange;

  /**
   * Select the question by its id
   * @param number questionId The question index
   */
  $scope.selectQuestion = function (questionId) {
    // The error message to notify the user he did'nt answer the current question.
    $scope.userInputError = false;

    $scope.pages[$scope.selected] = false;
    $scope.pages[$scope.selected = questionId] = true;

    // Skip to the correction step when the user had just answered the last question.
    if (!$scope.isCorrection && (questionId === $scope.quiz.nbQuestions())) {
      $scope.isCorrection = true;
      $scope.selected = 0;
      $scope.showCorrection();
    }
  };

  /**
   * Stop the quiz test timer when user had finished.
   */
  var stopTimer = function () {
      var timer = document.getElementsByTagName('timer')[0];

      timer.stop();
      $scope.duration = timer.textContent;
  }

  /**
   * Get the CSS classname for the bottom navigation ribbon while correction step.
   * @param boolean Indicates whether user gave the right answer to the question.
   */
  $scope.getQuestionButtonClass = function (correct) {
      return "btn btn-" + ((correct) ? 'success' : 'danger');
  };

  /**
   * Get the CSS classname for a question's suggest.
   * Used to colorize suggest to show to the user the errors he made
   * during the correction step.
   * @param number qId The question index.
   * @param number sId The suggest index.
   */
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

  /**
   * Skip to the main menu, the quiz list.
   */
  $scope.gotoMenu = function () {
      $location.path("/#/quiz");
  };

  /**
   * Get the correction (each questions' correct answer(s) and explanation)
   * and show the result to the user.
   */
  $scope.showCorrection = function () {

    QuizFactory.getCorrection(quizName).then(function(response) {
      $scope.quiz.applyCorrection(response);
      $scope.quiz.validateCorrection($scope.answers);

      $scope.score = $scope.quiz.getScore();

      stopTimer('testTimer');

    }).catch(function() {
      // Error message : the controller could not retrieve the correction
      $scope.serviceError = 'Une erreur s\'est produite à la réception des données !';
    });
  };

  /**
   * Process to the validation of the current question (ensuring user had answered).
   * Called by the "Next question" button
   */
  $scope.validate = function () {

    if ($scope.answers[$scope.selected] !== -1)
        $scope.selectQuestion($scope.selected + 1);
     else
        // Error message : the user did not answer the question
        $scope.userInputError = "Vous devez répondre à cette question !";
  }

  // Getting quiz questions by using QuizFactory (without correction)
  QuizFactory.getQuiz(quizName).then(function(response) {

    // Map JSON quiz datas to a Quiz object
    $scope.quiz = new Quiz(response);

    // Create answer's array. -1 means the user does not answer yet.
    $scope.answers = Utils.createArray(-1   , $scope.quiz.nbQuestions());
    $scope.pages   = Utils.createArray(false, $scope.quiz.nbQuestions());

  }).catch(function() {
    // Error message : the controller could not retrieve the correction
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
