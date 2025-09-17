import { useEffect } from 'react';
import { HeaderIntern } from "@/presentation/components/layout-intern/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Plus, 
  BarChart3,
  Filter,
  Download
} from "lucide-react";
import { useRequestedNotes } from '@/hooks';
import { RequestedNotesFilters } from '@/components/requested-notes/RequestedNotesFilters';
import { RequestedNotesTable } from '@/components/requested-notes/RequestedNotesTable';
import { RequestedNoteDetailModal } from '@/components/requested-notes/RequestedNoteDetailModal';

export function RequestedNotesPage() {
  const {
    // Data
    notasSolicitadas,
    notasFiltradasValue,
    notasPaginadasValue,
    estatisticas,
    notasPrioridade,
    
    // State
    loading,
    filtros,
    paginacao,
    totalPaginas,
    notaSelecionada,
    modalAberto,
    
    // Actions
    fetchNotasSolicitadas,
    updateNotaStatus,
    aplicarFiltros,
    limparFiltros,
    changePage,
    changePageSize,
    abrirModal,
    fecharModal,
  } = useRequestedNotes();

  useEffect(() => {
    fetchNotasSolicitadas();
  }, [fetchNotasSolicitadas]);

  const handleExportData = () => {
    // TODO: Implementar exportação
    console.log('Exportar dados');
  };

  const handleNewRequest = () => {
    // TODO: Implementar criação de nova solicitação
    console.log('Nova solicitação');
  };

  return (
    <div className="w-full">
      <HeaderIntern />
      
      <div className="p-4 space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Gestão de Notas Fiscais Solicitadas
            </h1>
            <p className="text-muted-foreground">
              Gerencie e acompanhe todas as solicitações de notas fiscais dos seus clientes.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleExportData} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Button onClick={handleNewRequest} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Solicitação
            </Button>
          </div>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Solicitações
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.totalSolicitacoes}</div>
              <p className="text-xs text-muted-foreground">
                Todas as solicitações registradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pendentes
              </CardTitle>
              <div className="h-4 w-4 rounded-full bg-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.porStatus.pendente}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando processamento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Processadas
              </CardTitle>
              <div className="h-4 w-4 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.porStatus.processado}</div>
              <p className="text-xs text-muted-foreground">
                {estatisticas.percentualProcessadas.toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tempo Médio
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estatisticas.tempoMedioProcessamento.toFixed(1)}d
              </div>
              <p className="text-xs text-muted-foreground">
                Dias para processamento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de conteúdo */}
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list" className="gap-2">
              <FileText className="h-4 w-4" />
              Lista de Solicitações
            </TabsTrigger>
            <TabsTrigger value="priority" className="gap-2">
              <Filter className="h-4 w-4" />
              Por Prioridade
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          {/* Lista principal */}
          <TabsContent value="list" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              {/* Filtros */}
              <div className="md:col-span-1">
                <RequestedNotesFilters
                  filtros={filtros}
                  onFiltrosChange={aplicarFiltros}
                  onLimparFiltros={limparFiltros}
                  totalNotas={notasSolicitadas.length}
                  notasFiltradas={notasFiltradasValue.length}
                />
              </div>

              {/* Tabela */}
              <div className="md:col-span-3">
                <RequestedNotesTable
                  notas={notasPaginadasValue}
                  onViewDetails={abrirModal}
                  onUpdateStatus={updateNotaStatus}
                  isLoading={loading}
                  currentPage={paginacao.page}
                  totalPages={totalPaginas}
                  pageSize={paginacao.pageSize}
                  onPageChange={changePage}
                  onPageSizeChange={changePageSize}
                />
              </div>
            </div>
          </TabsContent>

          {/* Visualização por prioridade */}
          <TabsContent value="priority" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Alta prioridade */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-red-600">Alta Prioridade</CardTitle>
                  <CardDescription>
                    {notasPrioridade.alta.length} solicitações urgentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {notasPrioridade.alta.slice(0, 5).map((nota) => (
                      <div 
                        key={nota.id}
                        className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-muted"
                        onClick={() => abrirModal(nota)}
                      >
                        <div>
                          <div className="font-medium text-sm">{nota.clienteNome}</div>
                          <div className="text-xs text-muted-foreground">
                            {nota.numeroNota || 'Sem número'}
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          R$ {nota.valor.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    ))}
                    {notasPrioridade.alta.length > 5 && (
                      <div className="text-center text-xs text-muted-foreground">
                        +{notasPrioridade.alta.length - 5} outras
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Média prioridade */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-yellow-600">Média Prioridade</CardTitle>
                  <CardDescription>
                    {notasPrioridade.media.length} solicitações normais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {notasPrioridade.media.slice(0, 5).map((nota) => (
                      <div 
                        key={nota.id}
                        className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-muted"
                        onClick={() => abrirModal(nota)}
                      >
                        <div>
                          <div className="font-medium text-sm">{nota.clienteNome}</div>
                          <div className="text-xs text-muted-foreground">
                            {nota.numeroNota || 'Sem número'}
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          R$ {nota.valor.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    ))}
                    {notasPrioridade.media.length > 5 && (
                      <div className="text-center text-xs text-muted-foreground">
                        +{notasPrioridade.media.length - 5} outras
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Baixa prioridade */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-600">Baixa Prioridade</CardTitle>
                  <CardDescription>
                    {notasPrioridade.baixa.length} solicitações sem urgência
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {notasPrioridade.baixa.slice(0, 5).map((nota) => (
                      <div 
                        key={nota.id}
                        className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-muted"
                        onClick={() => abrirModal(nota)}
                      >
                        <div>
                          <div className="font-medium text-sm">{nota.clienteNome}</div>
                          <div className="text-xs text-muted-foreground">
                            {nota.numeroNota || 'Sem número'}
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          R$ {nota.valor.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    ))}
                    {notasPrioridade.baixa.length > 5 && (
                      <div className="text-center text-xs text-muted-foreground">
                        +{notasPrioridade.baixa.length - 5} outras
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Relatórios e Analytics */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Solicitações por Cliente</CardTitle>
                  <CardDescription>
                    Top clientes com mais solicitações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {estatisticas.porCliente
                      .sort((a, b) => b.quantidade - a.quantidade)
                      .slice(0, 10)
                      .map((cliente) => (
                        <div key={cliente.clienteId} className="flex items-center justify-between">
                          <div className="text-sm font-medium">{cliente.clienteNome}</div>
                          <div className="text-sm text-muted-foreground">
                            {cliente.quantidade} solicitações
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Status</CardTitle>
                  <CardDescription>
                    Status atual das solicitações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <span className="text-sm">Pendente</span>
                      </div>
                      <span className="text-sm font-medium">{estatisticas.porStatus.pendente}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500" />
                        <span className="text-sm">Anexado</span>
                      </div>
                      <span className="text-sm font-medium">{estatisticas.porStatus.anexado}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span className="text-sm">Processado</span>
                      </div>
                      <span className="text-sm font-medium">{estatisticas.porStatus.processado}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <span className="text-sm">Cancelado</span>
                      </div>
                      <span className="text-sm font-medium">{estatisticas.porStatus.cancelado}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal de detalhes */}
        <RequestedNoteDetailModal
          nota={notaSelecionada}
          isOpen={modalAberto}
          onClose={fecharModal}
          onUpdateStatus={updateNotaStatus}
        />
      </div>
    </div>
  );
}