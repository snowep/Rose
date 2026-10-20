import { useState } from 'react';
import Input from '../atoms/Input.jsx';
import Button from '../atoms/Button.jsx';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  return (
    <div style={{ display:'flex', gap:8 }}>
      <Input label="Search" value={query} onChange={e=>setQuery(e.target.value)} />
      <Button onClick={()=>onSearch(query)}>Search</Button>
    </div>
  );
}
