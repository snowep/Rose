'use client'

import { Grid } from '@mui/material'
import { FormTextField } from '@/components/atoms/FormTextField'
import { FormSegmentedControl } from '@/components/atoms/FormSegmentedControl'
import { FormSelectField } from '@/components/atoms/FormSelectField'
import { FormNumberField } from '@/components/atoms/FormNumberField'
import { BookFormSection } from '@/components/atoms/BookFormSection'

interface BookFormDigitalProps {
  book: any
  onChange: (field: string, value: any) => void
}

export function BookFormDigital({ book, onChange }: BookFormDigitalProps) {
  const digital = book.digitalStatus === true

  return (
    <BookFormSection title='Digital'>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormSegmentedControl
            label='Digital Copy'
            value={digital ? 'yes' : 'no'}
            onChange={(v) => onChange('digitalStatus', v === 'yes')}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />
        </Grid>
        {digital && (
          <>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormSelectField
                label='File Format'
                value={book.fileFormat}
                onChange={(v) => onChange('fileFormat', v)}
                options={[
                  { value: 'epub', label: 'EPUB' },
                  { value: 'pdf', label: 'PDF' },
                  { value: 'mp3', label: 'MP3' },
                  { value: 'm4b', label: 'M4B' },
                  { value: 'mobi', label: 'MOBI' },
                  { value: 'azw3', label: 'AZW3' },
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormNumberField
                label='File Size'
                value={book.fileSize}
                onChange={(v) => onChange('fileSize', v)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormSelectField
                label='File Size Unit'
                value={book.fileSizeUnit}
                onChange={(v) => onChange('fileSizeUnit', v)}
                options={[
                  { value: 'KB', label: 'KB' },
                  { value: 'MB', label: 'MB' },
                  { value: 'GB', label: 'GB' },
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormSegmentedControl
                label='DRM Protected'
                value={book.drmStatus ? 'yes' : 'no'}
                onChange={(v) => onChange('drmStatus', v === 'yes')}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormTextField
                label='Storage Location'
                value={book.storageLocation}
                onChange={(v) => onChange('storageLocation', v)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormTextField
                label='Download URL'
                value={book.downloadUrl}
                onChange={(v) => onChange('downloadUrl', v)}
                type='url'
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormTextField
                label='License'
                value={book.license}
                onChange={(v) => onChange('license', v)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormTextField
                label='Checksum'
                value={book.checksum}
                onChange={(v) => onChange('checksum', v)}
              />
            </Grid>
          </>
        )}
      </Grid>
    </BookFormSection>
  )
}