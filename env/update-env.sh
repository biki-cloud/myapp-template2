#!/bin/sh

# 第一引数でpreviewかproductionを指定
if [ "$1" = "preview" ]; then
  ENV="preview"
elif [ "$1" = "production" ]; then
  ENV="production"
else
  echo "Usage: $0 {preview|production}"
  exit 1
fi

echo "generating .env.${ENV}..."
./generate-env.sh ${ENV}

echo "setting github environments..."
./set-github-environments.sh .env.${ENV} ${ENV}

echo "setting vercel environments..."
./set-vercel-environments.sh .env.${ENV} ${ENV}
