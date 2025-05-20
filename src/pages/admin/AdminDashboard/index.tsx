import { useState } from 'react';

export default function AdminDashboard() {
  const pais = [
    {
      nome: 'João Silva',
      email: 'joao@email.com',
      filhos: [
        { nome: 'Ana', codigo: '', validado: false, entrada: '', saida: '' },
        { nome: 'Lucas', codigo: '', validado: false, entrada: '', saida: '' },
      ]
    },
    {
      nome: 'Maria Souza',
      email: 'maria@email.com',
      filhos: [
        { nome: 'Carlos', codigo: '', validado: false, entrada: '', saida: '' },
      ]
    }
  ];

  const [estadoPais, setEstadoPais] = useState(pais);

  const handleCodigoChange = (paiIndex: number, filhoIndex: number, value: string) => {
    const copia = [...estadoPais];
    copia[paiIndex].filhos[filhoIndex].codigo = value;
    setEstadoPais(copia);
  };

  const handleEntradaChange = (paiIndex: number, filhoIndex: number, value: string) => {
    const copia = [...estadoPais];
    copia[paiIndex].filhos[filhoIndex].entrada = value;
    setEstadoPais(copia);
  };

  const handleSaidaChange = (paiIndex: number, filhoIndex: number, value: string) => {
    const copia = [...estadoPais];
    copia[paiIndex].filhos[filhoIndex].saida = value;
    setEstadoPais(copia);
  };

  const validarCodigo = (paiIndex: number, filhoIndex: number) => {
    const copia = [...estadoPais];
    const codigo = copia[paiIndex].filhos[filhoIndex].codigo;
    if (codigo.trim() !== '') {
      copia[paiIndex].filhos[filhoIndex].validado = true;
      alert(`Código validado para ${copia[paiIndex].filhos[filhoIndex].nome}`);
    } else {
      alert('Código inválido');
    }
    setEstadoPais(copia);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Painel do Administrador</h1>

      <div className="space-y-6">
        {estadoPais.map((pai, indexPai) => (
          <div key={indexPai} className="p-4 border rounded shadow bg-white">
            <h2 className="text-lg font-semibold">{pai.nome}</h2>
            <p className="text-sm text-gray-600">{pai.email}</p>

            <div className="mt-4">
              <h3 className="font-medium mb-2">Filhos cadastrados:</h3>
              <div className="space-y-3">
                {pai.filhos.map((filho, indexFilho) => (
                  <div key={indexFilho} className="p-3 border rounded bg-gray-50">
                    <p className="font-medium">{filho.nome}</p>
                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Código de retirada"
                        value={filho.codigo}
                        onChange={(e) => handleCodigoChange(indexPai, indexFilho, e.target.value)}
                        className="border px-3 py-1 rounded w-full sm:w-64"
                      />
                      <input
                        type="time"
                        value={filho.entrada}
                        onChange={(e) => handleEntradaChange(indexPai, indexFilho, e.target.value)}
                        className="border px-3 py-1 rounded w-full sm:w-32"
                        placeholder="Entrada"
                      />
                      <input
                        type="time"
                        value={filho.saida}
                        onChange={(e) => handleSaidaChange(indexPai, indexFilho, e.target.value)}
                        className="border px-3 py-1 rounded w-full sm:w-32"
                        placeholder="Saída"
                      />
                      <button
                        onClick={() => validarCodigo(indexPai, indexFilho)}
                        className={`text-white px-4 py-1 rounded ${filho.validado ? 'bg-blue-600' : 'bg-red-600 hover:bg-red-700'}`}
                      >
                        {filho.validado ? 'Validado' : 'Validar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
