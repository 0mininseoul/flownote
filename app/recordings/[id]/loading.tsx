export default function Loading() {
    return (
        <div className="app-container animate-pulse">
            {/* Header Skeleton */}
            <header className="app-header max-w-[430px] mx-auto w-full left-0 right-0 z-30">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-slate-200 rounded-full" />
                    <div className="h-6 bg-slate-200 rounded w-1/2" />
                </div>
            </header>

            <main className="flex-1 overflow-y-auto pt-[60px] pb-24 px-4">
                <div className="max-w-[800px] mx-auto space-y-6">
                    {/* Audio Player Skeleton */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                        <div className="h-12 bg-slate-200 rounded-xl w-full" />
                    </div>

                    {/* Content Tabs Skeleton */}
                    <div className="sticky top-0 bg-[#F8FAFC] z-10 py-2">
                        <div className="flex p-1 bg-slate-100 rounded-xl">
                            <div className="flex-1 h-8 bg-white rounded-lg opacity-50" />
                            <div className="flex-1 h-8" />
                        </div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm min-h-[400px] border border-slate-100 space-y-4">
                        <div className="h-4 bg-slate-200 rounded w-3/4" />
                        <div className="h-4 bg-slate-200 rounded w-full" />
                        <div className="h-4 bg-slate-200 rounded w-5/6" />
                        <div className="h-4 bg-slate-200 rounded w-full" />
                        <div className="h-4 bg-slate-200 rounded w-4/5" />
                    </div>
                </div>
            </main>
        </div>
    );
}
