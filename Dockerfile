FROM node:22-alpine

WORKDIR /demoexpress 
#tạo thư mục demoexpress nằm trong container và di chuyển vào thư mục đó làm việc

COPY package*.json . 
#sao chép các file package.json và package-lock.json vào thư mục làm việc

RUN npm install 
#tải các package

COPY . . 
#sao chép toàn bộ mã nguồn vào thư mục làm việc ở WORKDIR

EXPOSE 8000 
#cho mọi người biết rằng ứng dụng sẽ chạy trên cổng 3000
# Ta hiểu rằng khi chạy container thì chương trình trong demoexpress sẽ chạy trên cổng localhost 8000 của container
# Cổng localhost 8000 này khác với cổng localhost 8000 trên máy tính của chúng ta, nó là cổng riêng biệt của thằng container

CMD ["npm", "run", "dev"] 
# #chạy lệnh npm dev khi khởi động container
#Có thể hiểu container giống như 1 phiên bản nhỏ hơn của máy tính ta đang chứa vậy. Máy tính ta có thể chứa nhiều container
#Các container có thể mở các port 3000 8000 gì đó để máy tính ta có thể truy cập vào container đó
