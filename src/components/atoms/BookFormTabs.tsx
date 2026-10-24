'use client'

import { Tabs, Tab, Box } from '@mui/material'

interface BookFormTabsProps {
  value: number
  onChange: (value: number) => void
}

const tabs = [
  'Basic',
  'Identity',
  'Authors',
  'Series',
  'Publisher',
  'Reading',
  'Content',
]

export function BookFormTabs({ value, onChange }: BookFormTabsProps) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
      <Tabs value={value} onChange={(_, v) => onChange(v)} variant='scrollable' scrollButtons='auto'>
        {tabs.map((tab, idx) => (
          <Tab key={tab} label={tab} />
        ))}
      </Tabs>
    </Box>
  )
}

