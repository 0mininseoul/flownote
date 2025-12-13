"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface NotionDatabase {
  id: string;
  title: string;
  url: string;
  last_edited_time: string;
}

interface NotionPage {
  id: string;
  title: string;
  url: string;
  last_edited_time: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [usage, setUsage] = useState({ used: 0, limit: 350 });
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [notionConnected, setNotionConnected] = useState(false);
  const [notionDatabaseId, setNotionDatabaseId] = useState<string | null>(null);
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);
  const [databases, setDatabases] = useState<NotionDatabase[]>([]);
  const [pages, setPages] = useState<NotionPage[]>([]);
  const [modalTab, setModalTab] = useState<"select" | "create">("select");
  const [selectedPageId, setSelectedPageId] = useState("");
  const [newDbTitle, setNewDbTitle] = useState("Flownote Recordings");
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    // Check if returning from Notion OAuth and should open DB selector
    const params = new URLSearchParams(window.location.search);
    if (params.get("notion") === "connected" && params.get("selectDb") === "true") {
      openDatabaseModal();
      // Clean up URL
      window.history.replaceState({}, "", "/settings");
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const [usageResponse, userResponse] = await Promise.all([
        fetch("/api/user/usage"),
        fetch("/api/user/profile"),
      ]);

      const usageData = await usageResponse.json();
      const userData = await userResponse.json();

      setUsage(usageData);
      setUserEmail(userData.email || "");
      setNotionConnected(!!userData.notion_access_token);
      setNotionDatabaseId(userData.notion_database_id || null);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDatabaseModal = async () => {
    setShowDatabaseModal(true);
    setModalLoading(true);
    try {
      const [dbResponse, pageResponse] = await Promise.all([
        fetch("/api/notion/databases"),
        fetch("/api/notion/pages"),
      ]);

      if (dbResponse.ok) {
        const dbData = await dbResponse.json();
        setDatabases(dbData.databases || []);
      }

      if (pageResponse.ok) {
        const pageData = await pageResponse.json();
        setPages(pageData.pages || []);
      }
    } catch (error) {
      console.error("Failed to fetch Notion data:", error);
      alert("Notion 데이터를 불러오는데 실패했습니다.");
    } finally {
      setModalLoading(false);
    }
  };

  const selectDatabase = async (databaseId: string) => {
    try {
      const response = await fetch("/api/user/notion-database", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ databaseId }),
      });

      if (response.ok) {
        setNotionDatabaseId(databaseId);
        setShowDatabaseModal(false);
        alert("Notion 데이터베이스가 설정되었습니다.");
      } else {
        throw new Error("Failed to update database");
      }
    } catch (error) {
      console.error("Failed to set database:", error);
      alert("데이터베이스 설정에 실패했습니다.");
    }
  };

  const createDatabase = async () => {
    if (!selectedPageId) {
      alert("페이지를 선택해주세요.");
      return;
    }

    setModalLoading(true);
    try {
      const response = await fetch("/api/notion/database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: selectedPageId,
          title: newDbTitle,
        }),
      });

      if (response.ok) {
        const { databaseId } = await response.json();
        await selectDatabase(databaseId);
      } else {
        throw new Error("Failed to create database");
      }
    } catch (error) {
      console.error("Failed to create database:", error);
      alert("데이터베이스 생성에 실패했습니다.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteAllData = async () => {
    const confirmed = confirm(
      "정말 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
    );

    if (!confirmed) return;

    const doubleCheck = confirm(
      "주의: 모든 녹음, 커스텀 포맷, 연결된 통합이 삭제됩니다. 계속하시겠습니까?"
    );

    if (!doubleCheck) return;

    try {
      const response = await fetch("/api/user/data", {
        method: "DELETE",
      });

      if (response.ok) {
        alert("모든 데이터가 삭제되었습니다.");
        router.push("/");
      } else {
        throw new Error("Failed to delete data");
      }
    } catch (error) {
      console.error("Failed to delete data:", error);
      alert("데이터 삭제에 실패했습니다.");
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container-custom h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold">
              F
            </div>
            <span className="text-xl font-bold text-slate-900">Flownote</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
              title="Dashboard"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </button>
            <button
              onClick={() => router.push("/history")}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
              title="History"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container-custom py-8 flex-1 max-w-4xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Account Info */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Account Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">
                  Email
                </label>
                <div className="text-slate-900 font-medium">
                  {loading ? "Loading..." : userEmail || "No email info"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-2">
                  Usage Limit
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-700 font-medium">
                      {usage.used} mins / {usage.limit} mins
                    </span>
                    <span className="text-slate-500">
                      {Math.round((usage.used / usage.limit) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((usage.used / usage.limit) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Integrations */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Integrations
            </h2>
            <div className="space-y-4">
              {/* Notion */}
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-indigo-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-2xl">
                    📔
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Notion</h3>
                    <p className="text-sm text-slate-500">
                      {notionConnected
                        ? notionDatabaseId
                          ? "Auto-save to database enabled"
                          : "Select a database to enable auto-save"
                        : "Connect to save notes automatically"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (notionConnected) {
                      openDatabaseModal();
                    } else {
                      window.location.href = "/api/auth/notion?returnTo=/settings&selectDb=true";
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${notionConnected
                      ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                >
                  {notionConnected ? "Configure" : "Connect"}
                </button>
              </div>

              {/* Slack */}
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-indigo-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-2xl">
                    💬
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Slack</h3>
                    <p className="text-sm text-slate-500">Get notified when summaries are ready</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    (window.location.href = "/api/auth/slack?returnTo=/settings")
                  }
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Reconnect
                </button>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Data Management
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                <div>
                  <h3 className="font-bold text-slate-900">Auto-deletion</h3>
                  <p className="text-sm text-slate-500">
                    Automatically delete recordings older than 30 days
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                <h3 className="font-bold text-red-700 mb-1">Danger Zone</h3>
                <p className="text-sm text-red-600 mb-4">
                  This action cannot be undone. All data will be permanently deleted.
                </p>
                <button
                  onClick={handleDeleteAllData}
                  className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  Delete All Data
                </button>
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="card p-6">
            <button
              onClick={handleSignOut}
              className="w-full py-3 px-4 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>

      {/* Database Selection Modal */}
      {showDatabaseModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl animate-slide-up">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Configure Notion Database
                </h2>
                <button
                  onClick={() => setShowDatabaseModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setModalTab("select")}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${modalTab === "select"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  Select Existing
                </button>
                <button
                  onClick={() => setModalTab("create")}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${modalTab === "create"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  Create New
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
              {modalLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                </div>
              ) : modalTab === "select" ? (
                <div className="space-y-3">
                  {databases.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-slate-500 mb-4">
                        No databases found.
                      </p>
                      <button
                        onClick={() => setModalTab("create")}
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Create a new database →
                      </button>
                    </div>
                  ) : (
                    databases.map((db) => (
                      <button
                        key={db.id}
                        onClick={() => selectDatabase(db.id)}
                        className="w-full p-4 border border-slate-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all text-left group"
                      >
                        <div className="font-bold text-slate-900 mb-1 group-hover:text-indigo-700">
                          {db.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          Last edited: {new Date(db.last_edited_time).toLocaleDateString("ko-KR")}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Database Name
                    </label>
                    <input
                      type="text"
                      value={newDbTitle}
                      onChange={(e) => setNewDbTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                      placeholder="Flownote Recordings"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select Parent Page
                    </label>
                    {pages.length === 0 ? (
                      <p className="text-slate-500 text-sm bg-slate-50 p-4 rounded-lg">
                        No pages found. Please create a page in Notion first.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                        {pages.map((page) => (
                          <button
                            key={page.id}
                            onClick={() => setSelectedPageId(page.id)}
                            className={`w-full p-3 border rounded-lg transition-all text-left ${selectedPageId === page.id
                                ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                              }`}
                          >
                            <div className="font-medium text-slate-900">
                              {page.title}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              Last edited: {new Date(page.last_edited_time).toLocaleDateString("ko-KR")}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={createDatabase}
                    disabled={!selectedPageId || modalLoading}
                    className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                  >
                    Create Database
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
