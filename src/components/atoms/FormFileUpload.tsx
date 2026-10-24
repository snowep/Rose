'use client'

import { Box, Button, Typography } from '@mui/material'
import { CloudUpload } from '@mui/icons-material'

interface FormFileUploadProps {
  label: string
  value?: string
  onChange: (value: string) => void
}

export function FormFileUpload({ label, value, onChange }: FormFileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onChange(url)
    }
  }

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>{label}</Typography>
      <Button
        component="label"
        variant="outlined"
        startIcon={<CloudUpload />}
        fullWidth
        sx={{ justifyContent: 'flex-start' }}
      >
        Upload Cover Image
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>
      {value && (
        <Box sx={{ mt: 2 }}>
          <img src={value} alt="Cover preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 4 }} />
        </Box>
      )}
    </Box>
  )
}
