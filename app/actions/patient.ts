'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client"; 

// ==========================================
// 1. ฟังก์ชันสร้างผู้ป่วยใหม่ (รับรูป Base64 ได้)
// ==========================================
export async function createPatient(formData: FormData, staffId: string) {
  try {
    if (!staffId) return { error: "ไม่พบข้อมูลผู้ล็อกอิน" };

    // 🟢 ดึงข้อมูล Base64 ที่ซ่อนไว้ในฟอร์มมาใช้
    const profileImageBase64 = formData.get("profileImage") as string;

    const data = {
      fullName: formData.get("fullName") as string,
      idCard: formData.get("idCard") as string,
      age: parseInt(formData.get("age") as string, 10),
      gender: formData.get("gender") as string,
      bloodType: formData.get("bloodType") as string,
      allergies: formData.get("allergies") as string || "ปฏิเสธการแพ้ยา",
      underlying: formData.get("underlying") as string || "-",
      medications: formData.get("medications") as string || "-",
      medicalDevices: formData.get("medicalDevices") as string || "-",
      emergencyContactName: formData.get("emergencyContactName") as string,
      emergencyContactPhone: formData.get("emergencyContactPhone") as string,
      creatorId: staffId, 
      
      phoneNumber: formData.get("phoneNumber") as string || "-",
      address: formData.get("address") as string || "-",
      race: formData.get("race") as string || "ไทย",
      nationality: formData.get("nationality") as string || "ไทย",
      religion: formData.get("religion") as string || "-",
      
      // 🟢 บันทึกรูปลงในฟิลด์ imageUrl
      imageUrl: profileImageBase64 || null, 
    };

    const newPatient = await prisma.patient.create({ data });
    
    revalidatePath("/dashboard");

    return { success: true, qrToken: newPatient.qrToken };
    
  } catch (error) {
    console.error("🚨 Create Patient Error:", error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') return { error: "เลขบัตรประชาชนนี้ถูกลงทะเบียนในระบบแล้ว" };
      if (error.code === 'P2003') return { error: "เซสชันหมดอายุ กรุณาล็อกอินใหม่" };
    }

    return { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง" };
  }
}

// ==========================================
// 2. ฟังก์ชันดึงประวัติผู้ป่วย (สำหรับเจ้าหน้าที่)
// ==========================================
export async function getRecentPatients(staffId: string) {
  try {
    if (!staffId) return { error: "ไม่พบข้อมูลผู้ล็อกอิน", data: [] };

    const patients = await prisma.patient.findMany({
      where: { creatorId: staffId }, 
      orderBy: { createdAt: 'desc' },
      include: { creator: true },
    });
    
    return { success: true, data: patients };
  } catch (error) {
    console.error("Get Patients Error:", error);
    return { error: "ไม่สามารถดึงข้อมูลผู้ป่วยได้", data: [] }; 
  }
}

// ==========================================
// 3. ฟังก์ชันค้นหาด้วยเลขบัตรประชาชน (สำหรับกู้ภัย)
// ==========================================
export async function getPatientByIdCard(idCard: string, staffId: string) {
  try {
    const patient = await prisma.patient.findFirst({
      where: { 
        idCard: idCard,
      }
    });
    
    if (!patient) return { error: "ไม่พบข้อมูลผู้ป่วยรายนี้" };
    return { success: true, data: patient };
  } catch (error) {
    return { error: "เกิดข้อผิดพลาดในการค้นหา" };
  }
}