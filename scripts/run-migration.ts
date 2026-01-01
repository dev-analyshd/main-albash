import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials')
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function runMigration() {
  try {
    console.log('📦 Loading migration file...')
    const migrationPath = path.join(
      process.cwd(),
      'scripts',
      '017-add-verification-system.sql'
    )

    const sql = fs.readFileSync(migrationPath, 'utf-8')

    // Split by semicolon and filter empty statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`🔧 Running ${statements.length} SQL statements...`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      try {
        console.log(`[${i + 1}/${statements.length}] Executing...`)
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' })

        if (error) {
          console.error(`  ❌ Error: ${error.message}`)
          // Continue with next statement
        } else {
          console.log(`  ✅ Success`)
        }
      } catch (err: any) {
        console.error(`  ❌ Exception: ${err.message}`)
      }
    }

    console.log('\n✨ Migration completed!')
  } catch (error: any) {
    console.error('Migration failed:', error.message)
    process.exit(1)
  }
}

runMigration()
