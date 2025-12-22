import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/sass/Result_archive.scss';
import ResultCharacter from '../../assets/img/답장캐릭터.png';
import Arrow from '../../assets/img/icon_arrow_left.png';

const Result_archive = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Archive 목록 페이지에서 클릭 시 postId를 넘겨주어야 합니다.
    // 예: navigate('/archive/result', { state: { postId: 8 } })
    const { postId } = location.state || { postId: null };

    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('my'); // 보관함에서는 '내 마음 글'을 먼저 보여주는 게 자연스러움 (선택사항)

    // 데이터 상태 관리
    const [postData, setPostData] = useState(null); // 내 글 데이터
    const [replyData, setReplyData] = useState(null); // 답장 데이터

    // 태그 매핑 (영어 -> 한글)
    const tagLabels = {
        "NEW_YEAR_WISH": "새해 소원",
        "INNER_THOUGHT": "속마음",
        "COURAGE": "용기 얻기",
        // 혹시 모를 한글 데이터 대응
        "새해": "새해 소원",
        "속마음": "속마음",
        "용기": "용기 얻기"
    };

    // 날짜 포맷팅 함수
    const formatDate = (dateInput) => {
        if (!dateInput) return "";
        const date = new Date(dateInput);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    useEffect(() => {
        if (!postId) {
            alert("잘못된 접근입니다.");
            navigate(-1);
            return;
        }

        const fetchData = async () => {
            try {
                // 두 개의 API를 병렬로 호출 (내 글 조회 + 답장 조회)
                // 답장 조회는 실패(404)할 수도 있으므로 Promise.allSettled를 사용하거나 개별 try-catch를 할 수 있습니다.
                // 여기서는 각각 fetch하여 처리합니다.

                // 1. 내 마음 글 조회 (GET /posts/{postId})
                const postRes = await fetch(`https://api.dearhaeny.store/posts/${postId}`);
                const postJson = await postRes.json();

                // 2. 답장 조회 (GET /posts/{postId}/reply 라고 가정)
                // 명세서에 "해당 마음 글에 대한 답장" 오류 메시지가 있는 것으로 보아 
                // 게시글 ID로 답장을 찾는 엔드포인트가 있을 것입니다.
                const replyRes = await fetch(`https://api.dearhaeny.store/posts/${postId}/reply`);
                const replyJson = await replyRes.json();

                if (postJson) { // 성공 여부 필드가 명세서에 없어서 데이터 유무로 판단하거나, HTTP status로 판단
                    // 명세서 예시: { postId: 8, ... } -> 바로 객체가 오는지, result 감싸져 있는지 확인 필요.
                    // 제공해주신 명세에는 바로 객체가 오는 것처럼 보이지만, 
                    // 보통은 { isSuccess: true, result: { ... } } 형태일 수 있습니다.
                    // 일단 제공해주신 "반환 데이터 - 성공" 포맷(바로 객체)에 맞춥니다.

                    // 만약 실제 API가 { result: { ... } } 형태라면 postJson.result 로 접근해야 합니다.
                    // 안전하게 처리하기 위해 아래와 같이 작성합니다.
                    const postResult = postJson.result || postJson;
                    setPostData(postResult);
                }

                if (replyJson) {
                    // 답장 성공 시
                    if (replyJson.replyId || (replyJson.result && replyJson.result.replyId)) {
                        const replyResult = replyJson.result || replyJson;
                        setReplyData(replyResult);
                    } else {
                        // 답장 실패 (404 등) -> null로 둠
                        setReplyData(null);
                    }
                }

            } catch (error) {
                console.error("API Error:", error);
                alert("데이터를 불러오는 중 오류가 발생했습니다.");
                navigate(-1);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [postId, navigate]);

    // 로딩 중 표시 (기존 스타일 활용)
    if (isLoading) {
        return <div className="Loading_view" style={{ backgroundColor: '#FFF8E6' }}></div>;
    }

    // 데이터가 없을 경우 방어
    if (!postData) return null;

    return (
        <div className="Result_view">

            {/* ✅ 상단 헤더 (뒤로가기 버튼) */}
            <div className="top-nav" style={{ justifyContent: 'flex-start', paddingBottom: '0' }}>
                <img
                    src={Arrow}
                    alt="뒤로가기"
                    onClick={() => navigate(-1)}
                    style={{ width: '24px', cursor: 'pointer' }}
                />
            </div>

            {/* 탭 헤더 */}
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
                                {tagLabels[postData.postType] || postData.postType}
                            </button>
                        </div>

                        <h2 className="user-title">{postData.nickname}님의 마음</h2>

                        {/* 작성 시간 */}
                        <p className="date">{formatDate(postData.createdAt)}</p>

                        <div className="divider"></div>

                        <p className="user-message">
                            {postData.content}
                        </p>
                    </div>
                )}

                {/* [탭 2] 해니의 답장 */}
                {activeTab === 'reply' && (
                    <div className="reply-wrap">
                        <img src={ResultCharacter} alt="편지 든 해니" className="reply-img" />

                        <div className="reply-divider"></div>

                        <div className="reply-box">
                            {replyData ? (
                                <>
                                    <p className="reply-text" style={{ whiteSpace: 'pre-wrap' }}>
                                        {replyData.content}
                                    </p>
                                    <div className="reply-date">
                                        {formatDate(replyData.createdAt)}
                                    </div>
                                </>
                            ) : (
                                // 답장이 없을 때 (404 등) 보여줄 문구
                                <p className="reply-text" style={{ textAlign: 'center', color: '#999' }}>
                                    아직 해니가 답장을 쓰고 있어요.<br />
                                    조금만 더 기다려주세요!
                                </p>
                            )}
                        </div>
                    </div>
                )}

            </div>

            {/* 하단 버튼 (필요 없다면 삭제 가능) */}
            <div className="bottom-area">
                <button className="home-btn" onClick={() => navigate('/')}>처음으로 돌아가기</button>
            </div>
        </div>
    );
};

export default Result_archive;