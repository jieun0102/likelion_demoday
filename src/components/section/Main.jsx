import React from 'react'
import '../../assets/sass/Main.scss';
import Mainimg from '../../assets/img/메인캐릭터.png'
import Logo from '../../assets/img/haeny_logo.png'
import BgImg from '../../assets/img/bg_main.png'
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();

  return (
    <div className="Main_wrap">

      <img
        src={Mainimg}
        alt="새해 요정 해니"
        className="character-image"
      />

      <div className="text-area">
        <img src={Logo} 
        alt="Dear haeny"
        className='Logo' 
        />

        <p className="subtitle">
          새해의 첫 마음을 새해 요정, 해니에게 보내보세요
        </p>
      </div>


      <div className="button-group">
        <button className="btn btn-primary" onClick={() => navigate('/Post_main')}>
          해니에게 마음 보내기
        </button>

        <button className="btn btn-secondary" onClick={() => navigate('/Result_archive')}>
          해니의 마음 모음함
        </button>
      </div>
    </div>
  );
  
}

export default Main
