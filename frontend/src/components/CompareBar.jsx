import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import './CompareBar.css';

export default function CompareBar() {
  const { items, remove, clear } = useCompare();
  if (items.length === 0) return null;

  return (
    <div className="compare-bar">
      <div className="compare-bar-inner container">
        <div className="compare-slots">
          {[0, 1, 2].map(i => {
            const p = items[i];
            return (
              <div key={i} className={`compare-slot${p ? ' filled' : ''}`}>
                {p ? (
                  <>
                    <img src={p.imageUrl} alt={p.name} />
                    <span className="compare-slot-name">{p.name}</span>
                    <button className="compare-slot-remove" onClick={() => remove(p.id)} title="წაშლა">✕</button>
                  </>
                ) : (
                  <span className="compare-slot-empty">+ პროდუქტი</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="compare-bar-actions">
          <button className="compare-clear-btn" onClick={clear}>გასუფთავება</button>
          {items.length >= 2 && (
            <Link
              to={`/compare?ids=${items.map(p => p.id).join(',')}`}
              className="compare-go-btn"
            >
              შედარება →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
