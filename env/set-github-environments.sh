#!/bin/bash

# ./set-github-environments.sh <env-file-path> <environment-name>
# ./set-github-environments.sh .env.preview preview
# ./set-github-environments.sh .env.production production 

# 引数チェック
if [ $# -ne 2 ]; then
  echo "Usage: $0 <env-file-path> <environment-name>"
  exit 1
fi

# 引数からファイルパスとEnvironment名を取得
ENV_FILE="$1"
ENVIRONMENT="$2"

# GitHubリポジトリ（固定値）
REPO="biki-cloud/myapp-template"

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

  echo "------------- Setting secret: $key -------------"

  # ghコマンドで登録
  gh secret set "$key" --body "$value" --repo "$REPO" --env "$ENVIRONMENT"

done < "$ENV_FILE"
