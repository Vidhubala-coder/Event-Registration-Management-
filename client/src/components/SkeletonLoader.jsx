import React from 'react';

export const EventCardSkeleton = () => {
  return (
    <div className="flex flex-col h-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md pulse-skeleton">
      <div className="h-48 bg-slate-200 dark:bg-slate-800 w-full" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
          <div className="space-y-2 mt-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-5/6" />
          </div>
        </div>
        
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 grid grid-cols-2 gap-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-2/3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-2/3" />
        </div>

        <div className="space-y-2 pt-2">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full w-full" />
        </div>

        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full pt-2" />
      </div>
    </div>
  );
};

export const EventDetailSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pulse-skeleton">
      <div className="h-96 rounded-3xl bg-slate-200 dark:bg-slate-800 w-full mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4" />
          <div className="flex gap-2">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-20" />
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-24" />
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-2/3" />
          </div>
        </div>

        <div className="space-y-6 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
          <div className="space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
          </div>
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-4 pulse-skeleton">
      <div className="h-12 bg-slate-100 dark:bg-slate-900 rounded-xl w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <div className="h-10 bg-slate-100 dark:bg-slate-900 rounded-lg flex-1" />
          <div className="h-10 bg-slate-100 dark:bg-slate-900 rounded-lg flex-1" />
          <div className="h-10 bg-slate-100 dark:bg-slate-900 rounded-lg w-24" />
        </div>
      ))}
    </div>
  );
};
