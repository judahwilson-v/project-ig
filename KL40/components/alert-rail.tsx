import type { AlertSignal } from "@/lib/types/domain";
import { cn } from "@/lib/utils";

const severityClassMap = {
  stable: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  caution: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  risk: "border-orange-300/30 bg-orange-300/10 text-orange-100",
  critical: "border-rose-400/30 bg-rose-400/10 text-rose-100"
} as const;

export function AlertRail({ alerts }: { alerts: AlertSignal[] }) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max gap-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "min-w-[17rem] rounded-[1.6rem] border px-4 py-3 shadow-pulse backdrop-blur-xl",
              severityClassMap[alert.severity]
            )}
          >
            <div className="mb-2 flex items-center justify-between text-[0.7rem] uppercase tracking-[0.28em] text-white/60">
              <span>{alert.category}</span>
              <span>{alert.severity}</span>
            </div>
            <p className="text-sm font-semibold text-white">{alert.title}</p>
            <p className="mt-1 text-xs leading-5 text-white/70">{alert.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
