import Image from "next/image";
import { type Faculty } from "@prisma/client";
import { cn } from "@/lib/utils";
import { UserIcon } from "lucide-react";

interface FacultyCardProps {
  faculty: Faculty;
  className?: string;
}

export function FacultyCard({ faculty, className }: Readonly<FacultyCardProps>) {
  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {faculty.profileImage ? (
          <Image
            src={faculty.profileImage}
            alt={faculty.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <UserIcon className="h-16 w-16" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold text-slate-900 group-hover:text-primary">
          {faculty.name}
        </h3>

        {faculty.designation && (
          <p className="mt-1 font-medium text-primary text-sm">{faculty.designation}</p>
        )}

        {faculty.department && <p className="mt-2 text-sm text-slate-500">{faculty.department}</p>}

        {faculty.biography && (
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
            {faculty.biography}
          </p>
        )}
      </div>
    </div>
  );
}
