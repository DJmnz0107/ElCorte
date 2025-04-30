import React from 'react';
import '../css/TermsAndConditios.css'; // Asegúrate de que la ruta sea correcta

const TermsAndConditions = () => {

  
  return (
    <div className="terms-container">
      <div className="terms-content">
        <h1 className="terms-title">Términos y Condiciones de Usso de La Tienda</h1>
   
        
        <div className="terms-intro">
          <p>
            Bienvenido a La Tienda. Al acceder o usar el corte, usted acepta estos Términos y Condiciones. 
            Si no está de acuerdo, no utilice el sitio.
          </p>
        </div>
        
        <div className="terms-sections">
          <section className="terms-section">
            <h2 className="section-title">1. Productos</h2>
            <p>La Tienda ofrece cortes de carne y productos relacionados. La disponibilidad de los productos está sujeta a cambios.</p>
          </section>
          
          <section className="terms-section">
            <h2 className="section-title">2. Proceso de Compra</h2>
            <p>Para realizar una compra, añada productos al carrito, proporcione información de pago y confirme su pedido. Los precios incluyen impuestos y deben pagarse al momento de la compra.</p>
          </section>
          
          <section className="terms-section">
            <h2 className="section-title">3. Envíos</h2>
            <p>Realizamos envíos a la dirección proporcionada por el Cliente. Es responsabilidad del Cliente asegurarse de que la dirección sea correcta. La Tienda no se hace responsable de problemas derivados de direcciones erróneas.</p>
          </section>
          
          <section className="terms-section">
            <h2 className="section-title">4. Devoluciones</h2>
            <p>Debido a la naturaleza perecedera de los productos, no aceptamos devoluciones de carne, salvo que los productos lleguen en mal estado o no sean los solicitados.</p>
          </section>
          
          <section className="terms-section">
            <h2 className="section-title">5. Privacidad</h2>
            <p>Nos comprometemos a proteger su información personal según nuestra Política de Privacidad.</p>
          </section>
          
          <section className="terms-section">
            <h2 className="section-title">6. Limitación de Responsabilidad</h2>
            <p>La Tienda no se hace responsable por daños indirectos o incidentales que surjan del uso del Sitio o productos adquiridos.</p>
          </section>
          
          <section className="terms-section">
            <h2 className="section-title">7. Modificaciones</h2>
            <p>La Tienda se reserva el derecho de modificar estos Términos en cualquier momento. Los cambios se publicarán en esta página y serán efectivos de inmediato.</p>
          </section>
          
          <section className="terms-section">
            <h2 className="section-title">8. Ley Aplicable</h2>
            <p>Estos Términos se rigen por las leyes de El Salvador . Cualquier disputa se resolverá en los tribunales de San Salvador .</p>
          </section>
        </div>
        
        <div className="terms-contact">
          <h2>Contacto</h2>
          <p>Correo electrónico: ElCorteContact@gmail.com</p>
          <p>Teléfono: 7670-6009</p>
          <p>Dirección: Calle las amapolas Casa #133   </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;

