'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _context;

var _cozydb = require('cozydb');

var americano = _interopRequireWildcard(_cozydb);

var _helpers = require('../helpers');

var _operationtype = require('./operationtype');

var _operationtype2 = _interopRequireDefault(_operationtype);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _helpers.makeLogger)('models/operations');

// Whenever you're adding something to the model, don't forget to modify
// Operation.prototype.mergeFrom.  Also, this should be kept in sync with the
// merging of operations on the client side.
var Operation = americano.getModel('bankoperation', {
    // external (backend) account id
    bankAccount: String,

    // internal id
    categoryId: String,
    // internal id
    operationTypeID: String,

    title: String,
    date: Date,
    amount: Number,
    raw: String,
    dateImport: Date,
    customLabel: String,

    // Tell if the user has created the operation by itself, or if weboob did.
    createdByUser: Boolean,

    // TODO: remove linkPlainEnglish?
    // {linkTranslationKey: String, linkPlainEnglish: String, url: String}
    attachments: Object,

    // Binary is an object containing one field (file) that links to a binary
    // document via an id. The binary document has a binary file
    // as attachment.
    binary: function binary(x) {
        return x;
    }
});

Operation = (0, _helpers.promisifyModel)(Operation);

var request = (0, _helpers.promisify)((_context = Operation).request.bind(_context));
var requestDestroy = (0, _helpers.promisify)((_context = Operation).requestDestroy.bind(_context));

Operation.byAccount = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(account) {
        var params;
        return _regenerator2.default.wrap(function _callee$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        if ((typeof account === 'undefined' ? 'undefined' : (0, _typeof3.default)(account)) !== 'object' || typeof account.accountNumber !== 'string') {
                            log.warn('Operation.byAccount misuse: account must be an Account');
                        }

                        params = {
                            key: account.accountNumber
                        };
                        _context2.next = 4;
                        return request('allByBankAccount', params);

                    case 4:
                        return _context2.abrupt('return', _context2.sent);

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee, this);
    }));
    return function byAccount(_x) {
        return ref.apply(this, arguments);
    };
}();

Operation.byAccounts = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(accountNums) {
        var params;
        return _regenerator2.default.wrap(function _callee2$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        if (!(accountNums instanceof Array)) log.warn('Operation.byAccounts misuse: accountNums must be an array');

                        params = {
                            keys: accountNums
                        };
                        _context3.next = 4;
                        return request('allByBankAccount', params);

                    case 4:
                        return _context3.abrupt('return', _context3.sent);

                    case 5:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee2, this);
    }));
    return function byAccounts(_x2) {
        return ref.apply(this, arguments);
    };
}();

Operation.byBankSortedByDate = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(account) {
        var params;
        return _regenerator2.default.wrap(function _callee3$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        if ((typeof account === 'undefined' ? 'undefined' : (0, _typeof3.default)(account)) !== 'object' || typeof account.accountNumber !== 'string') {
                            log.warn('Operation.byBankSortedByDate misuse: account must be an\n                  Account');
                        }

                        params = {
                            startkey: [account.accountNumber + '0'],
                            endkey: [account.accountNumber],
                            descending: true
                        };
                        _context4.next = 4;
                        return request('allByBankAccountAndDate', params);

                    case 4:
                        return _context4.abrupt('return', _context4.sent);

                    case 5:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee3, this);
    }));
    return function byBankSortedByDate(_x3) {
        return ref.apply(this, arguments);
    };
}();

Operation.allLike = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(operation) {
        var date, amount, params;
        return _regenerator2.default.wrap(function _callee4$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        if ((typeof operation === 'undefined' ? 'undefined' : (0, _typeof3.default)(operation)) !== 'object') log.warn('Operation.allLike misuse: operation must be an object');

                        date = new Date(operation.date).toISOString();
                        amount = (+operation.amount).toFixed(2);
                        params = {
                            key: [operation.bankAccount, date, amount, operation.raw]
                        };
                        _context5.next = 6;
                        return request('allLike', params);

                    case 6:
                        return _context5.abrupt('return', _context5.sent);

                    case 7:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee4, this);
    }));
    return function allLike(_x4) {
        return ref.apply(this, arguments);
    };
}();

Operation.destroyByAccount = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(accountNum) {
        var params;
        return _regenerator2.default.wrap(function _callee5$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        if (typeof accountNum !== 'string') log.warn('Operation.destroyByAccount misuse: accountNum must be a\n                  string');

                        params = {
                            key: accountNum,
                            // Why the limit? See https://github.com/cozy/cozy-db/issues/41
                            limit: 9999999
                        };
                        _context6.next = 4;
                        return requestDestroy('allByBankAccount', params);

                    case 4:
                        return _context6.abrupt('return', _context6.sent);

                    case 5:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee5, this);
    }));
    return function destroyByAccount(_x5) {
        return ref.apply(this, arguments);
    };
}();

Operation.byCategory = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(categoryId) {
        var params;
        return _regenerator2.default.wrap(function _callee6$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        if (typeof categoryId !== 'string') log.warn('Operation.byCategory API misuse: ' + categoryId);

                        params = {
                            key: categoryId
                        };
                        _context7.next = 4;
                        return request('allByCategory', params);

                    case 4:
                        return _context7.abrupt('return', _context7.sent);

                    case 5:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee6, this);
    }));
    return function byCategory(_x6) {
        return ref.apply(this, arguments);
    };
}();

var hasCategory = function hasCategory(op) {
    return typeof op.categoryId !== 'undefined';
};

var hasType = function hasType(op) {
    return typeof op.operationTypeID !== 'undefined' && op.operationTypeID !== _operationtype2.default.getUnknownTypeId();
};

var hasCustomLabel = function hasCustomLabel(op) {
    return typeof op.customLabel !== 'undefined';
};

Operation.prototype.mergeWith = function (other) {
    var needsSave = false;

    var _arr = ['binary', 'attachment'];
    for (var _i = 0; _i < _arr.length; _i++) {
        var field = _arr[_i];
        if (typeof other[field] !== 'undefined' && typeof this[field] === 'undefined') {
            this[field] = other[field];
            needsSave = true;
        }
    }

    if (!hasCategory(this) && hasCategory(other)) {
        this.categoryId = other.categoryId;
        needsSave = true;
    }

    if (!hasType(this) && hasType(other)) {
        this.operationTypeID = other.operationTypeID;
        needsSave = true;
    }

    if (!hasCustomLabel(this) && hasCustomLabel(other)) {
        this.customLabel = other.customLabel;
        needsSave = true;
    }

    return needsSave;
};

Operation.isOperation = function (operation) {
    // We check the operation has the minimum parameters of an operations:
    // bankAccount
    // title
    // date
    // amount
    // operationTypeID
    return operation.hasOwnProperty('bankAccount') && operation.hasOwnProperty('title') && operation.hasOwnProperty('date') && operation.hasOwnProperty('amount') && operation.hasOwnProperty('operationTypeID');
};

module.exports = Operation;