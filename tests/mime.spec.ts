import { describe, it, expect, afterEach } from '@jest/globals';
import { mime, mimeLite } from '../src';
import { Mime } from '../src/mime';
import chalk from 'chalk';
//import { exec, ExecException } from 'child_process';

describe('class Mime', function () {
  it('mime and mime/lite coexist', function () {
    expect(mime).not.toBeNull();
    expect(mimeLite).not.toBeNull();
  });

  it('new constructor()', function () {
    const mime = new Mime(
      { 'text/a': ['a', 'a1'] },
      { 'text/b': ['b', 'b1'] }
    );

    const map = mime["types"];

    expect(map.get('a')).toBe('text/a');
    expect(map.get('a1')).toBe('text/a');
    expect(map.get('b')).toBe('text/b');
    expect(map.get('b1')).toBe('text/b');

    const extensions = mime["extensions"];

    expect(extensions.get('text/a')).toBe('a');
    expect(extensions.get('text/b')).toBe('b');
  });

  it('define()', function () {
    let mime = new Mime({ 'text/a': ['a'] }, { 'text/b': ['b'] });

    expect(() => mime.define({ 'text/c': ['b'] })).toThrow();

    expect(() => mime.define({ 'text/c': ['b'] }, true)).not.toThrow();

    const map = mime["types"];

    expect(map.get('a')).toBe('text/a');
    expect(map.get('b')).toBe('text/c');

    const extensions = mime["extensions"];

    expect(extensions.get('text/a')).toBe('a');
    expect(extensions.get('text/b')).toBe('b');
    expect(extensions.get('text/c')).toBe('b');
  });

  it('define() *\'ed types', function () {
    let mime = new Mime(
      { 'text/a': ['*b'] },
      { 'text/b': ['b'] }
    );

    const map = mime["types"];

    expect(map.get('b')).toBe('text/b');

    const extensions = mime["extensions"];

    expect(extensions.get('text/a')).toBe('b');
    expect(extensions.get('text/b')).toBe('b');
  });

  it('case-insensitive', function () {
    const mime = new Mime({
      'TEXT/UPPER': ['UP'],
      'text/lower': ['low'],
    });

    expect(mime.getType('test.up')).toBe('text/upper');
    expect(mime.getType('test.UP')).toBe('text/upper');
    expect(mime.getType('test.low')).toBe('text/lower');
    expect(mime.getType('test.LOW')).toBe('text/lower');

    expect(mime.getExtension('text/upper')).toBe('up');
    expect(mime.getExtension('text/lower')).toBe('low');
    expect(mime.getExtension('TEXT/UPPER')).toBe('up');
    expect(mime.getExtension('TEXT/LOWER')).toBe('low');
  });

  it('getType()', function () {
    // Upper/lower case
    expect(mime.getType('text.txt')).toBe('text/plain');
    expect(mime.getType('TEXT.TXT')).toBe('text/plain');

    // Bare extension
    expect(mime.getType('txt')).toBe('text/plain');
    expect(mime.getType('.txt')).toBe('text/plain');
    expect(mime.getType('.bogus')).toBeNull();
    expect(mime.getType('bogus')).toBeNull();

    // Non-sensical
    expect(mime.getType(null)).toBeNull();
    expect(mime.getType(undefined)).toBeNull();
    expect(mime.getType(42)).toBeNull();
    expect(mime.getType({})).toBeNull();

    // File paths
    expect(mime.getType('dir/text.txt')).toBe('text/plain');
    expect(mime.getType('dir\\text.txt')).toBe('text/plain');
    expect(mime.getType('.text.txt')).toBe('text/plain');
    expect(mime.getType('.txt')).toBe('text/plain');
    expect(mime.getType('txt')).toBe('text/plain');
    expect(mime.getType('/path/to/page.html')).toBe('text/html');
    expect(mime.getType('c:\\path\\to\\page.html')).toBe('text/html');
    expect(mime.getType('page.html')).toBe('text/html');
    expect(mime.getType('path/to/page.html')).toBe('text/html');
    expect(mime.getType('path\\to\\page.html')).toBe('text/html');
    expect(mime.getType('/txt')).toBeNull();
    expect(mime.getType('\\txt')).toBeNull();
    expect(mime.getType('text.nope')).toBeNull();
    expect(mime.getType('/path/to/file.bogus')).toBeNull();
    expect(mime.getType('/path/to/json')).toBeNull();
    expect(mime.getType('/path/to/.json')).toBeNull();
    expect(mime.getType('/path/to/.config.json')).toBe('application/json');
    expect(mime.getType('.config.json')).toBe('application/json');
  });

  it('getExtension()', function () {
    expect(mime.getExtension('text/html')).toBe('html');
    expect(mime.getExtension(' text/html')).toBe('html');
    expect(mime.getExtension('text/html ')).toBe('html');
    expect(mime.getExtension('application/x-bogus')).toBeNull();
    expect(mime.getExtension('bogus')).toBeNull();

    // bad types, checking because javascript
    expect(mime.getExtension(null as any)).toBeNull();
    expect(mime.getExtension(undefined as any)).toBeNull();
    expect(mime.getExtension(42 as any)).toBeNull();
    expect(mime.getExtension({} as any)).toBeNull();
  });
});

describe('DB', () => {
  let diffs: [string, string, string, string][] = [];

  afterEach(() => {
    if (diffs.length) {
      console.log('\n[INFO] The following inconsistencies with MDN (https://goo.gl/lHrFU6) and/or mime-types (https://github.com/jshttp/mime-types) are expected:');
      diffs.forEach(function (d) {
        console.warn(
          '  ' + d[0] + '[' + chalk.blue(d[1]) + '] = ' + chalk.red(d[2]) +
          ', mime[' + d[1] + '] = ' + chalk.green(d[3])
        );
      });
    }
  });  

  it('Specific types', function () {
    // Assortment of types we sanity check for good measure
    expect(mime.getType('html')).toBe('text/html');
    expect(mime.getType('js')).toBe('application/javascript');
    expect(mime.getType('json')).toBe('application/json');
    expect(mime.getType('rtf')).toBe('application/rtf');
    expect(mime.getType('txt')).toBe('text/plain');
    expect(mime.getType('xml')).toBe('application/xml');

    expect(mime.getType('wasm')).toBe('application/wasm');
  });

  it('Specific extensions', function () {
    expect(mime.getExtension('text/html;charset=UTF-8')).toBe('html');
    expect(mime.getExtension('text/HTML; charset=UTF-8')).toBe('html');
    expect(mime.getExtension('text/html; charset=UTF-8')).toBe('html');
    expect(mime.getExtension('text/html; charset=UTF-8 ')).toBe('html');
    expect(mime.getExtension('text/html ; charset=UTF-8')).toBe('html');
    expect(mime.getExtension(mime['types'].get('text')!)).toBe('txt');
    expect(mime.getExtension(mime['types'].get('htm')!)).toBe('html');
    expect(mime.getExtension('application/octet-stream')).toBe('bin');
    expect(mime.getExtension('application/octet-stream ')).toBe('bin');
    expect(mime.getExtension(' text/html; charset=UTF-8')).toBe('html');
    expect(mime.getExtension('text/html; charset=UTF-8 ')).toBe('html');
    expect(mime.getExtension('text/html; charset=UTF-8')).toBe('html');
    expect(mime.getExtension('text/html ; charset=UTF-8')).toBe('html');
    expect(mime.getExtension('text/html;charset=UTF-8')).toBe('html');
    expect(mime.getExtension('text/Html;charset=UTF-8')).toBe('html');
    expect(mime.getExtension('unrecognized')).toBeNull();

    expect(mime.getExtension('text/xml')).toBe('xml'); // See #180
  });
});

// describe('mime CLI', () => {
//   it('returns type', () => {
//     return new Promise<void>((resolve, reject) => {
//       exec('./cli.js mpeg', (err: ExecException | null, stdout: string, stderr: string) => {
//         if (err) reject(err);
//         expect(stdout).toBe('video/mpeg\n');
//         resolve();
//       });
//     });
//   });
// });


