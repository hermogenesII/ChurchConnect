"use client";

import { useAuth } from "@/hooks/use-auth";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import Link from "next/link";

export default function AdminDashboard() {
  const { profile, loading: authLoading } = useAuth();
  const { stats, loading: statsLoading } = useDashboardStats();

  const loading = authLoading || statsLoading;

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-primary-900 mb-2">
          Dashboard
        </h1>
        <p className="text-neutral-600">
          Welcome back, {profile?.name || 'Admin'}! Here&apos;s what&apos;s happening in
          your church community.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Members"
          value={stats.totalMembers.toString()}
          change={stats.totalMembers > 0 ? "Active" : "No members yet"}
          changeType={stats.totalMembers > 0 ? "positive" : "neutral"}
          icon="👥"
        />
        <StatCard
          title="Upcoming Events"
          value={stats.upcomingEvents.toString()}
          change="Coming soon"
          changeType="neutral"
          icon="📅"
        />
        <StatCard
          title="Prayer Requests"
          value={stats.prayerRequests.toString()}
          change="Coming soon"
          changeType="neutral"
          icon="🙏"
        />
        <StatCard
          title="Weekly Attendance"
          value={stats.weeklyAttendance}
          change="Coming soon"
          changeType="neutral"
          icon="⛪"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="text-xl font-semibold text-primary-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <ActivityItem
              action="New member joined"
              details="Sarah Johnson joined the community"
              time="2 hours ago"
              type="member"
            />
            <ActivityItem
              action="Event created"
              details="Bible Study - Thursday Evening"
              time="4 hours ago"
              type="event"
            />
            <ActivityItem
              action="Prayer request submitted"
              details="Family healing prayers needed"
              time="1 day ago"
              type="prayer"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="text-xl font-semibold text-primary-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <QuickActionButton
              icon="📢"
              label="Send Announcement"
              description="Notify all church members"
              href="/church/announcements/new"
            />
            <QuickActionButton
              icon="📅"
              label="Create Event"
              description="Schedule a church activity"
              href="/church/events/new"
            />
            <QuickActionButton
              icon="👥"
              label="Add Member"
              description="Register new member"
              href="/church/members/add"
            />
            <QuickActionButton
              icon="📊"
              label="View Reports"
              description="Check attendance & engagement"
              href="/church/analytics"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: string;
}

function StatCard({ title, value, change, changeType, icon }: StatCardProps) {
  const changeColor = {
    positive: "text-success-600",
    negative: "text-error-600",
    neutral: "text-neutral-600",
  }[changeType];

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-primary-900">{value}</p>
          <p className={`text-sm ${changeColor}`}>{change}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  action: string;
  details: string;
  time: string;
  type: "member" | "event" | "prayer";
}

function ActivityItem({ action, details, time, type }: ActivityItemProps) {
  const typeIcon = {
    member: "👥",
    event: "📅",
    prayer: "🙏",
  }[type];

  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center">
        <span className="text-sm">{typeIcon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-primary-900">{action}</p>
        <p className="text-sm text-neutral-600">{details}</p>
        <p className="text-xs text-neutral-500 mt-1">{time}</p>
      </div>
    </div>
  );
}

interface QuickActionButtonProps {
  icon: string;
  label: string;
  description: string;
  href: string;
}

function QuickActionButton({
  icon,
  label,
  description,
  href,
}: QuickActionButtonProps) {
  return (
    <Link
      href={href}
      className="w-full flex items-center p-3 rounded-xl border-2 border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all group"
    >
      <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-primary-200 transition-colors">
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-left">
        <p className="font-medium text-primary-900">{label}</p>
        <p className="text-sm text-neutral-600">{description}</p>
      </div>
    </Link>
  );
}
