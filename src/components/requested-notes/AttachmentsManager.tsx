import { useState, useRef } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Paperclip,
  Upload,
  Download,
  Trash2,
  FileText,
  Image,
  File,
  MoreHorizontal,
  Eye,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnexoNota } from '@/types';

interface AttachmentsManagerProps {
  anexos: AnexoNota[];
  onUploadFile: (file: File, descricao?: string) => Promise<void>;
  onRemoveFile: (anexoId: string) => Promise<void>;
  onDownloadFile: (anexo: AnexoNota) => void;
  isUploading?: boolean;
  allowEdit?: boolean;
}

const getFileIcon = (tipoArquivo: AnexoNota['tipoArquivo']) => {
  switch (tipoArquivo) {
    case 'pdf':
      return <FileText className="h-4 w-4 text-red-500" />;
    case 'xml':
      return <File className="h-4 w-4 text-green-500" />;
    case 'image':
      return <Image className="h-4 w-4 text-blue-500" />;
    default:
      return <File className="h-4 w-4 text-gray-500" />;
  }
};

const getFileTypeLabel = (tipoArquivo: AnexoNota['tipoArquivo']) => {
  switch (tipoArquivo) {
    case 'pdf':
      return 'PDF';
    case 'xml':
      return 'XML';
    case 'image':
      return 'Imagem';
    default:
      return 'Documento';
  }
};

const formatFileSize = (sizeInBytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (sizeInBytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
  return Math.round(sizeInBytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch {
    return dateString;
  }
};

export function AttachmentsManager({
  anexos,
  onUploadFile,
  onRemoveFile,
  onDownloadFile,
  isUploading,
  allowEdit = true,
}: AttachmentsManagerProps) {
  const [descricao, setDescricao] = useState('');
  const [anexoParaRemover, setAnexoParaRemover] = useState<AnexoNota | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await onUploadFile(file, descricao);
      setDescricao('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
    }
  };

  const handleRemoveFile = async () => {
    if (!anexoParaRemover) return;
    
    try {
      await onRemoveFile(anexoParaRemover.id);
      setAnexoParaRemover(null);
    } catch (error) {
      console.error('Erro ao remover arquivo:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Paperclip className="h-5 w-5" />
            Anexos
          </div>
          <Badge variant="secondary">
            {anexos.length} {anexos.length === 1 ? 'arquivo' : 'arquivos'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload de arquivos */}
        {allowEdit && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Adicionar Anexo
            </h4>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="descricao">Descrição (opcional)</Label>
                <Input
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva o arquivo que está anexando..."
                />
              </div>
              
              <div>
                <Label htmlFor="arquivo">Selecionar Arquivo</Label>
                <Input
                  id="arquivo"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".pdf,.xml,.jpg,.jpeg,.png,.gif,.doc,.docx"
                  disabled={isUploading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Formatos aceitos: PDF, XML, imagens (JPG, PNG, GIF), documentos (DOC, DOCX)
                </p>
              </div>
            </div>
            
            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Fazendo upload do arquivo...
              </div>
            )}
          </div>
        )}

        {/* Lista de anexos */}
        <div className="space-y-4">
          <h4 className="font-medium">Arquivos Anexados</h4>
          
          {anexos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Paperclip className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum arquivo anexado ainda.</p>
              {allowEdit && (
                <p className="text-sm">Use o formulário acima para adicionar arquivos.</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Arquivo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Enviado por</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {anexos.map((anexo) => (
                    <TableRow key={anexo.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getFileIcon(anexo.tipoArquivo)}
                          <div>
                            <div className="font-medium">{anexo.nomeArquivo}</div>
                            {anexo.descricao && (
                              <div className="text-sm text-muted-foreground">
                                {anexo.descricao}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getFileTypeLabel(anexo.tipoArquivo)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {formatFileSize(anexo.tamanhoArquivo)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{anexo.uploadedByName}</div>
                          <div className="text-muted-foreground">
                            Versão {anexo.versao}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {formatDate(anexo.dataUpload)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onDownloadFile(anexo)}
                              className="cursor-pointer"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Baixar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => window.open(anexo.urlArquivo, '_blank')}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            {allowEdit && (
                              <DropdownMenuItem
                                onClick={() => setAnexoParaRemover(anexo)}
                                className="cursor-pointer text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remover
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Dialog de confirmação para remoção */}
        <AlertDialog 
          open={!!anexoParaRemover} 
          onOpenChange={(open: boolean) => !open && setAnexoParaRemover(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Remover Anexo
              </AlertDialogTitle>
              <AlertDialogDescription>
                Você tem certeza que deseja remover o arquivo{' '}
                <strong>{anexoParaRemover?.nomeArquivo}</strong>?
                <br />
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleRemoveFile}
                className="bg-red-600 hover:bg-red-700"
              >
                Remover Arquivo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}