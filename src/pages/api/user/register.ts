import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/client";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import multer from "multer";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import Cors from "cors";

// Konfigurasi Multer untuk upload file
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

export const config = {
  api: {
    bodyParser: false, // Harus false agar bisa menangani multipart/form-data
  },
};

// Middleware untuk menangani file upload dengan async/await
const uploadMiddleware = promisify(upload.single("profilePic"));

// Middleware CORS
const cors = Cors({
  methods: ["POST", "OPTIONS"],
  origin: "*", // Izinkan semua origin
});

// Helper untuk menjalankan middleware sebelum request diproses
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Jalankan middleware CORS sebelum request diproses
  await runMiddleware(req, res, cors);

  if (req.method !== "POST") {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    // **Proses Upload File**
    await uploadMiddleware(req as any, res as any);

    // **Debugging: Log request body & file**
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    const { password, email } = req.body;
    const profilePic = req.file ? `/uploads/${req.file.filename}` : "";

    // **Validasi input**
    if (!password || !email) {
      console.log("ERROR: Data tidak lengkap");
      return res.status(400).json({ message: "Email dan password harus diisi" });
    }

    // **Cek apakah email sudah terdaftar**
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      console.log("ERROR: Email sudah terdaftar");
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    // **Menentukan role berdasarkan email domain**
    let role: Role = Role.KASIR; // Default ke KASIR
    if (email.startsWith("manager@")) {
      role = Role.MANAGER;
    }

    // **Hash password pakai bcrypt**
    const hashedPassword = await bcrypt.hash(password, 10);

    // **Generate UUID random 7 digit (sesuai seed data)**
    const random7Digits = Math.floor(1000000 + Math.random() * 9000000).toString();

    // **Buat user baru di database**
    const newUser = await prisma.user.create({
      data: {
        uuid: random7Digits,
        role,
        password: hashedPassword,
        email,
        profilePic: profilePic || "", // Kalau kosong tetap kasih string kosong
      },
    });

    console.log("User berhasil dibuat:", newUser);

    return res.status(201).json({
      message: "User berhasil dibuat",
      data: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        uuid: newUser.uuid,
      },
    });
  } catch (error: any) {
    console.error("[REGISTER USER ERROR]", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
