// Spec fields per category ID
// type: 'text' (default) | 'yesno' | 'select' | 'number'

const yn = (key, label) => ({ key, label, type: 'yesno' });
const tx = (key, label, placeholder = '') => ({ key, label, placeholder });
const sl = (key, label, options) => ({ key, label, type: 'select', options });

export const CATEGORY_SPECS = {
  // 1 — სმარტფონები
  1: [
    {
      group: 'ბრენდი / ზომა',
      fields: [
        tx('brand_spec', 'ბრენდი', 'Apple / Samsung / Google...'),
        tx('weight', 'წონა', '194 g'),
        tx('release_year', 'გამოშვების წელი', '2024'),
      ],
    },
    {
      group: 'ეკრანი',
      fields: [
        tx('screen_size', 'ეკრანის ზომა', '6.1 inches'),
        tx('screen_type', 'ეკრანის ტიპი', 'Super Retina XDR OLED'),
        tx('resolution', 'რეზოლუცია', '2532×1170 px'),
        tx('refresh_rate', 'განახლების სიხშირე', '120 Hz'),
        tx('brightness', 'სიკაშკაშე', '2000 nits'),
        tx('screen_protection', 'ეკრანის დაცვა', 'Ceramic Shield'),
      ],
    },
    {
      group: 'ტექნიკური მახასიათებლები',
      fields: [
        tx('chipset', 'ჩიპსეტი', 'Apple A18 Pro'),
        tx('ram', 'ოპერატიული მეხსიერება', '8 GB'),
        tx('storage', 'შიდა მეხსიერება', '128 GB'),
        tx('os', 'ოპერაციული სისტემა', 'iOS 18'),
        tx('sim', 'SIM ბარათი', 'Nano-SIM + eSIM'),
        yn('esim', 'E-SIM'),
        yn('5g', '5G'),
        tx('body', 'კორპუსი', 'Titanium / Glass'),
        tx('ip', 'IP დაცვა', 'IP68'),
        tx('bluetooth', 'Bluetooth', '5.3'),
        yn('nfc', 'NFC'),
        yn('stereo', 'სტერეო სპიკერი'),
      ],
    },
    {
      group: 'კამერა',
      fields: [
        tx('main_camera', 'ძირითადი კამერა', '48 MP, f/1.78'),
        tx('extra_cameras', 'დამატებითი კამერა', 'Ultra Wide: 12 MP'),
        tx('front_camera', 'წინა კამერა', '12 MP, f/1.9'),
        tx('main_video', 'ძირითადი ვიდეო', '4K@60fps'),
        tx('front_video', 'წინა კამერის ვიდეო', '4K@30fps'),
      ],
    },
    {
      group: 'ელემენტი',
      fields: [
        tx('battery_capacity', 'ელემენტი', '3279 mAh'),
        tx('charging_speed', 'სადენიანი დამუხტვა', '25W'),
        yn('wireless_charging', 'უსადენო დამუხტვა'),
        tx('wireless_speed', 'უსადენო სიჩქარე', '15W'),
      ],
    },
    {
      group: 'პორტები / სლოტები',
      fields: [
        tx('charging_port', 'დასამუხტი პორტი', 'USB-C'),
        yn('jack35', '3.5mm ჯეკი'),
        yn('microsd', 'Micro SD სლოტი'),
      ],
    },
  ],

  // 2 — ლეპტოპები
  2: [
    {
      group: 'ბრენდი / ზომა',
      fields: [
        tx('brand_spec', 'ბრენდი', 'Apple / Dell / HP...'),
        tx('weight', 'წონა', '1.4 kg'),
        tx('release_year', 'გამოშვების წელი', '2024'),
      ],
    },
    {
      group: 'ეკრანი',
      fields: [
        tx('screen_size', 'ეკრანის ზომა', '13.6 inches'),
        tx('screen_type', 'ეკრანის ტიპი', 'Liquid Retina IPS'),
        tx('resolution', 'რეზოლუცია', '2560×1664 px'),
        tx('refresh_rate', 'განახლების სიხშირე', '60 Hz'),
        tx('brightness', 'სიკაშკაშე', '500 nits'),
      ],
    },
    {
      group: 'პროცესორი',
      fields: [
        tx('chipset', 'პროცესორი', 'Apple M3'),
        tx('cpu_cores', 'CPU ბირთვები', '8-core'),
        tx('gpu', 'გრაფიკული პროცესორი', '10-core GPU'),
        tx('ram', 'ოპერატიული მეხსიერება', '16 GB'),
        tx('storage', 'SSD მეხსიერება', '512 GB'),
        tx('storage_type', 'მეხსიერების ტიპი', 'NVMe SSD'),
      ],
    },
    {
      group: 'ოპერაციული სისტემა',
      fields: [
        tx('os', 'ოპერაციული სისტემა', 'macOS Sequoia'),
        yn('fingerprint', 'თითის ანაბეჭდი'),
        yn('face_id', 'სახის ამოცნობა'),
        tx('keyboard', 'კლავიატურა', 'Backlit Magic Keyboard'),
        tx('touchpad', 'თაჩფადი', 'Force Touch Trackpad'),
      ],
    },
    {
      group: 'კამერა / ხმა',
      fields: [
        tx('front_camera', 'კამერა', '12 MP Center Stage'),
        tx('microphone', 'მიკროფონი', '3-mic array'),
        tx('speakers', 'სპიკერები', '4-speaker sound system'),
        yn('stereo', 'სტერეო ხმა'),
      ],
    },
    {
      group: 'ელემენტი',
      fields: [
        tx('battery_capacity', 'ელემენტი', '52.6 Wh'),
        tx('battery_life', 'მუშაობის დრო', '18 სთ'),
        tx('charging_speed', 'დამუხტვა', '35W MagSafe'),
      ],
    },
    {
      group: 'პორტები / კავშირი',
      fields: [
        tx('ports', 'პორტები', '2× USB-C Thunderbolt 4, MagSafe 3'),
        yn('usb_a', 'USB-A'),
        yn('hdmi', 'HDMI'),
        yn('sd_slot', 'SD Card სლოტი'),
        yn('jack35', '3.5mm ჯეკი'),
        tx('wifi', 'Wi-Fi', 'Wi-Fi 6E'),
        tx('bluetooth', 'Bluetooth', '5.3'),
      ],
    },
  ],

  // 3 — ტელევიზორები
  3: [
    {
      group: 'ეკრანი',
      fields: [
        tx('screen_size', 'ეკრანის ზომა', '55 inches'),
        sl('screen_type', 'ეკრანის ტიპი', ['OLED', 'QLED', 'LED', 'Mini LED', 'MicroLED', 'AMOLED']),
        tx('resolution', 'რეზოლუცია', '3840×2160 (4K)'),
        tx('refresh_rate', 'განახლების სიხშირე', '120 Hz'),
        tx('brightness', 'სიკაშკაშე', '1000 nits'),
        yn('hdr', 'HDR'),
        sl('hdr_format', 'HDR ფორმატი', ['HDR10', 'HDR10+', 'Dolby Vision', 'HLG']),
      ],
    },
    {
      group: 'სისტემა',
      fields: [
        tx('os', 'Smart TV სისტემა', 'WebOS / Tizen / Google TV...'),
        tx('chipset', 'პროცესორი', 'α9 Gen6 AI Processor'),
        yn('voice_assistant', 'ხმოვანი ასისტენტი'),
        yn('google_assistant', 'Google Assistant'),
        yn('alexa', 'Amazon Alexa'),
      ],
    },
    {
      group: 'ხმა',
      fields: [
        tx('speakers', 'სპიკერების სიმძლავრე', '40W 2.2ch'),
        yn('dolby_atmos', 'Dolby Atmos'),
        yn('dts', 'DTS:X'),
      ],
    },
    {
      group: 'პორტები / კავშირი',
      fields: [
        tx('hdmi', 'HDMI პორტები', '4× HDMI 2.1'),
        tx('usb', 'USB პორტები', '3× USB 3.0'),
        yn('bluetooth', 'Bluetooth'),
        tx('wifi', 'Wi-Fi', 'Wi-Fi 6'),
        yn('ethernet', 'Ethernet'),
        yn('jack35', '3.5mm ჯეკი'),
      ],
    },
    {
      group: 'ბრენდი / ზომა',
      fields: [
        tx('brand_spec', 'ბრენდი', 'LG / Samsung / Sony...'),
        tx('weight', 'წონა (კვამლ)', '14 kg'),
        tx('dimensions', 'განზომილება', '123.1×71.5×5.6 cm'),
        tx('release_year', 'გამოშვების წელი', '2024'),
      ],
    },
  ],

  // 4 — ტაბლეტები
  4: [
    {
      group: 'ბრენდი / ზომა',
      fields: [
        tx('brand_spec', 'ბრენდი', 'Apple / Samsung...'),
        tx('weight', 'წონა', '617 g'),
        tx('body', 'კორპუსი', 'Aluminum'),
        tx('release_year', 'გამოშვების წელი', '2024'),
      ],
    },
    {
      group: 'ეკრანი',
      fields: [
        tx('screen_size', 'ეკრანის ზომა', '11 inches'),
        tx('screen_type', 'ეკრანის ტიპი', 'Liquid Retina'),
        tx('resolution', 'რეზოლუცია', '2360×1640 px'),
        tx('refresh_rate', 'განახლების სიხშირე', '120 Hz'),
      ],
    },
    {
      group: 'ტექნიკური მახასიათებლები',
      fields: [
        tx('chipset', 'ჩიპსეტი', 'Apple M2'),
        tx('ram', 'ოპერატიული მეხსიერება', '8 GB'),
        tx('storage', 'შიდა მეხსიერება', '128 GB'),
        tx('os', 'ოპერაციული სისტემა', 'iPadOS 18'),
        yn('5g', '5G'),
        yn('esim', 'eSIM'),
        tx('bluetooth', 'Bluetooth', '5.3'),
        yn('nfc', 'NFC'),
      ],
    },
    {
      group: 'კამერა',
      fields: [
        tx('main_camera', 'ძირითადი კამერა', '12 MP'),
        tx('front_camera', 'წინა კამერა', '12 MP'),
        tx('main_video', 'ვიდეო', '4K@60fps'),
      ],
    },
    {
      group: 'ელემენტი / პორტები',
      fields: [
        tx('battery_capacity', 'ელემენტი', '7606 mAh'),
        tx('charging_speed', 'დამუხტვა', '20W'),
        tx('charging_port', 'პორტი', 'USB-C'),
        yn('jack35', '3.5mm ჯეკი'),
        yn('microsd', 'Micro SD'),
      ],
    },
  ],

  // 5 — აუდიო
  5: [
    {
      group: 'ბრენდი',
      fields: [
        tx('brand_spec', 'ბრენდი', 'Sony / Bose / Apple...'),
        sl('audio_type', 'ტიპი', ['Over-Ear ყურსასმენი', 'In-Ear ყურსასმენი', 'TWS ყურსასმენი', 'სპიკერი', 'სাუნდბარი', 'სტუდიური მიკროფონი']),
        tx('release_year', 'გამოშვების წელი', '2024'),
      ],
    },
    {
      group: 'ხმა',
      fields: [
        tx('driver', 'დრაივერი', '30mm dynamic'),
        tx('frequency', 'სიხშირის დიაპაზონი', '20Hz – 20kHz'),
        tx('impedance', 'იმპედანსი', '32 Ohm'),
        tx('sensitivity', 'მგრძნობელობა', '103 dB'),
        yn('noise_cancelling', 'ხმაური-კანცელინგი (ANC)'),
        yn('transparency', 'Transparency Mode'),
        yn('dolby_atmos', 'Dolby Atmos'),
        yn('stereo', 'სტერეო'),
      ],
    },
    {
      group: 'კავშირი',
      fields: [
        sl('connectivity', 'კავშირი', ['Bluetooth', 'Wired (3.5mm)', 'Wired (USB-C)', 'Wireless (2.4GHz)', 'Hybrid']),
        tx('bluetooth', 'Bluetooth ვერსია', '5.3'),
        yn('multipoint', 'მულტი-პოინტი (2+ მოწყობილობა)'),
        yn('nfc', 'NFC'),
      ],
    },
    {
      group: 'ელემენტი',
      fields: [
        tx('battery_life', 'მუშაობის დრო', '30 სთ'),
        tx('charging_time', 'დამუხტვის დრო', '2 სთ'),
        tx('charging_port', 'დამუხტვის პორტი', 'USB-C'),
        yn('wireless_charging', 'უსადენო დამუხტვა'),
      ],
    },
    {
      group: 'სხვა',
      fields: [
        tx('weight', 'წონა', '254 g'),
        yn('microphone', 'ჩამონტაჟებული მიკროფონი'),
        yn('water_resistant', 'წყლისგან დაცვა'),
        tx('ip', 'IP დაცვა', 'IPX4'),
        yn('foldable', 'დასაკეცი'),
      ],
    },
  ],

  // 6 — კამერები
  6: [
    {
      group: 'ბრენდი',
      fields: [
        tx('brand_spec', 'ბრენდი', 'Sony / Canon / Nikon...'),
        sl('camera_type', 'ტიპი', ['Mirrorless', 'DSLR', 'Compact', 'Action Camera', 'Drone', 'Instant Camera']),
        tx('release_year', 'გამოშვების წელი', '2024'),
        tx('weight', 'წონა', '514 g'),
      ],
    },
    {
      group: 'სენსორი',
      fields: [
        tx('sensor', 'სენსორი', 'Full-Frame CMOS'),
        tx('megapixels', 'მეგაპიქსელი', '61 MP'),
        tx('iso', 'ISO', '100 – 51200'),
        tx('stabilization', 'სტაბილიზაცია', '5-axis IBIS'),
      ],
    },
    {
      group: 'ლინზა / ოპტიკა',
      fields: [
        tx('lens_mount', 'ლინზის მოდელი', 'Sony E-mount'),
        tx('focal_length', 'ფოკუსური მანძილი', '24-70mm'),
        tx('aperture', 'აპერტურა', 'f/2.8'),
        tx('optical_zoom', 'ოპტიკური ზუმი', '3×'),
      ],
    },
    {
      group: 'ვიდეო',
      fields: [
        tx('video', 'ვიდეო', '4K@120fps'),
        yn('log_video', 'LOG ვიდეო'),
        yn('raw_video', 'RAW ვიდეო'),
      ],
    },
    {
      group: 'ეკრანი / ვიზირი',
      fields: [
        tx('screen_size', 'ეკრანი', '3 inches, Tilt'),
        yn('touch_screen', 'სენსორული ეკრანი'),
        yn('evf', 'EVF ვიზირი'),
      ],
    },
    {
      group: 'კავშირი / ელემენტი',
      fields: [
        yn('wifi', 'Wi-Fi'),
        yn('bluetooth', 'Bluetooth'),
        yn('gps', 'GPS'),
        tx('battery_life', 'კადრები ელემენტზე', '500 კადრი'),
        tx('ports', 'პორტები', 'USB-C, HDMI, 3.5mm'),
      ],
    },
  ],

  // 7 — Gaming
  7: [
    {
      group: 'ბრენდი',
      fields: [
        tx('brand_spec', 'ბრენდი', 'Sony / Microsoft / Nintendo...'),
        sl('gaming_type', 'ტიპი', ['კონსოლი', 'კონტროლერი', 'გეიმინგ ყურსასმენი', 'გეიმინგ მაუსი', 'გეიმინგ კლავიატურა', 'გეიმინგ მონიტორი', 'VR გარნიტურა', 'თამაში']),
        tx('release_year', 'გამოშვების წელი', '2024'),
      ],
    },
    {
      group: 'ტექნიკური მახასიათებლები',
      fields: [
        tx('chipset', 'პროცესორი', 'AMD Zen 2 8-core'),
        tx('gpu', 'გრაფიკა', 'AMD RDNA 2 10.3 TFLOPS'),
        tx('ram', 'ოპერატიული მეხსიერება', '16 GB GDDR6'),
        tx('storage', 'SSD', '825 GB'),
        sl('resolution', 'მაქს. გრაფიკა', ['1080p', '1440p', '4K', '8K']),
        tx('fps', 'FPS', '120fps'),
        yn('raytracing', 'Ray Tracing'),
        yn('vr', 'VR მხარდაჭერა'),
      ],
    },
    {
      group: 'კავშირი',
      fields: [
        yn('wifi', 'Wi-Fi'),
        tx('bluetooth', 'Bluetooth', '5.1'),
        tx('ports', 'პორტები', 'USB-A, USB-C, HDMI 2.1'),
        yn('optical', 'Optical Audio'),
      ],
    },
    {
      group: 'ხმა / ეკრანი (კონსოლისთვის)',
      fields: [
        yn('dolby_atmos', 'Dolby Atmos'),
        yn('hdr', 'HDR'),
      ],
    },
  ],

  // 8 — Smart Home
  8: [
    {
      group: 'ბრენდი',
      fields: [
        tx('brand_spec', 'ბრენდი', 'Google / Amazon / Apple...'),
        sl('smart_type', 'ტიპი', ['ჭკვიანი სპიკერი', 'ჭკვიანი ლამპი', 'ჭკვიანი კამერა', 'ჭკვიანი კარის საკეტი', 'ჭკვიანი ტერმოსტატი', 'ჭკვიანი გამომრთველი', 'ჭკვიანი ეკრანი', 'ჭკვიანი სახლის Hub']),
        tx('release_year', 'გამოშვების წელი', '2024'),
      ],
    },
    {
      group: 'კავშირი',
      fields: [
        yn('wifi', 'Wi-Fi'),
        yn('bluetooth', 'Bluetooth'),
        yn('zigbee', 'Zigbee'),
        yn('zwave', 'Z-Wave'),
        yn('matter', 'Matter'),
        yn('thread', 'Thread'),
      ],
    },
    {
      group: 'ასისტენტი / ეკოსისტემა',
      fields: [
        yn('google_assistant', 'Google Assistant'),
        yn('alexa', 'Amazon Alexa'),
        yn('siri', 'Apple Siri / HomeKit'),
        yn('voice_control', 'ხმოვანი მართვა'),
      ],
    },
    {
      group: 'სხვა',
      fields: [
        tx('power', 'კვება', '110-240V AC'),
        tx('ip', 'IP დაცვა', 'IP44'),
        tx('dimensions', 'განზომილება', '10×10×10 cm'),
        tx('weight', 'წონა', '300 g'),
      ],
    },
  ],
};

export const getCategorySpecs = (categoryId) =>
  CATEGORY_SPECS[parseInt(categoryId)] || CATEGORY_SPECS[1];
