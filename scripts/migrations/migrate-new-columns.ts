import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SQL_TO_RUN = `
ALTER TABLE clients ADD COLUMN IF NOT EXISTS case_number TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS previous_petition_denied BOOLEAN DEFAULT false;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS denial_reasons TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal';
`;

async function migrate() {
  console.log('Running migration: add new columns to clients...\n');

  // Test if columns already exist by doing a select
  const { data, error } = await supabase
    .from('clients')
    .select('case_number, previous_petition_denied, denial_reasons, priority')
    .limit(1);

  if (error) {
    console.log('=== COLUMNS DO NOT EXIST YET ===');
    console.log('Please run this SQL in the Supabase SQL Editor:');
    console.log('URL: https://supabase.com/dashboard/project/dmqruovtiivgaqoronvh/sql/new');
    console.log('\n--- COPY FROM HERE ---');
    console.log(SQL_TO_RUN);
    console.log('--- END COPY ---\n');
    console.log('Error details:', error.message);
    console.log('\nAfter running the SQL, re-run this script to verify.');
  } else {
    console.log('All columns already exist! No migration needed.');
    console.log('Existing data sample:', JSON.stringify(data, null, 2));
  }
}

migrate().catch(console.error);
