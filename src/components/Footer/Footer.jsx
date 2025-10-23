import '../../style/Footer.css';

function Footer() {
  return (
    <footer className="main-footer">
      <strong>
        Copyright &copy; 2025{' '}
        <a href="#" rel="noopener noreferrer">Gestión de Eventos</a>.
      </strong>{' '}
      Todos los derechos reservados.
      <div className="float-right d-none d-sm-inline-block">
        <b>Versión</b> 1.0.0
      </div>
    </footer>
  );
}

export default Footer;
