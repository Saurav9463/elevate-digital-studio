import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Inbox, RefreshCw, Mail, Phone, Building2, Tag } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

type Submission = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  service: string | null;
  message: string;
  status: "new" | "reviewed" | "archived";
  created_at: string;
};

export function LeadsSection() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "reviewed" | "archived">("all");

  async function fetchSubmissions() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("id, name, email, company, phone, service, message, status, created_at")
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) throw new Error(error.message);
      setSubmissions(data ?? []);
    } catch (err: any) {
      toast.error(err.message ?? "Could not load submissions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchSubmissions(); }, []);

  async function updateStatus(id: string, status: string) {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status })
        .eq("id", id);

      if (error) throw new Error(error.message);

      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: status as Submission["status"] } : s))
      );
      toast.success("Status updated");
    } catch (err: any) {
      toast.error(err.message ?? "Could not update status");
    }
  }

  const filtered = filter === "all" ? submissions : submissions.filter((s) => s.status === filter);
  const counts = {
    all: submissions.length,
    new: submissions.filter((s) => s.status === "new").length,
    reviewed: submissions.filter((s) => s.status === "reviewed").length,
    archived: submissions.filter((s) => s.status === "archived").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Contact Leads</h2>
          <p className="text-sm text-gray-500 mt-0.5">Form submissions from your contact page</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchSubmissions} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {(["all", "new", "reviewed", "archived"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              filter === f
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-normal text-gray-600">
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <RefreshCw className="h-5 w-5 animate-spin mr-2" />
          Loading…
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <Inbox className="h-10 w-10 opacity-40" />
          <p className="text-sm">No submissions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div key={s.id} className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{s.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {format(new Date(s.created_at), "d MMM yyyy, h:mm a")}
                  </p>
                </div>
                <Select value={s.status} onValueChange={(val) => updateStatus(s.id, val)}>
                  <SelectTrigger className="h-7 w-[130px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  <a href={`mailto:${s.email}`} className="hover:underline text-blue-600">{s.email}</a>
                </span>
                {s.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    {s.phone}
                  </span>
                )}
                {s.company && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-gray-400" />
                    {s.company}
                  </span>
                )}
                {s.service && (
                  <span className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-gray-400" />
                    {s.service}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-3 border border-gray-100">
                {s.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
