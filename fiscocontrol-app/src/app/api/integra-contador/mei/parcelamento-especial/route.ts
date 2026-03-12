import { NextResponse } from 'next/server';
import { ParcMeiEspecialService } from '../../../../../lib/integra-contador/mei/parcmei-especial';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cnpj = searchParams.get('cnpj');

  if (!cnpj) return NextResponse.json({ error: 'CNPJ obrigatório' }, { status: 400 });

  try {
    const data = await ParcMeiEspecialService.consultarExtrato(cnpj);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(error.response?.data || { error: error.message }, { status: error.response?.status || 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { cnpj, numeroParcela } = await request.json();
    if (!cnpj || !numeroParcela) return NextResponse.json({ error: 'CNPJ e numeroParcela são obrigatórios' }, { status: 400 });

    const data = await ParcMeiEspecialService.emitirParcela(cnpj, numeroParcela);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(error.response?.data || { error: error.message }, { status: error.response?.status || 500 });
  }
}
