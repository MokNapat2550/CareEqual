'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Stethoscope, Zap, HeartPulse, UsersRound, 
  UserStar, Scale, ChevronDown, ArrowDown 
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [showScroll, setShowScroll] = useState(true);
  
  // 📍 สร้าง Ref สำหรับส่วนเนื้อหาด้านล่าง
  const featuresRef = useRef<HTMLDivElement>(null);

  // ตรวจสอบการเลื่อนหน้าจอเพื่อซ่อน/แสดงปุ่มลูกศร
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScroll(false);
      } else {
        setShowScroll(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSecretTrigger = (title: string) => {
    if (title === "เท่าเทียม") {
      const nextCount = clickCount + 1;
      setClickCount(nextCount);
      if (nextCount === 3) {
        setClickCount(0);
        router.push("/admin");
      }
    } else {
      setClickCount(0);
    }
  };

  // แอนิเมชันตอนเข้าเว็บ
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative w-full overflow-x-hidden select-none flex flex-col">
      
      {/* Background Decor */}
      <div className="absolute top-[-5%] left-[-5%] w-[300px] h-[300px] md:w-[40%] md:h-[40%] bg-blue-100/50 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[300px] h-[300px] md:w-[40%] md:h-[40%] bg-blue-200/40 rounded-full blur-3xl opacity-50 pointer-events-none" />

      {/* Header / Logo */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-7xl mx-auto px-8 w-full"
      >
        <div className="flex justify-center pt-8">
          <img className="h-40 md:h-56 w-auto object-contain" src="/logo/logo.png" alt="CareEqual Logo" />
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.main 
        initial="initial"
        animate="animate"
        className="relative z-10 max-w-5xl mx-auto px-6 pt-12 md:pt-20 pb-20 text-center flex-grow flex flex-col items-center justify-center min-h-[80vh]"
      >
        <motion.div variants={fadeInUp} className="text-sm md:text-lg inline-flex items-center gap-3 bg-blue-50 text-blue-600 px-6 py-3 md:px-8 md:py-4 rounded-full font-black mb-10 shadow-sm">
          <HeartPulse className="w-4 h-4 md:w-6 h-6 shrink-0 text-red-500 animate-pulse" />
          <span className="leading-none tracking-tight">ทุกวินาทีมีค่าสำหรับการช่วยชีวิต</span>
        </motion.div>

        <motion.h1 variants={fadeInUp} className="text-4xl md:text-7xl font-black text-slate-900 leading-[1.2] md:leading-[1.1] mb-8">
          เข้าถึงข้อมูลผู้ป่วย <br /> 
          <span className="block mt-3 md:mt-5 py-3 md:py-4 px-1 text-[2.2rem] sm:text-[2.6rem] md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
            ทันทีในนาทีฉุกเฉิน
          </span>
        </motion.h1>
        
        <motion.p variants={fadeInUp} className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed px-4 md:px-0 text-balance">
          ระบบจัดการข้อมูลผู้ป่วยผ่าน QR Code ที่ออกแบบมาเพื่อบุคลากรทางการแพทย์และกู้ภัย 
          เข้าถึงประวัติสุขภาพที่สำคัญได้อย่างรวดเร็วและแม่นยำ
        </motion.p>

        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/patient-register" className="w-full sm:w-auto">
            <Button className="w-full h-16 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold shadow-2xl transition-all active:scale-95 flex gap-2 items-center justify-center">
              <UsersRound size={24} /> สำหรับประชาชน
            </Button>
          </Link>
          
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full h-16 px-10 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold shadow-2xl transition-all active:scale-95 flex gap-2 items-center justify-center">
              <UserStar size={24} /> สำหรับเจ้าหน้าที่
            </Button>
          </Link>
        </motion.div>
      </motion.main>

      {/* ⬇️ Scroll Indicator (ลอยตัวอยู่ขวาล่าง) */}
      <AnimatePresence>
        {showScroll && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-10 right-6 md:right-12 z-50 flex flex-col items-center gap-3"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600  backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">

            </span>
            <motion.button
              onClick={scrollToFeatures}
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 bg-blue-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 transition-colors border-4 border-white active:scale-90"
            >
              <ArrowDown size={32} strokeWidth={3} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Grid (ส่วนที่เราจะเลื่อนมาหา) */}
      <section ref={featuresRef} className="max-w-5xl mx-auto px-6 pb-32 pt-24">
        <div className="text-center grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon: Zap, title: "รวดเร็ว", desc: "สแกนและโชว์ข้อมูลใน 1 วินาที" },
            { icon: Scale, title: "เท่าเทียม", desc: "ลดความเหลื่อมล้ำทางการแพทย์ ให้ทุกคนเข้าถึงการรักษาอย่างรวดเร็วและเท่าเทียม" },
            { icon: Stethoscope, title: "ต่อเนื่อง", desc: "ฐานข้อมูลกลางที่เชื่อมโยงทุกหน่วยงานเข้าด้วยกัน เพื่อส่งต่อการดูแลที่ไร้รอยต่อ" }
          ].map((feature, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleSecretTrigger(feature.title)}
              className="bg-white/70 backdrop-blur-sm p-8 rounded-[2rem] shadow-sm border border-white/50 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden h-full"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <feature.icon size={24} />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              
              {clickCount > 0 && feature.title === "เท่าเทียม" && (
                <div className="absolute inset-0 bg-blue-500/5 rounded-[2rem] pointer-events-none" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="py-10 text-center opacity-30 mt-auto">
        <p className="text-[10px] font-black uppercase tracking-[0.5em]">CareEqual &copy; 2026</p>
      </footer>
    </div>
  );
}