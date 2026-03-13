'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { registerUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BackButton from "@/components/BackButton";
import { UserPlus, ShieldCheck, Lock, UserCircle, Building2, Phone, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // State เก็บข้อมูลทั้งหมดในฟอร์ม
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    licenseId: "",
    organization: "",
    phone: "",
    password: ""
  });

  // ฟังก์ชันกรองข้อมูลตอนพิมพ์ (Sanitization)
  const handleInput = (key: string, val: string, type: 'text' | 'number' | 'upper', limit?: number) => {
    let filtered = val;
    if (type === 'number') filtered = val.replace(/[^0-9]/g, "");
    if (type === 'text') filtered = val.replace(/[0-9]/g, "");
    if (type === 'upper') filtered = val.toUpperCase().replace(/[^A-Z0-9]/g, "");
    
    if (limit) filtered = filtered.slice(0, limit);
    
    setFormData(prev => ({ ...prev, [key]: filtered }));
  };

  // ฟังก์ชันเช็คข้อมูลก่อนส่ง (Validation ด้วย Toast)
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // ปิดการ Submit แบบปกติของ Browser

    // เช็คทีละช่อง ถ้าว่างให้เด้ง Toast เตือนแล้วหยุดการทำงาน
    if (!formData.fullName.trim()) return toast.error("กรุณาระบุชื่อ-นามสกุลจริง");
    if (!formData.username.trim()) return toast.error("กรุณาระบุรหัส Staff ID");
    if (!formData.licenseId.trim()) return toast.error("กรุณาระบุเลขใบประกอบวิชาชีพ หรือ รหัสอาสากู้ภัย");
    if (!formData.organization.trim()) return toast.error("กรุณาระบุโรงพยาบาล หรือ มูลนิธิที่สังกัด");
    if (formData.phone.length < 10) return toast.error("กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก");
    if (formData.password.length < 6) return toast.error("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");

    // ถ้าผ่านหมด ค่อยส่งข้อมูลไปหลังบ้าน
    setIsLoading(true);
    const data = new FormData(e.currentTarget);
    const result = await registerUser(data);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ");
      router.push("/login");
    }
    setIsLoading(false);
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#F8FAFC] py-12 px-4 font-sans">
      <div className="absolute top-8 left-8"><BackButton /></div>

      <Card className="w-full max-w-2xl border-none shadow-2xl shadow-blue-100 rounded-[2.5rem] bg-white overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600" />
        
        <CardHeader className="text-center pt-10 px-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus size={32} />
          </div>
          <CardTitle className="text-3xl font-black text-slate-800 tracking-tight">ลงทะเบียนเจ้าหน้าที่ใหม่</CardTitle>
          <CardDescription className="text-slate-400 font-medium mt-2">กรุณาระบุข้อมูลตามจริงเพื่อความปลอดภัยของระบบ</CardDescription>
        </CardHeader>
        
        <CardContent className="px-10">
          <Tabs defaultValue="DOCTOR" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-10 bg-slate-100 rounded-xl p-1 h-12">
              <TabsTrigger value="DOCTOR" className="rounded-lg font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-blue-600">แพทย์</TabsTrigger>
              <TabsTrigger value="NURSE" className="rounded-lg font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-blue-600">พยาบาล</TabsTrigger>
              <TabsTrigger value="RESCUER" className="rounded-lg font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-blue-600">กู้ภัย</TabsTrigger>
            </TabsList>

            {["DOCTOR", "NURSE", "RESCUER"].map(role => (
              <TabsContent key={role} value={role}>
                {/* 🔥 ใส่ noValidate ตรงนี้เพื่อปิดกล่องเตือนของ Browser */}
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <input type="hidden" name="role" value={role} />
                  
                  {/* แถวที่ 1: ชื่อ และ รหัสพนักงาน */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="ml-1 text-slate-500 font-bold">ชื่อ-นามสกุลจริง</Label>
                      <div className="relative">
                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <Input name="fullName" value={formData.fullName} onChange={(e) => handleInput('fullName', e.target.value, 'text')} className="pl-12 h-12 rounded-xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all" placeholder="ไม่ต้องใส่คำนำหน้า" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="ml-1 text-slate-500 font-bold">รหัส Staff ID (ภาษาอังกฤษ)</Label>
                      <Input name="username" value={formData.username} onChange={(e) => handleInput('username', e.target.value, 'upper', 10)} className="h-12 rounded-xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-mono uppercase" placeholder="เช่น DOC8899" />
                    </div>
                  </div>

                  {/* แถวที่ 2: เลขใบอนุญาต และ สังกัด */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="ml-1 text-slate-500 font-bold">
                        {role === 'RESCUER' ? 'เลขบัตรอาสากู้ภัย' : 'เลขใบประกอบวิชาชีพ'}
                      </Label>
                      <Input name="licenseId" value={formData.licenseId} onChange={(e) => handleInput('licenseId', e.target.value, 'upper', 15)} className="h-12 rounded-xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all" placeholder="ระบุเลขที่ใบอนุญาต/รหัส" />
                    </div>
                    <div className="space-y-2">
                      <Label className="ml-1 text-slate-500 font-bold">
                        {role === 'RESCUER' ? 'มูลนิธิ / หน่วยงานกู้ภัย' : 'โรงพยาบาลที่สังกัด'}
                      </Label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <Input name="organization" value={formData.organization} onChange={(e) => handleInput('organization', e.target.value, 'text')} className="pl-12 h-12 rounded-xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all" placeholder="ระบุชื่อหน่วยงาน" />
                      </div>
                    </div>
                  </div>

                  {/* แถวที่ 3: เบอร์โทร และ รหัสผ่าน */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="ml-1 text-slate-500 font-bold">เบอร์โทรศัพท์ติดต่อ</Label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <Input name="phone" value={formData.phone} onChange={(e) => handleInput('phone', e.target.value, 'number', 10)} className="pl-12 h-12 rounded-xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all" placeholder="08XXXXXXXX" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="ml-1 text-slate-500 font-bold">รหัสผ่านสำหรับเข้าใช้ระบบ</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <Input name="password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="pl-12 h-12 rounded-xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all" placeholder="••••••••" />
                      </div>
                    </div>
                  </div>

                  <Button disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 h-16 rounded-2xl text-xl font-black shadow-xl shadow-blue-100 mt-6 transition-all active:scale-95 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <><Loader2 className="animate-spin" size={24} /> กำลังประมวลผล...</>
                    ) : (
                      <><ShieldCheck size={24} /> ยืนยันและลงทะเบียน</>
                    )}
                  </Button>
                </form>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>

        <CardFooter className="justify-center pb-10">
          <p className="text-sm text-slate-500 font-medium">มีบัญชีอยู่แล้ว? <Link href="/login" className="text-blue-600 font-bold hover:underline">เข้าสู่ระบบ</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}