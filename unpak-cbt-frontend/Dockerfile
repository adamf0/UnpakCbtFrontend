# Gunakan Ubuntu terbaru sebagai base image
FROM ubuntu:latest AS base

# Perbarui package list, upgrade semua package, install curl, lalu bersihkan cache
RUN apt update && apt upgrade -y && apt install -y curl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Tambahkan repository NodeSource dan instal Node.js 22.13.1 secara spesifik
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt install -y nodejs=22.13.1-1nodesource1 && \
    apt clean && rm -rf /var/lib/apt/lists/*

# Verifikasi versi Node.js & npm
RUN node -v && npm -v

# Tahap build aplikasi React
FROM base AS builder
WORKDIR /app

# Salin package.json dan package-lock.json lalu install dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev --no-cache

# Salin semua file dan build aplikasi
COPY . .
RUN npm run build

# Gunakan tahap runtime dengan Ubuntu ringan
FROM base AS runtime
WORKDIR /app

# Install 'serve' untuk menjalankan aplikasi React
RUN npm install -g serve --omit=dev --no-cache

# Salin hasil build dari tahap builder
COPY --from=builder /app/build /app/build

# Expose port 3000
EXPOSE 3000

# Jalankan aplikasi menggunakan serve
CMD ["serve", "-s", "build", "-l", "3000"]
