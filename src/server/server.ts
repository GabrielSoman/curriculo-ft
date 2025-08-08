import express from 'express';
import cors from 'cors';
import path from 'path';
import { createRequire } from 'module';
import apiRoutes from './routes/api';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(require.resolve('./server.js'));

const app = express();
const PORT = process.env.PORT || 80;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos (React build)
app.use(express.static(path.join(__dirname, '../../dist')));

// Rotas da API
app.use('/api', apiRoutes);

// Fallback para SPA (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 Interface: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
});