import { OptantesMeiService } from './optantes';
import { AusenciaDeclaracoesMeiService } from './ausencia-declaracoes';
import { DividaAtivaMeiService } from './divida';
import { ParcMeiService } from './parcmei';
import { PGMEIService } from './pgmei';

export class DiagnosticoMeiService {
  /**
   * Agrega informações fiscais do MEI para formar o Diagnóstico
   */
  static async gerarDiagnostico(cnpj: string): Promise<any> {
    const anoAtual = new Date().getFullYear().toString();

    const [
      optanteRes,
      ausenciaRes,
      dividaRes,
      parcmeiRes,
      pgmeiRes
    ] = await Promise.allSettled([
      OptantesMeiService.consultarSituacao(cnpj),
      AusenciaDeclaracoesMeiService.consultarAusencia(cnpj),
      DividaAtivaMeiService.consultarDivida(cnpj),
      ParcMeiService.consultarExtrato(cnpj),
      PGMEIService.consultarCompetencias(cnpj, anoAtual)
    ]);

    return {
      optante: optanteRes.status === 'fulfilled' ? optanteRes.value : { erro: (optanteRes as PromiseRejectedResult).reason?.message || 'Erro na consulta' },
      ausenciaDeclaracoes: ausenciaRes.status === 'fulfilled' ? ausenciaRes.value : { erro: (ausenciaRes as PromiseRejectedResult).reason?.message || 'Erro na consulta' },
      dividaAtiva: dividaRes.status === 'fulfilled' ? dividaRes.value : { erro: (dividaRes as PromiseRejectedResult).reason?.message || 'Erro na consulta' },
      parcelamentoPagra: parcmeiRes.status === 'fulfilled' ? parcmeiRes.value : { erro: (parcmeiRes as PromiseRejectedResult).reason?.message || 'Erro na consulta' },
      pgmeiAnoAtual: pgmeiRes.status === 'fulfilled' ? pgmeiRes.value : { erro: (pgmeiRes as PromiseRejectedResult).reason?.message || 'Erro na consulta' },
      resumo: {
        timestamp: new Date().toISOString(),
        cnpjConsultado: cnpj
      }
    };
  }
}
