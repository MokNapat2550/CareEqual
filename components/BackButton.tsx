'use client';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <Button 
      variant="ghost" 
      onClick={() => router.back()}
      className={`gap-2 text-slate-500 hover:text-blue-600 transition-all ${className}`}
    >
      <ArrowLeft size={18} /> ย้อนกลับ
    </Button>
  );
}