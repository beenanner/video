FROM sitespeedio/visualmetrics
MAINTAINER Peter Hedenskog <peter@soulgalore.com>

RUN apt-get update -y && apt-get install -y \
  build-essential \
  ca-certificates \
  curl \
  default-jre-headless \
  gcc \
  --no-install-recommends --force-yes && rm -rf /var/lib/apt/lists/*

# Install nodejs
RUN curl --silent --location https://deb.nodesource.com/setup_4.x | bash -  && \
  apt-get install nodejs -y

# And get Browsertime
RUN npm install https://github.com/tobli/browsertime.git#1_0/prepostscripts -g
# RUN npm install https://github.com/tobli/browsertime.git#1.0 -g

ADD ./scripts/ /home/root/scripts

WORKDIR visualmetrics

CMD ["python", "visualmetrics/visualmetrics.py", "--check"]
