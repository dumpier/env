FROM almalinux
RUN dnf -y upgrade

# RUN dnf install -y https://rpms.remirepo.net/enterprise/remi-release-7.rpm
# RUN dnf module enable php:remi-7.4 -y
# RUN dnf install -y https://rpms.remirepo.net/enterprise/remi-release-8.rpm
# RUN dnf module enable php:remi-8.2 -y

RUN dnf install -y httpd
RUN systemctl enable httpd

CMD httpd -D FOREGROUND