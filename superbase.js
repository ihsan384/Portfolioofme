import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://azngsvtxfosrdfcxmqus.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6bmdzdnR4Zm9zcmRmY3htcXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNDM1MjEsImV4cCI6MjA5MjcxOTUyMX0.zgDBuS3r_-IKrtdhM6s-eDtfq7LeidVz8Tyrjz3j2vI'

export const supabase = createClient(supabaseUrl, supabaseKey)