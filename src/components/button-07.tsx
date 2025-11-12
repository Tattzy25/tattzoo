import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ButtonDemo() {
  return (
    <Button
      size={"lg"}
      className="relative p-0.5 inline-flex overflow-hidden px-8 py-4 text-lg"
    >
      <span
        className={cn(
          "absolute inset-[-300%] animate-[spin_3s_linear_infinite]",
          "bg-[conic-gradient(from_90deg_at_50%_50%,var(--primary)_0%,#fff_50%,var(--primary)_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,var(--primary)_0%,#000_50%,var(--primary)_100%)]"
        )}
      />
      <span
        className={cn(
          "inline-flex size-full items-center text-primary-foreground justify-center rounded-sm px-6 backdrop-blur-3xl"
        )}
      >
        View All Designs
      </span>
    </Button>
  );
}
