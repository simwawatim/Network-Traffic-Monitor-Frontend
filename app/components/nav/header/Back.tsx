import { useRouter } from "next/navigation";

const GoBackComp = () => {
    const router = useRouter();
    return (
        <div className="text-center py-16 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Log not found</h2>
          <p className="text-gray-500 mt-2">The requested UUID does not exist.</p>
          <button onClick={() => router.back()} className="mt-6 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">Go Back</button>
        </div>
    )
}

export default GoBackComp