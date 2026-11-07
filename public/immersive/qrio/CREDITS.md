Qrio — Athena standalone showcase
==================================
This is an independently authored, public-facing QR demonstration commissioned
for Athena Studio. The original Qrio application at coffee2307/Qrio is private,
and no backend, source application templates, database, credentials, payment
handlers or private customer records have been copied into this public repo.

Third-party QR encoding implementation:
- qrcode-generator v1.4.4 by Kazuhiko Arase
- https://github.com/kazuhikoarase/qrcode-generator
- Copyright (c) 2009 Kazuhiko Arase
- License: MIT

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

Security and capability boundary:
QR creation is local to the browser; no customer data is submitted to Athena.
Ticket creation, checking, orders, payments and the original Qrio Flask APIs are
not included or connected. Static page output is not a hosted ticket service.
