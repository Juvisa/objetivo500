import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Mapeo de nombres bonitos → clave snake_case que usa app.js
const MAP = [
  { from: 'Matemáticas',     to: 'matematicas'      },
  { from: 'Lectura Crítica', to: 'lectura_critica'   },
  { from: 'Ciencias Naturales', to: 'ciencias_naturales' },
  { from: 'Sociales y Ciudadanas', to: 'sociales'    },
  { from: 'Inglés',          to: 'ingles'            },
];

async function fix() {
  process.stdout.write('Corrigiendo campo subject en tabla questions...\n');

  for (const { from, to } of MAP) {
    const { count, error: countErr } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('subject', from);

    if (countErr) {
      process.stdout.write(`ERROR contando "${from}": ${countErr.message}\n`);
      continue;
    }

    if (!count) {
      process.stdout.write(`SKIP "${from}" -- 0 registros\n`);
      continue;
    }

    const { error } = await supabase
      .from('questions')
      .update({ subject: to })
      .eq('subject', from);

    if (error) {
      process.stdout.write(`ERROR actualizando "${from}": ${error.message}\n`);
    } else {
      process.stdout.write(`OK "${from}" -> "${to}"  (${count} preguntas)\n`);
    }
  }

  process.stdout.write('\nEstado final:\n');
  for (const { to } of MAP) {
    const { count } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('subject', to);
    if (count) process.stdout.write(`  ${to}: ${count}\n`);
  }
}

fix();
