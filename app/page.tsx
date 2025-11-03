import { GoogleLoginButton } from "@/components/google-login-button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <div className="max-w-6xl w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            VoiceNote
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            녹음 한 번 하면 완성되는 <br />
            <span className="font-semibold text-gray-800">자동 문서</span>
          </p>
        </div>

        {/* CTA Card */}
        <div className="glass-card p-12 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              회의록, 인터뷰, 강의 기록
            </h2>
            <p className="text-gray-600">
              AI가 자동으로 정리하고 Notion에 저장까지
            </p>
          </div>

          <GoogleLoginButton />
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🎙️",
              title: "회의록",
              description: "팀 미팅 중 녹음하면 회의록 자동 생성",
            },
            {
              icon: "📝",
              title: "인터뷰",
              description: "인터뷰 진행하면 Q&A 형식으로 정리",
            },
            {
              icon: "📚",
              title: "강의",
              description: "강의 녹음하면 핵심 요약본 생성",
            },
          ].map((feature, idx) => (
            <div key={idx} className="glass-card p-8 text-center space-y-3">
              <div className="text-5xl">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
