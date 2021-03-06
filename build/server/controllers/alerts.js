'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.update = exports.destroy = exports.create = exports.loadAlert = undefined;

var _account = require('../models/account');

var _account2 = _interopRequireDefault(_account);

var _alert3 = require('../models/alert');

var _alert4 = _interopRequireDefault(_alert3);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loadAlert = exports.loadAlert = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next, alertId) {
        var alert;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return _alert4.default.find(alertId);

                    case 3:
                        alert = _context.sent;

                        if (alert) {
                            _context.next = 6;
                            break;
                        }

                        throw { status: 404, message: 'bank alert not found' };

                    case 6:
                        req.preloaded = req.preloaded || {};
                        req.preloaded.alert = alert;
                        next();
                        _context.next = 14;
                        break;

                    case 11:
                        _context.prev = 11;
                        _context.t0 = _context['catch'](0);
                        return _context.abrupt('return', (0, _helpers.asyncErr)(res, _context.t0, 'when preloading alert'));

                    case 14:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 11]]);
    }));
    return function loadAlert(_x, _x2, _x3, _x4) {
        return ref.apply(this, arguments);
    };
}();

var create = exports.create = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(req, res) {
        var newAlert, _alert, account;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        newAlert = req.body;

                        if (!(!newAlert || typeof newAlert.bankAccount !== 'string' || typeof newAlert.type !== 'string')) {
                            _context2.next = 3;
                            break;
                        }

                        return _context2.abrupt('return', (0, _helpers.sendErr)(res, 'when creating an alert', 400, 'missing parameters'));

                    case 3:
                        _context2.prev = 3;
                        _context2.next = 6;
                        return _alert4.default.create(newAlert);

                    case 6:
                        _alert = _context2.sent;
                        _context2.next = 9;
                        return _account2.default.byAccountNumber(newAlert.bankAccount);

                    case 9:
                        account = _context2.sent;

                        if (account) {
                            _context2.next = 12;
                            break;
                        }

                        throw { status: 404, message: 'bank account not found' };

                    case 12:
                        res.status(201).send(_alert);
                        _context2.next = 18;
                        break;

                    case 15:
                        _context2.prev = 15;
                        _context2.t0 = _context2['catch'](3);
                        return _context2.abrupt('return', (0, _helpers.asyncErr)(res, _context2.t0, 'when creating an alert'));

                    case 18:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[3, 15]]);
    }));
    return function create(_x5, _x6) {
        return ref.apply(this, arguments);
    };
}();

var destroy = exports.destroy = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(req, res) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.prev = 0;
                        _context3.next = 3;
                        return req.preloaded.alert.destroy();

                    case 3:
                        res.sendStatus(204);
                        _context3.next = 9;
                        break;

                    case 6:
                        _context3.prev = 6;
                        _context3.t0 = _context3['catch'](0);
                        return _context3.abrupt('return', (0, _helpers.asyncErr)(res, _context3.t0, 'when deleting a bank alert'));

                    case 9:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this, [[0, 6]]);
    }));
    return function destroy(_x7, _x8) {
        return ref.apply(this, arguments);
    };
}();

var update = exports.update = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(req, res) {
        var _alert2;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.prev = 0;
                        _context4.next = 3;
                        return req.preloaded.alert.updateAttributes(req.body);

                    case 3:
                        _alert2 = _context4.sent;

                        res.status(200).send(_alert2);
                        _context4.next = 10;
                        break;

                    case 7:
                        _context4.prev = 7;
                        _context4.t0 = _context4['catch'](0);
                        return _context4.abrupt('return', (0, _helpers.asyncErr)(res, _context4.t0, 'when updating a bank alert'));

                    case 10:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this, [[0, 7]]);
    }));
    return function update(_x9, _x10) {
        return ref.apply(this, arguments);
    };
}();