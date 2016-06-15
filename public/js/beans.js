function Quiz(obj) {
    this._descr = obj.descr;
    this._author = obj.author;
    this._title = obj.title;
    this._name = obj.name;

    if (!Utils.assertString(this._descr) ||
        !Utils.assertString(this._author) ||
        !Utils.assertString(this._title) ||
        !Utils.assertString(this._name))
        throw "Quiz object source is not valid.";

    this._questions = fillCollection(obj.questions, Question);

    this.getTitle = function () { return this._title; }
    this.getAuthor = function () { return this._author; }
    this.getDescription = function () { return this._descr; }
    this.getName = function () { return this._name; }

    this.getQuestions = function () { return this._questions; }
    this.getQuestion = function (index) { return this._questions[index]; }
    this.nbQuestions = function () { return this._questions.length; }

    this._hasCorrection = false;

    this.hasCorrection = function () {
        return this._hasCorrection;
    }

    this.applyCorrection = function (correctionObj) {
        var corrections = fillCollection(correctionObj, Correction);

        for (let question of this.getQuestions()) {
            let id = question.getIndex();
            question._correctAnswers = corrections[id].getCorrectAnswers();
            question._explain =  corrections[id].getExplain();
        }

        this._hasCorrection = true;
    }

    this.validateCorrection = function (userAnswers) {
        for (let question of this.getQuestions()) {
            let id = question.getIndex();
            let userAnswer = userAnswers[id];
                userAnswer = (Array.isArray(userAnswer)) ? userAnswer : [userAnswer];

            question._valid = Utils.compareArray(question.getCorrectAnswers(), userAnswer);
        }
    }

    this.getScore = function () {
        var score = {};

        score.good = this.nbGoodAnswers();
        score.total = this.nbQuestions();
        score.percent = parseInt(score.good/score.total*100);

        return score;
    };

    this.nbGoodAnswers = function () {
        var nbGoodAnswer = 0;
        for (let question of this.getQuestions())
            if (question.isValid()) nbGoodAnswer++;

        return nbGoodAnswer;
    };
}

function Question(qid, obj) {
    if (!Utils.assertPositiveInteger(qid))
        throw "Question id must be positive integer.";

    this._id = qid;
    this._text = obj.text;
    this._type = obj.type;

    // Prepare for receiving correction
    this._correctAnswers = null;
    this._explain = null;

    if (!Utils.assertString(this._text) ||
        !Utils.assertString(this._type))
        throw "Question object source is not valid.";

    this._suggests = fillCollection(obj.suggests, Suggest);

    this.getIndex = function () { return this._id; }
    this.getText = function () { return this._text; }
    this.getType = function () { return this._type; }
    this.getSuggests = function () { return this._suggests; }

    /*** Correction ***/
    this.getCorrectAnswers = function () { return this._correctAnswers; }
    this.getExplain = function () { return this._explain; }
    this.isValid = function () { return (Utils.isDefined(this._valid) && this._valid); }
}

function Suggest(sid, text) {
    if (!Utils.assertPositiveInteger(sid))
        throw "Suggest id must be positive integer.";

    if (!Utils.assertString(text))
        throw "Suggest text must be a non-empty string.";

    this._id = sid;
    this._text = text;

    this.getIndex = function () { return this._id; }
    this.getText = function () { return this._text; }
}

/*** A modifier ***/
function Correction(cid, obj) {
    if (!Utils.assertPositiveInteger(cid))
        throw "Correction id must be positive integer.";

    this._id = cid;
    this._correct = obj.answer;
    this._explain = obj.explain || "";

    if (!Utils.assertArray(this._correct))
        throw "Correction object source is not valid.";

    this.getIndex = function () { return this._id; }
    this.getCorrectAnswers = function () { return this._correct; }
    this.getExplain = function () { return this._explain || ""; }
}

function fillCollection(obj, itemType) {
    var collection = [];

    if (!Utils.assertArray(obj))
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
