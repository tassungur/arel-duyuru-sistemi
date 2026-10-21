FROM node:22-alpine AS quality-check
WORKDIR /app
COPY package.json ./
RUN npm install --ignore-scripts
COPY . ./
ARG COMMIT_SHA=local
ARG AREL_INSPECT_URL=https://api.staging.arel.edu.tr/api/v1/devkit/inspect
ENV COMMIT_SHA=${COMMIT_SHA}
ENV AREL_INSPECT_URL=${AREL_INSPECT_URL}
RUN npm run typecheck && npm run lint && npm run build

FROM nginx:alpine AS final
RUN printf 'server {\n  listen 80;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf
COPY --from=quality-check /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
