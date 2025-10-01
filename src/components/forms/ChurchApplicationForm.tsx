"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks";
import { supabase } from "@/lib/supabase";

interface FormData {
  // Personal Information
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantTitle: string;

  // Church Information
  churchName: string;
  churchDenomination: string;
  churchAddress: string;
  churchCity: string;
  churchState: string;
  churchZip: string;
  churchPhone: string;
  churchEmail: string;
  churchWebsite: string;

  // Church Details
  churchFoundedYear: string;
  estimatedCongregationSize: string;
  currentChurchSoftware: string;

  // Leadership Information
  leadershipPosition: string;
  yearsInPosition: string;
  leadershipVerificationMethod: string;

  // Additional Information
  motivation: string;
  currentChallenges: string;
}

const initialFormData: FormData = {
  applicantName: "",
  applicantEmail: "",
  applicantPhone: "",
  applicantTitle: "Pastor",
  churchName: "",
  churchDenomination: "",
  churchAddress: "",
  churchCity: "",
  churchState: "",
  churchZip: "",
  churchPhone: "",
  churchEmail: "",
  churchWebsite: "",
  churchFoundedYear: "",
  estimatedCongregationSize: "",
  currentChurchSoftware: "",
  leadershipPosition: "Senior Pastor",
  yearsInPosition: "",
  leadershipVerificationMethod: "",
  motivation: "",
  currentChallenges: "",
};

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

export function ChurchApplicationForm() {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fill form data for existing users
  useEffect(() => {
    if (user && profile) {
      setFormData((prev) => ({
        ...prev,
        applicantName: profile.name || "",
        applicantEmail: profile.email || user.email || "",
        applicantPhone: profile.phone || "",
      }));
    }
  }, [user, profile]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Determine if this is a new user or existing user application
      const isExistingUser = !!user;

      let result;

      if (isExistingUser) {
        // Existing user application
        const { data } = await supabase.rpc(
          "submit_church_application_existing_user",
          {
            p_church_name: formData.churchName,
            p_church_denomination: formData.churchDenomination || undefined,
            p_church_address: formData.churchAddress || undefined,
            p_church_city: formData.churchCity || undefined,
            p_church_state: formData.churchState || undefined,
            p_church_zip: formData.churchZip || undefined,
            p_church_phone: formData.churchPhone || undefined,
            p_church_email: formData.churchEmail || undefined,
            p_church_website: formData.churchWebsite || undefined,
            p_church_founded_year: formData.churchFoundedYear
              ? parseInt(formData.churchFoundedYear)
              : undefined,
            p_estimated_congregation_size: formData.estimatedCongregationSize
              ? parseInt(formData.estimatedCongregationSize)
              : undefined,
            p_current_church_software:
              formData.currentChurchSoftware || undefined,
            p_leadership_position: formData.leadershipPosition,
            p_years_in_position: formData.yearsInPosition
              ? parseInt(formData.yearsInPosition)
              : undefined,
            p_leadership_verification_method:
              formData.leadershipVerificationMethod || undefined,
            p_motivation: formData.motivation || undefined,
            p_current_challenges: formData.currentChallenges || undefined,
            p_applicant_title: formData.applicantTitle,
          }
        );

        result = data;
      } else {
        // New user application
        const { data } = await supabase.rpc(
          "submit_church_application_new_user",
          {
            p_applicant_name: formData.applicantName,
            p_applicant_email: formData.applicantEmail,
            p_applicant_phone: formData.applicantPhone || undefined,
            p_applicant_title: formData.applicantTitle,
            p_church_name: formData.churchName,
            p_church_denomination: formData.churchDenomination || undefined,
            p_church_address: formData.churchAddress || undefined,
            p_church_city: formData.churchCity || undefined,
            p_church_state: formData.churchState || undefined,
            p_church_zip: formData.churchZip || undefined,
            p_church_phone: formData.churchPhone || undefined,
            p_church_email: formData.churchEmail || undefined,
            p_church_website: formData.churchWebsite || undefined,
            p_church_founded_year: formData.churchFoundedYear
              ? parseInt(formData.churchFoundedYear)
              : undefined,
            p_estimated_congregation_size: formData.estimatedCongregationSize
              ? parseInt(formData.estimatedCongregationSize)
              : undefined,
            p_current_church_software:
              formData.currentChurchSoftware || undefined,
            p_leadership_position: formData.leadershipPosition,
            p_years_in_position: formData.yearsInPosition
              ? parseInt(formData.yearsInPosition)
              : undefined,
            p_leadership_verification_method:
              formData.leadershipVerificationMethod || undefined,
            p_motivation: formData.motivation || undefined,
            p_current_challenges: formData.currentChallenges || undefined,
          }
        );

        result = data;
      }

      if (!(result as { success?: boolean; error?: string })?.success) {
        throw new Error(
          (result as { success?: boolean; error?: string })?.error ||
            "Failed to submit application"
        );
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Application submission error:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✅</span>
        </div>
        <h3 className="text-2xl font-bold text-primary-900 mb-4">
          Application Submitted Successfully!
        </h3>
        <p className="text-neutral-700 mb-6 max-w-2xl mx-auto">
          Thank you for your interest in Church Connect! We&apos;ve received
          your application and will review it within 2-3 business days.
          You&apos;ll receive an email once your church has been approved.
        </p>
        <div className="text-sm text-neutral-500">
          <p>Questions? Contact us at support@churchconnect.com</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800 text-sm">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center">
          <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
            1
          </span>
          Personal Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="applicantName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name *
            </label>
            <input
              type="text"
              id="applicantName"
              name="applicantName"
              value={formData.applicantName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={!!user} // Disable if existing user
            />
          </div>
          <div>
            <label
              htmlFor="applicantTitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title/Position *
            </label>
            <select
              id="applicantTitle"
              name="applicantTitle"
              value={formData.applicantTitle}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Pastor">Pastor</option>
              <option value="Senior Pastor">Senior Pastor</option>
              <option value="Associate Pastor">Associate Pastor</option>
              <option value="Assistant Pastor">Assistant Pastor</option>
              <option value="Church Administrator">Church Administrator</option>
              <option value="Ministry Leader">Ministry Leader</option>
              <option value="Elder">Elder</option>
              <option value="Deacon">Deacon</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="applicantEmail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address *
            </label>
            <input
              type="email"
              id="applicantEmail"
              name="applicantEmail"
              value={formData.applicantEmail}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={!!user} // Disable if existing user
            />
          </div>
          <div>
            <label
              htmlFor="applicantPhone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="applicantPhone"
              name="applicantPhone"
              value={formData.applicantPhone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Church Information */}
      <div>
        <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center">
          <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
            2
          </span>
          Church Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label
              htmlFor="churchName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Church Name *
            </label>
            <input
              type="text"
              id="churchName"
              name="churchName"
              value={formData.churchName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label
              htmlFor="churchDenomination"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Denomination
            </label>
            <input
              type="text"
              id="churchDenomination"
              name="churchDenomination"
              value={formData.churchDenomination}
              onChange={handleInputChange}
              placeholder="e.g., Baptist, Methodist, Non-denominational"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label
              htmlFor="estimatedCongregationSize"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Congregation Size
            </label>
            <input
              type="number"
              id="estimatedCongregationSize"
              name="estimatedCongregationSize"
              value={formData.estimatedCongregationSize}
              onChange={handleInputChange}
              placeholder="Approximate number of members"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="churchAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Church Address
            </label>
            <input
              type="text"
              id="churchAddress"
              name="churchAddress"
              value={formData.churchAddress}
              onChange={handleInputChange}
              placeholder="Street address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label
              htmlFor="churchCity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City
            </label>
            <input
              type="text"
              id="churchCity"
              name="churchCity"
              value={formData.churchCity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label
              htmlFor="churchState"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              State
            </label>
            <select
              id="churchState"
              name="churchState"
              value={formData.churchState}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select State</option>
              {US_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="churchZip"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ZIP Code
            </label>
            <input
              type="text"
              id="churchZip"
              name="churchZip"
              value={formData.churchZip}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label
              htmlFor="churchPhone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Church Phone
            </label>
            <input
              type="tel"
              id="churchPhone"
              name="churchPhone"
              value={formData.churchPhone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label
              htmlFor="churchEmail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Church Email
            </label>
            <input
              type="email"
              id="churchEmail"
              name="churchEmail"
              value={formData.churchEmail}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label
              htmlFor="churchWebsite"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Church Website
            </label>
            <input
              type="url"
              id="churchWebsite"
              name="churchWebsite"
              value={formData.churchWebsite}
              onChange={handleInputChange}
              placeholder="https://yourchurch.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label
              htmlFor="churchFoundedYear"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Year Founded
            </label>
            <input
              type="number"
              id="churchFoundedYear"
              name="churchFoundedYear"
              value={formData.churchFoundedYear}
              onChange={handleInputChange}
              min="1800"
              max={new Date().getFullYear()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Leadership Information */}
      <div>
        <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center">
          <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
            3
          </span>
          Leadership Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="leadershipPosition"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Position in Church *
            </label>
            <select
              id="leadershipPosition"
              name="leadershipPosition"
              value={formData.leadershipPosition}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Senior Pastor">Senior Pastor</option>
              <option value="Lead Pastor">Lead Pastor</option>
              <option value="Associate Pastor">Associate Pastor</option>
              <option value="Assistant Pastor">Assistant Pastor</option>
              <option value="Church Administrator">Church Administrator</option>
              <option value="Elder">Elder</option>
              <option value="Deacon">Deacon</option>
              <option value="Ministry Director">Ministry Director</option>
              <option value="Other Leadership">Other Leadership</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="yearsInPosition"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Years in This Position
            </label>
            <input
              type="number"
              id="yearsInPosition"
              name="yearsInPosition"
              value={formData.yearsInPosition}
              onChange={handleInputChange}
              min="0"
              max="99"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="leadershipVerificationMethod"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              How can we verify your leadership position?
            </label>
            <input
              type="text"
              id="leadershipVerificationMethod"
              name="leadershipVerificationMethod"
              value={formData.leadershipVerificationMethod}
              onChange={handleInputChange}
              placeholder="e.g., Church website staff page, denomination directory, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center">
          <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
            4
          </span>
          Additional Information
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="currentChurchSoftware"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Current Church Management Software
            </label>
            <input
              type="text"
              id="currentChurchSoftware"
              name="currentChurchSoftware"
              value={formData.currentChurchSoftware}
              onChange={handleInputChange}
              placeholder="e.g., Planning Center, ChurchTrac, Excel, None, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label
              htmlFor="motivation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Why are you interested in Church Connect?
            </label>
            <textarea
              id="motivation"
              name="motivation"
              value={formData.motivation}
              onChange={handleInputChange}
              rows={3}
              placeholder="Tell us what drew you to Church Connect and how you hope it will benefit your ministry..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label
              htmlFor="currentChallenges"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              What challenges is your church currently facing with communication
              or member engagement?
            </label>
            <textarea
              id="currentChallenges"
              name="currentChallenges"
              value={formData.currentChallenges}
              onChange={handleInputChange}
              rows={3}
              placeholder="Share any current challenges or goals you have for your church community..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400
                   text-white font-semibold py-3 px-8 rounded-xl
                   transition-colors duration-200 transform hover:scale-105 disabled:transform-none
                   disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Submitting Application...</span>
            </>
          ) : (
            <span>Submit Church Application</span>
          )}
        </button>
      </div>

      {/* Terms */}
      <div className="text-center text-xs text-neutral-500 max-w-2xl mx-auto">
        By submitting this application, you acknowledge that the information
        provided is accurate and that you have the authority to represent your
        church. We will review your application and contact you within 2-3
        business days.
      </div>
    </form>
  );
}
