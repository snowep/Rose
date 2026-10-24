'use client'

import { ToggleButtonGroup, ToggleButton } from '@mui/material'

interface FormSegmentedControlProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}

export function FormSegmentedControl({ label, value, onChange, options }: FormSegmentedControlProps) {
  return (
    <div>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, newValue) => newValue && onChange(newValue)}
        fullWidth
        size="small"
      >
        {options.map((opt) => (
          <ToggleButton key={opt.value} value={opt.value}>
            {opt.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  )
}
