# FROM node:22.16.0 

# WORKDIR /demoexpress 
# #tạo thư mục demoexpress và di chuyển vào thư mục đó làm việc

# COPY package*.json . 
# #sao chép các file package.json và package-lock.json vào thư mục làm việc

# RUN npm install 
# #tải các package

# COPY . . 
# #sao chép toàn bộ mã nguồn vào thư mục làm việc ở WORKDIR

# EXPOSE 8000 
# #cho mọi người biết rằng ứng dụng sẽ chạy trên cổng 3000

# CMD ["npm", "run", "dev"] 
# #chạy lệnh npm dev khi khởi động container

FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --production
EXPOSE 8000
CMD ["node", "main.js"]