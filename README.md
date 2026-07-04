# Noah Community

これは [noah-ikuji](https://noah-ikuji.vercel.app)（本番・夫婦2人専用の育児記録アプリ）を**複製した別アプリ**（育児コミュニティ版）です。本番の夫婦専用記録アプリとは別物であり、別リポジトリ・別Supabaseプロジェクト・別Vercel URLで運用します。noah-ikuji には一切手を加えていません。

「Noah」はヘブライ語で"安らぎ・やすらぎ"を意味します。産後の不安な時期に寄り添い、これひとつで安心できる場所をつくることがこのアプリのミッションです。

> Noah — 産後、これひとつで安心。

## このアプリでできること

- Google / メールアドレスでの会員登録・ログイン
- 言語切替（日本語 / English / Tiếng Việt）— 登録時でも、あとから設定画面でも変更可能
- リアルタイム・スレッド型コミュニティ（つぶやき投稿 → スレッド返信、いいね）

デザイントークン・アイコン・i18nの仕組みは noah-ikuji のコードを流用していますが、育児記録機能（授乳・睡眠・排泄・成長記録など）はこのアプリには含まれていません。このアプリはコミュニティ機能に特化しています。

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabase プロジェクトを新規作成

[app.supabase.com](https://app.supabase.com) で新しいプロジェクトを作成してください（リージョン: Tokyo 推奨）。**noah-ikuji が使っている既存のSupabaseプロジェクトとは別の、新しいプロジェクト**を作成すること。

### 3. SQLを実行

Supabase Dashboard → SQL Editor で `supabase/migrations/0001_init.sql` の内容を実行してください。以下が作成されます:

- `profiles` / `posts` / `replies` / `post_likes` テーブル
- 新規ユーザー登録時に `profiles` 行を自動作成するトリガー（`handle_new_user`）
- `reply_count` / `like_count` を自動増減するトリガー
- 全テーブルの Row Level Security（RLS）ポリシー

### 4. Realtime を有効化

Supabase Dashboard → **Database → Replication** で `posts` テーブルと `replies` テーブルの Realtime（INSERT）を有効化してください。これがないと投稿・返信がリアルタイムに表示されません。

### 5. メール認証の設定

Supabase Dashboard → **Authentication → Providers** で **Email** を有効化してください（デフォルトで有効なはずです）。

Supabase Dashboard → **Authentication → Email Templates** で、確認メール（Confirm signup）とパスワード再設定メール（Reset password）のテンプレートを ja/vi/en 向けに調整してください（Supabaseは1プロジェクトにつき1テンプレートのため、文面はどれか1言語をベースに、必要に応じて多言語混在の文面にするか、Edge Function + カスタムSMTPで言語別送信に拡張できます。今回のフェーズでは日本語ベースのテンプレートで問題ありません）。

### 6. Google OAuth の設定

**(a) Google Cloud Console 側**

1. [console.cloud.google.com](https://console.cloud.google.com) で新規プロジェクト（または既存プロジェクト）を開く
2. **APIとサービス → OAuthの同意画面** を設定（External / アプリ名: Noah Community など）
3. **APIとサービス → 認証情報 → 認証情報を作成 → OAuthクライアントID** を作成
   - アプリケーションの種類: ウェブ アプリケーション
   - **承認済みのリダイレクトURI** に、Supabaseが発行するコールバックURLを追加:
     `https://<あなたのSupabaseプロジェクトref>.supabase.co/auth/v1/callback`
     （このURLはSupabase Dashboard → Authentication → Providers → Google の画面に表示されます）
4. 発行された **クライアントID** と **クライアントシークレット** を控える

**(b) Supabase Dashboard 側**

1. **Authentication → Providers → Google** を開く
2. 有効化トグルをON
3. (a)で取得した **Client ID** / **Client Secret** を貼り付けて保存
4. **Authentication → URL Configuration** の **Redirect URLs** に、このアプリのURLを追加:
   `https://<新しいVercel URL>/auth/callback`
   （開発中は `http://localhost:5173/auth/callback` も追加）

クライアントシークレットは Supabase Dashboard にのみ設定し、コードやリポジトリには絶対に含めないでください。

### 7. Vercel にデプロイ

新しい Vercel プロジェクトを作成し、この新リポジトリを接続してください（noah-ikuji の既存Vercelプロジェクトとは別プロジェクト）。

### 8. 環境変数を設定

`.env.example` を `.env.local` にコピーし、手順2で作成したSupabaseプロジェクトの値を設定してください:

```bash
cp .env.example .env.local
```

Vercel側にも同じ環境変数（`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`）を設定してください。

### 9. 開発サーバー起動

```bash
npm run dev
```

## データベーススキーマ（概要）

`supabase/migrations/0001_init.sql` を参照してください。主なテーブル:

| テーブル | 内容 |
|---|---|
| `profiles` | ユーザープロフィール（表示名・国籍・言語） |
| `posts` | タイムラインへの投稿（つぶやき） |
| `replies` | 投稿へのスレッド返信 |
| `post_likes` | 投稿へのいいね |

すべてのテーブルで RLS が有効です。クライアントは `anon` キーのみ使用し、`service_role` キーは一切使用しません。

## 動作確認チェックリスト

- [ ] 既存 noah-ikuji.vercel.app は無変更で今まで通り動く
- [ ] 複製版が別URLで開き、ヘッダーに「COMMUNITY」バッジと別カラー（ティール）で区別できる
- [ ] ロゴ下に副題「産後、これひとつで安心。」が表示される
- [ ] メールで新規会員登録できる（名前/メール/国籍/言語）→ profiles 作成
- [ ] 確認メール・パスワード再設定メールが届く
- [ ] Googleログイン/登録ができる
- [ ] Google登録で不足した項目（国籍/言語）をプロフィール補完画面で入力できる
- [ ] 登録時に言語を選ばなくても進める（初期値で動く）
- [ ] 言語を切り替えるとアプリ内の全テキストが即切り替わる
- [ ] 言語は設定画面からいつでも変更でき、再ログイン後も保持される
- [ ] タイムラインでつぶやきを投稿でき、別アカウントの画面にリアルタイムで出る
- [ ] 投稿にスレッドで返信でき、返信がリアルタイムで増える
- [ ] 返信数・いいねが正しく増減する
- [ ] 自分の投稿/返信を削除できる
- [ ] スマホ幅・回転・ブラウザ縮小で崩れない
- [ ] service_role キー・OAuth Secret がクライアントバンドルに含まれない（`npm run build` 後に grep で確認）
- [ ] `npm run build` が通る

## 今回やらないこと（次フェーズ）

- AIによる投稿前モデレーション（`moderation_status` カラムのみ用意済み）
- 課金/サブスク
- グループ作成・講義機能
- Google以外のSNS連携
- アプリストア配信（まずPWA）
