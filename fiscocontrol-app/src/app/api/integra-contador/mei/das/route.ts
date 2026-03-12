import { NextResponse } from 'next/server';
import { PGMEIService } from '../../../../../lib/integra-contador/mei/pgmei';

export async function POST(request: Request) {
  try {
    const { cnpj, periodoApuracao } = await request.json();

    if (!cnpj || !periodoApuracao) {
      return NextResponse.json({ error: 'CNPJ e periodoApuracao (MMAAAA) são obrigatórios' }, { status: 400 });
    }

    const data = await PGMEIService.gerarDAS(cnpj, periodoApuracao);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      error.response?.data || { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cnpj = searchParams.get('cnpj');
  const ano = searchParams.get('ano');

  if (!cnpj || !ano) {
    return NextResponse.json({ error: 'CNPJ e ano (AAAA) são obrigatórios' }, { status: 400 });
  }

  try {
    const data = await PGMEIService.consultarCompetencias(cnpj, ano);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      error.response?.data || { error: error.message }, 
      { status: error.response?.status || 500 }
    );
  }
}
