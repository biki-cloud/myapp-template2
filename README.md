# プロジェクト構造・アーキテクチャ概要

## ディレクトリ構成

```
.
├── app/                # Next.js App Router（ページ・APIルート・レイアウト）
├── components/         # 再利用可能なReactコンポーネント
├── lib/                # ドメイン・サービス・リポジトリ・ユーティリティ
├── public/             # 静的アセット
├── supabase/           # Supabase設定・Edge Functions・マイグレーション
├── docs/               # 設計・要件・PWA等のドキュメント
├── e2e/                # E2Eテスト
├── test-results/       # テスト出力
├── playwright-report/  # Playwrightレポート
├── .github/            # GitHub Actions等CI/CD設定
├── coverage/           # Jestカバレッジ
├── ...（設定ファイル群）
```

## アーキテクチャ（レイヤー構成）

本プロジェクトは「クリーンアーキテクチャ」＋「ドメイン駆動設計（DDD）」を Next.js App Router 上で実践しています。

```
Page (UI)
  ↓
Server Actions (Controller)
  ↓
Service（ビジネスロジック）
  ↓
Domain（ドメインモデル）
  ↓
Repository（DB/外部サービス操作）
```

### 各レイヤーの役割

| レイヤー                        | 役割                                                                  |
| ------------------------------- | --------------------------------------------------------------------- |
| **Page (UI)**                   | フロントエンド表示・ユーザー操作。App Router の`app/`配下で構成。     |
| **Server Actions (Controller)** | UI からのリクエスト受付・Service 呼び出し・認証/バリデーション。      |
| **Service（ビジネスロジック）** | アプリの主要ロジック。複数リポジトリや外部 API 統合も担当。           |
| **Domain（ドメインモデル）**    | ビジネスルールを持つデータ構造。`lib/core/domain/`配下で管理。        |
| **Repository（DB 操作）**       | DB や外部サービスとのやりとりを抽象化。`lib/core/repositories/`配下。 |

#### 例：商品取得の流れ

1. `app/products/page.tsx`（UI）が`server actions`を呼び出す
2. `app/products/actions.ts`（Controller）が Service を呼ぶ
3. `lib/core/services/product.service.impl.ts`（Service）がビジネスロジックを実行
4. `lib/core/domain/product.domain.ts`（Domain）がドメインルールを適用
5. `lib/core/repositories/product.repository.impl.ts`（Repository）が DB 操作

### 技術スタック

- **Next.js App Router**（SSR/RSC/Server Actions）
- **TypeScript**（型安全・インターフェース中心）
- **Shadcn UI / Radix UI / Tailwind CSS**（モダン UI/UX）
- **Supabase**（PostgreSQL, Storage, Auth, Edge Functions）
- **Drizzle ORM**（型安全な DB 操作）
- **Stripe**（決済）
- **Jest + Testing Library**（ユニット・結合テスト）
- **Playwright**（E2E テスト）

### テスト・開発運用

- すべてのロジック・コンポーネントは Jest でテストされ、`pnpm test:coverage`でカバレッジを取得
- E2E テストは`e2e/`配下＋ Playwright
- Supabase のローカル開発・マイグレーション・Edge Functions もサポート
- CI/CD は GitHub Actions で自動化

### 設計思想・メリット

- **役割分離**で保守性・テスト容易性・拡張性を最大化
- **UI/ロジック/DB**の独立性により、要件変更や技術選定変更にも柔軟
- **型安全・宣言的 UI**・レスポンシブデザイン・Web Vitals 最適化

---

## 依存性注入（DI）について

本プロジェクトでは、**tsyringe** を用いた依存性注入（DI）コンテナによるサービス・リポジトリの管理を行っています。

- `lib/di/container.ts` で `import { container } from "tsyringe";` を利用し、各サービス・リポジトリ・DB インスタンスをシングルトン/インスタンスとして登録
- 各レイヤー（Service/Repository 等）は直接依存せず、DI コンテナ経由で取得・利用
- テストや拡張時に依存の差し替えが容易

### 例：サービスの取得

```ts
import { getProductService } from "@/lib/di/container";

const productService = getProductService();
```

### DI のメリット

- 実装の差し替えやテストダブルの注入が容易
- 各レイヤーの疎結合化
- 初期化・ライフサイクル管理の一元化

---

## 参考：レイヤー別ファイル配置例

- `app/products/page.tsx` ... UI
- `app/products/actions.ts` ... Server Actions
- `lib/core/services/product.service.impl.ts` ... Service
- `lib/core/domain/product.domain.ts` ... Domain
- `lib/core/repositories/product.repository.impl.ts` ... Repository

## 参考：詳細なディレクトリ構造（`online-shop-template`）

```
.
├── app/
│   ├── products/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── cart/
│   │   └── page.tsx
│   ├── checkout/
│   │   └── page.tsx
│   ├── orders/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   └── products/
│   │       ├── page.tsx
│   │       ├── [id]/
│   │       │   ├── page.tsx
│   │       │   └── edit/
│   │       │       └── page.tsx
│   │       └── new/
│   │           └── page.tsx
│   ├── settings/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── home/
│   │   └── page.tsx
│   ├── actions/
│   │   ├── product.ts
│   │   ├── user.ts
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   ├── payments.ts
│   │   ├── checkout.ts
│   │   ├── auth.ts
│   │   ├── admin-products.ts
│   │   ├── push-subscription.ts
│   │   └── settings.ts
│   └── ...（他ページ・APIルート等）
├── components/
│   └── ...（UIコンポーネント群）
├── lib/
│   ├── core/
│   │   ├── domain/
│   │   │   └── product.domain.ts
│   │   │   └── __tests__/
│   │   │       └── product.service.test.ts
│   │   ├── services/
│   │   │   ├── product.service.impl.ts
│   │   │   └── __tests__/
│   │   │       └── product.service.test.ts
│   │   ├── repositories/
│   │   │   └── product.repository.impl.ts
│   ├── di/
│   │   └── container.ts
│   └── ...（infrastructure, config, shared, utils等）
├── supabase/
│   └── ...（config, functions, seed.sql等）
├── docs/
│   └── ...（設計・要件・PWA等）
└── ...（その他設定ファイル等）
```

---

## 各レイヤーのサンプル実装

### Page (UI) レイヤー

```tsx
// app/products/page.tsx
import { getProducts } from "@/app/actions/product";

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### Server Actions (Controller) レイヤー

```ts
// app/actions/product.ts
"use server";
import { getContainer } from "@/lib/di/container";
import type { IProductService } from "@/lib/core/services/interfaces/product.service.interface";

function getProductService() {
  const container = getContainer();
  return container.resolve<IProductService>("ProductService");
}

export async function getProducts() {
  const productService = getProductService();
  return await productService.findAll();
}
```

### Service（ビジネスロジック）レイヤー

```ts
// lib/core/services/product.service.impl.ts
import { inject, injectable } from "tsyringe";
import type { IProductRepository } from "../repositories/interfaces/product.repository.interface";
import type { IProductService } from "./interfaces/product.service.interface";
import type { Product } from "@/lib/core/domain/product.domain";

@injectable()
export class ProductService implements IProductService {
  constructor(
    @inject("ProductRepository")
    private readonly productRepository: IProductRepository
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }
}
```

### Domain（ドメインモデル）レイヤー

```ts
// lib/core/domain/product.domain.ts
export interface Product {
  id: number;
  name: string;
  price: string;
  // ...他のプロパティ
}
export type CreateProductInput = Pick<Product, "name" | "price">;
```

### Repository（DB 操作）レイヤー

```ts
// lib/core/repositories/product.repository.impl.ts
import { inject, injectable } from "tsyringe";
import type { Database } from "@/lib/infrastructure/db/drizzle";
import { products } from "@/lib/infrastructure/db/schema";
import type { IProductRepository } from "./interfaces/product.repository.interface";
import type { Product } from "@/lib/core/domain/product.domain";

@injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @inject("Database")
    protected readonly db: Database
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.db.select().from(products).execute();
  }
}
```

### DI（依存性注入）レイヤー

```ts
// lib/di/container.ts
import "reflect-metadata";
import { container } from "tsyringe";
import { ProductRepository } from "@/lib/core/repositories/product.repository.impl";
import { ProductService } from "@/lib/core/services/product.service.impl";

container.registerSingleton("ProductRepository", ProductRepository);
container.registerSingleton("ProductService", ProductService);

export { container };
```

---

## テストの書き方例（Jest）

```ts
// lib/core/services/__tests__/product.service.test.ts
import "reflect-metadata";
import { container } from "tsyringe";
import { ProductService } from "../product.service.impl";
import { MockProductRepository } from "@/lib/shared/test-utils/mock-repositories";

describe("ProductService", () => {
  let productService: ProductService;
  let mockProductRepository: MockProductRepository;

  beforeEach(() => {
    mockProductRepository = new MockProductRepository();
    container.register("ProductRepository", {
      useValue: mockProductRepository,
    });
    productService = container.resolve(ProductService);
    jest.clearAllMocks();
  });

  it("should return all products", async () => {
    jest
      .spyOn(mockProductRepository, "findAll")
      .mockResolvedValue([{ id: 1, name: "Test", price: "1000" }]);
    const products = await productService.findAll();
    expect(products).toEqual([{ id: 1, name: "Test", price: "1000" }]);
    expect(mockProductRepository.findAll).toHaveBeenCalled();
  });
});
```

---

## package.json の主な内容

### 主要スクリプト

- `dev` : 開発サーバー起動（Next.js）
- `build` : 本番ビルド
- `start` : 本番サーバー起動
- `local:setup` : 初期セットアップ（.env 生成など）
- `db:reset` : DB スキーマ生成・マイグレーション・シード投入
- `test:unit` : Jest によるユニットテスト＋カバレッジ
- `test:e2e` : Playwright による E2E テスト
- `test:e2e:report` : E2E テストレポート表示

### 主要依存パッケージ

- **Next.js** / **React** / **TypeScript**
- **Drizzle ORM**（DB 操作）
- **Supabase**（BaaS/認証/ストレージ）
- **Stripe**（決済）
- **Shadcn UI** / **Radix UI** / **Tailwind CSS**（UI/スタイリング）
- **tsyringe**（DI コンテナ）
- **Jest** / **Testing Library** / **Playwright**（テスト）
- その他：dotenv, bcrypt, nodemailer, zod, framer-motion など

---

## 用意する環境変数（.env）

`.env.example` を参考に、以下の環境変数を用意してください。

| 変数名                               | 用途                            | 例                                                                   |
| ------------------------------------ | ------------------------------- | -------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`           | Supabase プロジェクト URL       | `"https://xxxx.supabase.co"`                                         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | Supabase 匿名認証キー           | `"your-anon-key"`                                                    |
| `SUPABASE_SERVICE_ROLE_KEY`          | Supabase 管理者権限キー         | `"your-service-role-key"`                                            |
| `NEXT_PUBLIC_STORAGE_URL`            | Supabase ストレージ URL         | `"https://xxxx.supabase.co/storage/v1/s3"`                           |
| `STRIPE_SECRET_KEY`                  | Stripe シークレットキー         | `"sk_test_xxx"`                                                      |
| `STRIPE_WEBHOOK_SECRET`              | Stripe ウェブフックシークレット | `"whsec_xxx"`                                                        |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe 公開キー                 | `"pk_test_xxx"`                                                      |
| `BASE_URL`                           | アプリのベース URL              | `"http://localhost:3000"`                                            |
| `AUTH_SECRET`                        | NextAuth.js 認証用シークレット  | `"32文字以上のランダム文字列"`                                       |
| `NEXTAUTH_SECRET`                    | NextAuth.js 暗号化キー          | `"32文字以上のランダム文字列"`                                       |
| `NEXTAUTH_URL`                       | NextAuth.js のベース URL        | `"http://localhost:3000"`                                            |
| `POSTGRES_URL`                       | PostgreSQL 接続 URL             | `"postgresql://postgres:postgres@localhost:5432/your_database_name"` |

> `.env.example` をコピーして `.env` を作成し、各値を自分の環境に合わせて設定してください。

### Jest + TypeScript + DI(tsyringe)の注意点

- Jest で TypeScript のデコレーター/DI(tsyringe)を使う場合、`ts-jest`と`reflect-metadata`が必須です。
- `tsconfig.json`に以下を追加してください:
  ```json
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true
  ```
- `jest.config.js`例:
  ```js
  module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/$1",
    },
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
    },
    testMatch: [
      "<rootDir>/**/__tests__/**/*.(ts|tsx|js)",
      "<rootDir>/**/*.(spec|test).(ts|tsx|js)",
    ],
  };
  ```
- `reflect-metadata`を依存追加し、テストやエントリポイントで`import "reflect-metadata";`を必ず記述してください。

### Shadcn UI の導入

- Shadcn UI の Button 等を使う場合は
  ```sh
  pnpm dlx shadcn@latest add button
  ```
  で`components/ui/button.tsx`が生成されます。

### テスト実行

- `pnpm test:coverage` でカバレッジ付きテストが実行できます。
- `package.json`の scripts 例:
  ```json
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage"
  }
  ```

### TypeScript のパスエイリアス

- `@/*` のパスエイリアスは `tsconfig.json` の `"paths"` だけでなく、Jest の `moduleNameMapper` でも同様に設定してください

## プロジェクト作成したときに最初にやること

### vercel のプロジェクト紐付け

- vercel link --project myapp-template2

### .env.common でプロジェクト名を修正

### github の環境変数の"Preview"環境を作成

### github で settings の Workflow permissions を"Read and write permissions"に設定する
