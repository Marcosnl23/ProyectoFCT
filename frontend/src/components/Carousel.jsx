import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import imagen1 from '../assets/image1.jpg';
import imagen2 from '../assets/image2.jpg';
import imagen3 from '../assets/image3.jpg';
import '../css/Carousel.css'; // Asegúrate de crear este archivo CSS

function CarouselComponent() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div className="carousel-container">
      <Carousel 
        activeIndex={index}
        onSelect={handleSelect}
        className="custom-carousel"
        interval={6000} 
        controls={true}
        indicators={true}
        pause={false}
      >
        <Carousel.Item>
          <div className="carousel-image-container">
            <img
              className="d-block w-100"
              src={imagen1}
              alt="Primera diapositiva"
            />
            <div className="overlay"></div>
          </div>
          <div className="carousel-content">
            <h2>Nueva Colección</h2>
            <p>Descubre las últimas tendencias en moda.</p>
            <div className="carousel-indicators-custom">
              <span className={index === 0 ? "indicator active" : "indicator"}></span>
              <span className={index === 1 ? "indicator active" : "indicator"}></span>
              <span className={index === 2 ? "indicator active" : "indicator"}></span>
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="carousel-image-container">
            <img
              className="d-block w-100"
              src={imagen2}
              alt="Segunda diapositiva"
            />
            <div className="overlay"></div>
          </div>
          <div className="carousel-content">
            <h2>Ofertas Especiales</h2>
            <p>Hasta 50% de descuento en productos seleccionados.</p>
            <div className="carousel-indicators-custom">
              <span className={index === 0 ? "indicator active" : "indicator"}></span>
              <span className={index === 1 ? "indicator active" : "indicator"}></span>
              <span className={index === 2 ? "indicator active" : "indicator"}></span>
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="carousel-image-container">
            <img
              className="d-block w-100"
              src={imagen3}
              alt="Tercera diapositiva"
            />
            <div className="overlay"></div>
          </div>
          <div className="carousel-content">
            <h2>Envío Gratis</h2>
            <p>En todas las compras superiores a 50€.</p>
            <div className="carousel-indicators-custom">
              <span className={index === 0 ? "indicator active" : "indicator"}></span>
              <span className={index === 1 ? "indicator active" : "indicator"}></span>
              <span className={index === 2 ? "indicator active" : "indicator"}></span>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default CarouselComponent;