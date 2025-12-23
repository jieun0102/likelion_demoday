import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/sass/Post.scss';
import Arrow from '../../assets/img/icon_arrow_left.png';
import Line from '../../assets/img/Line 2.png';
import Delete from '../../assets/img/icon_delete.png';

const Post_main = () => {
    const navigate = useNavigate();

    // 상태 관리
    const [name, setName] = useState(""); // nickname
    const [feature, setFeature] = useState(null); // postType
    const [content, setContent] = useState(""); // content
    const [isFocused, setIsFocused] = useState(false);
    const maxLength = 100;

    // 카테고리 한글명을 API 명세서 영문 값으로 변환하는 매퍼
    const categoryMap = {
        "새해": "NEW_YEAR_WISH",
        "속마음": "INNER_THOUGHT",
        "용기": "COURAGE"
    };

    const toggleFeature = (value) => {
        setFeature(prev => (prev === value ? null : value));
    };

    // API 통신 함수
    const handleSubmit = async () => {
        // 유효성 검사 (명세서 실패 케이스 대응)
        if (!name || !feature || !content) {
            alert("닉네임, 마음 카테고리, 내용을 모두 입력해주세요.");
            return;
        }


        const postData = {
            nickname: name,
            postType: categoryMap[feature], // 영문 값으로 변환하여 전송
            content: content
        };

        try {
            const response = await fetch('https://api.dearhaeny.store/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            const data = await response.json();

            if (data.isSuccess) {
                const { postId, writerUuid } = data.result;
                console.log("서버에서 받은 UUID:", writerUuid);
                const savedUuids = JSON.parse(localStorage.getItem('myPostUuids')) || [];
                if (!savedUuids.includes(writerUuid)) {
                    savedUuids.push(writerUuid);
                    localStorage.setItem('myPostUuids', JSON.stringify(savedUuids));
                }

                navigate('/Result', {
                    state: {
                        name: name,
                        tag: feature,
                        message: content,
                        postId: postId,
                        writerUuid: writerUuid
                    }
                }); // 성공 시 결과화면으로 이동
            } else {
                // 서버에서 내려준 에러 메시지 처리 (중복 닉네임 등)
                alert(data.message || "오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("서버 내부 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            <div className="Post_main_wrap">
                <div className="Post_main_header">
                    <img src={Arrow} alt="뒤로가기" onClick={() => navigate(-1)} />
                </div>

                <div className="Post_main_name">
                    <div className="Post_main_name_title">
                        <h1>해니가 기억할 이름을 적어주세요!</h1>
                        <div className="Post_main_name_input">
                            <input
                                type="text"
                                placeholder='예) 수정'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                            />
                            {name.length > 0 && isFocused && (
                                <button type="button" className="delete active"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        setName("");
                                    }}>
                                    <img src={Delete} alt="삭제" />
                                </button>
                            )}
                        </div>
                        <div className="Post_main_name_input_line">
                            <img src={Line} alt="" />
                        </div>
                    </div>
                </div>

                <div className="Post_main_category">
                    <h1>지금, 어떤 마음을 해니에게 전하고 싶나요?</h1>
                    <div className="Post_main_category_btn">
                        <button
                            className={`main_category01 ${feature === "새해" ? "selected" : ""}`}
                            onClick={() => toggleFeature("새해")}>새해 소원</button>
                        <button
                            className={`main_category02 ${feature === "속마음" ? "selected" : ""}`}
                            onClick={() => toggleFeature("속마음")}>속마음</button>
                        <button
                            className={`main_category03 ${feature === "용기" ? "selected" : ""}`}
                            onClick={() => toggleFeature("용기")}>용기 얻기</button>
                    </div>
                    <img src={Line} alt="" />
                </div>

                <div className="Post_main_write">
                    <textarea
                        placeholder="해니에게 전할 내용을 적어주세요!"
                        value={content}
                        maxLength={maxLength}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <div className={`text_count ${content.length > 0 ? "active" : ""}`}>
                        {content.length}/{maxLength}
                    </div>
                </div>

                <div className="Post_main_btn">
                    <button
                        className={`write_btn ${(content.length > 0 && name && feature) ? "active" : ""}`}
                        onClick={handleSubmit} // 클릭 시 API 전송
                    >
                        해니에게 마음 전달하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Post_main;