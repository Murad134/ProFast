import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import img1 from '../../../assets/banner/banner1.png'
import img2 from '../../../assets/banner/banner2.png'
import img3 from '../../../assets/banner/banner3.png'
function Banner() {
    return (
        <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false} showStatus={false} interval={3000}>
            <div>
                <img src={img1} />
                <p className="legend">1</p>
            </div>
            <div>
                <img src={img2} />
                <p className="legend">2</p>
            </div>
            <div>
                <img src={img3} />
                <p className="legend">3</p>
            </div>
        </Carousel>
    )
}
export default Banner