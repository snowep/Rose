'use client'

import { Box, Button, Typography, Paper } from '@mui/material'
import { CloudUpload, Delete } from '@mui/icons-material'
import { useState } from 'react'

interface FormDragDropUploadProps {
  label: string
  value?: string
  onChange: (value: string) => void
}

export function FormDragDropUpload({ label, value, onChange }: FormDragDropUploadProps) {
  const [dragOver, setDragOver] = useState(false)

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      onChange(url)
    }
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
  }

  const handleRemove = () => {
    onChange('')
  }

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>{label}</Typography>
      <Paper
        sx={{
          border: '2px dashed',
          borderColor: dragOver ? 'primary.main' : 'divider',
          borderRadius: 2,
          p: 3,
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
            <img src={value} alt="Cover preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 4 }} />
            <Button
              size="small"
              startIcon={<Delete />}
              onClick={handleRemove}
              sx={{ mt: 1 }}
              variant="outlined"
            >
              Remove
            </Button>
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
    </Box>
  )
}
