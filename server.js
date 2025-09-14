const jsonServer = require("json-server");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Cloudinary config (env o‘zgaruvchilar orqali saqlash ma’qul)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Multer storage — Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads", // Cloudinary ichida papka nomi
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
  },
});
const upload = multer({ storage });

// Upload endpoint
server.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ error: "Rasm yuklanmadi" });
  }
  res.json({ url: req.file.path }); // Cloudinary rasm URL
});

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
