import './globals.css';

export const metadata = {
  title: 'Salão da Jana',
  description: 'Salão da Jana - Beleza, cuidados capilares e atendimento profissional em Campos Altos/MG.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
