
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://srtbauytjxyduvqhmuzd.supabase.co';
const supabaseKey = 'sb_publishable_-LEIZWJEDYlX5hbkkkIRBw_1XS61B_r';

export const supabase = createClient(supabaseUrl, supabaseKey);
