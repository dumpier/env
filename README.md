# env
## docker環境一覧
- nginx(proxy) + php-apache(7.4, 8.2)
- apache + php-fpm(7.4, 8.2)
- nginx + nodejs + express
- nginx + php-fpm(5.6, 7.4, 8.2) + mysql + redis + mailhog
- nginx conf

## メモ書き
- nginx.conf
  - `sendfile on;`にするとvagrant環境ではよく`net::ERR_CONTENT_LENGTH_MISMATCH 200 (OK)`が出るので`sendfile off;`するといい
- phpとcomposerバージョン
  - php7.2以下の場合、composer2.2.17
    - `COPY --from=composer:2.2.17 /usr/bin/composer /usr/bin/composer`
  - php7.3以上の場合、composerは最新
    - `COPY --from=composer:latest /usr/bin/composer /usr/bin/composer`

