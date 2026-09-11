FROM python:3.13-alpine

RUN apk add --no-cache gettext-envsubst

WORKDIR /website

COPY . .

CMD ["sh", "-c", "envsubst < js/config.template.js > js/config.js && python -m http.server 8000"]