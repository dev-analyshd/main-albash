import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const holder = user.email || 'Test User'

    const { data: method, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: user.id,
        type: 'card',
        label: 'Test Card (4242)',
        holder_name: holder,
        last_four: '4242',
        is_default: true,
        metadata: {},
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, method })
  } catch (err: any) {
    console.error('Create test payment method error:', err)
    return NextResponse.json({ error: err.message || 'Failed to create test method' }, { status: 500 })
  }
}
