# プロジェクト名
PROJECT_NAME="myapp-template"

# プロジェクト情報を取得して、IDとOrgIDを取り出す
PROJECT_INFO=$(vercel projects ls --json | jq -r ".[] | select(.name == \"$PROJECT_NAME\")")

# それぞれ取り出す
VERCEL_PROJECT_ID=$(echo "$PROJECT_INFO" | jq -r '.id')
VERCEL_ORG_ID=$(echo "$PROJECT_INFO" | jq -r '.orgId')

# 出力確認
echo "VERCEL_PROJECT_ID: $VERCEL_PROJECT_ID"
echo "VERCEL_ORG_ID: $VERCEL_ORG_ID"
