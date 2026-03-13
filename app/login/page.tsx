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
import { Lock, UserCircle, Stethoscope, Truck, Loader2, LogIn, ChevronLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); 
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    if (!username.trim() || !password.trim()) {
      return toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
    }

    setIsLoading(true);
    
    const result = await loginUser(formData);
    
    if (result.error) {
      toast.error(result.error); 
      setIsLoading(false);
    } else {
      if (result.user) {
        const userDataToSave = {
          ...result.user,
          role: role
        };
        localStorage.setItem("user", JSON.stringify(userDataToSave));
      }

      const roleName = role === "DOCTOR" ? 'แพทย์' : role === "NURSE" ? 'พยาบาล' : 'กู้ภัย';
      toast.success(`ยินดีต้อนรับเข้าสู่ระบบ (เจ้าหน้าที่${roleName})`);
      router.push("/dashboard");
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC] p-4 font-sans">
      
      {/* 🔙 ปุ่มย้อนกลับไปหน้า Home (ใช้ Link บังคับกลับหน้าแรก) */}
      <div className="absolute top-8 left-4 md:left-8 z-30">
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all"
        >
          <div className="p-2 rounded-xl bg-white shadow-sm group-hover:bg-blue-50 transition-colors border border-slate-100">
            <ChevronLeft size={20} />
          </div>
          <span className="font-bold text-sm hidden sm:inline">กลับหน้าหลัก</span>
        </Link>
      </div>

      {/* 🏥 Logo และส่วนหัวหน้า Login */}
      <div className="mb-8 text-center">
        <img className="mx-auto h-25 w-auto mb-4" src="/logo/logo.png" alt="CareEqual" />
        <h2 className="text-2xl font-black text-slate-900">เข้าสู่ระบบสำหรับเจ้าหน้าที่</h2>
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl shadow-slate-200/60 rounded-[2.5rem] overflow-hidden bg-white/90 backdrop-blur-md">
        <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400" />
        
        <CardHeader className="text-center pt-8 px-8">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Stethoscope size={28} />
          </div>
          <CardTitle className="text-2xl font-black text-slate-800 tracking-tight">Login </CardTitle>
          
        </CardHeader>
        
        <CardContent className="px-8 md:px-10">
          <Tabs defaultValue="DOCTOR" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-100 rounded-xl p-1 h-12">
              <TabsTrigger value="DOCTOR" className="rounded-lg font-bold text-xs">แพทย์</TabsTrigger>
              <TabsTrigger value="NURSE" className="rounded-lg font-bold text-xs">พยาบาล</TabsTrigger>
              <TabsTrigger value="RESCUER" className="rounded-lg font-bold text-xs">กู้ภัย</TabsTrigger>
            </TabsList>

            {["DOCTOR", "NURSE", "RESCUER"].map(currentRole => (
              <TabsContent key={currentRole} value={currentRole}>
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <input type="hidden" name="role" value={currentRole} />

                  <div className="space-y-2">
                    <Label className="ml-1 text-slate-500 font-bold text-xs uppercase tracking-widest">
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
                        className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-lg font-mono" 
                        placeholder={currentRole === "RESCUER" ? 'RES999' : 'DOC1234'} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="ml-1 text-slate-500 font-bold text-xs uppercase tracking-widest">รหัสผ่าน</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <Input 
                        name="password" 
                        type="password" 
                        className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-lg" 
                        placeholder="••••••••" 
                      />
                    </div>
                  </div>

                  <Button 
                    disabled={isLoading} 
                    className="w-full bg-blue-600 hover:bg-blue-700 h-16 rounded-2xl text-xl font-black shadow-xl shadow-blue-200 mt-6 transition-all active:scale-95 flex gap-2 items-center justify-center"
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

        <CardFooter className="justify-center pb-10 pt-4 border-t border-slate-50 mt-6">
          <p className="text-sm text-slate-500 font-medium">
            ยังไม่มีบัญชีเจ้าหน้าที่? <Link href="/signup" className="text-blue-600 font-bold hover:underline">ลงทะเบียนที่นี่</Link>
          </p>
        </CardFooter>
      </Card>

      <p className="mt-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">CareEqual</p>
    </div>
  );
}