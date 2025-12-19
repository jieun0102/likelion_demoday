import React from 'react'
import '../../assets/sass/Post.scss'
import Arrow from '../../assets/img/icon_arrow_left.png'
import Line from '../../assets/img/Line 2.png'

const Post_main = () => {
  return (
    <div>
      <div className="Post_main_wrap">
        <div className="Post_main_header">
            <img src={Arrow} alt="" />
        </div>
        <div className="Post_main_name">
            <div className="Post_main_name_title">
                <h1>해니가 기억할 이름을 적어주세요!</h1>
                <div className="Post_main_name_input">
                    <input type="text" />
                <img src={Line} alt="" />
                </div>
            </div>
        </div>
        <div className="Post_main_category"></div>
        <div className="Post_main_write"></div>
        <div className="Post_main_btn"></div>
      </div>
    </div>
  )
}

export default Post_main
