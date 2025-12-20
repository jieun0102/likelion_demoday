import React, { useState } from 'react'
import '../../assets/sass/Post.scss'
import Arrow from '../../assets/img/icon_arrow_left.png'
import Line from '../../assets/img/Line 2.png'

const Post_main = () => {
    const [feature, setFeature] = useState(null);

    const toggleFeature = (value) => {
        setFeature(prev => (prev === value ? null : value));
    };

    const [content, setContent] = useState("");
    const maxLength = 100;


    return (
        <div>
            <div className="Post_main_wrap">
                <div className="Post_main_header">
                    <img src={Arrow} alt="" /></div>
                <div className="Post_main_name">
                    <div className="Post_main_name_title">
                        <h1>해니가 기억할 이름을 적어주세요!</h1>
                        <div className="Post_main_name_input">
                            <input type="text" placeholder='예) 수정' />
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
                        <button className={`main_category02 ${feature === "속마음" ? "selected" : ""}`}
                            onClick={() => toggleFeature("속마음")}>속마음</button>
                        <button className={`main_category03 ${feature === "용기" ? "selected" : ""}`}
                            onClick={() => toggleFeature("용기")}>용기 얻기</button></div>
                    <img src={Line} alt="" />
                </div>
                <div className="Post_main_write">
                    <textarea placeholder="해니에게 전할 내용을 적어주세요!" value={content}
                        maxLength={maxLength}
                        onChange={(e) => setContent(e.target.value)}></textarea>
                    <div className={`text_count ${content.length > 0 ? "active" : ""}`}>
                        {content.length}/{maxLength}
                    </div>
                </div>
                <div className="Post_main_btn">
                    <button className={`write_btn ${content.length > 0 ? "active" : ""}`}>해니에게 마음 전달하기</button>
                </div>
            </div>
        </div >
    )
}

export default Post_main
