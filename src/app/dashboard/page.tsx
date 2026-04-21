import { getRecentInspections } from "@/app/actions/inspection";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClipboardList, Plus, Building2, Calendar } from "lucide-react";
import { translate } from "@/lib/translations";

export default async function DashboardPage() {
  const inspections = await getRecentInspections();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel de Controle</h1>
          <p className="text-slate-500 mt-1">Bem-vindo ao Unoqual. Gerencie suas inspeções e conformidade.</p>
        </div>
        <Link href="/inspection/new">
          <Button className="bg-blue-600 hover:bg-blue-700 font-bold gap-2">
            <Plus className="w-4 h-4" />
            Nova Inspeção
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="border-blue-100 bg-blue-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Total de Inspeções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{inspections.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Unidades Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {new Set(inspections.map((i: any) => i.facilityId)).size}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Último Ciclo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-slate-900">
              {inspections[0]?.createdAt.toLocaleDateString('pt-BR') || "Sem dados"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Inspeções Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {inspections.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Nenhuma inspeção realizada ainda.</p>
              <Link href="/inspection/new" className="mt-4 inline-block text-blue-600 font-medium">
                Começar agora →
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {inspections.map((inspection: any) => (
                  <TableRow key={inspection.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {inspection.facility.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {inspection.createdAt.toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={inspection.status === 'completed' ? 'secondary' : 'outline'} className="capitalize">
                        {translate(inspection.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {inspection._count.entries} itens avaliados
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={inspection.status === 'draft' ? `/inspection/new?id=${inspection.id}` : `/inspection/${inspection.id}`}>
                        <Button variant="ghost" size="sm">
                          {inspection.status === 'draft' ? 'Retomar' : 'Ver Detalhes'}
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
