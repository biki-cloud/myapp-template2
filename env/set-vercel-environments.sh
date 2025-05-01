#!/bin/bash

# 以下を叩いてリンク付けが必要。
# vercel link --project myapp-template

# ./set-vercel-environments.sh .env.preview preview
# ./set-vercel-environments.sh .env.production production

# 引数チェック
if [ $# -ne 2 ]; then
  echo "Usage: $0 <env-file-path> <vercel-environment>"
  echo "Example: $0 .env.production production"
  exit 1
fi

# 引数からファイルパスとVercel環境を取得
ENV_FILE="$1"
VERCEL_ENV="$2"

# .envファイルが存在するか確認
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: File '$ENV_FILE' not found!"
  exit 1
fi

# .envファイルを1行ずつ読み込んでループ
while IFS='=' read -r key value
do
  # コメント行と空行をスキップ
  if [[ "$key" == \#* ]] || [[ -z "$key" ]]; then
    continue
  fi

  # keyとvalueの前後の空白を除去
  key=$(echo "$key" | xargs)
  value=$(echo "$value" | xargs)

  echo "------------- Setting Vercel env: $key -------------"

  # Vercel CLIで登録（非対話モード）
  NODE_OPTIONS="--no-deprecation" vercel env rm "$key" "$VERCEL_ENV" --yes
  echo -n "$value" | NODE_OPTIONS="--no-deprecation" vercel env add "$key" "$VERCEL_ENV" --yes

done < "$ENV_FILE"
