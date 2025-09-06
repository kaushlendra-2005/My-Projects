import useLocalStorage from "../hooks/useLocalstorage";

export default function Favorites({ onPick, onSave, currentCity }) {
  const [favs, setFavs] = useLocalStorage('favorites', []);

  const add = () => {
    const name = (currentCity || '').trim();
    if (!name) return;
    if (!favs.includes(name)) setFavs([...favs, name]);
  };

  const remove = (name) => setFavs(favs.filter((c) => c !== name));

  return (
    <div className="favorites">
      <button className="save" onClick={() => { add(); onSave?.(); }}>
        ⭐ Save Favorite
      </button>
      <div className="fav-list">
        {favs.length === 0 && <span className="muted">No favorites yet.</span>}
        {favs.map((c) => (
          <span className="fav-chip" key={c}>
            <button onClick={() => onPick(c)} title="Open">{c}</button>
            <i onClick={() => remove(c)} aria-label="Remove" title="Remove">×</i>
          </span>
        ))}
      </div>
    </div>
  );
}
