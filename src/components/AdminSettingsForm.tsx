"use client";

import { SiteSettings } from "@/types/index";
import { useState } from "react";

interface AdminSettingsFormProps {
  initialSettings: SiteSettings;
  onSaved: (settings: SiteSettings) => void;
}

export default function AdminSettingsForm({
  initialSettings,
  onSaved
}: AdminSettingsFormProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (!res.ok) {
        throw new Error("Failed to update settings");
      }
      const updated = (await res.json()) as SiteSettings;
      setMessage("✅ Settings updated successfully!");
      onSaved(updated);
    } catch (err: any) {
      setMessage("❌ " + (err.message || "Error updating settings"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Site Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Site Title</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={settings.siteTitle}
            onChange={(e) => handleChange("siteTitle", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Site Subtitle</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={settings.siteSubtitle}
            onChange={(e) => handleChange("siteSubtitle", e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Title</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={settings.heroTitle}
            onChange={(e) => handleChange("heroTitle", e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Description</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
            value={settings.heroDescription}
            onChange={(e) => handleChange("heroDescription", e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Footer Text</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={settings.footerText}
            onChange={(e) => handleChange("footerText", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {message && (
          <p className={`p-3 rounded-lg text-sm ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}>
            {message}
          </p>
        )}
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "💾 Save Settings"}
        </button>
      </div>
    </div>
  );
}
