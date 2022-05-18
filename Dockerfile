FROM ubuntu:20.04

# Install basic dependencies
RUN apt update && apt dist-upgrade -y
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get -y install tzdata
RUN apt install -y software-properties-common python3-pip curl
RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python3 -

# install requirements
RUN apt install -y libgl1-mesa-dev
COPY poetry.lock ./convolution-demo/
COPY pyproject.toml ./convolution-demo/
ENV PATH="${PATH}:/root/.poetry/bin"
WORKDIR ./convolution-demo
RUN poetry export -f requirements.txt --output requirements.txt
RUN pip3 install -r requirements.txt

# Copy application
COPY static/ ./static
COPY templates/ ./templates
COPY LICENSE ./
COPY main.py ./
RUN ls ./

EXPOSE 8001

# Start
CMD /usr/local/bin/gunicorn --reload --bind 0.0.0.0:8001 main:app