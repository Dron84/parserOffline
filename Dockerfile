FROM dron84/alpine-vue-cli-node-sass
RUN apk add --update npm python python3
# COPY . /server
# RUN cd /server/client && npm install && npm run build
# RUN cd /server && npm install
WORKDIR /server
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]