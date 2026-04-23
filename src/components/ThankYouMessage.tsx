"use client"

interface ThankYouMessageProps {
  onStartOver: () => void
}

export default function ThankYouMessage({ onStartOver }: ThankYouMessageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-300 to-purple-200 flex items-center justify-center py-8 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-lg border-2 border-purple-400 p-12 text-center space-y-6">
          {/* Checkmark */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-blue-600">Thank You!</h1>
            <p className="text-xl text-gray-700">Your submission has been received.</p>
            <p className="text-gray-600">
              We appreciate you taking the time to fill out the Pastors/Staff Database form. Your information has been
              successfully recorded.
            </p>
          </div>

          {/* Button */}
          <button
            onClick={onStartOver}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition mt-6"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    </div>
  )
}
