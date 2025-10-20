"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var Hapi = require('@hapi/hapi');

var jwt = require('hapi-auth-jwt2');

var Path = require('path');

var Inert = require('@hapi/inert');

var authRoutes = require('./routes/auth.routes');

var statisticsRoutes = require('./routes/statistics.routes');

var reportRoutes = require('./routes/report.routes');

var riwayatRoutes = require('./routes/riwayat.routes');

var reviewRoutes = require('./routes/review.routes');

var superadminRoutes = require('./routes/superadmin.routes');

require('dotenv').config();

var validate = function validate(decoded, request, h) {
  return regeneratorRuntime.async(function validate$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(request.path.startsWith('/api/superadmin') && decoded.role !== 'superadmin')) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", {
            isValid: false
          });

        case 2:
          return _context.abrupt("return", {
            isValid: true,
            credentials: decoded
          });

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

var init = function init() {
  var server, routes;
  return regeneratorRuntime.async(function init$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          server = Hapi.server({
            port: process.env.PORT || 5000,
            host: process.env.HOST || '0.0.0.0',
            routes: {
              cors: {
                origin: ['https://urbanaid-client.vercel.app', 'http://localhost:3000', 'http://localhost:9000', 'http://127.0.0.1:9000'],
                headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match', 'X-Requested-With', 'cache-control', 'Origin', 'Access-Control-Request-Method', 'Access-Control-Request-Headers'],
                credentials: true,
                maxAge: 600
              },
              files: {
                relativeTo: Path.join(__dirname, 'public')
              }
            }
          }); // Register plugins

          _context2.next = 3;
          return regeneratorRuntime.awrap(server.register([{
            plugin: jwt
          }, {
            plugin: Inert
          }]));

        case 3:
          // Health check route - no auth required
          server.route({
            method: 'GET',
            path: '/',
            options: {
              auth: false
            },
            handler: function handler(request, h) {
              return {
                status: 'healthy',
                message: 'Server is running',
                timestamp: new Date().toISOString()
              };
            }
          }); // Configure JWT authentication

          server.auth.strategy('jwt', 'jwt', {
            key: process.env.JWT_SECRET,
            validate: validate,
            verifyOptions: {
              algorithms: ['HS256'],
              ignoreExpiration: false
            }
          }); // Set default auth strategy

          server.auth["default"]('jwt'); // Static assets route - no auth required

          server.route({
            method: 'GET',
            path: '/assets/{param*}',
            options: {
              auth: false
            },
            handler: {
              directory: {
                path: '.',
                redirectToSlash: true,
                index: true
              }
            }
          }); // Static images route - no auth required  

          server.route({
            method: 'GET',
            path: '/images/{param*}',
            options: {
              auth: false
            },
            handler: {
              directory: {
                path: Path.join(__dirname, 'public/images'),
                redirectToSlash: true,
                index: false
              }
            }
          }); // Fallback for placeholder.jpg specifically

          server.route({
            method: 'GET',
            path: '/images/placeholder.jpg',
            options: {
              auth: false
            },
            handler: {
              file: Path.join(__dirname, 'public/images/placeholder.jpg')
            }
          }); // Global API route configuration

          server.route({
            method: ['POST', 'PUT', 'PATCH', 'DELETE'],
            path: '/api/{param*}',
            options: {
              payload: {
                parse: true,
                allow: ['application/json'],
                maxBytes: 1048576 // 1MB

              }
            },
            handler: function handler(request, h) {
              return h["continue"];
            }
          }); // Auth routes configuration - no auth required for login/register
          // server.route({
          //   method: 'POST',
          //   path: '/api/auth/{param*}',
          //   options: {
          //     auth: false,
          //     payload: {
          //       parse: true,
          //       allow: ['application/json']
          //     }
          //   },
          //   handler: (request, h) => h.continue
          // });
          // Combine all routes

          routes = [].concat(_toConsumableArray(authRoutes), _toConsumableArray(statisticsRoutes), _toConsumableArray(reportRoutes), _toConsumableArray(riwayatRoutes), _toConsumableArray(reviewRoutes), _toConsumableArray(superadminRoutes));
          server.route(routes); // Catch-all route for SPA - no auth required
          // server.route({
          //   method: 'GET',
          //   path: '/{path*}',
          //   options: {
          //     auth: false
          //   },
          //   handler: {
          //     file: 'index.html'
          //   }
          // });
          // Global error handling

          server.ext('onPreResponse', function (request, h) {
            var response = request.response;

            if (!response.isBoom) {
              return h["continue"];
            } // Handle specific error cases


            switch (response.output.statusCode) {
              case 401:
                return h.response({
                  statusCode: 401,
                  error: 'Unauthorized',
                  message: response.message || 'Missing or invalid authentication token'
                }).code(401);

              case 403:
                return h.response({
                  statusCode: 403,
                  error: 'Forbidden',
                  message: response.message || 'You do not have permission to access this resource'
                }).code(403);

              case 404:
                return h.response({
                  statusCode: 404,
                  error: 'Not Found',
                  message: response.message || 'The requested resource was not found'
                }).code(404);

              default:
                return h.response({
                  statusCode: response.output.statusCode,
                  error: response.output.payload.error,
                  message: response.message || 'An internal server error occurred'
                }).code(response.output.statusCode);
            }
          }); // Log registered routes on startup

          server.ext('onPreStart', function () {
            console.log('Registering routes:');
            routes.forEach(function (route) {
              if (Array.isArray(route.method)) {
                route.method.forEach(function (method) {
                  console.log("  ".concat(method.toUpperCase(), " ").concat(route.path));
                });
              } else {
                console.log("  ".concat(route.method.toUpperCase(), " ").concat(route.path));
              }
            });
          });
          _context2.next = 16;
          return regeneratorRuntime.awrap(server.start());

        case 16:
          console.log('Server running on %s', server.info.uri);
          console.log('Environment:', process.env.NODE_ENV);

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  });
};

process.on('unhandledRejection', function (err) {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});
init();