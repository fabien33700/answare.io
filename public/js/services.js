'use strict';

angular.module('answareServices', [])
  .factory('QuizFactory', function($http, $q, $log) {
    return {
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
