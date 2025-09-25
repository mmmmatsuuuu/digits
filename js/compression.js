import { initializePage } from './common.js';
import * as q from './questions.js';

const questionGenerators = [
    q.makeCompressionRatioQuestion,
    q.makeRunLengthQuestion,
    q.makeHuffmanQuestion
];

initializePage("compression", "圧縮の計算", questionGenerators);
