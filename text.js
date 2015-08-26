'use strict';

var providers = require('./providers.json'),
    spawn     = require('child_process').spawn;

var debugEnabled = false;
var fromAddress = 'brad@me.com';

/**
 * General purpose logging function, gated by a configurable value
 */
var output = function () {
  if (debugEnabled) {
    return console.log.apply(this, arguments);
  }
}

/**
 * Enable or disable debug output
 *
 * @param [bool] enable - Whether to enable (true) or disable (false) debugging
 *
 * @returns [bool] Whether debugging is enabled or not
 */
module.exports.debug = function (enable) {
  debugEnabled = enable;
  return debugEnabled;
}

/**
 * Sends a text message by sending emails to all providers
 *
 * @param [string] phone   - The number to send a message to
 * @param [string] message - The message to send
 * @param [string] region  - The region the number is in
 * @param [func]   cb      - Callback function
 *
 * @returns
 */
module.exports.sendText = function (phone, message, region, cb) {
  output('txting phone', phone, '\n + message:', message);

  region = region || 'us';

  var providers_list = providers[region];

  var done = 0,
      all  = providers_list.length;

  // Send email to all providers
  providers_list.forEach(function (provider) {
    // Create/get email and headers
    var email = provider.replace('%s', phone);
    var headers = 'Subject: /\r\nFrom: Brad <' + fromAddress + '>\r\n\r\n';

    var child = spawn('sendmail', ['-f', fromAddress, email]);

    // Pipe processes to output
    child.stdout.on('data', output);
    child.stderr.on('data', output);

    child.on('error', function (err) {
      output('sendmail failed', { email: email, err: err });
      done++;
      if (done == all) cb(false);
    });

    child.on('exit', function () {
      done++;
      if (done == all) cb(false);
    });

    // Write message then end input
    child.stdin.write(headers + message + '\n.');
    child.stdin.end();
  });
}
