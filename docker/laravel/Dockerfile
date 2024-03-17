# Utilizamos la imagen oficial de PHP con FPM
FROM php:8.2.17-fpm-alpine3.18

# Instalamos las dependencias necesarias para Laravel
RUN apk update && apk add --no-cache \
    build-base \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    libpng \
    libjpeg \
    freetype \
    zip \
    jpegoptim \
    optipng \
    pngquant \
    gifsicle \
    vim \
    unzip \
    git \
    curl \
    oniguruma-dev \
    libgd

# Clear cache
RUN rm -rf /var/cache/apk/*

# Instalamos extensiones de PHP necesarias para Laravel
RUN docker-php-ext-install pdo_mysql mbstring zip exif pcntl gd

# Instalamos Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

COPY ./laravel .

RUN composer install

COPY ./docker/laravel/default.conf /etc/nginx/conf.d/default.conf

# Verificamos si el grupo www-data ya existe antes de intentar crearlo
RUN getent passwd www-data || adduser -D -u 1000 -S www-data -G www-data

# Copy existing application directory contents
#COPY . /var/www

# Change current user to www
USER www-data

# Expose port 9000 and start php-fpm server
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]