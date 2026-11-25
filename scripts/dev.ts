const root = new URL('../deck/', import.meta.url).pathname;
const port = Number(process.env.PORT ?? 3000);

Bun.serve({
  port,
  fetch(req) {
    const path = new URL(req.url).pathname;
    return new Response(Bun.file(root + (path === '/' ? 'index.html' : path.slice(1))));
  },
});
console.log(`deck on http://localhost:${port}`);
