export default function SearchBar({ value, onChange, onSearch, loading }) {
  const onKey = (e) => {
    if (e.key === 'Enter') onSearch();
  };
  return (
    <div className="search">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKey}
        placeholder="Search city…"
        aria-label="Search city"
      />
      <button onClick={onSearch} disabled={loading}>
        {loading ? 'Searching…' : 'Search'}
      </button>
    </div>
  );
}
