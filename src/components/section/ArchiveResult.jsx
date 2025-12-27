// ArchiveResult.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/sass/ArchiveResult.scss';

import ResultCharacter from '../../assets/img/답장캐릭터.png';
import Arrow from '../../assets/img/icon_arrow_left.png';

const ArchiveResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { postId } = location.state || {};

    const [activeTab, setActiveTab] = useState('my');
    const [postData, setPostData] = useState(null);
    const [replyData, setReplyData] = useState(null);
    const [loading, setLoading] = useState(true);

    const anonId = localStorage.getItem('anonId');

    // ✅ 백엔드 enum → 한글 매핑
    const tagLabels = {
        NEW_YEAR_WISH: '새해 소원',
        INNER_THOUGHT: '속마음',
        COURAGE: '용기 얻기',
    };

    useEffect(() => {
        if (!postId) {
            navigate('/Archive');
            return;
        }

        const fetchData = async () => {
            try {
                // 🔹 단건 글 조회
                const postRes = await fetch(
                    `https://api.dearhaeny.store/posts/${postId}`
                );
                const postJson = await postRes.json();
                setPostData(postJson);

                // 🔹 답장 조회
                const replyRes = await fetch(
                    `https://api.dearhaeny.store/posts/${postId}/reply`,
                    { headers: { anonId } }
                );

                if (replyRes.ok) {
                    const replyJson = await replyRes.json();
                    setReplyData(replyJson);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [postId, navigate, anonId]);

    const formatDate = (dateInput) => {
        if (!dateInput) return '';
        const d = new Date(dateInput);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
            2,
            '0'
        )}.${String(d.getDate()).padStart(2, '0')} ${String(
            d.getHours()
        ).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    if (loading || !postData) return null;

    // ✅ 핵심: 단건 API는 postType 사용
    const categoryLabel =
        tagLabels[postData.postType] ?? postData.postType;

    return (
        <div className="Result_view">
            {/* header */}
            <div className="top-nav">
                <img src={Arrow} alt="back" onClick={() => navigate(-1)} />
            </div>

            {/* tabs */}
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

            {/* content */}
            <div className="tab-content">
                {activeTab === 'my' && (
                    <div className="my-letter-view">
                        {/* ✅ 카테고리 pill */}
                        <div className="category-pill">
                            {categoryLabel}
                        </div>

                        <h2 className="user-title">{postData.nickname}님의 마음</h2>
                        <p className="date">{formatDate(postData.createdAt)}</p>

                        <div className="divider" />
                        <p className="user-message">{postData.content}</p>
                    </div>
                )}

                {activeTab === 'reply' && (
                    <div className="reply-wrap">
                        <img
                            src={ResultCharacter}
                            alt=""
                            className="reply-img"
                        />
                        <div className="reply-divider" />
                        <div className="reply-box">
                            <p className="reply-text">
                                {replyData?.content ||
                                    '해니가 아직 답장을 준비 중이에요.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArchiveResult;
