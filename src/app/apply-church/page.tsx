import { ChurchApplicationForm } from "@/components/forms/ChurchApplicationForm";

export default function ApplyChurchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-spiritual-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary-900 mb-6">
            Bring Your Church Online
          </h1>
          <p className="text-lg text-neutral-700 max-w-3xl mx-auto mb-8">
            Join thousands of churches using Church Connect to strengthen their
            communities, engage members, and grow their ministries. Our team
            reviews each application to ensure the best experience for your
            congregation.
          </p>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⛪</span>
              </div>
              <h3 className="font-semibold text-primary-900 mb-2">
                Church Management
              </h3>
              <p className="text-sm text-neutral-600">
                Manage events, members, and communications all in one place
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-semibold text-primary-900 mb-2">
                Community Building
              </h3>
              <p className="text-sm text-neutral-600">
                Connect members through prayer requests, groups, and events
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-spiritual-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold text-primary-900 mb-2">
                Mobile Ready
              </h3>
              <p className="text-sm text-neutral-600">
                Your members can stay connected anywhere, anytime
              </p>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary-900 mb-2">
              Church Registration Application
            </h2>
            <p className="text-neutral-600">
              We review all applications within 2-3 business days. You&apos;ll
              receive an email once your church has been approved and your
              account is ready.
            </p>
          </div>

          <ChurchApplicationForm />
        </div>

        {/* Footer info */}
        <div className="text-center mt-12">
          <p className="text-sm text-neutral-500 mb-4">
            Questions about the application process?
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <a
              href="mailto:support@churchconnect.com"
              className="text-primary-600 hover:text-primary-700"
            >
              📧 support@churchconnect.com
            </a>
            <a
              href="tel:1-800-CHURCH-1"
              className="text-primary-600 hover:text-primary-700"
            >
              📞 1-800-CHURCH-1
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
