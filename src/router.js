// ============================================================
// ハッシュベース SPA ルーター
// URL 形式: #/path  または  #/path/:param
// ============================================================

const routes = [];

/**
 * ルートを登録する
 * @param {string} path - '/quiz/:id' のようなパターン
 * @param {Function} handler - ({ id, ... }) を受け取るハンドラー
 */
export function addRoute(path, handler) {
  routes.push({ path, handler });
}

/**
 * パスパターンと実際のパスをマッチングし、パラメータを返す
 * @returns {Object|null} パラメータオブジェクト、またはマッチしない場合 null
 */
function matchRoute(pattern, actualPath) {
  const patternParts = pattern.split('/').filter(Boolean);
  const actualParts  = actualPath.split('/').filter(Boolean);

  if (patternParts.length !== actualParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = actualParts[i];
    } else if (patternParts[i] !== actualParts[i]) {
      return null;
    }
  }
  return params;
}

/**
 * 現在のハッシュに対応するルートハンドラーを実行する
 */
function dispatch() {
  const hash = window.location.hash.slice(1) || '/';
  const path = hash.split('?')[0]; // クエリパラメータを除去

  for (const route of routes) {
    const params = matchRoute(route.path, path);
    if (params !== null) {
      route.handler(params);
      return;
    }
  }

  // マッチしない場合はトップへ
  navigate('/');
}

/**
 * 指定パスに遷移する
 */
export function navigate(path) {
  window.location.hash = path;
}

/**
 * ルーターを初期化する（イベントリスナー登録 + 初回ディスパッチ）
 */
export function startRouter() {
  window.addEventListener('hashchange', dispatch);
  dispatch();
}
