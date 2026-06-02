'use client';

import { useEffect, useMemo, useState } from 'react';

const services = [
  'Progressiva',
  'Tratamento capilar',
  'Corte',
  'Relaxamento',
  'Luzes',
  'Terapia capilar com microagulhamento',
  'Combo: Escova + Hidratação',
  'Combo: Corte + Hidratação + Escova',
  'Outro'
];

const today = new Date().toISOString().slice(0, 10);

const emptySale = {
  sale_date: today,
  client_name: '',
  service: 'Progressiva',
  value: '',
  payment_method: 'Pix',
  status: 'Pago',
  notes: ''
};

const emptyAppointment = {
  appointment_date: today,
  appointment_time: '09:00',
  client_name: '',
  phone: '',
  service: 'Progressiva',
  status: 'Agendado',
  notes: ''
};

function formatMoney(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function getMonthKey(date) {
  return (date || '').slice(0, 7);
}

export default function AdminApp() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [login, setLogin] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [tab, setTab] = useState('dashboard');
  const [sales, setSales] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');

  const [saleForm, setSaleForm] = useState(emptySale);
  const [editingSale, setEditingSale] = useState(null);

  const [appointmentForm, setAppointmentForm] = useState(emptyAppointment);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const [calc, setCalc] = useState({ a: '', b: '', op: '+' });

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    setAuthenticated(Boolean(data.authenticated));
    setChecking(false);
    if (data.authenticated) loadData();
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(login)
    });

    const data = await res.json();

    if (!res.ok) {
      setLoginError(data.error || 'Erro ao entrar.');
      return;
    }

    setAuthenticated(true);
    loadData();
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuthenticated(false);
  }

  async function loadData() {
    setMessage('Carregando dados...');

    const [salesRes, appointmentsRes, notesRes] = await Promise.all([
      fetch('/api/sales'),
      fetch('/api/appointments'),
      fetch('/api/notes')
    ]);

    if (salesRes.status === 401 || appointmentsRes.status === 401 || notesRes.status === 401) {
      setAuthenticated(false);
      return;
    }

    const salesData = await salesRes.json();
    const appointmentsData = await appointmentsRes.json();
    const notesData = await notesRes.json();

    if (salesData.sales) setSales(salesData.sales);
    if (appointmentsData.appointments) setAppointments(appointmentsData.appointments);
    if (notesData.note) setNote(notesData.note.content || '');

    setMessage('');
  }

  async function saveSale(e) {
    e.preventDefault();

    const url = editingSale ? `/api/sales/${editingSale}` : '/api/sales';
    const method = editingSale ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saleForm)
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || 'Erro ao salvar venda.');
      return;
    }

    setSaleForm(emptySale);
    setEditingSale(null);
    setMessage('Venda salva com sucesso!');
    loadData();
  }

  function editSale(sale) {
    setEditingSale(sale.id);
    setSaleForm({
      sale_date: sale.sale_date || today,
      client_name: sale.client_name || '',
      service: sale.service || 'Progressiva',
      value: sale.value || '',
      payment_method: sale.payment_method || 'Pix',
      status: sale.status || 'Pago',
      notes: sale.notes || ''
    });
    setTab('vendas');
  }

  async function deleteSale(id) {
    if (!confirm('Deseja apagar esta venda?')) return;
    await fetch(`/api/sales/${id}`, { method: 'DELETE' });
    setMessage('Venda apagada.');
    loadData();
  }

  async function saveAppointment(e) {
    e.preventDefault();

    const url = editingAppointment ? `/api/appointments/${editingAppointment}` : '/api/appointments';
    const method = editingAppointment ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentForm)
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || 'Erro ao salvar horário.');
      return;
    }

    setAppointmentForm(emptyAppointment);
    setEditingAppointment(null);
    setMessage('Horário salvo com sucesso!');
    loadData();
  }

  function editAppointment(item) {
    setEditingAppointment(item.id);
    setAppointmentForm({
      appointment_date: item.appointment_date || today,
      appointment_time: item.appointment_time?.slice(0, 5) || '09:00',
      client_name: item.client_name || '',
      phone: item.phone || '',
      service: item.service || 'Progressiva',
      status: item.status || 'Agendado',
      notes: item.notes || ''
    });
    setTab('agenda');
  }

  async function deleteAppointment(id) {
    if (!confirm('Deseja apagar este horário?')) return;
    await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    setMessage('Horário apagado.');
    loadData();
  }

  async function saveNote() {
    const res = await fetch('/api/notes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: note })
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Erro ao salvar anotação.');
      return;
    }

    setMessage('Anotações salvas!');
  }

  const monthSales = useMemo(() => {
    const current = new Date().toISOString().slice(0, 7);
    return sales.filter((sale) => getMonthKey(sale.sale_date) === current);
  }, [sales]);

  const stats = useMemo(() => {
    const totalMonth = monthSales.reduce((sum, sale) => sum + Number(sale.value || 0), 0);
    const totalAll = sales.reduce((sum, sale) => sum + Number(sale.value || 0), 0);

    const counts = {};
    monthSales.forEach((sale) => {
      counts[sale.service] = (counts[sale.service] || 0) + 1;
    });

    const topService = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Nenhum';

    return {
      totalMonth,
      totalAll,
      countMonth: monthSales.length,
      appointmentsCount: appointments.length,
      topService
    };
  }, [sales, monthSales, appointments]);

  function exportCSV() {
    const header = ['Data', 'Cliente', 'Serviço', 'Valor', 'Pagamento', 'Status', 'Observação'];
    const rows = sales.map((sale) => [
      sale.sale_date,
      sale.client_name,
      sale.service,
      sale.value,
      sale.payment_method,
      sale.status,
      sale.notes
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((item) => `"${String(item || '').replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vendas-salao-da-jana.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const calcResult = useMemo(() => {
    const a = Number(calc.a);
    const b = Number(calc.b);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return '';
    if (calc.op === '+') return a + b;
    if (calc.op === '-') return a - b;
    if (calc.op === '*') return a * b;
    if (calc.op === '/') return b === 0 ? 'Não dividir por zero' : a / b;
    return '';
  }, [calc]);

  if (checking) {
    return <div className="adminShell centerScreen">Carregando...</div>;
  }

  if (!authenticated) {
    return (
      <main className="adminLogin">
        <form className="loginCard" onSubmit={handleLogin}>
          <span>🔐 Painel Administrativo</span>
          <h1>Salão da Jana</h1>
          <p>Entre para gerenciar vendas, horários e anotações.</p>

          <label>Email</label>
          <input
            type="email"
            value={login.email}
            onChange={(e) => setLogin({ ...login, email: e.target.value })}
            placeholder="email configurado"
            required
          />

          <label>Senha</label>
          <input
            type="password"
            value={login.password}
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
            placeholder="senha configurada"
            required
          />

          {loginError && <div className="alert error">{loginError}</div>}

          <button className="primaryBtn" type="submit">Entrar</button>
          <a className="backLink" href="/">Voltar para o site</a>
        </form>
      </main>
    );
  }

  return (
    <main className="adminShell">
      <aside className="sidebar">
        <div className="adminBrand">
          <b>Salão da Jana</b>
          <span>Painel Admin</span>
        </div>

        <button className={tab === 'dashboard' ? 'active' : ''} onClick={() => setTab('dashboard')}>📊 Dashboard</button>
        <button className={tab === 'vendas' ? 'active' : ''} onClick={() => setTab('vendas')}>💰 Vendas</button>
        <button className={tab === 'agenda' ? 'active' : ''} onClick={() => setTab('agenda')}>📅 Horários</button>
        <button className={tab === 'notas' ? 'active' : ''} onClick={() => setTab('notas')}>📝 Bloco de notas</button>
        <button className={tab === 'calculadora' ? 'active' : ''} onClick={() => setTab('calculadora')}>🧮 Calculadora</button>

        <div className="sidebarBottom">
          <button onClick={loadData}>🔄 Atualizar</button>
          <button onClick={logout}>🚪 Sair</button>
        </div>
      </aside>

      <section className="adminContent">
        <header className="adminHeader">
          <div>
            <h1>{tabLabels[tab]}</h1>
            <p>Gerenciamento do Salão da Jana</p>
          </div>
          <a href="/" className="ghostBtn">Ver site</a>
        </header>

        {message && <div className="alert">{message}</div>}

        {tab === 'dashboard' && (
          <>
            <div className="statsGrid adminStats">
              <div><span>Vendido no mês</span><b>{formatMoney(stats.totalMonth)}</b></div>
              <div><span>Atendimentos no mês</span><b>{stats.countMonth}</b></div>
              <div><span>Horários cadastrados</span><b>{stats.appointmentsCount}</b></div>
              <div><span>Serviço mais vendido</span><b>{stats.topService}</b></div>
            </div>

            <div className="panelGrid">
              <div className="panel">
                <h2>Últimas vendas</h2>
                <SimpleSalesTable sales={sales.slice(0, 6)} onEdit={editSale} onDelete={deleteSale} />
              </div>

              <div className="panel">
                <h2>Próximos horários</h2>
                <AppointmentList appointments={appointments.slice(0, 6)} onEdit={editAppointment} onDelete={deleteAppointment} />
              </div>
            </div>
          </>
        )}

        {tab === 'vendas' && (
          <div className="panel">
            <div className="panelTitle">
              <h2>{editingSale ? 'Editar venda' : 'Nova venda'}</h2>
              <button className="ghostBtn smallBtn" onClick={exportCSV}>Exportar CSV</button>
            </div>

            <form className="formGrid" onSubmit={saveSale}>
              <input type="date" value={saleForm.sale_date} onChange={(e) => setSaleForm({ ...saleForm, sale_date: e.target.value })} required />
              <input placeholder="Cliente" value={saleForm.client_name} onChange={(e) => setSaleForm({ ...saleForm, client_name: e.target.value })} required />
              <select value={saleForm.service} onChange={(e) => setSaleForm({ ...saleForm, service: e.target.value })}>
                {services.map((s) => <option key={s}>{s}</option>)}
              </select>
              <input type="number" step="0.01" placeholder="Valor" value={saleForm.value} onChange={(e) => setSaleForm({ ...saleForm, value: e.target.value })} required />
              <select value={saleForm.payment_method} onChange={(e) => setSaleForm({ ...saleForm, payment_method: e.target.value })}>
                <option>Pix</option>
                <option>Dinheiro</option>
                <option>Cartão</option>
                <option>Outro</option>
              </select>
              <select value={saleForm.status} onChange={(e) => setSaleForm({ ...saleForm, status: e.target.value })}>
                <option>Pago</option>
                <option>Pendente</option>
                <option>Cancelado</option>
              </select>
              <input className="wide" placeholder="Observação" value={saleForm.notes} onChange={(e) => setSaleForm({ ...saleForm, notes: e.target.value })} />
              <button className="primaryBtn" type="submit">{editingSale ? 'Salvar edição' : 'Adicionar venda'}</button>
              {editingSale && <button className="ghostBtn" type="button" onClick={() => { setEditingSale(null); setSaleForm(emptySale); }}>Cancelar</button>}
            </form>

            <SimpleSalesTable sales={sales} onEdit={editSale} onDelete={deleteSale} />
          </div>
        )}

        {tab === 'agenda' && (
          <div className="panel">
            <h2>{editingAppointment ? 'Editar horário' : 'Novo horário'}</h2>

            <form className="formGrid" onSubmit={saveAppointment}>
              <input type="date" value={appointmentForm.appointment_date} onChange={(e) => setAppointmentForm({ ...appointmentForm, appointment_date: e.target.value })} required />
              <input type="time" value={appointmentForm.appointment_time} onChange={(e) => setAppointmentForm({ ...appointmentForm, appointment_time: e.target.value })} required />
              <input placeholder="Cliente" value={appointmentForm.client_name} onChange={(e) => setAppointmentForm({ ...appointmentForm, client_name: e.target.value })} required />
              <input placeholder="Telefone" value={appointmentForm.phone} onChange={(e) => setAppointmentForm({ ...appointmentForm, phone: e.target.value })} />
              <select value={appointmentForm.service} onChange={(e) => setAppointmentForm({ ...appointmentForm, service: e.target.value })}>
                {services.map((s) => <option key={s}>{s}</option>)}
              </select>
              <select value={appointmentForm.status} onChange={(e) => setAppointmentForm({ ...appointmentForm, status: e.target.value })}>
                <option>Agendado</option>
                <option>Concluído</option>
                <option>Cancelado</option>
              </select>
              <input className="wide" placeholder="Observação" value={appointmentForm.notes} onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })} />
              <button className="primaryBtn" type="submit">{editingAppointment ? 'Salvar edição' : 'Adicionar horário'}</button>
              {editingAppointment && <button className="ghostBtn" type="button" onClick={() => { setEditingAppointment(null); setAppointmentForm(emptyAppointment); }}>Cancelar</button>}
            </form>

            <AppointmentList appointments={appointments} onEdit={editAppointment} onDelete={deleteAppointment} />
          </div>
        )}

        {tab === 'notas' && (
          <div className="panel">
            <h2>Bloco de notas virtual</h2>
            <p className="muted">Use para anotar compras, lembretes, clientes, produtos e ideias.</p>
            <textarea className="notesArea" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Digite suas anotações aqui..." />
            <button className="primaryBtn" onClick={saveNote}>Salvar anotações</button>
          </div>
        )}

        {tab === 'calculadora' && (
          <div className="panel calculatorPanel">
            <h2>Calculadora</h2>
            <p className="muted">Use para somar vendas, descontos e valores rápidos.</p>

            <div className="calculator">
              <input type="number" value={calc.a} onChange={(e) => setCalc({ ...calc, a: e.target.value })} placeholder="Valor 1" />
              <select value={calc.op} onChange={(e) => setCalc({ ...calc, op: e.target.value })}>
                <option value="+">+</option>
                <option value="-">-</option>
                <option value="*">×</option>
                <option value="/">÷</option>
              </select>
              <input type="number" value={calc.b} onChange={(e) => setCalc({ ...calc, b: e.target.value })} placeholder="Valor 2" />
            </div>

            <div className="calcResult">
              Resultado: <b>{typeof calcResult === 'number' ? formatMoney(calcResult) : calcResult || '---'}</b>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

const tabLabels = {
  dashboard: 'Dashboard',
  vendas: 'Vendas',
  agenda: 'Horários',
  notas: 'Bloco de notas',
  calculadora: 'Calculadora'
};

function SimpleSalesTable({ sales, onEdit, onDelete }) {
  if (!sales.length) return <p className="muted">Nenhuma venda cadastrada ainda.</p>;

  return (
    <div className="responsiveTable">
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Cliente</th>
            <th>Serviço</th>
            <th>Valor</th>
            <th>Pagamento</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.sale_date}</td>
              <td>{sale.client_name}</td>
              <td>{sale.service}</td>
              <td>{formatMoney(sale.value)}</td>
              <td>{sale.payment_method}</td>
              <td>{sale.status}</td>
              <td>
                <button className="tableBtn" onClick={() => onEdit(sale)}>Editar</button>
                <button className="tableBtn danger" onClick={() => onDelete(sale.id)}>Apagar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AppointmentList({ appointments, onEdit, onDelete }) {
  if (!appointments.length) return <p className="muted">Nenhum horário cadastrado ainda.</p>;

  return (
    <div className="appointmentList">
      {appointments.map((item) => (
        <div className="appointmentItem" key={item.id}>
          <div>
            <b>{item.appointment_date} às {item.appointment_time?.slice(0, 5)}</b>
            <span>{item.client_name} • {item.service}</span>
            <small>{item.phone || 'Sem telefone'} • {item.status}</small>
            {item.notes && <small>{item.notes}</small>}
          </div>
          <div className="rowActions">
            <button className="tableBtn" onClick={() => onEdit(item)}>Editar</button>
            <button className="tableBtn danger" onClick={() => onDelete(item.id)}>Apagar</button>
          </div>
        </div>
      ))}
    </div>
  );
}
