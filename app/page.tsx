import { GoogleLoginButton } from "@/components/google-login-button";

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
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              How it works
            </a>
            <GoogleLoginButton variant="nav" />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-24 overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-medium animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Record once, document automatically
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] animate-slide-up">
              Turn your voice into <br />
              <span className="text-transparent bg-clip-text bg-gradient-primary">perfect documents</span>
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Record meetings, lectures, and interviews. Let AI automatically transcribe, summarize, and organize them into your Notion workspace.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <GoogleLoginButton variant="primary" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
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
                description: "High-quality web recording with auto-save and cloud backup. Record up to 120 minutes.",
                color: "bg-slate-100 text-slate-700"
              },
              {
                icon: "⚡",
                title: "Instant Transcription",
                description: "Powered by Whisper API for 99% accuracy in multiple languages.",
                color: "bg-blue-50 text-blue-600"
              },
              {
                icon: "✨",
                title: "AI Summarization",
                description: "Get structured meeting notes, action items, and summaries instantly with GPT-4.",
                color: "bg-slate-800 text-white"
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

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-slate-600">
              From recording to organized document in minutes, not hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Record",
                description: "Click and start recording your meeting, lecture, or interview.",
                icon: "🎤"
              },
              {
                step: "02",
                title: "Transcribe",
                description: "AI automatically converts your audio to accurate text.",
                icon: "📝"
              },
              {
                step: "03",
                title: "Organize",
                description: "GPT-4 structures your content into beautiful documents.",
                icon: "✨"
              },
              {
                step: "04",
                title: "Share",
                description: "Automatically saved to Notion and shared via Slack.",
                icon: "🚀"
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center text-3xl shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-24 bg-slate-50">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Seamlessly integrated
            </h2>
            <p className="text-lg text-slate-600">
              Connect with the tools you already use every day.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {[
              { name: "Notion", icon: "📓", description: "Auto-save documents" },
              { name: "Slack", icon: "💬", description: "Instant notifications" },
              { name: "Google", icon: "🔐", description: "Secure login" },
            ].map((integration, idx) => (
              <div key={idx} className="card p-8 text-center min-w-[200px] hover:-translate-y-1 transition-transform duration-300">
                <div className="text-4xl mb-4">{integration.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{integration.name}</h3>
                <p className="text-sm text-slate-500">{integration.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-primary">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start capturing your ideas today
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of professionals who save hours every week with automated documentation.
          </p>
          <GoogleLoginButton variant="primary" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            {/* Left side - Company info */}
            <div className="text-sm text-slate-500 space-y-1">
              <p className="font-medium text-slate-700">©2025 FLOWNOTE · All rights reserved.</p>
              <p>FLOWNOTE | CEO: Youngmin Park</p>
              <p>BNN : 478-59-01063</p>
              <p>tnsb5373@gmail.com</p>
            </div>

            {/* Right side - Links */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex gap-8 text-sm text-slate-500">
                <a href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</a>
                <a href="/terms" className="hover:text-slate-900 transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
