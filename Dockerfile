FROM python:3.13-alpine

RUN apk add --no-cache gettext-envsubst

WORKDIR /website

COPY . .

ENV PORT=8080
ENV API_URL=http://192.168.0.115:8000

CMD ["sh", "-c", "envsubst < js/config.template.js > js/config.js && python -m http.server $PORT"]