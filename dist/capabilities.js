"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseString = parseString;
exports.default = void 0;

// Licensed to the Software Freedom Conservancy (SFC) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The SFC licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.
function parseString(input) {
  const capabilities = {};
  matchStringPairs(input).forEach(({
    key,
    value
  }) => {
    assignStringKey(key, parseStringValue(value), capabilities);
  });
  return capabilities;
}

var _default = {
  parseString
};
exports.default = _default;

function matchStringPairs(input) {
  const regex = /([^\s=]*)\s?=\s?(".*?"|'.*?'|\[.*\]|[^\s]*)/g;
  let result;
  const splitCapabilities = [];

  while ((result = regex.exec(input)) !== null) {
    splitCapabilities.push({
      key: result[1],
      value: result[2]
    });
  }

  return splitCapabilities;
}

function assignStringKey(key, value, keyObject) {
  keyObject = keyObject || {};
  key.split('.').reduce((objectKey, currKey, index, keys) => {
    const ref = !objectKey[currKey] || typeof objectKey[currKey] !== 'object' ? {} : objectKey[currKey];
    objectKey[currKey] = keys.length === index + 1 ? value : ref;
    return ref;
  }, keyObject);
  return keyObject;
}

function parseStringValue(value) {
  // is array
  if (/^\[.*\]$/.test(value)) {
    return value.substr(1, value.length - 2).match(/(([^,]*)*)/g).filter(s => !!s).map(s => s.trim());
  }

  try {
    let parsed = JSON.parse(value);

    if (typeof parsed === 'string') {
      parsed = parsed.trim();
    }

    return parsed;
  } catch (e) {
    // single quote is illegal in JSON
    return trimSingleQuote(value);
  }
}

function trimSingleQuote(value) {
  let str = value.trim();

  if (str[0] === str[str.length - 1] && str[0] === "'") {
    return str.substr(1, str.length - 2);
  }

  return str;
}