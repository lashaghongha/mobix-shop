import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Tablet, Watch, Laptop, Headphones, Gamepad2, Tv, Camera, HomeIcon, Sparkles, Car, Cable } from 'lucide-react';
import './Categories.css';

const CATS = [
  { id: 1,  name: 'მობილურები',            Icon: Smartphone },
  { id: 4,  name: 'ტაბლეტები',              Icon: Tablet },
  { id: 8,  name: 'სმარტ საათები',          Icon: Watch },
  { id: 2,  name: 'ლეპტოპები | IT',         Icon: Laptop },
  { id: 5,  name: 'აუდიო სისტემა',          Icon: Headphones },
  { id: 7,  name: 'Gaming',                  Icon: Gamepad2 },
  { id: 3,  name: 'TV | მონიტორები',        Icon: Tv },
  { id: 6,  name: 'ფოტო | ვიდეო',          Icon: Camera },
  { id: 10, name: 'ჭკვიანი სახლი',          Icon: HomeIcon },
  { id: 11, name: 'Beauty',                  Icon: Sparkles },
  { id: 12, name: 'მანქანის აქსესუარები',   Icon: Car },
  { id: 13, name: 'აქსესუარები',            Icon: Cable },
];

const GROUPS = {
  1: [
    { title: 'მობილურის ბრენდები', items: [
      { name: 'Apple',    img: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=200' },
      { name: 'Samsung',  img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200' },
      { name: 'Xiaomi',   img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200' },
      { name: 'Google',   img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200' },
      { name: 'OnePlus',  img: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=200' },
      { name: 'Motorola', img: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200' },
    ]},
    { title: 'მობილურის ეკრანის დამცველები', items: [
      { name: 'For Apple',   img: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200' },
      { name: 'For Samsung', img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200' },
      { name: 'For Xiaomi',  img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200' },
      { name: 'For Google',  img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200' },
      { name: 'For Oppo',    img: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=200' },
      { name: 'For Realme',  img: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200' },
      { name: 'For Honor',   img: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=200' },
      { name: 'For Nothing', img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200' },
      { name: 'For Oneplus', img: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=200' },
      { name: 'For Motorola',img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200' },
    ]},
    { title: 'მობილურის ჩასადები', items: [
      { name: 'For Apple',   img: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200' },
      { name: 'For Samsung', img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200' },
      { name: 'For Xiaomi',  img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200' },
      { name: 'For Google',  img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200' },
      { name: 'For Oppo',    img: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=200' },
      { name: 'For Realme',  img: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200' },
    ]},
  ],
  4: [
    { title: 'Apple iPad', items: [
      { name: 'iPad Pro',      img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200' },
      { name: 'iPad Air',      img: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=200' },
      { name: 'iPad Mini',     img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200' },
      { name: 'iPad Standard', img: 'https://images.unsplash.com/photo-1568386453619-84c3ff4b43c5?w=200' },
    ]},
    { title: 'Samsung Tab', items: [
      { name: 'Galaxy Tab S9', img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200' },
      { name: 'Galaxy Tab A',  img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200' },
    ]},
  ],
  8: [
    { title: 'Apple Watch', items: [
      { name: 'Watch Ultra',    img: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=200' },
      { name: 'Watch Series 9', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200' },
      { name: 'Watch SE',       img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200' },
    ]},
    { title: 'Samsung Watch', items: [
      { name: 'Galaxy Watch 6', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200' },
      { name: 'Galaxy Watch FE',img: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=200' },
    ]},
    { title: 'სხვა ბრენდები', items: [
      { name: 'Garmin',   img: 'https://images.unsplash.com/photo-1542496658-e33a6d0d87dd?w=200' },
      { name: 'Amazfit',  img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200' },
      { name: 'Fitbit',   img: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=200' },
    ]},
  ],
  2: [
    { title: 'Apple MacBook', items: [
      { name: 'MacBook Pro 14"', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200' },
      { name: 'MacBook Pro 16"', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200' },
      { name: 'MacBook Air M3',  img: 'https://images.unsplash.com/photo-1611186871525-d548158a7ffd?w=200' },
    ]},
    { title: 'Windows ლეპტოპები', items: [
      { name: 'Dell XPS',          img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=200' },
      { name: 'ASUS ROG',          img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=200' },
      { name: 'Lenovo ThinkPad',   img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200' },
      { name: 'HP Spectre',        img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200' },
      { name: 'Microsoft Surface', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200' },
      { name: 'Acer Swift',        img: 'https://images.unsplash.com/photo-1611186871525-d548158a7ffd?w=200' },
    ]},
  ],
  5: [
    { title: 'ყურსასმენები', items: [
      { name: 'AirPods Pro',       img: 'https://images.unsplash.com/photo-1588423771073-b8903fead85b?w=200' },
      { name: 'Sony WH-1000XM5',   img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' },
      { name: 'Bose QC45',         img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200' },
      { name: 'Samsung Buds',      img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200' },
    ]},
    { title: 'Bluetooth სპიკერები', items: [
      { name: 'JBL Charge 5', img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200' },
      { name: 'JBL Flip 6',   img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200' },
      { name: 'Bose SoundLink',img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200' },
      { name: 'Marshall',      img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200' },
    ]},
  ],
  7: [
    { title: 'კონსოლები', items: [
      { name: 'PlayStation 5',  img: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=200' },
      { name: 'Xbox Series X',  img: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=200' },
      { name: 'Nintendo Switch',img: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200' },
      { name: 'Steam Deck',     img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200' },
    ]},
    { title: 'Gaming აქსესუარები', items: [
      { name: 'კონტროლერები', img: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=200' },
      { name: 'Gaming Chair',  img: 'https://images.unsplash.com/photo-1593640408182-31c228b47f44?w=200' },
      { name: 'Headset',       img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' },
    ]},
  ],
  3: [
    { title: 'ტელევიზორები', items: [
      { name: 'Samsung',  img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=200' },
      { name: 'Xiaomi',   img: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=200' },
      { name: 'Sony',     img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200' },
      { name: 'LG',       img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=200' },
      { name: 'TCL',      img: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=200' },
      { name: 'Toshiba',  img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200' },
      { name: 'ტელევიზორის საკიდები', img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=200' },
      { name: 'TV Soundbar', img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200' },
    ]},
    { title: 'პროექტორები', items: [
      { name: 'XGIMI',  img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200' },
      { name: 'Xiaomi', img: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=200' },
      { name: 'Wanbo',  img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200' },
      { name: 'Aurzen', img: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=200' },
      { name: 'Epson',  img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200' },
      { name: 'BenQ',   img: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=200' },
    ]},
    { title: 'მონიტორები', items: [
      { name: 'Gaming Monitor',   img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200' },
      { name: '4K Monitor',       img: 'https://images.unsplash.com/photo-1593640408182-31c228b47f44?w=200' },
      { name: 'Ultrawide Monitor',img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200' },
      { name: 'Portable Monitor', img: 'https://images.unsplash.com/photo-1593640408182-31c228b47f44?w=200' },
    ]},
  ],
  6: [
    { title: 'ფოტო კამერები', items: [
      { name: 'Canon DSLR',    img: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200' },
      { name: 'Sony Alpha',    img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200' },
      { name: 'Fujifilm',      img: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=200' },
      { name: 'Nikon',         img: 'https://images.unsplash.com/photo-1562016600-ece13e8ba570?w=200' },
    ]},
    { title: 'ვიდეო', items: [
      { name: 'GoPro',    img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200' },
      { name: 'DJI Drone',img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=200' },
      { name: 'Webcam',   img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200' },
    ]},
  ],
  10: [
    { title: 'Smart Devices', items: [
      { name: 'Smart Speaker', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200' },
      { name: 'Smart Bulb',    img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200' },
      { name: 'Smart Plug',    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200' },
    ]},
    { title: 'მტვერსასრუტები', items: [
      { name: 'რობოტი მტვერსასრუტი',   img: 'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?w=200' },
      { name: 'ხელის მტვერსასრუტი',    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200' },
      { name: 'პორტატული მტვერსასრუტი',img: 'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?w=200' },
    ]},
  ],
  11: [
    { title: 'სახის მოვლა', items: [
      { name: 'Face Massager',  img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200' },
      { name: 'LED Mask',       img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200' },
      { name: 'Facial Cleaner', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200' },
    ]},
    { title: 'თმის მოვლა', items: [
      { name: 'Hair Dryer',       img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=200' },
      { name: 'Hair Straightener',img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=200' },
      { name: 'Trimmer',          img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200' },
    ]},
  ],
  12: [
    { title: 'მანქანის ელექტრონიკა', items: [
      { name: 'Car Charger',   img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200' },
      { name: 'Car Mount',     img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200' },
      { name: 'Car Camera',    img: 'https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?w=200' },
      { name: 'GPS Navigator', img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200' },
    ]},
  ],
  13: [
    { title: 'კაბელები', items: [
      { name: 'Type-C',    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200' },
      { name: 'Lightning', img: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=200' },
      { name: 'HDMI',      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200' },
      { name: 'Micro USB', img: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=200' },
    ]},
    { title: 'დამტენები', items: [
      { name: 'Fast Charger',     img: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=200' },
      { name: 'Wireless Charger', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200' },
      { name: 'Power Bank',       img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200' },
    ]},
  ],
};

export default function Categories() {
  const [activeCat, setActiveCat] = useState(CATS[0].id);
  const groups = GROUPS[activeCat] ?? [];

  return (
    <div className="cat-page">
      {/* Left sidebar */}
      <aside className="cat-sidebar">
        {CATS.map(({ id, name, Icon }) => (
          <button
            key={id}
            className={`cat-side-item${activeCat === id ? ' active' : ''}`}
            onClick={() => setActiveCat(id)}
          >
            <span className="cat-side-icon"><Icon size={28} strokeWidth={1.5} /></span>
            <span className="cat-side-name">{name}</span>
          </button>
        ))}
      </aside>

      {/* Right content */}
      <div className="cat-content">
        {groups.map(group => (
          <div key={group.title} className="cat-group">
            <h3 className="cat-group-title">{group.title}</h3>
            <div className="cat-group-grid">
              {group.items.map(item => (
                <Link
                  key={item.name}
                  to={`/products?categoryId=${activeCat}&search=${encodeURIComponent(item.name)}`}
                  className="cat-tile"
                >
                  <img src={item.img} alt={item.name} />
                  <span>{item.name}</span>
                </Link>
              ))}
              <Link
                to={`/products?categoryId=${activeCat}`}
                className="cat-tile see-all-tile"
              >
                <div className="cat-see-all-inner">
                  <span className="cat-see-all-text">ყველას<br />ნახვა</span>
                </div>
                <span> </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
