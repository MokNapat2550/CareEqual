'use client';

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  LogOut, 
  User, 
  ChevronDown, 
  Stethoscope 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    toast.success("ออกจากระบบเรียบร้อยแล้ว");
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
          <Stethoscope className="text-white" size={22} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800 leading-none">Careequal</h1>
          <p className="text-[10px] text-blue-500 font-bold tracking-widest uppercase mt-1">Medical Portal</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-slate-100 rounded-full transition-all">
              <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=doctor" />
                <AvatarFallback>DR</AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-700">นพ. สมชาย ใจดี</p>
                <p className="text-[9px] text-slate-400">แผนกฉุกเฉิน</p>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-2" align="end">
            <DropdownMenuLabel>การตั้งค่าเจ้าหน้าที่</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              ออกจากระบบ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}