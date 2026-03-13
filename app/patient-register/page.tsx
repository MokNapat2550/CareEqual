'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Loader2, CheckCircle, ShieldAlert, PhoneCall, Camera, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function PublicRegistrationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    idCard: "",
    fullName: "",
    age: "",
    gender: "",
    bloodType: "",
    allergies: "",
    underlying: "",
    medications: "",
    medicalDevices: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    profileImage: "" // 🟢 เพิ่ม State สำหรับเก็บรูปภาพ (Base64)
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟢 ฟังก์ชันจัดการเมื่อผู้ใช้อัปโหลดรูป
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // เช็คขนาดไฟล์ไม่ให้เกิน 2MB 
      if (file.size > 2 * 1024 * 1024) {
        alert("ขนาดไฟล์รูปภาพต้องไม่เกิน 2MB ครับ");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        // แปลงรูปเป็น Base64 แล้วเก็บลง State
        setFormData({ ...formData, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      /* 🟢 ตรงนี้เรียกใช้ API หรือ Server Action ของคุณ
        ข้อมูล formData ตอนนี้จะมี profileImage ที่เป็น String (Base64) ส่งไปด้วยแล้ว
      */
      
      // ตัวอย่างการจำลองการบันทึกข้อมูล
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🌟 หน้าจอเมื่อบันทึกข้อมูลสำเร็จ
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-white p-10 rounded-[2rem] shadow-xl max-w-md w-full text-center space-y-5 border border-slate-100">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle size={48} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">ลงทะเบียนสำเร็จ!</h2>
          <p className="text-slate-500 font-medium leading-relaxed text-sm">
            ข้อมูลสุขภาพฉุกเฉินของคุณถูกบันทึกเข้าสู่ระบบกลางแล้ว<br/>หากเกิดเหตุฉุกเฉิน ทีมแพทย์และกู้ภัยจะสามารถดึงข้อมูลนี้ไปช่วยเหลือคุณได้ทันที
          </p>
          <div className="pt-4">
            <Button onClick={() => router.push('/')} className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl font-bold text-base shadow-lg shadow-blue-200 transition-all active:scale-95">
              กลับสู่หน้าหลัก
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 🌟 หน้าจอแบบฟอร์มลงทะเบียน
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans">
      {/* Navbar สำหรับประชาชน */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <div className="flex items-center ">
             <img className=" mt-2 h-28 w-auto object-contain" src="/logo/logo.png" alt="CareEqual Logo" />
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-black text-slate-800">ลงทะเบียนข้อมูลแพทย์ฉุกเฉิน</h1>
          <p className="text-slate-500 font-medium mt-2 text-sm sm:text-base">
            กรุณากรอกข้อมูลตามความเป็นจริง เพื่อประโยชน์สูงสุดในการรักษาพยาบาลยามฉุกเฉิน
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 🌟 Section ใหม่: อัปโหลดรูปโปรไฟล์ */}
          <div className="flex flex-col items-center justify-center mb-8 pt-4">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-slate-50 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-100">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-slate-300" />
                )}
              </div>
              
              {/* ปุ่มกล้องถ่ายรูปทับซ้อนอยู่ด้านบน */}
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
          </div>

          {/* 🟦 หมวดที่ 1: ข้อมูลส่วนตัวพื้นฐาน */}
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
             <CardHeader className="bg-blue-50/50 border-b border-blue-100 px-6 py-4 flex flex-row items-center gap-3">
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

          {/* Section 2: ข้อมูลการแพทย์ */}
          <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
            <CardHeader className="bg-red-50/50 border-b border-red-100 px-6 py-4 flex flex-row items-center gap-3">
              <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                <ShieldAlert size={18} />
              </div>
              <CardTitle className="text-lg font-black text-red-900">ประวัติการแพ้ และโรคประจำตัว</CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">ประวัติการแพ้ยา / แพ้อาหาร</label>
                <input name="allergies" value={formData.allergies} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl h-12 px-4 outline-none focus:border-red-500 focus:bg-white transition-all font-bold text-slate-800 placeholder-slate-400" placeholder="ระบุการแพ้ หรือ 'ปฏิเสธการแพ้'" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">โรคประจำตัว</label>
                <input name="underlying" value={formData.underlying} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl h-12 px-4 outline-none focus:border-red-500 focus:bg-white transition-all font-bold text-slate-800 placeholder-slate-400" placeholder="เช่น เบาหวาน, ความดันสูง หรือ '-'" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">ยาที่ใช้ประจำ</label>
                <input name="medications" value={formData.medications} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl h-12 px-4 outline-none focus:border-red-500 focus:bg-white transition-all font-bold text-slate-800 placeholder-slate-400" placeholder="ระบุชื่อยา หรือ '-'" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">อุปกรณ์การแพทย์ในร่างกาย</label>
                <input name="medicalDevices" value={formData.medicalDevices} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl h-12 px-4 outline-none focus:border-red-500 focus:bg-white transition-all font-bold text-slate-800 placeholder-slate-400" placeholder="เช่น เครื่องกระตุ้นหัวใจ, โลหะดามกระดูก หรือ '-'" />
              </div>
            </CardContent>
          </Card>

          {/* Section 3: ติดต่อฉุกเฉิน */}
          <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
            <CardHeader className="bg-emerald-50/50 border-b border-emerald-100 px-6 py-4 flex flex-row items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                <PhoneCall size={18} />
              </div>
              <CardTitle className="text-lg font-black text-emerald-900">ผู้ติดต่อยามฉุกเฉิน</CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">ชื่อผู้ติดต่อฉุกเฉิน *</label>
                <input required name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl h-12 px-4 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-800" placeholder="ระบุชื่อ และความสัมพันธ์" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">เบอร์โทรศัพท์ติดต่อฉุกเฉิน *</label>
                <input required name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value.replace(/[^0-9-]/g, "") })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl h-12 px-4 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-800" placeholder="08X-XXX-XXXX" />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="pt-4 pb-12">
            <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 h-16 rounded-[2rem] font-black text-lg shadow-xl shadow-blue-200 transition-all active:scale-95 gap-3">
              {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
              บันทึกข้อมูลเข้าสู่ระบบกลาง Careequal
            </Button>
            <p className="text-center text-xs font-bold text-slate-400 mt-4 uppercase tracking-widest">
              ข้อมูลของคุณจะถูกรักษาเป็นความลับ และใช้เพื่อการแพทย์ฉุกเฉินเท่านั้น
            </p>
          </div>
        </form>

      </main>
    </div>
  );
}