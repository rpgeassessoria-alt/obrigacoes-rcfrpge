import { NextResponse } from 'next/server';
import { DividaAtivaMeiService } from '../../../../../lib/integra-contador/mei/divida';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cnpj = searchParams.get('cnpj');

  if (!cnpj) return NextResponse.json({ error: 'CNPJ obrigatório' }, { status: 400 });

  try {
    const data = await DividaAtivaMeiService.consultarDivida(cnpj);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(error.response?.data || { error: error.message }, { status: error.response?.status || 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { cnpj, numeroInscricao } = await request.json();
    if (!cnpj || !numeroInscricao) return NextResponse.json({ error: 'CNPJ e numeroInscricao são obrigatórios' }, { status: 400 });

    const data = await DividaAtivaMeiService.emitirGuia(cnpj, numeroInscricao);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(error.response?.data || { error: error.message }, { status: error.response?.status || 500 });
  }
}
