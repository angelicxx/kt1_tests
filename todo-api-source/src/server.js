import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';

import tasksRouter from './routes/tasks.js';
import { notFound, errorHandler } from './middleware/errors.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Swagger setup
const openapiPath = path.join(__dirname, '..', 'docs', 'openapi.yaml');
const openapiContent = fs.readFileSync(openapiPath, 'utf-8');
const openapiDoc = YAML.parse(openapiContent);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDoc, { explorer: true }));

app.get('/', (req,res) => res.json({ ok: true, name: 'todo-api', version: '1.0.0' }));

app.use('/tasks', tasksRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/docs`);
});
