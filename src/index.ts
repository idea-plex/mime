'use strict';

import { Mime } from './mime';
import standard from '../types/standard';
import other from '../types/other';

export const mime = new Mime(standard, other);
export const mimeLite = new Mime(standard);

