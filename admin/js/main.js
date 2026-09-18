import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient('https://your-project.supabase.co', 'public-anon-key');

// مثال: جلب اسم الجمعية
const { data: settings } = await supabase.from('settings').select('*').single();
document.getElementById('associationName').innerText = settings.association_name_fr;