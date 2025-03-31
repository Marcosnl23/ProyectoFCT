import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <Container>
          <Row className="py-5">
            <Col lg={3} md={6} sm={12} className="mb-4 mb-lg-0">
              <div className="footer-brand">
                <h5>Marcos Streetwear</h5>
                <p className="mt-3">
                  Ofrecemos productos de calidad con el mejor servicio. 
                  Tu satisfacción es nuestra prioridad.
                </p>
                <div className="social-icons">
                  <a href="#" className="social-icon"><i className="bi bi-facebook"></i></a>
                  <a href="#" className="social-icon"><i className="bi bi-instagram"></i></a>
                  <a href="#" className="social-icon"><i className="bi bi-twitter-x"></i></a>
                  <a href="#" className="social-icon"><i className="bi bi-linkedin"></i></a>
                </div>
              </div>
            </Col>
            
            <Col lg={3} md={6} sm={12} className="mb-4 mb-lg-0">
              <h5 className="footer-title">Categorías</h5>
              <ul className="footer-links">
                <li><Link to="/categoria/ropa">Ropa</Link></li>
                <li><Link to="/categoria/zapatos">Zapatos</Link></li>
                <li><Link to="/categoria/accesorios">Accesorios</Link></li>
                <li><Link to="/categoria/nuevos">Nuevos</Link></li>
                <li><Link to="/categoria/ofertas">Ofertas</Link></li>
              </ul>
            </Col>
            
            <Col lg={3} md={6} sm={12} className="mb-4 mb-lg-0">
              <h5 className="footer-title">Información</h5>
              <ul className="footer-links">
                <li><Link to="/sobre-nosotros">Sobre Nosotros</Link></li>
                <li><Link to="/politica-privacidad">Política de Privacidad</Link></li>
                <li><Link to="/terminos-condiciones">Términos y Condiciones</Link></li>
                <li><Link to="/devoluciones">Política de Devoluciones</Link></li>
                <li><Link to="/envios">Información de Envíos</Link></li>
              </ul>
            </Col>
            
            <Col lg={3} md={6} sm={12}>
              <h5 className="footer-title">Contacto</h5>
              <div className="contact-info">
                <div className="contact-item">
                  <i className="bi bi-geo-alt"></i>
                  <span>Calle Principal 123, Madrid, España</span>
                </div>
                <div className="contact-item">
                  <i className="bi bi-telephone"></i>
                  <span>+34 91 123 45 67</span>
                </div>
                <div className="contact-item">
                  <i className="bi bi-envelope"></i>
                  <span>info@tutienda.com</span>
                </div>
                <div className="contact-item">
                  <i className="bi bi-clock"></i>
                  <span>Lun-Vie: 9:00-20:00, Sáb: 10:00-15:00</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      
      <div className="footer-bottom">
        <Container>
          <Row className="py-3">
            <Col md={6} className="text-center text-md-start">
              <p className="mb-0">© {currentYear} TuTienda. Todos los derechos reservados.</p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <div className="payment-methods">
                <i className="bi bi-credit-card"></i>
                <i className="bi bi-paypal"></i>
                <i className="bi bi-cash"></i>
                <i className="bi bi-bank"></i>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;