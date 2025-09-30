# FROM node:20
# WORKDIR /app-milktea

# COPY package*.json ./
# RUN npm ci

# COPY . .

# ENV CHOKIDAR_USEPOLLING=true
# ENV WATCHPACK_POLLING=true

# EXPOSE 5173

# CMD ["npm", "run", "dev"]


# Dockerfile
FROM node:20

# Tạo thư mục làm việc và thay đổi owner thành node
WORKDIR /app-milktea
RUN chown -R node:node /app-milktea

# Copy package file và cài đặt node_modules
COPY package*.json ./
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Thiết lập biến môi trường
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# Expose cổng dev server
EXPOSE 5173

# Chạy lệnh với user node
USER node

# Lệnh khởi động
CMD [ "npm", "run", "dev", "--", "--host" ]

