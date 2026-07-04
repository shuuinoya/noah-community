# Noah Community

これは [noah-ikuji](https://noah-ikuji.vercel.app)（本番・夫婦2人専用の育児記録アプリ）を**複製した別アプリ**（育児コミュニティ版）です。本番の夫婦専用記録アプリとは別物であり、別リポジトリ・別Supabaseプロジェクト・別Vercel URLで運用します。noah-ikuji には一切手を加えていません。

「Noah」はヘブライ語で"安らぎ・やすらぎ"を意味します。産後の不安な時期に寄り添い、これひとつで安心できる場所をつくることがこのアプリのミッションです。

> Noah — 産後、これひとつで安心。

**本番URL: https://noah-community.vercel.app**
**Supabaseプロジェクト: `ksmvegwaebllrtejtczk`（Tokyoリージョン）**

## このアプリでできること

- メールアドレスでの会員登録・ログイン（本番で動作確認済み。パスワードは8文字以上・大文字小文字必須、表示/非表示切り替え、設定画面から自分で変更可能）
- Googleログイン（コードは実装済み。Google Cloud側のOAuthクライアント設定が完了するまでボタンは非表示。有効化手順は下記「Google OAuthの設定」参照）
- 言語切替（日本語 / English / Tiếng Việt）— 登録時でも、あとから設定画面でも変更可能
- リアルタイム・スレッド型コミュニティ（つぶやき投稿 → スレッド返信、いいね）
- ログイン画面は noah-ikuji の世界観（NOAHワードマーク＋大きなイタリック見出し＋レターごとに間隔をとったラベル）に合わせたデザイン
- 「Noah公式」アカウントからの歓迎投稿を10件シード済み（ja/en/vi）。ユーザーがまだ少ない立ち上げ期でもタイムラインが空に見えないようにするため

デザイントークン・アイコン・i18nの仕組みは noah-ikuji のコードを流用していますが、育児記録機能（授乳・睡眠・排泄・成長記録など）はこのアプリには含まれていません。このアプリはコミュニティ機能に特化しています。

## 現在の状態（完了済み）

- [x] Supabase プロジェクト作成（Tokyo, ref `ksmvegwaebllrtejtczk`）
- [x] `supabase/migrations/0001_init.sql` 適用済み（テーブル・トリガー・RLS・Realtime publication すべて含む）
- [x] メール認証は有効（デフォルト設定のまま）
- [x] Vercel プロジェクト作成・本番デプロイ済み（https://noah-community.vercel.app）
- [x] Supabase Auth の Site URL / Redirect URLs に本番URLを登録済み
- [ ] Google OAuth（下記「Google OAuthの設定」参照 — クレジットカードが用意でき次第、対応）

以下は、同じ構成を別環境で再現する場合や、Google OAuthを有効化する場合の手順です。

## セットアップ手順（再現用）

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
- `posts` / `replies` の Realtime publication への追加（Dashboardでのトグル操作は不要）

### 4. メール認証の設定

Supabase Dashboard → **Authentication → Providers** で **Email** を有効化してください（デフォルトで有効です）。

Supabase Dashboard → **Authentication → Email Templates** で、確認メール（Confirm signup）とパスワード再設定メール（Reset password）のテンプレートを ja/vi/en 向けに調整してください（Supabaseは1プロジェクトにつき1テンプレートのため、文面はどれか1言語をベースに、必要に応じて多言語混在の文面にするか、Edge Function + カスタムSMTPで言語別送信に拡張できます。今のフェーズでは日本語ベースのデフォルトテンプレートのままで問題ありません）。

**✅ メール送信のレート制限は解消済み**
Supabaseのデフォルトメール送信機能は「テスト用」で、1時間あたり2通という非常に厳しい制限があり（本番運用には非推奨、とSupabase公式が明言）、実際にテスト中この制限にすぐ達して新規登録がブロックされました。現在は Supabase Dashboard → **Authentication → SMTP Settings** で **Gmail (kudaka.1228@gmail.com) をSMTPリレーとして設定済み**です（`smtp.gmail.com:587`、Googleの「アプリパスワード」を使用）。送信元メールアドレスは個人のGmailになるため、本格的に利用者が増えてきたら [Resend](https://resend.com) や [Brevo](https://www.brevo.com) など独自ドメインのSMTPプロバイダへの切り替えを推奨します。

### 5. Google OAuth の設定（現在は未設定・後日対応）

Google Cloud のOAuthクライアント作成自体は無料ですが、初回のGoogleアカウント確認でクレジットカード入力を求められる場合があり、今回はその準備待ちのため保留しています。コード側は実装済みで、`VITE_GOOGLE_LOGIN_ENABLED=true` を設定するだけで「Googleで続ける」ボタンが表示されます。準備ができたら以下を行ってください。

**(a) Google Cloud Console 側**

1. [console.cloud.google.com](https://console.cloud.google.com) で新規プロジェクト（または既存プロジェクト）を開く
2. **APIとサービス → OAuthの同意画面** を設定（External / アプリ名: Noah Community など）
3. **APIとサービス → 認証情報 → 認証情報を作成 → OAuthクライアントID** を作成
   - アプリケーションの種類: ウェブ アプリケーション
   - **承認済みのリダイレクトURI** に、Supabaseのコールバックを追加:
     `https://ksmvegwaebllrtejtczk.supabase.co/auth/v1/callback`
4. 発行された **クライアントID** と **クライアントシークレット** を控える

**(b) Supabase / Vercel 側**

Client ID / Secret が用意できたら、それを渡してください。以下を行います:
- Supabase Management API 経由で Authentication → Providers → Google を有効化し、Client ID/Secretを設定
- Vercel の環境変数 `VITE_GOOGLE_LOGIN_ENABLED` を `true` に設定して再デプロイ

クライアントシークレットは Supabase Dashboard にのみ設定し、コードやリポジトリには絶対に含めません。

### 6. Vercel にデプロイ

新しい Vercel プロジェクトを作成し、この新リポジトリを接続してください（noah-ikuji の既存Vercelプロジェクトとは別プロジェクト）。

### 7. 環境変数を設定

`.env.example` を `.env.local` にコピーし、手順2で作成したSupabaseプロジェクトの値を設定してください:

```bash
cp .env.example .env.local
```

Vercel側にも同じ環境変数（`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, 必要なら `VITE_GOOGLE_LOGIN_ENABLED`）を設定してください。

### 8. 開発サーバー起動

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

- [x] 既存 noah-ikuji.vercel.app は無変更で今まで通り動く（触っていない）
- [x] 複製版が別URLで開き、ヘッダーに「COMMUNITY」バッジと別カラー（ティール）で区別できる
- [x] ロゴ下に副題「産後、これひとつで安心。」が表示される
- [x] メールで新規会員登録できる（名前/メール/国籍/言語）→ profiles 作成（本番で実際にテスト済み）
- [x] 確認メールが届く（本番Supabaseプロジェクトで確認済み）
- [x] パスワード再設定メールが届き、再設定してログインできる（実際のユーザーで確認済み。Gmail SMTPリレー設定後）
- [x] 新規登録の確認メールが届く（Gmail SMTPリレー設定後、実際のユーザーで確認済み）
- [x] タイムラインが空に見えないよう「Noah公式」からの歓迎投稿を10件シード済み
- [ ] Googleログイン/登録ができる（Google Cloud側の設定待ち。準備でき次第対応）
- [ ] Google登録で不足した項目（国籍/言語）をプロフィール補完画面で入力できる（コード実装済み、Google有効化後に確認）
- [x] 登録時に言語を選ばなくても進める（初期値で動く）
- [x] 言語を切り替えるとアプリ内の全テキストが即切り替わる
- [ ] 言語は設定画面からいつでも変更でき、再ログイン後も保持される（コード実装済み、要実機確認）
- [x] タイムラインでつぶやきを投稿でき、別アカウントの画面にリアルタイムで出る（本番で2アカウント間で確認済み）
- [x] 投稿にスレッドで返信でき、返信がリアルタイムで増える（本番で確認済み。返信の投稿者名が表示されないバグを発見・修正済み）
- [x] 返信数・いいねが正しく増減する（本番で確認済み）
- [x] 自分の投稿/返信を削除できる（本番で確認済み）
- [ ] スマホ幅・回転・ブラウザ縮小で崩れない（375px幅のスクリーンショットでは崩れなし。実機での回転は未確認）
- [x] パスワードは8文字以上・大文字小文字混在が必須（本番で確認済み）
- [x] パスワード入力欄に表示/非表示切り替え（目のアイコン）がある
- [x] ログイン後、設定画面から自分でパスワードを変更でき、次回以降は新パスワードでログインできる（本番で確認済み：旧パスワードは拒否、新パスワードでログイン成功）
- [x] 一度登録したメール/パスワードで次回以降もログインできる（Supabase Authの標準動作）
- [x] メール・パスワード欄に適切な autocomplete 属性があり、Chrome等のパスワードマネージャーに保存・自動入力を促せる
- [x] service_role キー・OAuth Secret がクライアントバンドルに含まれない（`npm run build` 後に grep で確認済み）
- [x] `npm run build` が通る

## 今回やらないこと（次フェーズ）

- AIによる投稿前モデレーション（`moderation_status` カラムのみ用意済み）
- 課金/サブスク
- グループ作成・講義機能
- Google以外のSNS連携
- アプリストア配信（まずPWA）
