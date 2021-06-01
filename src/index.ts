'use strict';

import { Mime } from './mime';
import standard from '../types/standard';
import other from '../types/other';

const mime = new Mime(standard, other);
const mimeLite = new Mime(standard);

export {
    Mime, mime, mimeLite 
} 

