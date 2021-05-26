'use strict';

import Benchmark from 'benchmark';
import { mime, mimeLite } from '.';

const suite = new Benchmark.Suite();

const extensions = mime.getExtensions();
let idx = 0;

suite
  .add('mime.getType',
    function() {
      mime.getType(extensions[idx++]);
      if (idx >= extensions.length) idx = 0;
    }
  )
  .add('mimeLite.getType',
    function() {
      mimeLite.getType(extensions[idx++]);
      if (idx >= extensions.length) idx = 0;
    }
  )
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .run();
