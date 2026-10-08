# BUILD STAGE
FROM oven/bun:1-alpine AS build

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

# Optional: Brevo form URL for the Rature Pro waitlist. Unset, the waitlist is not shown.
ARG VITE_BREVO_FORM_URL=
ENV VITE_BREVO_FORM_URL=$VITE_BREVO_FORM_URL

RUN bunx --bun react-router build

# PRODUCTION STAGE
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build/client /usr/share/nginx/html

EXPOSE 3000

CMD [ "nginx", "-g", "daemon off;" ]
