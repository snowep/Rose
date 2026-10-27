export interface PersonNameFields {
  full_name?: string
  first_name?: string
  middle_name?: string
  last_name?: string
}

export function formatPersonName(person: PersonNameFields): string {
  if (person.full_name) return person.full_name
  const parts = [person.first_name, person.middle_name, person.last_name].filter(Boolean)
  return parts.join(' ') || 'Unknown'
}

export function getInitialsFromName(name: string): string {
  return name.split(' ').map((part) => part[0]).join('').toUpperCase().slice(0, 2)
}

export function getPersonInitials(person: PersonNameFields): string {
  return getInitialsFromName(formatPersonName(person))
}
