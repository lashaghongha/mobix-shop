import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-logo">Mobi<span style={{color:'#c0152a'}}>x</span></div>
          <p>საქართველოს წამყვანი ელექტრონიკის მაღაზია. საუკეთესო ბრენდები, საუკეთესო ფასები.</p>
          <div className="footer-social">
            <a href="#">📘 Facebook</a>
            <a href="#">📸 Instagram</a>
            <a href="#">▶️ YouTube</a>
          </div>
        </div>
        <div>
          <h4>კატეგორიები</h4>
          <ul>
            <li><Link to="/products?categoryId=1">მობილურები</Link></li>
            <li><Link to="/products?categoryId=2">ლეპტოპები</Link></li>
            <li><Link to="/products?categoryId=3">ტელევიზორები</Link></li>
            <li><Link to="/products?categoryId=4">ტაბლეტები</Link></li>
            <li><Link to="/products?categoryId=5">აუდიო</Link></li>
            <li><Link to="/products?categoryId=7">Gaming</Link></li>
          </ul>
        </div>
        <div>
          <h4>კომპანია</h4>
          <ul>
            <li><a href="#">ჩვენ შესახებ</a></li>
            <li><a href="#">კარიერა</a></li>
            <li><a href="#">Trade In</a></li>
            <li><a href="#">ფილიალები</a></li>
          </ul>
        </div>
        <div>
          <h4>დახმარება</h4>
          <ul>
            <li><a href="#">მიწოდება</a></li>
            <li><a href="#">განვადება</a></li>
            <li><a href="#">გარანტია</a></li>
            <li><a href="#">დაბრუნება</a></li>
            <li><a href="#">კონტაქტი</a></li>
          </ul>
          <div className="footer-contact">
            <p>📞 *7007</p>
            <p>✉️ info@mobix.ge</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© 2024 Mobix. ყველა უფლება დაცულია.</p>
          <div className="payment-icons">💳 Visa &nbsp; 💳 Mastercard &nbsp; 🏦 TBC &nbsp; 🏦 BOG</div>
        </div>
      </div>
    </footer>
  );
}
