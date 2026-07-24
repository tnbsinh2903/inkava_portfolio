import dotenv from "dotenv";
import express from "express";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";
dotenv.config();

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "database.json");
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Default Data
const DEFAULT_DATA = {
  adminCredentials: {
    username: "admin",
    password: "admin123"
  },
  logo: {
    type: "text", // "text" | "image"
    text: "SMARTPRINT",
    image: ""
  },
  settings: {
    companyName: "Nhà Máy In Công Nghệ Cao SmartPrint",
    slogan: "Chất lượng vượt trội - Công nghệ đi đầu",
    address: "Lô 18, Đường số 3, Khu Công Nghiệp Sài Đồng B, Long Biên, Hà Nội",
    email: "info@inkava.vn",
    hotline: "1900 888 999",
    facebook: "https://facebook.com/smartprint.vietnam",
    youtube: "https://youtube.com/smartprint",
    tiktok: "https://tiktok.com/@smartprint",
    zalo: "https://zalo.me/1900888999",
    instagram: "https://instagram.com/smartprint",
    linkedin: "https://linkedin.com/company/smartprint",
    showFacebook: true,
    showYoutube: true,
    showTiktok: true,
    showZalo: true,
    showInstagram: true,
    showLinkedin: false,
    googleMaps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.863806229068!2d105.8931107!3d21.0381278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135a9602ff57e51%3A0xc3f58a36fa5b66d!2zS2h1IEPDtG5nIE5naGnhu4dwIFPDoGkgxJDhu5NuZyBC!5e0!3m2!1svi!2s!4v1626400000000!5m2!1svi!2s",
    footer: "© 2026 SmartPrint Co., Ltd. Tất cả quyền được bảo hộ.",
    seo: {
      title: "SmartPrint - Nhà Máy In Công Nghệ Cao Hàng Đầu",
      description: "SmartPrint chuyên cung cấp dịch vụ in ấn offset, in bao bì, catalogue, tem nhãn chất lượng cao với công nghệ hiện đại hàng đầu Việt Nam.",
      keywords: "in offset, in bao bì, in catalogue, in hộp giấy, nhà máy in hà nội",
      ogImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
      favicon: ""
    }
  },
  banners: [
    {
      id: "b1",
      title: "Giải Pháp In Ấn Công Nghiệp Tiêu Chuẩn Quốc Tế",
      description: "Nhà máy in SmartPrint sở hữu dây chuyền in Offset và Flexo hiện đại hàng đầu Châu Âu. Cam kết chất lượng sắc nét, tiến độ vượt trội cho mọi dự án bao bì và ấn phẩm.",
      buttonText: "Liên Hệ Ngay",
      buttonLink: "#contact",
      secondaryButtonText: "Khám Phá Dịch Vụ",
      secondaryButtonLink: "#services",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80",
      isVisible: true,
      order: 1
    },
    {
      id: "b2",
      title: "Công Nghệ In Offset Hiện Đại Hàng Đầu",
      description: "Trang bị hệ thống máy in Heidelberg Speedmaster thế hệ mới của Đức. Đáp ứng hoàn hảo các đơn hàng in Catalogue, tạp chí, hộp giấy cao cấp số lượng lớn.",
      buttonText: "Nhận Báo Giá",
      buttonLink: "#contact",
      secondaryButtonText: "Xem Thống Kê",
      secondaryButtonLink: "#about",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=80",
      isVisible: true,
      order: 2
    },
    {
      id: "b3",
      title: "In Ấn Bao Bì & Hộp Giấy Thân Thiện Môi Trường",
      description: "Sử dụng mực in gốc thực vật và các chất liệu giấy tái chế tiêu chuẩn FSC. Góp phần nâng tầm thương hiệu của doanh nghiệp với những bao bì xanh, sang trọng.",
      buttonText: "Xem Dịch Vụ",
      buttonLink: "#services",
      secondaryButtonText: "Về Chúng Tôi",
      secondaryButtonLink: "#about",
      image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1600&q=80",
      isVisible: true,
      order: 3
    }
  ],
  services: [
    {
      id: "s1",
      name: "In Offset Chất Lượng Cao",
      description: "Công nghệ in offset hoàn hảo cho catalog, sách báo, tạp chí và hộp giấy số lượng lớn, mang lại độ sắc nét và đồng đều màu sắc tuyệt đối.",
      icon: "Printer",
      image: "https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?auto=format&fit=crop&w=600&q=80",
      isVisible: true,
      order: 1
    },
    {
      id: "s2",
      name: "In Bao Bì & Hộp Giấy",
      description: "Sản xuất bao bì, hộp giấy carton, hộp cứng cao cấp cho ngành thực phẩm, mỹ phẩm, dược phẩm và đồ điện tử với công nghệ gia công tiên tiến.",
      icon: "Box",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
      isVisible: true,
      order: 2
    },
    {
      id: "s3",
      name: "In Catalogue & Kỷ Yếu",
      description: "Ấn phẩm quảng cáo chất lượng cao giúp doanh nghiệp nâng tầm hình ảnh thương hiệu, đa dạng tùy chọn chất liệu giấy, cán mờ, phủ UV định hình.",
      icon: "BookOpen",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      isVisible: true,
      order: 3
    },
    {
      id: "s4",
      name: "In Tem Nhãn & Decal",
      description: "Tem nhãn sản phẩm dạng cuộn hoặc tờ, decal nhựa trong, decal bạc chống nước tốt, keo bám dính chắc chắn trên mọi loại bề mặt chai lọ.",
      icon: "Tag",
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80",
      isVisible: true,
      order: 4
    },
    {
      id: "s5",
      name: "In Túi Giấy Thời Trang",
      description: "Sản xuất túi giấy Kraft bảo vệ môi trường hoặc túi giấy mạ màng bóng sang trọng cho các shop thời trang, quà tặng sự kiện doanh nghiệp.",
      icon: "ShoppingBag",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
      isVisible: true,
      order: 5
    },
    {
      id: "s6",
      name: "Gia Công Thành Phẩm",
      description: "Cung cấp đầy đủ dịch vụ gia công sau in: ép kim, bế nổi, phủ UV định hình, bồi carton, dán cửa sổ kiếng tạo nên vẻ đẹp đẳng cấp cho sản phẩm.",
      icon: "Layers",
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
      isVisible: true,
      order: 6
    }
  ],
  about: {
    title: "Về Nhà Máy In SmartPrint",
    description: "Được thành lập từ năm 2012, SmartPrint tự hào là một trong những doanh nghiệp tiên phong trong lĩnh vực in ấn công nghiệp chất lượng cao tại Việt Nam.\n\nChúng tôi sở hữu nhà xưởng quy mô lớn với máy móc hiện đại nhập khẩu đồng bộ từ Đức, Nhật Bản, cùng đội ngũ kỹ sư lành nghề hơn 15 năm kinh nghiệm. Với phương châm 'Uy tín tạo dựng niềm tin', SmartPrint luôn nỗ lực mang lại những sản phẩm bao bì, ấn phẩm tinh xảo và giải pháp in tối ưu chi phí nhất cho mọi khách hàng.",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    stats: {
      foundationYear: 2012,
      area: 8500, // m2
      employees: 250, // người
      capacity: 15 // triệu sản phẩm / tháng
    }
  },
  brands: [
    { id: "br1", name: "Vinamilk", logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&h=80&q=80", isVisible: true, order: 1 },
    { id: "br2", name: "Samsung", logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=150&h=80&q=80", isVisible: true, order: 2 },
    { id: "br3", name: "Acecook", logo: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=150&h=80&q=80", isVisible: true, order: 3 },
    { id: "br4", name: "Trung Nguyen", logo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=150&h=80&q=80", isVisible: true, order: 4 },
    { id: "br5", name: "Vingroup", logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&h=80&q=80", isVisible: true, order: 5 },
    { id: "br6", name: "TH True Milk", logo: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=150&h=80&q=80", isVisible: true, order: 6 }
  ],
  gallery: [
    { id: "g1", title: "Dây chuyền in Offset Heidelberg 6 màu", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" },
    { id: "g2", title: "Máy bế và gia công hộp cứng tự động", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80" },
    { id: "g3", title: "Kho nguyên liệu giấy cuộn công nghiệp", image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80" },
    { id: "g4", title: "Kiểm tra chất lượng thành phẩm sau cán màng", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80" },
    { id: "g5", title: "Khu vực gia công dán hộp tự động", image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80" },
    { id: "g6", title: "Lô hàng Catalogue xuất khẩu Nhật Bản", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80" }
  ],
  contacts: [
    {
      id: "c_1",
      fullName: "Nguyễn Văn Hùng",
      phone: "0912345678",
      email: "hung.nguyen@gmail.com",
      message: "Tôi muốn đặt in 10,000 hộp giấy đựng mỹ phẩm, vui lòng gửi báo giá in offset phủ UV.",
      createdAt: "2026-07-15T10:00:00.000Z",
      isProcessed: false
    },
    {
      id: "c_2",
      fullName: "Trần Thị Lan",
      phone: "0987654321",
      email: "lan.tran@vietnamfoods.vn",
      message: "Cần tư vấn thiết kế và in túi giấy Kraft cho hệ thống cửa hàng thực phẩm sạch.",
      createdAt: "2026-07-14T14:30:00.000Z",
      isProcessed: true
    }
  ]
};

// Database utility functions
function readDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      let modified = false;

      // Migration for aboutFactory
      if (!parsed.aboutFactory) {
        parsed.aboutFactory = {
          title: "Về Nhà Máy In Kava",
          description: parsed.about?.description || "Chúng tôi sở hữu tổ hợp nhà xưởng tự động hóa quy mô lớn, được trang bị hệ thống máy in Offset Heidelberg Speedmaster thế hệ mới nhất của Đức kết hợp với quy chuẩn kiểm màu G7 chuẩn xác tuyệt đối.",
          images: [
            "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80"
          ],
          imageRotationInterval: 5,
          stats: parsed.about?.stats || {
            foundationYear: 2012,
            area: 8500,
            employees: 250,
            capacity: 15
          }
        };
        modified = true;
      }

      // Migration for aboutUs
      if (!parsed.aboutUs) {
        parsed.aboutUs = {
          title: "Giới Thiệu Doanh Nghiệp In Kava",
          description: "In Kava tự hào là đối tác thiết kế và sản xuất bao bì, hộp giấy cao cấp cho hàng trăm thương hiệu lớn nhỏ trên toàn quốc. Chúng tôi cung cấp các giải pháp bao bì từ thiết kế mẫu 3D miễn phí cho đến quy trình in offset chất lượng cao khép kín, cam kết đáp ứng mọi tiêu chuẩn chất lượng khắt khe nhất của thị trường.",
          videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-printing-press-running-at-high-speed-42867-large.mp4"
        };
        modified = true;
      }

      // Migration for team
      if (!parsed.team) {
        parsed.team = [
          {
            id: "tm1",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
            fullName: "Nguyễn Thị Mai",
            email: "mai.nguyen@inkava.vn",
            department: "Kinh Doanh",
            position: "Trưởng phòng Kinh doanh",
            order: 1
          },
          {
            id: "tm2",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
            fullName: "Trần Anh Tuấn",
            email: "tuan.tran@inkava.vn",
            department: "Kỹ Thuật In",
            position: "Kỹ sư Trưởng Heidelberg",
            order: 2
          },
          {
            id: "tm3",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
            fullName: "Lê Minh Thư",
            email: "thu.le@inkava.vn",
            department: "Thiết Kế Mỹ Thuật",
            position: "Creative Director",
            order: 3
          }
        ];
        modified = true;
      }

      // Migration for work
      if (!parsed.work) {
        parsed.work = [
          {
            id: "w1",
            image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
            customerName: "Toyota Việt Nam",
            application: "Hộp phụ tùng & Sổ hướng dẫn",
            order: 1
          },
          {
            id: "w2",
            image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=600&q=80",
            customerName: "Vinamilk",
            application: "Hộp quà tặng sữa bột cao cấp",
            order: 2
          },
          {
            id: "w3",
            image: "https://images.unsplash.com/photo-1589330694653-ded6df53f6ee?auto=format&fit=crop&w=600&q=80",
            customerName: "Samsung Vina",
            application: "Hộp điện thoại Galaxy cao cấp",
            order: 3
          },
          {
            id: "w4",
            image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=600&q=80",
            customerName: "Nestlé Việt Nam",
            application: "Bao bì hộp bánh Tết sang trọng",
            order: 4
          }
        ];
        modified = true;
      }

      // Migration for sectionBgColors
      if (!parsed.sectionBgColors) {
        parsed.sectionBgColors = {
          aboutFactory: "#ffffff",
          aboutUs: "#f8fafc",
          work: "#ffffff",
          team: "#f8fafc",
          contact: "#ffffff"
        };
        modified = true;
      }

      // Migration for adminCredentials
      if (!parsed.adminCredentials) {
        parsed.adminCredentials = {
          username: "admin",
          password: "admin123"
        };
        modified = true;
      }

      // Migration for settings.email if old placeholder
      if (parsed.settings && (parsed.settings.email === "info@smartprint.com.vn" || !parsed.settings.email)) {
        parsed.settings.email = "info@inkava.vn";
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), "utf-8");
      }
      return parsed;
    }
  } catch (error) {
    console.error("Error reading database, resetting to defaults:", error);
  }
  // Initialize file
  fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DATA, null, 2), "utf-8");
  return DEFAULT_DATA;
}

function writeDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Ensure database file is initialized on startup
readDB();

async function startServer() {
  const app = express();

  // Support file uploads and large payloads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Serve static uploaded files
  app.use("/uploads", express.static(UPLOADS_DIR));

  // Simple hardcoded session store
  let loggedInUser: { username: string } | null = null;

  const authMiddleware = (req: any, res: any, next: any) => {
    // In our simplified preview setup, we authorize standard calls if our session is active
    // We can also check authorization header for the mock JWT token
    const authHeader = req.headers.authorization;
    if (loggedInUser || authHeader === "Bearer mock_jwt_token_for_cms") {
      return next();
    }
    return res.status(401).json({ error: "Unauthorized access to Admin CMS." });
  };

  // --- API ROUTES ---

  // Auth Endpoints
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const db = readDB();
    const creds = db.adminCredentials || { username: "admin", password: "admin123" };
    if (username === creds.username && password === creds.password) {
      loggedInUser = { username };
      return res.json({ success: true, user: loggedInUser, token: "mock_jwt_token_for_cms" });
    }
    return res.status(401).json({ error: "Tên đăng nhập hoặc mật khẩu không chính xác." });
  });

  app.put("/api/admin/change-password", authMiddleware, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ mật khẩu hiện tại và mật khẩu mới." });
    }

    const db = readDB();
    const creds = db.adminCredentials || { username: "admin", password: "admin123" };

    if (currentPassword !== creds.password) {
      return res.status(400).json({ error: "Mật khẩu hiện tại không chính xác." });
    }

    db.adminCredentials = {
      username: "admin",
      password: newPassword
    };
    writeDB(db);

    return res.json({ success: true, message: "Đổi mật khẩu đăng nhập thành công!" });
  });

  app.post("/api/logout", (req, res) => {
    loggedInUser = null;
    res.json({ success: true });
  });

  app.get("/api/me", (req, res) => {
    if (loggedInUser) {
      return res.json({ loggedIn: true, user: loggedInUser });
    }
    return res.json({ loggedIn: false });
  });

  // Public Landing Page Data Fetch
  app.get("/api/public/data", (req, res) => {
    const db = readDB();
    res.json({
      logo: db.logo,
      settings: db.settings,
      banners: db.banners.filter((b: any) => b.isVisible).sort((a: any, b: any) => a.order - b.order),
      services: db.services.filter((s: any) => s.isVisible).sort((a: any, b: any) => a.order - b.order),
      about: db.about,
      aboutFactory: db.aboutFactory,
      aboutUs: db.aboutUs,
      team: db.team ? db.team.sort((a: any, b: any) => a.order - b.order) : [],
      work: db.work ? db.work.sort((a: any, b: any) => a.order - b.order) : [],
      sectionBgColors: db.sectionBgColors,
      brands: db.brands.filter((br: any) => br.isVisible).sort((a: any, b: any) => a.order - b.order),
      gallery: db.gallery
    });
  });

  // Email Notification Helper Function
  async function sendContactEmailNotification(contact: any, recipientEmail: string) {
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);

    const targetEmail = recipientEmail || process.env.NOTIFICATION_EMAIL || "info@inkava.vn";

    const emailSubject = `Inkava Website New Contact`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb; color: #111827;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb;">
          <h2 style="color: #d97706; margin-top: 0; font-size: 20px; text-transform: uppercase;">Thông Tin Liên Hệ</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-weight: bold; width: 35%;">Họ và tên :</td>
              <td style="padding: 10px; border-bottom: 1px solid #f3f4f6;">${contact.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-weight: bold;">Số điện thoại :</td>
              <td style="padding: 10px; border-bottom: 1px solid #f3f4f6;"><strong>${contact.phone || 'Chưa cung cấp'}</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-weight: bold;">Email :</td>
              <td style="padding: 10px; border-bottom: 1px solid #f3f4f6;"><a href="mailto:${contact.email}">${contact.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-weight: bold;">Công ty :</td>
              <td style="padding: 10px; border-bottom: 1px solid #f3f4f6;">${contact.company || 'Chưa cung cấp'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-weight: bold;">Địa chỉ :</td>
              <td style="padding: 10px; border-bottom: 1px solid #f3f4f6;">${contact.address || 'Chưa cung cấp'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-weight: bold;">Thời gian gửi :</td>
              <td style="padding: 10px; border-bottom: 1px solid #f3f4f6;">${new Date(contact.createdAt).toLocaleString('vi-VN')}</td>
            </tr>
          </table>

          <div style="margin-top: 20px; padding: 15px; background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 4px;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #92400e;">Nội dung tin nhắn :</p>
            <p style="margin: 0; color: #78350f; white-space: pre-wrap; font-size: 14px;">${contact.message || 'Khách hàng không nhập lời nhắn thêm.'}</p>
          </div>
      </div>
    `;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        });

        await transporter.sendMail({
          from: `"Website Inkava" <${smtpUser}>`,
          to: targetEmail,
          bcc: ['sinh.trannguyenbao@inkava.vn'], // Optional: BCC to internal team
          subject: emailSubject,
          html: htmlBody
        });
        console.log(`[EMAIL] Successfully sent notification email to ${targetEmail}`);
        return { sent: true };
      } catch (err) {
        console.error(`[EMAIL ERROR] Failed to send email via SMTP:`, err);
        return { sent: false, error: err };
      }
    } else {
      console.log(`[EMAIL NOTICE] Contact saved in CMS. SMTP credentials not configured in env. Target email: ${targetEmail}`, {
        to: targetEmail,
        subject: emailSubject,
        contact
      });
      console.log("Check Env:", { smtpHost, smtpUser, smtpPass, smtpPort });
      return { sent: false, reason: "SMTP not configured" };
    }
  }

  // Public contact submission
  app.post("/api/contacts", async (req, res) => {
    const { fullName, phone, email, company, address, message } = req.body;
    if (!fullName || !email) {
      return res.status(400).json({ error: "Họ tên và Địa chỉ Email nhận báo giá là bắt buộc." });
    }

    const db = readDB();
    const newContact = {
      id: "c_" + Date.now(),
      fullName,
      phone: phone || "",
      email,
      company: company || "",
      address: address || "",
      message: message || "",
      createdAt: new Date().toISOString(),
      isProcessed: false
    };

    db.contacts.unshift(newContact);
    writeDB(db);

    // Send email notification to info@inkava.vn (or setting email)
    const targetEmail = db.settings?.email || "info@inkava.vn";
    sendContactEmailNotification(newContact, targetEmail).catch((e) => {
      console.error("[EMAIL BACKGROUND ERROR]", e);
    });

    res.json({ success: true, contact: newContact });
  });

  // --- ADMIN CMS ENDPOINTS (Middleware checking if authenticated) ---

  // Get full Admin CMS data
  app.get("/api/admin/data", authMiddleware, (req, res) => {
    const db = readDB();
    res.json(db);
  });

  // Upload image or PDF as base64 and save to disk, return public URL path
  app.post("/api/admin/upload", authMiddleware, (req, res) => {
    const { file, name } = req.body; // file is base64 string
    if (!file) {
      return res.status(400).json({ error: "Không tìm thấy dữ liệu tệp tin." });
    }

    try {
      // Expecting format "data:image/png;base64,..." or "data:application/pdf;base64,..."
      const matches = file.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Định dạng tệp Base64 không hợp lệ." });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");

      let extension = "png";
      if (mimeType === "application/pdf") {
        extension = "pdf";
      } else if (mimeType.startsWith("image/")) {
        const sub = mimeType.split("/")[1];
        extension = sub === "jpeg" ? "jpg" : sub;
      } else {
        // Fallback for other mime-types or raw
        const parts = mimeType.split("/");
        extension = parts[parts.length - 1] || "bin";
      }

      const safeName = (name || "upload")
        .toLowerCase()
        .replace(/[^a-z0-9.]/g, "-")
        .replace(/\.[^/.]+$/, ""); // strip existing extension

      const fileName = `${safeName}-${Date.now()}.${extension}`;
      const filePath = path.join(UPLOADS_DIR, fileName);

      fs.writeFileSync(filePath, buffer);
      const fileUrl = `/uploads/${fileName}`;

      res.json({ success: true, url: fileUrl });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Không thể lưu tệp tin: " + error.message });
    }
  });

  // Update Settings
  app.put("/api/admin/settings", authMiddleware, (req, res) => {
    const db = readDB();
    db.settings = { ...db.settings, ...req.body };
    writeDB(db);
    res.json({ success: true, settings: db.settings });
  });

  // Update Logo
  app.put("/api/admin/logo", authMiddleware, (req, res) => {
    const db = readDB();
    db.logo = { ...db.logo, ...req.body };
    writeDB(db);
    res.json({ success: true, logo: db.logo });
  });

  // Update About
  app.put("/api/admin/about", authMiddleware, (req, res) => {
    const db = readDB();
    db.about = { ...db.about, ...req.body };
    writeDB(db);
    res.json({ success: true, about: db.about });
  });

  // Update About Factory
  app.put("/api/admin/aboutFactory", authMiddleware, (req, res) => {
    const db = readDB();
    db.aboutFactory = { ...db.aboutFactory, ...req.body };
    writeDB(db);
    res.json({ success: true, aboutFactory: db.aboutFactory });
  });

  // Update About Us
  app.put("/api/admin/aboutUs", authMiddleware, (req, res) => {
    const db = readDB();
    db.aboutUs = { ...db.aboutUs, ...req.body };
    writeDB(db);
    res.json({ success: true, aboutUs: db.aboutUs });
  });

  // CRUD Team Members
  app.get("/api/admin/team", authMiddleware, (req, res) => {
    const db = readDB();
    res.json(db.team || []);
  });

  app.post("/api/admin/team", authMiddleware, (req, res) => {
    const db = readDB();
    if (!db.team) db.team = [];
    const newMember = {
      id: "tm_" + Date.now(),
      avatar: req.body.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      fullName: req.body.fullName || "Thành viên mới",
      email: req.body.email || "",
      department: req.body.department || "Văn phòng",
      position: req.body.position || "",
      order: req.body.order || (db.team.length + 1)
    };
    db.team.push(newMember);
    writeDB(db);
    res.json({ success: true, teamMember: newMember });
  });

  app.put("/api/admin/team/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const db = readDB();
    if (!db.team) db.team = [];
    const idx = db.team.findIndex((t: any) => t.id === id);
    if (idx !== -1) {
      db.team[idx] = { ...db.team[idx], ...req.body };
      writeDB(db);
      return res.json({ success: true, teamMember: db.team[idx] });
    }
    return res.status(404).json({ error: "Không tìm thấy thành viên đội ngũ." });
  });

  app.delete("/api/admin/team/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const db = readDB();
    if (!db.team) db.team = [];
    const filtered = db.team.filter((t: any) => t.id !== id);
    if (filtered.length !== db.team.length) {
      db.team = filtered;
      writeDB(db);
      return res.json({ success: true });
    }
    return res.status(404).json({ error: "Không tìm thấy thành viên đội ngũ." });
  });

  // CRUD Work Items
  app.get("/api/admin/work", authMiddleware, (req, res) => {
    const db = readDB();
    res.json(db.work || []);
  });

  app.post("/api/admin/work", authMiddleware, (req, res) => {
    const db = readDB();
    if (!db.work) db.work = [];
    const newWork = {
      id: "w_" + Date.now(),
      image: req.body.image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
      customerName: req.body.customerName || "Khách hàng mới",
      application: req.body.application || "Ứng dụng sản phẩm",
      stylePreset: req.body.stylePreset || "default",
      order: req.body.order || (db.work.length + 1)
    };
    db.work.push(newWork);
    writeDB(db);
    res.json({ success: true, workItem: newWork });
  });

  app.put("/api/admin/work/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const db = readDB();
    if (!db.work) db.work = [];
    const idx = db.work.findIndex((w: any) => w.id === id);
    if (idx !== -1) {
      db.work[idx] = { ...db.work[idx], ...req.body };
      writeDB(db);
      return res.json({ success: true, workItem: db.work[idx] });
    }
    return res.status(404).json({ error: "Không tìm thấy hạng mục công việc." });
  });

  app.delete("/api/admin/work/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const db = readDB();
    if (!db.work) db.work = [];
    const filtered = db.work.filter((w: any) => w.id !== id);
    if (filtered.length !== db.work.length) {
      db.work = filtered;
      writeDB(db);
      return res.json({ success: true });
    }
    return res.status(404).json({ error: "Không tìm thấy hạng mục công việc." });
  });

  // Update Section Background Colors
  app.put("/api/admin/sectionBgColors", authMiddleware, (req, res) => {
    const db = readDB();
    db.sectionBgColors = { ...db.sectionBgColors, ...req.body };
    writeDB(db);
    res.json({ success: true, sectionBgColors: db.sectionBgColors });
  });

  // CRUD Banner
  app.get("/api/admin/banners", authMiddleware, (req, res) => {
    const db = readDB();
    res.json(db.banners);
  });

  app.post("/api/admin/banners", authMiddleware, (req, res) => {
    const db = readDB();
    const newBanner = {
      id: "b_" + Date.now(),
      title: req.body.title || "Banner mới",
      description: req.body.description || "Mô tả banner mới",
      buttonText: req.body.buttonText || "Liên hệ",
      buttonLink: req.body.buttonLink || "#contact",
      secondaryButtonText: req.body.secondaryButtonText || "",
      secondaryButtonLink: req.body.secondaryButtonLink || "",
      image: req.body.image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
      isVisible: req.body.isVisible !== undefined ? req.body.isVisible : true,
      order: req.body.order || (db.banners.length + 1)
    };
    db.banners.push(newBanner);
    writeDB(db);
    res.json({ success: true, banner: newBanner });
  });

  app.put("/api/admin/banners/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const idx = db.banners.findIndex((b: any) => b.id === id);
    if (idx !== -1) {
      db.banners[idx] = { ...db.banners[idx], ...req.body };
      writeDB(db);
      return res.json({ success: true, banner: db.banners[idx] });
    }
    return res.status(404).json({ error: "Không tìm thấy Banner." });
  });

  app.delete("/api/admin/banners/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const filtered = db.banners.filter((b: any) => b.id !== id);
    if (filtered.length !== db.banners.length) {
      db.banners = filtered;
      writeDB(db);
      return res.json({ success: true });
    }
    return res.status(404).json({ error: "Không tìm thấy Banner." });
  });

  // CRUD Services
  app.get("/api/admin/services", authMiddleware, (req, res) => {
    const db = readDB();
    res.json(db.services);
  });

  app.post("/api/admin/services", authMiddleware, (req, res) => {
    const db = readDB();
    const newService = {
      id: "s_" + Date.now(),
      name: req.body.name || "Dịch vụ mới",
      description: req.body.description || "Mô tả dịch vụ mới",
      icon: req.body.icon || "Printer",
      image: req.body.image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
      isVisible: req.body.isVisible !== undefined ? req.body.isVisible : true,
      order: req.body.order || (db.services.length + 1)
    };
    db.services.push(newService);
    writeDB(db);
    res.json({ success: true, service: newService });
  });

  app.put("/api/admin/services/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const idx = db.services.findIndex((s: any) => s.id === id);
    if (idx !== -1) {
      db.services[idx] = { ...db.services[idx], ...req.body };
      writeDB(db);
      return res.json({ success: true, service: db.services[idx] });
    }
    return res.status(404).json({ error: "Không tìm thấy dịch vụ." });
  });

  app.delete("/api/admin/services/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const filtered = db.services.filter((s: any) => s.id !== id);
    if (filtered.length !== db.services.length) {
      db.services = filtered;
      writeDB(db);
      return res.json({ success: true });
    }
    return res.status(404).json({ error: "Không tìm thấy dịch vụ." });
  });

  // CRUD Brands
  app.get("/api/admin/brands", authMiddleware, (req, res) => {
    const db = readDB();
    res.json(db.brands);
  });

  app.post("/api/admin/brands", authMiddleware, (req, res) => {
    const db = readDB();
    const newBrand = {
      id: "br_" + Date.now(),
      name: req.body.name || "Đối tác mới",
      logo: req.body.logo || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&h=80&q=80",
      isVisible: req.body.isVisible !== undefined ? req.body.isVisible : true,
      order: req.body.order || (db.brands.length + 1)
    };
    db.brands.push(newBrand);
    writeDB(db);
    res.json({ success: true, brand: newBrand });
  });

  app.put("/api/admin/brands/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const idx = db.brands.findIndex((b: any) => b.id === id);
    if (idx !== -1) {
      db.brands[idx] = { ...db.brands[idx], ...req.body };
      writeDB(db);
      return res.json({ success: true, brand: db.brands[idx] });
    }
    return res.status(404).json({ error: "Không tìm thấy Đối tác." });
  });

  app.delete("/api/admin/brands/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const filtered = db.brands.filter((b: any) => b.id !== id);
    if (filtered.length !== db.brands.length) {
      db.brands = filtered;
      writeDB(db);
      return res.json({ success: true });
    }
    return res.status(404).json({ error: "Không tìm thấy Đối tác." });
  });

  // CRUD Gallery
  app.get("/api/admin/gallery", authMiddleware, (req, res) => {
    const db = readDB();
    res.json(db.gallery);
  });

  app.post("/api/admin/gallery", authMiddleware, (req, res) => {
    const db = readDB();
    const newGalleryItem = {
      id: "g_" + Date.now(),
      title: req.body.title || "Hình ảnh mới",
      image: req.body.image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
    };
    db.gallery.push(newGalleryItem);
    writeDB(db);
    res.json({ success: true, galleryItem: newGalleryItem });
  });

  app.put("/api/admin/gallery/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const idx = db.gallery.findIndex((g: any) => g.id === id);
    if (idx !== -1) {
      db.gallery[idx] = { ...db.gallery[idx], ...req.body };
      writeDB(db);
      return res.json({ success: true, galleryItem: db.gallery[idx] });
    }
    return res.status(404).json({ error: "Không tìm thấy ảnh thư viện." });
  });

  app.delete("/api/admin/gallery/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const filtered = db.gallery.filter((g: any) => g.id !== id);
    if (filtered.length !== db.gallery.length) {
      db.gallery = filtered;
      writeDB(db);
      return res.json({ success: true });
    }
    return res.status(404).json({ error: "Không tìm thấy ảnh thư viện." });
  });

  // Contacts management
  app.get("/api/admin/contacts", authMiddleware, (req, res) => {
    const db = readDB();
    res.json(db.contacts);
  });

  app.put("/api/admin/contacts/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const idx = db.contacts.findIndex((c: any) => c.id === id);
    if (idx !== -1) {
      db.contacts[idx].isProcessed = req.body.isProcessed !== undefined ? req.body.isProcessed : true;
      writeDB(db);
      return res.json({ success: true, contact: db.contacts[idx] });
    }
    return res.status(404).json({ error: "Không tìm thấy liên hệ." });
  });

  app.delete("/api/admin/contacts/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const filtered = db.contacts.filter((c: any) => c.id !== id);
    if (filtered.length !== db.contacts.length) {
      db.contacts = filtered;
      writeDB(db);
      return res.json({ success: true });
    }
    return res.status(404).json({ error: "Không tìm thấy liên hệ." });
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Full-stack Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Server failure:", err);
});
