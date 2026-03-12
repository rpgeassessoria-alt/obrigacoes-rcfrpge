import { prisma } from '../../prisma';
import { CNDFederalService } from '../certidoes/cnd-federal';
import { CNDFGTSService } from '../certidoes/cnd-fgts';
import { DividaAtivaMeiService } from '../mei/divida';
import { CaixaPostalService } from '../caixa-postal';

export interface FiscalScoreResult {
  score: number;
  risco: 'Baixo' | 'Médio' | 'Alto';
  detalhes: {
    cndFederal: boolean;
    cndFgts: boolean;
    dividaAtiva: boolean;
    alertasCaixaPostal: number;
  };
}

export class RaioXScoreService {
  /**
   * Calcula o Score Fiscal (0 a 100) de um cliente com base em dados no cache/banco/API
   */
  static async calcularScore(cnpj: string): Promise<FiscalScoreResult> {
    let score = 100;
    
    // Status Individuais
    let cndFederalOk = true;
    let cndFgtsOk = true;
    let dividaAtivaOk = true;
    let alertasPendentes = 0;

    try {
      // 1. Verifica Certidões Federais (Peso 30)
      try {
        const cndFed = await CNDFederalService.consultar(cnpj);
        // Exemplo simplificado: se não retornar status regular, subtrai
        if (cndFed && cndFed.situacao && !cndFed.situacao.toUpperCase().includes('POSITIVA')) {
          // É Negativa ou Positiva com efeito de Negativa
        } else {
          cndFederalOk = false;
          score -= 30;
        }
      } catch (e) {
        cndFederalOk = false;
        score -= 30; // Assume pior cenário em caso de erro da certidão
      }

      // 2. Verifica Certidão FGTS (Peso 20)
      try {
        const cndFgts = await CNDFGTSService.consultar(cnpj);
        if (cndFgts && cndFgts.situacao === 'REGULAR') {
          // OK
        } else {
          cndFgtsOk = false;
          score -= 20;
        }
      } catch (e) {
        cndFgtsOk = false;
        score -= 20;
      }

      // 3. Verifica Dívida Ativa PGFN (Peso 30)
      try {
         const divida = await DividaAtivaMeiService.consultarDivida(cnpj);
         if (divida && divida.debitos && divida.debitos.length > 0) {
            dividaAtivaOk = false;
            score -= 30;
         }
      } catch (e) {
         // Se não encontrar dívida (404), ok. Se der outro erro, ignora desconto ou aplica parcial
         console.warn("Dívida Ativa lookup falhou (pode não haver dívida):", e);
      }

      // 4. Caixa Postal (Mensagens não lidas) (Peso 20)
      try {
         const cxPostal = await CaixaPostalService.consultarMensagens(cnpj);
         if (cxPostal && cxPostal.mensagens) {
            const unread = cxPostal.mensagens.filter((m: any) => !m.lida).length;
            alertasPendentes = unread;
            if (unread > 0) {
              score -= Math.min(20, unread * 5); // Tira 5 pontos por mensagem não lida, até max 20
            }
         }
      } catch (e) {
         console.warn("Caixa Postal lookup falhou:", e);
      }

    } catch (globalError) {
      console.error("Erro geral no cálculo do Score Raio-X", globalError);
    }

    // Garantir limite
    score = Math.max(0, Math.min(100, score));

    // Determinar Grau de Risco
    let risco: 'Baixo' | 'Médio' | 'Alto' = 'Baixo';
    if (score < 50) risco = 'Alto';
    else if (score < 80) risco = 'Médio';

    return {
      score,
      risco,
      detalhes: {
        cndFederal: cndFederalOk,
        cndFgts: cndFgtsOk,
        dividaAtiva: dividaAtivaOk,
        alertasCaixaPostal: alertasPendentes
      }
    };
  }
}
