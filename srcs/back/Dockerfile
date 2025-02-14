FROM denoland/deno:debian-2.1.10 AS builder
WORKDIR /app
COPY ./hono/ .

# コンパイル時に出力ファイル名を明示的に指定
RUN deno compile --allow-net --allow-read --allow-write --allow-env --output server main.ts


# 実行ステージ
FROM debian:stable-slim

# 必要なパッケージのインストールとクリーンアップ
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# セキュリティのために非root ユーザーを作成
RUN useradd -m appuser

# 作業ディレクトリを設定
WORKDIR /app


# 画像アップロード用ディレクトリの作成
RUN mkdir -p /home/appuser/uploads/images1 && \
    mkdir -p /home/appuser/uploads/images2 && \
    mkdir -p /home/appuser/uploads/images3 && \
    mkdir -p /home/appuser/uploads/images4 && \
    mkdir -p /home/appuser/uploads/images5 && \
    mkdir -p /home/appuser/uploads/default_image && \
    chown -R appuser:appuser /home/appuser/uploads

# ビルドステージからバイナリをコピー（ファイル名を明示的に指定）
COPY --from=builder /app/server ./server

# デフォルト画像のコピー
COPY ./default_image/napoleon.png /home/appuser/uploads/default_image/
COPY ./default_image/male[1-5].png /home/appuser/uploads/images1/
COPY ./default_image/female[1-5].png /home/appuser/uploads/images1/



# 非root ユーザーに切り替え
USER appuser


EXPOSE 8000

# コンテナ起動時に実行されるコマンド
CMD ["./server"]