export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">서비스 이용약관</h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <p className="mb-4">
              본 약관은 Flownote(이하 "회사")가 제공하는 음성 녹음 및 텍스트
              변환 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의
              권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
            <p className="text-sm text-gray-500">최종 수정일: 2025년 1월</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              제1조 (목적)
            </h2>
            <p>
              본 약관은 회사가 제공하는 서비스의 이용조건 및 절차, 회사와
              이용자의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을
              목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              제2조 (용어의 정의)
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                "서비스"란 회사가 제공하는 음성 녹음, 텍스트 변환, 문서 생성 및
                연동 서비스를 의미합니다.
              </li>
              <li>
                "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는
                회원을 말합니다.
              </li>
              <li>
                "회원"이란 회사의 서비스에 접속하여 본 약관에 따라 회사와
                이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을
                말합니다.
              </li>
              <li>
                "콘텐츠"란 이용자가 서비스를 이용하면서 생성하는 음성 파일,
                텍스트 데이터 등을 의미합니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              제3조 (약관의 게시와 개정)
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기
                화면에 게시합니다.
              </li>
              <li>
                회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을
                개정할 수 있습니다.
              </li>
              <li>
                회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여
                현행 약관과 함께 서비스 초기 화면에 그 적용일자 7일 이전부터
                적용일자 전일까지 공지합니다.
              </li>
              <li>
                이용자가 개정약관의 적용에 동의하지 않는 경우 회사는 해당
                이용자에 대해 개정약관의 내용을 적용할 수 없으며, 이 경우
                이용자는 이용계약을 해지할 수 있습니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              제4조 (서비스의 제공 및 변경)
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                회사는 다음과 같은 서비스를 제공합니다:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>음성 녹음 및 파일 업로드</li>
                  <li>음성의 텍스트 변환 (STT)</li>
                  <li>AI 기반 문서 자동 생성</li>
                  <li>Notion 워크스페이스 연동</li>
                  <li>Slack 알림 연동</li>
                  <li>기타 회사가 추가 개발하거나 제휴계약 등을 통해 제공하는 서비스</li>
                </ul>
              </li>
              <li>
                회사는 상당한 이유가 있는 경우 운영상, 기술상의 필요에 따라
                제공하고 있는 서비스를 변경할 수 있습니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              제5조 (서비스의 중단)
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절
                또는 운영상 상당한 이유가 있는 경우 서비스의 제공을 일시적으로
                중단할 수 있습니다.
              </li>
              <li>
                회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로
                인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단,
                회사가 고의 또는 과실이 없음을 입증하는 경우에는 그러하지
                아니합니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              제6조 (회원가입)
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본
                약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.
              </li>
              <li>
                회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음
                각 호에 해당하지 않는 한 회원으로 등록합니다:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                  <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              제7조 (회원 탈퇴 및 자격 상실)
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                회원은 회사에 언제든지 탈퇴를 요청할 수 있으며 회사는 즉시
                회원탈퇴를 처리합니다.
              </li>
              <li>
                회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을
                제한 및 정지시킬 수 있습니다:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>가입 신청 시에 허위 내용을 등록한 경우</li>
                  <li>다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우</li>
                  <li>서비스를 이용하여 법령 또는 본 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              제8조 (회원에 대한 통지)
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                회사가 회원에 대한 통지를 하는 경우, 회원이 회사에 제출한
                이메일 주소로 할 수 있습니다.
              </li>
              <li>
                회사는 불특정다수 회원에 대한 통지의 경우 1주일 이상 서비스
                공지사항에 게시함으로써 개별 통지에 갈음할 수 있습니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              제9조 (콘텐츠의 저작권)
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                이용자가 서비스 내에서 생성한 콘텐츠에 대한 저작권은 이용자에게
                귀속됩니다.
              </li>
              <li>
                회사는 서비스 제공을 위한 목적으로만 이용자의 콘텐츠를 처리하며,
                이용자의 명시적 동의 없이 제3자에게 제공하지 않습니다.
              </li>
              <li>
                회사가 작성한 서비스 내의 콘텐츠에 대한 저작권 및 기타 지적재산권은
                회사에 귀속됩니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              제10조 (이용자의 의무)
            </h2>
            <p className="mb-3">이용자는 다음 행위를 하여서는 안 됩니다:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>신청 또는 변경 시 허위 내용의 등록</li>
              <li>타인의 정보 도용</li>
              <li>회사가 게시한 정보의 변경</li>
              <li>
                회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는
                게시
              </li>
              <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
              <li>
                외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는
                정보를 서비스에 공개 또는 게시하는 행위
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              제11조 (연결 서비스와 피연결 서비스 간의 관계)
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                회사는 Notion, Slack 등 외부 서비스와의 연동 기능을 제공합니다.
              </li>
              <li>
                연동된 외부 서비스는 각각 독립적으로 제공되는 것이며, 회사는
                해당 서비스에 대해 보증책임을 지지 않습니다.
              </li>
              <li>
                이용자는 각 외부 서비스의 이용약관을 별도로 준수해야 합니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              제12조 (면책조항)
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를
                제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
              </li>
              <li>
                회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여
                책임을 지지 않습니다.
              </li>
              <li>
                회사는 이용자가 서비스를 이용하여 기대하는 수익을 상실한 것에
                대하여 책임을 지지 않으며, 그 밖에 서비스를 통하여 얻은 자료로
                인한 손해에 관하여 책임을 지지 않습니다.
              </li>
              <li>
                회사는 AI 기술의 특성상 생성된 콘텐츠의 완전한 정확성을
                보장하지 않으며, 이용자는 생성된 콘텐츠를 검토하고 수정할 책임이
                있습니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              제13조 (분쟁해결)
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그
                피해를 보상처리하기 위하여 피해보상처리기구를 설치, 운영합니다.
              </li>
              <li>
                회사는 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그
                사항을 처리합니다. 다만, 신속한 처리가 곤란한 경우에는 이용자에게
                그 사유와 처리일정을 즉시 통보해 드립니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              제14조 (재판권 및 준거법)
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                회사와 이용자 간에 발생한 서비스 이용에 관한 분쟁에 대하여는
                대한민국 법을 적용합니다.
              </li>
              <li>
                회사와 이용자 간에 발생한 분쟁에 관한 소송은 민사소송법상의
                관할법원에 제소합니다.
              </li>
            </ol>
          </section>

          <section className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold">부칙</p>
            <p className="text-sm mt-2">본 약관은 2025년 1월 1일부터 시행됩니다.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
