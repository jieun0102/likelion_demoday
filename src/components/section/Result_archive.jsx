import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/sass/Result_archive.scss';
import Arrow from '../../assets/img/icon_arrow_left.png';

const FILTERS = [
    { key: 'ALL', label: '전체' },
    { key: 'NEW_YEAR_WISH', label: '새해 소원' },
    { key: 'INNER_THOUGHT', label: '속마음' },
    { key: 'COURAGE', label: '용기 얻기' },
];

const tagLabels = {
    NEW_YEAR_WISH: '새해 소원',
    INNER_THOUGHT: '속마음',
    COURAGE: '용기 얻기',
};

const formatDate = (dateInput) => {
    const date = new Date(dateInput);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
        date.getDate()
    ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(
        date.getMinutes()
    ).padStart(2, '0')}`;
};

const Result_archive = () => {
    const navigate = useNavigate();

    const [selectedFilter, setSelectedFilter] = useState('ALL');
    const [posts, setPosts] = useState([]);
    const [totalCount, setTotalCount] = useState(0); // ✅ 추가
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);

            try {
                const anonId = localStorage.getItem('anonId');

                if (!anonId) {
                    setPosts([]);
                    setTotalCount(0);
                    return;
                }

                const url =
                    selectedFilter === 'ALL'
                        ? 'https://api.dearhaeny.store/posts'
                        : `https://api.dearhaeny.store/posts?category=${selectedFilter}`;

                const res = await fetch(url, {
                    headers: { anonId },
                });

                const data = await res.json();

                if (Array.isArray(data.posts)) {
                    setPosts(data.posts);
                    setTotalCount(data.totalCount ?? data.posts.length); // ✅ 핵심
                } else {
                    setPosts([]);
                    setTotalCount(0);
                }
            } catch (e) {
                console.error('보관함 조회 실패:', e);
                setPosts([]);
                setTotalCount(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [selectedFilter]);

    return (
        <div className="Result_view">
            {/* 상단 네비 */}
            <div className="top-nav">
                <img src={Arrow} alt="back" onClick={() => navigate('/')} />
            </div>

            {/* 필터 */}
            <div className="filter-section">
                <div className="filter-chips">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter.key}
                            className={`chip ${selectedFilter === filter.key ? 'active' : ''}`}
                            onClick={() => setSelectedFilter(filter.key)}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 결과 요약 */}
            <div className="result-summary">
                <span>{FILTERS.find((f) => f.key === selectedFilter)?.label}</span>
                <span>{totalCount}개의 결과</span> {/* ✅ 수정 */}
            </div>

            {/* 리스트 */}
            <div className="message-list">
                {isLoading ? (
                    <p className="empty-text">불러오는 중...</p>
                ) : posts.length === 0 ? (
                    <p className="empty-text">아직 작성된 편지가 없어요.</p>
                ) : (
                    posts.map((post) => (
                        <div
                            key={post.postId}
                            className="archive-card"
                            onClick={() =>
                                navigate('/ArchiveResult', {
                                    state: { postId: post.postId },
                                })
                            }
                        >
                            <span className="emotion-chip">
                                {tagLabels[post.postType]} {/* ✅ 수정 */}
                            </span>
                            <h3 className="card-title">
                                {post.nickname}님의 마음
                            </h3>
                            <p className="card-date">
                                {formatDate(post.createdAt)}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Result_archive;
