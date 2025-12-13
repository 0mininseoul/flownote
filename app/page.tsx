import { GoogleLoginButton } from "@/components/google-login-button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container-custom h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold">
              F
            </div>
            <span className="text-xl font-bold text-slate-900">Flownote</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Pricing
            </a>
            <GoogleLoginButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              New: AI Summary 2.0
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] animate-slide-up">
              Turn your voice into <br />
              <span className="text-transparent bg-clip-text bg-gradient-primary">perfect documents</span>
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Record meetings, lectures, and interviews. Let AI automatically transcribe, summarize, and organize them into your Notion workspace.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <GoogleLoginButton />
              <button className="btn-secondary">
                View Demo
              </button>
            </div>

            {/* Hero Image / Mockup Placeholder */}
            <div className="mt-16 relative mx-auto max-w-5xl animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="aspect-[16/9] rounded-2xl bg-slate-100 border border-slate-200 shadow-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-slate-400 font-medium">App Dashboard Preview</p>
                </div>
                {/* Decorative elements */}
                <div className="absolute -left-12 top-1/4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
                <div className="absolute -right-12 bottom-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Everything you need to capture ideas
            </h2>
            <p className="text-lg text-slate-600">
              Stop worrying about taking notes. Focus on the conversation and let Flownote handle the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎙️",
                title: "Crystal Clear Recording",
                description: "High-quality web recording with auto-save and cloud backup.",
                color: "bg-blue-50 text-blue-600"
              },
              {
                icon: "⚡",
                title: "Instant Transcription",
                description: "Powered by Whisper API for 99% accuracy in multiple languages.",
                color: "bg-amber-50 text-amber-600"
              },
              {
                icon: "✨",
                title: "AI Summarization",
                description: "Get structured meeting notes, action items, and summaries instantly.",
                color: "bg-purple-50 text-purple-600"
              },
            ].map((feature, idx) => (
              <div key={idx} className="card p-8 hover:-translate-y-1 transition-transform duration-300">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center text-2xl mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center text-white text-xs font-bold">
                F
              </div>
              <span className="text-lg font-bold text-slate-900">Flownote</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
            </div>
            <p className="text-sm text-slate-400">
              © 2024 Flownote. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
