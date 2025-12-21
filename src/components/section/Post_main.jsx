import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../../assets/sass/Post.scss'
import Arrow from '../../assets/img/icon_arrow_left.png'
import Line from '../../assets/img/Line 2.png'
import Delete from '../../assets/img/icon_delete.png'

const Post_main = () => {
    const navigate = useNavigate();
    const [feature, setFeature] = useState(null);

    const toggleFeature = (value) => {
        setFeature(prev => (prev === value ? null : value));
    };

    const [content, setContent] = useState("");
    const [name, setName] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const maxLength = 100;


    return (
        <div>
            <div className="Post_main_wrap">
                <div className="Post_main_header">
                    <img src={Arrow} alt="" onClick={() => navigate(-1)}/></div>
                <div className="Post_main_name">
                    <div className="Post_main_name_title">
                        <h1>해니가 기억할 이름을 적어주세요!</h1>
                        <div className="Post_main_name_input">
                            <input type="text" placeholder='예) 수정' value={name}
                                onChange={(e) => setName(e.target.value)} onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)} />
                            {name.length > 0 && isFocused && (
                                <button type="button" className="delete active"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        setName("");
                                    }}>
                                    <img src={Delete} alt="" /></button>
                            )}
                        </div>
                        <div className="Post_main_name_input_line">
                            <img src={Line} alt="" /></div>
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
