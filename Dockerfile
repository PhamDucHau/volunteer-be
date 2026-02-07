# Sử dụng Node.js base image
FROM node:20 AS build

# Thiết lập thư mục làm việc trong container
WORKDIR /usr/src/app

# Copy package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt dependencies
RUN yarn install

# Copy toàn bộ code của ứng dụng vào container
COPY . .

# Tăng heap memory limit cho Node.js để tránh lỗi out of memory khi build
ENV NODE_OPTIONS=--max-old-space-size=4096

# Build ứng dụng NestJS
RUN yarn run build

# Expose port 3000 để có thể truy cập từ bên ngoài
EXPOSE 3000

# Khởi chạy ứng dụng
CMD ["yarn", "run", "start:prod"]