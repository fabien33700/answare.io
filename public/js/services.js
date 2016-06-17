'use strict';

angular.module('answareServices', [])
  .factory('QuizFactory', function($http, $q, $log) {
    return {
      /**
       * Returns a JSON representation of a quiz from the data server,
       * without correction datas.
       * @param string name The quiz name.
       * @request /api/quizzes/<name>
       */
      getQuiz: function (name) {
        var defer = $q.defer();

        $http.get('/api/quizzes/' + name).then(function (response) {
          var quiz = response.data;

          quiz.questions.forEach(function (question) {
            Utils.removeAttr(question, ['explain', 'correct']);
          });

          defer.resolve(quiz);
        });

        return defer.promise;
      },

      /**
       * Returns a JSON representation of the quiz correction datas
       * @param string name The quiz name.
       * @request /api/quizzes/<name>
       */
      getCorrection: function (name) {
        var defer = $q.defer();

        $http.get('/api/quizzes/' + name).then(function (response) {
          var quiz = response.data;
          var corrections = [];

          quiz.questions.forEach(function (question) {
            corrections.push({
              answer: question.correct,
              explain: question.explain
            });
          });

          defer.resolve(corrections);
        });

        return defer.promise;

      },

      /**
       * Returns the quiz list from the data server
       * @request /api/quizzes
       */
      getQuizList: function() {
        var defer = $q.defer();

        $http.get('/api/quizzes').then(
          function (response) {
            defer.resolve(response.data);
          },

          function (reason) {
            defer.reject("ServerUnreachable");
          });

        return defer.promise;
      }
    };
  });
