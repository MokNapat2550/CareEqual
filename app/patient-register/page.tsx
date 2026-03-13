'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Save, Loader2, CheckCircle, ShieldAlert, PhoneCall, 
  Camera, User, ChevronLeft, Activity, HeartPulse, Globe2
} from "lucide-react";
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
    profileImage: "" 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("ขนาดไฟล์รูปภาพต้องไม่เกิน 2MB ครับ");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 max-w-md w-full text-center space-y-6 border border-slate-50">
          <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-2 shadow-inner">
            <CheckCircle size={48} className="text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">ลงทะเบียนสำเร็จ!</h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              ข้อมูลของคุณถูกบันทึกเข้าสู่ระบบ Careequal แล้ว ทีมกู้ภัยจะสามารถช่วยเหลือคุณได้ทันทีเมื่อเกิดเหตุ
            </p>
          </div>
          <Button onClick={() => router.push('/')} className="w-full bg-blue-600 hover:bg-blue-700 h-16 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 transition-all active:scale-95">
            กลับสู่หน้าหลัก
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      
      {/* 🧭 Navbar พร้อมปุ่มย้อนกลับด้านซ้าย และ Logo ตรงกลาง */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center relative">
          
          {/* ปุ่มย้อนกลับด้านซ้าย */}
          <div className="flex items-center z-20">
            <Link 
              href="/" 
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group"
            >
              <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* โลโก้ตรงกลางเป๊ะ */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img className="h-26 w-auto object-contain pointer-events-auto" src="/logo/logo.png" alt="CareEqual Logo" />
          </div>

          {/* ส่วนว่างด้านขวาเพื่อให้โลโก้สมดุล */}
          <div className="w-10 z-20"></div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* หัวข้อหน้า */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">ลงทะเบียนข้อมูลฉุกเฉิน</h1>
          <p className="text-slate-500 font-medium mt-2 max-w-lg mx-auto text-balance">
            สร้างประวัติสุขภาพดิจิทัลของคุณ เพื่อการเข้าถึงการรักษาที่รวดเร็วและเท่าเทียม
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 🌟 Section: อัปโหลดรูปโปรไฟล์ */}
          <div className="flex flex-col items-center justify-center pb-4">
            <div className="relative group">
              <div className="w-36 h-36 rounded-[2.5rem] border-4 border-white shadow-2xl bg-white flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-50">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={56} className="text-slate-200" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-600 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 hover:scale-110 transition-all active:scale-95">
                <Camera size={20} className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <p className="text-[10px] font-black text-slate-400 mt-6 uppercase tracking-[0.2em]">รูปถ่ายหน้าตรง (ไม่เกิน 2MB)</p>
          </div>

          {/* 🟦 หมวดที่ 1: ข้อมูลส่วนตัวพื้นฐาน */}
          <Card className="border-none shadow-xl shadow-blue-100 rounded-[2.5rem] overflow-hidden border-2 border-blue-50">
            <CardHeader className="bg-white/50 border-b border-slate-50 p-8 flex flex-row items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-sm"><User size={24} /></div>
              <CardTitle className="text-2xl font-black text-slate-800">ข้อมูลระบุตัวตน</CardTitle>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 bg-white">
              <div className="space-y-2">
                <Label className="font-black text-slate-400 text-[10px] uppercase tracking-widest ml-1">ชื่อ-นามสกุล</Label>
                <Input name="fullName" required className="h-14 bg-slate-50/50 rounded-2xl border-slate-100 text-lg font-bold px-5 focus:ring-4 focus:ring-blue-500/5 transition-all" placeholder="นายใจดี ยินดีช่วย" />
              </div>
              <div className="space-y-2">
                <Label className="font-black text-slate-400 text-[10px] uppercase tracking-widest ml-1">เลขประจำตัวประชาชน (13 หลัก)</Label>
                <Input name="idCard" maxLength={13} required className="h-14 bg-slate-50/50 rounded-2xl border-slate-100 text-lg font-mono font-bold px-5 focus:ring-4 focus:ring-blue-500/5 transition-all" placeholder="1234567890123" />
              </div>
              <div className="space-y-2">
                <Label className="font-black text-slate-400 text-[10px] uppercase tracking-widest ml-1">เบอร์โทรศัพท์</Label>
                <Input name="phoneNumber" maxLength={10} className="h-14 bg-slate-50/50 rounded-2xl border-slate-100 text-lg font-mono font-bold px-5 focus:ring-4 focus:ring-blue-500/5 transition-all" placeholder="08XXXXXXXX" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-black text-slate-400 text-[10px] uppercase tracking-widest ml-1">อายุ (ปี)</Label>
                  <Input name="age" type="number" required className="h-14 bg-slate-50/50 rounded-2xl border-slate-100 text-lg font-bold px-5" placeholder="45" />
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-slate-400 text-[10px] uppercase tracking-widest ml-1">เพศ</Label>
                  <Select name="gender" defaultValue="ชาย">
                    <SelectTrigger className="h-14 bg-slate-50/50 border-slate-100 rounded-2xl text-lg font-bold px-5">
                      <SelectValue placeholder="เลือกเพศ" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      <SelectItem value="ชาย">ชาย</SelectItem>
                      <SelectItem value="หญิง">หญิง</SelectItem>
                      <SelectItem value="อื่นๆ">อื่นๆ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="font-black text-slate-400 text-[10px] uppercase tracking-widest ml-1">ที่อยู่ตามทะเบียนบ้าน/ปัจจุบัน</Label>
                <Input name="address" className="h-14 bg-slate-50/50 rounded-2xl border-slate-100 text-lg font-bold px-5" placeholder="ระบุข้อมูลที่อยู่ที่กู้ภัยสามารถติดต่อได้" />
              </div>
              <div className="grid grid-cols-3 gap-4 md:col-span-2">
                <div className="space-y-2"><Label className="font-black text-slate-400 text-[10px] uppercase tracking-widest">เชื้อชาติ</Label><Input name="race" defaultValue="ไทย" className="h-14 bg-slate-50/50 rounded-2xl border-slate-100 font-bold" /></div>
                <div className="space-y-2"><Label className="font-black text-slate-400 text-[10px] uppercase tracking-widest">สัญชาติ</Label><Input name="nationality" defaultValue="ไทย" className="h-14 bg-slate-50/50 rounded-2xl border-slate-100 font-bold" /></div>
                <div className="space-y-2">
                  <Label className="font-black text-slate-400 text-[10px] uppercase tracking-widest ml-1">ศาสนา</Label>
                  <Select name="religion" defaultValue="พุทธ">
                    <SelectTrigger className="h-14 bg-slate-50/50 border-slate-100 rounded-2xl font-bold px-5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      <SelectItem value="พุทธ">พุทธ</SelectItem>
                      <SelectItem value="คริสต์">คริสต์</SelectItem>
                      <SelectItem value="อิสลาม">อิสลาม</SelectItem>
                      <SelectItem value="ไม่มีศาสนา">ไม่มีศาสนา</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 🟥 หมวดที่ 2: ข้อมูลการแพทย์ฉุกเฉิน */}
          <Card className="border-none shadow-xl shadow-red-100 rounded-[2.5rem] overflow-hidden border-2 border-red-50">
            <CardHeader className="bg-red-50/30 border-b border-red-50 p-8 flex flex-row items-center gap-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-2xl shadow-sm"><ShieldAlert size={24} /></div>
              <div>
                <CardTitle className="text-2xl font-black text-slate-800 tracking-tight">ประวัติสุขภาพฉุกเฉิน</CardTitle>
                <CardDescription className="text-red-600 font-bold">ข้อมูลส่วนนี้จะปรากฏทันทีเมื่อกู้ภัยทำการสแกน</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 bg-white">
              <div className="space-y-2">
                <Label className="font-black text-slate-400 text-[10px] uppercase tracking-widest ml-1">กรุ๊ปเลือด (Blood Type)</Label>
                <Input name="bloodType" required className="h-14 bg-red-50/20 border-none rounded-2xl text-xl font-black text-red-600 uppercase px-5" placeholder="เช่น O POSITIVE" />
              </div>
              <div className="space-y-2">
                <Label className="font-black text-red-600 text-[10px] uppercase tracking-widest ml-1 flex items-center gap-2">ประวัติการแพ้ยา/แพ้อาหารรุนแรง</Label>
                <Input name="allergies" value={formData.allergies} onChange={handleChange} className="h-14 bg-red-50 border-none rounded-2xl text-lg font-black text-red-700 px-5" placeholder="ระบุสิ่งที่แพ้ หรือ 'ปฏิเสธการแพ้'" />
              </div>
              <div className="space-y-2">
                <Label className="font-black text-slate-400 text-[10px] uppercase tracking-widest ml-1">โรคประจำตัว</Label>
                <Input name="underlying" value={formData.underlying} onChange={handleChange} className="h-14 bg-slate-50 border-none rounded-2xl text-lg font-bold px-5" placeholder="เบาหวาน, ความดันสูง, โรคหัวใจ ฯลฯ" />
              </div>
              <div className="space-y-2">
                <Label className="font-black text-slate-400 text-[10px] uppercase tracking-widest ml-1">ยาที่ใช้เป็นประจำ</Label>
                <Input name="medications" value={formData.medications} onChange={handleChange} className="h-14 bg-slate-50 border-none rounded-2xl text-lg font-bold px-5" placeholder="ระบุชื่อยาที่คุณต้องทานทุกวัน" />
              </div>
            </CardContent>
          </Card>

          {/* 🟩 หมวดที่ 3: ผู้ติดต่อฉุกเฉิน */}
          <Card className="border-none shadow-xl shadow-emerald-100 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-emerald-50/30 border-b border-emerald-50 p-8 flex flex-row items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl shadow-sm"><PhoneCall size={24} /></div>
              <CardTitle className="text-2xl font-black text-slate-800">ผู้ติดต่อยามฉุกเฉิน (ญาติ)</CardTitle>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 bg-white">
              <div className="space-y-2">
                <Label className="font-black text-slate-400 text-[10px] uppercase tracking-widest ml-1">ชื่อผู้ติดต่อและสถานะ (ญาติ)</Label>
                <Input required name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} className="h-14 bg-slate-50 border-none rounded-2xl text-lg font-bold px-5" placeholder="นายสมรัก (บิดา)" />
              </div>
              <div className="space-y-2">
                <Label className="font-black text-slate-400 text-[10px] uppercase tracking-widest ml-1">เบอร์โทรศัพท์ (ติดต่อด่วน)</Label>
                <Input required name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value.replace(/[^0-9-]/g, "") })} className="h-14 bg-slate-50 border-none rounded-2xl text-xl font-black text-emerald-700 font-mono px-5" placeholder="08X-XXX-XXXX" />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="pt-8 text-center">
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full h-20 bg-blue-600 hover:bg-blue-700 rounded-[2rem] font-black text-2xl shadow-2xl shadow-blue-200 transition-all active:scale-[0.98] gap-4"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={32} /> : <Save size={32} />}
              บันทึกข้อมูลสุขภาพดิจิทัล
            </Button>
            <p className="text-[10px] font-black text-slate-300 mt-6 uppercase tracking-[0.3em]">
              Careequal Security Standard &copy; 2026
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}