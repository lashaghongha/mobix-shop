import { Link } from 'react-router-dom';
import './SidebarPopup.css';

const GROUPS = {
  1: [
    { title: 'მობილურის ბრენდები', items: ['Apple', 'Samsung', 'Xiaomi', 'Poco', 'Vivo', 'Google', 'Nothing', 'OnePlus', 'Realme', 'Oppo', 'ZTE', 'Motorola'] },
    { title: 'ყურსასმენები Buds', items: ['Apple Airpods', 'Galaxy Buds', 'Xiaomi Buds', 'Sony Buds', 'Nothing Buds', 'Realme Buds', 'JBL Buds', 'OnePlus Buds', 'Marshall Buds'] },
    { title: 'მობილურის ჩასადები', items: ['For Apple', 'For Samsung', 'For Xiaomi', 'For Google', 'For Realme', 'For Honor', 'For Oppo', 'For Nothing', 'For Oneplus'] },
    { title: 'Power Banks', items: ['Anker', 'Ugreen', 'Xiaomi', 'Baseus', 'Hoco'] },
    { title: 'უსადენო დამტენები', items: ['Apple', 'Samsung', 'Xiaomi', 'Ugreen', 'Belkin', 'Anker'] },
    { title: 'მობილურის აქსესუარები', items: ['ეკრანის დამცველი', 'კაბელები', 'სტაბილიზატორები', 'GPS ტრეკერები', 'სელფის კოჭები'] },
  ],
  4: [
    { title: 'Apple iPad', items: ['iPad Pro', 'iPad Air', 'iPad Mini', 'iPad Standard', 'iPad აქსესუარები'] },
    { title: 'Samsung Tab', items: ['Galaxy Tab S9', 'Galaxy Tab S8', 'Galaxy Tab A', 'Tab აქსესუარები'] },
    { title: 'სხვა ბრენდები', items: ['Xiaomi Pad', 'Lenovo Tab', 'Huawei MatePad', 'Amazon Fire'] },
    { title: 'გრაფიკული ტაბები', items: ['Wacom', 'XP-Pen', 'Huion', 'Xiaomi'] },
  ],
  9: [
    { title: 'Apple Watch', items: ['Apple Watch Ultra', 'Apple Watch Series 9', 'Apple Watch SE', 'ბენდები'] },
    { title: 'Samsung Watch', items: ['Galaxy Watch 6', 'Galaxy Watch 5', 'Galaxy Watch FE'] },
    { title: 'სხვა ბრენდები', items: ['Garmin', 'Amazfit', 'Fitbit', 'Huawei Watch', 'Xiaomi Band'] },
    { title: 'საათის აქსესუარები', items: ['ბენდები', 'დამტენები', 'ეკრანის დამცველი'] },
  ],
  2: [
    { title: 'Apple MacBook', items: ['MacBook Pro 14"', 'MacBook Pro 16"', 'MacBook Air M2', 'MacBook Air M3'] },
    { title: 'Windows ლეპტოპები', items: ['Dell XPS', 'ASUS ROG', 'Lenovo ThinkPad', 'HP Spectre', 'Microsoft Surface'] },
    { title: 'Gaming ლეპტოპები', items: ['ASUS ROG', 'MSI', 'Razer Blade', 'Lenovo Legion', 'Acer Predator'] },
    { title: 'IT აქსესუარები', items: ['კლავიატურები', 'მაუსები', 'ჰაბები', 'SSD', 'RAM'] },
  ],
  5: [
    { title: 'ყურსასმენები', items: ['AirPods Pro', 'Sony WH-1000XM5', 'Bose QC45', 'Sennheiser', 'Samsung Buds'] },
    { title: 'Bluetooth სპიკერები', items: ['JBL Charge 5', 'JBL Flip 6', 'Bose SoundLink', 'Marshall', 'Sony SRS'] },
    { title: 'ჰომ სისტემები', items: ['Sonos', 'Bose Home', 'Amazon Echo', 'Apple HomePod'] },
  ],
  7: [
    { title: 'კონსოლები', items: ['PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'Steam Deck'] },
    { title: 'სხვა კონსოლები', items: ['Asus ROG Ally', 'Lenovo Legion Go', 'Oculus Quest', 'Backbone'] },
    { title: 'Gaming აქსესუარები', items: ['კონტროლერები', 'Gaming Chair', 'Headset', 'Gaming Mouse', 'Keyboard'] },
  ],
  3: [
    { title: 'Samsung TV', items: ['QLED 4K', 'Neo QLED 8K', 'OLED', 'Frame TV', 'Crystal UHD'] },
    { title: 'LG TV', items: ['OLED evo C3', 'QNED', 'NanoCell', 'UHD 4K'] },
    { title: 'Sony TV', items: ['Bravia XR OLED', 'Bravia XR LED', 'Bravia 4K'] },
    { title: 'მონიტორები', items: ['Gaming Monitor', '4K Monitor', 'Ultrawide', 'Portable'] },
  ],
  6: [
    { title: 'Canon', items: ['EOS DSLR', 'Compact', 'Mirrorless', 'Canon Lens'] },
    { title: 'Sony Camera', items: ['Alpha Mirrorless', 'ZV Series', 'Compact', 'Sony Lens'] },
    { title: 'სხვა ბრენდები', items: ['Fujifilm', 'Nikon', 'GoPro', 'DJI Drone', 'Insta360'] },
    { title: 'ვიდეო', items: ['ვიდეო კამერები', 'Webcam', 'Studio Light', 'Microphone'] },
  ],
};

export default function SidebarPopup({ catId, top, left, onClose, onMouseEnter, onMouseLeave }) {
  const groups = GROUPS[catId] ?? [];

  return (
    <div
      className="sidebar-popup"
      style={{ top: top ?? 0, left: left ?? 0 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="sp-grid">
        {groups.map(group => (
          <div key={group.title} className="sp-group">
            <Link
              to={`/products?categoryId=${catId}`}
              className="sp-group-title"
              onClick={onClose}
            >
              {group.title}
            </Link>
            <ul className="sp-list">
              {group.items.map(item => (
                <li key={item}>
                  <Link
                    to={`/products?categoryId=${catId}&search=${encodeURIComponent(item)}`}
                    className="sp-link"
                    onClick={onClose}
                  >
                    {item}
                  </Link>
                </li>
              ))}
              <li>
                <Link to={`/products?categoryId=${catId}`} className="sp-see-all" onClick={onClose}>
                  ყველას ნახვა
                </Link>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
