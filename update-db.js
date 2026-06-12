const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) envVars[key.trim()] = rest.join('=').trim().replace(/"/g, '');
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // Update existing employees to admin
  await supabase.from('user_roles').update({ role: 'admin' }).eq('role', 'employee');
  console.log("Updated existing employees to admin");
  
  // To alter constraints, we need to run SQL. Since we don't have direct SQL access through JS client,
  // we will just recreate the trigger function using RPC if available, or just ignore the constraint for now since we'll fix the UI.
  // Actually, we can just let the trigger be, since the UI won't create employees anymore. 
  // Wait, the trigger is in Postgres. We MUST update the trigger or new Auth users will get 'employee'.
  // We can't easily run arbitrary DDL SQL via the JS client unless there is an rpc function for it.
  console.log("Please manually run the updated supabase-rbac-setup.sql in the Supabase SQL Editor to update the trigger.");
}

run();
