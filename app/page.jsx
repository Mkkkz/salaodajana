const services = [
  { name: 'Progressiva', price: 'a partir de R$ 170' },
  { name: 'Tratamento capilar', price: 'a partir de R$ 50' },
  { name: 'Corte', price: 'R$ 50' },
  { name: 'Relaxamento', price: 'a partir de R$ 160' },
  { name: 'Luzes', price: 'a partir de R$ 300' },
  { name: 'Terapia capilar com microagulhamento', price: 'a partir de R$ 250' },
  { name: 'Combo: Escova + Hidratação', price: 'R$ 80' },
  { name: 'Combo: Corte + Hidratação + Escova', price: 'R$ 95' }
];

const whatsapp = 'https://wa.me/5531998459954?text=Olá,%20vim%20pelo%20site%20do%20Salão%20da%20Jana%20e%20quero%20agendar%20um%20horário.';
const maps = 'https://www.google.com/maps/search/?api=1&query=Rua%20Expedito%20Antônio%20da%20Costa%20264%20Campos%20Altos%20MG';

export default function Home() {
  return (
    <main className="site">
      <nav className="topbar">
        <div className="brand">Salão da <span>Jana</span></div>
        <div className="navlinks">
          <a href="#servicos">Serviços</a>
          <a href="#contato">Contato</a>
          <a href="/admin">Admin</a>
        </div>
      </nav>

      <section className="hero salon-hero">
        <div className="heroText">
          <div className="pill">✨ Beleza, cuidado e autoestima</div>
          <h1>Realce sua beleza com um atendimento especial.</h1>
          <p>
            No <strong>Salão da Jana</strong>, você encontra serviços capilares com carinho,
            cuidado e qualidade em Campos Altos/MG.
          </p>

          <div className="heroActions">
            <a className="primaryBtn" href={whatsapp} target="_blank" rel="noreferrer">
              Agendar pelo WhatsApp
            </a>
            <a className="ghostBtn" href="#servicos">
              Ver serviços
            </a>
          </div>
        </div>

        <div className="heroCard">
          <div className="shine"></div>
          <h2>Salão da Jana</h2>
          <p>Progressiva • Luzes • Corte • Tratamentos</p>
          <div className="miniCard">
            <span>Promoção especial</span>
            <strong>Escova + Hidratação</strong>
            <b>R$ 80</b>
          </div>
        </div>
      </section>

      <section id="servicos" className="section">
        <div className="sectionHeader">
          <span>💇‍♀️ Serviços</span>
          <h2>Confira nossos atendimentos</h2>
          <p>Valores podem variar conforme o cabelo, avaliação e procedimento.</p>
        </div>

        <div className="servicesGrid">
          {services.map((service) => (
            <div className="serviceCard" key={service.name}>
              <h3>{service.name}</h3>
              <p>{service.price}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="promo">
        <div>
          <span>💖 Atendimento personalizado</span>
          <h2>Agende seu horário de forma rápida.</h2>
          <p>Entre em contato pelo WhatsApp e tire suas dúvidas sobre valores, horários e procedimentos.</p>
        </div>
        <a className="primaryBtn" href={whatsapp} target="_blank" rel="noreferrer">
          Chamar no WhatsApp
        </a>
      </section>

      <section id="contato" className="section contactGrid">
        <div className="contactBox">
          <span>📞 Contato</span>
          <h2>Fale com o Salão da Jana</h2>
          <p><strong>Telefone:</strong> (31) 99845-9954</p>
          <p><strong>Endereço:</strong> Rua Expedito Antônio da Costa, 264 - Campos Altos/MG</p>
          <div className="heroActions">
            <a className="primaryBtn" href={whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
            <a className="ghostBtn" href={maps} target="_blank" rel="noreferrer">Ver no mapa</a>
          </div>
        </div>

        <div className="hoursBox">
          <h3>🕒 Horários</h3>
          <p>Consulte a disponibilidade pelo WhatsApp.</p>
          <p className="soft">O atendimento pode variar conforme agendamento.</p>
        </div>
      </section>

      <footer>
        <p>© 2026 Salão da Jana. Site criado por LegacyJS.</p>
      </footer>
    </main>
  );
}
