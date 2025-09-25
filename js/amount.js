import { initializePage } from './common.js';
import * as q from './questions.js';

const questionGenerators = [
    q.makeInfBitQuestion,
    q.makeBitInfQuestion
];

initializePage("情報量計算", questionGenerators);
