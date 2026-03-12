#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# deploy.sh — Script de Deploy Automático do FiscoControl
# Uso: bash deploy.sh [--first-run | --update | --rollback]
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail

PROJETO="fiscocontrol"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$APP_DIR/deploy.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Cores
GREEN='\033[0;32m' YELLOW='\033[1;33m' RED='\033[0;31m' NC='\033[0m'
info()    { echo -e "${GREEN}[INFO]${NC}  $1" | tee -a "$LOG_FILE"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $1" | tee -a "$LOG_FILE"; }
error()   { echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"; exit 1; }

echo "════════════════════════════════════════" | tee -a "$LOG_FILE"
info "FiscoControl Deploy — $TIMESTAMP"
echo "════════════════════════════════════════" | tee -a "$LOG_FILE"

# Verifica se o .env existe
[ ! -f "$APP_DIR/.env" ] && error "Arquivo .env não encontrado! Copie .env.example e preencha."

# Verifica Docker
command -v docker   &>/dev/null || error "Docker não instalado!"
command -v docker compose &>/dev/null || error "Docker Compose não instalado!"

MODE="${1:---update}"

case "$MODE" in

  --first-run)
    info "🚀 Primeira execução — configuração completa..."

    info "📦 Build da aplicação..."
    docker compose build --no-cache app

    info "🐘 Subindo PostgreSQL e Redis..."
    docker compose up -d postgres redis
    sleep 10

    info "📋 Executando migrações do banco de dados..."
    docker compose run --rm app sh -c "npx prisma migrate deploy"

    info "🌱 Populando banco com dados iniciais..."
    docker compose run --rm app sh -c "npm run db:seed"

    info "🚀 Subindo todos os serviços..."
    docker compose up -d

    info "✅ Primeira execução concluída!"
    info "   🌐 Acesse: http://localhost:3000"
    info "   📱 WhatsApp API: http://localhost:8080"
    info "   🔑 Login: admin@fiscocontrol.com.br / Admin@123"
    ;;

  --update)
    info "🔄 Atualizando sistema..."

    info "📦 Rebuild da aplicação..."
    docker compose build app

    info "✅ Aplicando migrações pendentes..."
    docker compose run --rm app sh -c "npx prisma migrate deploy"

    info "♻️  Reiniciando serviços com zero downtime..."
    docker compose up -d --no-deps app

    info "✅ Atualização concluída!"
    ;;

  --rollback)
    warn "⏪ Fazendo rollback para a versão anterior..."
    docker compose stop app
    docker compose up -d --no-deps app
    warn "✅ Rollback concluído. Verifique os logs: docker compose logs app"
    ;;

  --logs)
    docker compose logs -f --tail=100 app
    ;;

  --status)
    docker compose ps
    ;;

  --stop)
    info "⏹️  Parando todos os serviços..."
    docker compose stop
    ;;

  --down)
    warn "🗑️  Removendo containers (dados do banco são preservados nos volumes)..."
    docker compose down
    ;;

  *)
    echo "Uso: bash deploy.sh [--first-run | --update | --rollback | --logs | --status | --stop | --down]"
    exit 1
    ;;

esac
