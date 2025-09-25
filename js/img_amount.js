import { initializePage } from './common.js';
import * as q from './questions.js';

const questionGenerators = [
    q.makeImgAmountQuestion
];

initializePage("データ量の計算（画像）", questionGenerators);
