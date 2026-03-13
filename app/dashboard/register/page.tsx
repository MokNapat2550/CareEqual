'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, User, Activity, Phone, AlertTriangle, Loader2, Camera, ChevronLeft } from "lucide-react"; 
import { createPatient } from "@/app/actions/patient";
import Link from "next/link";

export default function NewPatientPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // 1. State สำหรับเก็บรูปภาพ (Base64)
  const [profileImage, setProfileImage] = useState<string>("");

  // 2. ฟังก์ชันจัดการเมื่อผู้ใช้อัปโหลดรูป
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("ขนาดไฟล์รูปภาพต้องไม่เกิน 2MB ครับ");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const fullName = formData.get("fullName") as string;
    const idCard = formData.get("idCard") as string;
    const bloodType = formData.get("bloodType") as string;
    const gender = formData.get("gender") as string; 

    if (!fullName.trim()) return toast.error("กรุณาระบุชื่อ-นามสกุลผู้ป่วย");
    if (idCard.length !== 13) return toast.error("กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก");
    if (!bloodType.trim()) return toast.error("กรุณาระบุกรุ๊ปเลือด");
    if (!gender) return toast.error("กรุณาเลือกเพศ");

    const userString = localStorage.getItem("user");
    if (!userString) {
      return toast.error("ไม่พบข้อมูลการล็อกอิน กรุณาล็อกอินใหม่");
    }

    setIsLoading(true);
    
    try {
      const currentUser = JSON.parse(userString);
      const result = await createPatient(formData, currentUser.id);
      
      if (result.error) {
        toast.error(result.error);
        setIsLoading(false);
      } else {
        toast.success("บันทึกข้อมูลและสร้าง QR Code สำเร็จ!");
        router.push("/dashboard"); 
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการประมวลผลข้อมูลผู้ใช้");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* 🔙 Header Section: จัดวางปุ่มย้อนกลับและหัวข้อ */}
        <div className="relative flex items-center justify-center mb-12">
          {/* ปุ่มย้อนกลับ (อยู่ซ้ายสุดแบบ Absolute) */}
          <div className="absolute left-0">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 text-slate-400 hover:text-white-600 transition-all group"
            >
              <div className="p-2 rounded-xl  shadow-sm transition-colors">
                <ChevronLeft size={20} />
              </div>
              <span className="font-bold text-sm hidden sm:inline">ย้อนกลับ</span>
            </Link>
          </div>

          {/* หัวข้อ (อยู่ตรงกลางเสมอ) */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
              ลงทะเบียนผู้ป่วยใหม่
            </h1>
            <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">
              บันทึกข้อมูลฉุกเฉินและออก Careequal QR Code
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-8">

            {/* 🌟 Section: อัปโหลดรูปโปรไฟล์ */}
            <div className="flex flex-col items-center justify-center pb-4">
              <div className="relative group">
                <div className="w-36 h-36 rounded-[2.5rem] border-4 border-white shadow-2xl bg-white flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-100">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={56} className="text-slate-200" />
                  )}
                </div>
                
                <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-600 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 hover:scale-110 transition-all active:scale-95">
                  <Camera size={20} className="text-white" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload} 
                  />
                </label>
              </div>
              <p className="text-[10px] font-black text-slate-400 mt-6 uppercase tracking-[0.2em]">
                รูปถ่ายยืนยันตัวตน (ไม่เกิน 2MB)
              </p>
              <input type="hidden" name="profileImage" value={profileImage} />
            </div>
            
            {/* 🟦 หมวดที่ 1: ข้อมูลส่วนตัวพื้นฐาน */}
            <Card className="border-none shadow-xl shadow-blue-100 rounded-[2.5rem] overflow-hidden border-2 border-blue-50">
              <div className="h-1.5 bg-blue-500" />
              <CardHeader className="bg-white/50 pb-4 border-b border-slate-50 flex flex-row items-center gap-4 p-8">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-sm"><User size={24} /></div>
                <CardTitle className="text-2xl font-black text-slate-800">ข้อมูลระบุตัวตน</CardTitle>
              </CardHeader>
              <CardContent className="bg-white p-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-2">
                  <Label className="font-black text-slate-500 text-xs uppercase tracking-widest ml-1">ชื่อ-นามสกุล</Label>
                  <Input name="fullName" required className="w-full h-14 bg-slate-50/50 rounded-2xl border-slate-100 text-lg px-5 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold" placeholder="เช่น นายสมชาย รักดี" />
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-slate-500 text-xs uppercase tracking-widest ml-1">เลขประจำตัวประชาชน</Label>
                  <Input name="idCard" type="text" maxLength={13} required className="w-full h-14 bg-slate-50/50 rounded-2xl border-slate-100 text-lg font-mono px-5 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold" placeholder="1234567890123" />
                </div>
                
                <div className="space-y-2">
                  <Label className="font-black text-slate-500 text-xs uppercase tracking-widest ml-1">เบอร์โทรศัพท์ผู้ป่วย</Label>
                  <Input name="phoneNumber" type="tel" maxLength={10} className="w-full h-14 bg-slate-50/50 rounded-2xl border-slate-100 text-lg px-5 focus:ring-4 focus:ring-blue-500/5 transition-all font-mono font-bold" placeholder="08XXXXXXXX" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-black text-slate-500 text-xs uppercase tracking-widest ml-1">อายุ (ปี)</Label>
                    <Input name="age" type="number" required className="w-full h-14 bg-slate-50/50 rounded-2xl border-slate-100 text-lg px-5 focus:ring-4 focus:ring-blue-500/5 font-bold" placeholder="45" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-black text-slate-500 text-xs uppercase tracking-widest ml-1">เพศ</Label>
                    <Select name="gender" defaultValue="ชาย">
                      <SelectTrigger className="w-full h-14 bg-slate-50/50 border-slate-100 rounded-2xl text-lg px-5 focus:ring-4 focus:ring-blue-500/5 font-bold">
                        <SelectValue placeholder="เลือกเพศ" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl shadow-2xl border-none">
                        <SelectItem value="ชาย">ชาย</SelectItem>
                        <SelectItem value="หญิง">หญิง</SelectItem>
                        <SelectItem value="อื่นๆ">อื่นๆ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="font-black text-slate-500 text-xs uppercase tracking-widest ml-1">ที่อยู่ปัจจุบัน</Label>
                  <Input name="address" className="w-full h-14 bg-slate-50/50 rounded-2xl border-slate-100 text-lg px-5 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold" placeholder="ระบุที่อยู่เพื่อการส่งต่อข้อมูล" />
                </div>

                <div className="grid grid-cols-3 gap-4 md:col-span-2">
                  <div className="space-y-2">
                    <Label className="font-black text-slate-500 text-xs uppercase tracking-widest ml-1">เชื้อชาติ</Label>
                    <Input name="race" defaultValue="ไทย" className="w-full h-14 bg-slate-50/50 rounded-2xl border-slate-100 text-base px-5 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-black text-slate-500 text-xs uppercase tracking-widest ml-1">สัญชาติ</Label>
                    <Input name="nationality" defaultValue="ไทย" className="w-full h-14 bg-slate-50/50 rounded-2xl border-slate-100 text-base px-5 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-black text-slate-500 text-xs uppercase tracking-widest ml-1">ศาสนา</Label>
                    <Input name="religion" defaultValue="พุทธ" className="w-full h-14 bg-slate-50/50 rounded-2xl border-slate-100 text-base px-5 font-bold" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 🟥 หมวดที่ 2: ข้อมูลวิกฤตทางการแพทย์ */}
            <Card className="border-none shadow-xl shadow-red-100 rounded-[2.5rem] overflow-hidden border-2 border-red-50">
              <div className="h-1.5 bg-red-500" />
              <CardHeader className="bg-red-50/30 pb-4 border-b border-red-50 flex flex-row items-center gap-4 p-8">
                <div className="p-3 bg-red-100 text-red-600 rounded-2xl shadow-sm"><Activity size={24} /></div>
                <div>
                  <CardTitle className="text-2xl font-black text-slate-800 tracking-tight">ข้อมูลวิกฤตทางการแพทย์</CardTitle>
                  <CardDescription className="text-red-500 font-bold mt-1">ข้อมูลสำคัญสำหรับกู้ภัยและแพทย์สนาม</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="bg-white p-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-2">
                  <Label className="font-black text-slate-500 text-xs uppercase tracking-widest ml-1">กรุ๊ปเลือด (ABO/Rh)</Label>
                  <Input name="bloodType" required className="w-full h-14 bg-red-50/30 rounded-2xl border-none font-black text-red-600 uppercase text-xl px-5 focus:ring-4 focus:ring-red-500/10 transition-all" placeholder="เช่น O POSITIVE" />
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-red-600 text-xs uppercase tracking-widest flex items-center gap-2 ml-1">
                    <AlertTriangle size={14} /> ประวัติแพ้ยา / แพ้อาหาร
                  </Label>
                  <Input name="allergies" className="w-full h-14 bg-red-50 rounded-2xl border-none text-red-700 font-black text-lg px-5 focus:ring-4 focus:ring-red-500/10 transition-all" placeholder="หากไม่มีให้ใส่ 'ปฏิเสธการแพ้ยา'" />
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-slate-500 text-xs uppercase tracking-widest ml-1">โรคประจำตัว</Label>
                  <Input name="underlying" className="w-full h-14 bg-slate-50 rounded-2xl border-none text-lg px-5 font-bold" placeholder="เช่น เบาหวาน, ความดัน" />
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-slate-500 text-xs uppercase tracking-widest ml-1">ยาที่ใช้ประจำ</Label>
                  <Input name="medications" className="w-full h-14 bg-slate-50 rounded-2xl border-none text-lg px-5 font-bold" placeholder="ชื่อยาและขนาดยา" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="font-black text-slate-500 text-xs uppercase tracking-widest ml-1">อุปกรณ์ทางการแพทย์เสริมในร่างกาย</Label>
                  <Input name="medicalDevices" className="w-full h-14 bg-slate-50 rounded-2xl border-none text-lg px-5 font-bold" placeholder="Pacemaker, เหล็กดาม ฯลฯ" />
                </div>
              </CardContent>
            </Card>

            {/* 🟩 หมวดที่ 3: ข้อมูลติดต่อฉุกเฉิน */}
            <Card className="border-none shadow-xl shadow-emerald-100 rounded-[2.5rem] overflow-hidden">
              <div className="h-1.5 bg-emerald-500" />
              <CardHeader className="bg-emerald-50/30 pb-4 border-b border-slate-50 flex flex-row items-center gap-4 p-8">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl shadow-sm"><Phone size={24} /></div>
                <CardTitle className="text-2xl font-black text-slate-800">ผู้ติดต่อฉุกเฉิน</CardTitle>
              </CardHeader>
              <CardContent className="bg-white p-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-2">
                  <Label className="font-black text-slate-500 text-xs uppercase tracking-widest ml-1">ชื่อผู้ติดต่อ (ญาติ)</Label>
                  <Input name="emergencyContactName" required className="w-full h-14 bg-slate-50 rounded-2xl border-none text-lg px-5 font-bold" placeholder="ระบุชื่อจริง-นามสกุล" />
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-slate-500 text-xs uppercase tracking-widest ml-1">เบอร์โทรศัพท์ติดต่อด่วน</Label>
                  <Input name="emergencyContactPhone" required maxLength={10} className="w-full h-14 bg-slate-50 rounded-2xl border-none text-lg px-5 font-black text-emerald-700 font-mono" placeholder="08XXXXXXXX" />
                </div>
              </CardContent>
            </Card>

            {/* 🚀 ปุ่มส่งข้อมูล */}
            <div className="pt-6 pb-20">
              <Button 
                disabled={isLoading} 
                className="w-full h-20 rounded-[2rem] text-2xl font-black bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <><Loader2 className="animate-spin" size={28} /> กำลังออกรหัส QR...</>
                ) : (
                  <><Save size={28} /> บันทึกและสร้าง QR Code</>
                )}
              </Button>
            </div>
            
          </div>
        </form>
      </div>
    </div>
  );
}