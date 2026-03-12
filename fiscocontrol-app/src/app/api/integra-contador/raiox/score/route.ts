import { NextResponse } from 'next/server';
import { RaioXScoreService } from '../../../../../lib/integra-contador/raiox/score';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cnpj = searchParams.get('cnpj');

  if (!cnpj) {
    return NextResponse.json({ error: 'CNPJ é obrigatório' }, { status: 400 });
  }

  try {
    const data = await RaioXScoreService.calcularScore(cnpj);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      error.response?.data || { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
