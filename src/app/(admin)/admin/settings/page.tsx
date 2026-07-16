'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const [appName, setAppName] = useState('Nikah Muyassar')
  const [supportEmail, setSupportEmail] = useState('support@nikahmuyassar.org')

  const handleSave = () => {
    toast.success('Settings saved (local only - add persistence layer)')
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-charcoal mb-6">Platform Settings</h1>
      <Card><CardContent className="p-6 space-y-4 max-w-lg">
        <Input label="Platform Name" value={appName} onChange={(e) => setAppName(e.target.value)} />
        <Input label="Support Email" type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
        <Button variant="primary" onClick={handleSave}>Save Settings</Button>
      </CardContent></Card>
    </div>
  )
}
