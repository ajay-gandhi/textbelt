# Textbelt

> A module for sending unlimited texts for free

Taken mostly from [typpo's textbelt](https://github.com/typpo/textbelt), with a
few improvements and lighter system, this module allows you to send texts
through Node.js for free.

## Installation

You must have `sendmail` (not the Node module, the native binary) installed.
Then just `npm install` this package:

```bash
npm install textbelt
```

Include it in your project:

```js
var text = require('textbelt');
text.sendText("555-555-5555", "Textbelt says hello");
```

## API

#### text.sendText(phone, message, opts, cb)

Sends `message` as a text to `phone`. `cb` is an optional callback function,
and `opts` is an optional object filled with options. If you want to include a
callback function, you must include an `opts` parameter as well (it can be
empty).

Possible `opts`:

```js
var opts = {
  fromAddr: 'some@email.com',  // "from" address in received text
  fromName: 'joe smith',       // "from" name in received text
  region:   'us',              // region the receiving number is in: 'us', 'canada', 'intl'
  subject:  'something'        // subject of the message
}
```

Do not include `+1` or other codes in the phone number. Instead use the 'region'
parameter.

#### text.debug(enable)

If `enable` is `true`, enables debugging output, which is disabled by default.

## How It Works

Most, if not all, service providers have an email endpoint. When you send an
email to the endpoint, the phone number receives a text. For example, sending an
email to `1234567890@txt.att.net` will result in (123)456-7890 receving your
email as a text.

This package just sends emails to all the providers in the region, hoping one
will be correct :)
