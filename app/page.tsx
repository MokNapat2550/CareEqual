'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Stethoscope, Zap, HeartPulse, UsersRound , UserStar , ShieldCheck , Scale} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-3xl opacity-50" />

      
        <div className="flex items-center ">
             <img className="h-40 w-auto object-contain" src="/logo/logo.png" alt="CareEqual Logo" />
          </div>

      <main className="relative z-10 max-w-5xl mx-auto px-8 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2  bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-bold mb-8 animate-bounce">
          <HeartPulse size={14} /> ทุกวินาทีมีค่าสำหรับการช่วยชีวิต
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.3] md:leading-[1.1] mb-8">
          เข้าถึงข้อมูลผู้ป่วย <br /> 
          <span className="block mt-3 md:mt-5 py-3 md:py-4 px-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
            ทันทีในนาทีฉุกเฉิน
          </span>
        </h1>
        
        <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
          ระบบจัดการข้อมูลผู้ป่วยผ่าน QR Code ที่ออกแบบมาเพื่อบุคลากรทางการแพทย์และกู้ภัย 
          เข้าถึงประวัติการแพ้ยาและกรุ๊ปเลือดได้เร็วที่สุดเมื่อผู้ป่วยหมดสติ
        </p>

        {/* 🌟 ปรับปรุงปุ่มกดตรงนี้ 🌟 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/patient-register">
            <Button className="h-16 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold shadow-2xl shadow-emerald-200 transition-all hover:scale-105 flex gap-2">
              <UsersRound size={24} /> สำหรับประชาชน : ลงทะเบียนข้อมูล 
            </Button>
          </Link>
          
          <Link href="/login">
            <Button className="h-16 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold shadow-2xl shadow-blue-200 transition-all hover:scale-105 flex gap-2">
              <UserStar size={24} /> เข้าสู่ระบบเจ้าหน้าที่
            </Button>
          </Link>
        </div>
        {/* 🌟 สิ้นสุดส่วนที่ปรับปรุง 🌟 */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          {[
            { icon: Zap, title: "รวดเร็ว", desc: "สแกนและโชว์ข้อมูลใน 1 วินาที" },
            { icon: Scale, title: "เท่าเทียม", desc: "ลดความเหลื่อมล้ำทางการแพทย์ ให้ทุกคนเข้าถึงการรักษาอย่างรวดเร็วและเท่าเทียม" },
            { icon: Stethoscope, title: "ต่อเนื่อง", desc: "ฐานข้อมูลกลางที่เชื่อมโยงทุกหน่วยงานเข้าด้วยกัน เพื่อส่งต่อการดูแลที่มีประสิทธิภาพตั้งแต่ต้นจนจบ" }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-white/50">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <feature.icon size={24} />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}