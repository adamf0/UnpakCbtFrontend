# Gunakan image Node.js 22.13.1 dengan Alpine sebagai base image
FROM node:22.13.1-alpine AS build

# Set working directory
WORKDIR /app

# Salin file package.json dan package-lock.json (atau yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin seluruh aplikasi ke dalam container
COPY . .

# Build aplikasi React
RUN npm run build

# Gunakan image Node.js 22.13.1 Alpine untuk menjalankan aplikasi
FROM node:22.13.1-alpine

# Install serve, untuk menjalankan build React secara langsung
RUN npm install -g serve

# Salin hasil build dari tahap sebelumnya
COPY --from=build /app/build /build

# Expose port yang akan digunakan
EXPOSE 3000

# Jalankan aplikasi menggunakan serve
CMD ["serve", "-s", "/build", "-l", "3000"]
