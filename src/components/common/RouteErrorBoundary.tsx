export default function RouteErrorBoundary() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-6 gap-4">
      <h1 className="text-3xl font-bold text-red-600">
        Something went wrong 🚨
      </h1>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all"
      >
        Reload Page
      </button>
    </div>
  );
}
