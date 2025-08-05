import { createClient } from '@supabase/supabase-js'

// Note: You'll need to replace this with your actual Supabase URL
const supabaseUrl = 'https://udjciqtjcjiblnpfmdsn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkamNpcXRqY2ppYmxucGZtZHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNjc5MjEsImV4cCI6MjA2OTk0MzkyMX0.kyC4-I-jibJpxfHILLsXiMt9ePZ1L7vEX-qZ1abr9WQ'

export const supabase = createClient(supabaseUrl, supabaseKey)
