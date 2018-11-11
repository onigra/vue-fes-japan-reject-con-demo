# Identiry Provider Keycloakの紹介と、それを用いたNuxt.jsでのOpenID Connect認証機能の実装

Vue Fes Japan 2018 Reject Conference
2018/11/11
@onigra_

# この話をしようと思ったきっかけ

今日この話をしようと思ったきっかけというのが、今プロジェクトで作っているアプリケーションが、  
フロントエンドはNuxt、サーバサイドのAPIにKotlin(Spring Boot)という、  
いわゆるフロントエンドとサーバアプリケーションが分離した、  
今Webアプリケーションを新規に作るのであれば、こういう構成にしたくなるよねという構成で考えていました。

# 認証処理、自分で作ってますか？

で、認証が必要になるんですけど、今時、認証って自分で作りたくないじゃないですか。  
ここに来るような方々だったら、認証処理を作る時に、サードパーティのサービスを利用することをまず考えることが多いんじゃないでしょうか？

# 認証を機能を提供するクラウドサービスの登場

- Firebase Authentication
- Google OpenID
- Auth0
- Okta
- Authlete
- Amazon Cognito

最近だとこんな感じの、認証機能を提供するサードパーティのクラウドサービスがあって、サインアップと認証を外部に移譲することができます。

# Firebase Authentication

この場にいるみなさんなら、Firebaseは触ったことがある方も多いんじゃないでしょうか。  
使ったことが無い方向けに説明すると、Firebaseの機能の中に、Firebase Authenticationってのがあって、これはすごい便利で、  
設定してSDKをドキュメント通りに呼び出すだけで、サクッとサインアップとログインフォームができる君なんですね。  
サインアップしたユーザーは、Firebase Authenticationのコンソールで管理ができます。

# 便利最高！

これめっちゃ便利じゃないですか。さっき出した他のAuth0とかOktaとかもだいたい同じ感じで、アカウント作ってコンソールで設定して  
SDK呼ぶだけで似たような感じになってて、便利最高みたいな感じなんですよね。

# 便利最高なんだけど...

でも一方で、いい感じにされすぎてて、ただSDK使ってるだけだと、どういう仕組みになってるのかがよく見えないんですよね。  
もちろん抽象化のレベルが高くなってて、内部を意識しなくていいというのは歓迎すべきことで、どんどんそうなっていくのはいいことなんですが、  
なんとなくで使ってて、どういった技術が使われてるのかご存知ない方も結構いらっしゃるんじゃないでしょうか。  
そう思って、この話をしようと思いました。

# OpenID Connect

- https://openid.net/
- https://openid-foundation-japan.github.io/openid-connect-core-1_0.ja.html

結論から言うと、Firebase AuthはOpenID Connectという認証のプロトコルが使われています。  
Firebase AuthはOpenID Connectの仕様に乗っ取って、サインアップとログインの機能の提供と、Identity情報の管理、そしてID Tokenの発行を行ってます。  
こういった役割を行うサーバを、Identity Providerと言います。

# ID Token

ID Tokenは、認証の結果発行されるトークンで、Identity Providerが発行したID Tokenを、Identity Providerと連携するアプリケーション、OpenID Connectの用語で言うとRelying Partyが、
それぞれ検証(Verify)することによって、認証チェックを実現してるんですね。  
ID TokenはJWTで配布されて、大体Relying Party用にSDKが用意されてて、Verifyの機能も用意されてて検証も簡単！みたいな感じになってます。

# 認証を機能を提供するクラウドサービスの登場

- Firebase Authentication
- Google OpenID
- Auth0
- Okta
- Authlete
- Amazon Cognito

先ほど出したこれらのクラウドサービスは、全てOpenID Connectが使われています。  
サービスによっては、独自の拡張が行われてたりするんですが、基本的にはOpenID Connectの仕様に則ってます。

# 外部Identity Providerとの連携と、認証の仲介(Identity Brokering)

Firebase AuthにはFirebase Authが提供するメールアドレスとパスワードによる認証が提供されてるんですが、  
ログインのプロバイダを外部サービスに仲介することもできます。  
これをIdentity Brokeringと言います。

# 認証を外部サービスに任せる

- Twitter
- Google
- Facebook
- GitHub
- Other...

これらは、Identity Provider、ここで言うFirebase AuthをOAuth2のResource Serverとして、これらの外部サービスをResource Ownerとして活用できるわけです。  
FirebaseはGoogleのサービスなので、Googleとの連携はかなり簡単にできます。

# Identity Providerでは、Identity Provider内で必要な情報だけを管理

Firebase AuthではemailがResource Ownerからの情報として取得され、それとは別にFirebase Authだけで管理するユーザーの識別子が保存されます。  
Identity FederationはIdentity Providerの機能として提供されるものなので、Auth0やOktaなども提供しています。

# 便利最高！

ざっくりだけど、こんな感じで認証機能の移譲と、Identityの管理が行えます。  
Identity Provider as a Serviceっていうのはめっちゃ便利なやつなんですよ。

# しかし

# Identity Provider as a Serviceはお高め

- 1 Active Userあたりの価格
- Okta: $2
- Auth0: $7
- Firebase Auth: 無料！！！！？？？？

これらのサービスって結構お高くて、Firebase Authはちょっと置いといて、商用利用の場合、Oktaが1ユーザーあたり$2、Auth0に至っては1ユーザーあたり7$かかるんですよね。  
Auth0なんかはすごくよくできたサービスだと思いますし、高機能なんですけど、まあちょっとスタートアップみたいなステージで使うのはちょっと腰が引けるんですよね。  
Firebase Authが無料なのはちょっとよくわかんないっすね。まあその分機能はやっぱり少ないんですけど。

# 自前で立てる選択肢

で、まあ当たり前なんですけど、詳細は言及できないんですが、独自の要件があると自前で立てざるを得ないですよね。  
今回のプロジェクトではIdentity Providerを自前で立てることにしました。

# 自分で立てるぞ！

- https://openid.net/certification/

で、自分でOpenID Connectのプロバイダを立てる時に、どこから探せばいいのかというと、OpenID FoundationのホームページにOpenID Certificationっていうページがあって、  
OpenID Foundationが認定したProviderやクライアントのライブラリの名前とリンクがあります。  
基本的に、OpenID Connect周りのライブラリを選ぶ時は、ここから探した方がいいですね。  
今回はこの中から、Keycloakというプロダクトを選択しました。

# Keycloak

- Java
- 機能がとにかく豊富
- Admin Webコンソール
- Web API
- CLI
- JavaScript Clientがついてる
- コンソールからのセッションオフ機能！！

ここでやっとタイトルのKeycloakの名前がでてきます。  
選定と検証を行ったのは同僚なんですが、今回はKeycloakというIdentity Providerを選びました。  
KeycloakはJavaで書かれたIdentity Providerで、特徴はとにかく機能が豊富なことですね。  
コンソールとかWeb APIは当然ついてますし、Identity Brokeringのサービスの種類も豊富ですし、サービスごとにID Tokenのカスタマイズなんかもできます。  
弊社新し目のプロジェクトだと、サーバサイドにKotlinが結構使われるんですが、それはJVM言語に慣れた人が結構いるからというのもあって、というのも理由の一つですね。  
個人的には、Webコンソールからユーザーセッション切ることができるのが、仮にトークン漏れた時の対策として便利なんですよね。  
欠点は大きなプロダクトなので、小さなプロジェクトだとオーバーキルになりがちな所ですね。

# 第一部 Identity Provider編 ~完~

はい、ここまででやっとOpenID ConnectとIdentity Providerの簡単な説明が終わりました。

# 第二部 Keycloak編

ここからやっとタイトルのNuxtからKeycloakを使う話に入っていきます。

# Keycloak JavaScript Adapter

- http://localhost:8080/auth/js/keycloak.js
- https://github.com/keycloak/keycloak-js-bower
- https://github.com/crisbal/vue-keycloak

で、NuxtからKeycloakどうやって使うかなんですが、KeycloakにはJavaScript Adapterっていうクライアントがあって、  
Keycloakサーバが提供しているので、サーバ立ててGETすれば降ってくるんですよ。  
それをそのまま使うこともできるんですけど、当然npmモジュールも提供されてて、さらにそれをVueのプラグインにしてくれてるモジュールも存在するんですよね。

# 便利最高！

便利じゃんこれでいいじゃんってなって使おうとするんですが、結論から言うとVue.jsで使うのは断念しました。

# Vue.jsのライフサイクルと噛み合わない

なんでかを一言で言うと、Vue.jsのライフサイクルと噛み合わないからで、まずはそこから解説します。

# Implicit Flow

https://onigra.github.io/blog/2018/02/25/kc-with-webapi/

通常Identity Providerと連携して、サーバサイドアプリケーションと分離されたJavaScript Clientが  
APIサーバに対して認証付きリクエストをする場合、JavaScript ClientはImplicit Flowというフローを使用して、Identity ProviderからID TokenとAccess Tokenを発行します。  
Im$plicit Flowはモバイルアプリなんかでも通常使われるフローですね。  
以降、KeycloakのNode JSのアダプターの仕様に則り、Access Tokenを Authrization: Bearer ヘッダに入れてAPIサーバにリクエストを投げて、APIサーバはTokenを検証して、認証を行うというフローを前提に話を進めます。

# AdapterからAccess Tokenは取り出せるが...

認証後、Access Tokenはkeycloakという変数に保持されてるんですが、  
scriptタグの中で変数keycloakにアクセスできないんです。  
要はmountedとかasyncDataとかmethod中で呼び出すとundefinedが帰って来るんですよね。  
ページ表示するときに認証が必要なエンドポイント叩いてfetchしてレンダリングとかしたくても、adapterの実装の都合上、そのタイミングではkeycloakオブジェクトが生成されてなくて、  
Access Tokenを取り出せないんですよ。

# 別のOIDC Clientを使う

- https://github.com/IdentityModel/oidc-client-js

というわけで、Keycloakが提供しているアダプタは諦めて、他のOIDC Clientを使います。  
先ほど言及した、OpenID Certificationのページにはクライアントも載っているので、ここから探します。  
ブラウザJavaScript用のクライアントはoidc-client-jsというのがあるので、これを使います。

# 実装例

- サンプルコード

# 問題: Signupが無い

これでLoginはなんとかなったんですが、oidc-client-jsにはサインアップのページに直接行く関数が無いんですね。  
keycloakのjs clientには、signupのurlの文字列を返す関数ががあるんですよ。

# 作った

- https://github.com/onigra/keycloak-signup-url

なので、それの実装を参考にして、どういうURLが作成されるのかを解析して、別でつくりました。  
keycloakにはrealmというOpenIDの名前空間的な概念があって、それがURLの中に含まれるので、それを考慮してURLを組み立てる必要があります。  
これはnpm moduleにして、公開しています。

# Signupも用意した例

- サンプルコード

# Access Tokenの有効期限

一般的にID ProviderはAccess Tokenにはセキュリティ向上のために、有効期限が設定されます。  
Keycloakだとデフォルトで15分になってます。  
セキュアになる一方で、有効期限が切れてしまった場合に、再度ログインしなおさなければいけなくなるので、ユーザー体験の低下につながります。  
それを回避するためによく使われる、Silent Refreshという手法について紹介します。

# Silent Refresh

- サンプルコード&demo

これがどういう技術かというと、見えないiframeが仕込まれて、このiframeの中でAccess Tokenの有効期間が切れると、ID ProviderにTokenを更新しに行くJavaScriptが仕込まれています。  
oidc-client-jsはSilent Refresh機能が用意されてるので、Configでオンにすれば仕込まれます。  
ちなみに、keycloakのJSのクライアントにもSilent Refreshは仕込まれてました。  
用意されてる機能としては十分なので、そのまま使えないのは結構もったいないんですよね。  
こんな感じで、クライアントにiframeが仕込まれて、ちゃんと動いてると自動的にtokenを更新しにいってます。

# axiosでのAPIリクエストの際に、必ずAuthorizationヘッダを設定する

APIリクエストの際に使うHTTPクライアントは定番のaxiosを使うわけなんですけど、色々呼び出してる所に都度Authorizationヘッダを仕込む記述を書くのはスマートじゃありません。  
こういった処理を共通化したい場合、axiosのInterceptorsという機能を使うと便利です。

# Interceptors

- https://github.com/axios/axios#interceptors

Interceptor、Javaやってる方には割と馴染みの深い単語だと思うんですけど、アスペクト指向プログラミングからきてる呼び名で、  
簡単に言うと特定の処理に対して割り込んで処理を差し込む処理的な意味で使われる単語ですね。  
これを使うと、いい感じに書けます。

# Interceptorsを使った記述

- サンプルコード&demo

こんな感じで書いておくと、httpリクエスト投げる際に都度ヘッダを指定してくれます。  
Access Tokenは設定でWeb StorageかCookieに保持できるので、都度取り出して渡すようにしてます。

# リダイレクト問題

これは、Nuxt.jsでmiddlewareで認証チェックを使った際に起こる問題です。  
例えばmiddlewareでWeb StorageかCookieにTokenが無い時にログインしていないとみなして、  
ログイン必須なページにアクセスするとログイン画面にリダイレクトするという処理を行なった場合、  
ページが一瞬表示されちゃうという現象が発生します。

# 解決策

- サンプルコード
- https://www.yo1000.com/posts/2018-05-26-nuxt-spa-redirect.html

これは、oidc-client-jsの signinRedirect() を呼び出した後に、Promiseオブジェクトをreturnしてあげることで解消できます。  
この現象に嵌った時に、同僚が一緒に調査してくれて、詳細がブログにまとまってます。

# こんな感じで

Nuxt.jsではKeycloakをIdentity Providerにして、OpenID Connectを使った認証を実装することができます。  
OIDCは正直結構難しくて、どこまでがOIDCで、どこまでがOAuth2なのかとか、どこまでが認証でどこまでが認可なのかが混同しやすいと感じます。  
たぶんみんな難しいと感じるので、難しいと感じても、落ち込まないでいいと思います。  
僕もいまだにどうなんだっけ？とわからなくなることがあるので、まずは便利なFirebase Authでは、OpenID Connectが使われてるというのを知れた方がいらっしゃったら、  
僕はこの発表をしてよかったなと感じます。  
また、難しいからこそ、Firebase AuthやAuth0、OktaやKeycloakが提供している機能やSDKが簡単に利用できることを考えると、改めて優れたサービスだと感じることができると思います。

# まとめ1

- Firebase Auth, Auth0, OktaなどのIdentity Provider as a Serviceには、OpenID Connectが使われている
- OpenID Connectはやや難しい
- 難しさがSDKにうまく隠蔽されている
- 意識しなくていいのは良いし、そうあるべきだが、どういった仕組みを用いてるのかを知りたい時は、oidc-client-jsを使ってみると理解がしやすい

# まとめ2

- KeycloakというIdentity Providerがある
- 機能が豊富で便利
- 自分で立てるなら有力な選択肢
- プラットフォームを構想してるならおすすめ
- 単に認証だけ入れたいみたいなシンプルな要件だとオーバーキル気味

例えばIdentity Providerを軸にしたプラットフォームの構想があったり、自社サービスをIdentity Brokeringできるようにしたり、  
自社サービスをResource OwnerとしたAPIを提供したりみたいな。

# その他

- https://jwt.io/
  - jwtのデコードと検証ができるサイト
- https://openidconnect.net/
  - OpenID Connectの認証ステップを試せるサイト

