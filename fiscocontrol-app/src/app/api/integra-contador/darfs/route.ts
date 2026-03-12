import { NextResponse } from 'next/server';
import { SicalwebService, DarfParams } from '../../../../lib/integra-contador/darfs/sicalweb';

export async function POST(request: Request) {
  try {
    const body: DarfParams = await request.json();

    if (!body.cnpj || !body.codigoReceita || !body.periodoApuracao || !body.dataVencimento || body.valorPrincipal === undefined) {
      return NextResponse.json({ error: 'Parâmetros obrigatórios ausentes. Verifique: cnpj, codigoReceita, periodoApuracao, dataVencimento, valorPrincipal' }, { status: 400 });
    }

    const data = await SicalwebService.gerarDarf(body);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      error.response?.data || { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
