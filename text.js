'use strict';

var providers = require('./providers.json'),
    spawn     = require('child_process').spawn;

var debugEnabled = false;
var default_options = {
  fromAddr: 'textbelt@me.com',
  fromName: 'Textbelt',
  subject:  '',
  region:   'us'
}

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
 * @param [object] opts    - See readme
 * @param [func]   cb      - See readme
 */
module.exports.sendText = function (phone, message, opts, cb) {
  output('txting phone', phone, '\n + message:', message);

  // Setup options
  opts = opts || {};
  var fromAddr = opts.fromAddr ? opts.fromAddr : default_options.fromAddr;
  var fromName = opts.fromName ? opts.fromName : default_options.fromName;
  var region   = opts.region   ? opts.region   : default_options.region;
  var subject  = opts.subject  ? opts.subject  : default_options.subject;

  var providers_list = providers[region];

  var done = 0,
      all  = providers_list.length;

  // Send email to all providers
  providers_list.forEach(function (provider) {
    // Create/get email and headers
    var email = provider.replace('%s', phone);
    var headers =  'Subject: ' + subject + '\r\n';
        headers += 'From: ' + fromName + ' <' + fromAddr + '>\r\n\r\n';

    var child = spawn('sendmail', ['-f', fromAddr, email]);

    // Pipe processes to output
    child.stdout.on('data', output);
    child.stderr.on('data', output);

    child.on('error', function (err) {
      output('sendmail failed', { email: email, err: err });
      done++;
      if (done == all && cb) cb(false);
    });

    child.on('exit', function () {
      done++;
      if (done == all && cb) cb(false);
    });

    // Write message then end input
    child.stdin.write(headers + message + '\n.');
    child.stdin.end();
  });
}
