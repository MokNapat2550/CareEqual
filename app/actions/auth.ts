'use server';

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

// 🟢 ฟังก์ชันสมัครสมาชิก (Register)
export async function registerUser(formData: FormData) {
  try {
    const rawUsername = formData.get("username") as string;
    // 🔥 บังคับเป็นตัวพิมพ์ใหญ่และตัดช่องว่างเสมอ
    const username = rawUsername.trim().toUpperCase(); 
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    
    const role = formData.get("role") as Role; 
    const licenseId = formData.get("licenseId") as string;
    const organization = formData.get("organization") as string;
    const phone = formData.get("phone") as string;

    const existingUser = await prisma.user.findUnique({
      where: { username: username }
    });

    if (existingUser) {
      return { error: "ชื่อผู้ใช้งาน (Staff ID) นี้ถูกใช้ไปแล้ว" };
    }

    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: password,
        fullName: fullName.trim(),
        role: role, 
        licenseId: licenseId.trim(),
        organization: organization.trim(),
        phone: phone.trim()
      }
    });

    return { success: true, user: newUser };
  } catch (error) {
    console.error("Register Error:", error);
    return { error: "เกิดข้อผิดพลาดในการสมัครสมาชิก" };
  }
}

// 🔵 ฟังก์ชันเข้าสู่ระบบ (Login)
export async function loginUser(formData: FormData) {
  try {
    const rawUsername = formData.get("username") as string;
    // 🔥 บังคับเป็นตัวพิมพ์ใหญ่ก่อนเอาไปค้นหาใน Database
    const username = rawUsername.trim().toUpperCase(); 
    const password = formData.get("password") as string;
    const role = formData.get("role") as Role; 

    const user = await prisma.user.findUnique({
      where: { username: username }
    });

    // เช็คว่ามี User ไหม และรหัสตรงไหม
    if (!user || user.password !== password) {
      return { error: "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง" };
    }
    
    // เช็คว่าเข้าถูกแผนกไหม
    if (user.role !== role) {
      return { error: "คุณไม่มีสิทธิ์เข้าใช้งานในตำแหน่งนี้" };
    }

    return { success: true, user: user };
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "เกิดข้อผิดพลาดในการเชื่อมต่อ" };
  }
}