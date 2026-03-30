export default function AppLoading() {
  return (
    <div className="min-h-screen animate-pulse pt-28">
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-full bg-slate-200" />
              <div className="h-6 w-16 rounded-full bg-slate-200" />
            </div>
            <div className="h-12 w-2/3 rounded-xl bg-slate-200" />
            <div className="h-5 w-1/2 rounded-xl bg-slate-100" />
            <div className="flex gap-3 pt-2">
              <div className="h-12 w-36 rounded-xl bg-slate-200" />
              <div className="h-12 w-36 rounded-xl bg-slate-100" />
            </div>
          </div>
          <div className="lg:w-56"><div className="h-36 rounded-2xl bg-slate-100" /></div>
        </div>
      </section>
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="mx-auto max-w-7xl grid gap-6 lg:grid-cols-3">
          {[1,2,3].map((i) => <div key={i} className="h-44 rounded-2xl shimmer" />)}
        </div>
      </section>
    </div>
  );
}
