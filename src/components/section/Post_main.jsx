import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/sass/Post.scss';
import Arrow from '../../assets/img/icon_arrow_left.png';
import Line from '../../assets/img/Line 2.png';
import Delete from '../../assets/img/icon_delete.png';

const Post_main = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [feature, setFeature] = useState(null);
    const [content, setContent] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const maxLength = 100;

    const categoryMap = {
        새해: 'NEW_YEAR_WISH',
        속마음: 'INNER_THOUGHT',
        용기: 'COURAGE',
    };

    const toggleFeature = (value) => {
        setFeature((prev) => (prev === value ? null : value));
    };

    const handleSubmit = async () => {
        if (!name || !feature || !content) {
            alert('닉네임, 마음 카테고리, 내용을 모두 입력해주세요.');
            return;
        }

        const postData = {
            nickname: name,
            postType: categoryMap[feature],
            content,
        };

        const anonId = localStorage.getItem('anonId');

        try {
            const response = await fetch('https://api.dearhaeny.store/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(anonId && { anonId }),
                },
                body: JSON.stringify(postData),
            });

            const data = await response.json();

            if (data.result?.writerUuid) {
                const { postId, writerUuid } = data.result;

                // ✅ 처음 한 번만 anonId 저장
                if (!localStorage.getItem('anonId')) {
                    localStorage.setItem('anonId', writerUuid);
                }

                navigate('/Result', {
                    state: {
                        postId,
                        name,
                        tag: feature,
                        message: content,
                    },
                });
            } else {
                alert('글 저장에 실패했습니다.');
            }
        } catch (e) {
            console.error(e);
            alert('서버 오류');
        }
    };

    return (
        <div className="Post_main_wrap">
            <div className="Post_main_header">
                <img src={Arrow} alt="뒤로가기" onClick={() => navigate(-1)} />
            </div>

            <div className="Post_main_name">
                <h1>해니가 기억할 이름을 적어주세요!</h1>
                <div className="Post_main_name_input">
                    <input
                        value={name}
                        placeholder="예) 수정"
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    {name && isFocused && (
                        <button
                            className="active"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setName('');
                            }}
                        >
                            <img src={Delete} alt="삭제" />
                        </button>
                    )}
                </div>
                <img src={Line} alt="" />
            </div>

            <div className="Post_main_category">
                <h1>지금, 어떤 마음을 해니에게 전하고 싶나요?</h1>
                <div className="Post_main_category_btn">
                    <button
                        className={`main_category01 ${feature === '새해' ? 'selected' : ''}`}
                        onClick={() => toggleFeature('새해')}
                    >
                        새해 소원
                    </button>
                    <button
                        className={`main_category02 ${feature === '속마음' ? 'selected' : ''}`}
                        onClick={() => toggleFeature('속마음')}
                    >
                        속마음
                    </button>
                    <button
                        className={`main_category03 ${feature === '용기' ? 'selected' : ''}`}
                        onClick={() => toggleFeature('용기')}
                    >
                        용기 얻기
                    </button>
                </div>
                <img src={Line} alt="" />
            </div>

            <div className="Post_main_write">
                <textarea
                    value={content}
                    maxLength={maxLength}
                    placeholder="해니에게 전할 내용을 적어주세요!"
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className={`text_count ${content ? 'active' : ''}`}>
                    {content.length}/{maxLength}
                </div>
            </div>

            <div className="Post_main_btn">
                <button
                    className={`write_btn ${name && feature && content ? 'active' : ''}`}
                    onClick={handleSubmit}
                >
                    해니에게 마음 전달하기
                </button>
            </div>
        </div>
    );
};

export default Post_main;
