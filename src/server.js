import http from "node:http";
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";
// Entendendo como funciona a memória do servidor: Statefull x Stateless
// Statefull -> Significa que o servidor vai guardar o estado da aplicação em memória e vai ser compartilhado entre todas as requisições que o usuário fizer para o servidor. Até que o servidor seja reiniciado.
// Stateless -> Significa que o servidor não vai guardar o estado da aplicação em memória. Ou seja, o servidor não vai lembrar de nada que o usuário fez na primeira requisição. O servidor vai ser "burro" e não vai lembrar de nada que o usuário fez na primeira requisição.

// Headers/Cabeçalhos de uma requisição HTTP-> são metadados/informações adicionais que o client envia para o servidor.
// Por exemplo, o cabeçalho "Accept" informa para o servidor qual o tipo de conteúdo que o client aceita receber como resposta. O cabeçalho "Accept" é obrigatório em todas as requisições HTTP.
// Content-Type -> Informa para o servidor qual o tipo de conteúdo que o client está enviando para o servidor. Por exemplo, se o client está enviando um JSON para o servidor, o client precisa informar para o servidor que o conteúdo que está sendo enviado é um JSON. O cabeçalho "Content-Type" é obrigatório em todas as requisições HTTP que enviam conteúdo para o servidor.
// Form-data -> É um tipo de conteúdo que o client pode enviar para o servidor. O "Form-data" é um tipo de conteúdo que o client pode enviar para o servidor quando o client está enviando um formulário para o servidor.

// Métodos HTTP -> São os métodos que o client pode usar para fazer uma requisição HTTP para o servidor.
// HTTP Status Code -> São códigos que o servidor envia para o client como resposta. Os códigos de status começam com 1, 2, 3, 4 ou 5. Cada código de status tem um significado diferente.
const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res, () => {});

  const route = routes.find((route) => {
    const { path: routePath, method: routeMethod } = route;
    return routeMethod === method && routePath.test(url); // testa se a url da requisição bate com a url da rota
  });

  if (route) {
    const routeParams = req.url.match(route.path); // retorna um array com os valores dos parâmetros da rota

    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res); // executa a função handler da rota
  }

  return res.writeHead(204).end();
});

server.listen(3333);
