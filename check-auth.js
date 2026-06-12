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

async function check() {
  const { data: users, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error(error);
    return;
  }
  
  const user = users.users.find(u => u.email === 'farheenzehragilani@gmail.com');
  console.log("Auth user ID:", user?.id);
  
  const { data: roleData } = await supabase.from('user_roles').select('*').eq('email', 'farheenzehragilani@gmail.com');
  console.log("Roles table ID:", roleData.map(r => r.id));
}

check();
