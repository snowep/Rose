'use client'

import { Box, Button, Typography, Paper, Alert } from '@mui/material'
import { CloudUpload, Delete } from '@mui/icons-material'
import { useState } from 'react'

interface FormDragDropUploadProps {
  label: string
  value?: string
  onChange: (value: string) => void
}

export function FormDragDropUpload({ label, value, onChange }: FormDragDropUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = (file: File) => {
    setError(null)
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('The image must be 5 MB or smaller.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') onChange(reader.result)
      else setError('Unable to preview this image.')
    }
    reader.onerror = () => setError('Unable to read this image. Please try another file.')
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const handleRemove = () => {
    setError(null)
    onChange('')
  }

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>{label}</Typography>
      <Paper
        component="div"
        aria-label={`${label} upload area`}
        sx={{
          border: '2px dashed',
          borderColor: dragOver ? 'primary.main' : 'divider',
          borderRadius: 2,
          p: { xs: 2, sm: 3 },
          textAlign: 'center',
          backgroundColor: dragOver ? 'action.hover' : 'transparent',
          transition: 'all 0.2s',
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {value ? (
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Box
              component="img"
              src={value}
              alt={`${label} preview`}
              sx={{ display: 'block', maxWidth: '100%', maxHeight: 200, mx: 'auto', borderRadius: 1 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              <Button component="label" size="small" variant="outlined" startIcon={<CloudUpload />}>
                Replace
                <input type="file" hidden accept="image/*" onChange={handleFileInput} />
              </Button>
              <Button size="small" startIcon={<Delete />} onClick={handleRemove} variant="text" color="error">
                Remove
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Drag & drop image here or click to upload
            </Typography>
            <Button component="label" variant="outlined" size="small">
              Select File
              <input type="file" hidden accept="image/*" onChange={handleFileInput} />
            </Button>
          </>
        )}
      </Paper>
      {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
    </Box>
  )
}
