import './style.css';

import { addRoute, startRouter } from './router.js';
import { renderTopPage } from './pages/TopPage.js';
import { renderQuizPage } from './pages/QuizPage.js';
import { renderBinaryPage } from './pages/BinaryPage.js';
import { renderGameHacker } from './pages/GameHacker.js';
import { renderGameSurvivor } from './pages/GameSurvivor.js';
import { renderGameJenga } from './pages/GameJenga.js';
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
addRoute('/binary', () => renderBinaryPage(app));
addRoute('/game/hacker', () => renderGameHacker(app));
addRoute('/game/survivor', () => renderGameSurvivor(app));
addRoute('/game/jenga', () => renderGameJenga(app));

startRouter();
