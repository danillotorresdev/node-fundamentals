// Middleware são funções que são executadas antes de uma rota ser executada. São interceptadores.
export async function json(req, res, next) {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch (error) {
    req.body = null;
  }

  res.setHeader("Content-Type", "application/json"); // O servidor vai enviar a resposta para o client em formato JSON.
}
