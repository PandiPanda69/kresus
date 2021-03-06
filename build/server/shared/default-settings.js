'use strict';

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DefaultSettings = new _map2.default();

DefaultSettings.set('weboob-auto-update', 'false');
DefaultSettings.set('weboob-auto-merge-accounts', 'true');
DefaultSettings.set('weboob-installed', 'false');
DefaultSettings.set('duplicateThreshold', '24');
DefaultSettings.set('defaultChartType', 'all');
DefaultSettings.set('defaultChartPeriod', 'current-month');
DefaultSettings.set('defaultAccountId', '');

module.exports = DefaultSettings;