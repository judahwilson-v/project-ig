"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import { AlertRail } from "@/components/alert-rail";
import { CrisisMeter } from "@/components/crisis-meter";
import { ExplainerPanel } from "@/components/explainer-panel";
import { JobTrendsBoard } from "@/components/job-trends-board";
import { JobSwipeDeck } from "@/components/job-swipe-deck";
import { MigrationRadar } from "@/components/migration-radar";
import { PersonalDashboard } from "@/components/personal-dashboard";
import { PoliticalAwareness } from "@/components/political-awareness";
import { RealityFeed } from "@/components/reality-feed";
import { TopSignalStrip } from "@/components/top-signal-strip";
import { buildExplainerMode } from "@/lib/logic/explainer";
import type {
  AlertSignal,
  CareerMatch,
  CrisisAssessment,
  EconomicMetric,
  ExplainerResponse,
  Insight,
  JobTrend,
  MigrationAdvice,
  MigrationLiveCounter,
  MigrationSnapshot,
  PoliticalTemperature,
  SentimentPulse,
  SkillGapReport,
  UserProfile
} from "@/lib/types/domain";

export function KPulseShell({
  user,
  feed,
  matches,
  crisis,
  migrationHistory,
  migrationLive,
  sentiment,
  alerts,
  migrationAdvice,
  politicalTemperature,
  jobTrends,
  economicMetrics,
  skillGap
}: {
  user: UserProfile;
  feed: Insight[];
  matches: CareerMatch[];
  crisis: CrisisAssessment;
  migrationHistory: MigrationSnapshot[];
  migrationLive: MigrationLiveCounter;
  sentiment: SentimentPulse[];
  alerts: AlertSignal[];
  migrationAdvice: MigrationAdvice;
  politicalTemperature: PoliticalTemperature;
  jobTrends: JobTrend[];
  economicMetrics: EconomicMetric[];
  skillGap: SkillGapReport;
}) {
  const [selectedInsight, setSelectedInsight] = useState(feed[0]);
  const [explanation, setExplanation] = useState<ExplainerResponse>(() =>
    buildExplainerMode(feed[0].metricSnapshot.label, feed[0].metricSnapshot.value, feed[0].whyItMatters)
  );

  useEffect(() => {
    let active = true;

    startTransition(() => {
      void fetch("/api/explainer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          label: selectedInsight.metricSnapshot.label,
          value: selectedInsight.metricSnapshot.value,
          context: selectedInsight.whyItMatters,
          sourceHash: selectedInsight.sourceHash
        })
      })
        .then((response) => response.json())
        .then((payload) => {
          if (active && payload.explanation) {
            setExplanation(payload.explanation as ExplainerResponse);
          }
        })
        .catch(() => {
          if (active) {
            setExplanation(
              buildExplainerMode(
                selectedInsight.metricSnapshot.label,
                selectedInsight.metricSnapshot.value,
                selectedInsight.whyItMatters
              )
            );
          }
        });
    });

    return () => {
      active = false;
    };
  }, [selectedInsight]);

  return (
    <main data-risk={crisis.riskLevel} className="min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,230,162,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(125,211,252,0.18),transparent_24%),radial-gradient(circle_at_bottom,rgba(255,111,111,0.16),transparent_34%)]" />

      <div className="relative mx-auto max-w-[92rem] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <header className="hero-shell">
          <div className="max-w-3xl">
            <p className="eyebrow">K-PULSE / Live Pulse For Kerala Youth</p>
            <h1 className="mt-4 max-w-4xl text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-white">
              Data-driven storytelling for jobs, migration, politics, and economic survival.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
              Not a newspaper layout. A living feed of reality built for the Insta-generation: swipe the signals, test your path, and see what changes your life next.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/jobs" className="rounded-full bg-white px-4 py-3 text-sm font-medium text-slate-950">
                Open Job Engine
              </Link>
              <Link href="/economy" className="rounded-full border border-white/12 px-4 py-3 text-sm text-white/75">
                Run Remittance Simulator
              </Link>
            </div>
          </div>

          <div className="hero-meta">
            <div>
              <p className="eyebrow mb-2">Crisis score</p>
              <p className="text-3xl font-semibold text-white">{crisis.score}/100</p>
              <p className="mt-2 text-sm text-white/62">{crisis.displayLabel}</p>
            </div>
            <div>
              <p className="eyebrow mb-2">Best move</p>
              <p className="text-3xl font-semibold text-white">{migrationAdvice.recommendation}</p>
              <p className="mt-2 text-sm text-white/62">{skillGap.bridgeSkills.join(", ")}</p>
            </div>
          </div>
        </header>

        <div className="mt-6">
          <AlertRail alerts={alerts} />
        </div>

        <div className="mt-6">
          <TopSignalStrip
            metrics={economicMetrics}
            migrationLive={migrationLive}
            topTrend={jobTrends[0]}
            politics={politicalTemperature}
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <RealityFeed
            feed={feed}
            selectedInsightId={selectedInsight.id}
            onExplain={(insight) => setSelectedInsight(insight)}
          />
          <div className="space-y-6">
            <ExplainerPanel insight={selectedInsight} explanation={explanation} />
            <CrisisMeter crisis={crisis} migrationHistory={migrationHistory} />
          </div>
        </div>

        <div className="mt-6">
          <JobTrendsBoard trends={jobTrends.slice(0, 4)} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
          <JobSwipeDeck matches={matches} />
          <MigrationRadar migrationHistory={migrationHistory} advice={migrationAdvice} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <PersonalDashboard user={user} matches={matches} advice={migrationAdvice} />
          <PoliticalAwareness sentiment={sentiment} electionCountdown={politicalTemperature.electionCountdown} />
        </div>
      </div>
    </main>
  );
}
