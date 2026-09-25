import { handleDccaiRequest } from './handler.js';

export const dccaiDevApi = () => ({
  name: 'dccai-dev-api',
  configureServer(server) {
    server.middlewares.use('/api/dccai', async (req, res) => {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const request = new Request(`http://localhost${req.url || '/'}`, {
        method: req.method,
        headers: req.headers,
        body: ['GET', 'HEAD'].includes(req.method || '') ? undefined : Buffer.concat(chunks),
      });
      const response = await handleDccaiRequest(request, process.env);
      res.statusCode = response.status;
      response.headers.forEach((value, key) => res.setHeader(key, value));
      res.end(await response.text());
    });
  },
});
