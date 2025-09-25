import { initializePage } from './common.js';
import * as q from './questions.js';

const questionGenerators = [
    q.makeAddQuestion,
    q.makeSubQuestion,
    q.makeShiftQuestion
];

initializePage("calc", "2進数の計算", questionGenerators);
