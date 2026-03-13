'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// 🟢 เพิ่ม Camera เข้ามาที่นี่
import { Save, User, Activity, Phone, AlertTriangle, Loader2, Camera } from "lucide-react"; 
import { createPatient } from "@/app/actions/patient";

export default function NewPatientPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // 🟢 1. เพิ่ม State สำหรับเก็บรูปภาพ (Base64)
  const [profileImage, setProfileImage] = useState<string>("");

  // 🟢 2. ฟังก์ชันจัดการเมื่อผู้ใช้อัปโหลดรูป
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
        toast.success("บันห์ทึกข้อมูลและสร้าง QR Code สำเร็จ!");
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
        
        <div className="mb-8 flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-3xl font-black text-slate-800">ลงทะเบียนผู้ป่วยใหม่</h1>
            <p className="text-slate-500 font-medium">บันทึกข้อมูลฉุกเฉินและออก Careequal QR Code</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-8">

            {/* 🌟 3. Section ใหม่: อัปโหลดรูปโปรไฟล์ */}
            <div className="flex flex-col items-center justify-center pt-4">
              <div className="relative group cursor-pointer">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-slate-50 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-100">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-slate-300" />
                  )}
                </div>
                
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow-sm flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera size={16} className="text-white" />
                  <input 
                    type="file" 
                    accept="image/jpeg, image/png, image/webp" 
                    className="hidden" 
                    onChange={handleImageUpload} 
                  />
                </label>
              </div>
              <p className="text-xs font-bold text-slate-400 mt-4 uppercase tracking-widest">
                รูปถ่ายหน้าตรง (ไม่เกิน 2MB)
              </p>
              
              {/* 🟢 ซ่อน Base64 เอาไว้ เพื่อให้ FormData ดูดค่าส่งไปหลังบ้านได้โดยอัตโนมัติ */}
              <input type="hidden" name="profileImage" value={profileImage} />
            </div>
            
            {/* 🟦 หมวดที่ 1: ข้อมูลส่วนตัวพื้นฐาน */}
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <div className="h-1.5 bg-blue-500" />
              <CardHeader className="bg-white pb-4 border-b border-slate-50 flex flex-row items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><User size={22} /></div>
                <CardTitle className="text-xl font-bold text-slate-800">ข้อมูลระบุตัวตนพื้นฐาน</CardTitle>
              </CardHeader>
              <CardContent className="bg-white pt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-600 ml-1">ชื่อ-นามสกุล</Label>
                  <Input name="fullName" required className="w-full h-14 bg-slate-50 rounded-xl border-none text-lg px-4 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="เช่น นายสมชาย รักดี" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-slate-600 ml-1">เลขประจำตัวประชาชน (13 หลัก)</Label>
                  <Input name="idCard" type="text" maxLength={13} required className="w-full h-14 bg-slate-50 rounded-xl border-none text-lg font-mono px-4 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="1234567890123" />
                </div>
                
                {/* 🟢 ส่วนที่เพิ่มใหม่: เบอร์โทร และ ที่อยู่ */}
                <div className="space-y-2">
                  <Label className="font-bold text-slate-600 ml-1">เบอร์โทรศัพท์ผู้ป่วย</Label>
                  <Input name="phoneNumber" type="tel" maxLength={10} className="w-full h-14 bg-slate-50 rounded-xl border-none text-lg px-4 focus:ring-2 focus:ring-blue-100 transition-all font-mono" placeholder="08XXXXXXXX" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="font-bold text-slate-600 ml-1">ที่อยู่ปัจจุบัน</Label>
                  <Input name="address" className="w-full h-14 bg-slate-50 rounded-xl border-none text-lg px-4 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="บ้านเลขที่, หมู่, ซอย, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์" />
                </div>

                <div className="space-y-2">
                  <Label className="font-bold text-slate-600 ml-1">อายุ (ปี)</Label>
                  <Input name="age" type="number" required className="w-full h-14 bg-slate-50 rounded-xl border-none text-lg px-4 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="เช่น 45" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-slate-600 ml-1">เพศ</Label>
                  <Select name="gender" defaultValue="ชาย">
                    <SelectTrigger className="w-full h-14 bg-slate-50 border-0 rounded-xl text-lg px-4 focus:ring-2 focus:ring-blue-100 focus:ring-offset-0">
                      <SelectValue placeholder="เลือกเพศ" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-lg border-none bg-white">
                      <SelectItem value="ชาย" className="cursor-pointer">ชาย</SelectItem>
                      <SelectItem value="หญิง" className="cursor-pointer">หญิง</SelectItem>
                      <SelectItem value="อื่นๆ" className="cursor-pointer">อื่นๆ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 🟢 ส่วนที่เพิ่มใหม่: เชื้อชาติ, สัญชาติ, ศาสนา */}
                <div className="space-y-2">
                  <Label className="font-bold text-slate-600 ml-1">เชื้อชาติ</Label>
                  <Input name="race" defaultValue="ไทย" className="w-full h-14 bg-slate-50 rounded-xl border-none text-lg px-4 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="เช่น ไทย" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-slate-600 ml-1">สัญชาติ</Label>
                  <Input name="nationality" defaultValue="ไทย" className="w-full h-14 bg-slate-50 rounded-xl border-none text-lg px-4 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="เช่น ไทย" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="font-bold text-slate-600 ml-1">ศาสนา</Label>
                  <Select name="religion" defaultValue="พุทธ">
                    <SelectTrigger className="w-full h-14 bg-slate-50 border-0 rounded-xl text-lg px-4 focus:ring-2 focus:ring-blue-100 focus:ring-offset-0">
                      <SelectValue placeholder="เลือกศาสนา" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-lg border-none bg-white">
                      <SelectItem value="พุทธ" className="cursor-pointer">พุทธ</SelectItem>
                      <SelectItem value="คริสต์" className="cursor-pointer">คริสต์</SelectItem>
                      <SelectItem value="อิสลาม" className="cursor-pointer">อิสลาม</SelectItem>
                      <SelectItem value="พราหมณ์-ฮินดู" className="cursor-pointer">พราหมณ์-ฮินดู</SelectItem>
                      <SelectItem value="ซิกข์" className="cursor-pointer">ซิกข์</SelectItem>
                      <SelectItem value="ไม่มีศาสนา" className="cursor-pointer">ไม่มีศาสนา</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 🟥 หมวดที่ 2: ข้อมูลวิกฤตทางการแพทย์ */}
            <Card className="border-none shadow-md rounded-2xl overflow-hidden border-2 border-red-50">
              <div className="h-1.5 bg-red-500" />
              <CardHeader className="bg-white pb-4 border-b border-red-50 flex flex-row items-center gap-3">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-xl"><Activity size={22} /></div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800">ข้อมูลวิกฤตทางการแพทย์</CardTitle>
                  <CardDescription className="text-red-500 font-medium mt-1">ส่วนนี้จะแสดงผลตัวใหญ่บนหน้าจอกู้ภัย</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="bg-white pt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-600 ml-1">กรุ๊ปเลือด (รวม Rh)</Label>
                  <Input name="bloodType" required className="w-full h-14 bg-slate-50 rounded-xl border-none font-black text-red-600 uppercase text-lg px-4 focus:ring-2 focus:ring-red-100 transition-all" placeholder="เช่น O POSITIVE, AB NEGATIVE" />
                </div>
                <div className="space-y-2 relative">
                  <Label className="font-bold text-red-600 flex items-center gap-2 ml-1">
                    <AlertTriangle size={18} /> ประวัติแพ้ยา / แพ้อาหารรุนแรง
                  </Label>
                  <Input name="allergies" className="w-full h-14 bg-red-50/50 rounded-xl border-none text-red-700 font-bold text-lg px-4 placeholder:text-red-300 focus:ring-2 focus:ring-red-200 transition-all" placeholder="หากไม่มีให้พิมพ์ว่า 'ปฏิเสธการแพ้ยา'" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-slate-600 ml-1">โรคประจำตัว</Label>
                  <Input name="underlying" className="w-full h-14 bg-slate-50 rounded-xl border-none text-lg px-4 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="เช่น เบาหวาน, ความดันโลหิตสูง" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-slate-600 ml-1">ยาที่รับประทานประจำ</Label>
                  <Input name="medications" className="w-full h-14 bg-slate-50 rounded-xl border-none text-lg px-4 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="เช่น Aspirin (ยาละลายลิ่มเลือด)" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="font-bold text-slate-600 ml-1">อุปกรณ์ทางการแพทย์ในร่างกาย (ถ้ามี)</Label>
                  <Input name="medicalDevices" className="w-full h-14 bg-slate-50 rounded-xl border-none text-lg px-4 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="เช่น เครื่องกระตุ้นหัวใจ (Pacemaker), เหล็กดาม" />
                </div>
              </CardContent>
            </Card>

            {/* 🟩 หมวดที่ 3: ข้อมูลติดต่อฉุกเฉิน */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
              <div className="h-1.5 bg-emerald-500" />
              <CardHeader className="bg-white pb-4 border-b border-slate-50 flex flex-row items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><Phone size={22} /></div>
                <CardTitle className="text-xl font-bold text-slate-800">ผู้ติดต่อฉุกเฉิน (ญาติ)</CardTitle>
              </CardHeader>
              <CardContent className="bg-white pt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-600 ml-1">ชื่อ-นามสกุล ญาติ</Label>
                  <Input name="emergencyContactName" required className="w-full h-14 bg-slate-50 rounded-xl border-none text-lg px-4 focus:ring-2 focus:ring-emerald-100 transition-all" placeholder="ระบุชื่อผู้ติดต่อ" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-slate-600 ml-1">เบอร์โทรศัพท์ญาติ</Label>
                  <Input name="emergencyContactPhone" required maxLength={10} className="w-full h-14 bg-slate-50 rounded-xl border-none text-lg px-4 focus:ring-2 focus:ring-emerald-100 transition-all" placeholder="08XXXXXXXX" />
                </div>
              </CardContent>
            </Card>

            {/* 🚀 ปุ่ม Submit */}
            <div className="pt-4 pb-10">
              <Button disabled={isLoading} className="w-full h-16 rounded-2xl text-xl font-black bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200/50 transition-all active:scale-95 flex items-center justify-center gap-2">
                {isLoading ? (
                  <><Loader2 className="animate-spin" size={26} /> กำลังสร้าง QR Code...</>
                ) : (
                  <><Save size={26} /> บันทึกและสร้าง QR Code</>
                )}
              </Button>
            </div>
            
          </div>
        </form>
      </div>
    </div>
  );
}