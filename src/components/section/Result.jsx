import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/sass/Result.scss';
import LoadingCharacter from '../../assets/img/로딩캐릭터.png';
import ResultCharacter from '../../assets/img/답장캐릭터.png';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. 데이터 받기
  const { name, tag, message, replyId } = location.state || {
    name: '익명',
    tag: '새해',
    message: '내용이 없습니다.',
    replyId: null
  };

  // 2. 상태 관리
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reply');

  // ✅ [추가됨] 작성 시간 (현재 시간) 저장
  // 컴포넌트가 열리는 순간의 시간을 저장합니다.
  const [writeDate, setWriteDate] = useState(new Date());

  // 3. API 데이터
  const [replyData, setReplyData] = useState({
    content: "",
    createdAt: ""
  });

  // 태그 이름 변환
  const tagLabels = {
    "새해": "새해 소원",
    "속마음": "속마음",
    "용기": "용기 얻기"
  };

  // 날짜 포맷팅 함수 (Date 객체 or ISO 문자열 모두 처리 가능하도록 수정)
  const formatDate = (dateInput) => {
    if (!dateInput) return "";
    const date = new Date(dateInput); // 문자열이면 객체로 변환, 객체면 그대로 사용
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchReply = async () => {
      try {
        const [response, _] = await Promise.all([
          fetch(`https://api.dearhaeny.store/replies/${replyId}`),
          new Promise(resolve => setTimeout(resolve, 3000))
        ]);

        const data = await response.json();

        if (data.isSuccess) {
          setReplyData({
            content: data.result.content,
            createdAt: data.result.createdAt
          });
          setIsLoading(false);
        } else {
          alert(data.message || "답장을 불러올 수 없습니다.");
          navigate('/');
        }
      } catch (error) {
        console.error("API Error:", error);
        alert("서버 연결에 실패했습니다.");
        navigate('/');
      }
    };

    if (replyId) {
      fetchReply();
    } else {
      setTimeout(() => setIsLoading(false), 3000);
    }
  }, [replyId, navigate]);


  // --- 로딩 화면 ---
  if (isLoading) {
    return (
      <div className="Loading_view">
        <div className="content">
          <img src={LoadingCharacter} alt="답장 쓰는 해니" className="loading-img" />
          <p className="loading-text">해니가 답장을 쓰고 있어요</p>
        </div>
      </div>
    );
  }

  // --- 결과 화면 ---
  return (
    <div className="Result_view">

      <div className="tab-header">
        <button
          className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
          onClick={() => setActiveTab('my')}
        >
          내 마음 글
        </button>
        <button
          className={`tab-btn ${activeTab === 'reply' ? 'active' : ''}`}
          onClick={() => setActiveTab('reply')}
        >
          해니의 답장
        </button>
        <div className={`indicator ${activeTab}`} />
      </div>

      <div className="tab-content">

        {/* [탭 1] 내 마음 글 */}
        {activeTab === 'my' && (
          <div className="my-letter-view">

            <div className="category-group">
              <button className="cat-btn selected">
                {tagLabels[tag] || tag}
              </button>
            </div>

            <h2 className="user-title">{name}님의 마음</h2>

            {/* ✅ [수정됨] 현재 시간 표시 */}
            <p className="date">{formatDate(writeDate)}</p>

            <div className="divider"></div>
            <p className="user-message">
              {message}
            </p>
          </div>
        )}

        {/* [탭 2] 해니의 답장 */}
        {activeTab === 'reply' && (
          <div className="reply-wrap">
            <img src={ResultCharacter} alt="편지 든 해니" className="reply-img" />

            {/* 노란색 구분선 */}
            <div className="reply-divider"></div>

            <div className="reply-box">
              <p className="reply-text" style={{ whiteSpace: 'pre-wrap' }}>
                {replyData.content || "답장 내용을 불러오는데 실패했습니다."}
              </p>

              <div className="reply-date">
                {formatDate(replyData.createdAt)}
              </div>
            </div>
          </div>
        )}

      </div>

      <div className="bottom-area">
        <button className="home-btn" onClick={() => navigate('/')}>처음으로 돌아가기</button>
      </div>
    </div>
  );
};

export default Result;