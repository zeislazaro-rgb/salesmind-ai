import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Carrega variáveis de ambiente ANTES de qualquer outro módulo.
// Procura primeiro apps/api/.env e depois o .env da raiz do monorepo.
const here = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: resolve(here, '../.env') });
dotenv.config({ path: resolve(here, '../../../.env') });
