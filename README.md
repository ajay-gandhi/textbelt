# Textbelt

> A module for sending unlimited texts for free

Taken mostly from [typpo's textbelt](https://github.com/typpo/textbelt), with a
few improvements and lighter system, this module allows you to send texts
through Node.js for free.

## Usage

You must have `sendmail` installed. Then just `npm install` this package:

```bash
$ npm install textbelt
```

In your code:

```js
var textbelt = require('textbelt');

textbelt.debug(true); // Enable debugging output

textbelt.sendText(phone_number, message, [region], cb);
```

## How It Works

Most, if not all, service providers have an email endpoint. When you send an
email to the endpoint, the phone number receives a text. For example, sending an
email to `1234567890@txt.att.net` will result in (123)456-7890 receving your
email as a text.

This package just sends emails to all the providers in the region, hoping one
will be correct :)
