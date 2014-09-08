"use strict";

var intel = new require('intel');

intel.config({
    formatters: {
        'simple': {
            'format': '[%(levelname)s] %(message)s',
            'colorize': true
        },
        'details': {
            'format': '[%(date)s] %(name)s.%(levelname)s: %(message)s',
            'strip': true
        }
    },
    handlers: {
        'terminal': {
            'class': intel.handlers.Console,
            'formatter': 'simple',
            'level': intel.INFO
        },

        'elasticErrors': {
            'class': intel.handlers.Rotating,
            'level': intel.ERROR,
            'file': 'logs/elastic.errors.log',
            'formatter': 'details'
        },

        'app': {
            'class': intel.handlers.Rotating,
            'level': intel.INFO,
            'file': 'logs/app.log',
            'formatter': 'details'
        },

        'app.errors': {
            'class': intel.handlers.Rotating,
            'level': intel.ERROR,
            'file': 'logs/app.errors.log',
            'formatter': 'details'
        }
    },
    loggers: {

        'app': {
            'handlers': ['app', 'app.errors', 'terminal'],
            'level': intel.INFO
        },

        'amqp': {
            'handlers': ['terminal'],
            'level': intel.INFO,
            'handleExceptions': true,
            'exitOnError': false,
            'propagate': false
        },

        'elastic': {
            'handlers': ['elasticErrors'],
            'level': intel.ERROR
        }
    }
});

module.exports = intel;
