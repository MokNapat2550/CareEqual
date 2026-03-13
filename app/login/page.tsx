'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { loginUser } from "@/app/actions/auth"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BackButton from "@/components/BackButton";
import { Lock, UserCircle, Stethoscope, Truck, Loader2, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); 

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    if (!username.trim()) {
      return toast.error("กรุณาระบุรหัสประจำตัวเจ้าหน้าที่");
    }
    if (!password.trim()) {
      return toast.error("กรุณาระบุรหัสผ่าน");
    }

    setIsLoading(true);
    
    // เรียกใช้ loginUser ส่งข้อมูลไปตรวจสอบที่หลังบ้าน
    const result = await loginUser(formData);
    
    if (result.error) {
      toast.error(result.error); 
      setIsLoading(false); // ให้ปุ่มกลับมากดได้ถ้า Error
    } else {
      // 🔥 หัวใจสำคัญที่แก้ใหม่: บังคับยัดคำว่า role (เช่น "RESCUER") ลงไปในข้อมูลด้วยเลย
      if (result.user) {
        const userDataToSave = {
          ...result.user, // เอาข้อมูลที่ได้จากหลังบ้านมา
          role: role      // 🔴 บังคับเพิ่ม Role จาก Tab ที่เลือกลงไปด้วย!
        };
        localStorage.setItem("user", JSON.stringify(userDataToSave));
      }

      const roleName = role === "DOCTOR" ? 'แพทย์' : role === "NURSE" ? 'พยาบาล' : 'กู้ภัย';
      toast.success(`ยินดีต้อนรับเข้าสู่ระบบ (เจ้าหน้าที่${roleName})`);
      
      // เปลี่ยนไปหน้า Dashboard
      router.push("/dashboard");
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#F8FAFC] p-4 font-sans">
      <div className="absolute top-8 left-8">
        <BackButton />
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl shadow-slate-200 rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-sm">
        <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400" />
        
        <CardHeader className="text-center pt-10 px-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Stethoscope size={32} />
          </div>
          <CardTitle className="text-3xl font-black text-slate-800 tracking-tight">เข้าสู่ระบบ</CardTitle>
          <CardDescription className="text-slate-400 font-medium mt-2">Careequal Medical Information System</CardDescription>
        </CardHeader>
        
        <CardContent className="px-10">
          <Tabs defaultValue="DOCTOR" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-100 rounded-xl p-1 h-12">
              <TabsTrigger value="DOCTOR" className="rounded-lg font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-blue-600">แพทย์</TabsTrigger>
              <TabsTrigger value="NURSE" className="rounded-lg font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-blue-600">พยาบาล</TabsTrigger>
              <TabsTrigger value="RESCUER" className="rounded-lg font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-blue-600">กู้ภัย</TabsTrigger>
            </TabsList>

            {["DOCTOR", "NURSE", "RESCUER"].map(currentRole => (
              <TabsContent key={currentRole} value={currentRole}>
                {/* 🔴 หมายเหตุ: ในโค้ดเดิมของคุณ ตรง onSubmit นี้มันเรียก form ซ้ำซ้อน 
                    แต่ระบบ Next.js จะดึง input type="hidden" ไปใช้ได้ปกติครับ */}
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <input type="hidden" name="role" value={currentRole} />

                  <div className="space-y-2">
                    <Label className="ml-1 text-slate-500 font-bold">
                      รหัสประจำตัว {currentRole === "DOCTOR" ? 'แพทย์' : currentRole === "NURSE" ? 'พยาบาล' : 'กู้ภัย'}
                    </Label>
                    <div className="relative">
                      {currentRole === "RESCUER" ? (
                        <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      ) : (
                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      )}
                      <Input 
                        name="username" 
                        className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-lg font-mono uppercase" 
                        placeholder={`เช่น ${currentRole === "RESCUER" ? 'RES999' : 'DOC1234'}`} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="ml-1 text-slate-500 font-bold">รหัสผ่าน</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <Input 
                        name="password" 
                        type="password" 
                        className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-lg" 
                        placeholder="••••••••" 
                      />
                    </div>
                  </div>

                  <Button 
                    disabled={isLoading} 
                    className="w-full bg-blue-600 hover:bg-blue-700 h-16 rounded-2xl text-xl font-black shadow-xl shadow-blue-100 mt-6 transition-all active:scale-95 flex gap-2 items-center justify-center"
                  >
                    {isLoading ? (
                      <><Loader2 className="animate-spin" size={24} /> กำลังตรวจสอบ...</>
                    ) : (
                      <><LogIn size={24} /> เข้าสู่ระบบ</>
                    )}
                  </Button>
                </form>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>

        <CardFooter className="justify-center pb-10 pt-4">
          <p className="text-sm text-slate-500 font-medium">
            ยังไม่มีบัญชีเจ้าหน้าที่? <Link href="/signup" className="text-blue-600 font-bold hover:underline">ลงทะเบียนที่นี่</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}