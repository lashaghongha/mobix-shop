import { useSearchParams, useNavigate } from 'react-router-dom';
import { Smartphone, Tablet, Watch, Laptop, Headphones, Gamepad2, Tv, Camera } from 'lucide-react';
import './CategoryStrip.css';

const CATEGORIES = [
  { id: 1, name: 'მობილურები',      Icon: Smartphone },
  { id: 4, name: 'ტაბლეტი',         Icon: Tablet },
  { id: 8, name: 'სმარტ საათები',   Icon: Watch },
  { id: 2, name: 'ლეპტოპები',       Icon: Laptop },
  { id: 5, name: 'აუდიო',           Icon: Headphones },
  { id: 7, name: 'Gaming',           Icon: Gamepad2 },
  { id: 3, name: 'TV',               Icon: Tv },
  { id: 6, name: 'ფოტო | ვიდეო',   Icon: Camera },
];

export default function CategoryStrip() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const activeCatId = Number(params.get('categoryId'));

  return (
    <div className="cat-strip">
      {CATEGORIES.map(({ id, name, Icon }) => {
        const active = activeCatId === id;
        return (
          <button
            key={id}
            className={`cat-strip-item${active ? ' active' : ''}`}
            onClick={() => navigate(`/products?categoryId=${id}`)}
          >
            <span className="cat-strip-icon">
              <Icon size={26} strokeWidth={1.5} />
            </span>
            <span className="cat-strip-name">{name}</span>
          </button>
        );
      })}
    </div>
  );
}
