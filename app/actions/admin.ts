'use server';

import { prisma } from "@/lib/prisma";

// ดึงข้อมูลผู้ป่วยทั้งหมด
export async function getAllPatients() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: patients };
  } catch (error) {
    console.error(error);
    return { success: false, error: "ไม่สามารถเชื่อมต่อฐานข้อมูลได้" };
  }
}

// ลบข้อมูลผู้ป่วย
export async function deletePatient(id: string) {
  try {
    await prisma.patient.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { success: false, error: "ไม่สามารถลบข้อมูลได้" };
  }
}

export async function getAllStaff() {
  try {
    const staff = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        createdAt: true,
      }
    });
    return { success: true, data: staff };
  } catch (error) {
    console.error(error);
    return { success: false, error: "ไม่สามารถดึงข้อมูลเจ้าหน้าที่ได้" };
  }
}