import { LoaderTwo } from "@/components/ui/loader";
import { cn } from "@/lib/utils";

interface ILoaderProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function Loader({ color = "#f0b90b", className }: ILoaderProps) {
  return <LoaderTwo color={color} className={cn(className)} />;
}
