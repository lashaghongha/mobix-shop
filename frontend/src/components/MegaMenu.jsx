import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Tablet, Watch, Laptop, Headphones, Gamepad2, Tv, Camera, HomeIcon, Sparkles, Car, Cable } from 'lucide-react';
import './MegaMenu.css';

const MENU = [
  {
    id: 1, name: 'მობილურები', Icon: Smartphone,
    groups: [
      {
        title: 'მობილურის ბრენდები',
        items: ['Apple', 'Samsung', 'Xiaomi', 'Poco', 'Vivo', 'Google', 'Nothing', 'OnePlus', 'Realme', 'Oppo', 'ZTE', 'Motorola'],
      },
      {
        title: 'ყურსასმენები Buds',
        items: ['Apple Airpods', 'Galaxy Buds', 'Xiaomi Buds', 'Sony Buds', 'Nothing Buds', 'Realme Buds', 'JBL Buds', 'OnePlus Buds', 'Marshall Buds', 'Motorola Buds', 'Buds-ის აქსესუარები'],
      },
      {
        title: 'მობილურის ჩასადები',
        items: ['For Apple', 'For Samsung', 'For Google', 'For Xiaomi', 'For Realme', 'For Honor', 'For Oppo', 'For Motorola', 'For Nothing', 'For Oneplus'],
      },
      {
        title: 'სმარტ საათები',
        items: ['Apple Watch', 'Galaxy Watch', 'Xiaomi Watch', 'Google Watch', 'Amazfit Watch', 'Garmin Watch', 'OnePlus Watch', 'Nothing Watch', 'საათის აქსესუარები'],
      },
      {
        title: 'Power Banks',
        items: ['Anker', 'Ugreen', 'Xiaomi', 'Baseus', 'Hoco'],
      },
      {
        title: 'უსადენო დამტენები',
        items: ['Apple', 'Samsung', 'Xiaomi', 'Ugreen', 'Belkin', 'Havit', 'Hoco', 'Anker'],
      },
      {
        title: 'დამტენი ადაპტერი',
        items: ['Apple Adapter', 'Samsung Adapter', 'Anker Adapter', 'Spigen Adapter', 'Belkin Adapter', 'Ugreen Adapter', 'Xiaomi Adapter', 'Baseus Adapter'],
      },
      {
        title: 'მობილურის აქსესუარები',
        items: ['ეკრანის დამცველი', 'სტაბილიზატორები', 'კაბელები', 'სათამაშო ტრიგერები', 'GPS ტრეკერები', 'კამერის დამცველი', 'სელფის კოჭები', 'OTG ფლეშ მეხსიერებები'],
      },
    ],
  },
  {
    id: 4, name: 'ტაბები', Icon: Tablet,
    groups: [
      { title: 'Apple', items: ['iPad Pro', 'iPad Air', 'iPad Mini', 'iPad (Standard)', 'iPad აქსესუარები'] },
      { title: 'Samsung', items: ['Galaxy Tab S9', 'Galaxy Tab S8', 'Galaxy Tab A', 'Tab აქსესუარები'] },
      { title: 'სხვა ბრენდები', items: ['Xiaomi Pad', 'Lenovo Tab', 'Huawei MatePad', 'Amazon Fire'] },
      { title: 'გრაფიკული ტაბები', items: ['Xiaomi', 'Wacom', 'XP-Pen', 'Huion'] },
    ],
  },
  {
    id: 9, name: 'სმარტ საათები', Icon: Watch,
    groups: [
      { title: 'Apple Watch', items: ['Apple Watch Ultra', 'Apple Watch Series 9', 'Apple Watch SE', 'საათის ბენდები'] },
      { title: 'Samsung', items: ['Galaxy Watch 6', 'Galaxy Watch 5', 'Galaxy Watch FE'] },
      { title: 'სხვა ბრენდები', items: ['Garmin', 'Amazfit', 'Fitbit', 'Huawei Watch', 'Xiaomi Band'] },
      { title: 'საათის აქსესუარები', items: ['საათის ბენდები', 'დამტენები', 'ეკრანის დამცველი'] },
    ],
  },
  {
    id: 2, name: 'ლეპტოპები | IT', Icon: Laptop,
    groups: [
      { title: 'Apple MacBook', items: ['MacBook Pro 14"', 'MacBook Pro 16"', 'MacBook Air M2', 'MacBook Air M3'] },
      { title: 'Windows ლეპტოპები', items: ['Dell XPS', 'ASUS ROG', 'Lenovo ThinkPad', 'HP Spectre', 'Microsoft Surface', 'Acer Swift'] },
      { title: 'Gaming ლეპტოპები', items: ['ASUS ROG', 'MSI', 'Razer Blade', 'Lenovo Legion', 'Acer Predator'] },
      { title: 'IT აქსესუარები', items: ['კლავიატურები', 'მაუსები', 'ჰაბები', 'SSD', 'RAM', 'Webcam'] },
    ],
  },
  {
    id: 5, name: 'აუდიო სისტემა', Icon: Headphones,
    groups: [
      { title: 'ყურსასმენები', items: ['AirPods Pro', 'Sony WH-1000XM5', 'Bose QC45', 'Sennheiser', 'Samsung Buds'] },
      { title: 'სპიკერები', items: ['JBL Charge', 'JBL Flip', 'Bose SoundLink', 'Marshall', 'Sony SRS'] },
      { title: 'ჰომ სისტემები', items: ['Sonos', 'Bose Home', 'Amazon Echo', 'Apple HomePod'] },
    ],
  },
  {
    id: 7, name: 'Gaming', Icon: Gamepad2,
    groups: [
      { title: 'კონსოლები', items: ['PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'Steam Deck', 'PlayStation 4'] },
      { title: 'სხვა კონსოლები', items: ['Asus ROG Ally', 'Lenovo Legion Go', 'Game Boy', 'Oculus', 'Backbone'] },
      { title: 'Gaming აქსესუარები', items: ['კონტროლერები', 'Gaming Chair', 'Headset', 'Gaming Mouse', 'Gaming Keyboard'] },
      { title: 'სამგზავრო ჩემოდანი', items: ['სამგზავრო ჩემოდნები'] },
    ],
  },
  {
    id: 3, name: 'TV | მონიტორები', Icon: Tv,
    groups: [
      { title: 'Samsung TV', items: ['QLED 4K', 'Neo QLED', 'OLED', 'Frame TV', 'Crystal UHD'] },
      { title: 'LG TV', items: ['OLED evo', 'QNED', 'NanoCell', 'UHD'] },
      { title: 'Sony TV', items: ['Bravia XR OLED', 'Bravia XR LED', 'Bravia 4K'] },
      { title: 'მონიტორები', items: ['Gaming Monitor', '4K Monitor', 'Ultrawide', 'Portable Monitor'] },
    ],
  },
  {
    id: 6, name: 'ფოტო | ვიდეო', Icon: Camera,
    groups: [
      { title: 'Canon', items: ['EOS DSLR', 'Compact', 'Mirrorless', 'Canon Lens'] },
      { title: 'Sony Camera', items: ['Alpha Mirrorless', 'ZV Series', 'Compact', 'Sony Lens'] },
      { title: 'სხვა ბრენდები', items: ['Fujifilm', 'Nikon', 'GoPro', 'DJI Drone', 'Insta360'] },
      { title: 'ვიდეო', items: ['ვიდეო კამერები', 'Webcam', 'Studio Light', 'Microphone'] },
    ],
  },
  {
    id: 10, name: 'ქვეინო საქლი', Icon: HomeIcon,
    groups: [
      { title: 'Smart Devices', items: ['Smart Speaker', 'Smart Bulb', 'Smart Plug', 'Smart Lock'] },
      { title: 'უსაფრთხოება', items: ['Security Camera', 'Doorbell', 'Alarm System'] },
      { title: 'რობოტები', items: ['Robot Vacuum', 'Mini Robot', 'Robot Toy'] },
    ],
  },
  {
    id: 11, name: 'Beauty', Icon: Sparkles,
    groups: [
      { title: 'სახის მოვლა', items: ['Face Massager', 'LED Mask', 'Facial Cleaner', 'Derma Roller'] },
      { title: 'თმის მოვლა', items: ['Hair Dryer', 'Hair Straightener', 'Curler', 'Trimmer'] },
    ],
  },
  {
    id: 12, name: 'მანქანის აქსესუარები', Icon: Car,
    groups: [
      { title: 'ელექტრონიკა', items: ['Car Charger', 'Car Mount', 'Car Camera', 'GPS Navigator'] },
      { title: 'მანქანის ხმა', items: ['Car Speaker', 'Car Amplifier', 'Subwoofer'] },
    ],
  },
  {
    id: 13, name: 'აქსესუარები', Icon: Cable,
    groups: [
      { title: 'კაბელები', items: ['Micro USB', 'Lightning', 'HDMI', 'Type-C', 'AUX', 'LAN'] },
      { title: 'დამტენები', items: ['Fast Charger', 'Wireless Charger', 'Car Charger', 'Power Bank'] },
      { title: 'სხვა', items: ['Screen Protector', 'Phone Case', 'Camera Lens', 'Memory Card'] },
    ],
  },
];

export default function MegaMenu({ onClose, initialCatId, sidebarMode }) {
  const [activeId, setActiveId] = useState(initialCatId ?? MENU[0].id);
  const active = MENU.find(m => m.id === activeId);

  return (
    <div className={`mega-overlay${sidebarMode ? ' sidebar-mode' : ''}`} onClick={onClose}>
      <div className="mega-wrap" onClick={e => e.stopPropagation()}>

        {/* Left sidebar */}
        <aside className="mega-sidebar">
          {MENU.map(({ id, name, Icon }) => (
            <button
              key={id}
              className={`mega-side-item ${activeId === id ? 'active' : ''}`}
              onMouseEnter={() => setActiveId(id)}
              onClick={() => setActiveId(id)}
            >
              <span className="mega-side-icon"><Icon size={17} strokeWidth={1.5} /></span>
              <span>{name}</span>
              <svg className="mega-side-arrow" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          ))}
        </aside>

        {/* Right content */}
        <div className="mega-content">
          <div className="mega-content-grid">
            {active?.groups.map(group => (
              <div key={group.title} className="mega-group">
                <Link
                  to={`/products?categoryId=${activeId}&search=${encodeURIComponent(group.title)}`}
                  className="mega-group-title"
                  onClick={onClose}
                >
                  {group.title}
                </Link>
                <ul className="mega-group-list">
                  {group.items.map(item => (
                    <li key={item}>
                      <Link
                        to={`/products?categoryId=${activeId}&search=${encodeURIComponent(item)}`}
                        className="mega-group-link"
                        onClick={onClose}
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      to={`/products?categoryId=${activeId}`}
                      className="mega-see-all"
                      onClick={onClose}
                    >
                      ყველას ნახვა
                    </Link>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
