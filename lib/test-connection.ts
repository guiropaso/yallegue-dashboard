// Test file to verify Supabase connection
// Run with: npx tsx lib/test-connection.ts

import { supabase } from './supabase'

async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test database connection
    const { data, error } = await supabase
      .from('providers')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Database connection failed:', error)
      return
    }
    
    console.log('✅ Database connection successful')
    
    // Test storage connection
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    
    if (bucketError) {
      console.error('Storage connection failed:', bucketError)
      return
    }
    
    console.log('✅ Storage connection successful')
    console.log('Available buckets:', buckets?.map(b => b.name))
    
    // Test auth
    const { data: { session } } = await supabase.auth.getSession()
    console.log('Auth status:', session ? 'Authenticated' : 'Not authenticated')
    
    console.log('🎉 All connections working!')
    
  } catch (error) {
    console.error('Connection test failed:', error)
  }
}

testConnection()
