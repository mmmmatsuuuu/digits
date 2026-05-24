import './style.css';

import { addRoute, startRouter } from './router.js';
import { renderTopPage } from './pages/TopPage.js';
import { renderQuizPage } from './pages/QuizPage.js';
import { getDarkMode } from './lib/state.js';

// ============================================================
// ダークモード初期化
// ============================================================

if (getDarkMode()) {
  document.documentElement.classList.add('dark');
}

// ============================================================
// ルーティング
// ============================================================

const app = document.getElementById('app');

addRoute('/', () => renderTopPage(app));
addRoute('/quiz/:id', ({ id }) => renderQuizPage(app, id));

startRouter();
