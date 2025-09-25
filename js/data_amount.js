import { initializePage } from './common.js';
import * as q from './questions.js';

const questionGenerators = [
    q.makeImgAmountQuestion,
    q.makeAudioAmountQuestion,
    q.makeVideoAmountQuestion
];

initializePage("data_amount", "データ量の計算", questionGenerators);
