import { Badge } from "@/src/components/magic/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/magic/ui/tabs";
import { ResumenTab } from "@/src/components/medico/pacientes/detail/tabs/ResumenTab";
import { DatosMedicosTab } from "@/src/components/medico/pacientes/detail/tabs/DatosMedicosTab";
import { EstudiosTab } from "@/src/components/medico/pacientes/detail/tabs/EstudiosTab";
import { NovedadesTab } from "@/src/components/medico/pacientes/detail/tabs/NovedadesTab";
import { ConsultasTab } from "@/src/components/medico/pacientes/detail/tabs/ConsultasTab";
import { AnalisisIATab } from "@/src/components/medico/pacientes/detail/tabs/AnalisisIATab";
import { GemeloTab } from "@/src/components/medico/pacientes/detail/tabs/GemeloTab";
import type {
  AnalisisIA,
  AsistenteMedicoConsulta,
  ContextoAnalisisIA,
  Consulta,
  DatoMedico,
  EstudioMedico,
  GemeloDigital,
  NovedadClinica,
  SimulacionTratamiento,
} from "@/src/lib/api/types";
import type {
  AsistenteMedicoFormState,
  AnalisisFormState,
  ConsultaFormState,
  DatoMedicoFormState,
  DetailTabValue,
  EstudioFormState,
  GemeloUpdateFormState,
  NovedadFormState,
  PendingMap,
  SimulacionFormState,
} from "@/src/components/medico/pacientes/detail/shared/utils";

interface PacienteDetailTabsProps {
  activeTab: DetailTabValue;
  onTabChange: (value: DetailTabValue) => void;
  datosMedicos: DatoMedico[];
  estudios: EstudioMedico[];
  novedades: NovedadClinica[];
  consultas: Consulta[];
  activeConsulta: Consulta | null;
  ultimoAnalisis: AnalisisIA | null;
  contextoIa: ContextoAnalisisIA | null;
  historialAsistente: AsistenteMedicoConsulta[];
  gemelo: GemeloDigital | null;
  ultimaSimulacion: SimulacionTratamiento | null;
  pending: PendingMap;
  onCreateDato: (payload: DatoMedicoFormState) => Promise<boolean>;
  onUpdateDato: (id: string, payload: DatoMedicoFormState) => Promise<boolean>;
  onRemoveDato: (id: string) => Promise<void>;
  onCreateEstudio: (payload: EstudioFormState) => Promise<boolean>;
  onRemoveEstudio: (id: string) => Promise<void>;
  onCreateNovedad: (payload: NovedadFormState) => Promise<boolean>;
  onRemoveNovedad: (id: string) => Promise<void>;
  onCreateDraftConsulta: () => Promise<void>;
  onSaveConsulta: (id: string, payload: ConsultaFormState) => Promise<void>;
  onCloseConsulta: (id: string) => Promise<void>;
  onSubmitAnalisis: (payload: AnalisisFormState) => Promise<void>;
  onSubmitAsistente: (payload: AsistenteMedicoFormState) => Promise<boolean>;
  onSubmitSimulacion: (payload: SimulacionFormState) => Promise<void>;
  onSubmitGemeloUpdate: (payload: GemeloUpdateFormState) => Promise<void>;
}

function TriggerCount({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="outline" className="border-current/20 bg-white/10 text-current">
      {children}
    </Badge>
  );
}

export function PacienteDetailTabs({
  activeTab,
  onTabChange,
  datosMedicos,
  estudios,
  novedades,
  consultas,
  activeConsulta,
  ultimoAnalisis,
  contextoIa,
  historialAsistente,
  gemelo,
  ultimaSimulacion,
  pending,
  onCreateDato,
  onUpdateDato,
  onRemoveDato,
  onCreateEstudio,
  onRemoveEstudio,
  onCreateNovedad,
  onRemoveNovedad,
  onCreateDraftConsulta,
  onSaveConsulta,
  onCloseConsulta,
  onSubmitAnalisis,
  onSubmitAsistente,
  onSubmitSimulacion,
  onSubmitGemeloUpdate,
}: PacienteDetailTabsProps) {
  const iaCount = (ultimoAnalisis ? 1 : 0) + historialAsistente.length;

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => onTabChange(value as DetailTabValue)}
      className="gap-6"
    >
      <TabsList className="sticky top-16 z-10 bg-surface/95 backdrop-blur">
        <TabsTrigger value="resumen">Resumen</TabsTrigger>
        <TabsTrigger value="datos-medicos">
          Datos medicos
          <TriggerCount>{datosMedicos.length}</TriggerCount>
        </TabsTrigger>
        <TabsTrigger value="estudios">
          Estudios
          <TriggerCount>{estudios.length}</TriggerCount>
        </TabsTrigger>
        <TabsTrigger value="novedades">
          Novedades
          <TriggerCount>{novedades.length}</TriggerCount>
        </TabsTrigger>
        <TabsTrigger value="consultas">
          Consultas
          <TriggerCount>{consultas.length}</TriggerCount>
        </TabsTrigger>
        <TabsTrigger value="ia">
          IA
          {iaCount > 0 ? <TriggerCount>{iaCount}</TriggerCount> : null}
        </TabsTrigger>
        <TabsTrigger value="gemelo">
          Gemelo
          {gemelo ? <TriggerCount>{ultimaSimulacion ? "2" : "1"}</TriggerCount> : null}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="resumen">
        <ResumenTab
          activeConsulta={activeConsulta}
          ultimoAnalisis={ultimoAnalisis}
          gemelo={gemelo}
          ultimaSimulacion={ultimaSimulacion}
          onGoToTab={onTabChange}
        />
      </TabsContent>

      <TabsContent value="datos-medicos">
        <DatosMedicosTab
          datosMedicos={datosMedicos}
          isPending={Boolean(pending.datosMedicos)}
          onCreateDato={onCreateDato}
          onUpdateDato={onUpdateDato}
          onRemoveDato={onRemoveDato}
        />
      </TabsContent>

      <TabsContent value="estudios">
        <EstudiosTab
          estudios={estudios}
          isPending={Boolean(pending.estudios)}
          onCreateEstudio={onCreateEstudio}
          onRemoveEstudio={onRemoveEstudio}
        />
      </TabsContent>

      <TabsContent value="novedades">
        <NovedadesTab
          novedades={novedades}
          isPending={Boolean(pending.novedades)}
          onCreateNovedad={onCreateNovedad}
          onRemoveNovedad={onRemoveNovedad}
        />
      </TabsContent>

      <TabsContent value="consultas">
        <ConsultasTab
          consultas={consultas}
          activeConsulta={activeConsulta}
          isPending={Boolean(pending.consultas)}
          onCreateDraftConsulta={onCreateDraftConsulta}
          onSaveConsulta={onSaveConsulta}
          onCloseConsulta={onCloseConsulta}
        />
      </TabsContent>

      <TabsContent value="ia">
        <AnalisisIATab
          datosMedicos={datosMedicos}
          ultimoAnalisis={ultimoAnalisis}
          contextoIa={contextoIa}
          historialAsistente={historialAsistente}
          isPending={Boolean(pending.analisis)}
          isAssistantPending={Boolean(pending.asistente)}
          onSubmitAnalisis={onSubmitAnalisis}
          onSubmitAsistente={onSubmitAsistente}
        />
      </TabsContent>

      <TabsContent value="gemelo">
        <GemeloTab
          gemelo={gemelo}
          consultas={consultas}
          ultimaSimulacion={ultimaSimulacion}
          activeConsulta={activeConsulta}
          isSimulacionPending={Boolean(pending.simulacion)}
          isGemeloPending={Boolean(pending.gemelo)}
          onSubmitSimulacion={onSubmitSimulacion}
          onSubmitGemeloUpdate={onSubmitGemeloUpdate}
        />
      </TabsContent>
    </Tabs>
  );
}
