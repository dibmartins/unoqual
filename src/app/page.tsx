import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            U
          </div>
          <span className="text-xl font-bold tracking-tight">Unoqual</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-black">Funcionalidades</Link>
          <Link href="#about" className="text-sm font-medium text-gray-600 hover:text-black">Sobre</Link>
          <Link href="/login" className="text-sm font-medium px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
            Acessar Sistema
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-8 py-24 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-6 border border-blue-100">
            <span>✨</span>
            Nova Versão MVP V1 Disponível
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 max-w-4xl leading-[1.1]">
            Gestão de Qualidade Hospitalar <br/>
            <span className="text-blue-600">Digital e Inteligente</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
            Elimine o trabalho manual e automatize seus relatórios de inspeção. 
            Unoqual ajuda consultores e gestores a garantir a segurança do paciente com dados precisos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/inspection/new" 
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-center"
            >
              Começar Inspeção
            </Link>
            <Link 
              href="/dashboard" 
              className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all text-center"
            >
              Ver Painel
            </Link>
            <Link 
              href="#demo" 
              className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all"
            >
              Ver Demo
            </Link>
          </div>
          
          <div className="mt-20 w-full max-w-5xl rounded-2xl overflow-hidden border shadow-2xl">
             <div className="bg-gray-50 p-4 border-b flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 h-6 bg-white rounded border mx-4 flex items-center px-4">
                  <div className="w-32 h-2 bg-gray-100 rounded"></div>
                </div>
             </div>
             <div className="aspect-video bg-white p-8">
                <div className="grid grid-cols-3 gap-6 h-full">
                  <div className="col-span-2 space-y-6">
                    <div className="h-40 bg-gray-50 rounded-xl p-6 border border-dashed border-gray-200">
                      <div className="w-1/3 h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="h-20 bg-blue-50 rounded-lg"></div>
                        <div className="h-20 bg-blue-50 rounded-lg"></div>
                        <div className="h-20 bg-blue-50 rounded-lg"></div>
                        <div className="h-20 bg-blue-50 rounded-lg"></div>
                      </div>
                    </div>
                    <div className="h-48 bg-gray-50 rounded-xl p-6 border border-dashed border-gray-200">
                      <div className="w-1/4 h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="space-y-3">
                        <div className="h-3 bg-gray-100 rounded w-full"></div>
                        <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-100 rounded w-4/6"></div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="h-full bg-blue-600 rounded-xl opacity-10"></div>
                  </div>
                </div>
             </div>
          </div>
        </section>
        
        {/* Social Proof / Stats */}
        <section className="bg-gray-50 py-16 px-8 border-y">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div>
              <div className="text-4xl font-black text-gray-900 mb-2">35h</div>
              <div className="text-gray-500 font-medium uppercase tracking-wider text-sm">Economizadas por Relatório</div>
            </div>
            <div className="w-px h-12 bg-gray-200 hidden md:block"></div>
            <div>
              <div className="text-4xl font-black text-gray-900 mb-2">100%</div>
              <div className="text-gray-500 font-medium uppercase tracking-wider text-sm">Conformidade RDC 50</div>
            </div>
            <div className="w-px h-12 bg-gray-200 hidden md:block"></div>
            <div>
              <div className="text-4xl font-black text-gray-900 mb-2">+20</div>
              <div className="text-gray-500 font-medium uppercase tracking-wider text-sm">Unidades Hospitalares</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-8 py-12 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                U
              </div>
              <span className="font-bold">Unoqual</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Transformando a consultoria de enfermagem através da tecnologia e rigor técnico.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h4 className="font-bold text-sm mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="#">Funcionalidades</Link></li>
                <li><Link href="#">Matriz de Risco</Link></li>
                <li><Link href="#">Relatórios</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="#">Termos de Uso</Link></li>
                <li><Link href="#">Privacidade</Link></li>
                <li><Link href="#">LGPD</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t text-sm text-gray-400 flex justify-between">
          <span>© 2024 Unoqual. Todos os direitos reservados.</span>
          <div className="flex gap-4">
            <span>PT-BR</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
