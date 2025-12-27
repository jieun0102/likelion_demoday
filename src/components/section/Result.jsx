import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/sass/Result.scss';
import LoadingCharacter from '../../assets/img/로딩캐릭터.png';
import ResultCharacter from '../../assets/img/답장캐릭터.png';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Post_main에서 넘겨준 데이터
  const { name, tag, message, postId } = location.state || {
    name: '익명',
    tag: '새해',
    message: '내용이 없습니다.',
    postId: null,
  };

  // ✅ anonId는 localStorage에서만
  const anonId = localStorage.getItem('anonId');

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reply');
  const [replyData, setReplyData] = useState({ content: "", createdAt: "" });

  const [writeDate] = useState(new Date());

  const tagLabels = {
    "새해": "새해 소원",
    "속마음": "속마음",
    "용기": "용기 얻기"
  };

  useEffect(() => {
    // 🔒 새로고침 / 직접 접근 방지
    if (!location.state) {
      navigate('/Result_archive');
      return null;
    }

    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 20;

    const fetchReply = async () => {
      const minLoadingPromise = new Promise(resolve => setTimeout(resolve, 3000));

      try {
        while (retryCount < maxRetries) {
          const response = await fetch(
            `https://api.dearhaeny.store/posts/${postId}/reply`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                anonId,
              },
              body: JSON.stringify({}),
            }
          );

          const data = await response.json();

          if (data.isSuccess && data.result?.replyStatus === 'COMPLETED') {
            await minLoadingPromise;

            if (isMounted) {
              setReplyData({
                content: data.result.content,
                createdAt: data.result.createdAt,
              });
              setIsLoading(false);
            }
            return;
          }

          await new Promise(resolve => setTimeout(resolve, 2000));
          retryCount++;
        }

        if (isMounted) {
          alert("답장 생성 시간이 너무 오래 걸려요. 잠시 후 보관함에서 확인해주세요.");
          navigate('/');
        }
      } catch (error) {
        console.error("Polling Error:", error);
        if (isMounted) {
          alert("서버 연결에 실패했습니다.");
          navigate('/');
        }
      }
    };

    if (postId && anonId) {
      fetchReply();
    } else {
      setTimeout(() => setIsLoading(false), 3000);
    }

    return () => { isMounted = false; };
  }, [postId, anonId, navigate]);

  const formatDate = (dateInput) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
      date.getDate()
    ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(
      date.getMinutes()
    ).padStart(2, '0')}`;
  };

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
        {activeTab === 'my' && (
          <div className="my-letter-view">
            <div className="category-group">
              <button className="cat-btn selected">
                {tagLabels[tag] || tag}
              </button>
            </div>
            <h2 className="user-title">{name}님의 마음</h2>
            <p className="date">{formatDate(writeDate)}</p>
            <div className="divider"></div>
            <p className="user-message">{message}</p>
          </div>
        )}

        {activeTab === 'reply' && (
          <div className="reply-wrap">
            <img src={ResultCharacter} alt="편지 든 해니" className="reply-img" />
            <div className="reply-divider"></div>
            <div className="reply-box">
              <p className="reply-text" style={{ whiteSpace: 'pre-wrap' }}>
                {replyData.content}
              </p>
              <div className="reply-date">
                {formatDate(replyData.createdAt)}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bottom-area">
        <button className="home-btn" onClick={() => navigate('/')}>
          처음으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default Result;
