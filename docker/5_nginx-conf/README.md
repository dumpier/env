# Ningx設定
## ドキュメント
- `en` https://nginx.org/en/docs/http/ngx_http_core_module.html
  - `変数` https://nginx.org/en/docs/http/ngx_http_core_module.html#variables
- `ja` https://mogile.web.fc2.com/nginx/
  - https://mogile.web.fc2.com/nginx/http/
  - `http core` https://mogile.web.fc2.com/nginx/http/ngx_http_core_module.html

## よく使う
<details><summary>ディレクティブと変数一覧</summary>

- http
- server
- listen
- server_name
- root
- index
- location
  - try_files
  - rewrite
  - fastcgi
  - fastcgi_pass
  - fastcgi_index
  - fastcgi_param
    - include fastcgi_params
- 変数 https://nginx.org/en/docs/http/ngx_http_core_module.html#variables
  - $document_root
  - $fastcgi_script_name
  - $request_filename
</details>

<details><summary>負荷分散</summary>

- 負荷分散方式
  - 静的分散方式
    - `ラウンドロビン(round robin)` 分散対象サーバに均等にリクエストを振り分ける方式
    - `静的な重み付きラウンドロビン`
  - 動的分散方式
    - `least connected`
- Nginxの負荷分散方式
  - `Round robin`: `proxy_pass`
  - `Least connected`: `upstream`
    - `ip-hash` `sticky`, `persistent`: 同じクライアントからのリクエストを同じサーバーに送る
    - `weight` 重み付けロードバランサー
    - `in-band` ヘルスチェック
</details>


## サンプル
- locationの優先順位
  - 完全一致(=)
  - 前方一致(^~)
  - 正規表現(~)
  - 正規表現(~*)
  - 前方一致(なし)

<details><summary>php-fpm設定</summary>

```
index index.php index.html;

location / {
    try_files $uri $uri/ /index.php$is_args$args;
}

location ~ \.php$ {
    try_files $uri @to_phpfile;

    fastcgi_pass php8.2-fpm:9000;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    fastcgi_param FUEL_ENV local;
    include fastcgi_params;
}

location @to_phpfile { rewrite ^(.+)\.php$ $1 last; }
```
</details>

<details><summary>node.js設定</summary>

```
location / {
    # websocketを使う場合の設定
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 600;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Server $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass http://node:3000/;
}
```
</details>

<details><summary>rewrite設定</summary>

```
index index.php index.html;

# 拡張子がhtmlの場合、ファイルが見つからない場合htmlフォルダ配下で探す
location ~ \.html$ {
  try_files $uri @to_static_html;
}
location @to_static_html {
  rewrite ^(^.+)\.(.+)$ /html/$1.$2 last;
}

# 拡張子がhtmlの場合、ファイルが見つからない場合htmlフォルダ配下で探す
location ~ \.(jpg|jpeg|png|js|css)$ {
  try_files $uri @to_static_res;
}
location @to_static_res {
  rewrite ^(^.+)\.(.+)$ /res/$1.$2 last;
}
```
</details>

<details><summary>前方一致(^~)</summary>

```
# 先頭が/common/の場合、html/commonを参照
location ^~ /common/ {
    alias /var/www/html/code/php/site-1/public/html/common/;
}
# 先頭が/static/の場合、html/staticを参照
location ^~ /static/ {
    root /var/www/html/code/php/site-1/public/html;
}
```
</details>
