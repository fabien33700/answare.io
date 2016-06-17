
/**
 * Object that represents a quiz.
 * @constructor
 * @param Object obj JSON representation of a quiz.
 * @throws string The error message.
 */
function Quiz(obj) {
    /**
     * The description of the quiz
     */
    this._descr = obj.descr;

    /**
     * The author of the quiz
     */
    this._author = obj.author;

    /**
     * The title of the quiz
     */
    this._title = obj.title;

    /**
     * The name of the quiz, used by the app router
     * i.e. My great quiz -> my-great-quiz
     */
    this._name = obj.name;

    /**
     * Indicates whether the object has already retrieved the correction
     */
    this._hasCorrection = false;

    /**
     * If the given object (obj) has not the required attributes.
     */
    if (!Assert.isFilledString(this._descr) ||
        !Assert.isFilledString(this._author) ||
        !Assert.isFilledString(this._title) ||
        !Assert.isFilledString(this._name))
        throw "Quiz object source is not valid.";

    /**
     * The quiz questions as an array of Question object.
     */
    this._questions = fillCollection(obj.questions, Question);

    /*** Methods ***/

    /**
     * Accessor for the quiz title
     * @return string
     */
    this.getTitle = function () { return this._title; }

    /**
     * Accessor for the quiz author
     * @return string
     */
    this.getAuthor = function () { return this._author; }

    /**
     * Accessor for the quiz description
     * @return string
     */
    this.getDescription = function () { return this._descr; }

    /**
     * Accessor for the quiz name
     * @return string
     */
    this.getName = function () { return this._name; }

    /**
     * Accessor for the quiz questions array.
     * @return array<Question>
     */
    this.getQuestions = function () { return this._questions; }

    /**
     * Returns a question by its index
     * @param number The question index
     * @return Question
     */
    this.getQuestion = function (index) { return this._questions[index]; }

    /**
     * Returns the number of questions
     * @return number
     */
    this.nbQuestions = function () { return this._questions.length; }

    /**
     * Accessor for the _hasCorrection attributes
     * @return boolean
     */
    this.hasCorrection = function () {
        return this._hasCorrection;
    }

    /**
     * Apply the correction attributes to the object.
     * @param Object correctionObj JSON representation of the correction sent by QuizFactory.
     */
    this.applyCorrection = function (correctionObj) {
        var corrections = fillCollection(correctionObj, Correction);

        for (let question of this.getQuestions()) {
            let id = question.getIndex();
            question._correctAnswers = corrections[id].getCorrectAnswers();
            question._explain =  corrections[id].getExplain();
        }

        this._hasCorrection = true;
    }

    /**
     * Compare each questions good answers to the user answers
     * to determine if question is valid or not.
     * @param Object userAnswers The array of user answers.
     */
    this.validateCorrection = function (userAnswers) {
        for (let question of this.getQuestions()) {
            let id = question.getIndex();
            let userAnswer = userAnswers[id];
                userAnswer = (Array.isArray(userAnswer)) ? userAnswer : [userAnswer];

            question._valid = Utils.compareArray(question.getCorrectAnswers(), userAnswer);
        }
    }

    /**
     * Get the score of the user.
     * @return Object
     */
    this.getScore = function () {
        // Ensuring the Quiz got the correction datas.
        if (!this.hasCorrection()) {
            console.warn("applyCorrection() must be called before.");
            return;
        }

        var score = {};

        score.good = this.nbGoodAnswers();
        score.total = this.nbQuestions();
        score.percent = parseInt(score.good/score.total*100);

        return score;
    };

    /**
     * Get the number of good answer given by the user.
     * @return number
     */
    this.nbGoodAnswers = function () {
        var nbGoodAnswer = 0;
        for (let question of this.getQuestions())
            if (question.isValid()) nbGoodAnswer++;

        return nbGoodAnswer;
    };
}

/**
 * Object that represents a quiz question.
 * @constructor
 * @param number qid The question index in the questions array
 * @param Object obj The JSON representation of a quiz question
 * @throws string The error message.
 */
function Question(qid, obj) {
    /**
     * If the given question id (qid) is not a positive integer.
     */
    if ((!Assert.isInteger(qid)) || (!Assert.isPositive(qid)))
        throw "Question id must be positive integer.";

    /**
     * The question index
     */
    this._id = qid;

    /**
     * The question text
     */
    this._text = obj.text;

    /**
     * The question type
     */
    this._type = obj.type;

    /**
     * The question array of correct answers
     */
    this._correctAnswers = null;

    /**
     * (Optional) The question answer explanation
     */
    this._explain = null;

    /**
     * If the given object (obj) has not the required attributes.
     */
    if (!Assert.isFilledString(this._text) ||
        !Assert.isFilledString(this._type))
        throw "Question object source is not valid.";

    /**
     * The question suggests as an array of Suggest object.
     */
    this._suggests = fillCollection(obj.suggests, Suggest);

    /*** Methods ***/

    /**
     * Accessor for the suggest index.
     * @return number
     */
    this.getIndex = function () { return this._id; }

    /**
     * Accessor for the question text.
     * @return string
     */
    this.getText = function () { return this._text; }

    /**
     * Accessor for the question type.
     * i.e. single, multiple
     * @return string
     */
    this.getType = function () { return this._type; }

    /**
     * Accessor for the array of question suggests.
     * @return array<Suggest>
     */
    this.getSuggests = function () { return this._suggests; }

    /**
     * Accessor for the array of question correct answers
     * (after applyCorrection() execution)
     * @return array<Correction>
     */
    this.getCorrectAnswers = function () { return this._correctAnswers; }

    /**
     * Accessor for the question answer(s) explanation.
     * (after applyCorrection() execution)
     * @return string
     */
    this.getExplain = function () { return this._explain; }

    /**
     * Accessor for the valid indicator.
     * (after validateCorrection() execution)
     * return boolean true if user answer is good, false if it's wrong
     */
    this.isValid = function () { return (Assert.isBoolean(this._valid) && this._valid); }
}

/**
 * Object that represents a question suggest.
 * @constructor
 * @param Object obj JSON representation of a suggest.
 * @throws string The error message.
 */
function Suggest(sid, text) {
    /**
     * If the given suggest id (sid) is not a positive integer.
     */
    if ((!Assert.isInteger(sid)) || (!Assert.isPositive(sid)))
        throw "Suggest id must be positive integer.";

    /**
     * If the given object (obj) has not the required attributes.
     */
    if (!Assert.isFilledString(text))
        throw "Suggest text must be a non-empty string.";

    /**
     * The suggest index
     */
    this._id = sid;

    /**
     * The suggest text
     */
    this._text = text;

    /**
     * Accessor for the suggest index.
     * @return number
     */
    this.getIndex = function () { return this._id; }

    /**
     * Accessor for the suggest text
     * @return string
     */
    this.getText = function () { return this._text; }
}

/**
 * Object that represents a question correction.
 * @constructor
 * @param Object obj JSON representation of a correction.
 * @throws string The error message.
 */
function Correction(cid, obj) {
    /**
     * If the given correction id (cid) is not a positive integer.
     */
    if ((!Assert.isInteger(cid)) || (!Assert.isPositive(cid)))
        throw "Correction id must be positive integer.";

    /**
     * The correction index
     */
    this._id = cid;

    /**
     * The correction answer
     */
    this._correct = obj.answer;

    /**
     * The correction explanation
     * Explaination text is an optional field.
     */
    this._explain = obj.explain || "";

    /**
     * If the given object (obj) has not the required attributes.
     */
    if (!Assert.isFilledArray(this._correct))
        throw "Correction object source is not valid.";

    /**
     * Accessor for the correction index.
     * @return number
     */
    this.getIndex = function () { return this._id; }

    /**
     * Accessor for the array of correction's correct answers.
     * @return array
     */
    this.getCorrectAnswers = function () { return this._correct; }

    /**
     * Accessor for the correction explain
     * @return string
     */
    this.getExplain = function () { return this._explain ; }
}

/**
 * Converts an array of generic object to an array of object whose class is <itemType>
 * (in the present case, Question, Suggest or Correction)
 * @param Object obj The JSON representation of a generic quiz object
 * @param Object The class whose array item must be converted to.
 * @return array<<itemType>>
 * @throws string The error message.
 */
function fillCollection(obj, itemType) {
    var collection = [];

    if (!Assert.isFilledArray(obj))
        throw "Object collection given must be a non-empty array.";

    let itemId = 0;
    for (let item of obj) {
        try {
            collection.push(new itemType(itemId, item));
        } catch (e) {
            throw itemType + " source collection contains some invalid " + itemType + " object (index : " + itemId + ") : " + e;
        }
        itemId++;
    }

    return collection;
}
