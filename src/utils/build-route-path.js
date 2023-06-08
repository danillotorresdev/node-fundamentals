/**
 * Constroi uma expressão regular para validar uma rota. Verifica se a rota tem parâmetros
 * e substitui os parâmetros por uma expressão regular.
 * @param {string} path
 * @returns {RegExp}
 * @example
 * buildRoutePath("/users/:id")
 * // => /^\/users\/([a-z0-9-_]+)$/
 */
export function buildRoutePath(path) {
  const routeParameterRegex = /:([a-zA-Z0-9_-]+)/g;
  const pathWithParams = path.replaceAll(
    routeParameterRegex,
    `(?<$1>[a-z0-9\\-_]+)`
  );
  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?.(.*))?$`);
  return pathRegex;
}
