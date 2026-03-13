'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Lock, User, Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";

// ส่วนที่แก้ไขชื่อและรหัสผ่าน Admin
const ADMIN_LIST = [
  { username: "moknapat", password: "080808" },
  { username: "mewmew", password: "151515" },
  { username: "crochet", password: "212121" }
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleAdminLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const user = formData.get("username") as string;
    const pass = formData.get("password") as string;

    const isAdmin = ADMIN_LIST.find(a => a.username === user && a.password === pass);

    if (isAdmin) {
      // บันทึกสิทธิ์ (ในระบบจริงควรใช้ Session หรือ Cookie)
      localStorage.setItem("admin_access", "true");
      localStorage.setItem("admin_user", user);
      toast.success("ยินดีต้อนรับ Super Admin");
      router.push("/admin/dashboard");
    } else {
      toast.error("สิทธิ์การเข้าถึงถูกปฏิเสธ: ข้อมูลไม่ถูกต้อง");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* 🌌 Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />

      <div className="absolute top-8 left-8 z-20">
        <Link href="/" className="text-slate-500 hover:text-white flex items-center gap-2 transition-all group font-bold">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> กลับหน้าหลัก
        </Link>
      </div>

      <Card className="w-full max-w-md border-none bg-slate-900/40 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] rounded-[3rem] overflow-hidden relative z-10 border border-slate-800">
        <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <CardHeader className="text-center pt-12 px-8">
          <div className="w-24 h-24 bg-blue-600/10 text-blue-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-blue-500/20 shadow-2xl">
            <ShieldCheck size={48} />
          </div>
          <CardTitle className="text-3xl font-black text-white tracking-tighter uppercase">Admin Portal</CardTitle>
          <p className="text-slate-500 font-bold mt-2 text-xs uppercase tracking-[0.3em]">Central Database Access</p>
        </CardHeader>
        
        <CardContent className="p-10 pt-4">
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                <Input name="username" required className="pl-12 h-14 bg-slate-950/50 border-slate-800 text-white rounded-2xl focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-mono" placeholder="Doctor ID" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                <Input name="password" type="password" required className="pl-12 h-14 bg-slate-950/50 border-slate-800 text-white rounded-2xl focus:ring-blue-500/20 focus:border-blue-500/50 transition-all" placeholder="••••••••" />
              </div>
            </div>
            <Button disabled={isLoading} className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xl font-black shadow-2xl shadow-blue-500/20 mt-6 transition-all active:scale-95">
              {isLoading ? <Loader2 className="animate-spin" /> : "กดจ้า"}
            </Button>
          </form>
          <p className="text-center text-[10px] text-slate-600 mt-8 font-bold uppercase tracking-widest">Careequal6</p>
        </CardContent>
      </Card>
    </div>
  );
}