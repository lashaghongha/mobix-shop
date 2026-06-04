import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCompare } from '../context/CompareContext';
import './Compare.css';

// Same demo specs structure — in future comes from product.specs
const SPEC_GROUPS = [
  {
    group: 'ძირითადი',
    keys: [
      ['brand',    'ბრენდი'],
      ['category', 'კატეგორია'],
      ['price',    'ფასი'],
      ['stock',    'მარაგი'],
    ],
  },
  {
    group: 'დამატებითი მახასიათებლები',
    keys: [
      ['nfc',            'NFC'],
      ['battery',        'ელემენტი'],
      ['chargingSpeed',  'დამუხტვის სიჩქარე'],
      ['wirelessCharge', 'უსადენო დამუხტვა'],
    ],
  },
  {
    group: 'ეკრანი',
    keys: [
      ['screenSize',        'ეკრანის ზომა'],
      ['resolution',        'რეზოლუცია'],
      ['refreshRate',       'განახლების სიხშირე'],
      ['displayType',       'ტიპი'],
      ['displayProtection', 'დაცვა'],
    ],
  },
  {
    group: 'ტექნიკური მახასიათებლები',
    keys: [
      ['sim',      'SIM'],
      ['esim',     'eSIM'],
      ['fiveG',    '5G'],
      ['chipset',  'ჩიპსეტი'],
      ['os',       'ოპერაციული სისტემა'],
      ['osVer',    'OS ვერსია'],
      ['ip',       'IP რეიტინგი'],
      ['bluetooth','Bluetooth'],
    ],
  },
  {
    group: 'მეხსიერება',
    keys: [
      ['storage', 'შიდა მეხსიერება'],
      ['ram',     'RAM'],
      ['microsd', 'MicroSD'],
    ],
  },
  {
    group: 'კამერა',
    keys: [
      ['mainCam',  'მთავარი კამერა'],
      ['frontCam', 'წინა კამერა'],
      ['video',    'ვიდეო'],
    ],
  },
];

// Fake specs per product for demo — keyed by product id
const FAKE_SPECS = {
  // iPhones
  1:  { nfc:'კი', battery:'3227 mAh', chargingSpeed:'20W', wirelessCharge:'კი', screenSize:'6.1"', resolution:'2532×1170', refreshRate:'60 Hz', displayType:'OLED', displayProtection:'Ceramic Shield', sim:'Nano-SIM', esim:'კი', fiveG:'კი', chipset:'A15 Bionic', os:'iOS', osVer:'15', ip:'IP68', bluetooth:'5.0', storage:'128 GB', ram:'4 GB', microsd:'არა', mainCam:'12 MP f/1.6', frontCam:'12 MP', video:'4K@60fps' },
  21: { nfc:'კი', battery:'3279 mAh', chargingSpeed:'20W', wirelessCharge:'კი', screenSize:'6.1"', resolution:'2556×1179', refreshRate:'60 Hz', displayType:'OLED', displayProtection:'Ceramic Shield', sim:'Nano-SIM', esim:'კი', fiveG:'კი', chipset:'A15 Bionic', os:'iOS', osVer:'16', ip:'IP68', bluetooth:'5.3', storage:'128 GB', ram:'6 GB', microsd:'არა', mainCam:'12 MP f/1.5', frontCam:'12 MP', video:'4K@60fps' },
  // Samsung
  2:  { nfc:'კი', battery:'4000 mAh', chargingSpeed:'25W', wirelessCharge:'კი', screenSize:'6.7"', resolution:'3088×1440', refreshRate:'120 Hz', displayType:'Dynamic AMOLED', displayProtection:'Gorilla Glass 6', sim:'Nano-SIM', esim:'კი', fiveG:'კი', chipset:'Exynos 990', os:'Android', osVer:'12', ip:'IP68', bluetooth:'5.0', storage:'128 GB', ram:'12 GB', microsd:'კი', mainCam:'108 MP f/1.8', frontCam:'10 MP', video:'8K@24fps' },
  22: { nfc:'კი', battery:'4500 mAh', chargingSpeed:'45W', wirelessCharge:'კი', screenSize:'6.8"', resolution:'3088×1440', refreshRate:'120 Hz', displayType:'Dynamic AMOLED 2X', displayProtection:'Gorilla Glass Victus', sim:'Nano-SIM', esim:'კი', fiveG:'კი', chipset:'Snapdragon 8 Gen 1', os:'Android', osVer:'12', ip:'IP68', bluetooth:'5.2', storage:'256 GB', ram:'12 GB', microsd:'კი', mainCam:'108 MP f/1.8', frontCam:'40 MP', video:'8K@24fps' },
};

function getSpec(product, key) {
  if (key === 'brand')    return product.brand;
  if (key === 'category') return product.category?.nameGe ?? '—';
  if (key === 'price')    return product.price.toLocaleString() + ' ₾';
  if (key === 'stock')    return product.stock > 0 ? `${product.stock} ერთ.` : 'არ არის';
  const fake = FAKE_SPECS[product.id] || {};
  return fake[key] ?? '—';
}

function isDiff(products, key) {
  const vals = products.map(p => getSpec(p, key));
  return vals.some(v => v !== vals[0]);
}

export default function Compare() {
  const [searchParams] = useSearchParams();
  const ids = (searchParams.get('ids') || '').split(',').filter(Boolean);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [diffOnly, setDiffOnly] = useState(false);
  const { toggle, has } = useCompare();

  useEffect(() => {
    if (!ids.length) { setLoading(false); return; }
    Promise.all(ids.map(id => api.getProduct(id).then(r => r.data)))
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [searchParams.get('ids')]);

  if (loading) return <div className="compare-loading"><div className="cmp-spinner" /></div>;
  if (products.length < 2) return (
    <div className="compare-empty container">
      <p>შედარებისთვის მინიმუმ 2 პროდუქტი გჭირდება.</p>
      <Link to="/products" className="cmp-back-btn">← პროდუქტებზე დაბრუნება</Link>
    </div>
  );

  return (
    <div className="compare-page container">
      <div className="compare-page-header">
        <Link to="/products" className="cmp-back">← დაბრუნება</Link>
        <h1 className="compare-page-title">შედარება</h1>
        <label className="diff-toggle">
          <input type="checkbox" checked={diffOnly} onChange={e => setDiffOnly(e.target.checked)} />
          მხოლოდ განსხვავებები
        </label>
      </div>

      {/* sticky product header row */}
      <div className="cmp-sticky-header">
        <div className="cmp-label-col" />
        {products.map(p => (
          <div className="cmp-product-col" key={p.id}>
            <Link to={`/product/${p.id}`} className="cmp-prod-img-wrap">
              <img src={p.imageUrl} alt={p.name} />
            </Link>
            <div className="cmp-prod-brand">{p.brand}</div>
            <Link to={`/product/${p.id}`} className="cmp-prod-name">{p.name}</Link>
            <div className="cmp-prod-price">{p.price.toLocaleString()} ₾</div>
            <button
              className={`cmp-remove-btn${has(p.id) ? ' active' : ''}`}
              onClick={() => toggle(p)}
            >
              {has(p.id) ? '✕ ამოღება' : '+ შედარება'}
            </button>
          </div>
        ))}
      </div>

      {/* spec rows */}
      {SPEC_GROUPS.map(({ group, keys }) => {
        const visibleKeys = diffOnly
          ? keys.filter(([k]) => isDiff(products, k))
          : keys;
        if (visibleKeys.length === 0) return null;

        return (
          <div className="cmp-group" key={group}>
            <div className="cmp-group-title">{group}</div>
            {visibleKeys.map(([k, label]) => {
              const diff = isDiff(products, k);
              return (
                <div className={`cmp-row${diff ? ' diff' : ''}`} key={k}>
                  <div className="cmp-label-col">{label}</div>
                  {products.map(p => (
                    <div className="cmp-val-col" key={p.id}>{getSpec(p, k)}</div>
                  ))}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
