import { initializePage } from './common.js';
import * as q from './questions.js';

const questionGenerators = [
    q.makeDecToBinQuestion,
    q.makeBinToDecQuestion,
    q.makeBinToHexQuestion,
    q.makeHexToBinQuestion
];

initializePage("conversion", "進数変換", questionGenerators);
